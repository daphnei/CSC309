// Single global variable app containing all the frontend functionality
var app = {
    
    // Show the submission field on the frontpage
    show_form: function () {

        // HTML that creates the submission form
        var form = 
            '<form name="about_to_submit" id="super">' + 
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
            app.submit_topic();
        });
        
        $('input#submit_cancel').click(function(){
            app.hide_form();
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
            return "You didn't fill in the field."
        }

        if(data.value.length > 140) {
            return "Your title is too damn long!"
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
        
    // Send submission request to server, hiding the submission form afterwards
    submit_topic: function() {
        
        // Place all fields into an array, where each element in a JS object
        var form_data = $('#submission_form :input').serializeArray(),
                valid = true;

        // Alex: This is here since "each" returns from its own
        // scope, but we want to return from the scope of submit_topic.
        // Can anyone come up with a more elegant solution?
        $.each(form_data, function(i, data) {

            // Find out why the data is invalid
            if (rejection_reason = app.validate(data)) {
                app.reject(data, rejection_reason);
                return valid = false;
            }
        });

        // Submission cannot take place due to invalid data
        if (!valid) {
            return false;
        }

        // DEBUG:
        console.log(this.jsonify(form_data));
        
//        // Submit data to server (Will report an error without a server)
//        $.ajax({
//            type: 'POST',
//            url: '/topic/submit',
//            data: form_data,
//            success: function(form_data) {this.render_topic(form_data)}, 
//            contentType: "application/json",
//            dataType: 'json'
//        });

        this.hide_form();
    }
};  