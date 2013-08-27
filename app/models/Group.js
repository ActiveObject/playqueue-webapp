var BaseModel = require('models/supers/base').Model;
var Wall = require('models/Wall');
var AlbumCollection = require('collections/AlbumCollection');

module.exports = Backbone.Model.extend({
	idAttribute: 'gid',

	initialize: function () {
		this.wall = new Wall([], { group: this, count: 10 });
		this.library = new AlbumCollection();
	}
});