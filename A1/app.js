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
    // validate: function(data) {
    //     if (!data.value) {
    //         return "You didn't fill in the field."
    //     }
    // },

    // Reject the given piece of data for the given reason.
    // reject: function(data, reason) {
    //     console.log("Invalid " + data.name + ": " + reason);
    // },

    // Return true if the data present in the field is valid, false otherwise
    field_check: function(data) {
        var result = true;
        
        // Values in the field cannot be pass 140 characters
        if(data.value.length > 140 || data.value.length === 0) {
            result = false;
            console.log('Data not valid');
        }
        
        return result;
    },
        
    // Send submission request to server, hiding the submission form afterwards
    submit_topic: function() {
        
        // Place all fields into an array, where each element in a JS object
        var form_data = $('#submission_form :input').serializeArray();

        // Alex: This is here since "each" returns from its own
        // scope, but we want to return from the scope of submit_topic.
        // Can anyone come up with a more elegant solution?
        // var valid = true;
        // $.each(form_data, function(i, data) {
        //     if (rejection_reason = app.validate(data)) {
        //         app.reject(data, rejection_reason);
        //         return valid = false;
        //     }
        // });
        // if (!valid) {
        //     return false;
        // }

        // Go through every field and check for valid length. 
        // Exit if any input if any input is invalid
        $.each(form_data, function(i, data){
            if(!app.field_check(data)) {
                
                // For some reason this isn't exiting...
                return false;
            }
        });

        // DEBUG: The form data isn't perfect, but the necessary info can be extrapolated for making a topic
        // It could also be fixed by fiddling with the form
        console.log(JSON.stringify(form_data));
        
//        // Submit data to server (Will report an error without a server)
//        $.ajax({
//            type: 'POST',
//            url: '/topic/submit',
//            data: JSON.stringify(form_data),
//            success: function(form_data) {this.render_topic(form_data)}, 
//            contentType: "application/json",
//            dataType: 'json'
//        });

        this.hide_form();
    }
};  