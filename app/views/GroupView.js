var app   = require('app');
var audio = require('templates/audio');
var WallView = require('views/WallView');

Handlebars.registerPartial('audio', audio);

var GroupView = Backbone.Layout.extend({
	template: 'group-layout',
	el: false,
	events: {
		'click [data-action=prev]': 'prevPost',
		'click [data-action=next]': 'nextPost',
		'click [data-action=first]': 'firstPost'
	},

	initialize: function () {
		this.wallView = new WallView({ collection: this.model.wall });
		this.setView('#wall-layout', this.wallView);

		var shortkeyHandler = function (event) {
			if (jwerty.is('arrow-left', event)) this.wallView.scrollToPrev();
			if (jwerty.is('arrow-right', event)) this.wallView.scrollToNext();
			if (jwerty.is('arrow-up', event)) this.wallView.scrollToFirst();
		}.bind(this);

		this.on('activate', function () {
			$(document.body).on('keydown', shortkeyHandler);
		}, this);

		this.on('deactivate', function () {
			$(document.body).off('keydown', shortkeyHandler);
			this.remove();
		}, this);
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