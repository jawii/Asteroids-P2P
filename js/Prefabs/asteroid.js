var AsteroidMath = AsteroidMath || {};

AsteroidMath.Asteroid = function(state, x, y, data){

	Phaser.Sprite.call(this, state.game, x, y, 'sprites', data.texture + '.png');

	this.state = state;
	this.game = state.game;

	this.reset(x, y, data, this);

};

AsteroidMath.Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
AsteroidMath.Asteroid.prototype.constructor = AsteroidMath.Asteroid;


AsteroidMath.Asteroid.prototype.reset = function(x, y, data){

	Phaser.Sprite.prototype.reset.call(this, x, y);

	this.data = data;

	AsteroidMath.GameState.asteroids.add(this);
	//create physic shapes
	this.loadTexture('sprites', this.data.texture + '.png');
	console.log();
	this.body.clearShapes();
	this.scale.set(0.5);
	this.body.loadPolygon('physics', this.data.physic);
	this.body.mass = this.data.mass;
	//create collision group
	this.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
	this.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup, AsteroidMath.GameState.wallsCollisionGroup]);
	this.game.physics.p2.setMaterial(AsteroidMath.GameState.asteroidMaterial, [this.body]);

	//make sprite appear in the world - tween

	//tint that heavier sprites gets darker
	// this.tint = 0xFFFFFF
	// this.tint = (5 - this.data.mass)/10 * 0xFFFFFF;

	// this.massText = this.game.add.text(this.x, this.y, Math.round(this.body.mass));
};

AsteroidMath.Asteroid.prototype.update = function(){
	//check if it's in blue home-area
	if(this.alive && this.body.x < AsteroidMath.GameState.blueData.homeArea.x2 && this.body.x > AsteroidMath.GameState.blueData.homeArea.x1 && this.body.y < AsteroidMath.GameState.blueData.homeArea.y2 && this.body.y > AsteroidMath.GameState.blueData.homeArea.y1){
		console.log("blue collected");
		this.asteroidCollected('blue');
	}
	else if(this.alive && this.body.x < AsteroidMath.GameState.redData.homeArea.x2 && this.body.x > AsteroidMath.GameState.redData.homeArea.x1 && this.body.y < AsteroidMath.GameState.redData.homeArea.y2 && this.body.y > AsteroidMath.GameState.redData.homeArea.y1){
		console.log("red collected");
		this.asteroidCollected('red');
	}

	// this.massText.x = this.x;
	// this.massText.y = this.y;
};

AsteroidMath.Asteroid.prototype.asteroidCollected = function(color){
	Phaser.Sprite.prototype.kill.call(this);
	// this.destroy();
	//add score
	if(color == 'red'){
		AsteroidMath.GameState.redScores[this.frameName.slice(0, this.frameName.indexOf('.')) + 's'] += 1;
		AsteroidMath.GameState.updateScores('red');
	}
	else{
		AsteroidMath.GameState.blueScores[this.frameName.slice(0, this.frameName.indexOf('.')) + 's'] += 1;
		AsteroidMath.GameState.updateScores('blue');
	}

	
	//createa aseteroid
	AsteroidMath.GameState.createRandomAsteroid();
}
