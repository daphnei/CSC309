var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
/* the main pages of the REST api */
handle["/"] = requestHandlers.start; //the initial page with a list of topics
handle["/index"] = requestHandlers.start; //the initial page with a list of topics
handle["/topics"] = router.routeTopics; // with id, sends the topic node for the given id, otherwise sends all topics
handle["/topics/submit"] = requestHandlers.submitTopic; //sending in the filled out topic form
handle["/comments/submit"] = requestHandlers.submitComment;  //sending the filled out comments form
handle["/comments"] = requestHandlers.getComments; //get the comments for a particular topic
handle["/comments/upvote"] = requestHandlers.upvote; //upvote a comment

/* various assets */
handle["/style.css"] = requestHandlers.getAsset; //the CSS for the site
handle["/comments.js"] = requestHandlers.getAsset; //client-side javascript
handle["/jquery.js"] = requestHandlers.getAsset; //client-side javascript
handle["/topics.js"] = requestHandlers.getAsset; //client-side javascript
handle["/favicon.ico"] = requestHandlers.getAsset; //client-side javascript

server.start(router.route, handle);
