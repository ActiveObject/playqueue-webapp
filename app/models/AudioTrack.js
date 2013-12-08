var app = require('app');
var fluent = require('lib/common').fluent;

module.exports = Backbone.Model.extend({
	idAttribute: 'aid',
	volumeTransitionDuration: 500,
	hangingDelay: 1000,

	createAudio: function () {
		var track = this;
		var audio = soundManager.createSound({
			id: 't' + this.id,
			url: this.get('url'),
			autoLoad: true,
			volume: 0,
			onplay: function () {
				track.changeVolume(0, 100);
				track._trackHangingState(audio);
				app.queue.trigger('track:play', audio, track);
			},
			onpause: function () {
				track._untrackHangingState(audio);
				app.queue.trigger('track:pause', audio, track);
			},
			onresume: function () {
				track._trackHangingState(audio);
				track.changeVolume(0, 100);
				app.queue.trigger('track:resume', audio, track);
			},
			onfinish: function () {
				track.finish();
			},
			whileplaying: function () {
				track.trigger('timeupdate', audio);
				app.queue.trigger('track:timeupdate', audio, track);
			},
			whileloading: function () {
				app.queue.trigger('track:loadupdate', audio, track);
			},
			onbufferchange: function () {
				app.queue.trigger('track:bufferchange', audio, track);
			}
		});

		return this._audio = audio;
	},

	audio: function () {
		return this._audio ? this._audio : this.createAudio();
	},

	changeVolume: fluent(function (from, to, callback) {
		callback = callback || function () {};
		var interval = 20;
		var steps = this.volumeTransitionDuration / interval;
		var transitionStep = (to - from) / steps;

		if (this.audio()) {
			var timer = function (audio, volume, step) {
				if (step === 0) {
					return callback(audio);
				}
				audio.setVolume(volume);
				var next = timer.bind(null, audio, volume + transitionStep, step - 1);
				setTimeout(next, interval);
			};

			timer(this.audio(), from + transitionStep, steps);
		}
	}),

	play: fluent(function () {
		if (this.audio().playStatus === 1) {
			this.audio().resume();
		} else {
			this.audio().play();
		}
	}),

	pause: fluent(function (callback) {
		callback = callback || function () {};
		app.queue.trigger('track:beforepause', this.audio(), this);
		this.changeVolume(100, 0, function (audio) {
			audio.pause();
			callback(audio);
		});
	}),

	togglePause: fluent(function () {
		if (this.audio().paused) {
			this.play();
		} else {
			this.pause();
		}
	}),

	toStart: fluent(function () {
		this.audio().setPosition(0);
	}),

	finish: function () {
		this._untrackHangingState();
		app.queue.trigger('track:finish', this.audio(), this);
	},

	_trackHangingState: function (audio) {
		var track = this;
		var check = function (pos, bytesLoaded, max, attemp) {
			track._hangingTimeout = setTimeout(function () {
				if (attemp === max) return track.finish();
				if (!audio.position) return check(audio.position, audio.bytesLoaded, max, 0);
				if (+audio.position === +pos && audio.bytesLoaded === bytesLoaded) {
					return check(audio.position, audio.bytesLoaded, max, attemp + 1);
				}
				return check(audio.position, audio.bytesLoaded, max, 0);
			}, track.hangingDelay);
		};

		this._untrackHangingState();
		check(audio.position, audio.bytesLoaded, 5, 0);
	},

	_untrackHangingState: function () {
		this._hangingTimeout && clearTimeout(this._hangingTimeout);
	}
});
