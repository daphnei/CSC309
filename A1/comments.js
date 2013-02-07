/**
* All Objects in the Global Namespace:
* topics
* comments
*/

//  Global variable comments contains all comment functionality
var comments = {

	/**
	 * I don't know what are the parameters of this function, but they will stem from the json data
	 *
	 * @param {} ITS MISSING THE PARAMETERS
	 *
	 * @return {String} HTML comment
	 */
	create: function(){ 
		// Magic with json data and strings...
	},

	/**
	 * Place comment created from data on the corresponding node
	 *
	 * @param {String} data JSON string that contains all the information on how to create a comment
	 * @param {Integer} node_id Is the node id which the comment is attached to
	 */
	render: function(data, node_id){
		// Use create for the html string and jquery to append to the DOM
	},
	
	/**
	 * Show the comment section. This routine will decipher from what topic.
	 *
	 * @param {Object} section DOM object of the comment section
	 */
	show: function(section) {
		
		// Get the topic id of the topic containing the comment section
		node_id = $(section).parent().parent().attr("id");
		
		var url = '/topic?id=' + node_id;

		if ($(section).children("div.comments").length > 0) {
			// Hide the comments section if it exists.
			$(section).children("div.comments").remove();
		}
		else {
			// And if it doesn't exist, show it.

			$(section).append("<div class='comments'>My unicorn is cooler than yours!</div>");
			// DEBUG. Later on, the loop below should be used so that it serves the real
			// comments section rather than a simple one-line div.

//			// Get comment data from server (will cause error if no server is present)
//			$.getJSON(url, function(data) {
//				
//				// Populate DOM with comment data that came from server.
//				// Look at each comment attached to the origin node (the topic)
//				$.each(data, function() {
//	
//					// Append comments to the comment section of the topic
//					// Recursively check whether or not that comment has a comment attached to it
//					
//				});
//			});
		}
		
	}
};
 
