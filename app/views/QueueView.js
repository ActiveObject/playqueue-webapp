var QueueItemView = require('views/QueueItemView');
var ListView      = require('views/ListView');

var at = function (offset, container, el) {
	var order = +el.getAttribute('data-qorder');
	return container.querySelector('[data-qorder="' + (order + offset) + '"]');
};

var next = at.bind(null, 1);
var prev = at.bind(null, -1);

var drag = function (collection, el, startOffset, shiftCb) {
	var draggedEl = el.cloneNode(true);
	draggedEl.style.zIndex = 10000;
	draggedEl.style.top = el.style.top;
	draggedEl.classList.add('drag');
	el.parentNode.appendChild(draggedEl);

	el.classList.add('dropzone');

	var target = el;
	var nextEl = next(target.parentNode, target);
	var prevEl = prev(target.parentNode, target);

	var topOffset = 0;

	var dragFn = function (event) {
		var offset = event.clientY - startOffset;
		var diff = offset - topOffset;
		draggedEl.style['-webkit-transform'] = 'translateY(' + offset + 'px)';

		if (nextEl && diff > 0 && diff > (nextEl.offsetHeight / 2)) {
			topOffset += nextEl.offsetHeight;

			shiftCb(nextEl, target);

			prevEl = nextEl;
			nextEl = next(target.parentNode, target);
		}

		if (prevEl && diff < 0 && -diff > (prevEl.offsetHeight / 2)) {
			topOffset -= prevEl.offsetHeight;

			shiftCb(prevEl, target);

			nextEl = prevEl;
			prevEl = prev(target.parentNode, target);
		}

		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	var dropFn = drop.bind(null, collection, dragFn, el, draggedEl);
	$(document.body).one('mouseup', dropFn);

	return dragFn;
};

var drop = function (collection, dragFn, el, draggedEl, event) {
	collection.sort({ silent: true });
	document.body.removeEventListener('mousemove', dragFn, false);
	el.classList.remove('dropzone');
	el.style.zIndex = 0;

	draggedEl.parentNode.removeChild(draggedEl);

	event.preventDefault();
	event.stopPropagation();

	return false;
};

var swap = function (collection, el1, el2) {
	var track1 = collection.get($(el1).find('.audio-item').data('audio-id'));
	var track2 = collection.get($(el2).find('.audio-item').data('audio-id'));

	return collection.swap(track1, track2);
};

var List = ListView.extend({
	template: 'queue',
	events: {
		'mouseover .drag-place': 'disableScroll',
		'mouseout .drag-place': 'enableScroll',
		'mousedown .drag-place': 'drag',
		'click .drag-place': 'shift'
	},

	disableScroll: function (event) {
		this.scroller.disable();
	},

	enableScroll: function (event) {
		this.scroller.enable();
	},

	drag: function (event) {
		var el = event.currentTarget.parentNode.parentNode;
		var dragFn = drag(this.collection, el, event.clientY, swap.bind(null, this.collection));
		document.body.addEventListener('mousemove', dragFn, false);
	},

	shift: function (event) {
		$(event.currentTarget).parent('.audio-item').addClass('show-menu');
		event.stopPropagation();
		return false;
	},

	initialize: function () {
		ListView.prototype.initialize.apply(this, arguments);

		this.$el.on('dragstart', '.audio-item', function () {
			$(this).addClass('drag');
		});

		this.collection.on('swap', function (track1, track2) {
			var source = this.$el.find('[data-audio-id=' + track1.id + ']').get(0).parentNode;
			var target = this.$el.find('[data-audio-id=' + track2.id + ']').get(0).parentNode;

			var position = [{
				el  : source,
				top : parseInt(source.style.top, 10),
				h   : parseInt(source.offsetHeight, 10)
			}, {
				el  : target,
				top : parseInt(target.style.top, 10),
				h   : parseInt(target.offsetHeight, 10)
			}].sort(function (item1, item2) {
				return item1.top - item2.top;
			});

			position[0].el.style.top = position[0].top + position[1].h + 'px';
			position[1].el.style.top = position[0].top + 'px';
		}, this);

		this.collection.on('beforereset', function () {
			this.listEl.height(0);
		}, this);
	},

	createItem: function (model) {
		return new QueueItemView({ model: model });
	}
});

module.exports = Backbone.Layout.extend({
	events: {
		'click .audio-state': 'play'
	},

	initialize: function () {
		this.list = new List({ collection: this.model.tracks });
		this.insertView('#queue-list', this.list);
	},

	play: function (event) {
		var audioEl = $(event.currentTarget).parent('.audio-item');
		var id = audioEl.data('audio-id');
		var track = this.model.find(id);
		this.model.load(track);
	},

	show: function () {
		this.$el.addClass('active');
		$(document.body).one('click', ':not(.queue)', this.hide.bind(this));
		return this;
	},

	hide: function () {
		this.$el.removeClass('active');
		return this;
	},

	toggle: function () {
		return this.$el.hasClass('active') ? this.hide() : this.show();
	}
});
