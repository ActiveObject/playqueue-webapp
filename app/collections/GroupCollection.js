var BaseCollection = require('models/supers/base').Collection;
var Group = require('models/Group');
var app = require('app');
var handleError = require('lib/common').handleError;

module.exports = Backbone.Collection.extend({
	model: Group,
	parse: function (res) {
		var count = res[0];
		return res.slice(1);
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

		// TODO: handle case where user has more than 100 groups
		app.vk.groups.get({
			user_id: app.vk.user,
			extended: 1,
			offset: 0,
			count: 100
		}, handleError(onLoad, onError));
	}
});