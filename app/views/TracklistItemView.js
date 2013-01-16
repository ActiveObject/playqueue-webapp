module.exports = Backbone.Layout.extend({
	template: 'tracklist-item',
	tagName: 'li',
	data: function () {
		return this.model.toJSON();
	},

	initialize: function () {
		Backbone.View.prototype.initialize.apply(this, arguments);
		this.model.on('change:queued', this.render.bind(this));
	}
});
