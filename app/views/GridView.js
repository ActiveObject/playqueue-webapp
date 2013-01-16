module.exports = Backbone.Layout.extend({
	tagName: 'ul',
	rows: 1,

	initialize: function () {
		this.collection.on('reset', this.reset, this);
		this.collection.on('add', this.add, this);
		enquire
			.register('screen and (max-height : 640px)', {
				match: this.resize.bind(this, 1),
				unmatch: this.resize.bind(this, 2)
			})
			.register('screen and (min-height : 640px)', {
				match: this.resize.bind(this, 2),
				unmatch: this.resize.bind(this, 3)
			})
			.register('screen and (min-height : 880px)', {
				match: this.resize.bind(this, 3),
				unmatch: this.resize.bind(this, 2)
			})
			.listen();
	},

	reset: function () {
		this.$el.empty();
		this.resize();
		this.collection.models.forEach(this.add, this);
	},

	add: function (model) {
		var view = this.createItem(model);
		this.insertView(view);
		view.render();
		this.trigger('add', model, this);
	},

	resize: function (rows) {
		rows = this.rows = rows ? rows : this.rows;
		var fakeView = this.createItem(new this.collection.model());
		fakeView.render();
		fakeView.$el.css('position', 'absolute').appendTo(this.$el);
		var w = fakeView.$el.outerWidth();
		fakeView.$el.remove();

		var listWidth = w * Math.ceil(this.collection.size() / rows);
		this.$el.width(listWidth);
		this.trigger('resize', this);
	},

	createItem: function (model) {
		throw new Error('GridView: implement createItem method');
	}
});
