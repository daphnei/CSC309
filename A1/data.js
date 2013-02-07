var nodes = new Array();

function insertComment(content, root) {
	var node = {};
	
	node.type = "comment";
	node.content = content;
	node.vote_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
	node.root_id = root;

	nodes.push(node);
	return node;
}
/**
 * Inserts a node representing a topic
 * 
 * returns the new node
 */
function insertTopic(description, link) {
	var node = {};
	
	node.type = "topic";
	node.content = description;
	node.vote_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
	node.link = link
	
	nodes.push(node);
	return node;
}

exports.insertTopic = insertTopic;
exports.insertComment = insertComment;
exports.nodes = nodes;
