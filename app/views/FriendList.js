var VkFriendView = require('views/VkFriendView');
var GridView     = require('views/GridView');

module.exports = GridView.extend({
	createItem: function (model) {
		return new VkFriendView({ model: model });
	}
});