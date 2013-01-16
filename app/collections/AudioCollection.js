var BaseCollection = require('models/supers/base').Collection;
var AudioTrack = require('models/AudioTrack');
var app = require('app');

module.exports = BaseCollection.extend({
	model: AudioTrack,
	path: 'library',
	parse: function (res) {
		return res.response;
	},

	sync: function (method, model, options) {
		var url = 'https://api.vk.com/method/audio.get?callback=?';
		var params = {
			uid: localStorage.user_id,
			access_token: localStorage.access_token
		};

		$.getJSON(url, params, function (res, status, xhr) {
			if (res.response) {
				if (options.success) options.success(res, status, xhr);
				model.trigger('sync', model, res, options);
			} else {
				if (options.error) options.error(model, xhr, options);
				model.trigger('error', model);
			}
		});
	}
});