var app = require('app');
var TrackView = require('views/TracklistItemView');
var ListView  = require('views/ListView');

var List = ListView.extend({
	events: {
		'click .add-to-queue': 'toQueue'
	},

	createItem: function (model) {
		return new TrackView({ model: model });
	},

	toQueue: function (e) {
		var id = $(e.currentTarget).parent().parent().data('audio-id');
		var track = this.collection.get(id);
		app.queue.add(track);
	}
});

var Layout = Backbone.Layout.extend({
	template: 'tracklist',
	el: false,
	events: {
		'click .queue-all': 'queueAll',
		'click .shuffle': 'shuffle'
	},

	initialize: function () {
		this.list = new List({ collection: this.collection });
		this.insertView(this.list);

		this.on('activate', function () {
			$('.content-overlay').addClass('active');
			this.$el.parent().addClass('active');
		});

		this.on('deactivate', function () {
			$('.content-overlay').removeClass('active');
			this.$el.parent().removeClass('active');
			this.remove();
		});
	},

	queueAll: function () {
		app.queue.add(this.collection.models);
	},

	shuffle: function () {
		app.queue.add(this.collection.shuffle());
	}
});

module.exports = Layout;
