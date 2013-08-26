var GridItem = require('views/GridItem');

module.exports = GridItem.extend({
	template: 'vkalbum',
	events: {
		'click': 'showPlaylist'
	},

	initialize: function () {
		this.model.tracks.on('add remove', function (model) {
			this.$el.find('.album-audio-count').text(model.collection.length);
		}, this);

		this.model.tracks.on('reset', function (collection) {
			this.$el.find('.album-audio-count').text(collection.length);
		}, this);
	},

	showPlaylist: function (e) {
		Backbone.history.navigate(this.model.url, { trigger: true });
	}
});