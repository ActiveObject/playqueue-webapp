var ListItem = Backbone.View.extend({
	manage: true,
	tagName: 'li',
	serialize: function () {
		return this.model.toJSON();
	}
});

module.exports = ListItem;