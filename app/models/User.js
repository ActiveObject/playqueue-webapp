var AlbumCollection = require('collections/AlbumCollection');
var GroupCollection = require('collections/GroupCollection');
var FriendCollection = require('collections/FriendCollection');
var AudioLibrary = require('collections/AudioLibrary');

var FetchError = function (msg, response) {
 	Error.captureStackTrace && Error.captureStackTrace(this, FetchError);
	this.msg = msg;
	this.response = response;
};

FetchError.prototype = Object.create(Error.prototype, {
	constructor: { value: FetchError, enumerable: false }
});

FetchError.prototype.name = 'FetchError';

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

User.prototype.fetch = function (done) {
	done || (done = function () {});

	var user = this;
	this.library.fetch({
		user: this.id,
		success: function () {
			done(null, user);
		},
		error: function (collection, response) {
			done(new FetchError('Unable to fetch user library', response));
		}
	});
	this.albums.fetch({ user: this.id });
	this.groups.fetch({ user: this.id });
	this.friends.fetch({ user: this.id });
};

module.exports = User;
