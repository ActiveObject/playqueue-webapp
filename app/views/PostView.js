var app = require('app');

var handleError = require('lib/common').handleError;
var typeIs = function (type) {
	return function (obj) {
		return obj.type === type;
	};
};

module.exports = Backbone.Layout.extend({
	className: 'post',
	template: 'post',
	events: {
		'click .add-to-queue': 'onAddToQueue',
		'click .play-all': 'queueAll'
	},

	data: function () {
		var attachments = _(this.model.get('attachments')).chain();

		var photos = attachments.filter(typeIs('photo')).pluck('photo').value();
		var icon   = this.wall.group.get('photo');
		var title  = this.wall.group.get('name');
		var date   = new Date(parseInt(this.model.get('date'), 10) * 1000);

		var audios = attachments
			.filter(typeIs('audio'))
			.pluck('audio')
			.map(function (audio) {
				var track = this.wall.tracks.get(audio.aid);
				audio.queued = track && track.get('queued');
				return audio;
			}, this)
			.value();

		return {
			photos: photos,
			audios: audios,
			icon: icon,
			title: title,
			date: moment(date).startOf('minute').fromNow(),
			text: this.model.get('text')
		};
	},

	initialize: function () {
		this.wall = this.model.collection;
		this.wall.tracks.on('change:queued', function (model) {
			if (!model.get('queued')) {
				this.$el.find('[data-audio-id=' + model.id + ']').removeClass('queued');
				this.$el.find('[data-audio-id=' + model.id + ']').find('.qorder').text('');
			} else {
				this.$el.find('[data-audio-id=' + model.id + ']').find('.qorder').text(model.get('qorder'));
			}
		}, this);
	},

	onAddToQueue: function (event) {
		var trackEl = $(event.currentTarget).parent().parent();
		this.toQueue(trackEl);
	},

	toQueue: function (trackEl) {
		trackEl.addClass('queued');
		var aid = trackEl.data('audio-id');
		var oid = trackEl.data('owner-id');

		var onError = function (err) {
			trackEl.removeClass('queued');
			var msg = '[error] Unable add track ' + trackEl.data('owner-id') + ' to queue';
			console.log(msg, err);
		};

		var onLoad = function (track) {
			app.queue.add(track);
		};

		this.wall.tracks.loadTrack(aid, oid, handleError(onLoad, onError));
	},

	queueAll: function () {
		this.$el.find('.audio').toArray().map($).forEach(this.toQueue, this);
	},

	afterRender: function () {
		var scroll = new iScroll(this.el, {
			vScroll: true,
			hScroll: false,
			hideScrollbar: true,
			vScrollbar: false,
			hScrollbar: false,
			wheelAction: 'none'
		});
	}
});
