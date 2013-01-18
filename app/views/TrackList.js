var common = require('lib/common'),
    pipe   = common.pipe,
    invoke = common.invoke;

var app = require('app');

var TrackView = require('views/TracklistItemView');
var ListView  = require('views/ListView');

module.exports = ListView.extend({
	events: {
		'click .add-to-queue': 'toQueue'
	},

	createItem: function (model) {
		return new TrackView({ model: model });
	},

	toQueue: function (e) {
		var id = $(e.currentTarget).parent().data('audio-id');
		var track = this.collection.get(id);
		app.queue.add(track);
	}
});