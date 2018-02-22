var AsteroidMath = AsteroidMath || {};

AsteroidMath.Asteroid = function(state, x, y, data){

	Phaser.Sprite.call(this, state.game, x, y, null);

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
	this.body.mass = this.data.mass;


	var textures = ['triangle', 'rectangle', 'pentagon', 'hexagon', 'circle'];
	// var textures = ['rectangle','circle'];
	var shape = textures[Math.floor(Math.random() * textures.length)]

	this.body.clearShapes();
	this.makeTexture(shape);
    

	//create collision group
	this.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
	this.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup, AsteroidMath.GameState.wallsCollisionGroup]);
	this.game.physics.p2.setMaterial(AsteroidMath.GameState.asteroidMaterial, [this.body]);

	this.scale.set(0);
	var startTween = this.game.add.tween(this.scale).to({ x: 1, y: 1}, 1000, null, true);
	//make sprite appear in the world - tween

	var rnd = Math.random();
	this.alpha = Math.max(rnd, 0.25);
	this.body.mass = rnd * 5;

	//tint that heavier sprites gets darker
	// this.tint = 0xFFFFFF
	// this.tint = (5 - this.data.mass)/10 * 0xFFFFFF;

	var style = {
		font: '18px Arial',
		fill: 'white'
	};
	this.valuetext = this.game.add.text(this.x, this.y, AsteroidMath.GameState.parseText(data.value.text), style);
	this.valuetext.anchor.setTo(0.5);
	this.valuetext.visible = false;

};

AsteroidMath.Asteroid.prototype.update = function(){
	//check if it's in blue home-area
	if(!AsteroidMath.GameState.blueData.collecting && this.alive && this.body.x < AsteroidMath.GameState.blueData.homeArea.x2 && this.body.x > AsteroidMath.GameState.blueData.homeArea.x1 && this.body.y < AsteroidMath.GameState.blueData.homeArea.y2 && this.body.y > AsteroidMath.GameState.blueData.homeArea.y1){
		// console.log("blue collected");
		AsteroidMath.GameState.blueData.collecting = true;
		this.asteroidCollected('blue');
	}
	else if(!AsteroidMath.GameState.redData.collecting && this.alive && this.body.x < AsteroidMath.GameState.redData.homeArea.x2 && this.body.x > AsteroidMath.GameState.redData.homeArea.x1 && this.body.y < AsteroidMath.GameState.redData.homeArea.y2 && this.body.y > AsteroidMath.GameState.redData.homeArea.y1){
		// console.log("red collected");
		AsteroidMath.GameState.redData.collecting = true;
		this.asteroidCollected('red');
	}

	this.valuetext.x = this.x;
	this.valuetext.y = this.bottom + 15;
};

AsteroidMath.Asteroid.prototype.asteroidCollected = function(color){
	//add score
	this.alive = false;

	//create tween 
	var killTween = this.game.add.tween(this.scale).to({ x: 0, y: 0}, 1000, null, true);
	
	killTween.onComplete.add(function(){
		this.valuetext.destroy();
		Phaser.Sprite.prototype.kill.call(this);
		this.scale.set(1);

		if(color == 'red'){
			AsteroidMath.GameState.updateShipScore('red', this.data.value);
		}
		else{
			AsteroidMath.GameState.updateShipScore('blue', this.data.value);
		}
		//createa aseteroid
		AsteroidMath.GameState.createRandomAsteroid();
	}, this);	
};

AsteroidMath.Asteroid.prototype.makeTexture = function(shape){
	//GENERATE TEXTURE CIRCLE
 	var graphics = this.game.add.graphics(0, 0);
 	graphics.beginFill(this.data.color);

 	if(shape == 'circle'){
 		graphics.drawCircle(0, 0, 30);
		graphics.endFill();
		this.loadTexture(graphics.generateTexture());
		this.body.setCircle(15);
 	}
 	else if(shape == 'rectangle'){
 		graphics.drawRect(0, 0, 30, 30);
 		graphics.endFill();
 		this.loadTexture(graphics.generateTexture());
 		this.body.setRectangle(30, 30);
 	}
 	else if(shape == 'triangle'){
 		var polygon = new Phaser.Polygon([41,36, 0,36, 21,0 ]);
 		graphics.drawPolygon(polygon.points);
		graphics.endFill();
		this.loadTexture(graphics.generateTexture());
		this.body.loadPolygon('physics', 'triangle');
 	}
 	else if(shape == 'pentagon'){
 		var polygon = new Phaser.Polygon([0,12, 18,0, 36,12, 29,34, 6,34]);
		graphics.drawPolygon(polygon.points);
		graphics.endFill();
		this.loadTexture(graphics.generateTexture());
		this.body.loadPolygon('physics', 'pentagon');
 	}
 	else if(shape == 'hexagon'){
 		var polygon = new Phaser.Polygon([0,18, 10,1, 32,1, 42,19, 31,37, 10,37]);
		graphics.drawPolygon(polygon.points);
		graphics.endFill();
		this.loadTexture(graphics.generateTexture());
		this.body.loadPolygon('physics', 'hexagon');
 	}
 	// this.body.debug = true;
 	graphics.destroy();
}

///BITMAP as a Sprite
// var bmd = this.game.add.bitmapData(25, 25);
//    bmd.ctx.beginPath();
//    bmd.ctx.rect(0,0,25,25);
//    bmd.ctx.fillStyle = '#ffffff';
//    bmd.ctx.fill();
//    this.loadTexture(bmd);