module.exports = Backbone.Model.extend({
	idAttribute: 'aid',
	volumeTransitionDuration: 500,

	createAudio: function (queue) {
		var track = this;
		var audio = soundManager.createSound({
			id: 't' + this.id,
			url: this.get('url'),
			autoLoad: true,
			volume: 0,
			onplay: function () {
				track.changeVolume(0, 100);
				queue.trigger('track:play', audio, track);
			},
			onpause: function () {
				queue.trigger('track:pause', audio, track);
			},
			onresume: function () {
				track.changeVolume(0, 100);
				queue.trigger('track:resume', audio, track);
			},
			onfinish: function () {
				queue.trigger('track:finish', audio, track);
			},
			whileplaying: function () {
				queue.trigger('track:timeupdate', audio, track);
			},
			whileloading: function () {
				queue.trigger('track:loadupdate', audio, track);
			},
			onbufferchange: function () {
				queue.trigger('track:bufferchange', audio, track);
			}
		});

		this.audio = audio;
		return audio;
	},

	changeVolume: function (from, to, callback) {
		callback = callback || function () {};
		var interval = 20;
		var steps = this.volumeTransitionDuration / interval;
		var transitionStep = (to - from) / steps;

		if (this.audio) {
			var timer = function (audio, volume, step) {
				if (step === 0) {
					return callback(audio);
				}
				audio.setVolume(volume);
				var next = timer.bind(null, audio, volume + transitionStep, step - 1);
				setTimeout(next, interval);
			};

			timer(this.audio, from + transitionStep, steps);
		}

		return this;
	},

	play: function () {
		if (typeof this.audio !== "undefined" && this.audio !== null) {
			this.audio.play();
		}

		return this;
	},

	pause: function (callback) {
		callback = callback || function () {};
		if (typeof this.audio !== "undefined" && this.audio !== null) {
			this.changeVolume(100, 0, function (audio) {
				audio.pause();
				callback(audio);
			});
		}

		return this;
	},

	togglePause: function () {
		if (typeof this.audio !== "undefined" && this.audio !== null) {
			if (this.audio.paused) {
				if (this.audio.playStatus === 1) {
					this.audio.resume();
				} else {
					this.audio.play();
				}
			} else {
				this.pause();
			}
		}

		return this;
	}
});