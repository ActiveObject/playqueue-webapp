module.exports = Backbone.Layout.extend({
	show: function () {
		this.$el.addClass('active');
	},

	hide: function () {
		this.$el.removeClass('active');
	}
});