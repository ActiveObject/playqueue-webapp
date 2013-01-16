var ListItem   = require('views/ListItem');

module.exports = ListItem.extend({
	template: 'vkalbum',
	events: {
		'click .album-audio-count': 'showPlaylist'
	},

	initialize: function () {
		this.model.on('change:count', this.render, this);
	},

	showPlaylist: function (e) {
		Backbone.history.navigate('albums/' + this.model.id, { trigger: true });
	}
});