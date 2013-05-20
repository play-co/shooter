/* @license
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
 * This is a barebone demo of the shooter classes.
 * If you create a new project with `basil init <name>` then you can
 * overwrite the application with this file.
 */
import device;

import math.geom.Point as Point;
import math.geom.Rect as Rect;

import ui.View as View;
import ui.TextView as TextView;

import shooter.Game as Game;
import shooter.models.ModelPool as ModelPool;
import shooter.models.ActorModel as ActorModel;
import shooter.views.WorldView as WorldView;
import shooter.views.EntitySpriteView as EntitySpriteView;

var showCollision = false;

/**
 * Enemy model, a box which drops down from the top of the screen.
 */
var EnemyModel = Class(ActorModel, function (supr) {
	/**
	 * Define the shape and the velocity of the enemies.
	 */
	this.init = function (opts) {
		supr(this, 'init', [merge(opts, { shape: new Rect(0, 0, 90, 90), velocity: new Point(0, 100)})]);
	};

	/**
	 * This function returns true if the enemy is out of the screen or the health is less than zero.
	 */
	this.tick = function (dt) {
		return (this._health < 0) || supr(this, 'tick', arguments);
	};
})

/**
 * Projectile model, a small box which moves from the player to the top of the screen.
 */
var ProjectileModel = Class(ActorModel, function (supr) {
	/**
	 * Define the shape and the velocity of the projectiles.
	 */
	this.init = function (opts) {
		this._game = opts.game;

		supr(this, 'init', [merge(opts, { shape: new Rect(0, 0, 10, 10), velocity: new Point(0, -300) })]);
	};

	/**
	 * This function checks if this projectile collides with any of the enemies.
	 * If it collides then the enemy's heald is decreased and this function returns true
	 * which result in this model being deactivated.
	 * If this projectile is outside of the screen then it's also deactivated.
	 */
	this.tick = function (dt) {
		// Get all items with which this item collides.
		// 0 -the enemy list- is the model pool against which the collision is checked.
		var items = this._game.collidesWithPool(this, 0);
		var i = items.length;
		while (i) {
			items[--i].subHealth(1);
		}
		return items.length || supr(this, 'tick', arguments);
	};
})

/**
 * This model spawns items at a given interval.
 */
var BasicSpawnerModel = Class(ModelPool, function (supr) {
	/**
	 * Set the interval, start time (dt) and constructor (ctor).
	 *
	 * The `type` links this spawner to the correct ViewPool. 
	 */
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this._ctor = opts.ctor;
		this._interval = opts.interval;
		this._dt = 0;
		this._type = opts.type;
		this._owner = opts.owner;
	};

	/**
	 * Update all models in this model pool.
	 *
	 * Check the interval and spawn a new model if the interval has expired.
	 */
	this.tick = function (dt) {
		supr(this, 'tick', arguments);

		this._dt -= dt;
		if (this._dt < 0) {
			this._dt = this._interval;

			var item = this._allocItem(this._ctor);
			var opts = item.getOpts();

			if (this._owner) {
				opts.pos = new Point(this._owner.getOpts().pos);
			} else {
				opts.pos = new Point(Math.random() * GC.app.baseWidth * 0.8 + GC.app.baseWidth * 0.1, -88);				
			}
			// Set the type so that the correct view pool is accessed to link a view to the new model.
			opts.type = this._type;
			opts.item = item;

			// This event is handled by the game which hooks up the model and game.
			this.emit('ItemSpawned', opts);
		}
	};
});

/**
 * The player model which can be moved by dragging.
 */
