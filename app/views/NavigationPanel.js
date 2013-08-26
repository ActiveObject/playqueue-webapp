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
		var queueCountEl = this.$el.find('#btn-queue .count');

		app.queue.on('track:play track:resume', function () {
			playBtnEl.attr('data-icon', '\ue00f');
		});

		app.queue.on('track:beforepause queue:end', function () {
			playBtnEl.attr('data-icon', '\ue00d');
		});

		app.queue.tracks.on('add', function () {
			queueCountEl.addClass('active');
			queueCountEl.text(app.queue.tracks.size());
		});

		app.queue.tracks.on('reset', function () {
			queueCountEl.addClass('active');
			queueCountEl.text(app.queue.tracks.size());
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
		e.stopPropagation();
		app.view.queue.toggle();
	},

	back: history.back.bind(history)
});