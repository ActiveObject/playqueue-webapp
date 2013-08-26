var ListItem = require('views/ListItem');

module.exports = ListItem.extend({
	template: 'tracklist-item',
	initialize: function () {
		Backbone.View.prototype.initialize.apply(this, arguments);
		this.model.on('change:queued', this.render.bind(this));
		this.model.on('change:qorder', this.render.bind(this));
	}
});
