var app = require('app');
var SimpleLayout = require('layouts/SimpleLayout');
var renderCurrentTrack = require('templates/current-track');

var updateProgress = function (el) {
	return function (audio, track) {
		var progress = audio.position / 1000 * 100 / track.get('duration');
		el.width(progress + '%');
	};
};

var updateBuffered = function (el) {
	return function (audio, track) {
		var buffered = audio.buffered.reduce(function (duration, interval) {
			return duration + interval.end - interval.start;
		}, 0);
		var progress = buffered / 1000 * 100 / track.get('duration');
		el.width(progress + '%');
	};
};

var render = function (trackEl) {
	return function (audio, track) {
		var tmpl = renderCurrentTrack(track.toJSON());
		trackEl.html(tmpl);
	};
};

var initSeeking = function (el) {
	el.off('mousedown');

	return function (audio, track) {
		var seek = function (event) {
			var percent  = event.offsetX / el.width();
			var position = track.get('duration') * percent * 1000;
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
	initialize: function () {
		var progressLineEl = this.$el.find('.progress-line');
		var loadingLineEl  = this.$el.find('.back-line');
		var trackEl   = this.$el.find('#played-track');
		var seekEl    = this.$el.find('.seek');

		app.queue.on('track:play', initSeeking(seekEl));
		app.queue.on('track:play', render(trackEl));
		app.queue.on('track:timeupdate', updateProgress(progressLineEl));
		app.queue.on('track:loadupdate', updateBuffered(loadingLineEl));
	}
});