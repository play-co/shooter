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
 * Linear interpolation of position and opacity
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

/**
 * Bouncing particles, imageIndex = 0 is shadow, imageIndex = 1 is particle
 */
var linearBounces = [];

exports.linearBounceInit = function (view) {
	var opts = view.getOpts();
	var style = view.style;
	var index = view.index & 511;

	if (linearBounces[index] === undefined) {
		linearBounces[index] = Math.PI * (1.5 + Math.random() * 1.5);
	}

	if (view.imageIndex === 1) {
		style.width *= 1 + Math.random() * 0.2;
	}

	opts.bounces = linearBounces[index];
	opts.r = 0;
	opts.rStep = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20;
	opts.half = style.width * 0.5;
	opts.height = style.height;
};

exports.linearBounce = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var x = start.x + opts.dx * d - opts.half;
	var y = start.y + opts.dy * d - opts.half;
	var s = start.p + opts.dp * d;

	if (view.imageIndex === 1) {
		opts.r += opts.rStep * dt;
		style.r = opts.r;
		y -= Math.abs(Math.sin(d * opts.bounces)) * 75 + opts.half;
		y += opts.height * (1 - s);
	}
	if (opts.velocity) {
		style.r = 0;
		opts.movedX += opts.velocity.x * dt;
		opts.movedY += opts.velocity.y * dt;
		x += opts.movedX;
		y += opts.movedY;
	}

	style.scale = s;
	style.x = x;
	style.y = y;
	style.visible = true;
};

/**
 * Smoke
 */
exports.smokeInit = function (view) {
	var opts = view.getOpts();
	var style = view.style;

	opts.size = style.width;
	opts.half = style.width * 0.5;
	opts.arc = Math.random() * 40 - 20;
	opts.r = 0;
	opts.rStep = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20;
};

exports.smoke = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var sin = Math.sin(d * Math.PI);
	var x = start.x + sin * opts.arc;
	var y = start.y + opts.dy * d;

	opts.r += opts.rStep * dt;

	var size = opts.half + sin * opts.half;

	style.width = size;
	style.height = size;

	size *= 0.5;
	style.x = x - size;
	style.y = y - size;
	style.visible = true;
	style.r = opts.r;
};

/**
 * Coin
 */
exports.coinInit = function (view) {
	var opts = view.getOpts();

	opts.h = 0.3 + Math.random() * 0.3;
	opts.b = (opts.h * 10) * (opts.h * 10);
	opts.w = -120 + Math.random() * 240;
	opts.r = Math.random() * 6;

	view.style.zIndex = 1000;
};

exports.coin = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var step = (d - opts.h) * 10;

	style.x = start.x + d * opts.w;
	style.y = start.y + (step * step - opts.b) * 3;
	style.r = opts.r * d;
	style.opacity = (d > 0.8) ? ((1 - d) / 0.2) : 1;

	style.visible = true;
};

/**
 * Coin
 */
exports.catCoinInit = function (view) {
	var opts = view.getOpts();

	opts.h = 0.3 + Math.random() * 0.3;
	opts.b = (opts.h * 10) * (opts.h * 10);
	opts.w = -120 + Math.random() * 240;
	opts.r = Math.random() * 6;

	view.style.zIndex = 1000;
	view.style.scale = 1;
};

exports.catCoin = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;
	var step = (d - opts.h) * 10;

	style.x = start.x + d * opts.w;
	style.y = start.y + (step * step - opts.b) * 3;
	style.r = opts.r * d;

	if (d < 0.5) {
		style.scale = d / 0.5;
	} else if (d > 0.8) {
		style.scale = (1 - d) / 0.2;
	} else {
		style.scale = 1;
	}

	style.visible = true;
};

/**
 * Linear interpolation of position and opacity
 */
exports.groundHit = function (view, opts, d, dt) {
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
 * Static, only scale
 */
exports.staticScale = function (view, opts, d, dt) {
	var style = view.style;
	var start = opts.start;

	style.opacity = 1;
	style.scale = start.p + opts.dp * d;
	style.x = start.x;
	style.y = start.y;
	style.visible = true;
};