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

module.exports = Backbone.Layout.extend({
	tagName: 'ul',
	scroll: false,

	constructor: function () {
		Backbone.Layout.apply(this, arguments);

		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
	},

	afterRender: function () {
		if (!this.scroll) return;
		if (!this.scroller) {
			var el = this.$el.parent().get(0);
			var onMove = _.throttle(onScroll(this.$el, this.next.bind(this), 500), 100);
			var options = _.extend({
				onScrollMove: onMove,
				onScrollEnd: onMove,
				wheelAction: 'scroll'
			}, this.scroll);
			this.scroller = new iScroll(el, options);
			el.addEventListener('click', preventClick(this.scroller), true);
		} else {
			this.scroller.refresh();
		}
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
		this.$el.empty();
		this.collection.models.slice(0,30).forEach(this.add, this);
	},

	add: function (model) {
		var view = this.createItem(model);
		this.insertView(view);
		view.render();
		if (this.scroller) this.scroller.refresh();
	},

	createItem: function (model) {
		throw new Error('Implement createItem method in ListView');
	}
});