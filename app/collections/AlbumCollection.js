var Album = require('models/Album');
var app = require('app');
var handleError = require('lib/common').handleError;

module.exports = Backbone.Collection.extend({
	fetch: function (user) {
		var collection = this;
		app.vk.audio.getAlbums({ owner_id: user }, function (err, res, status, xhr) {
			if (err) return collection.trigger('error', err);
			var albums = res.slice(1).map(function (attrs) { return new Album(attrs); });
			async.forEach(albums, function (album, callback) {
				album.fetch({
					success: function () {
						collection.add(album);
						callback(null);
					},
					error: function (err) { callback(err); }
				})
			}, function (err) {
				if (err) return collection.trigger('error', err);
			});
		});
	}
});
