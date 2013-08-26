var app   = require('app');
var audio = require('templates/audio');
var WallView = require('views/WallView');

Handlebars.registerPartial('audio', audio);

var GroupView = Backbone.Layout.extend({
	el: false,
	template: 'group-layout',
	events: {
		'click [data-action=prev]': 'prevPost',
		'click [data-action=next]': 'nextPost',
		'click [data-action=first]': 'firstPost'
	},

	initialize: function () {
		this.wallView = new WallView({ collection: this.model.wall });
		this.setView('#wall-layout', this.wallView);
	},

	serialize: function () {
		return {
			name: this.model.get('name'),
			photo: this.model.get('photo_big')
		};
	},

	nextPost: function () {
		this.wallView.scrollToNext();
	},

	prevPost: function () {
		this.wallView.scrollToPrev();
	},

	firstPost: function () {
		this.wallView.scrollToFirst();
	}
});

module.exports = GroupView;