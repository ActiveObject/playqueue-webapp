var compose = function (f, g) {
	return function () {
		return f(g.apply(null, arguments));
	};
};

exports.compose = function () {
	var fns = Array.prototype.slice.call(arguments);

	return fns.reduce(function (composition, next) {
		return compose(composition, next);
	});
};

exports.pipe = function () {
	var fns = Array.prototype.slice.call(arguments);

	return fns.reduce(function (composition, next) {
		return compose(next, composition);
	});
};

exports.invoke = function (prop /* other params */) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function (obj) {
		return obj[prop].apply(obj, args);
	};
};

exports.curry = function (fn, context) {
	return function curried () {
		var args = Array.prototype.slice.call(arguments);

		if (args.length === fn.length) {
			return fn.apply(context, args);
		}

		return function () {
			return curried.apply(null, args.concat(Array.prototype.slice.call(arguments)));
		};
	};
};

exports.handleError = function (successFn, failureFn, ctx) {
	return function (err) {
		if (err) {
			return failureFn(err);
		}

		var args = Array.prototype.slice.call(arguments, 1);
		successFn.apply(ctx, args);
	};
};

exports.preventClick = function (scrollObj) {
	return function (event) {
		if (scrollObj.distY || scrollObj.distX) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	};
};