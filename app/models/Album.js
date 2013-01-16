module.exports = Backbone.Model.extend({
	idAttribute: 'album_id',
	initialize: function () {
		this.tracks = new Backbone.Collection();
		this.tracks.on('reset', this.updateCount, this);
	},

	updateCount: function () {
		this.set('count', this.tracks.size());
	}
});