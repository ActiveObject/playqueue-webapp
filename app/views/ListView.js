var preventClick = require('lib/common').preventClick;

var onScroll = function (el, fn, bottomOffset) {
	fn = fn || function () {};
	bottomOffset = bottomOffset || 100;
	var parentHeight = el.parent().height();

	return function (event) {
		if ((el.height() + el.position().top) < (parentHeight + bottomOffset)) {
			fn();
		}
	};
};

var lazyRender = function (view, collection, options) {
	var options = options || {};
	var last = options.start || 30;
	var next = options.next || 10;

	return function () {
		console.log('render items: %d..%d', last, last + next);

		var size = collection.size();
		var interval = [last, last < size ? last + next : size];

		collection.models
			.slice(interval[0], interval[1])
			.forEach(view.add, view);

		last = interval[1];
	};
};

module.exports = Backbone.View.extend({
	manage: true,
	template: 'grid',
	className: 'wrapper list-layout',

	initialize: function () {
		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
	},

	afterRender: function () {
		this.wrapperEl = this.$el;
		this.listEl = this.$el.find('.list');

		var onMove = onScroll(this.listEl, lazyRender(this, this.collection), 1000);

		var options = _.extend({
			hideScrollbar: true,
			vScroll: true,
			hScroll: false,
			vScrollbar: false,
			hScrollbar: false,
			bounce: true,
			momentum: true,
			useTransition: true,
			zoom: true,
			onScrollMove: _.throttle(onMove, 100),
			onScrollEnd: onMove,
			wheelAction: 'scroll'
		}, this.scrollOptions);

		this.scroller = new iScroll(this.wrapperEl.get(0), options);
		this.el.addEventListener('click', preventClick(this.scroller), true);
	},

	reset: function () {
		this.listEl.empty();
		this.collection.models.slice(0,30).forEach(this.add, this);
	},

	add: function (model) {
		var view = this.createItem(model);

		requestAnimFrame(function () {
			this.listEl.append(view.el);
			view.render();
			this.scroller.refresh();
		}.bind(this), view.el);
	},

	createItem: function (model) {
		throw new Error('Implement createItem method in ListView');
	}
});