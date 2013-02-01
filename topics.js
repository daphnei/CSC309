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
     * Check if the given piece of data is valid
     *
     * @param {String} field Contains the value at the URL or Title field
     *
     * @return {String} Empty string if valid, otherwise a rejection reason
     */
    validate: function(field) {
        var message = '';

        if (!field) {
            message = "You didn't fill in the field.";
        } else if(field.length > 140) {
            message = "Your input is too damn long!";
        }

        return message;
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
     * @return {String} JSON string describing topic 
     */
    jsonify: function(form_data) {
        var json_data = {};

        // Pick necessary data only
        $.each(form_data, function(i, data) {
            json_data[data.name] = data.value;
        });

        // Convert into a json string
        return JSON.stringify(json_data);
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
    create: function(topic_id, title, interest_link, vote_count, comment_count){

        var html_topic = 
            '<li id=' +  topic_id + ' class="topic">' +
                '<h3 class="topic_title">' + '<a href="' + interest_link + '">' + title + '</a>' + '</h3>' +
                '<ul class="counts">' +
                    '<li>' + vote_count + ' points </li>' +
                    '<li> | </li>' +
                    '<li class="comments_section"> <a href="#">' + comment_count + ' comments </a>' + '</li>' +
                '</ul>' +
            '</li>';

        return html_topic;
    },
    
    /**
     * Place topic created from data on the frontpage
     *
     * @param {String} data JSON string that contains all the information on how to create a form
     */
    render: function(data) {
        // Convert JSON string into JavaScript Object
        var form = JSON.parse(data),
            new_topic = topics.create(form.root_id, form.content, form.link, form.vote_count, form.comment_count);

        // Use create and then use jQuery to render on DOM...
        $('ol#content').append(new_topic);

        // Bind the comment section to clicks
        topics.bind_comment(form.root_id);
    },

    /**
     * Bind the comment section of the topic id
     *
     * @param {Integer} topic_id The id of the topic that must have its comments bind_commented
     * @this Is the comments section for the topic id
     */
    bind_comment: function(topic_id){

        // Bind the interaction that will show the comments section upon clicking on it
        $('#' + topic_id + ' ul.counts li.comments_section').click(function(){
            comments.show(this);
        });
    },
        

    /** Send submission request to server, hiding the submission form afterwards. */
    submit: function() {
        
        // Place all fields into an array, where each element in a JS object
        var form_data = $('#submission_form :input').serializeArray(),
                valid = true,
                rejection_reason = '';

        // Alex: This is here since "each" returns from its own
        // scope, but we want to return from the scope of submit.
        // Can anyone come up with a more elegant solution?
        $.each(form_data, function(i, data) {

            // Find out why the data is invalid
            rejection_reason = topics.validate(data.value);
            
            // Display reason upon failure
            if (rejection_reason) {
                topics.reject(data.name, rejection_reason);
                valid = false;
                return valid;
            }
        });

        // Submission cannot take place due to invalid data
        if (!valid) {
            return false;
        }

        // DEBUG: Not sending junk to server
        console.log(topics.jsonify(form_data));
        
       // Submit data to server (Will report an error without a server)
       $.ajax({
           type: 'POST',
           url: '/topic/submit',
           data: form_data,
           
           // The server's response upon successfully sending the topic is the corresponding json string
           success: function(data, textStatus, jqXHR) {
                // DEBUG:
                console.log('Server responded with ' + JSON.stringify(data));
                
                topics.render(JSON.stringify(data));
           },
           contentType: "application/json",
           dataType: 'json'
       });

        topics.hide_form();
    }
};  