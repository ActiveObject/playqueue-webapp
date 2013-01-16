var app = require('app');
var SimpleLayout = require('layouts/SimpleLayout');
var renderCurrentTrack = require('templates/current-track');

module.exports = SimpleLayout.extend({
	events: {
		'click #btn-queue': 'toggleQueue',
		'click #btn-play': 'play',
		'click #btn-next': 'next',
		'click #btn-prev': 'prev'
	},

	initialize: function () {
		this.progressLineEl = this.$el.find('.progress-line');
		this.loadingLineEl  = this.$el.find('.back-line');
		app.queue.on('play', this.onPlay, this);
	},

	play: function (e) {
		var btn = $(e.srcElement);
		if (btn.hasClass('icon-pause')) {
			app.queue.pause();
			btn.addClass('icon-play');
			btn.removeClass('icon-pause');
		} else {
			app.queue.play();
			btn.addClass('icon-pause');
			btn.removeClass('icon-play');
		}
	},

	next: function () {
		app.queue.next();
	},

	prev: function () {
		app.queue.prev();
	},

	onPlay: function (audio, track) {
		var tmpl = renderCurrentTrack(track.toJSON());

		$(audio).on('timeupdate', this.onTimeupdate.bind(this, audio, this.progressLineEl));
		// $(audio).on('progress',	this.updateLoadingState.bind(this, audio, this.loadingLineEl));

		this.$el.find('#played-track').html(tmpl);
		this.$el.find('#btn-play').addClass('icon-pause');
	},

	onTimeupdate: function (audio, el) {
		var progress = audio.currentTime * 100 / audio.duration;
		el.width(progress + '%');
	},

	updateLoadingState: function (audio, el) {
		var loaded = audio.buffered.end(0) * 100 / audio.duration;
		el.width(loaded + '%');
	},

	toggleQueue: function (e) {
		var btn = $(e.target);
		btn.toggleClass('active');
		var event = btn.hasClass('active') ? 'queue:show' : 'queue:hide';
		Backbone.Mediator.pub(event);
	}
});