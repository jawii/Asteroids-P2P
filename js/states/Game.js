var AsteroidMath = AsteroidMath || {};

AsteroidMath.GameState = {

  init: function(currentLevel) {    
    //constants
    // this.MAX_DISTANCE_SHOOT = 190;
    // this.MAX_SPEED_SHOOT = 1000;
    // this.SHOOT_FACTOR = 12;
    this.ACCELERATION = 200;
    this.ANGULARVELOCITY = 500;
    this.BULLET_SPEED = 1000;
    this.FIRE_RATE = 200;
    this.DEBUG = false;

    this.blueData = {
      spawn: {x: 150, y: 130},
      homeArea: {x1: 0, x2: 190, y1: 0, y2: 100},
      angle: 135
    }
    this.redData = {
      spawn: {x: 1060, y: 550},
      homeArea: {x1: 1000, x2: 1200, y1: 580, y2: 700},
      angle: -45
    }
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
    // background.body.debug = true;

    //PLAYERS
    this.createShips();

    //asteroid
    this.asteroids = this.add.group();
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.P2JS;

    var data1={texture: 'triangle', physic: 'triangle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 350, 400, data1);
    var data2={texture: 'hexagon', physic: 'hexagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 450, 400, data2);
    var data3={texture: 'square', physic: 'square', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 550, 400, data3);
    var data4={texture: 'star', physic: 'star', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 650, 400, data4);
    var data5={texture: 'pentagon', physic: 'pentagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 750, 400, data5);
    var data6={texture: 'circle', physic: 'circle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 850, 400, data6);

    var data1={texture: 'triangle', physic: 'triangle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 350, 520, data1);
    var data2={texture: 'hexagon', physic: 'hexagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 450, 520, data2);
    var data3={texture: 'square', physic: 'square', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 550, 520, data3);
    var data4={texture: 'star', physic: 'star', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 650, 520, data4);
    var data5={texture: 'pentagon', physic: 'pentagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 750, 520, data5);
    var data6={texture: 'circle', physic: 'circle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 850, 520, data6);

    var data1={texture: 'triangle', physic: 'triangle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 350, 320, data1);
    var data2={texture: 'hexagon', physic: 'hexagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 450, 320, data2);
    var data3={texture: 'square', physic: 'square', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 550, 320, data3);
    var data4={texture: 'star', physic: 'star', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 650, 320, data4);
    var data5={texture: 'pentagon', physic: 'pentagon', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 750, 320, data5);
    var data6={texture: 'circle', physic: 'circle', mass: 1}
    var asteroid1 = new AsteroidMath.Asteroid(this, 850, 320, data6);


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
        this.shipBlue.body.thrust(400);
        var angle = this.shipBlue.body.angle
        var x = this.shipBlue.x - Math.sin(angle* 0.0174532925) * 25;
        var y = this.shipBlue.y + Math.cos(angle * 0.0174532925) * 25;
        this.blueShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });

    }
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(100);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(50);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){
        //animation
        this.shipRed.frameName = 'ship_red2.png';
        this.shipRed.body.thrust(400);
        var angle = this.shipRed.body.angle
        var x = this.shipRed.x - Math.sin(angle* 0.0174532925) * 25;
        var y = this.shipRed.y + Math.cos(angle * 0.0174532925) * 25;
        this.redShipEmitter.emit('basic', x, y, { zone: this.redShipCircle, total: 1 });
    }
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(100);}
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
    this.shipBlue.body.mass = 1;
    this.shipBlue.body.angle = this.blueData.angle;
    // this.shipBlue.scale.set(0.5);
    this.shipBlue.body.debug = this.DEBUG;

    //particle storm
    this.blueParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    var blueEmitterData = {
        image: 'colorsHD',
        frame: ['blue'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.2 }] },
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
    this.shipRed.body.mass = 1;
    this.shipRed.body.angle = this.redData.angle;
    // this.shipRed.scale.set(0.25);
    this.shipRed.body.debug = this.DEBUG;
    this.redParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    var redEmitterData = {
        image: 'colorsHD',
        frame: ['red'],
        lifespan: 2000,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 1, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.2 }] },
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
  }
};
