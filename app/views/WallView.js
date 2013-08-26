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
	el: false,
	template: 'wall-layout',
	initialize: function () {
		this.collection.on('add', this.add, this);
		this.collection.on('reset', this.reset, this);

		jwerty.key('arrow-left', this.scrollToPrev, this);
		jwerty.key('arrow-up', this.scrollToFirst, this);
		jwerty.key('arrow-right', this.scrollToNext, this);
	},

	reset: function () {
		this.$el.empty();
		this.collection.forEach(this.add, this);
	},

	add: function (post) {
		var view = new PostView({ model: post });
		view.render();
		var listEl = this.$el.find('ul');
		listEl.append(view.$el);

		var contW = listEl.width(),
			elMarginL = parseInt(view.$el.css('margin-right'), 10),
			elMarginR = parseInt(view.$el.css('margin-right'), 10);

		view.$el.css({ left: contW + 'px' });
		listEl.width(listEl.width() + view.$el.width() + elMarginR + elMarginL);
		this.scroller.refresh();
	},

	afterRender: function () {
		var next   = this.collection.next.bind(this.collection);
		var loader = new LazyLoad(this.$el, 2000, next);

		this.collection.on('load', function () {
			loader.resume();
		});

		this.scroller = new iScroll(this.el, {
			vScroll: false,
			hScroll: true,
			hideScrollbar: true,
			vScrollbar: false,
			hScrollbar: false,
			handleClick: false,
			onScrollMove: _.throttle(loader.handler, 200),
			onScrollEnd: loader.handler,
			wheelAction: 'scroll',
			useTransition: true,
			wheelHorizontal: true,
			wheelScale: 1/2
		});
	},

	scrollToPrev: function () {
		if (typeof this.scroller !== "undefined" && this.scroller !== null) {
			this.scroller.scrollTo(-550, 0, 200, true);
		}
	},

	scrollToNext: function () {
		if (typeof this.scroller !== "undefined" && this.scroller !== null) {
			this.scroller.scrollTo(550, 0, 200, true);
		}
	},

	scrollToFirst: function () {
		if (typeof this.scroller !== "undefined" && this.scroller !== null) {
			this.scroller.scrollTo(0, 0, 500);
		}
	}
});