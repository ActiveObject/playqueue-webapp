var AlbumCollection = require('collections/AlbumCollection');
var GroupCollection = require('collections/GroupCollection');
var FriendCollection = require('collections/FriendCollection');
var AudioLibrary = require('collections/AudioLibrary');

var User = function (id) {
	this.id = id;
	this.albums  = new AlbumCollection();
	this.groups  = new GroupCollection();
	this.friends = new FriendCollection();
	this.library = new AudioLibrary();

	this.albums.add(this.library.album);
	this.albums.on('add', function (model) {
		model.fetch({ user: id });
	});
};

User.prototype.fetch = function () {
	this.albums.fetch({ user: this.id });
	this.groups.fetch({ user: this.id });
	this.library.fetch({ user: this.id });
	this.friends.fetch({ user: this.id });
};

module.exports = User;
