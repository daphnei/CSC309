//  Global variable topics contains all topic functionality
var topics = {
    
    // Show the submission field on the frontpage
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
    
    // Hide the submission field on the frontpage
    hide_form: function () {
        $('#submission_form').html('');
    },
    
    // Check if the given piece of data is valid.
    // Returns nothing if valid, otherwise a rejection reason.
    validate: function(data) {
        if (!data.value) {
            return "You didn't fill in the field.";
        }

        if(data.value.length > 140) {
            return "Your title is too damn long!";
        }
    },

    // Reject the given piece of data for the given reason.
    reject: function(data, reason) {
        console.log("Invalid " + data.name + ": " + reason);
    },

    // Return json string describing topic 
    jsonify: function(form_data) {
        var json_data = {};

        // Pick necessary data only
        $.each(form_data, function(i, data) {
            json_data[data.name] = data.value;
        });

        // Convert into a json string
        return JSON.stringify(json_data);
    },
    
    // Return html string containing the structure of new a topic
    create: function(title, interest_link, total_points, comment_count){
        // Magic with string manipulation...
    },
    
    // Place topic created from data on the frontpage
    render: function(data) {
        // Use create and then use jQuery to render on DOM...  
    },
        
    // Send submission request to server, hiding the submission form afterwards
    submit: function() {
        
        // Place all fields into an array, where each element in a JS object
        var form_data = $('#submission_form :input').serializeArray(),
                valid = true;

        // Alex: This is here since "each" returns from its own
        // scope, but we want to return from the scope of submit.
        // Can anyone come up with a more elegant solution?
        $.each(form_data, function(i, data) {

            // Find out why the data is invalid
            rejection_reason = topics.validate(data);
            
            // Display reason upon failure
            if (rejection_reason) {
                topics.reject(data, rejection_reason);
                valid = false;
                return valid;
            }
        });

        // Submission cannot take place due to invalid data
        if (!valid) {
            return false;
        }

        // DEBUG:
        console.log(topics.jsonify(form_data));
        
//        // Submit data to server (Will report an error without a server)
//        $.ajax({
//            type: 'POST',
//            url: '/topic/submit',
//            data: form_data,
//            
//            // The server's response upon successfully sending the topic is the corresponding json string
//            success: function(data, textStatus, jqXHR) {
//                topics.render(data)
//            },
//            contentType: "application/json",
//            dataType: 'json'
//        });

        topics.hide_form();
    }
};  