/**
 * All Objects in the Global Namespace:
 * topics
 * comments
 */

//	Global variable comments contains all comment functionality
var comments = {

	/**
	 * Create comment html
	 *
	 * @param {Object} data All information necessary to create a comment
	 *
	 * @return {String} HTML comment
	 */
	createCommentsHTML: function(data) {
		var new_content = data.content;
		var comment_id = data.id;
		var vote_count = data.vote_count;
		var comment_count = data.child_count;

		var html_string = '<li id=' + comment_id + ' class="comment"> </li>';
		
		var comment_footer =  '<br/> <ul class="counts">'
    	    + '<li id="votecount' + comment_id + '">'
    		+ vote_count + ' points </li>' + '<li> | </li>'
    		+ '<li id="commentcount' + comment_id + '">' + comment_count + ' comments'
    		+ '</li> <li> | </li>'
    		+ '<li><a href="#" id="upvoteComment' + comment_id + '">upvote</a></li>'
    		+ '<li> | </li>'
    		+  '<li><a href="#" id="replyToComment' + comment_id + '">reply</a></li>'
    		+ '<li id=commentFormSection' + comment_id + '></li>'
    		+ '</ul> <ul class="comments_section"></ul>'
		
		var complete_html = $(html_string);
		
		// Add the (sanitized) content.
		complete_html.text(new_content);
		
		// Replace all newlines in the content with <br />s.
		complete_html.html(complete_html.html().replace(/[\r\n]/g, '<br />'));
		
		// Add the footer
		complete_html.append(comment_footer);
		
		return complete_html.get();
	},
	
	/**
	 * Create comment form html
	 *
	 * @param {Integer} comment_id ID for comment form
	 *
	 * @return {String} form HTML for the comment form
	 */
	createCommentFormHTML : function(comment_id) {
	var form = '<form id=form' + comment_id +
		' class="reply_form">' +
		'<textarea rows="3" cols="60" name="reply_content" class="reply_field"></textarea>' +
		'<br/>' +
		'<input value="Reply" type="button" name="reply_submit" class="reply_button"/>' +
		'</form>'
	return form;
	},

	/**
	 * Place comment created from data on the corresponding node
	 *
	 * @param {Object} data Object that contains all the information on how to create a comment
	 * @param {Object} comment_section Section to which you want to render this comment
	 *
	 * @return {Object} The nested comment section of the newly rendered comment.
	 */
	render: function(data, comment_section) {
	    console.log("should be rendering comment with message " + data.content);
		var reply_data = [];
		var commentsHTML;
		var object_reply = {};

		// Valid data
		commentsHTML = comments.createCommentsHTML(data);
		
		// Display reply form
		comment_section.append(commentsHTML);
		console.log("appending");
		//Make the upvote link call the upvote function
		$('#upvoteComment' + data.id).click(function() {
			comments.sendUpvoteToServer(data.id);
		});
		
		var new_section = $('li#' + data.id).find('ul.comments_section');
		
		//Make the reply link show the comment submission form
		$('#replyToComment' + data.id).click(function() {
			var form = comments.createCommentFormHTML(data.id);
			$('#commentFormSection' + data.id).html(form);
			//specify what the reply button will do
			comments.bindReplyButton(data.id, new_section);
		});
		
		// Return the nested comment section
		return new_section;
	},

	/**
	 * Get a list of comments from the server, and call the methods needed to render them
	 *
	 * @param {Object} section Unwrapped DOM object of the comment section
	 */
	getCommentsFromServer: function(section) {

		// Get the topic id of the topic containing the comment section
		var root_id = $(section).parent().parent().attr("id"),

			url = '/comments?id=' + root_id,
			comment_section = $('li#' + root_id).find('ul.comments_section'),
			clean_data = {};

		// DEBUG:
		console.log('Show node: ' + root_id);

		// The comment section has elements displayed
		if (comment_section.children().length > 0) {
			console.log('Hide comments for node' + root_id);

			// Hide the comments section
			comment_section.children().remove();
		}

		// The comment section has no elements displayed
		else {

			console.log('Attempting to fetch comments from server: ' + url);

			// Get comment data from server (will cause error if no server is present)
			$.getJSON(url, function(children) {

				// DEBUG:
				console.log('Client sends url: ' + url);
				console.log('Client recieves: ' + JSON.stringify(children));


				// The length of the received array is the count of children for the root_id
				if (children.length > 0) {

					// DEBUG:
					console.log('Show comments and reply form for node: ' + root_id);
					console.log('The server sent all children as an array. Time to populate the frontend');
					comments.first_comment(root_id, comment_section);
					
					// Recursively render comments by following the pre-order traversal
					// that the server does, and assigning comments to the correct levels.
					// Note that this assumes the comment list from the server is going to
					// be in the correct order (pre-order)!
					
					var comment_sections_map = {};
					// We'll use this hash map to keep track of the comment sections for each
					// subcomment, indexed based on their id.
					comment_sections_map[root_id] = comment_section;

					// Render hidden comments for topics
					for (var i = 0; i < children.length; i++) {

						// Children of root display...
						console.log('Rendering child: ' + JSON.stringify(children[i]));
						
						// Note that the following will only work if the comments are in
						// pre-order traversal order.
					    var new_section = comments.render(children[i],
					                        comment_sections_map[children[i].root_id]);
					                    
					    // Save this newly rendered section in the hash map
					    comment_sections_map[children[i].id] = new_section;
					}
				}

				// There are no comments
				else {

					// DEBUG:
					console.log('Show reply form');

					// Display the reply for the topic
					comments.first_comment(root_id, comment_section);
				}
			});
		}
	},

	/**
	 * Create the reply form for the first comment of a topic
	 *
	 * @param {Integer} root_id ID for topic
	 * @param {Object} comment_section jQuery Object for the comment section of the topic
	 */
	first_comment: function(root_id, comment_section) {
		var reply_form = comments.createCommentFormHTML(root_id);

		comment_section.append(reply_form);
		comments.bindReplyButton(root_id, comment_section);
		comments.bindUpvoteButton(root_id, comment_section);
	},

	/**
	 * Bind the reply button for comment or topic
	 *
	 * @param {Integer} root_id ID for topic
	 * @param {Object} comment_section jQuery Object for the comment section of the topic
	 */
	bindReplyButton: function(root_id, comment_section) {
		var reply = '';

			console.log('Binding submit comment button,	#form' + root_id);

		// Bind reply button. Will contact server.
		$('#form' + root_id).find('input.reply_button').click(function() {
			console.log('Reply pressed for #form' + root_id);

			// Get the data to send to the server
			reply = $('#form' + root_id).find('textarea.reply_field').val();

			// Make fields reusable after usage
			comments.reset_form($('#form' + root_id));

			//remove the form after submission
			$('#commentFormSection' + root_id).html("");
			
			if (reply == '') {
				console.log('Reply is empty');
			} else {
				// Send comment to server
				$.ajax({
					type: 'POST',
					url: '/reply?id=' + root_id,
					data: reply,

					// The server's response upon successfully sending the topic is 
					// the corresponding json string
					success: function(new_data, textStatus, jqXHR) {
						// DEBUG:
						console.log('Recieved comment node:');
						dataJSON = JSON.parse(new_data);
						comments.render(dataJSON, comment_section);
						
						//DOES NOT WORK
						//change the text of the comment count to represent new tally
						//$('#commentcount' + id).html(new_data.children_ids.length + " comments");
					},
					contentType: "text/plain",
					dataType: 'text'
				});
			}
		});
	},
	
	/**
	 * Bind the upvote for a node
	 *
	 * @param {Integer} id ID for node that must have upvote button binded
	 * @param {Object} comment_section jQuery Object for the comment section of the topic
	 */
	bindUpvoteButton: function(id, comment_section) {

		console.log('Binding upvote button,	#form' + id);
			
		// Bind upvote button. Will contact server.
		$('#form' + id).find('input.up_button').click(function(){
			console.log('Upvote pressed for #form' + id);
			
			$.ajax({
				 type: 'POST',

				 // The server should extrapolate from the URL which node is being upvoted
				 url: '/comments/upvote?id=' + id,
				 
				// Update vote values and positioning of comments and topics
				 success: function(new_data, textStatus, jqXHR) {
							
							// DEBUG: The client should receive the updated node
							console.log('Client received upvoted comment: ');
							console.log(new_data);
							// NEED TO IMPLEMENT REORDERING OF COMMENTS
							
							//change the text of the vote count to represent new tally
							$('#votecount' + id).html(new_data.vote_count + " points");
				 },
				 contentType: "application/json",
				 dataType: 'json'
			 });			 
		});
	},

	/**
	 * Tell server that an upvote occured at node
	 *
	 * @param {Integer} id ID for node that was upvoted
	 */
	sendUpvoteToServer : function(id) {
		console.log('Upvote pressed for comment ' + id);
				
	$.ajax({
		 type: 'POST',

		 // The server should extrapolate from the URL which node is being upvoted
		 url: '/comments/upvote?id=' + id,
		 
		// Update vote values and positioning of comments and topics
		 success: function(new_data, textStatus, jqXHR) {
				
				// DEBUG: The client should receive the updated node
				console.log('Client received upvoted comment: ');
				console.log(new_data);
				
				//change the text of the vote count to represent new tally
				$('#votecount' + id).html(new_data.vote_count + " points");
		 },
		 contentType: "application/json",
		 dataType: 'json'
	 });	
	},
	
	/**
	 * Reset the form to allow new input
	 *
	 * @param {Object} form jQuery form object that can be queried on
	 */
	reset_form: function(form) {
		form.find('input:text, input:password, input:file, select, textarea').val('');

		form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	}
};
