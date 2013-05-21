# Shooter library

One of the most classic types of games is a space invader style game. This library provides a
set of classes to make implementation of such a game very easy.

If you want to get going as fast as possible then you can create a new project with `basil init <project name>`
and replace the contents of the `Application.js` of your new project with the contents of the `Application.js`
file in this repo.

### EntityModel

The `EntityModel` contains properties about the position and shape of an item. Is has a number of 
methods which are used to create and destroy it.

Parameters
 + `shape {math.geom.Rect|math.geom.Circle} = Circle(0,0,10)` ---Optional, set the size and shape of the item see: [Circle](http://docs.gameclosure.com/api/math.html#class-math.geom.circle) or [Rect](http://docs.gameclosure.com/api/math.html#class-math.geom.rect).
 + `width {number}` ---Optional, is not provided then the width of the shape is used.
 + `height {number}` ---Optional, is not provided then the height of the shape is used.
 + `game {Game}` ---An instance the the `Game` class used to interact with other items in the game.

#### Methods

__refreshOpts()__

This function is called after the model is obtained from a model pool. The `_opts` values are up to date at the
time this function is called.

__updatePos(pos)__

Update the position.

Parameters
 + `pos {math.geom.Point}` ---The new position, see: [Point](http://docs.gameclosure.com/api/math.html#class-math.geom.point).

__destroy()__

This function is called when the `ModelPool` in which this item is contained removes the model, it also
releases the view from the `ViewPool` associated with this model.

__isOffscreen()__

The tick function calls this function, if this function returns true then the model will be removed.

__tick()__

This function is called each frame by the `ModelPool`. If this function returns `true` then this model
will be removed from the pool and the `destroy` function is called. The tick function emits an `Update`
event with the `_opts` parameter which is used by the associated view to display the item.

Returns
 {boolean} ---If true then the model pool will remove this item.

__getShape()__

Get the shape of the item, this is not a unique instance! This function is used for collision detection.

__getPosition()__

Get the position of the item.

Returns
 {math.geom.Point} ---The (x, y) position.

__getOpts()__

Get the options.

Returns
 {object} ---The options.

__collidesWith(item)__

Check if this item collides with another item.

Parameters
 + `item {EntityModel}` ---The item to check the collision against.
Returns
 {boolean} ---True is collides.

__collidesWithModelPool(modelPool)__

Check if this item collides with any of the items in the given model pool.

Parameters
 + `modelPool {ModelPool}` ---The model pool to check against.
Returns
 + {array} ---A list of items with which this item collides, empty if no collisions.

### ActorModel Class

