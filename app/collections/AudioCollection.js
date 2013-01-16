var BaseCollection = require('models/supers/base').Collection;
var AudioTrack = require('models/AudioTrack');
var app = require('app');

module.exports = BaseCollection.extend({
	model: AudioTrack,
	path: 'library',
	parse: function (res) {
		return res.tracks;
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