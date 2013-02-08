/**
* All Objects in the Global Namespace:
* topics
* comments
*/

//  Global variable topics contains all topic functionality
var topics = {
    
    /** Show the submission form on the frontpage. */
    show_form: function () {

        // HTML that creates the submission form
        var form = 
            '<form name="about_to_submit">' + 
                '<label for="url">title:</label>' + 
                '<input value="" type="text" size="60" name="title" id="submit_form"/>' + 
                '<label for="url">url:</label>' + 
                '<input value="" type="text" size="60" name="url" id="url_form"/>' + 
                '<input value="Submit" type="button" name="do_submit" id="submit_button"/>' +
                '<input value="Cancel" type="button" name="do_cancel" id="submit_cancel"/>' +
            '</form>';
        
        $('#submission_form').html(form);
        
        // Bind event handlers for form after its in the DOM
        $('input#submit_button').click(function(){
            topics.submit();
        });
        
        $('input#submit_cancel').click(function(){
            topics.hide_form();
        });
    },
    
    /** Hide the submission form from the frontpage. */
    hide_form: function () {
        $('#submission_form').html('');
    },
    
     /**
     * Check if the given title is valid
     *
     * @param {String} field Contains the string you want to use for your title
	 *
     * @return {String} Empty string if valid, otherwise a rejection reason
     */
    validate_title: function(field) {
        var message = '';
		
        if (!field) {
            message = "You didn't fill in the title.";
        } else if(field.length > 140) {
            message = "Your title is too long!";
        }

        return message;
    },

     /**
     * Check if the given url is valid, adding an http:// if needed.
     *
     * @param {String} field Contains the string you want to use for your url
	 *
     * @return {String} An object containing the following fields:
	 *		- clean_url: the cleaned up url if validation succeeds.
	 *		- rejection_reason: the rejection message if validation fails, empty string 
	 *				if it succeeds.
     */
    validate_url: function(field) {

        var result = {
			clean_url : field,
			rejection_reason : ''
		};
		
		url_matcher = /^(https?|ftp):\/\/[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$/i
		if (!field.match(url_matcher)) {
			// It failed, but it may have been a url submitted without an http://. Try adding it.
			result.clean_url = "http://" + field;

			if (!result.clean_url.match(url_matcher)) {
				// There is no hope for this URL.
				result.rejection_reason = "Invalid URL!";
			}
		}

        return result;
    },

     /**
     * Reject the given piece of data for the given reason
     *
     * @param {String} name Name of form field that is missing on submit
     * @param {String} reason Why the topic submission failed
     */
    reject: function(name, reason) {
        console.log("Invalid " + name + ": " + reason);
    },

     /**
     * Remove all unecessary key-value pairs from the recollected form data
     *
     * @param {Object} form_data  Contains more info besides the necessary data for a topic
     *
     * @return {String} JSON objecr descibing topic
     */
    jsonify: function(form_data) {
        var json_data = new Array();

        // Pick necessary data only, but can't name it or stringify won't work
        $.each(form_data, function(i, data) {
            json_data.push(data.value);
        });
		
        // Convert into a json string
        return json_data;
    },
    
    /**
     * Create a new topic from the server data
     *
     * @param {Integer} topic_id The unique id for the corresponding topic
     * @param {String} title The title of the topic. Assume input is 140 characters or less
     * @param {String} interest_link The link the user wants to share with other individuals via the title
     * @param {Integer} vote_count The addition of all comment
     * @param {Integer} comment_count The total amount of comments for the topic 
     *
     * @return {String} HTML for topic
     */
    createHTML: function(topic_id, title, interest_link, vote_count, comment_count){

        var html_topic = 
            '<li id=' +  topic_id + ' class="topic">' +
                '<h3 class="topic_title">' + '<a href="' + interest_link + '" title="'
					+ interest_link + '" target="_blank">' + title + '</a>' + '</h3>' +
                '<ul class="counts">' +
                    '<li>' + vote_count + ' points </li>' +
                    '<li> | </li>' +
                    '<li class="show_comments">' + '<a href="#">' + comment_count +
									' comments </a>' + '</li>' +
                '</ul>' +
                '<ul class="comments_section">' +

                '</ul>' +
            '</li>';
        return html_topic;
    },
    
    
    /**
     * Place topic created from data on the frontpage
     *
     * @param {JSON} data JSON  that contains all the information on how to create a form
     */
    render: function(data) {

        // Convert JSON string into JavaScript Object
        var new_topic = topics.createHTML(data.id, data.content, data.link, data.vote_count,
											data.children_ids.length);

        // Use create and then use jQuery to render on DOM...
        $('ol#content').append(new_topic);

        // Bind the comment section to clicks
        topics.bind_comment(data.id);
        
    },

    /**
     * Bind the comment section of the topic id
     *
     * @param {Integer} topic_id The id of the topic that must have its comments bind_commented
     * @this Is the comments section for the topic id
     */
    bind_comment: function(topic_id){

        // Bind the interaction that will show the comments section upon clicking on it
        $('#' + topic_id).find('ul.counts').find('li.show_comments').click(function(){
            comments.show(this);
        });
    },
        

    /** Send submission request to server, hiding the submission form afterwards. */
    submit: function() {
        
        // Place all fields into an array, where each element in a JS object
        var form_data = $('#submission_form :input').serializeArray();

		// Note: we're currently doing all our validation in the client, which
		// is not a good idea, because someone could maliciously modify the
		// client. But it shouldn't be that big of a deal for the purposes
		// of our assignment.

		if (form_data[0].name != "title" && form_data[1].name != "url") {
			// Validate to make sure that something odd hasn't gone wrong with the form.
			console.log("Malformed form data!");
			return false;
		}

		// Validate to make sure the title is good.
		var rejection_reason = topics.validate_title(form_data[0].value);
		if (rejection_reason) {
			console.log(rejection_reason);
			return false;
		}

		// Now validate and clean up the URL.
		var url_validation = topics.validate_url(form_data[1].value);
		if (url_validation.rejection_reason) {
			console.log(url_validation.rejection_reason);
			return false;
		}
		form_data[1].value = url_validation.clean_url;

        // DEBUG: Not sending junk to server
        var toSend = topics.jsonify(form_data);
        console.log(toSend);
        
        // Submit data to server (Will report an error without a server)
        $.ajax({
            type: 'POST',
            url: '/topics/submit',
            data: JSON.stringify(toSend),
            contentType: "text/json",

            // The server's response upon successfully sending the topic is the corresponding json string
            success: function(form_data, textStatus, jqXHR) {
				console.log("Server response with:");
				console.log(form_data);
                topics.render(form_data)
            }
        });

        topics.hide_form();
    },
    
    /** 
	 *  creates visuals from the topic json retrieved from the server
	 * 
	 * @param {Array} the list of topic nodes retrieved from the server
	 */
	showTopicsFromJSON : function(data) {
		for(var i = 0; i < data.length; i++) {
			var currentTopic = data[i];
			$('ol#content').append(topics.createHTML(currentTopic.id,
												currentTopic.content,
												currentTopic.link,
												currentTopic.vote_count,
												currentTopic.children_ids.length));
			topics.bind_comment(1);
		}
	},
	
    /**
	 * requests json for front page topics from the server
	 *
	 */
	getJSONForTopics : function() {
			$.ajax('./topics', {
			type: 'GET',
			dataType: 'json',
			success: function(data) { topics.showTopicsFromJSON(data); },
			error  : function()     { topics.showTopicsFromJSON(null); }
		});
	}
};  
