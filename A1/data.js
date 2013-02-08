var nodes = new Array();

function insertComment(content, root) {
	var node = {};
	
	node.type = "comment";
	node.content = content;
	node.vote_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
	node.root_id = root;
	
	//adds the new node's id to the list of children_ids for its parent
	if(node.root_id < nodes.length) {
		nodes[node.root_id].children_ids.push(node.id);
	}
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
	node.link = link;
	
	nodes.push(node);
	return node;
}

/**
 * Raises the vote count for the comment node specified 
 * 
 * returns the node whose vote count was raised
 */
function upvote(id) {
	var node = nodes[id];
	node.vote_count++;
	//increase the root topic's vote count as well
	nodes[node.root_id].vote_count++;
	return node;
}

exports.upvote = upvote;
exports.insertTopic = insertTopic;
exports.insertComment = insertComment;
exports.nodes = nodes;
