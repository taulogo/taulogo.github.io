/**
 * emojiarea - A rich textarea control that supports emojis, WYSIWYG-style.
 * Copyright (c) 2012 DIY Co
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@diy.org>
 */

(function($, window, document) {

	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
	var TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
	var KEY_ESC = 27;
	var KEY_TAB = 9;

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	$.emojiarea = {
		path: '',
		icons: {},
		defaults: {
			button: null,
			buttonLabel: 'Emojis',
			buttonPosition: 'after'
		}
	};

	$.fn.emojiarea = function(options) {
		options = $.extend({}, $.emojiarea.defaults, options);
		return this.each(function() {
			var $textarea = $(this);
			new EmojiArea_WYSIWYG($textarea, options);
		});
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var util = {};

	util.extend = function(a, b) {
		if (typeof a === 'undefined' || !a) { a = {}; }
		if (typeof b === 'object') {
			for (var key in b) {
				if (b.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
		}
		return a;
	};

	util.htmlEntities = function(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var EmojiArea = function() {};

	EmojiArea.prototype.setup = function() {
		var self = this;
		this.setupButton();
	};

	EmojiArea.prototype.setupButton = function() {
		var self = this;
		var $button;
		var $button = $("#emoji_button");
		$button.on('click', function(e) {
			EmojiMenu.show(self);
			e.stopPropagation();
		});

		this.$button = $button;
	};

	EmojiArea.prototype.getImgSrc = function(group, emoji) {
		console.log(group, emoji);
		var filename = $.emojiarea.icons[group]['icons'][emoji];
		var path = $.emojiarea.path || '';
		if (path.length && path.charAt(path.length - 1) !== '/') {
			path += '/';
		}
		return path + filename;
	};

	EmojiArea.createIcon = function(group, emoji) {
		var filename = $.emojiarea.icons[group]['icons'][emoji];
		var path = $.emojiarea.path || '';
		if (path.length && path.charAt(path.length - 1) !== '/') {
			path += '/';
		}
		return '<img src="' + path + filename + '" alt="' + util.htmlEntities(emoji) + '">';
	};


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Editor (rich)
	 *
	 * @constructor
	 * @param {object} $textarea
	 * @param {object} options
	 */

	var EmojiArea_WYSIWYG = function($textarea, options) {
		var self = this;

		this.options = options;


		this.setup();

	};


	util.extend(EmojiArea_WYSIWYG.prototype, EmojiArea.prototype);

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	/**
	 * Emoji Dropdown Menu
	 *
	 * @constructor
	 * @param {object} emojiarea
	 */
	var EmojiMenu = function() {
		var self = this;
		var $body = $(document.body);
		var $window = $(window);

		this.visible = false;
		this.emojiarea = null;
		this.$menu = $('<div>');
		this.$menu.addClass('emoji-menu');
		this.$menu.hide();
		this.$items = $('<div>').appendTo(this.$menu);

		$body.append(this.$menu);

		$body.on('keydown', function(e) {
			if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
				self.hide();
			}
		});

		$body.on('mouseup', function() {
			self.hide();
		});

		$window.on('resize', function() {
			if (self.visible) self.reposition();
		});

		this.$menu.on('mouseup', 'a', function(e) {
			e.stopPropagation();
			return false;
		});

		this.$menu.on('click', 'a', function(e) {
			var emoji = $('.label', $(this)).text();
			var group = $('.label', $(this)).parent().parent().attr('group');
			if(group && emoji !== ''){
				window.setTimeout(function() {
					self.onItemSelected.apply(self, [group, emoji]);
				}, 0);
				e.stopPropagation();
				return false;
			}
		});

		this.load();
	};

	EmojiMenu.prototype.onItemSelected = function(group, emoji) {
		// this.emojiarea.insert(group, emoji);
		var emoji_src = this.emojiarea.getImgSrc(group, emoji);
		window.insert_in_logo(emoji_src, false);
		this.hide();
	};

	EmojiMenu.prototype.load = function() {
		var html = [];
		var groups = [];
		var options = $.emojiarea.icons;
		var path = $.emojiarea.path;
		if (path.length && path.charAt(path.length - 1) !== '/') {
			path += '/';
		}
		groups.push('<ul class="group-selector">');
		for (var group in options) {
		groups.push('<a href="#group_' + group + '" class="tab_switch"><li>' + options[group]['name'] + '</li></a>');
		html.push('<div class="select_group" group="' + group + '" id="group_' + group + '">');
			for (var key in options[group]['icons']) {
				if (options[group]['icons'].hasOwnProperty(key)) {
					var filename = options[key];
					html.push('<a href="javascript:void(0)" title="' + util.htmlEntities(key) + '">' + EmojiArea.createIcon(group, key) + '<span class="label">' + util.htmlEntities(key) + '</span></a>');
				}
			}
		html.push('</div>');
		}
		groups.push('</ul>');
		this.$items.html(html.join(''));
		this.$menu.prepend(groups.join(''));
		this.$menu.find('.tab_switch').each(function(i) {
			if (i != 0) {
				var select = $(this).attr('href');
				$(select).hide();
			} else {
				$(this).addClass('active');
			}
			$(this).click(function() {
				$(this).addClass('active');
				$(this).siblings().removeClass('active');
				$('.select_group').hide();
				var select = $(this).attr('href');
				$(select).show();
			});
		});
	};

	EmojiMenu.prototype.reposition = function() {
		var $button = this.emojiarea.$button;
		var offset = $button.offset();
		var menu_height = parseInt(this.$menu.css("height"));
		offset.top -= $button.outerHeight() + menu_height;
		offset.left	-= Math.round($button.outerWidth());

		this.$menu.css({
			top: offset.top,
			left: offset.left
		});
	};

	EmojiMenu.prototype.hide = function(callback) {
		if (this.emojiarea) {
			this.emojiarea.menu = null;
			this.emojiarea.$button.removeClass('on');
			this.emojiarea = null;
		}
		this.visible = false;
		this.$menu.hide();
	};

	EmojiMenu.prototype.show = function(emojiarea) {
		if (this.emojiarea && this.emojiarea === emojiarea) return;
		this.emojiarea = emojiarea;
		this.emojiarea.menu = this;

		this.reposition();
		this.$menu.show();
		this.visible = true;
	};

	EmojiMenu.show = (function() {
		var menu = null;
		return function(emojiarea) {
			menu = menu || new EmojiMenu();
			menu.show(emojiarea);
		};
	})();

	$.EmojiArea = EmojiArea;

})(jQuery, window, document);