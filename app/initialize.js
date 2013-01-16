var app = require('app');
var auth = require('auth');

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
		// entryPoint: 'http://localhost:8004/' + credentials.user_id,
		entryPoint: 'http://playqueue-api.herokuapp.com/' + credentials.user_id,
		auth: {
			type: 'oauth',
			token: credentials.access_token,
			user: credentials.user_id
		}
	});
	Backbone.history.start({ pushState: true });

	VK.init({
		apiId: 3362486
	});

	VK.Auth.login(function (res) {
		console.log('[openapi:' + res.status + '] logged as ' + res.session.user.id);
	}, VK.access.AUDIO);
});