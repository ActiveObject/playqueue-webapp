var app = require('app');
var SimpleLayout = require('layouts/SimpleLayout');
var renderMenu = require('templates/header-menu');

var Menu = Backbone.View.extend({
	events: {
		'click .title': 'toggle',
		'click li': 'toggle'
	},

	render: function (menu) {
		this.$el.html(renderMenu(menu));
	},

	toggle: function () {
		this.$el.toggleClass('active');
	}
});

module.exports = SimpleLayout.extend({
	events: {
		'click #back-btn': 'back'
	},

	initialize: function () {
		this.menu = new Menu({ el: '#header-menu' });
	},

	back: history.back.bind(history)
});