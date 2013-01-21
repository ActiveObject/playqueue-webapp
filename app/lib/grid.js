var last = function (arr) {
	return arr[arr.length - 1];
};

var isEmpty = function (arr) {
	return arr.length === 0;
};

var insert = function (items, gridDimension, elDimension) {
	var elw = elDimension[0];
	var elh = elDimension[1];

	var gw = gridDimension[0];
	var gh = gridDimension[1];

	var lastPos = last(items);
	var ltop  = lastPos[0];
	var lleft = lastPos[1];
	var lw  = lastPos[2];
	var lh  = lastPos[3];

	var insertPos = (ltop + lh + elh > gh) ? [0, lleft + lw] : [ltop + lh, lleft];

	return insertPos;
};

var elDimension = function (item) {
	return [item[2], item[3]];
};

var layout = function (items, gridDimension, startItem) {
	return items.slice(1).reduce(function (acc, item) {
		var nextDim  = elDimension(item);
		var nextPos  = insert(acc, gridDimension, nextDim);
		var nextItem = nextPos.concat(nextDim);
		return acc.concat([nextItem]);
	}, startItem);
};

exports.insert = insert;
exports.layout = layout;