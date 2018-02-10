var AsteroidMath = AsteroidMath || {};

AsteroidMath.Asteroid = function(state, x, y, data){

	Phaser.Sprite.call(this, state.game, x, y, data.texture);

	this.state = state;
	this.game = state.game;
	this.data = data;

	AsteroidMath.GameState.asteroids.add(this);
	//create physic shapes
	this.body.clearShapes();
	this.body.loadPolygon('physics', this.data.physic);
	//create collision group
	this.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
	this.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup]);
	this.body.mass = this.data.mass;
	// this.body.debug = AsteroidMath.GameState.DEBUG;


	// var asteroid1 =this.asteroids.create(500, 500, 'asteroid1');
	// // asteroid.scale.set(0.5);
	// asteroid1.body.clearShapes();
	// asteroid1.body.loadPolygon('physics', 'asteroid1');
	// asteroid1.body.setCollisionGroup(this.asteroidCollisionGroup);
	// asteroid1.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
	// asteroid1.body.mass = 10;
	// asteroid1.body.debug = this.DEBUG;

};

AsteroidMath.Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
AsteroidMath.Asteroid.prototype.constructor = AsteroidMath.Asteroid;