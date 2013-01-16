var VkFriendView        = require('views/VkFriendView');
var ScrollableGridView = require('views/ScrollableGridView');

module.exports  = ScrollableGridView.extend({
	initialize: function () {
		ScrollableGridView.prototype.initialize.apply(this, arguments);
	},

	createItem: function (model) {
		return new VkFriendView({ model: model });
	}
});