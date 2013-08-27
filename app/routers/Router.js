var app = require('app');
var GroupView = require('views/GroupView');
var TrackList = require('views/TrackList');
var Album = require('models/Album');
var AlbumList = require('views/AlbumList');

var menuItems = [{
	title: 'Мої аудіозаписи',
	uri: '/albums'
}, {
	title: 'Мої групи',
	uri: '/groups'
}, {
	title: 'Мої друзі',
	uri: '/friends'
}];

module.exports = Backbone.Router.extend({
	routes: {
		'groups/:gid/albums/:aid': 'groupAlbum',
		'groups/:id/library': 'groupLibrary',
		'albums/:id': 'album',
		'groups/:id': 'group',
		'groups': 'groups',
		'albums': 'albums',
		'friends': 'friends',
		'queue': 'queue',
		'': 'index'
	},

	index: function () {
		this.navigate('/albums', { trigger: true });
	},

	queue: function () {
		app.view.queue.show();
	},

	groups: function () {
		app.mainLayout.activate(app.view.groups);
		app.panels.navigation.menu.render({
			title: 'Мої групи',
			items: menuItems
		});
	},

	albums: function () {
		app.mainLayout.activate(app.view.albums);
		app.panels.navigation.menu.render({
			title: 'Мої аудіозаписи',
			items: menuItems
		});
	},

	friends: function () {
		app.mainLayout.activate(app.view.friends);
		app.panels.navigation.menu.render({
			title: 'Мої друзі',
			items: menuItems
		});
	},

	group: function (gid) {
		var group = app.user.groups.get(gid);
		var view = new GroupView({ model: group });
		app.mainLayout.add(view).activate(view, true);

		app.panels.navigation.menu.render({
			title: group.get('name'),
			items: [{
				title: 'Аудіозаписи групи',
				uri: '/groups/' + group.id + '/library'
			}].concat(menuItems)
		});
	},

	album: function (id) {
		var album = app.user.albums.get(id);

		var view = new TrackList({
			collection: album.tracks
		});

		app.mainLayout.add(view).activate(view, true);
		app.panels.navigation.menu.render({
			title: album.get('title'),
			items: menuItems
		});
	},

	groupLibrary: function (id) {
		var group = app.user.groups.get(id);
		var view = new AlbumList({
			collection: group.library
		});

		app.layouts.main.setView('#group-library', view);
		app.layouts.main.activate('group-library');

		view.render();
		group.library.fetch({
			query: {
				gid: group.id
			}
		});

		app.panels.navigation.menu.render({
			title: group.get('name') + ' - аудіозаписи',
			items: [{
				title: 'Новини групи',
				uri: '/groups/' + group.id
			}].concat(menuItems)
		});
	},

	groupAlbum: function (gid, aid) {
		var group = app.user.groups.get(gid);
		var album = group.library.get(aid);

		var view = new TrackList({
			collection: album.tracks
		});

		app.layouts.main.setView('#tracklist', view);
		view.render();
		view.reset();

		app.layouts.main.showTracklist();

		app.panels.navigation.menu.render({
			title: album.get('title'),
			items: []
		});
	}
});