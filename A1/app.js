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
    
    // Return true if the data present in the field is valid, false otherwise
    valid_check: function(data) {
        console.log('Look, I am checking ' + data.value + ' Well, I will be soon.');
        return true;
    },
    
    // Return a JSON stringyfied string representative of form_data
    make_into_json: function(form_data) {
        console.log('Converting form data into JSON... well not yet. It still needs to be implemented');
    },
    
    // Send submission request to server. Hide submission form
    submit_topic: function() {
        var form_data = $("#submission_form :input").serializeArray();
        
        $.each(form_data, function(i, data){
            if(!app.valid_check(data)) {
                console.log('Data not valid');
                return false;
            }
        });
        
        var json_submission = this.make_into_json(form_data);
        
        // Submit data to server (Will report an error )
//            $.ajax({
//                type: 'POST',
//                url: '/topic/submit',
//                data: json_submission, // Submission in JSON
//                success: function(data) {},
//                contentType: "application/json",
//                dataType: 'json'
//            });
//                        
        this.hide_form();
    }
};  