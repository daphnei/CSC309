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
		var new_content = content ? content : '';

		html = 
			'<li id=' + comment_id + '>' + new_content + 
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
	render: function(data, node_id, this_comment_section){

		var reply_data = [],
			reply_form = comments.create(data.content, data.id);

		// Display reply form
		$(this_comment_section).append(reply_form);

		// Bind reply button
		$('input.reply_button').click(function(){
			reply_data = $('input.reply_field').serializeArray();

			// DEBUG
			console.log('Client sends: ' + topics.jsonify(reply_data));

			// Send comment to server
	       $.ajax({
	           type: 'POST',
	           url: '/reply?pID=' + node_id,
	           data: reply_data,
	           
	           // The server's response upon successfully sending the topic is the corresponding json string
	           success: function(data, textStatus, jqXHR) {
	                // DEBUG:
	                console.log('Client receives: ' + JSON.stringify(data));
	           },
	           contentType: "application/json",
	           dataType: 'json'
	       });
        });
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
			this_comment_section = 'li#' + node_id + ' ul.comments_section',
			clean_data = {};

		// DEBUG:
		console.log('Show node: ' + node_id);
		

		// The comment section has elements displayed
		if ($(this_comment_section).children().length > 0) {
			console.log('Hide comments for node' + node_id);

			// Hide the comments section
			$(this_comment_section).children().remove();
		}

		// The comment section has no elements displayed
		else {

			// Get comment data from server (will cause error if no server is present)
			$.getJSON(url, function(data) {

				// DEBUG:
				console.log('Client sends: ' + url);

				// There are comments
				if(data.comment_count > 0) {

					// DEBUG:
					console.log('Show comments and reply form');

					// Do some magic

				}
				// There are no comments
				else {

					// DEBUG:
					console.log('Show reply form');

					// Render no comment and submission form
					comments.render(data, node_id, this_comment_section);
				}
			});
		}
	}
};
 
