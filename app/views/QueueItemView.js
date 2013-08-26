module.exports = Backbone.Layout.extend({
	el: false,
	template: 'queue-item',
	serialize: function () {
		return this.model.toJSON();
	},

	initialize: function () {
		this.model.on('change:qorder', function (model) {
			this.el.setAttribute('data-qorder', model.get('qorder'));
			this.el.querySelector('.qorder').innerHTML = model.get('qorder');
		}, this);
	},

	afterRender: function () {
		var el   = this.$el;
		var cont = el.parent();
		var ch   = cont.height();

		el.appendTo(cont);
		this.el.setAttribute('data-qorder', this.model.get('qorder'));
		var eh = el.outerHeight();
		cont.height(eh + ch);

		el.css('top', ch);
	}
});