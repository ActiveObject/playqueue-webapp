var url = function () {
	var rel = _.isFunction(this.rel) ? this.rel() : this.rel;
	var parent = _.isFunction(this.parent) ? this.parent() : this.parent;
	var link = this.link('self') || parent.link(rel);
	return link.href;
};

var link = function (rel) {
	var links = this.get('_links');
	return links ? links[rel] : null;
};

var BaseModel = Backbone.Model.extend({
	url: url,
	link: link
});

var BaseCollection = Backbone.Collection.extend({
	url: url,
	link: link
})

exports.Model = BaseModel;
exports.Collection = BaseCollection;