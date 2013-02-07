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
		'.json': 'application/json'
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
	var buffer = fs.readFile(filename, function(err, data) { serveFile(err, data, response); });
}

/**
 * Sends a JSON object conssting of only topic nods to the server
 */
function getTopics(response) {
	console.log("Request handler 'getTopics' was called.");

	response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
	
	var topicNodes = new Array();
	for (var i = 0; i < data.nodes.length; i++) {
		if(data.nodes[i].type = 'topic') {
		topicNodes.push(data.nodes[i]);
		}
	}
	
	console.log("Populated topicNodes with " + topicNodes.length + " items");
	response.write(JSON.stringify(topicNodes));
	response.end();
}

/**
 * Sends a JSON object conssting of only topic nods to the server
 */
function getComments(response) {
	console.log("Request handler 'getComments' was called.");

	response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
	
	//eventually need to get this from request
	var id = 0;
	
	var commentNodes = new Array();
	for (var i = 0; i < data.nodes.length; i++) {
		if(data.nodes[i].type == 'comment' && data.nodes[i].root_id == id) {
		commentNodes.push(data.nodes[i]);
		}
	}
	
	console.log("Populated topicNodes with " + commentNodes.length + " items");
	response.write(JSON.stringify(commentNodes));
	response.end();
}

/**
 * Called when client submts a new topic
 */
function submitTopic(response, request) {
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
	console.log("Request handler 'topics/submit' was called.");
	
	var jsonString = '';
	request.addListener('data', function(buffer) {
		jsonString += buffer; });
	request.addListener('end', function() {
		
		console.log(jsonString);
		var json = JSON.parse(jsonString); //the two field provided by the client
		//console.log(response);
		//create one of our json objects
		var topic = data.insertComment("hello", 0);
		response.writeHead(200, { "Content-Type": MIME_TYPES['.json']});
		response.write(JSON.stringify(topic));
		response.end();
	});
}

function upvote(response) {
	console.log("Request handler 'upvote' was called.");
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("got to response");
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
