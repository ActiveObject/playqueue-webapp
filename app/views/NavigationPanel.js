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
		'click #back-btn': 'back',
		'click #btn-queue': 'toggleQueue',
		'click #btn-play': 'togglePlay',
		'click #btn-next': 'next',
		'click #btn-prev': 'prev'
	},

	initialize: function () {
		this.menu = new Menu({ el: '#header-menu' });

		var playBtnEl = this.$el.find('#btn-play > div');

		app.queue.on('track:play track:resume', function () {
			playBtnEl.addClass('icon-appbarcontrolpause');
			playBtnEl.removeClass('icon-appbarcontrolplay');
		});

		app.queue.on('track:pause queue:end', function () {
			playBtnEl.addClass('icon-appbarcontrolplay');
			playBtnEl.removeClass('icon-appbarcontrolpause');
		});
	},

	togglePlay: function (e) {
		app.queue.togglePlay();
	},

	next: function () {
		app.queue.next();
	},

	prev: function () {
		app.queue.prev();
	},

	toggleQueue: function (e) {
		var btn = $(e.target);
		btn.toggleClass('active');
		var event = btn.hasClass('active') ? 'queue:show' : 'queue:hide';
		Backbone.Mediator.pub(event);
	},

	back: history.back.bind(history)
});