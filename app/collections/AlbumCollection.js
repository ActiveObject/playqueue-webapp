var BaseCollection = require('models/supers/base').Collection;
var Album = require('models/Album');
var app = require('app');

var modelProp = function (prop) {
	return function (obj) {
		return obj.get(prop);
	};
};

module.exports = Backbone.Collection.extend({
	model: Album,
	path: 'albums',
	parse: function (res) {
		var specialAlbums = [{
			title: 'Всі аудіозаписи',
			album_id: 'all'
		}, {
			title: 'Без альбому',
			album_id: 'undefined'
		}];

		return specialAlbums.concat(res.items);
	},

	initialize: function () {
		Backbone.Mediator.sub('library:update', this.updateCollection, this);
	},

	updateCollection: function (audios) {
		var albums = audios.groupBy(modelProp('album'));

		this.get('all').tracks.reset(audios.models);

		_(albums).forEach(function updateAlbums(tracks, albumId) {
			var model = this.get(albumId);
			if (model) { model.tracks.reset(tracks); }
		}, this);
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