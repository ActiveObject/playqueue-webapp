var app = require('app');
var GroupView = require('views/GroupView');
var AlbumDetailsView = require('views/AlbumDetailsView');
var TrackList = require('views/TrackList');

module.exports = Backbone.Router.extend({
	routes: {
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
		app.layouts.content.activate('groups');

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
		app.layouts.content.activate('albums');

		// TODO: move to a separate method
		app.layouts.main.$el.children('#tracklist').removeClass('active');
		app.layouts.main.$el.children('.content-overlay').removeClass('active');
		app.layouts.content.$el.removeClass('blind');

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
		app.layouts.content.activate('friends');

		// TODO: move to a separate method
		app.layouts.main.$el.children('#tracklist').removeClass('active');
		app.layouts.main.$el.children('.content-overlay').removeClass('active');
		app.layouts.content.$el.removeClass('blind');

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
		var prevView = app.layouts.content.getView('#group');
		var group = app.groups.get(gid);
		if (prevView && prevView.model.id === group.id) {
			app.layouts.content.activate('group');
		} else {
			var view = new GroupView({ model: group });

			app.layouts.content.setView('#group', view);
			app.layouts.content.activate('group');
			view.render();
			group.wall.fetch();
		}

		app.panels.navigation.menu.render({
			title: group.get('name'),
			items: [{
				title: 'Аудіозаписи групи',
				uri: '/groups/' + group.id + '/albums'
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
		view.reset();
		view.render();

		// TODO: move to a separate method
		app.layouts.main.$el.children('#tracklist').addClass('active');
		app.layouts.main.$el.find('.content-overlay').addClass('active');
		app.layouts.content.$el.addClass('blind');

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
	}
});