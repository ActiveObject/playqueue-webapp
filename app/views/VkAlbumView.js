var ListItem   = require('views/ListItem');

module.exports = ListItem.extend({
	template: 'vkalbum',
	events: {
		'click': 'showPlaylist'
	},

	initialize: function () {
		this.model.on('reset', this.render, this);
		this.model.tracks.on('reset', function (collection) {
			this.$el.find('.album-audio-count').text(collection.length);
		}, this);
	},

	showPlaylist: function (e) {
		Backbone.history.navigate(this.model.url, { trigger: true });
	}
});