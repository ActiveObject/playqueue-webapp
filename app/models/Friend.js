module.exports = Backbone.Model.extend({
	idAttribute: 'uid',

	path: function () {
		var path = _.isFunction(this.collection.path)
			? this.collection.path()
			: this.collection.path;

		return path + '/' + this.id;
	}
});