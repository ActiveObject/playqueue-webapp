var preventClick = require('lib/common').preventClick;
var grid = require('lib/grid');

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

module.exports = Backbone.View.extend({
	manage: true,
	template: 'grid',
	className: 'wrapper grid-layout',

	initialize: function () {
		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
		this.items = [[0,80,0,0]];
		var mql1 = window.matchMedia("(min-height: 640px)");
		var mql2 = window.matchMedia("(min-height: 880px)");
		var mql3 = window.matchMedia("(min-height: 1120px)");
		mql1.addListener(this.resize.bind(this));
		mql2.addListener(this.resize.bind(this));
		mql3.addListener(this.resize.bind(this));
	},

	resize: function () {
		var gridDim = [this.listEl.outerWidth(), this.listEl.outerHeight()];
		this.items = grid.layout(this.items, gridDim, [this.items[0]]);
		var items = this.items.slice(1);
		var els = this.listEl.children();
		els.each(function (i, el) {
			requestAnimFrame(function () {
				$(el).css({
					top: items[i][0],
					left: items[i][1]
				});
			})
		});
		var last = _.last(items);
		this.listEl.width(last[1] + last[2]);
		this.scroller.refresh();
	},

	afterRender: function () {
		this.wrapperEl = this.$el;
		this.listEl = this.$el.find('.list');

		this.height = this.listEl.height();
		this.inleft = parseInt(this.listEl.css('padding-left'), 10);
		this.intop  = 0;

		var options = _.extend({
			hideScrollbar: true,
			vScroll: false,
			hScroll: true,
			vScrollbar: false,
			hScrollbar: false,
			bounce: true,
			momentum: true,
			zoom: true,
			handleClick: false,
			useTransition: false
		}, this.scrollOptions);

		this.scroller = new iScroll(this.wrapperEl.get(0), options);
		this.el.addEventListener('click', preventClick(this.scroller), true);
	},

	reset: function () {
		this.collection.models.forEach(this.add, this);
	},

	add: function (model) {
		var view = this.createItem(model);
		this.listEl.append(view.el);

		view.render().done(function (view) {
			var gridDimension = [this.$el.outerWidth(), this.$el.outerHeight()];
			var elDimension   = [view.$el.outerWidth(), view.$el.outerHeight()];
			var insertPos     = grid.insert(this.items, gridDimension, elDimension);

			view.$el.css({
				top:  insertPos[0] + 'px',
				left: insertPos[1] + 'px'
			});

			this.items.push(insertPos.concat(elDimension));
			this.listEl.width(insertPos[1] + elDimension[0]);
		}.bind(this));

		this.scroller.refresh();
		this.trigger('add', model, this);
	},

	createItem: function (model) {
		throw new Error('GridView: implement createItem method');
	}
});
