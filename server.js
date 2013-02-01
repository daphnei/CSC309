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
		POST = '';

	// Client submits topic or comment
	if (request.method === 'POST') {
        request.on('data', function (data) {
            received_data += data;
        });

        request.on('end', function () {
            POST = qs.parse(received_data);
            console.log('Here is what the server got ' + JSON.stringify(POST));

            // CREATE THE NODE

            // STORE THE NODE

        }); 
        // POST IS OUT OF RANGE
	} 

	// Client requests topic or comment or asking for the files that construct the frontpage
	else if(request.method === 'GET') {
		fs.exists(filename, function(exists) {

			if(!exists) { // The file does not exists
				response.writeHead(404, {'content-type': 'text/plain' });
				response.write("404 Not Found\n");
				response.end();
				return;

			} else { // Otherwise the file from the html head exists
				serve_file(filename, response);
			}
		});
	} 

	// Error
	else {
		response.writeHead(500, MIME_TYPES['.txt']);
		response.end("Error");
	}
}).listen(4000);


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
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
			return;
		}

		// Pick the file's content type
		content_type = MIME_TYPES[path.extname(filename)];

		// Place the content type into the header
		if (content_type) {
			headers["Content-Type"] = content_type;
		}

		// Send correct header and file to client
		response.writeHead(200, headers);
		response.write(file, "binary");
		response.end();
	});
}

// Not implemented yet
function is_api_call(url) {
	var n = url.charAt(url.length - 1),
		condition = false;

	if(url === '/topic/submit' || url === '/topic?id=' + n || url === '/reply?pID=' + n){
		condition = true;
	}

	return condition;
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
