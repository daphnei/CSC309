var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require("querystring");
var fs = require("fs");
var data = require("./data");

MIME_TYPES = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.txt': 'text/plain',
        '.json': 'application/json'
};

function serveFile(err, data, res) {
	if (err) {
		// Overwrite the header with a 404 error.
		res.writeHead(404, {'Content-Type' : MIME_TYPES['.txt']});
		res.end("404: file not found.");
	}
	else {
		res.write(data);
		res.end();
	}
};

function start(response) {
  console.log("Request handler 'start' was called.");
  
  /*just for now define some fake topics already in the system*/
  data.insertTopic("things are happening", "www.google.com");
  data.insertTopic("other things are happening", "www.google.com");
  data.insertTopic("many things are happening", "www.google.com");
  
  response.writeHead(200, {'Content-Type' : MIME_TYPES['.html']});
  var buffer = fs.readFile('index.html',
  function(err, data) { serveFile(err, data, response); } );
};

function getAsset(response, request) {
  console.log("Request handler 'js' was called, requesting " + request.url + ".");
  
  var urlpath = url.parse(request.url).pathname;
  //console.log("Request handler 'js' was called, requesting " + request.url + " with ext " + path.extname(urlpath));
  response.writeHead(200, {'Content-Type' : MIME_TYPES[path.extname(urlpath)]});

  var filename = path.relative("/", urlpath);
  var buffer = fs.readFile(filename, function(err, data) { serveFile(err, data, response); });
}


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

function submit(response, request) {
  console.log("Request handler 'topics/submit' was called.");
    
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("got to submit");
  response.end();
}

function upvote(response) {
  console.log("Request handler 'upvote' was called.");
  
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("got to response");
  response.end();
}


function comment(response) {
  console.log("Request handler 'comment' was called.");
  
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("got to comment");
  response.end();
}

exports.start = start;
exports.getTopics = getTopics;
exports.submit = submit;
exports.upvote = upvote;
exports.comment = comment;
exports.getAsset = getAsset;
