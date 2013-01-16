module.exports = Backbone.Layout.extend({
	activate: function (layout) {
		this.$el.children('.item').removeClass('active');
		this.$el.children("#" + layout).addClass('active');
		this.trigger('activate', layout);
		return this;
	}
});