var app = require('app');
var GridItem = require('views/GridItem');

module.exports = GridItem.extend({
	template: 'vkfriend',
	events: {
		'click': 'navigate'
	},

	navigate: function () {
		var url = '/friends/' + this.model.id;
		app.router.navigate(url, { trigger: true });
	}
});