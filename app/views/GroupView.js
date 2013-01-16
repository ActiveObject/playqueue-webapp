var app   = require('app');
var audio = require('templates/audio');
var WallView = require('views/WallView');

Handlebars.registerPartial('audio', audio);

var GroupView = Backbone.Layout.extend({
	className: 'group-layout',
	template: 'group-layout',
	initialize: function () {
		var wallView = new WallView({ collection: this.model.wall });
		this.setView('#wall-layout', wallView);
	}
});

module.exports = GroupView;