var PlayerModel = Class(ActorModel, function (supr) {
	/**
	 * Construct the player model, set the position, velocity and shape.
	 * The player has a projectile spawner which is attached to this instance through
	 * the `owner` properties. The projectiles are spanwed at the player location.
	 */
	this.init = function (opts) {
		supr(
			this,
			'init',
			[{
				velocity: new Point(0, 0),
				shape: new Rect(0, 0, 100, 50),
				pos: new Point((GC.app.baseWidth - 100) * 0.5, GC.app.baseHeight - 50)
			}]
		);

		this._projectileSpawner = opts.game.addItemSpawner(
			new BasicSpawnerModel({
				interval: 200,
				ctor: ProjectileModel,
				defaultOpts: { game: opts.game },
				// There's a view pool with the same id, projectile models will be
				// attached to views from view pool 1.
				type: 1,
				owner: this
			}),
			1
		);

		this._targetPos = false;
	};

	/**
	 * This function is called on touch or drag.
	 */
	this.onInput = function (event, pt) {
		this._targetPos = pt;
	};

	/**
	 * When the touch or mouse is released then the player stops moving.
	 */
	this.onInputRelease = function () {
		this._targetPos = false;
		this._opts.velocity.x = 0;
	};

	/**
	 * Update the movement and the projectile list.
	 */
	this.tick = function (dt) {
		supr(this, 'tick', arguments);

		if (this._targetPos) {
			var playerDistance = this._targetPos.x - this._opts.pos.x;
			var travelDistance = playerDistance * 0.2; // Ease
			this._opts.velocity.x = travelDistance * 1000 / dt;
		}

		this._projectileSpawner.tick(dt);

		// The update event sends the info to the view:
		this.emit('Update', this._opts);
	};
});

/**
 * The world view contains all views for this demo.
 */
var MyWorldView = Class(WorldView, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.addViewPool(
			// This is the id, when an enemy is spanwed the opts.type is set to 0,
			// the model will be attached to  a view from this view pool.
			0,
			{
				initCount: 10, // Create 10 views.
				ctor: EntitySpriteView, // Use `EntitySpriteView` as the constructor.
				initOpts: {
					superview: this,
					x: -500,
					width: 90,
					height: 90,
					backgroundColor: 'red',
					showCollision: showCollision
				}
			}
		);
		this.addViewPool(
			// This is the id, when a projectile is spanwed the opts.type is 1,
			// the model will be attached to  a view from this view pool.
			1,
			{
				initCount: 20, // Create 20 views
				ctor: EntitySpriteView, // Use `EntitySpriteView` as the constructor.
				initOpts: {
					superview: this,
					x: -500,
					width: 10,
					height: 10,
					backgroundColor: 'yellow',
					showCollision: showCollision
				}
			}
		);
		// Create the player, this instance will be connected to the player model in 
		// the `MyGame` class below...
		this.playerView = new EntitySpriteView({
			superview: this,
			// Center the player at the bottom of the screen:
			x: (GC.app.baseWidth - 100) * 0.5,
			y: GC.app.baseHeight - 50,
			width: 100,
			height: 50,
			backgroundColor: 'green',
			showCollision: showCollision
		});
	};
});

/**
 * The game class holds all models and the world view.
 * This is the class which connects the models and the views.
 */
var MyGame = Class(Game, function (supr) {
	this.init = function (opts) {
		opts.game = this;
		opts.worldView = new MyWorldView(opts);

		supr(this, 'init', [opts]);

		this._enemySpawner = this.addItemSpawner(
			new BasicSpawnerModel({
				interval: 2000,
				ctor: EnemyModel,
				defaultOpts: { game: this, health: 3 },
				type: 0,
			}),
			0
		);
		this._playerModel = new PlayerModel({game: this});
		this._playerModel.on('Update', bind(this._worldView.playerView, 'onUpdate'));

		this._inputLayer.
			on('Start', bind(this._playerModel, 'onInput')).
			on('Move', bind(this._playerModel, 'onInput'));
	};

	/**
	 * Update the enemies and the player...
	 */
	this.tick = function (dt) {
		this._enemySpawner.tick(dt);
		this._playerModel.tick(dt);
	};
});

exports = Class(GC.Application, function () {
	this.initUI = function () {
		this.scaleUI();

		this._game = new MyGame({superview: this});
	};
	
	this.launchUI = function () {};

	this.scaleUI = function () {
		this.baseWidth = 576;
		this.baseHeight = device.height * (576 / device.width);
		this.scale = device.width / this.baseWidth;
		this.view.style.scale = this.scale;
	};

	this.tick = function (dt) {
		this._game.tick(dt);
	};
});