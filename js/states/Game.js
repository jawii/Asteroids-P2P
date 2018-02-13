var AsteroidMath = AsteroidMath || {};

AsteroidMath.GameState = {

  init: function(currentLevel) {    
    //constants
    // this.MAX_DISTANCE_SHOOT = 190;
    // this.MAX_SPEED_SHOOT = 1000;
    // this.SHOOT_FACTOR = 12;
    this.THRUST = 750;
    this.DEBUG = false;
    this.SHIPMASS = 5;


    this.blueData = {
      spawn: {x: 150, y: 130},
      homeArea: {x1: 0, x2: 190, y1: 0, y2: 120},
      angle: 135
    }
    this.redData = {
      spawn: {x: 1060, y: 550},
      homeArea: {x1: 1000, x2: 1200, y1: 680, y2: 800},
      angle: -45
    }

    this.blueScores = {
        circles: 0,
        hexagons: 0,
        pentagons: 0,
        squares: 0,
        stars: 0,
        triangles: 0
    }
    this.redScores = {
        circles: 0,
        hexagons: 0,
        pentagons: 0,
        squares: 0,
        stars: 0,
        triangles: 0
    }

    this.asteroidTextures = ['circle', 'hexagon', 'pentagon', 'square', 'star', 'triangle'];
    //keep track of the current level
    this.currentLevel = currentLevel ? currentLevel : 'level1';

    //initiate physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);

  },
  create: function() {     

    //set bounds 
    this.game.world.setBounds(0, 0, 1200, 800); 
    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.5;

    //collisiongroups
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.asteroidCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.wallsCollisionGroup = this.game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup();

    //sky background
    // this.sky = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'sky');
    // this.game.world.sendToBack(this.sky);
    this.game.stage.backgroundColor = '#000';

    //walls
    this.walls = this.add.group();
    this.walls.enableBody = true;
    this.walls.physicsBodyType = Phaser.Physics.P2JS;

    //gui
    //create group for all icons
    this.guiIconGroup = this.game.add.group();
    this.guiTextGroupBlue = this.game.add.group();
    this.guiTextGroupRed = this.game.add.group();
    this.game.world.sendToBack(this.guiIconGroup);
    this.game.world.sendToBack(this.guiTextGroupBlue);
    this.game.world.sendToBack(this.guiTextGroupRed);

   

    //Player homeland
    var graphics = this.game.add.graphics(0, 0);
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(this.blueData.homeArea.x1, this.blueData.homeArea.y1, this.blueData.homeArea.x2 - this.blueData.homeArea.x1, this.blueData.homeArea.y2 - this.blueData.homeArea.y1);

    graphics.lineStyle(2, 0xFF0000, 1);
    graphics.drawRect(this.redData.homeArea.x1, this.redData.homeArea.y1, this.redData.homeArea.x2 - this.redData.homeArea.x1, this.redData.homeArea.y2 - this.redData.homeArea.y1);
    
    //create gravity wells
    // var blueGravityWellmanager = this.game.plugins.add(Phaser.ParticleStorm);
    // var data = {
    //     lifespan: 1000,
    //     image: '4x4',
    //     vy: { min: 0.5, max: 1 },  
    // }
    // blueGravityWellmanager.addData('basic', data);
    // blueGravityEmitter = blueGravityWellmanager.createEmitter();
    // //  Create a Gravity Well on the Emitter.
    // var well = blueGravityEmitter.createGravityWell(50, 50, 1, 200);
    // var line = blueGravityWellmanager.createLineZone(100, 50, 700, 50);
    // blueGravityEmitter.addToWorld();
    // blueGravityEmitter.emit('basic', 0, 0, { zone: line, total: 2, repeat: -1, frequency: 50 });



    //background
    var background = this.game.add.sprite(this.game.width/2, this.game.height/2, 'background');
    this.game.physics.p2.enable(background, this.DEBUG);
    background.body.clearShapes();
    background.scale.set(0.5);
    background.body.loadPolygon('physics', 'background');
    background.body.static = true;
    console.log(background.body.y);
    background.body.setCollisionGroup(this.wallsCollisionGroup);
    background.body.collides(this.asteroidCollisionGroup, null, this);
    background.body.collides(this.playerCollisionGroup, null, this);
    this.game.world.sendToBack(background);

    var wall1 = this.game.add.sprite(200, 400, 'sprites', 'wall1.png');
    this.game.physics.p2.enable(wall1, this.DEBUG);
    wall1.body.clearShapes();
    wall1.scale.set(0.5);
    wall1.body.loadPolygon('physics', 'wall1');
    wall1.body.static = true;
    wall1.body.setCollisionGroup(this.wallsCollisionGroup);
    wall1.body.collides(this.asteroidCollisionGroup, null, this);
    wall1.body.collides(this.playerCollisionGroup, null, this);
    // background.body.debug = true;


    //PLAYERS
    this.createShips();

    //MATERIALS
    this.asteroidMaterial = this.game.physics.p2.createMaterial('asteroidMaterial');
    this.shipMaterial = this.game.physics.p2.createMaterial('shipMaterial');
    this.game.physics.p2.setMaterial(this.shipMaterial, [this.shipRed.body, this.shipBlue.body]);
    
    this.asteroidShipContactMaterial = this.game.physics.p2.createContactMaterial(this.shipMaterial, this.asteroidMaterial);
    this.asteroidShipContactMaterial.restitution = 0;
    
    this.asteroidAsteroidContactMaterial = this.game.physics.p2.createContactMaterial(this.asteroidMaterial, this.asteroidMaterial);
    this.asteroidAsteroidContactMaterial.restitution = 0.7;

    this.shipShipContactMaterial = this.game.physics.p2.createContactMaterial(this.shipMaterial, this.shipMaterial);
    this.shipShipContactMaterial.restitution = 2.0;

    //asteroid
    this.asteroids = this.add.group();
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.P2JS;

    this.loadLevel();

    this.createGui();



  },   
  update: function() {  
    //reset ship frames
    this.shipRed.frameName = 'ship_red1.png'
    this.shipBlue.frameName = 'ship_blue1.png'
    //ship movement
    if (this.cursors.left.isDown){this.shipBlue.body.rotateLeft(50);}
    else if(this.cursors.right.isDown){this.shipBlue.body.rotateRight(50);}
    else{this.shipBlue.body.setZeroRotation();}
    if(this.cursors.up.isDown){
        this.shipBlue.frameName = 'ship_blue2.png';
        this.shipBlue.body.thrust(this.THRUST);
        var angle = this.shipBlue.body.angle
        var x = this.shipBlue.x - Math.sin(angle* 0.0174532925) * 25;
        var y = this.shipBlue.y + Math.cos(angle * 0.0174532925) * 25;
        this.blueShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });

    }
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(this.THRUST/2);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(50);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){
        //animation
        this.shipRed.frameName = 'ship_red2.png';
        this.shipRed.body.thrust(this.THRUST);
        var angle = this.shipRed.body.angle
        var x = this.shipRed.x - Math.sin(angle* 0.0174532925) * 25;
        var y = this.shipRed.y + Math.cos(angle * 0.0174532925) * 25;
        this.redShipEmitter.emit('basic', x, y, { zone: this.redShipCircle, total: 1 });
    }
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(this.THRUST/2);}
  },

  createShips: function(){
    //BLUESHIP
    this.shipBlue = this.game.add.sprite(this.blueData.spawn.x, this.blueData.spawn.y, 'sprites', 'ship_blue1.png');
    this.game.physics.p2.enable(this.shipBlue, this.DEBUG);
    this.shipBlue.body.clearShapes();
    this.shipBlue.scale.set(0.5);
    this.shipBlue.body.loadPolygon('physics', 'ship');
    this.shipBlue.body.collideWorldBounds = true;
    this.shipBlue.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipBlue.body.collides(this.asteroidCollisionGroup, null, this);
    this.shipBlue.body.collides(this.playerCollisionGroup, null, this);
    this.shipBlue.body.collides(this.wallsCollisionGroup, null, this);
    this.shipBlue.body.mass = this.SHIPMASS;
    this.shipBlue.body.angle = this.blueData.angle;
    // this.shipBlue.scale.set(0.5);
    this.shipBlue.body.debug = this.DEBUG;

    //particle storm
    this.blueParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    var blueEmitterData = {
        image: '4x4_blue',
        // frame: ['blue'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.4 }] },
        sendToBack: true
    };

    this.blueParticleManager.addData('basic', blueEmitterData);
    this.blueShipCircle = this.blueParticleManager.createCircleZone(10);
    this.blueShipEmitter = this.blueParticleManager.createEmitter();
    this.blueShipEmitter.addToWorld();


    //REDSHIP
    this.shipRed = this.game.add.sprite(this.redData.spawn.x, this.redData.spawn.y, 'sprites', 'ship_red1.png');
    this.game.physics.p2.enable(this.shipRed, this.DEBUG);
    this.shipRed.body.clearShapes();
    this.shipRed.scale.set(0.5);
    this.shipRed.body.loadPolygon('physics', 'ship');
    this.shipRed.body.collideWorldBounds = true;
    this.shipRed.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipRed.body.collides(this.asteroidCollisionGroup, null, this);
    this.shipRed.body.collides(this.playerCollisionGroup, null, this);
    this.shipRed.body.collides(this.wallsCollisionGroup, null, this);
    this.shipRed.body.mass = this.SHIPMASS;
    this.shipRed.body.angle = this.redData.angle;
    // this.shipRed.scale.set(0.25);
    this.shipRed.body.debug = this.DEBUG;
    this.redParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    var redEmitterData = {
        image: '4x4_red',
        // frame: ['red'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.4 }] },
        sendToBack: true
    };

    this.redParticleManager.addData('basic', redEmitterData);
    this.redShipCircle = this.redParticleManager.createCircleZone(10);
    this.redShipEmitter = this.redParticleManager.createEmitter();
    this.redShipEmitter.addToWorld();
    //controls
    this.cursors = this.game.input.keyboard.createCursorKeys();   
    this.shipRedUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W); 
    this.shipRedDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S); 
    this.shipRedLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A); 
    this.shipRedRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D); 
    //weapon fire
    // this.blueFire = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL); 
    // this.redFire = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
  },

  gameOver: function() {
    this.game.state.start('Game', true, false, this.currentLevel);
  },

  loadLevel: function(){
    //creates 10 asteroids
    for (var i = 0 ; i < 11 ; i++){
        this.createRandomAsteroid();
    }
    

  },

  createRandomAsteroid: function(){

    //create random place in game area
    var x = this.game.rnd.integerInRange(0, this.game.width);
    var y = this.game.rnd.integerInRange(0, this.game.height);

    //check if x and y dont overlap with walls
    var data = {}
    data.texture = this.asteroidTextures[Math.floor(Math.random()*this.asteroidTextures.length)];
    data.physic = data.texture;
    // data.mass = Math.random() * 10;
    data.mass = 10;
    console.log(data.mass);

    //look for dead element
    var newElement = this.asteroids.getFirstDead();

    if(!newElement || this.asteroids.children.length < 20){
      newElement = new AsteroidMath.Asteroid(this, x, y, data);
      this.asteroids.add(newElement);
    }
    else{
      newElement.reset(x, y, data);
    }
    return newElement;

}, 

