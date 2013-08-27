var GridItem = require('views/GridItem');

module.exports = GridItem.extend({
	template: 'vkgroup',
	events: {
		'click': 'navigate'
	},

	navigate: function () {
		var url = '/groups/' + this.model.id;
		Backbone.history.navigate(url, { trigger: true });
	}
});