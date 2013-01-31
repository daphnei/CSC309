http = require('http');
fs = require('fs');
path = require('path');

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain'
};

HEAD_ITEMS = {
  '/':'',
  '/jquery.js':'',
  '/style.css':'',
  '/topics.js':'',
  '/comments.js':'',
};

var nodes = [];

// Initiate server
// Request from the client
// Response from the server
http.createServer(function (request, response) {
	
	console.log('Request: ' + request.url);
	
	// var handleRequest = HEAD_ITEMS[request.url];
	// handleRequest();

	if (request.url === '/') {
		fs.readFile('index.html', function (err, data) {
			if (err) {
				throw err;
			}
			response.writeHead(200, MIME_TYPES['.html']);
			response.end(data);
		});

	} else if (request.url === '/style.css') {
		fs.readFile('style.css', function (err, data) {
			if (err) {
				throw err;
			}
			response.writeHead(200, MIME_TYPES['.css']);
			response.end(data);
		});

	} else if (request.url === '/jquery.js') {
		fs.readFile('jquery.js', function (err, data) {
			if (err) {
				throw err;
			}
			response.writeHead(200, MIME_TYPES['.js']);
			response.end(data);
		});

	} else if (request.url === '/topics.js') {
		fs.readFile('topics.js', function (err, data) {
			if (err) {
				throw err;
			}
			response.writeHead(200, MIME_TYPES['.js']);
			response.end(data);
		});
	} else if(request.url === '/comments.js') {
		fs.readFile('comments.js', function (err, data) {
			if (err) {
				throw err;
			}
			response.writeHead(200, MIME_TYPES['.js']);
			response.end(data);
		});
	} else {
	    response.writeHead(400, MIME_TYPES['.html']);
	    response.end("Error");
	}
}).listen(4000);


function serveFrontpage(request, response) {
    fs.readFile('index.html', function (err, data) {
      if (err) {
        throw err;
      }
      response.writeHead(200, MIME_TYPES['.html']);
      response.end(data);
    });
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
	node.children_ids = new Array();
	node.root_id = root;

	nodes.push(node);
}

function insertTopic(type, description, link) {
	var node = {};
	
	node.type = type;
	node.content = description;
	node.vote_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
	node.link = link
	
	nodes.push(node);
}

function upvote(id) {
	var comment = nodes[id];
	if (comment.type !=  "comment") {
		console.log("Tried to upvote a non-comment node.");
		return false;
	}
	comment.vote_count++;
	var root = nodes[comment.root_id];
	root.vote_count++;
}
