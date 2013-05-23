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

/**
 * Linear interpolation of position
 */
exports.linear = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var x = start.x + opts.dx * d;
	var y = start.y + opts.dy * d;

	if (opts.velocity) {
		opts.movedX += opts.velocity.x * dt;
		opts.movedY += opts.velocity.y * dt;
		x += opts.movedX;
		y += opts.movedY;
	}

	style.opacity = 1;
	style.scale = start.p + opts.dp * d;
	style.x = x;
	style.y = y;
	style.visible = true;
};

/**
 * Linear interpolation of position, size
 */
exports.linearScale = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var x = start.x + opts.dx * d;
	var y = start.y + opts.dy * d;

	if (opts.velocity) {
		opts.movedX += opts.velocity.x * dt;
		opts.movedY += opts.velocity.y * dt;
		x += opts.movedX;
		y += opts.movedY;
	}

	style.x = x;
	style.y = y;
	style.scale = d;
	style.visible = true;
};

/**
 * Stay in one place, size
 */
exports.fixedScale = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;

	style.x = start.x;
	style.y = start.y;

	style.scale = (d < 0.5) ? d * 2 : 1 - (d - 0.5) * 2;
	style.opacity = 1;
	style.visible = true;
};