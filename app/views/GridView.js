var preventClick = require('lib/common').preventClick;

module.exports = Backbone.View.extend({
	manage: true,
	template: 'grid',
	className: 'wrapper grid-layout',

	initialize: function () {
		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
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
			var intop  = this.intop;
			var inleft = this.inleft;

			var w = view.$el.outerWidth();
			var h = view.$el.outerHeight();

			if (intop === 0) {
				this.listEl.css('width', '+=' + w);
			}

			if ((h + intop) < this.height) {
				var top  = intop;
				var left = inleft;

				intop = top + h;
			} else {
				var top = 0;
				var left = inleft + w;

				intop = h;
				inleft = left;
				this.listEl.css('width', '+=' + w);
			}

			this.intop  = intop;
			this.inleft = inleft;

			view.$el.css({
				left: left + 'px',
				top: top + 'px'
			});
		}.bind(this));
		this.scroller.refresh();
		this.trigger('add', model, this);
	},

	createItem: function (model) {
		throw new Error('GridView: implement createItem method');
	}
});
