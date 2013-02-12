var data = require("data")

/*topic1 = data.insertTopic("Is your unicorn dangerous?", "http://monsters.monstrous.com/unicorns.htm");
topic2 = data.insertTopic("Purple is the new pink.", "http://www.purpleunicorn.com/");
topic3 = data.insertTopic("Fairy princess dress up!", "http://www.girlgames4u.com/glitter-fairy-princess-dress-up-game.html");

data1comment1 = data.insertComment(topic1.id, "My baby angel would never lay a hoof on me.");
data1comment2 = data.insertComment(topic1.id, "'warlike fierceness?' What a horrible, lying article.");
data1comment3 = data.insertComment(data1comment2.id, "Unicorns are violent creatures. Don't be fool by their pinkness.");
data1comment4 = data.insert(topic1.id, "I have nothing to add to this discussion.");*/

$.ajax({
	type: 'POST',
	url: '/test_populate',
	data: JSON.stringify(toSend),
	contentType: "text/json",

	// The server's response upon successfully sending the topic is the corresponding json string
	success: function(form_data, textStatus, jqXHR) {
		console.log("Server response with:");
		console.log(form_data);
		topics.render(form_data)
	}
});
