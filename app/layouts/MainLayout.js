module.exports = Backbone.Layout.extend({
	initialize: function () {
		this.$el.find('.content-overlay').on('click', function () {
			history.back();
		});
	},

	activate: function (layout) {
		switch (layout) {
			case 'queue':
				this.blind();
				this.$el.children('#queue').addClass('active');
				break;
			case 'tracklist':
				this.blind();
				this.$el.children('#tracklist').addClass('active');
				break;
			default:
				this.unblind();
				this.$el.children('#tracklist').removeClass('active');
				this.$el.children('#queue').removeClass('active');
				this.$el.children('.item').removeClass('active');
				this.$el.children("#" + layout).addClass('active');
		}

		this.trigger('activate', layout);
		return this;
	},

	blind: function () {
		this.$el.children('.content-overlay').addClass('active');
		this.$el.find('.item.active').addClass('blind');
	},

	unblind: function () {
		this.$el.children('.content-overlay').removeClass('active');
		this.$el.find('.item.active').removeClass('blind');
	}
});