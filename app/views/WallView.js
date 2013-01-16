var PostView = require('views/PostView');

var onScroll = function (el, fn, offset) {
	fn = fn || function () {};
	var parentWidth = el.parent().width();

	return function (event) {
		if ((el.width() + el.position().left) < (parentWidth + offset)) {
			fn();
		}
	};
};

module.exports = Backbone.Layout.extend({
	className: 'wall',
	initialize: function () {
		this.collection.on('add', this.add, this);
		this.collection.on('reset', this.reset, this);
	},

	reset: function () {
		this.$el.empty();
		this.collection.forEach(this.add, this);
	},

	add: function (post) {
		var view = new PostView({ model: post });
		this.insertView(view);
		view.render();

		var contW = this.$el.width();
		view.$el.css({ left: contW + 'px' });
		this.$el.width(this.$el.width() + view.$el.width());
		this.scroller.refresh();
	},

	afterRender: function () {
		var next = this.collection.next.bind(this.collection);
		var onMove = _.throttle(onScroll(this.$el, next, 500), 1000);
		this.scroller = new iScroll('wall-layout', {
			vScroll: false,
			hScroll: true,
			hideScrollbar: true,
			vScrollbar: false,
			hScrollbar: false,
			handleClick: false,
			// onScrollMove: onMove,
			// onScrollEnd: onMove,
			wheelAction: 'scroll'
		});
	}
})