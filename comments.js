/**
* All Objects in the Global Namespace:
* topics
* comments
*/

//  Global variable comments contains all comment functionality
var comments = {

	/**
	 * Create the html that will render the matching comment id
	 *
	 * @param {String} content Content for the comment
	 * @param {Integer} comment_id Unique identification for the comment node
	 *
	 * @return {String} HTML comment
	 */
	create: function(content, comment_id){ 
		html = 
			'<li id=' + comment_id + '>' + content + 
				'<form class="reply_form">' + 
					'<input value="" type="text" size="60" name="reply_content" class="reply_field"/>' +
					'<input value="Reply" type="button" name="reply_submit" class="reply_button"/>' +
				'</form>' + 
			'</li>';

		return html;
	},

	/**
	 * Place comment created from data on the corresponding node
	 *
	 * @param {Object} data Object that contains all the information on how to create a comment
	 */
	render: function(data, this_comment_section){

		var reply_form = comments.create(data.content, data.id),
			reply_data = [];

		// Display reply form
		$(this_comment_section).append(reply_form);

		// Bind reply button
		$('input.reply_button').click(function(){
			reply_data = $('input.reply_field').serializeArray();

			// DEBUG
			console.log('The client will send: ' + topics.jsonify(reply_data));
        });

        // Send comment to server...

	},
	
	/**
	 * Show the comment section. This routine will decipher from what topic.
	 *
	 * @param {Object} section DOM object of the comment section
	 */
	show: function(section) {
		
		// Get the topic id of the topic containing the comment section
		var node_id = $(section).parent().parent().attr("id"),
			url = '/topic?id=' + node_id,
			this_comment_section = 'li#' + node_id + ' ul.comments_section';

		// DEBUG:
		console.log('Node: ' + node_id);
		

		// The comment section has elements displayed
		if ($(this_comment_section).children().length > 0) {
			console.log('Hide comments');

			// Hide the comments section
			$(this_comment_section).children().remove();
			
		}

		// The comment section has no elements displayed
		else {

			// DEBUG:
			console.log('Client tells server: ' + url);

			// Get comment data from server (will cause error if no server is present)
			$.getJSON(url, function(data) {

				// DEBUG:
				console.log('Client receives: ' + JSON.stringify(data));
				console.log('Comment count: ' + data.comment_count);

				// There are comments
				if(data.comment_count > 0) {

					// DEBUG:
					console.log('Render comments and comment submission form');

					// Populate DOM with comment data that came from server.
					// Look at each comment attached to the origin node (the topic)
					$.each(data, function(index, value) {

						// DEBUG:
						console.log('Value: ' + value);
					});
				}
				// There are no comments
				else {

					// DEBUG:
					console.log('Render comment submission form');
					comments.render(data, this_comment_section);
				}
			});
		}
		
	}
};
 
