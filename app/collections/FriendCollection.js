var Friend = require('models/Friend');
var app = require('app');
var handleError = require('lib/common').handleError;

var fields = ['uid', 'first_name', 'last_name',
	'photo_200', 'photo_200_orig', 'screen_name'].join(',');

module.exports = Backbone.Collection.extend({
	model: Friend,
	sync: function (method, model, options) {
		var onError = function (err) {
			if (options.error) options.error(model, err, options);
			model.trigger('error', model);
		};

		var onLoad = function (res, status, xhr) {
			if (options.success) options.success(res, status, xhr);
			model.trigger('sync', model, res, options);
		};

		// TODO: handle case where user has more than 100 friends
		app.vk.friends.get({
			user_id: options.user,
			order: 'hints',
			fields: fields,
			offset: 0,
			count: 100
		}, handleError(onLoad, onError));
	}
});