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

var curr = 30;

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

		var onMove = _.throttle(onScroll(this.listEl, this.next.bind(this), 500), 100);
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
			onScrollMove: onMove,
			onScrollEnd: onMove,
			wheelAction: 'scroll'
		}, this.scrollOptions);

		this.scroller = new iScroll(this.wrapperEl.get(0), options);
		this.el.addEventListener('click', preventClick(this.scroller), true);
	},

	next: function () {
		console.log('render items: %d..%d', curr, curr + 10);

		var size = this.collection.size();
		var interval = [curr, curr < size ? curr + 10 : size];

		this.collection.models
			.slice(interval[0], interval[1])
			.forEach(this.add, this);

		curr = interval[1];
	},

	reset: function () {
		this.listEl.empty();
		this.collection.models.slice(0,30).forEach(this.add, this);
	},

	add: function (model) {
		var view = this.createItem(model);
		this.listEl.append(view.el);
		view.render();
		this.scroller.refresh();
	},

	createItem: function (model) {
		throw new Error('Implement createItem method in ListView');
	}
});