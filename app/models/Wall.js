var app  = require('app');
var BaseCollection = require('models/supers/base').Collection;
var Post = require('models/Post');
var AudioTrack = require('models/AudioTrack');
var handleError = require('lib/common').handleError;

var Tracks = Backbone.Collection.extend({
	model: AudioTrack,

	loadTrack: function (audioId, ownerId, callback) {
		if (!callback) callback = function () {};

		if (!audioId) return callback(new Error('Empty audio id. Please provide audio id to loadTrack'));
		if (!ownerId) return callback(new Error('Empty owner id. Please provide audio id to loadTrack'));

		var onError = function (err) {
			var msg = '[error] Unable load track ' + audioId + ' from owner ' + ownerId;
			console.log(msg, err);
			callback(err);
		};

		var onLoad = function (res) {
			var track = new this.model(res[0]);
			this.add(track);
			callback(null, track);
		}.bind(this);

		app.vk.audio.getById({ audios: ownerId + '_' + audioId }, handleError(onLoad, onError));
	}
});

module.exports = Backbone.Collection.extend({
	model: Post,
	comparator: function (a, b) {
		return b.get('date') - a.get('date');
	},
	count: 20,

	initialize: function (models, options) {
		this.tracks = new Tracks();
		this.group = options.group;
		this.count = options.count;
	},

	parse: function (res) {
		var count = res[0];
		return res.slice(1);
	},

	sync: function (method, model, options) {
		var onError = function (err) {
			if (options.error) options.error(model, err, options);
			model.trigger('error', model);
		};

		var onLoad = function (res, status, xhr) {
			if (options.success) options.success(res, status, xhr);
			model.trigger('sync', model, res, options);
		};

		app.vk.wall.get({
			owner_id: -this.group.id,
			offset: this.length,
			count: this.count
		}, handleError(onLoad, onError));
	}
});