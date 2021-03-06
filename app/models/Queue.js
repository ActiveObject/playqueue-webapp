var AudioTrack = require('models/AudioTrack');
var app = require('app');
var fluent = require('lib/common').fluent;

var orderify = function (collection, offset) {
	return collection.map(function (track, i) {
		track.set('qorder', offset + i + 1);
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

		return this.trigger('swap', track1, track2);
	},

	clean: function () {
		this.forEach(function (track) {
			track.set('queued', false);
		});
		return this;
	},

	after: function (track) {
		var position = this.pluck('aid').indexOf(parseInt(track.id, 10));
		return this.at(position + 1);
	},

	before: function (track) {
		var position = this.pluck('aid').indexOf(parseInt(track.id, 10));
		return this.at(position - 1);
	},

	isLast: function (track) {
		return this.last() === track;
	},

	isFirst: function (track) {
		return this.first() === track;
	}
});

var doubleClick = function (fn, delay) {
	var clicks = 0;
	return function () {
		var args = Array.prototype.slice.call(arguments);
		var ctx = this;
		if (clicks === 0) {
			setTimeout(function () {
				fn.apply(ctx, args.concat(clicks));
				clicks = 0;
				inProgress = false;
			}, delay);
		}
		clicks += 1;
	};
};

var Queue = Backbone.Model.extend({
	repeat: false,

	initialize: function () {
		this.tracks = new Tracks();
		this.firstStart = true;
		this.tracks.on('add', function (model, collection) {
			if (!model.has('qorder')) {
				model.set('qorder', collection.size());
			}
			model.set('queued', true);
			console.log('[queue:add] id:%s, qorder:%d', model.id, model.get('qorder'));
		});

		this.on('track:finish', this.next, this);
	},

	add: function (tracks) {
		tracks = _.isArray(tracks) ? orderify(tracks, this.tracks.size()) : tracks;
		if (this.tracks.isEmpty()) {
			this.tracks.add(tracks);
			this.load(this.tracks.first());
		} else {
			this.tracks.add(tracks);
		}

		return this;
	},

	load: fluent(function (track) {
		if (this.firstStart) {
			this.firstStart = false;
		}

		if (this.track && this.track.id === track.id) {
			return this.track.togglePause();
		}

		this.trigger('audio:beforechange', track.audio, track, this);

		if (this.track) {
			this.track.pause(function (prevAudio) {
				prevAudio.destruct();
				track.play();
				this.trigger('audio:change', track, this);
			}.bind(this));
		} else {
			track.play();
			this.trigger('audio:change', track, this);
		}

		this.track = track;
	}),

	next: function () {
		if (this.tracks.isLast(this.track)) {
			if (this.repeat) {
				this.load(this.tracks.first());
			} else {
				this.track.pause();
				this.trigger('queue:end');
				console.log('[queue:end]');
			}
		} else {
			this.load(this.tracks.after(this.track));
		}

		return this;
	},

	prev: fluent(doubleClick(function (clicks) {
		if (clicks > 1) {
			if (this.tracks.isFirst(this.track)) {
				this.track.pause();
			} else {
				this.load(this.tracks.before(this.track));
			}
		} else {
			this.track.toStart();
		}
	}, 300)),

	reset: fluent(function () {
		this.tracks.trigger('beforereset');
		this.tracks.clean();
		this.tracks.reset();
	}),

	find  : function (id) { return this.tracks.get(id); },
	pause : function ()   { return this.track.pause();  },

	play: function () {
		if (this.tracks.isEmpty()) {
			this.tracks.clean();
			this.tracks.reset(orderify(app.user.library.models, 0));
			this.load(this.tracks.first());
		} else {
			this.track.play();
		}

		return this;
	},

	togglePlay: function () {
		if (this.firstStart) {
			this.tracks.clean();
			this.tracks.reset(orderify(app.user.library.models, 0));
			this.load(this.tracks.first());
		} else {
			this.track.togglePause();
		}
		return this;
	},

	shuffle: function () {
		var current = this.tracks.at(this.current);
		var shuffled = this.tracks.remove(current).shuffle();
		shuffled.unshift(current);
		this.tracks.reset(shuffled);
		this.current = 0;
		return this;
	}
});

module.exports = Queue;
