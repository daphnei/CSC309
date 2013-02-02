http = require('http');
fs = require('fs');
path = require('path');
url = require('url');
qs = require('querystring');

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain'
};

// All topics and comments
var nodes = [];

// Initiate server, request from the client and response from the server
http.createServer(function (request, response) {
	console.log('Request: ' + request.url);
	
	var uri = url.parse(request.url).pathname, 		// Find the full path ...
		filename = path.join(process.cwd(), uri), 	// ... of the filename
		received_data = '', 						// Aggregated received data from client
		POST = '', 									// Final form of received data
		node_id,									// The node_id from the url request
		node = null; 								// The resulting node from received data

	// Client submits topic or comment
	if (request.method === 'POST') {
        
		// Receive the building blocks for the node from the client
        request.on('data', function (data) {
            received_data += data;
        });
        // Build and store the node. Send the constructed node to the client
        request.on('end', function () {

        	// Topic submission
            POST = qs.parse(received_data);
            console.log('Here is what the server got ' + JSON.stringify(POST));

            // Create the node
            insert_topic("topic", POST["title"], POST["url"])

            // Respond to client. Will trigger success callback on topics.js ajax call
            // The client is expecting this content type, it MUST match
			response.writeHead(200, {"content-type": "application/json"});

			// Send the newest node
			response.end(JSON.stringify(nodes[nodes.length - 1]));

			// Comment submission

        }); // POST is out of scope
	} 

	// Client requests topic, comment or files that construct the frontend
	else if(request.method === 'GET') {

		// Check what kind of GET request
		fs.exists(filename, function(exists) {

			// The html head file exists
			if(exists) {
				serve_file(filename, response);
			} 
			// An API call determined by URL
			else if (is_api_call(request.url)) {

				// DEBUG:
				console.log('API Call: ' + request.url);

				// The node which the client is interested in
				node_id = request.url.charAt(request.url.length - 1);

				// node = find_node(node_id);

				response.writeHead(200, {"content-type": "application/json"});
				response.end(JSON.stringify({
					comment_count:0,
					content:"Sup son",
					id:"9000"}));
				// response.end(JSON.stringify(JSON.stringify(node)));
			}
			// Not an API call and not an existant file
			else {
				response.writeHead(404, {'content-type': MIME_TYPES['.txt'] });
				response.write("404 Not Found\n");
				response.end();
			}
		});
	} 
	// Error
	else {
		response.writeHead(500, MIME_TYPES['.txt']);
		response.end("Error");
	}
}).listen(4000);


/**
 * Verify if the url matches the form of the RESTful API
 *
 * @param {String} url Request url from client
 *
 * @return {Boolean} true if matches API, false otherwise
 */
function is_api_call(url) {
	var n = url.charAt(url.length - 1),
		condition = false;

	if(url === '/topic/submit' || url === '/topic?id=' + n || url === '/reply?pID=' + n){
		condition = true;
	}
	return condition;
}

/**
 * Serve the files that the client requests
 *
 * @param {String} filename Name of file in server
 * @param {Object} response The server's response to the client
 */
function serve_file(filename, response){
	var headers = {},
		content_type = '';

	// index.html and '/' are aliases of one another
	if (fs.statSync(filename).isDirectory()) {
		filename += '/index.html';
	}
	// Serve the file
	fs.readFile(filename, "binary", function(err, file) {
		if(err) {        
			response.writeHead(500, {"content-type": MIME_TYPES['.txt']});
			response.write(err + "\n");
			response.end();
			return;
		}
		// Pick the file's content type
		content_type = MIME_TYPES[path.extname(filename)];

		// Place the content type into the header
		if (content_type) {
			headers["content-type"] = content_type;
		}
		// Send correct header and file to client
		response.writeHead(200, headers);
		response.write(file, "binary");
		response.end();
	});
}

/**
 * Add a new comment node to all the nodes
 *
 * @param {String} type
 * @param {String} content
 * @param {String} root
 */
function insertComment(type, content, root) {
	var new_node = {};
	
	new_node.type = type;
	new_node.content = content;
	new_node.vote_count = 0;
	new_node.id = nodes.length;
	new_node.children_ids = [];
	new_node.root_id = root;

	nodes.push(new_node);
}

/**
 * Add a new topic node to all the nodes
 *
 * @param {String} type
 * @param {String} description
 * @param {String} link
 */
function insert_topic(type, description, link) {
	var new_node = {};
	
	new_node.type = type;
	new_node.content = description;
	new_node.vote_count = 0;
	new_node.comment_count = 0;
	new_node.id = nodes.length;
	new_node.children_ids = [];
	new_node.link = link
	
	nodes.push(new_node);
}

/**
 * Upvote the comment
 *
 * @param {String} id The id of the upvoted comment
 */
function upvote(id) {
	var comment = nodes[id], 
		root;

	if (comment.type !=  "comment") {
		console.log("Tried to upvote a non-comment node.");
		return false;
	}

	comment.vote_count = comment.vote_count + 1;
	root = nodes[comment.root_id];
	root.vote_count = root.vote_count + 1;
}
