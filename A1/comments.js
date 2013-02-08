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
  createHTML: function(data) {
    var new_content = data.content;
    var comment_id = data.id;
    var vote_count = data.vote_count;
    var comment_count = data.children_ids.length;

    html = '<li id=' + comment_id + ' class="comment">' + new_content + '<form id=form' + comment_id +
    ' class="reply_form">' + '<input value="" type="text" size="60" name="reply_content" class="reply_field"/>' +
    '<input value="Reply" type="button" name="reply_submit" class="reply_button"/>' +
    '<input type="text" style="display: none;" />' + // This fixes a quirk with pressing enter
    '</form>' + '<ul class="counts">' + '<li>' + vote_count + ' points </li>' + '<li> | </li>' +
    '<li>' + comment_count + ' replies' + '</li>' + '</ul>' + '<ul class="comments_section">' +
    '</ul>' + '</li>';

    return html;
  },

  /**
   * Place comment created from data on the corresponding node
   *
   * @param {Object} data Object that contains all the information on how to create a comment
   * @param {String} root_id Comment or Topic that is being replied to
   * @param {Object} comment_section
   */
  render: function(data, comment_section) {
	console.log("should be rendering comment with message " + data.content);
	console.log(data);
    var reply_data = [],
      reply_form = '',
      object_reply = {};

    // Valid data
    reply_form = comments.createHTML(data)
    
    // Display reply form
    comment_section.append(reply_form);

    // Nested Comment Section
    comment_section = $('li#' + data.root_id).find('ul.comments_section')

    // Be able to reply to the comment's comment
    comments.reply_bind(data.root_id, comment_section);
  },

  /**
   * Get a list of comments from the server, and call the methods needed to render them
   *
   * @param {Object} section Unwrapped DOM object of the comment section
   */
  getCommentsFromServer: function(section) {

    // Get the topic id of the topic containing the comment section
    var root_id = $(section).parent().parent().attr("id"),

      url = '/reply?id=' + root_id,
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

      // Get comment data from server (will cause error if no server is present)
      $.getJSON(url, function(data) {

        // DEBUG:
        console.log('Client sends url: ' + url);

        // There are comments. 
        // If the user hides all comments this will occur
        // The server needs to implement sending all children to client in order for this to work
        // Otherwise nothing will occur
        if (data.comment_count > 0) {

          // DEBUG:
          console.log('Show comments and reply form');
          console.log('The server will send all children');

          comments.render(data, data['id'], comment_section);

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

  first_comment: function(root_id, comment_section) {
    var reply_form = '<form id=form' + root_id + ' class="reply_form">' +
				'<input value="" type="text" size="60" name="reply_content" class="reply_field"/>' +
				'<input value="Reply" type="button" name="reply_submit" class="reply_button"/>' +
				'<input type="text" style="display: none;" />' + // This fixes a quirk with pressing enter
				'</form>';

    comment_section.append(reply_form);
    comments.reply_bind(root_id, comment_section)
  },

  reply_bind: function(root_id, comment_section) {
    var reply_data = [],
      object_reply = {};

    // Bind reply button. Will contact server.
    $('#form' + root_id).find('input.reply_button').click(function() {

      // Get the data to send to the server
      reply_data = $('#form' + root_id).find('input.reply_field').serializeArray();
	  var reply = reply_data[0].value;

      // Make fields reusable after usage
      comments.reset_form($('#form' + root_id));

      if (reply == '') {
        console.log('Reply is empty');
      } else {
        // Send comment to server
        $.ajax({
          type: 'POST',
          url: '/reply?pID=' + root_id,
          data: reply,

          // The server's response upon successfully sending the topic is 
					// the corresponding json string
          success: function(new_data, textStatus, jqXHR) {
            // DEBUG:
            console.log('Recieved comment node:');
            dataJSON = JSON.parse(new_data);
            comments.render(dataJSON, comment_section);
          },
          contentType: "text/plain",
          dataType: 'text'
        });
      }
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
