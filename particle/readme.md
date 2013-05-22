### ParticleSystem Class

extends `ViewPool`

The `ParticleSystem` class provides the option to create particles which have a more complex path.

Parameters
 + `superview {ui.View}` ---The parent view.
 + `initCount {number}` ---The number of views to initially create.
 + `types {object}` ---A list with different particle properties, each key is a particle type with the following properties:
  + `count {number}` ---The number of particles to create when `addParticles` is called.
  + `duration {number}` ---The lifetime in milli seconds for each particle.
  + `radius {number}` ---The radius of the particles emitted.
  + `image {string}` ---The image for the particle.
  + `initStartCB {function(start)}` ---Called when the start position is set.
  + `initEndCB {function(start, end)}` ---Called when the end position is set.
  + `initCB {function(view)}` ---Called when a new particle is initialized.
  + `stepCB {function(view, opts, delta, s)}` ---A callback called for each step.

#### Methods

__addOne(x, y, velocity, imageIndex)__

Add a single particle.

Parameters
 + `x {number}` ---The horizontal position of the particle.
 + `y {number}` ---The vertical position of the particle.
 + `velocity {math.geom.Point}` ---The velocity vector.
 
__addParticles(pos, velocity, count)__

Adds particles between the minimum and maximum angle add the given position.
If count is not provided then the count which was set in the `type` will be used.

The following callback will be called if they were set in the constructor `types` parameter:
 + `initStartCB {function(start)}` ---Called when the start position is set.
 + `initEndCB {function(start, end)}` ---Called when the end position is set.
 + `initCB {function(view)}` ---Called when a new particle is created.

Parameters
 + `pos {math.geom.Point}` ---The position from where particles will be emitted.
 + `velocity {math.geom.Point}` ---Optional, the direction in which the particle system is moving.
 + `count {number}` ---The number of particles which will be emitted.

__activateType(type)__

Activate the type of particles which will be emitter with the next `addParticles` call.

Parameters
 + `type {string}` ---The type of particle, should be a key in the `types` property provided to the constructor.

__getCount()__

The number of particles which will be emitted with a single `addParticles` call.

Returns
 {number} ---The number of particles which will be emitted.

__getFreeParticleCount()__

Get the number of particles which are still available for allocation.

Returns
 {number} ---The number of particles still available.

__setAngles(minAngle, maxAngle)__

Set the angles between which particles will be emitted.

Parameters
 + `minAngle {number} = 0` ---The minimum angle in radians.
 + `maxAngle {number} = Math.PI * 2` ---The maximum angle in radians.

__tick(dt)__

This function should be called each frame and updates all particles in the system.
The `tick` function calles the step callback of all particles in the system.

Parameters
 + `dt {number}` ---The number of milli seconds elepsed since the last frame.

__clear()__

Deactivate all particles.

#### Particle callbacks