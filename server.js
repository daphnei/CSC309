http = require('http');
fs = require('fs');
path = require('path');
url = require("url")

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain'
};

var nodes = [];

// Initiate server
// Request from the client
// Response from the server
http.createServer(function (request, response) {
	
	console.log('Request: ' + request.url);

	var uri = url.parse(request.url).pathname, 
		filename = path.join(process.cwd(), uri),
		headers = {},
		contentType = '';

	// Verify the existence of the url
	fs.exists(filename, function(exists) {

		// The file does not exists
		if(!exists) {

			// The url must be an API call
			if (is_api_call()) {
				// Do the API call...

			} else { // Otherwise, the url leads to a file that does not exist
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				return;
			}
		}

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
			contentType = MIME_TYPES[path.extname(filename)];

			// Place the content type into the header
			if (contentType) {
				headers["Content-Type"] = contentType;
			}

			// Send correct header and file to client
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(4000);

// Not implemented yet
function is_api_call() {
	return false;
}

function serveFile(err, data, response) {
	if (err) {
		throw err;
	}

	response.end(data);
};

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
