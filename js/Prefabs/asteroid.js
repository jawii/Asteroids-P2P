var AsteroidMath = AsteroidMath || {};

AsteroidMath.Asteroid = function(state, x, y, data){

	Phaser.Sprite.call(this, state.game, x, y, 'sprites', data.texture + '.png');

	this.state = state;
	this.game = state.game;
	this.data = data;

	AsteroidMath.GameState.asteroids.add(this);
	//create physic shapes
	this.body.clearShapes();
	this.scale.set(0.5);
	this.body.loadPolygon('physics', this.data.physic);
	//create collision group
	this.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
	this.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup, AsteroidMath.GameState.wallsCollisionGroup]);
	this.body.mass = this.data.mass;

	// this.body.createBodyCallback(AsteroidMath.GameState.blueHomeArea, this.asteroidCollected, this);

	// console.log(AsteroidMath.GameState.blueHomeArea)
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

AsteroidMath.Asteroid.prototype.update = function(){
	//check if it's in blue home-area
	if(this.body.x < AsteroidMath.GameState.blueData.homeArea.x2 && this.body.x > AsteroidMath.GameState.blueData.homeArea.x1 && this.body.y < AsteroidMath.GameState.blueData.homeArea.y2 && this.body.y > AsteroidMath.GameState.blueData.homeArea.y1){
		console.log("blue collected");
		this.asteroidCollected('blue');
	}
	else if(this.body.x < AsteroidMath.GameState.redData.homeArea.x2 && this.body.x > AsteroidMath.GameState.redData.homeArea.x1 && this.body.y < AsteroidMath.GameState.redData.homeArea.y2 && this.body.y > AsteroidMath.GameState.redData.homeArea.y1){
		console.log("red collected");
		this.asteroidCollected('red');
	}
};

AsteroidMath.Asteroid.prototype.asteroidCollected = function(){
	Phaser.Sprite.prototype.destroy.call(this);
	// this.destroy();
}
