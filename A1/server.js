var http = require("http");
var url = require("url");

var PORT = 31285;

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest).listen(PORT);
  console.log("Server has started at localhost on port " + PORT + ".");
}

exports.start = start;

