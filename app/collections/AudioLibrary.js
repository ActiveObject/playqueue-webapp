var app = require('app');
var AudioTrack = require('models/AudioTrack');
var handleError = require('lib/common').handleError;
var Album = require('models/Album');

var AudioLibrary = Backbone.Collection.extend({
	model: AudioTrack,

	initialize: function () {
		this.album = new Album({
			title: 'Всі аудіозаписи',
			album_id: 'library',
			tracks: this
		});
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

		app.vk.audio.get({ owner_id: options.user }, handleError(onLoad, onError));
	}
});

module.exports = AudioLibrary;
