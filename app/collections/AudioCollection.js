var app = require('app');

var BaseCollection = require('models/supers/base').Collection;
var AudioTrack = require('models/AudioTrack');

var handleError = require('lib/common').handleError;

module.exports = BaseCollection.extend({
	model: AudioTrack,
	sync: function (method, model, options) {
		var onError = function (err) {
			if (options.error) options.error(model, err, options);
			model.trigger('error', model);
		};

		var onLoad = function (res, status, xhr) {
			if (options.success) options.success(res, status, xhr);
			model.trigger('sync', model, res, options);
		};

		app.vk.audio.get({ uid: app.vk.user }, handleError(onLoad, onError));
	}
});