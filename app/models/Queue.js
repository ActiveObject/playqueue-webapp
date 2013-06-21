var AudioTrack = require('models/AudioTrack');
var curry = require('lib/common').curry;
var app = require('app');

var nextTrack = function (tracks, track) {
	var position = tracks.pluck('aid').indexOf(parseInt(track.id, 10));
	return tracks.at(position + 1);
};

var prevTrack = function (tracks, track) {
	var position = tracks.pluck('aid').indexOf(parseInt(track.id, 10));
	return tracks.at(position - 1);
};

var isLast = function (tracks, track) {
	return tracks.last() === track;
};

var isFirst = function (tracks, track) {
	return tracks.first() === track;
};

var load = function (queue) {
	return function (track) {
		var audio = soundManager.createSound({
			id: 't' + track.id,
			url: track.get('url'),
			autoLoad: true,
			onplay: function () {
				queue.trigger('track:play', audio, track);
			},
			onpause: function () {
				queue.trigger('track:pause', audio, track);
			},
			onresume: function () {
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

		audio.play({
			onfinish: next(queue)
		});

		if (queue.audio) {
			queue.audio.destruct();
		}

		delete queue.audio;
		delete queue.track;

		queue.audio = audio;
		queue.track = track;

		return queue;
	};
};

var next = function (queue) {
	return function () {
		if (isLast(queue.tracks, queue.track)) {
			if (queue.repeat) {
				load(queue)(queue.tracks.first());
			} else {
				queue.audio.pause();
				queue.trigger('queue:end');
				console.log('[queue:end]');
			}
		} else {
			load(queue)(nextTrack(queue.tracks, queue.track));
		}
	};
};

var prev = function (queue) {
	return function () {
		if (queue.audio.position < queue.prevActionDelay) {
			if (isFirst(queue.tracks, queue.track)) {
				queue.audio.pause();
			} else {
				load(queue)(prevTrack(queue.tracks, queue.track));
			}
		} else {
			queue.audio.setPosition(0);
		}
	};
};

var reset = function (queue) {
	queue.tracks.trigger('beforereset');
	queue.tracks.clean();
	queue.tracks.reset();
};

var add = function (queue) {
	return function (tracks) {
		if (queue.audio && queue.audio.paused) reset(queue);

		if (queue.tracks.isEmpty()) {
			queue.tracks.add(tracks);
			load(queue)(queue.tracks.first());
		} else {
			queue.tracks.add(tracks);
		}

		return queue;
	};
};

var bind = function (fn) {
	return function () {
		return fn(this).apply(null, arguments);
	};
};

var orderify = function (collection) {
	return collection.map(function (track, i) {
		track.set('qorder', i + 1);
		track.set('queued', true);
		return track;
	});
};

var Tracks = Backbone.Collection.extend({
	comparator: function (track) {
		return track.get('qorder');
	},

	swap: function (track1, track2) {
		var o1 = track1.get('qorder');
		var o2 = track2.get('qorder');

		track1.set('qorder', o2);
		track2.set('qorder', o1);

		this.trigger('swap', track1, track2);
	},

	clean: function () {
		this.forEach(function (track) {
			track.set('queued', false);
		});
	}
});

var Queue = Backbone.Model.extend({
	repeat: false,
	prevActionDelay: 5000,

	initialize: function () {
		this.tracks = new Tracks();
		this.tracks.on('add', function (model, collection) {
			model.set('qorder', collection.size());
			model.set('queued', true);
			console.log('[queue:add] id:%s, qorder:%d', model.id, model.get('qorder'));
		});
	},

	add   : bind(add),
	load  : bind(load),
	next  : bind(next),
	prev  : bind(prev),

	pause : function ()   { return this.audio.pause();  },
	find  : function (id) { return this.tracks.get(id); },

	play: function () {
		if (this.tracks.isEmpty()) {
			this.tracks.clean();
			this.tracks.reset(orderify(app.library.models));
			load(this)(this.tracks.first());
		} else {
			this.audio.play();
		}
	},

	togglePlay: function () {
		if (this.tracks.isEmpty()) {
			this.tracks.clean();
			this.tracks.reset(orderify(app.library.models));
			load(this)(this.tracks.first());
		} else {
			this.audio.togglePause();
		}
	},

	shuffle: function () {
		var current = this.tracks.at(this.current);
		var shuffled = this.tracks.remove(current).shuffle();
		shuffled.unshift(current);
		this.tracks.reset(shuffled);
		this.current = 0;
	}
});

module.exports = Queue;