//  Global variable comments contains all comment functionality
var comments = {
    
    // Show the comment section for topic with the matching id
    show: function(section){
        
        // Get the id of the topic containing the comment section
        topic_id = $(section).parent().parent().attr("id");
        
        // Debug:
        console.log(topic_id);
        
        var url = '/topic?id=' + topic_id;
        
//        // Get comment data from server (will cause error if no server is present)
//        $.getJSON(url, function(data){
//            
//            // Populate DOM with comment data that came from server
//            $.each(data, function() {
//                
//                // Append stuff to the DOM
//                
//            });
//        });
    }
};