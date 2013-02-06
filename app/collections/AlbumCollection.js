var BaseCollection = require('models/supers/base').Collection;
var Album = require('models/Album');
var app = require('app');
var handleError = require('lib/common').handleError;

var modelProp = function (prop) {
	return function (obj) {
		return obj.get(prop);
	};
};

module.exports = Backbone.Collection.extend({
	model: Album,
	path: 'albums',
	parse: function (res) {
		return [{
			title: 'Всі аудіозаписи',
			album_id: 'all'
		}].concat(res.slice(1));
		// return res.slice(1);
	},

	initialize: function () {
		// this.add(new Album({
		// 	title: 'Всі аудіозаписи',
		// 	album_id: 'all'
		// }));

		this.on('reset', function (collection) {
			async.forEach(collection.models, function (album) {
				album.fetch();
			});
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

		app.vk.audio.getAlbums(options.query, handleError(onLoad, onError));
	}
});