var RestApi = function (options) {
	_.extend(this, options);
	_.extend(this, Backbone.Events);
	this._identityMap = {};
	this._get(options.entryPoint, function (err, resource) {
		if (err) {
			throw new Error('Entry point (' + options.entryPoint + ') is not avalaible');
		}
		this.root = resource;
		this.trigger('loaded', this);
	}.bind(this));
};

RestApi.prototype.get = function (resource, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}

	$.ajax(_.defaults(options, {
		dataType: 'json',
		headers: {
			'Authorization': 'Bearer ' + this.auth.token
		},
		type: 'GET',
		url: resource.uri
	})).done(function (data, textStatus, jqXHR) {
		callback(null, data);
	}).fail(function (jqXHR, textStatus, errorThrown) {
		callback(errorThrown, textStatus);
	});
};

var utemplate = function (pattern, params) {
	return UriTemplate.parse(pattern).expand(params);
};

RestApi.prototype.related = function (resource, path, callback) {
	if (resource._embedded && resource._embedded[path.rel]) {
		return callback(null, resource._embedded[path.rel]);
	}

	if (!resource._links[path.rel]) {
		var err = new Error('Resource ' + resource._links.self
			+ ' does\t have related ' + path.rel);
		return callback(err);
	}

	var link = resource._links[path.rel];
	var href = link.templated ? utemplate(link.href, path.params) : link.href;

	this._get(href, callback);
};

RestApi.prototype.resource = function (path, options, callback) {
	if (!callback) {
		callback = options;
		options = {};
	}

	var paths = path.split('/').map(function (p) {
		return {
			rel: p,
			params: options[p]
		};
	});

	var related = this.related.bind(this);

	async.reduce(paths, this.root, related, callback);
};


var uri = function (resource) {
	return resource._links.self.href;
};

var value = function (obj) {
	return function (key) {
		return obj[key];
	};
};

// lazy resource load
RestApi.prototype._get = function (href, callback) {
	var resource = null;
	if (resource = this._identityMap[href]) return callback(null, resource);

	this.get({ uri: href }, function (err, data) {
		if (err) return callback(err);

		if (data._embedded) {
			var embedded = data._embedded
			Object.keys(embedded).map(value(embedded)).reduce(function (map, resource) {
				map[uri(resource)] = resource;
				return map;
			}, this._identityMap);
		}

		this._identityMap[href] = data;
		callback(null, data);
	}.bind(this));
};

module.exports = RestApi;