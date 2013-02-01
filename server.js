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

// Initiate server
// Request from the client
// Response from the server
http.createServer(function (request, response) {
	console.log('Request: ' + request.url);
	
	// Find the full path of the filename
	var uri = url.parse(request.url).pathname, 
		filename = path.join(process.cwd(), uri),
		received_data = '',
		POST = '',
		node = null;

	// Client submits topic or comment
	if (request.method === 'POST') {
        
		// Receive the building blocks for the node from the client
        request.on('data', function (data) {
            received_data += data;
        });
        // Build and store the node. Send the constructed node to the client
        request.on('end', function () {
            POST = qs.parse(received_data);
            console.log('Here is what the server got ' + JSON.stringify(POST));

            // Create the node
            insertTopic("topic", POST["title"], POST["url"])

            // Respond to client. Will trigger success callback on topics.js ajax call
            // The client is expecting this content type, it MUST match
			response.writeHead(200, {"content-type": "application/json"});

			// Send the newest node
			response.end(JSON.stringify(nodes[nodes.length - 1]));

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
				console.log('API Call!');

				// GET STUFF...

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

	// return;
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
 *
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

function insertComment(type, content, root) {
	var node = {};
	
	node.type = type;
	node.content = content;
	node.vote_count = 0;
	node.id = nodes.length;
	node.children_ids = [];
	node.root_id = root;

	nodes.push(node);
}

function insertTopic(type, description, link) {
	var node = {};
	
	node.type = type;
	node.content = description;
	node.vote_count = 0;
	node.comment_count = 0;
	node.id = nodes.length;
	node.children_ids = [];
	node.link = link
	
	nodes.push(node);
}

function upvote(id) {
	var comment = nodes[id], root;

	if (comment.type !=  "comment") {
		console.log("Tried to upvote a non-comment node.");
		return false;
	}
	comment.vote_count++;
	root = nodes[comment.root_id];
	root.vote_count++;
}
