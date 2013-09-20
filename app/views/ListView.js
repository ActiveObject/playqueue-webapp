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

		view.scroller.refresh();

		last = interval[1];
	};
};

module.exports = Backbone.Layout.extend({
	el: false,
	template: 'list-layout',

	afterRender: function () {
		this.wrapperEl = this.$el;
		this.listEl = this.$el.find('ul');

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
		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
		this.add(this.collection.slice(0, 30));
	},

	reset: function () {
		this.listEl.empty();
		this.collection.models.slice(0,30).forEach(this.add, this);
	},

	add: function (model) {
		var models = [].concat(model);
		models.map(function (model) {
			var view = this.createItem(model);
			this.listEl.append(view.el);
			view.render();
		}, this);
	},

	createItem: function (model) {
		throw new Error('Implement createItem method in ListView');
	}
});