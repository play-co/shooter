### EntitySpriteView Class

extends `SpriteView`, see: [ui.SpriteView](http://docs.gameclosure.com/api/event.html#class-event.emitter)

The `EntitySpriteView` class can be used to as a view for the `EntityModel` class. It has methods
for positioning and updating the view based on information from the model.

Parameters
 + `showCollision {boolean}` ---Show the collision area, works only in the browser.

#### Methods

__setSize(width, height)__

Set the size of the view, updates the offsets. When the view is displayed the position denotes the
center of the view.

Parameters
 + `width {number}` ---The width of the view.
 + `height {number}` ---The height of the view.

__onUpdate(opts)__

This when the model emits an `Update` signal this function should be subscribed to apply the 
model's data to the view.

Paramaters
 + `opts {object}` ---The opts from the view, the position is stored here.

__getCurrentAnimationName()__

Get the name of the current animation.

Returns
 {string} ---The name of the animation.

__play(animationName, opts)__

Play an animation, doesn't do anything if the given animation is already playing.

Parameters
 + `animationName {string}` ---The name of the animation
 + `opts {object}` ---The settings (like `loop`), see: [SpriteView]()

### InputView Class

If you use an `InputView` then you can set the `blockEvents` property of all other views
in the game to `false` which increases the performance.

The `InputView` class does not have any relevant public functions but does emit usefull events.

#### Events

__Click__

Emitted when the user clicks the view.

Parameters
 + `x {number}` ---The horizontal position scaled to the app view.
 + `y {number}` ---The vertical position scaled to the app view.

__Start__

Emitted when the user clicks the view.

__Move__

Emitted when the user drag on the screen.

Parameters
 + `pt {object}` ---The new drag position: x, y.

__Drag__

Parameters
 + `angle {number}` ---The direction in which is dragged in radians.

__DragUp__

Emitted when the user drags up.

__DragDown__

Emitted when the user drags down.

