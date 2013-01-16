var app  = require('app');
var auth = require('auth');

var API_HOST = require('config').API_HOST;
var NODE_ENV = require('config').NODE_ENV;

$(function () {
	if (auth.urlHasCredentials(location)) {
		var credentials = auth.parseUrl(location);
		auth.storeCredentials(credentials);
		location.hash = '';
	}

	if (!auth.isAuthenticated()) {
		console.log('[vk:authorize]');
		return auth.authorize();
	}

	var credentials = auth.credentials();
	app.init({
		entryPoint: API_HOST + '/' + credentials.user_id,
		auth: {
			type: 'oauth',
			token: credentials.access_token,
			user: credentials.user_id
		}
	});
	Backbone.history.start({ pushState: true });
});