http = require('http');
fs = require('fs');
path = require('path');

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain'
};

var nodes = new Array();

http.createServer(onRequest).listen(1234);

function onReqest (req, res) {
	// home / get list of topics
	if (req.url == '/' || req.url == '/topic') {
		console.log('Hit homepage.');
		res.writeHead(200, {'Content-Type' : MIME_TYPES['.html']});
		var buffer = fs.readFile('index.html',
			function(err, data) { serveFile(err, data, res); } );
		
	}
	// submit topic
	
	// submit comment
	
	// specific topic / get list of comments
	
	// upvote comment	
	
}

function serveFile(err, data, res) {
	if (err) throw err;
	res.write(data);
	res.writeContinue();
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
