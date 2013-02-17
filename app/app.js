// requestAnimationFrame polyfill
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.iScroll = require('lib/iscroll').iScroll;

exports.init = function (options) {
	console.log('[app:starting]');

	Backbone.LayoutManager.configure({
		fetch: function (path) {
			return require('templates/' + path);
		}
	});

	soundManager.setup({
		url: '/lib/',
		flashVersion: 9,
		preferFlash: false,
		onready: function() {
			console.log('Sound manager ready');
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

	var MainLayout = require('layouts/MainLayout');

	var Queue   = require('models/Queue');
	var Router  = require('routers/Router');
	var RestApi = require('api/RestApi');
	var VkApi   = require('api/VkApi');

	this.router = new Router();

	this.api = new RestApi({
		entryPoint: options.entryPoint,
		auth: options.auth
	});

	this.vk = new VkApi({
		auth: options.auth,
		rateLimit: 2
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

	this.view = {};
	this.view.albums = new AlbumList({
		collection: this.albums
	});

	this.view.groups = new GroupList({
		collection: this.groups
	});

	this.view.friends = new FriendList({
		collection: this.friends
	});

	this.layouts = {};
	this.layouts.main = new MainLayout({
		el: '#main-layout',

		views: {
			'#queue': queueView,
			'#albums': this.view.albums,
			'#groups': this.view.groups,
			'#friends': this.view.friends
		}
	});

	this.panels = {};
	this.panels.player = new PlayerPanel({ el: '#player' });
	this.panels.navigation = new NavigationPanel({
		el: 'body > header'
	});

	var app = this;
	this.api.on('loaded', function (api) {
		this.groups.fetch();
		this.albums.fetch({ query: { uid: app.vk.user }});
		this.library.fetch();
		this.friends.fetch();

		this.panels.navigation.show();
		this.panels.player.show();
		this.layouts.main.render();
		$('#splash').addClass('noactive');
	}, this);

	$(document).on('click', 'a:not([data-bypass])', function (event) {
		var href = $(this).attr('href');
		var protocol = this.protocol + '//';

		if (href.slice(protocol.length) !== protocol) {
			event.preventDefault();
			app.router.navigate(href, true);
		}
	});
};