var NODES = [];

// Handle module for server
module.exports = {
	get_request: function(request, response, uri, filename, received_data, POST, root_id, temp_node){
		var comment_struct = {};

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

					// Do something to comment_struct...
					// Still have to figure out how to create comment structure
				}
				else {
					comment_struct = help.insert_comment('', root_id);
				}

				// If has children send each child, and if those children have children do so as well
				response.end(JSON.stringify(comment_struct));
			}

			// Not an API call and not an existant file
			else {
				response.writeHead(404, {'content-type': MIME_TYPES['.txt'] });
				response.write("404 Not Found\n");
				response.end();
			}
		});
	},
	post_request: function(request, response, uri, filename, received_data, POST, root_id, temp_node){

		// Receive the building blocks for the node from the client
		request.on('data', function (data) {
		    received_data += data;
		});
		// Build and store the node. Send the constructed node to the client
		request.on('end', function () {

			// Topic or reply submission
		    POST = qs.parse(received_data);

		    // DEBUG:
		    console.log('Server Received:' + JSON.stringify(POST));

		    // The request is for a topic
		    if (request.url === '/topic/submit') {
				console.log('Create new topic');

				// Create the node
		        temp_node = help.insert_topic(POST["title"], POST["url"]);

		        // Respond to client. Will trigger success callback on topics.js ajax call
		        // The client is expecting this content type, it MUST match
				response.writeHead(200, {"content-type": "application/json"});

				// Send the newest node
				response.end(JSON.stringify(temp_node));
		    }

		    // The request is for a comment reply
		    else if (request.url === '/reply?pID=' + root_id) {
		    	console.log('Create new comment under ' + root_id);

		    	help.insert_comment(content, root);
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
	 * @param {String} root_id
	 *
	 * @return {Object} node
	 */
	find_node: function(root_id) {
		console.log('Looking for node ' + root_id);

		for (var i = NODES.length - 1; i >= 0; i--) {

			if(NODES[i].id == root_id) {
				console.log('Found node ' + NODES[i].id);
				return NODES[i];
			}
		}

		console.log('Did not find node ' + root_id);
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
	 */
	insert_comment: function(content, root_id) {
		var new_node = {};
		
		new_node.type = 'comment';
		new_node.content = content;
		new_node.vote_count = 0;
		new_node.comment_count = 0;
		new_node.id = NODES.length;
		new_node.children_ids = [];
		new_node.root_id = root_id;
		NODES.push(new_node);

		return new_node;
	},

	/**
	 * Add a new topic node to all the NODES
	 *
	 * @param {String} description
	 * @param {String} link
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