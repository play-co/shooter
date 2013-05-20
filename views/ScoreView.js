/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with the Game Closure SDK.  If not, see <http://www.gnu.org/licenses/>.
 */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

var emptyFunc = function () {};

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = true;
		opts.canHandleEvents = false;
		supr(this, 'init', arguments);

		this.setCharacterData(opts.characterData);

		// Text options
		this.textAlign = opts.textAlign || 'center';
		this.spacing = opts.spacing || 0;

		// Characters that should be rendered
		this._activeCharacters = [];
		this._imageViews = [];

		if (opts.text) {
			this.setText(opts.text);
		}
	};

	this.setText = function (text) {
		text = text + '';

		if (this._opts.text === text) {
			return;
		}
		this._opts.text = text;

		var textWidth = 0;
		var style = this.style;
		var scale = style.height / this._charHeight;
		var activeCharacters = this._activeCharacters;
		var imageViews = this._imageViews;

		var i = 0, data;
		while (i < text.length) {
			var character = text.charAt(i);
			var data = this._chars[character];
			if (data) {
				var w = data.width * scale;
				activeCharacters[i] = data;
				textWidth += w + this.spacing * scale;
				// Special x offsets to fix text kerning only affect text width if it's first or last char
				if (data.offset && (i == 0 || i == text.length - 1)) {
					textWidth += data.offset * scale;
				}
			}
			i++;
		}

		style.scale = (textWidth > style.width) ? style.width / textWidth : 1;

		var offset;
		if (this.textAlign === 'center') {
			offset = (style.width - textWidth) / 2;
		} else if (this.textAlign === 'right') {
			offset = style.width - textWidth;
		} else {
			offset = 0;
		}

		while (text.length > imageViews.length) {
			var newView = new ImageView({
				parent: this,
				x: 0,
				y: 0,
				width: 1,
				height: 1,
				canHandleEvents: false,
				inLayout: false
			});
			newView.needsReflow = emptyFunc;
			imageViews.push(newView);
		}

		// Trim excess characters
		activeCharacters.length = text.length;

		var x = offset;
		var y = 0;
		for (i = 0, j = activeCharacters.length; i < j; i++) {
			var data = activeCharacters[i];
			if (data) {
				var view = imageViews[i];
				var viewStyle = view.style;
				var w = data.width * scale;

				// Special x offsets to fix text kerning
				if (data.offset) {
					x += data.offset * scale;
				}

				viewStyle.x = x;
				viewStyle.y = y;
				viewStyle.width = w;
				viewStyle.height = style.height; // All characters should have the same height
				viewStyle.visible = true;
				view.setImage(data.img);

				// Remove special offset
				if (data.offset) {
					x -= data.offset * scale;
				}

				x += w + this.spacing * scale;
			}
		}

		while (i < imageViews.length) {
			imageViews[i++].style.visible = false;
		}
	};

	this.needsReflow = emptyFunc;

	this.setCharacterData = function (characterData) {
		this._characterData = characterData;
		this._charHeight = characterData.height;
		this._chars = characterData.chars;
		for (var i in this._chars) {
			var data = this._chars[i];
			if (!(data.img instanceof Image)) {
				data.img = new Image({ url: data.image });
			}
		}
	};
});