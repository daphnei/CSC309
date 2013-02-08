var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require("querystring");
var fs = require("fs");
var data = require("./data");
var url = require("url");

MIME_TYPES = {
		'.html': 'text/html',
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.txt': 'text/plain',
		'.json': 'application/json',
		'.ico' : 'image/vnd.microsoft.icon'
};

/**
 * callback, sends input data to the server
 */
function serveFile(err, data, response) {
	if (err) {
		// Overwrite the header with a 404 error.
		response.writeHead(404, {'Content-Type' : MIME_TYPES['.txt']});
		response.end("404: file not found.");
	}
	else {
		response.write(data);
		response.end();
	}
};

/**
 * Sends the index html page
 */
function start(response) {
	console.log("Request handler 'start' was called.");
	
	/*just for now define some fake topics already in the system*/
	/*data.insertTopic("things are happening", "www.google.com");
	data.insertTopic("other things are happening", "www.google.com");
	data.insertTopic("many things are happening", "www.google.com");*/
	
	response.writeHead(200, {'Content-Type' : MIME_TYPES['.html']});
	var buffer = fs.readFile('index.html',
	function(err, data) { serveFile(err, data, response); } );
};

/**
 * Used to send various types of assets, including js and css to the client
 */
function getAsset(response, request) {
	console.log("Request handler 'generic' was called, requesting " + request.url + ".");
	
	var urlpath = url.parse(request.url).pathname;
	//console.log("Request handler 'js' was called, requesting " + request.url + " with ext " + path.extname(urlpath));
	response.writeHead(200, {'Content-Type' : MIME_TYPES[path.extname(urlpath)]});

	var filename = path.relative("/", urlpath);
	var buffer = fs.readFile(filename, function(err, data) { 
		serveFile(err, data, response); 
	});
}

/**
 * Sends a JSON object conssting of only topic nods to the server
 */
function getTopics(response) {
	console.log("Request handler 'getTopics' was called.");

	response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
	
	var topicNodes = new Array();
	for (var i = 0; i < data.nodes.length; i++) {
		if(data.nodes[i].type == 'topic') {
		topicNodes.push(data.nodes[i]);
		}
	}
	
	console.log("Populated topicNodes with " + topicNodes.length + " items");
	response.write(JSON.stringify(topicNodes));
	response.end();
}

function getNodeFromIndex(response, request) {
	console.log("Request handler 'getNodeFromIndex' was called.");
	
	var params = url.parse(request.url, true).query;
	console.log("The id to retrieve a node for is " + params.id);
	
	if (!isValid(id)) {
		console.log("The client requested a node ID that does not exist.");
		response.writeHead(400, {'Content-Type' : MIME_TYPES['.txt']});
		response.end("400: invalid topic id requested.");
	}
	
	response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
	response.write(JSON.stringify(data.nodes[params.id]));
}

function isValid(id) {
	return !(id === null || id < 0 || id >= data.nodes.length);
}

/**
 * Sends a JSON object consisting of all comments (including nested comments)
 * of a node to the client. Returned in pre-order.
 */
function getComments(response, request) {
	console.log("Request handler 'getComments' was called.");

	// get parent ID
	var queryData = url.parse(request.url, true).query;
	var pid = queryData.id;
	if (!isValid(pid)) {
		response.writeHead(400, { "Content-Type" : MIME_TYPES['.txt']});
		response.end("400: Invalid id specified.");
	}
	else {
		response.writeHead(200, { "Content-Type" : MIME_TYPES['.json']});
		
		// get all children comments...
		var commentNodes = traverseComments(pid);

		// ...but since traverseComments does a pre-order traversal, it also
		// includes this node's own root ID at the front. Remove it.
		commentNodes.shift();

		// send them back to the client
		console.log("Populated commentNodes with " + commentNodes.length + " items");
		response.write(JSON.stringify(commentNodes));
		response.end();
	}
	
}

/**
 * Get all the child comments of the given root node, in pre-order.
 */
function traverseComments(root_id) {
	childNodes = new Array();

	// since pre-order, start with root at beginning
	childNodes.push(data.nodes[root_id]);

	// now recurse through children comments, from top to bottom.
	var cids = data.nodes[root_id].children_ids;
	for (var i = 0; i < cids.length; i++) {
		var cid = cids[i];
		childNodes.concat(traverseComments(cid));
	}
	
	console.log("Children of " + root_id + " are: ");
	for (var i = 0; i < cids.length; i++) {
		console.log("  " + childNodes[i].id);
	}
	return childNodes;
}

/**
 * Called when client submits a new topic
 */
function submitTopic(response, request) {
	if (request.method != "POST") {
		// POST requests are the only thing that should be accepted in this function!
		// Assume they're looking for a file instead.
		return getAsset(response, request);
	}

	console.log("Request handler 'topics/submit' was called.");
	
	var jsonString = '';
	var topic;
	request.addListener('data', function(buffer) {
		jsonString += buffer; });
	request.addListener('end', function() {
		
		console.log(jsonString);
		var json = JSON.parse(jsonString); //the two field provided by the client
		//console.log(response);
		//create one of our json objects
		topic = data.insertTopic(json[0], json[1]);
		response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
		response.write(JSON.stringify(topic));
		response.end();
	});
}

/**
 * Called when client submts a new comment
 */
function submitComment(response, request) {
	if (request.method != "POST") {
		// POST requests are the only thing that should be accepted in this function!
		// Assume they're looking for a file instead.
		return getAsset(response, request);
	}

	console.log("Request handler '/reply' was called.");
	
	// read the comment data sent from the client
	var commentData = '';
	request.addListener('data', function(buffer) {
		commentData += buffer; });
	
	// once we're done, create a new comment node and write it back to the
	// client 
	request.addListener('end', function() {
		
		// get the id of the parent this comment is being added to from the
		// request url
		var queryData = url.parse(request.url, true).query;
		var pid = queryData.id;
		
		if (!isValid(pid)) {
			response.writeHead(400, { "Content-Type" : MIME_TYPES['.txt']});
			response.end("400: Invalid reply subject.");
		}
		else {
			var node = data.insertComment(commentData, pid);
			response.writeHead(200, { "Content-Type" : MIME_TYPES['.json']});
			response.write(JSON.stringify(node));
			response.end();
		}
	});
}

function upvote(response, request) {
	if (request.method != "POST") {
		// POST requests are the only thing that should be accepted in this function!
		// Assume they're looking for a file instead.
		return getAsset(response, request);
	}

	console.log("Request handler 'upvote' was called.");
	// get the id of the comment to upvote
	var queryData = url.parse(request.url, true).query;
	var id = queryData.id;
	var node = data.upvote(id);
	
	// returns the node that has been upvoted as a JSON object
	response.writeHead(200, { "Content-Type" : MIME_TYPES['.json']});
	response.write(JSON.stringify(node));
	response.end();
}

exports.start = start;
exports.getComments = getComments
exports.getTopics = getTopics;
exports.submitTopic = submitTopic;
exports.upvote = upvote;
exports.submitComment = submitComment;
exports.getAsset = getAsset;
exports.getComments = getComments;
exports.getNodeFromIndex = getNodeFromIndex;
