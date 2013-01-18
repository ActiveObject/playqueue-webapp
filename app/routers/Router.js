var app = require('app');
var GroupView = require('views/GroupView');
var TrackList = require('views/TrackList');
var Album = require('models/Album');
var AlbumList = require('views/AlbumList');

module.exports = Backbone.Router.extend({
	routes: {
		'groups/:gid/albums/:aid': 'groupAlbum',
		'groups/:id/library': 'groupLibrary',
		'albums/:id': 'album',
		'groups/:id': 'group',
		'groups': 'groups',
		'albums': 'albums',
		'friends': 'friends',
		'': 'index'
	},

	index: function () {
		this.navigate('/albums', { trigger: true });
	},

	groups: function () {
		app.layouts.main.activate('groups');

		app.panels.navigation.menu.render({
			title: 'Мої групи',
			items: [{
				title: 'Мої аудіозаписи',
				uri: '/albums'
			}, {
				title: 'Мої друзі',
				uri: '/friends'
			}]
		});
	},

	albums: function () {
		app.layouts.main.activate('albums');

		app.panels.navigation.menu.render({
			title: 'Мої аудіозаписи',
			items: [{
				title: 'Мої групи',
				uri: '/groups'
			}, {
				title: 'Мої друзі',
				uri: '/friends'
			}]
		});
	},

	friends: function () {
		app.layouts.main.activate('friends');

		app.panels.navigation.menu.render({
			title: 'Мої друзі',
			items: [{
				title: 'Мої групи',
				uri: '/groups'
			}, {
				title: 'Мої аудіозаписи',
				uri: '/albums'
			}]
		});
	},

	group: function (gid) {
		var prevView = app.layouts.main.getView('#group');
		var group = app.groups.get(gid);
		if (!prevView || !(prevView.model.id === group.id)) {
			var view = new GroupView({ model: group });
			app.layouts.main.setView('#group', view);
			view.render();
			group.wall.fetch();
		}

		app.layouts.main.activate('group');

		app.panels.navigation.menu.render({
			title: group.get('name'),
			items: [{
				title: 'Аудіозаписи групи',
				uri: '/groups/' + group.id + '/library'
			}, {
				title: 'Мої групи',
				uri: '/groups'
			}, {
				title: 'Мої аудіозаписи',
				uri: '/albums'
			}, {
				title: 'Мої друзі',
				uri: '/friends'
			}]
		});
	},

	album: function (id) {
		var album = app.albums.get(id);

		var view = new TrackList({
			collection: album.tracks
		});

		app.layouts.main.setView('#tracklist', view);
		view.render();
		view.reset();

		app.layouts.main.showTracklist();

		app.panels.navigation.menu.render({
			title: album.get('title'),
			items: [{
				title: 'Мої групи',
				uri: '/groups'
			}, {
				title: 'Мої аудіозаписи',
				uri: '/albums'
			}, {
				title: 'Мої друзі',
				uri: '/friends'
			}]
		});
	},


	groupLibrary: function (id) {
		var group = app.groups.get(id);
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
			}, {
				title: 'Мої аудіозаписи',
				uri: '/albums'
			}, {
				title: 'Мої групи',
				uri: '/groups'
			}, {
				title: 'Мої друзі',
				uri: '/friends'
			}]
		});
	},

	groupAlbum: function (gid, aid) {
		var group = app.groups.get(gid);
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