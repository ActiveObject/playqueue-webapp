var ListItem = require('views/ListItem');

module.exports = ListItem.extend({
	template: 'vkgroup',
	events: {
		'click': 'navigate'
	},

	navigate: function () {
		var url = '/groups/' + this.model.id;
		Backbone.history.navigate(url, { trigger: true });
	}
});