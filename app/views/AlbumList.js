var VkAlbumView        = require('views/VkAlbumView');
var ScrollableGridView = require('views/ScrollableGridView');

module.exports  = ScrollableGridView.extend({
	initialize: function () {
		ScrollableGridView.prototype.initialize.apply(this, arguments);
	},

	createItem: function (model) {
		return new VkAlbumView({ model: model });
	}
});