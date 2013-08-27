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
	};
};

module.exports = Backbone.Layout.extend({
	el: false,
	template: 'wall-layout',
	rendered: 0,
	batchSize: 10,
	initialize: function () {
		this.collection.on('add', this.add, this);
	},

	add: function (post) {
		var contW = this.listEl.width();
		var view = new PostView({ model: post });
		view.render();
		this.listEl.append(view.$el);
		view.$el.css({ left: contW + 'px' });
		this.listEl.width(contW + view.$el.outerWidth());
		view.scroller.refresh();
		this.scroller.refresh();
		this.rendered += 1;
	},

	afterRender: function () {
		this.listEl = this.$el.find('ul');
		this.loader = new LazyLoad(this.listEl, 2000, this.renderItems.bind(this));

		this.collection.on('sync', function () {
			this.loader.resume();
		}, this);

		this.scroller = new iScroll(this.el, {
			vScroll: false,
			hScroll: true,
			hideScrollbar: true,
			vScrollbar: false,
			hScrollbar: false,
			handleClick: false,
			onScrollMove: _.throttle(this.loader.handler, 200),
			onScrollEnd: this.loader.handler,
			wheelAction: 'scroll',
			useTransition: true,
			wheelHorizontal: true,
			wheelScale: 1/2
		});
	},

	renderItems: function () {
		if (this.rendered < this.collection.length) {
			async.eachSeries(this.collection.slice(this.rendered, this.rendered + this.batchSize), function (post, callback) {
				this.add(post);
				callback(null);
			}.bind(this), function (err) {
				if (err) console.log(err);
				this.loader.resume();
			}.bind(this));
		} else {
			this.collection.fetch({ remove: false });
		}
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