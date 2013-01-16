module.exports = Backbone.Layout.extend({
	tagName: 'li',
	data: function () {
		return this.model.toJSON();
	}
});