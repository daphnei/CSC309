http = require('http');
fs = require('fs');
path = require('path');
url = require('url');
qs = require('querystring');
server_handle = require('./server_handle');

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
	
	var uri = url.parse(request.url).pathname, 					// Find the full path ...
		filename = path.join(process.cwd(), uri), 				// ... of the filename
		received_data = '', 									// Aggregated received data from client
		POST = '', 												// Final form of received data
		node_id = request.url.charAt(request.url.length - 1),	// The node_id from the url request, if any
		node = null; 											// The resulting node from received data

	// Client submits topic or comment
	if (request.method === 'POST') {
		server_handle.post_request(request, response, uri, filename, received_data, POST, node);
	} 

	// Client requests topic, comment or files that construct the frontend
	else if(request.method === 'GET') {
		server_handle.get_request(request, response, uri, filename, received_data, POST, node_id, node);
	} 
	// Error
	else {
		response.writeHead(500, MIME_TYPES['.txt']);
		response.end("Error");
	}
}).listen(4000);