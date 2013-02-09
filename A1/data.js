var nodes = new Array();

function insertComment(content, root) {
	var node = {};
	
	node.type = "comment";
	node.content = content;
	node.vote_count = 0;
    node.child_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
  
    // this is the ID of the immediate parent, NOT the root of the tree
	node.root_id = root;
	
	// adds the new node's id to the list of children_ids for its parent
	if(node.root_id < nodes.length) {
		nodes[node.root_id].children_ids.push(node.id);
	}

    // correct the comment counts of all parent comments
    var pid = root;
    while (!(pid === null)) {
        nodes[pid].child_count += 1;
        console.log("Incrementing " + pid + "'s vote count.");
        pid = nodes[pid].root_id;
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
    node.child_count = 0;
	node.id = nodes.length;
	node.children_ids = new Array();
	node.link = link;
    node.root_id = null;
	
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
	// increase the root topic's vote count as well, since the topic
  // vote count is a sum of all the comment vote counts.
	nodes[getOriginID(id)].vote_count++;

	// reorder the parents children by vote_count
	nodes[node.root_id].children_ids.sort(compareVoteCounts);
	return node;
}

/**
 * Finds the id of the root of the tree this node belongs to, i.e. the
 * topic associated with this comment.
 * Returns its own id if the node is a topic, null if the id is invalid.  
 */

function getOriginID(id) {
  if (!isValid(id)) {
    return null;
  }
  else {
    
    // go up the tree until we hit a node with no parent. That's the origin.
    var origin_id = id;
    while (nodes[origin_id].root_id != null) {
      origin_id = nodes[origin_id].root_id;
    }

    return origin_id;
  }
}

/**
 *  Used by the sort method to sort to sort nodes by vote_count
 */
function compareVoteCounts(index1, index2) {
  if (nodes[index1].vote_count > nodes[index2].vote_count)
     return -1;
  if (nodes[index1].vote_count < nodes[index2].vote_count)
    return 1;
  return 0;
}

function isValid(id) {
	return !(id === null || id < 0 || id >= nodes.length);
}

exports.upvote = upvote;
exports.insertTopic = insertTopic;
exports.insertComment = insertComment;
exports.nodes = nodes;
exports.isValid = isValid;
