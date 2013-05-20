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

import src.constants.gameConstants as gameConstants;
import src.constants.debugConstants as debugConstants;

import math.geom.Vec2D as Vec2D;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = false;
		supr(this, 'init', [opts]);
	};

	this.onInputStart = function (evt) {
		this.emit('Click', {x: evt.srcPt.x / GC.app.scale, y: evt.srcPt.y / GC.app.scale})

		this._allowDrag = true; // (evt.srcPt.y / GC.app.scale < GC.app.baseHeight - gameConstants.FOOTER_HEIGHT);
		if (this._allowDrag) {
			this.startDrag();
			this.emit('Start', evt);
		}
	};

	this.onDragStart = function (dragEvent) {
		if (this._allowDrag) {
			this._dragStartTime = Date.now();
			this._dragStartPoint = dragEvent.srcPoint;
		}
	};

	this.onInputMove = function (evt, pt) {
		this._allowDrag && this.emit('Move', evt, pt);
	};

	this.onDrag = function (dragEvent, moveEvent, delta) {
		if (this._allowDrag && ((delta.y < -1 && this._dragDY >= 0) || (delta.y > 1 && this._dragDY <= 0))) {
			this._dragStartTime = this._totalTime;
			this._dragStartPoint = dragEvent.srcPoint;
			this._dragDY = delta.y;
		}
	};

	this.onDragStop = function (dragEvent, selectEvent) {
		if (this._allowDrag) {
			var dY = this._dragStartPoint.y - selectEvent.srcPoint.y;
			var dX = this._dragStartPoint.x - selectEvent.srcPoint.x;
			var dragVec = new Vec2D({x: dX, y: dY});
			var mag = dragVec.getMagnitude();
			var dt = Date.now() - this._dragStartTime;

			var dragTime = Math.max(gameConstants.MAX_DRAG_TIME, debugConstants.MAX_DRAG_TIME);
			if ((mag > gameConstants.MIN_DRAG_MAGNITUDE) && (dt < dragTime)) {
				var angle = dragVec.getAngle();
				var degrees = angle * (180 / Math.PI);
				var isUp = degrees > 60 && degrees < 120;
				var isDown = degrees < -60 && degrees > -120;

				// Turned off for internal release
				if (isUp) { // Going from a large Y to a smaller Y === dragging UP
					this.emit('DragUp');
				} else if (isDown) { // Going from a small Y to a larger Y === dragging DOWN
					this.emit('DragDown');
				}
			}
		}
	};
});