createGui: function(){

    var scoreTextStyle = {
        font: '14px Arial',
        fill: 'white'
    };
  
    //ICONS
    //blue player
    //first row
    var x1 = 60;
    //second row
    var x2 = 120;
    //y-offset
    var offsetY = 25;
    var triangleBlue = this.game.add.sprite(x1, 45, 'sprites', 'triangle.png');
    this.guiIconGroup.add(triangleBlue);
    var squareBlue = this.game.add.sprite(x1, 45 + offsetY * 1, 'sprites', 'square.png');
    this.guiIconGroup.add(squareBlue);
    var pentagonBlue = this.game.add.sprite(x1, 45 + offsetY * 2, 'sprites', 'pentagon.png');
    this.guiIconGroup.add(pentagonBlue);

    var hexagonBlue = this.game.add.sprite(x2, 45 + offsetY * 0, 'sprites', 'hexagon.png');
    this.guiIconGroup.add(hexagonBlue);
    var circleBlue = this.game.add.sprite(x2, 45 + offsetY * 1, 'sprites', 'circle.png');
    this.guiIconGroup.add(circleBlue);
    var starBlue = this.game.add.sprite(x2, 45 + offsetY * 2, 'sprites', 'star.png');
    this.guiIconGroup.add(starBlue);

    var textOffset = 2;
    var triangleBlueText = this.game.add.text(triangleBlue.x + 25, triangleBlue.y + textOffset, 'x ' + this.blueScores.triangles, scoreTextStyle);
    triangleBlueText.name = "triangle";
    this.guiTextGroupBlue.add(triangleBlueText);
    var squareBlueText = this.game.add.text(squareBlue.x + 25, squareBlue.y + textOffset, 'x ' + this.blueScores.squares, scoreTextStyle);
    squareBlueText.name = "square";
    this.guiTextGroupBlue.add(squareBlueText);
    var pentagonBlueText = this.game.add.text(pentagonBlue.x + 25, pentagonBlue.y + textOffset, 'x ' + this.blueScores.pentagons, scoreTextStyle);
    pentagonBlueText.name = "pentagon";
    this.guiTextGroupBlue.add(pentagonBlueText);

    var hexagonBlueText = this.game.add.text(hexagonBlue.x + 25, hexagonBlue.y + textOffset, 'x ' + this.blueScores.hexagons, scoreTextStyle);
    hexagonBlueText.name = "hexagon";
    this.guiTextGroupBlue.add(hexagonBlueText);
    var circleBlueText = this.game.add.text(circleBlue.x + 25, circleBlue.y + textOffset, 'x ' + this.blueScores.circles, scoreTextStyle);
    circleBlueText.name = "circle"
    this.guiTextGroupBlue.add(circleBlueText);
    var starBlueText = this.game.add.text(starBlue.x + 25, starBlue.y + textOffset, 'x ' + this.blueScores.stars, scoreTextStyle);
    starBlueText.name = "star"
    this.guiTextGroupBlue.add(starBlueText);


    //RED
    var x3 = 1050;
    //second row
    var x4 = 1110;
    var y1 = 700
    var triangleRed = this.game.add.sprite(x3, y1, 'sprites', 'triangle.png');
    this.guiIconGroup.add(triangleRed);
    var squareRed = this.game.add.sprite(x3, y1 + offsetY * 1, 'sprites', 'square.png');
    this.guiIconGroup.add(squareRed);
    var pentagonRed = this.game.add.sprite(x3, y1 + offsetY * 2, 'sprites', 'pentagon.png');
    this.guiIconGroup.add(pentagonRed);

    var hexagonRed = this.game.add.sprite(x4, y1 + offsetY * 0, 'sprites', 'hexagon.png');
    this.guiIconGroup.add(hexagonRed);
    var circleRed = this.game.add.sprite(x4, y1 + offsetY * 1, 'sprites', 'circle.png');
    this.guiIconGroup.add(circleRed);
    var starRed = this.game.add.sprite(x4, y1 + offsetY * 2, 'sprites', 'star.png');
    this.guiIconGroup.add(starRed);

    var textOffset = 2;
    var triangleRedText = this.game.add.text(triangleRed.x + 25, triangleRed.y + textOffset, 'x ' + this.redScores.triangles, scoreTextStyle);
    triangleRedText.name = "triangle";
    this.guiTextGroupRed.add(triangleRedText);
    var squareRedText = this.game.add.text(squareRed.x + 25, squareRed.y + textOffset, 'x ' + this.redScores.squares, scoreTextStyle);
    squareRedText.name = "square";
    this.guiTextGroupRed.add(squareRedText);
    var pentagonRedText = this.game.add.text(pentagonRed.x + 25, pentagonRed.y + textOffset, 'x ' + this.redScores.pentagons, scoreTextStyle);
    pentagonRedText.name = "pentagon";
    this.guiTextGroupRed.add(pentagonRedText);

    var hexagonRedText = this.game.add.text(hexagonRed.x + 25, hexagonRed.y + textOffset, 'x ' + this.redScores.hexagons, scoreTextStyle);
    hexagonRedText.name = "hexagon";
    this.guiTextGroupRed.add(hexagonRedText);
    var circleRedText = this.game.add.text(circleRed.x + 25, circleRed.y + textOffset, 'x ' + this.redScores.circles, scoreTextStyle);
    circleRedText.name = "circle";
    this.guiTextGroupRed.add(circleRedText);
    var starRedText = this.game.add.text(starRed.x + 25, starRed.y + textOffset, 'x ' + this.redScores.stars, scoreTextStyle);
    starRedText.name = "star";
    this.guiTextGroupRed.add(starRedText);

    this.guiIconGroup.forEach(function(element){
        element.anchor.setTo(0.5);
        element.scale.setTo(0.18);
    }, this);

    this.guiTextGroupRed.forEach(function(element){
        element.anchor.setTo(0.5);
    }, this);
    this.guiTextGroupBlue.forEach(function(element){
        element.anchor.setTo(0.5);
    }, this);

},

updateScores: function(){
    //update scores
    this.guiTextGroupBlue.forEach(function(element){
        element.setText("x " + this.blueScores[element.name + 's']);
    }, this);
    this.guiTextGroupRed.forEach(function(element){
        element.setText("x " + this.redScores[element.name + 's']);
    }, this);

}

};
