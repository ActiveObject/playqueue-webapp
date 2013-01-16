var BaseModel = require('models/supers/base').Model;
var Wall = require('models/Wall');

module.exports = Backbone.Model.extend({
	idAttribute: 'gid',

	initialize: function () {
		this.wall = new Wall();
		this.wall.group = this;
	},

	path: function () {
		var path = _.isFunction(this.collection.path)
			? this.collection.path()
			: this.collection.path;

		return path + '/' + this.get('screen_name');
	}
});