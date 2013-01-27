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
            
                // Event handlers will be independent of HTML tags. Onclick will be removed, coming soon...
                '<input value="Submit" type="button" name="do_submit" id="submit_button" onclick="app.submit_topic();"/>' +
                '<input value="Cancel" type="button" name="do_cancel" id="submit_cancel" onclick="app.hide_form();"/>' +
            '</form>';
        
        $('#submission_form').html(form);
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
    },

    // Reject the given piece of data for the given reason.
    reject: function(data, reason) {
        console.log("Invalid " + data.name + ": " + reason);
    },
    
    // Return a JSON stringyfied string representative of form_data
    // Pre: form_data has been validated
    jsonify: function(form_data) {
        var json_data = {};
        $.each(form_data, function(i, data) {
            json_data[data.name] = data.value;
        });
        return json_data;
    },
    
    // Send submission request to server, hiding the submission form afterwards
    submit_topic: function() {
        var form_data = $("#submission_form :input").serializeArray();

        // Alex: This is here since "each" returns from its own
        // scope, but we want to return from the scope of submit_topic.
        // Can anyone come up with a more elegant solution?
        var valid = true;
        $.each(form_data, function(i, data) {
            if (rejection_reason = app.validate(data)) {
                app.reject(data, rejection_reason);
                return valid = false;
            }
        });
        if (!valid) {
            return false;
        }

        var json_submission = this.jsonify(form_data);
        console.log(json_submission);

        // TODO: Set up server to accept data.
        // Submit data to server (Will report an error )
        /*   
            $.ajax({
               type: 'POST',
               url: '/topic/submit',
               data: json_submission, // Submission in JSON
               success: function(data) {},
               contentType: "application/json",
               dataType: 'json'
           });
        */
        this.hide_form();
    }
};  