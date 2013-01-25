var app = require('app');
var SimpleLayout = require('layouts/SimpleLayout');
var renderCurrentTrack = require('templates/current-track');

var updateProgress = function (el) {
	return function (audio, track) {
		var progress = audio.position * 100 / audio.durationEstimate;
		el.width(progress + '%');
	};
};

var updateBuffered = function (el) {
	return function (audio, track) {
		var buffered = audio.buffered.reduce(function (duration, interval) {
			return duration + interval.end - interval.start;
		}, 0);
		var progress = buffered * 100 / audio.durationEstimate;
		el.width(progress + '%');
	};
};

var render = function (trackEl, playBtnEl, seekEl) {
	return function (audio, track) {
		var tmpl = renderCurrentTrack(track.toJSON());
		trackEl.html(tmpl);
		playBtnEl.addClass('icon-pause');
	};
};

var initSeeking = function (el) {
	el.off('mousedown');

	return function (audio, track) {
		var seek = function (event) {
			var percent  = event.offsetX / el.width();
			var position = audio.durationEstimate * percent;
			audio.setPosition(position);
		};

		el.on('mousedown', function () {
			el.on('mousemove', seek);
			el.one('mouseup', function (event) {
				el.off('mousemove', seek);
				seek(event);
			});
		});
	};
};

module.exports = SimpleLayout.extend({
	events: {
		'click #btn-queue': 'toggleQueue',
		'click #btn-play': 'play',
		'click #btn-next': 'next',
		'click #btn-prev': 'prev'
	},

	initialize: function () {
		var progressLineEl = this.$el.find('.progress-line');
		var loadingLineEl  = this.$el.find('.back-line');
		var trackEl   = this.$el.find('#played-track');
		var playBtnEl = this.$el.find('#btn-play');
		var seekEl    = this.$el.find('.progress');

		app.queue.on('play', initSeeking(seekEl));
		app.queue.on('play', render(trackEl, playBtnEl, seekEl));
		app.queue.on('timeupdate', updateProgress(progressLineEl));
		app.queue.on('loadupdate', updateBuffered(loadingLineEl));
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

	toggleQueue: function (e) {
		var btn = $(e.target);
		btn.toggleClass('active');
		var event = btn.hasClass('active') ? 'queue:show' : 'queue:hide';
		Backbone.Mediator.pub(event);
	}
});