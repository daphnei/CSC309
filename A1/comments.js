//  Global variable comments contains all comment functionality
var comments = {

	// I don't know what are the parameters of this function, but they will stem from the json data
	// Return a comment html string
	create: function(){ 
		// Magic with json data and strings...
	},

	// Place comment created from data on the corresponding node
	render: function(data, node_id){
		// Use create for the html string and jquery to append to the DOM
	},
    
    // Show the comment section for topic with the matching id
    show: function(section){
        
        // Get the id of the topic containing the comment section
        node_id = $(section).parent().parent().attr("id");
        
        // DEBUG: Proof that clicking on the topic returns the id of the topic
        console.log(node_id);
        
        var url = '/topic?id=' + node_id;
        
//        // Get comment data from server (will cause error if no server is present)
//        $.getJSON(url, function(data){
//            
//            // Populate DOM with comment data that came from server.
//			  // Look at each comment attached to the origin node (the topic)
//            $.each(data, function() {
//
//                // Append comments to the comment section of the topic
//				  // Recursively check whether or not that comment has a comment attached to it
//                
//            });
//        });
    }
};