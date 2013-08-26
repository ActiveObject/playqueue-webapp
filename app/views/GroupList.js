var VkGroupView = require('views/VkGroupView');
var GridView    = require('views/GridView');

module.exports  = GridView.extend({
	keep: true,
	createItem: function (model) {
		return new VkGroupView({ model: model });
	}
});
