var VkAlbumView = require('views/VkAlbumView');
var GridView = require('views/GridView');

module.exports = GridView.extend({
	el: '#albums',
	keep: true,
	createItem: function (model) {
		return new VkAlbumView({ model: model });
	}
});