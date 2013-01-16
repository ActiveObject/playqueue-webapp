var Friend = require('models/Friend');
var app = require('app');

var embedded = function (resource) {
	return resource._embedded;
};

module.exports = Backbone.Collection.extend({
	model: Friend,
	path: 'friends',
	parse: function (res) {
		return _.values(embedded(res));
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