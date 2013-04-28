var app = require('app');
var handleError = require('lib/common').handleError;
var AudioTrack = require('models/AudioTrack');

var Tracks = Backbone.Collection.extend({
	model: AudioTrack,
	sync: function (method, model, options) {
		if (method === 'read') {
			var onError = function (err) {
				if (options.error) options.error(model, err, options);
				model.trigger('error', model);
			};

			var onLoad = function (res, status, xhr) {
				if (options.success) options.success(res, status, xhr);
				model.trigger('sync', model, res, options);
			};

			var opts = _.extend(options, { uid: app.vk.user });
			app.vk.audio.get(opts, handleError(onLoad, onError));
		}
	}
});

var isGroup = function (id) {
	return parseInt(id, 10) < 0;
};

module.exports = Backbone.Model.extend({
	idAttribute: 'album_id',
	initialize: function () {
		this.tracks = new Tracks();
		if (isGroup(this.get('owner_id'))) {
			var gid = Math.abs(parseInt(this.get('owner_id'), 10));
			this.url = '/groups/' + gid + '/albums/' + this.id;
		} else {
			this.url = 'albums/' + this.id;
		}
	},

	fetch: function () {
		var options = {
			album_id: this.get('album_id')
		};

		var owner = parseInt(this.get('owner_id'), 10);

		if (owner < 0) {
			options.gid = Math.abs(owner);
		} else {
			options.uid = owner;
		}

		this.tracks.fetch(options);
	}
});