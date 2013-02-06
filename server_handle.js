var NODES = [];

// Handle module for server
module.exports = {
	get_request: function(request, response, filename, root_id, temp_node){
		
		// Comment node that will be given to the client
		var comment_node = {};

		// Check what kind of GET request
		fs.exists(filename, function(exists) {

			// The html head file exists
			if(exists) {
				help.serve_file(filename, response);
			} 
			
			// Get comment for n
			else if (request.url === '/topic?id=' + root_id) {

				// DEBUG:
				console.log('Fetch Comments under ' + root_id);

				// Find the node that the client is interested in
				temp_node = help.find_node(root_id);

				response.writeHead(200, {"content-type": "application/json"});

				// Find comments for node
				if (temp_node.comment_count > 0) {

					// Do something to comment_node...
					// Still have to figure out how to create comment structure

				}
				else {

					// The first comment is empty
					comment_node = help.insert_comment('', root_id);
				}

				// If has children send each child, and if those children have children do so as well
				response.end(JSON.stringify(comment_node));
			}

			// Not an API call and not an existant file
			else {
				response.writeHead(404, {'content-type': MIME_TYPES['.txt'] });
				response.write("404 Not Found\n");
				response.end();
			}
		});
	},
	post_request: function(request, response, filename, received_data, POST, root_id, temp_node){

		// Receive the building blocks for the node from the client
		request.on('data', function (data) {
		    received_data += data;
		});
		// Build and store the node. Send the constructed node to the client
		request.on('end', function () {

			// Topic or reply submission
		    POST = qs.parse(received_data);

		    // DEBUG:
		    console.log('Server Received JavaScript Object: ' + JSON.stringify(POST));

		    // The request is for a topic
		    if (request.url === '/topic/submit') {
				console.log('Create new topic ');
				console.log('Title: ' + POST["title"]);
				console.log('URL: ' + POST["url"]);

				// Create the node
		        temp_node = help.insert_topic(POST["title"], POST["url"]);

		        // Respond to client. Will trigger success callback on topics.js ajax call
		        // The client is expecting this content type, it MUST match
				response.writeHead(200, {"content-type": "application/json"});

				// Send the newest topic
				response.end(JSON.stringify(temp_node));
		    }

		    // The request is for a comment reply
		    else if (request.url === '/reply?pID=' + root_id) {

		    	// DEBUG:
		    	console.log('Create new comment under ' + root_id);
		    	console.log('Reply Content: ' + POST["reply_content"]);

		    	temp_node = help.insert_comment(POST["reply_content"], root_id);

		        // Respond to client. Will trigger success callback on comments.js ajax call
		        // The client is expecting this content type, it MUST match
				response.writeHead(200, {"content-type": "application/json"});

				// Send the newest comment
				response.end(JSON.stringify(temp_node));
		    }

		    // Error
		    else {
				response.writeHead(500, MIME_TYPES['.txt']);
				response.end("Error");
		    }
		}); // POST is out of scope
	},

};


// Helper routines for server handler
var help = {
	
	/**
	 * Find the node matching the id
	 *
	 * @param {String} root_id ID of the node that is being searched for
	 *
	 * @return {Object} node Node that was found with the matching id. Empty if not found.
	 */
	find_node: function(root_id) {
		for (var i = NODES.length - 1; i >= 0; i--) {

			if(NODES[i].id == root_id) {
				return NODES[i];
			}
		}
		return {}
	},
	
	/**
	 * Serve the files that the client requests
	 *
	 * @param {String} filename Name of file in server
	 * @param {Object} response The server's response to the client
	 */
	serve_file: function(filename, response){
		var headers = {},
			content_type = '';

		// index.html and '/' are aliases of one another
		if (fs.statSync(filename).isDirectory()) {
			filename += '/index.html';
		}
		// Serve the file
		fs.readFile(filename, "binary", function(err, file) {
			if(err) {        
				response.writeHead(500, {"content-type": MIME_TYPES['.txt']});
				response.write(err + "\n");
				response.end();
				return;
			}
			// Pick the file's content type
			content_type = MIME_TYPES[path.extname(filename)];

			// Place the content type into the header
			if (content_type) {
				headers["content-type"] = content_type;
			}
			// Send correct header and file to client
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		});
	},
	
	/**
	 * Add a new comment node to all the NODES
	 *
	 * @param {String} type
	 * @param {String} content
	 * @param {String} root
	 *
	 * @return {Object} new_node Node created as a result of inserting a new comment
	 */
	insert_comment: function(content, root_id) {
		var new_node = {},
			temp_root = null;
		
		new_node.type = 'comment';
		new_node.content = content;
		new_node.vote_count = 0;
		new_node.comment_count = 0;
		new_node.id = NODES.length;
		new_node.children_ids = [];
		new_node.root_id = root_id;

		// Update root to reflect changes
		temp_root = help.find_node(new_node.root_id);
		temp_root.children_ids.push(new_node.id);
		temp_root.comment_count = temp_root.children_ids.length;

		// DEBUG: Pointers confuse me from time to time
		// if (temp_root === help.find_node(new_node.root_id)) {
		// 	console.log('Root ' + temp_root.id + ' reflects comment ' + new_node.id + ' addition');
		// }

		NODES.push(new_node);

		return new_node;
	},

	/**
	 * Add a new topic node to all the NODES
	 *
	 * @param {String} description
	 * @param {String} link
	 *
	 * @return {Object} new_node Node created as a result of inserting a new topic
	 */
	insert_topic: function(description, link) {
		var new_node = {};
		
		new_node.type = 'topic';
		new_node.content = description;
		new_node.vote_count = 0;
		new_node.comment_count = 0;
		new_node.id = NODES.length;
		new_node.children_ids = [];
		new_node.link = link
		
		NODES.push(new_node);

		return new_node;
	}
};