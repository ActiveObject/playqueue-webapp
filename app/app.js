exports.init = function (options) {
	console.log('[app:starting]');

	Backbone.LayoutManager.configure({
		fetch: function (path) {
			return require('templates/' + path);
		}
	});

	var HomeView   = require('views/HomeView');
	var QueueView  = require('views/QueueView');
	var GroupView  = require('views/GroupView');
	var GroupList  = require('views/GroupList');
	var AlbumList  = require('views/AlbumList');
	var FriendList = require('views/FriendList');
	var TrackList  = require('views/TrackList');

	var NavigationPanel = require('views/NavigationPanel');
	var PlayerPanel     = require('views/PlayerPanel');

	var GroupCollection = require('collections/GroupCollection');
	var AlbumCollection = require('collections/AlbumCollection');
	var AudioCollection = require('collections/AudioCollection');
	var Friends = require('models/Friends');

	var ContentLayout = require('layouts/ContentLayout');

	var Queue   = require('models/Queue');
	var Router  = require('routers/Router');
	var RestApi = require('RestApi');

	this.router = new Router();

	this.api = new RestApi({
		entryPoint: options.entryPoint,
		auth: options.auth
	});

	this.groups  = new GroupCollection();
	this.albums  = new AlbumCollection();
	this.library = new AudioCollection();
	this.friends = new Friends();
	this.queue   = new Queue();

	this.library.on('reset', function (collection) {
		Backbone.Mediator.pub('library:update', collection);
	});

	var queueView = new QueueView({
		el: '#queue',
		model: this.queue
	});

	Backbone.Mediator.subscribe('queue:show', queueView.show, queueView);
	Backbone.Mediator.subscribe('queue:hide', queueView.hide, queueView);

	this.layouts = {};
	this.layouts.main = new Backbone.Layout({
		el: '#main-layout',

		views: {
			'#queue': queueView
		}
	});

	this.layouts.content = new ContentLayout({
		el: '#content-layout',

		views: {
			'#home': new HomeView({
				groups: this.groups,
				albums: this.albums
			}),
			'#groups': new GroupList({
				collection: this.groups
			}),
			'#albums': new AlbumList({
				collection: this.albums
			}),
			'#friends': new FriendList({
				collection: this.friends
			})
		}
	});

	this.panels = {};
	this.panels.player = new PlayerPanel({ el: 'body > footer' });
	this.panels.navigation = new NavigationPanel({
		el: 'body > header'
	});

	var app = this;
	this.api.on('loaded', function (api) {
		this.groups.fetch();
		this.albums.fetch();
		this.library.fetch();
		this.friends.fetch();
	}, this)

	$(document).on('click', 'a:not([data-bypass])', function (event) {
		var href = $(this).attr('href');
		var protocol = this.protocol + '//';

		if (href.slice(protocol.length) !== protocol) {
			event.preventDefault();
			app.router.navigate(href, true);
		}
	});

	this.layouts.main.render();
	this.layouts.content.render();
	this.layouts.content.show();

	this.panels.navigation.show();
	this.panels.player.show();

	$('#splash').addClass('noactive');
};