var valid = function (expires) { return Date.now() < expires; };
var setProperty = function (obj, property) {
	obj[property[0]] = property[1];
	return obj;
};

var parseQueryString = function (qs) {
	return qs.split('&')
		.map(function (item) {
			return item.split('=');
		})
		.map(function (item) {
			return item.map(decodeURIComponent);
		})
		.reduce(setProperty, {});
};

var makeQueryString = function (params) {
	return Object.keys(params).map(function (key) {
		return [encodeURIComponent(key), encodeURIComponent(params[key])].join('=');
	}).reduce(function (acc, item) {
		return [acc, item].join('&');
	});
};

// var APP_ID = 3347123; // localhost
var BASE_URI = 'http://localhost:5003';
var APP_ID = 3362486; // heroku
// var BASE_URI = 'http://playq.herokuapp.com';
// var BASE_URI = 'http://playqueue-api.herokuapp.com';

var params = {
	client_id: APP_ID,
	scope: ['friends', 'audio', 'groups', 'wall', 'offline'].join(','),
	redirect_uri: BASE_URI,
	display: 'popup',
	response_type: 'token'
};

var OAUTH_AUTHORIZE_URL = 'https://oauth.vk.com/authorize?' + makeQueryString(params);

exports.isAuthenticated = function () {
	return localStorage.user_id && localStorage.access_token;
};

exports.urlHasCredentials = function (location) {
	var params = parseQueryString(location.hash.slice(1));
	return params.user_id && params.access_token;
};

exports.parseUrl = function (location) {
	return parseQueryString(location.hash.slice(1));
};

exports.storeCredentials = function (cred) {
	localStorage.user_id = cred.user_id;
	localStorage.access_token = cred.access_token;
};

exports.authorize = function () {
	return window.location = OAUTH_AUTHORIZE_URL;
};

exports.credentials = function () {
	return {
		user_id: parseInt(localStorage.user_id, 10),
		access_token: localStorage.access_token
	};
};