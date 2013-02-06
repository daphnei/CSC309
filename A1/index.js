var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
/* the main pages of the REST api */
handle["/"] = requestHandlers.start; //the initial page with a list of topics
handle["/index"] = requestHandlers.start; //the initial page with a list of topics
handle["/topics"] = requestHandlers.getTopics; //the initial page with a list of topics
handle["/topics/submit"] = requestHandlers.submit; //sending in the filled out topic or comment form
handle["/upvote"] = requestHandlers.upvote; //upvote a comment
handle["/comment"] = requestHandlers.comment; //submit a comment

/* various assets */
handle["/style.css"] = requestHandlers.getAsset; //the CSS for the site
handle["/comments.js"] = requestHandlers.getAsset; //client-side javascript
handle["/jquery.js"] = requestHandlers.getAsset; //client-side javascript
handle["/topics.js"] = requestHandlers.getAsset; //client-side javascript

server.start(router.route, handle);
