var app = require('app');
var handleError = require('lib/common').handleError;
var AudioTrack = require('models/AudioTrack');

var Tracks = Backbone.Collection.extend({
	model: AudioTrack,
	sync: function (method, model, options) {
		if (method === 'read' && !model.nosync) {
			var onError = function (err) {
				if (options.error) options.error(model, err, options);
				model.trigger('error', model);
			};

			var onLoad = function (res, status, xhr) {
				if (options.success) options.success(res, status, xhr);
				model.trigger('sync', model, res, options);
			};

			app.vk.audio.get({
				album_id: options.album,
				owner_id: options.user
			}, handleError(onLoad, onError));
		}
	}
});

var Album = Backbone.Model.extend({
	idAttribute: 'album_id',
	initialize: function (options) {
		this.tracks = options.tracks || new Tracks();
		this.url = 'albums/' + this.id;
		this.tracks.on('add remove', function (model, collection) {
			this.set('length', collection.length);
		}, this);
		this.tracks.on('reset', function (collection) {
			this.set('length', collection.length);
		}, this);
	},

	fetch: function (options) {
		this.tracks.fetch(_.extend(options, { album: this.id }));
	}
});

module.exports = Album;