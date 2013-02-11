var PostView = require('views/PostView');

var LazyLoad = function (el, offset, fn) {
	fn = fn || function () {};
	var parentWidth = el.parent().width();
	var prevOffset  = parentWidth;

	var paused = false;

	return {
		handler: function (event) {
			if (paused) return;

			var currOffset = el.width() - Math.abs(el.position().left) - parentWidth;
			var diff = prevOffset - currOffset;
			prevOffset = currOffset;

			console.log(currOffset, diff);

			if (currOffset < offset) {
				console.log('next');
				paused = true;
				fn();
			}
		},

		pause: function () {
			paused = true;
		},

		resume: function () {
			paused = false;
		}
	}
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
		var next   = this.collection.next.bind(this.collection);
		var loader = new LazyLoad(this.$el, 2000, next);

		this.collection.on('load', function () {
			console.log('load');
			loader.resume();
		});

		var onMove = _.throttle(loader.handler, 200);
		this.scroller = new iScroll('wall-layout', {
			vScroll: false,
			hScroll: true,
			hideScrollbar: true,
			vScrollbar: false,
			hScrollbar: false,
			handleClick: false,
			onScrollMove: onMove,
			onScrollEnd: onMove,
			wheelAction: 'scroll',
			useTransition: true,
			wheelHorizontal: true,
			wheelScale: 1/2
		});
	}
})