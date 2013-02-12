var url = require("url");
var requestHandlers = require("./requestHandlers");

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {
      "Content-Type": "text/html"
    });
    response.write("404 Not found");
    response.end();
  }
}

function routeTopics(response, request) {
	var params = url.parse(request.url, true).query;
	console.log(params + ", " + params.length);
	if (isEmpty(params)) {
		console.log("Routing topics to getTopics");
		requestHandlers.getTopics(response, request);
	} else {
		console.log("Routing topics to getNodefromIndex");
		requestHandlers.getNodeFromIndex(response, request);
	}
}

function isEmpty(dict) {
	return Object.keys(dict).length === 0;
}

exports.route = route;
exports.routeTopics = routeTopics;
