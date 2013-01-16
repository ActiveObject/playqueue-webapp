var app = require('app');
var ListItem   = require('views/ListItem');

module.exports = ListItem.extend({
	template: 'vkfriend',
	events: {
		'click': 'navigate'
	},

	navigate: function () {
		var url = '/friends/' + this.model.id;
		app.router.navigate(url, { trigger: true });
	}
});