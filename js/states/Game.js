var AsteroidMath = AsteroidMath || {};

AsteroidMath.GameState = {

  init: function(currentLevel) {    
    //constants
    // this.MAX_DISTANCE_SHOOT = 190;
    // this.MAX_SPEED_SHOOT = 1000;
    // this.SHOOT_FACTOR = 12;
    this.THRUST = 750;
    this.DEBUG = false;
    this.SHIPMASS = 2;

    this.assetScaleFactor = 0.25;


    this.levelData = {
        xValue: 3,
    }


    this.blueData = {
      spawn: {x: 150, y: 130},
      homeArea: {x1: 20, x2: 190, y1: 20, y2: 120},
      angle: 135,
      score: 0,
      scoreText: {x: 100, y: 200}
    }
    this.redData = {
      spawn: {x: 1060, y: 550},
      homeArea: {x1: 1000, x2: 1200, y1: 660, y2: 780},
      angle: -45,
      score: 0,
      scoreText: {x: 960, y: 600}
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

    //GROUPS
    //walls
    this.walls = this.add.group();
    this.walls.enableBody = true;
    this.walls.physicsBodyType = Phaser.Physics.P2JS;

    //create group for all player collected icons
    this.guiIconGroupBlue = this.game.add.group();
    this.guiIconGroupRed = this.game.add.group();
    this.guiTextGroupBlue = this.game.add.group();
    this.guiTextGroupRed = this.game.add.group();
    this.game.world.sendToBack(this.guiIconGroupBlue);
    this.game.world.sendToBack(this.guiIconGroupRed);
    this.game.world.sendToBack(this.guiTextGroupBlue);
    this.game.world.sendToBack(this.guiTextGroupRed);

    //collisiongroups
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.asteroidCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.wallsCollisionGroup = this.game.physics.p2.createCollisionGroup();

    //set bounds 
    this.game.world.setBounds(0, 0, 1200, 800); 
    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.5;

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup();

    //sky background
    // this.sky = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'sky');
    // this.game.world.sendToBack(this.sky);
    this.game.stage.backgroundColor = '#000';


    //JSON PARSE VALUES TO ARRAY
    this.valueData = Object.values(JSON.parse(this.game.cache.getText('values')));
    console.log(this.valueData);


    //THE X VALUE
    var style = {
        font: '20px Arial',
        fill: 'white'
    }
    this.xValueText = this.game.add.text(600, 200, 'x = ' + this.levelData.xValue, style);
    this.game.world.bringToTop(this.xValueText);

    //player scoreTexts
    this.redPlayerScoreText = this.game.add.text(this.redData.scoreText.x, this.redData.scoreText.y, this.redData.score, style);
    this.bluePlayerScoreText = this.game.add.text(this.blueData.scoreText.x, this.blueData.scoreText.y, this.blueData.score, style);

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

    // var wall1 = this.game.add.sprite(200, 400, 'sprites', 'wall1.png');
    // this.game.physics.p2.enable(wall1, this.DEBUG);
    // wall1.body.clearShapes();
    // wall1.scale.set(this.assetScaleFactor);
    // wall1.body.loadPolygon('physics', 'wall1');
    // wall1.body.static = true;
    // wall1.body.setCollisionGroup(this.wallsCollisionGroup);
    // wall1.body.collides(this.asteroidCollisionGroup, null, this);
    // wall1.body.collides(this.playerCollisionGroup, null, this);
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
    //group for geometry piece info 
    this.missionTable = this.game.add.group();

    this.loadLevel();
    this.createPlayerScoreTables();
    // this.createMission();

    //////
    //testing bitmap sprites
    /////
    //circle
    // var bmd = this.game.add.bitmapData(50, 50);
    // bmd.ctx.beginPath();
    // bmd.ctx.rect(0,0,50,50);
    // bmd.ctx.fillStyle = '#ffffff';
    // bmd.ctx.fill();
    // var bitmapSprite = this.game.add.sprite(400, 400, bmd);
    // AsteroidMath.GameState.asteroids.add(bitmapSprite);
    // bitmapSprite.body.setCollisionGroup(AsteroidMath.GameState.asteroidCollisionGroup);
    // bitmapSprite.body.collides([AsteroidMath.GameState.asteroidCollisionGroup, AsteroidMath.GameState.playerCollisionGroup, AsteroidMath.GameState.wallsCollisionGroup]);
    // bitmapSprite.game.physics.p2.setMaterial(AsteroidMath.GameState.asteroidMaterial, [bitmapSprite.body]);
    // bitmapSprite.body.debug = true;
    

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
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipBlue.x + x_angle * 25;
        var y = this.shipBlue.y +  y_angle * 25;
        this.blueEmitterData.vx = { value: { min: x_angle, max: x_angle * 2} };
        this.blueEmitterData.vy = { value: { min: y_angle, max: y_angle * 2} };
        this.blueShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });
    }
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(this.THRUST/2);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(50);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){
        this.shipRed.frameName = 'ship_red2.png';
        this.shipRed.body.thrust(this.THRUST);
        var angle = this.shipRed.body.angle
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipRed.x + x_angle * 25;
        var y = this.shipRed.y +  y_angle * 25;
        this.redEmitterData.vx = { value: { min: x_angle, max: x_angle * 2} };
        this.redEmitterData.vy = { value: { min: y_angle, max: y_angle * 2} };
        this.redShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });
    }
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(this.THRUST/2);}
  },

  createShips: function(){
    //BLUESHIP
    this.shipBlue = this.game.add.sprite(this.blueData.spawn.x, this.blueData.spawn.y, 'sprites', 'ship_blue1.png');
    this.game.physics.p2.enable(this.shipBlue, this.DEBUG);
    this.shipBlue.body.clearShapes();
    this.shipBlue.scale.set(this.assetScaleFactor);
    this.shipBlue.body.loadPolygon('physics', 'ship');
    this.shipBlue.body.collideWorldBounds = true;
    this.shipBlue.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipBlue.body.collides(this.asteroidCollisionGroup, this.asteroidCollide, this);
    this.shipBlue.body.collides(this.playerCollisionGroup, null, this);
    this.shipBlue.body.collides(this.wallsCollisionGroup, null, this);
    this.shipBlue.body.mass = this.SHIPMASS;
    this.shipBlue.body.angle = this.blueData.angle;
    // this.shipBlue.scale.set(0.5);
    this.shipBlue.body.debug = this.DEBUG;

    //particle storm
    this.blueParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    this.blueEmitterData = {
        image: '4x4_blue',
        // frame: ['blue'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.35 }] },
        sendToBack: true
    };

    this.blueParticleManager.addData('basic', this.blueEmitterData);
    this.blueShipCircle = this.blueParticleManager.createCircleZone(10);
    this.blueShipEmitter = this.blueParticleManager.createEmitter();
    this.blueShipEmitter.addToWorld();


    //REDSHIP
    this.shipRed = this.game.add.sprite(this.redData.spawn.x, this.redData.spawn.y, 'sprites', 'ship_red1.png');
    this.game.physics.p2.enable(this.shipRed, this.DEBUG);
    this.shipRed.body.clearShapes();
    this.shipRed.scale.set(this.assetScaleFactor);
    this.shipRed.body.loadPolygon('physics', 'ship');
    this.shipRed.body.collideWorldBounds = true;
    this.shipRed.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipRed.body.collides(this.asteroidCollisionGroup, this.asteroidCollide, this);
    this.shipRed.body.collides(this.playerCollisionGroup, null, this);
    this.shipRed.body.collides(this.wallsCollisionGroup, null, this);
    this.shipRed.body.mass = this.SHIPMASS;
    this.shipRed.body.angle = this.redData.angle;
    // this.shipRed.scale.set(0.25);
    this.shipRed.body.debug = this.DEBUG;
    this.redParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    this.redEmitterData = {
        image: '4x4_red',
        // frame: ['red'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.4 }] },
        sendToBack: true
    };

    this.redParticleManager.addData('basic', this.redEmitterData);
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
    data.mass = 3;
    data.value = this.valueData[Math.floor(Math.random()* this.valueData.length)]
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

createPlayerScoreTables: function(){

    var scoreTextStyle = {
        font: '14px Arial',
        fill: 'white'
    };
  
    //ICONS
    //blue player
    //first row
    var x1 = 60;
    var y1 = 45
    //second row
    var x2 = 120;
    //y-offset
    var offsetY = 25;
    var textOffset = 2;

    var iconAndTextCoordsBlue = [
        [{x: x1, y: y1 + offsetY * 0}, {x: x1 + 25, y: offsetY * 0 + textOffset}],
        [{x: x1, y: y1 + offsetY * 1}, {x: x1 + 25, y: offsetY * 1 + textOffset}],
        [{x: x1, y: y1 + offsetY * 2}, {x: x1 + 25, y: offsetY * 2 + textOffset}],

        [{x: x2, y: y1 + offsetY * 0}, {x: x1 + 25, y: offsetY * 0 + textOffset}],
        [{x: x2, y: y1 + offsetY * 1}, {x: x1 + 25, y: offsetY * 0 + textOffset}],
        [{x: x2, y: y1 + offsetY * 2}, {x: x1 + 25, y: offsetY * 0 + textOffset}],
        ];
    
    var triangleBlue = this.game.add.sprite(iconAndTextCoordsBlue[0][0].x, 45, 'sprites', 'triangle.png');
    triangleBlue.name = "triangle";
    this.guiIconGroupBlue.add(triangleBlue);
    var squareBlue = this.game.add.sprite(x1, 45 + offsetY * 1, 'sprites', 'square.png');
    squareBlue.name = "square";
    this.guiIconGroupBlue.add(squareBlue);
    var pentagonBlue = this.game.add.sprite(x1, 45 + offsetY * 2, 'sprites', 'pentagon.png');
    pentagonBlue.name = 'pentagon';
    this.guiIconGroupBlue.add(pentagonBlue);
    var hexagonBlue = this.game.add.sprite(x2, 45 + offsetY * 0, 'sprites', 'hexagon.png');
    hexagonBlue.name = 'hexagon';
    this.guiIconGroupBlue.add(hexagonBlue);
    var circleBlue = this.game.add.sprite(x2, 45 + offsetY * 1, 'sprites', 'circle.png');
    circleBlue.name = 'circle';
    this.guiIconGroupBlue.add(circleBlue);
    var starBlue = this.game.add.sprite(x2, 45 + offsetY * 2, 'sprites', 'star.png');
    starBlue.name = 'star';
    this.guiIconGroupBlue.add(starBlue);

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
    var x1 = 1050;
    var y1 = 700
    var x2 = 1110;
    var triangleRed = this.game.add.sprite(x1, y1, 'sprites', 'triangle.png');
    triangleRed.name = "triangle";
    this.guiIconGroupRed.add(triangleRed);
    var squareRed = this.game.add.sprite(x1, y1 + offsetY * 1, 'sprites', 'square.png');
    squareRed.name = "square";
    this.guiIconGroupRed.add(squareRed);
    var pentagonRed = this.game.add.sprite(x1, y1 + offsetY * 2, 'sprites', 'pentagon.png');
    pentagonRed.name = "pentagon";
    this.guiIconGroupRed.add(pentagonRed);

    var hexagonRed = this.game.add.sprite(x2, y1 + offsetY * 0, 'sprites', 'hexagon.png');
    hexagonRed.name = "hexagon";
    this.guiIconGroupRed.add(hexagonRed);
    var circleRed = this.game.add.sprite(x2, y1 + offsetY * 1, 'sprites', 'circle.png');
    circleRed.name = "circle";
    this.guiIconGroupRed.add(circleRed);
    var starRed = this.game.add.sprite(x2, y1 + offsetY * 2, 'sprites', 'star.png');
    starRed.name = "star";
    this.guiIconGroupRed.add(starRed);

    var textOffset = 2;
    var triangleRedText = this.game.add.text(triangleRed.x + 25, triangleRed.y + textOffset, "", scoreTextStyle);
    triangleRedText.name = "triangle";
    this.guiTextGroupRed.add(triangleRedText);
    var squareRedText = this.game.add.text(squareRed.x + 25, squareRed.y + textOffset, "", scoreTextStyle);
    squareRedText.name = "square";
    this.guiTextGroupRed.add(squareRedText);
    var pentagonRedText = this.game.add.text(pentagonRed.x + 25, pentagonRed.y + textOffset, "", scoreTextStyle);
    pentagonRedText.name = "pentagon";
    this.guiTextGroupRed.add(pentagonRedText);

    var hexagonRedText = this.game.add.text(hexagonRed.x + 25, hexagonRed.y + textOffset, "", scoreTextStyle);
    hexagonRedText.name = "hexagon";
    this.guiTextGroupRed.add(hexagonRedText);
    var circleRedText = this.game.add.text(circleRed.x + 25, circleRed.y + textOffset, "", scoreTextStyle);
    circleRedText.name = "circle";
    this.guiTextGroupRed.add(circleRedText);
    var starRedText = this.game.add.text(starRed.x + 25, starRed.y + textOffset, "", scoreTextStyle);
    starRedText.name = "star";
    this.guiTextGroupRed.add(starRedText);


    this.guiIconGroupBlue.forEach(function(element){
        element.anchor.setTo(0.5);
        element.scale.setTo(this.assetScaleFactor / 2);
        element.visible = false;
    }, this);

     this.guiIconGroupRed.forEach(function(element){
        element.anchor.setTo(0.5);
        element.scale.setTo(this.assetScaleFactor / 2);
        element.visible = false;
    }, this);

    this.guiTextGroupRed.forEach(function(element){
        element.anchor.setTo(0.5);
        element.visible = false;
    }, this);
    this.guiTextGroupBlue.forEach(function(element){
        element.anchor.setTo(0.5);
        element.visible = false;
    }, this);

},

createPlayerCollectedItemsTable: function(player){
    var textGroup, x1, x2, y1, scoreTable;

    var offsetY = 25;
    var textOffset = 2;

    if(player == 'blue'){
        textGroup = this.guiTextGroupBlue;
        iconGroup = this.guiIconGroupBlue;
        scoreTable = this.blueScores;
        x1 = 60;
        x2 = 120;
        y1 = 45;
    }
    else if(player == 'red'){
        textGroup = this.guiTextGroupRed;
        iconGroup = this.guiIconGroupRed;
        scoreTable = this.redScores;
        x1 = 1050;
        x2 = 1110;
        y1 = 700;
    }

    var iconAndTextCoords = [
        [{x: x1, y: y1 + offsetY * 0}, {x: x1 + 25, y: y1 + offsetY * 0 + textOffset}],
        [{x: x1, y: y1 + offsetY * 1}, {x: x1 + 25, y: y1 + offsetY * 1 + textOffset}],
        [{x: x1, y: y1 + offsetY * 2}, {x: x1 + 25, y: y1 + offsetY * 2 + textOffset}],

        [{x: x2, y: y1 + offsetY * 0}, {x: x2 + 25, y: y1 + offsetY * 0 + textOffset}],
        [{x: x2, y: y1 + offsetY * 1}, {x: x2 + 25, y: y1 + offsetY * 1 + textOffset}],
        [{x: x2, y: y1 + offsetY * 2}, {x: x2 + 25, y: y1 + offsetY * 2 + textOffset}],
        ];
    //update scores
    var sortedArr = [];

    textGroup.forEach(function(element){
        var score = scoreTable[element.name + 's']
        if(score > 0){
            sortedArr.push({name: element.name, score: score});
            element.setText("x " + score);
        }
        else{
            element.setText("");
        }
    }, this);
    //sort array
    sortedArr.sort(function(a, b) {
        return parseFloat(a.score) - parseFloat(b.score);
    });
    var len = sortedArr.length;
    //give elements correct position from coordinates
    for(var i=0 ; i < sortedArr.length ; i++){
        var obj = sortedArr[len - i - 1];
        //get correct icon and text
        var iconSprite = iconGroup.getByName(obj.name);
        var textSprite = textGroup.getByName(obj.name);
        iconSprite.visible = true;
        textSprite.visible = true;
        iconSprite.x = iconAndTextCoords[i][0].x;
        iconSprite.y = iconAndTextCoords[i][0].y;
        textSprite.x = iconAndTextCoords[i][1].x;
        textSprite.y = iconAndTextCoords[i][1].y;
    }


},

 asteroidCollide: function(ship, asteroid){
        asteroid.sprite.valuetext.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            asteroid.sprite.valuetext.visible = false;
        }, this);

},

    updateShipScore: function(shipColor, valueText){
        console.log(valueText);
        var player = (shipColor == 'blue') ? this.blueData : this.redData;

        //convet X from valueText to current text and evaluate it
        var value = eval(valueText.value.replace('x', this.levelData.xValue));

        //GET MIDDLE of HomeArea and set the valueTextThere
        var answerStyle = {
            font: '20px Arial',
            fill: 'white'
        }
        var answerTextWithX = this.game.add.text((player.homeArea.x2 + player.homeArea.x1)/2, (player.homeArea.y2 + player.homeArea.y1)/2, valueText.text, answerStyle);
        answerTextWithX.anchor.setTo(0.5, 1);
        answerTextWithX.alpha = 1;

        answerTextWithOutX = this.game.add.text((player.homeArea.x2 + player.homeArea.x1)/2, (player.homeArea.y2 + player.homeArea.y1)/2, valueText.text.replace('x', this.levelData.xValue), answerStyle);
        answerTextWithOutX.anchor.setTo(0.5, 1);
        answerTextWithOutX.alpha = 0;

        //tween
        var tween1 = this.game.add.tween(answerTextWithX).to({alpha: 0}, 500, 'Linear', false);
        var tween2 = this.game.add.tween(answerTextWithOutX).to({alpha: 1}, 3000, 'Linear', false);
        tween1.chain(tween2);
        tween1.start();
        tween2.onComplete.add(function(){
            answerTextWithOutX.setText(answerTextWithOutX.text += " = " + value);
            answerTextWithX.destroy();
        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND * 6, function(){
            answerTextWithOutX.destroy();
            player.score += value;
            this.bluePlayerScoreText.setText(this.blueData.score);
            this.redPlayerScoreText.setText(this.redData.score);
        }, this);



        




    }

// createMission: function(){
    
//     var offset = 50;
//     var x = 500;
//     var y = 200;
//     var triangleSprite = this.game.add.sprite(x, y + offset * 0, 'sprites', 'triangle.png');
//     var squareSprite = this.game.add.sprite(x, y + offset * 1, 'sprites', 'square.png');
//     var pentagonSprite = this.game.add.sprite(x, y + offset * 2, 'sprites', 'pentagon.png');
//     var hexagonSprite = this.game.add.sprite(x, y + offset * 3, 'sprites', 'hexagon.png');
//     var circleSprite = this.game.add.sprite(x, y + offset * 4, 'sprites', 'circle.png');
//     var starSprite = this.game.add.sprite(x, y + offset * 5, 'sprites', 'star.png');

//     this.missionTable.addMultiple([triangleSprite, squareSprite, pentagonSprite, hexagonSprite, circleSprite, starSprite]);
    
//     this.missionTable.forEach(function(sprite){
//         sprite.anchor.setTo(0.5);
//         sprite.scale.setTo(this.assetScaleFactor);
//         // sprite.tint = 2000 * 0x000000;
//     }, this);
// }

};
