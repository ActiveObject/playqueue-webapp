module.exports = Backbone.View.extend({
	initialize: function () {
		this.views = [];

		this.$el.find('.content-overlay').on('click', function () {
			history.back();
		});
	},

	activate: function (view, append) {
		if (!view.hasRendered) {
			view.render();
			if (append) {
				this.$el.append(view.el);
			}
		}

		this.views.forEach(function (nestedView) {
			if (nestedView.$el.is('.active')) {
				nestedView.trigger('deactivate');
				nestedView.$el.removeClass('active');
			}
		});

		view.$el.addClass('active');
		view.trigger('activate');
		this.trigger('activate', view);
		return this;
	},

	add: function (view) {
		this.views.push(view);
		return this;
	},

	remove: function (view) {
		return this;
	}
});
