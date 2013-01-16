var app  = require('app');
var BaseCollection = require('models/supers/base').Collection;
var Post = require('models/Post');
var AudioTrack = require('models/AudioTrack');

var handleError = require('lib/common').handleError;
var embedded = function (resource) {
	return resource._embedded;
};

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
			var track = new this.model(res);
			this.add(track);
			callback(null, track);
		}.bind(this);

		// var params = {
		// 	audiosearch: {
		// 		owner_id: ownerId,
		// 		audio_id: audioId
		// 	}
		// };

		// app.api.resource('audiosearch/audio', params, handleError(onLoad, onError));
		var params = {
			audios: ownerId + '_' + audioId
		};

		VK.Api.call('audio.getById', params, function (res) {
			if (res.response && res.response[0]) {
				onLoad(res.response[0]);
			} else {
				onError(res.response);
			}
		}, this);
	}
})

module.exports = Backbone.Collection.extend({
	model: Post,

	initialize: function () {
		this.tracks = new Tracks();
	},

	path: function () {
		return this.group.path() + '/wall';
	},

	parse: function (res) {
		return res.items;
	},

	next: function () {
		var path = _.isFunction(this.path) ? this.path() : this.path;
		var model = this;
		var options = {};
		app.api.resource(path + '/next', function (err, resource, status, xhr) {
			if (err) {
				if (options.error) options.error(model, xhr, options);
			}

			model.update(resource.items);
		});
	},

	sync: function (method, model, options) {
		var path = _.isFunction(this.path) ? this.path() : this.path;
		app.api.resource(path, function (err, resource, status, xhr) {
			if (err) {
				if (options.error) options.error(model, xhr, options);
				return model.trigger('error', model);
			}

			if (options.success) options.success(resource, status, xhr);
			model.trigger('sync', model, resource, options);
		});
	}
});