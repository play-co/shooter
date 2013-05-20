import ui.View as View;

import src.lib.ViewPool as ViewPool;

import src.shooter.particle.ParticleSystem as ParticleSystem;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		opts.blockEvents = true;

		supr(this, 'init', [opts]);

		this._viewPools = [];
		this._particleSystem = [];
	};

	this.reset = function () {
		for (var i in this._particleSystem) {
			this._particleSystem[i].releaseAllViews();
		}		
	};

	this.obtainView = function (opts) {
		var viewPool = this._viewPools[opts.type];
		var view = viewPool.obtainView(opts);

		opts.releaseView = function () {
			viewPool.releaseView(view);
			opts.view = null;
		};

		return view;
	};

	this.addViewPool = function (type, viewPoolOpts) {
		this._viewPools[type] = new ViewPool(viewPoolOpts);
	};

	this.getViewPools = function () {
		return this._viewPools;
	};

	this.addParticleSystem = function (type, particleSystemOpts) {
		this._particleSystem[type] = new ParticleSystem(particleSystemOpts);
	};

	this.getParticleSystem = function (particleSystem) {
		return this._particleSystem[particleSystem];
	};

	this.createParticles = function (particleSystem, particleType, pos, velocity, count) {
		particleSystem = this._particleSystem[particleSystem];
		if (particleSystem) {
			particleType && particleSystem.activateType(particleType);

			if (count) {
				var systemCount = particleSystem.getCount();
				count = count > systemCount ? systemCount : count;
			}

			particleSystem.addParticles(pos, velocity, count);
		}
	};


	this.update = function (dt) {
		for (var i in this._particleSystem) {
			var particleSystem = this._particleSystem[i];
			particleSystem && particleSystem.tick(dt);
		}
	};

	this.createLayer = function (tag, superview) {
		return new View({
			superview: superview || this,
			x: 0,
			y: 0,
			width: this.style.width,
			height: this.style.height,
			tag: tag,
			blockEvents: true
		});
	};
});