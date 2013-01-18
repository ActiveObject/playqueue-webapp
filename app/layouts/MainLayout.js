module.exports = Backbone.Layout.extend({
	tracklistVisible: false,
	activate: function (layout) {
		if (this.tracklistVisible) {
			this.hideTracklist();
		}

		this.$el.children('.item').removeClass('active');
		this.$el.children("#" + layout).addClass('active');
		this.trigger('activate', layout);
		return this;
	},

	showTracklist: function () {
		this.tracklistVisible = true;
		this.$el.children('#tracklist').addClass('active');
		this.$el.children('.content-overlay').addClass('active');
		this.$el.find('.item.active').addClass('blind');
	},

	hideTracklist: function () {
		this.tracklistVisible = false;
		this.$el.children('#tracklist').removeClass('active');
		this.$el.children('.content-overlay').removeClass('active');
		this.$el.find('.item.active').removeClass('blind');
	}
});