module.exports = Backbone.Layout.extend({
	initialize: function () {
		this.$el.find('.content-overlay').on('click', function () {
			history.back();
		});
	},

	activate: function (layout) {
		if (!layout.hasRendered) {
			layout.render();
		}

		this.getView(function (nestedView) {
			if (nestedView.$el.parent().is('.active')) {
				nestedView.trigger('deactivate');
				nestedView.$el.parent().removeClass('active');
			}
		});

		layout.$el.parent().addClass('active');
		layout.trigger('activate');
		this.trigger('activate', layout);
		return this;
	}
});
