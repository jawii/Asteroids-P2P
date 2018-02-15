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
	this.scaleFactor = AsteroidMath.GameState.assetScaleFactor;

	AsteroidMath.GameState.asteroids.add(this);
	//create physic shapes
	this.loadTexture('sprites', this.data.texture + '.png');
	console.log();
	this.body.clearShapes();
	this.scale.set(this.scaleFactor);
	this.body.loadPolygon('physics', this.data.physic);
	this.body.mass = this.data.mass;
	//create collision group
	this.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
	this.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup, AsteroidMath.GameState.wallsCollisionGroup]);
	this.game.physics.p2.setMaterial(AsteroidMath.GameState.asteroidMaterial, [this.body]);

	this.scale.set(0);
	var startTween = this.game.add.tween(this.scale).to({ x: this.scaleFactor, y: this.scaleFactor}, 1000, null, true);

	//make sprite appear in the world - tween

	//tint that heavier sprites gets darker
	// this.tint = 0xFFFFFF
	// this.tint = (5 - this.data.mass)/10 * 0xFFFFFF;

	// this.massText = this.game.add.text(this.x, this.y, Math.round(this.body.mass));

	var style = {
		font: '18px Arial',
		fill: 'white'
	}
	// console.log(this.height);
	this.valuetext = this.game.add.text(this.x, this.y, data.value.text, style);
	this.valuetext.anchor.setTo(0.5);
	this.valuetext.visible = false;

};

AsteroidMath.Asteroid.prototype.update = function(){
	//check if it's in blue home-area
	if(this.alive && this.body.x < AsteroidMath.GameState.blueData.homeArea.x2 && this.body.x > AsteroidMath.GameState.blueData.homeArea.x1 && this.body.y < AsteroidMath.GameState.blueData.homeArea.y2 && this.body.y > AsteroidMath.GameState.blueData.homeArea.y1){
		// console.log("blue collected");
		this.asteroidCollected('blue');
	}
	else if(this.alive && this.body.x < AsteroidMath.GameState.redData.homeArea.x2 && this.body.x > AsteroidMath.GameState.redData.homeArea.x1 && this.body.y < AsteroidMath.GameState.redData.homeArea.y2 && this.body.y > AsteroidMath.GameState.redData.homeArea.y1){
		// console.log("red collected");
		this.asteroidCollected('red');
	}

	this.valuetext.x = this.x;
	this.valuetext.y = this.bottom + 10;
};

AsteroidMath.Asteroid.prototype.asteroidCollected = function(color){
	//add score
	this.alive = false;

	//create tween 
	var killTween = this.game.add.tween(this.scale).to({ x: 0, y: 0}, 1000, null, true);
	
	killTween.onComplete.add(function(){
		this.valuetext.destroy();
		Phaser.Sprite.prototype.kill.call(this);

		if(color == 'red'){
		AsteroidMath.GameState.redScores[this.frameName.slice(0, this.frameName.indexOf('.')) + 's'] += 1;
		// AsteroidMath.GameState.updateScores('red');
		AsteroidMath.GameState.updateShipScore('red', this.data.value);

		// AsteroidMath.GameState.blueData.score += this.data.value.value
		}
		else{
			AsteroidMath.GameState.blueScores[this.frameName.slice(0, this.frameName.indexOf('.')) + 's'] += 1;
			// AsteroidMath.GameState.updateScores('blue');
			AsteroidMath.GameState.updateShipScore('blue', this.data.value);
		}
		//createa aseteroid
		AsteroidMath.GameState.createRandomAsteroid();
	}, this);

	
}
