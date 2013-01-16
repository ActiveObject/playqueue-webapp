var GridView = require('views/GridView');
var preventClick = require('lib/common').preventClick;

var refresh = function (view) {
	return function () {
		return view.scroller.refresh();
	};
};

module.exports = GridView.extend({
	initialize: function () {
		GridView.prototype.initialize.apply(this, arguments);
		this.on('resize', refresh(this));
		this.on('add', refresh(this));
	},

	afterRender: function () {
		if (!this.scroller) {
			var el = this.$el.parent().get(0);
			var options = _.extend({
				hideScrollbar: true,
				vScroll: false,
				hScroll: true,
				vScrollbar: false,
				hScrollbar: false,
				bounce: true,
				momentum: true,
				useTransition: true,
				zoom: true,
				handleClick: false
			}, this.scroll);
			this.scroller = new iScroll(el, options);
			el.addEventListener('click', preventClick(this.scroller), true);
		} else {
			this.scroller.refresh();
		}
	}
});