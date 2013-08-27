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

	Backbone.Layout.configure({
		fetchTemplate: function (path) {
			return require('templates/' + path);
		}
	});

	soundManager.setup({
		url: '/lib/',
		flashVersion: 9,
		preferFlash: false,
		useHTML5Audio: true,
		waitForWindowLoad: false,
		onready: function() {
			console.log('Sound manager ready');
		}
	});

	require('helpers/ViewHelper');

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
	var AudioLibrary    = require('collections/AudioLibrary');
	var Friends = require('collections/FriendCollection');

	var MainLayout = require('layouts/MainLayout');

	var Queue   = require('models/Queue');
	var Router  = require('routers/Router');
	var RestApi = require('api/RestApi');
	var VkApi   = require('api/VkApi');
	var User    = require('models/User');

	this.router = new Router();

	this.api = new RestApi({
		entryPoint: options.entryPoint,
		auth: options.auth
	});

	this.vk = new VkApi({
		auth: options.auth,
		rateLimit: 2
	});

	this.user = new User(options.auth.user_id);
	this.queue = new Queue();

	this.view = {};
	this.view.albums = new AlbumList({
		collection: this.user.albums
	});

	this.view.groups = new GroupList({
		collection: this.user.groups
	});

	this.view.friends = new FriendList({
		collection: this.user.friends
	});

	this.view.queue = new QueueView({
		el: '#queue',
		model: this.queue
	});

	this.mainLayout = new MainLayout({ el: '#main-layout '})
		.add(this.view.albums)
		.add(this.view.friends)
		.add(this.view.groups);
	// this.layouts.main = new MainLayout({
	// 	el: '#main-layout',

	// 	views: {
	// 		'#albums': this.view.albums,
	// 		'#groups': this.view.groups,
	// 		'#friends': this.view.friends
	// 	}
	// });

	this.panels = {};
	this.panels.player = new PlayerPanel({ el: '#player' });
	this.panels.navigation = new NavigationPanel({
		el: 'body > header'
	});

	this.user.fetch();

	this.panels.navigation.show();
	this.panels.player.show();
	this.view.queue.render();

	var app = this;
	$(document).on('click', 'a:not([data-bypass])', function (event) {
		var href = $(this).attr('href');
		var protocol = this.protocol + '//';

		if (href.slice(protocol.length) !== protocol) {
			event.preventDefault();
			app.router.navigate(href, true);
		}
	});

	// run this on load
	$('#splash').remove();
	document.body.classList.remove('preload');
};
