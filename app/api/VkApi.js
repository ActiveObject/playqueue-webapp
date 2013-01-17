var methods = require('api/vkMethods').methods.map(function (m) {
	return m.split('.');
});

var not = require('lib/common').not;

var isGlobal = function (method) {
	return method.length === 1;
};

var setupHelpers = function (apiObj) {
	var makeRequest = function (api, method, group) {
		var mname = group ? [group, method].join('.') : method;
		api[method] = function (options, callback) {
			return apiObj.request(mname, options, callback);
		};
		return api;
	};

	// setup global api methods
	var globalMethods = methods.filter(isGlobal);
	globalMethods.map(_.head).reduce(function (api, method) {
		return makeRequest(api, method);
	}, apiObj);

	// setup api methods by group
	var groupedMethods = methods.filter(not(isGlobal));
	var group  = function (item) { return item[0]; };
	var method = function (item) { return item[1]; };

	var byGroup = _(groupedMethods).groupBy(group);

	Object.keys(byGroup).reduce(function (api, gname) {
		api[gname] = byGroup[gname].reduce(function (api, item) {
			return makeRequest(api, method(item), group(item));
		}, {});
		return api;
	}, apiObj);
};

var request = function (url, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}

	$.getJSON(url, options, function (res) {
		if (res.error) {
			return callback(res.error);
		}

		if (!res.response) {
			return callback(new Error('Missing response body'));
		}

		callback(null, res.response);
	});
};

var VkApi  = function (options) {
	if (options.auth.type !== 'oauth') {
		throw new Error('VkApi support only oauth authorization');
	}

	this.token = options.auth.token;
	this.user  = options.auth.user;

	this.entryPoint = 'https://api.vk.com/method/';

	setupHelpers(this);
};

VkApi.prototype.request = function (method, options, callback) {
	var url = this.entryPoint + method + '?callback=?';
	options = _.extend(options, {
		access_token: this.token
	});

	return request(url, options, callback);
};

module.exports = VkApi;