var GridView    = require('views/GridView');
var VkGroupView = require('views/VkGroupView');
var VkAlbumView = require('views/VkAlbumView');

var GroupView = GridView.extend({
	className: 'grid-group',
	createItem: function (model) {
		return new VkGroupView({ className: 'grid-group-item', model: model });
	}
});

var AlbumView = GridView.extend({
	className: 'grid-group',
	createItem: function (model) {
		return new VkAlbumView({ className: 'grid-group-item', model: model });
	}
});

module.exports = Backbone.Layout.extend({
	template: 'home-layout',
	initialize: function () {
		var groups = new Backbone.Collection();
		var albums = new Backbone.Collection();

		var groupView = new GroupView({
			collection: groups
		});

		var albumView = new AlbumView({
			collection: albums
		});

		groupView.on('resize', this.resize, this);
		albumView.on('resize', this.resize, this);

		this.setView('#home-groups', groupView);
		this.setView('#home-albums', albumView);

		this.options.groups.on('reset', function (collection) {
			groups.reset(collection.models.slice(0,6));
		});

		this.options.albums.on('reset', function (collection) {
			albums.reset(collection.models.slice(0,6));
		});
	},

	resize: function () {
		var w = this.getViews().reduce(function (w, view) {
			return w + view.$el.outerWidth();
		}, 0).value();

		this.$el.width(w);
		this.scroller.refresh();
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
				zoom: true
			}, this.scroll);
			this.scroller = new iScroll(el, options);
		} else {
			this.scroller.refresh();
		}
	}
});