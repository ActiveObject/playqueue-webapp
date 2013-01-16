var SimpleLayout = require('layouts/SimpleLayout');

module.exports = SimpleLayout.extend({
	activate: function (layout) {
		this.$el.children().removeClass('active');
		this.$el.children("#" + layout).addClass('active');
		this.trigger('activate', layout);
		return this;
	},

	shift: function () {
		this.$el.addClass('shifted');
		Backbone.Mediator.pub('content:resized', this);
	},

	unshift: function () {
		this.$el.removeClass('shifted');
		Backbone.Mediator.pub('content:resized', this);
	}
});