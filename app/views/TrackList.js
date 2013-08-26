var common = require('lib/common'),
    pipe   = common.pipe,
    invoke = common.invoke;

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
	events: {
		'click .queue-all': 'queueAll'
	},

	initialize: function () {
		this.list = new List({
			collection: this.collection
		});
		this.setView('.tracklist-list', this.list);
	},

	queueAll: function () {
		this.collection.forEach(function (track) {
			app.queue.add(track);
		});
	}
});

module.exports = Layout;
