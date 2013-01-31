http = require('http');
fs = require('fs');
path = require('path');
url = require('url');

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain'
};

var nodes = new Array();

http.createServer(onRequest).listen(1234);

function onRequest (req, res) {
	if (req.url == '/' || req.url == '/topic') {
		// home / get list of topics
		console.log('Hit homepage.');
		res.writeHead(200, {'Content-Type' : MIME_TYPES['.html']});
		var buffer = fs.readFile('index.html',
			function(err, data) { serveFile(err, data, res); } );
	}
	else {
		// For everything else (CSS file, scripts, etc.) assume it's asking for a static file.
		console.log('Requested file ' + req.url);
		
		var urlpath = url.parse(req.url).pathname;
		res.writeHead(200, {'Content-Type' : MIME_TYPES[path.extname(urlpath)]});

		var filename = path.relative("/", urlpath);
		var buffer = fs.readFile(filename, function(err, data) { serveFile(err, data, res); });
	}
	
	// TODO:

	// submit topic
	
	// submit comment
	
	// specific topic / get list of comments
	
	// upvote comment	
}

function serveFile(err, data, res) {
	if (err) {
		// Overwrite the header with a 404 error.
		res.writeHead(404, {'Content-Type' : MIME_TYPES['.txt']});
		res.end("404: file not found.");
	}
	else {
		res.end(data);
	}
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
