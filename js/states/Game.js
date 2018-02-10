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
      spawn: {x: 200, y: 200}

    }
    this.redData = {
      spawn: {x: 400, y: 400}
    }
    //keep track of the current level
    this.currentLevel = currentLevel ? currentLevel : 'level1';

    //initiate physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    //particle storm
    this.manager = this.game.plugins.add(Phaser.ParticleStorm);
  },
  create: function() {     

    //set bounds 
    this.game.world.setBounds(0, 0, 1200, 800); 
    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.restitution = 0.3;

    //collisiongroups
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.asteroidCollisionGroup = this.game.physics.p2.createCollisionGroup();

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

    //PLAYERS
    //players
    //  Create our ship sprite
    this.shipBlue = this.game.add.sprite(this.blueData.spawn.x, this.blueData.spawn.y, 'ship_blue');
    this.game.physics.p2.enable(this.shipBlue, this.DEBUG);
    this.shipBlue.body.clearShapes();
    this.shipBlue.body.loadPolygon('physics', 'ship_blue');
    this.shipBlue.body.collideWorldBounds = true;
    this.shipBlue.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipBlue.body.collides(this.asteroidCollisionGroup, null, this);
    this.shipBlue.body.collides(this.playerCollisionGroup, null, this);
    this.shipBlue.body.mass = 1;
    // this.shipBlue.scale.set(0.5);
    this.shipBlue.body.debug = this.DEBUG;

    this.shipRed = this.game.add.sprite(this.redData.spawn.x, this.redData.spawn.y, 'ship_red', 'ship_red1.png');
    this.game.physics.p2.enable(this.shipRed, this.DEBUG);
    this.shipRed.body.clearShapes();
    this.shipRed.body.loadPolygon('physics', 'ship_red');
    this.shipRed.body.collideWorldBounds = true;
    this.shipRed.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipRed.body.collides(this.asteroidCollisionGroup, null, this);
    this.shipRed.body.collides(this.playerCollisionGroup, null, this);
    this.shipRed.body.mass = 1;
    // this.shipRed.scale.set(0.25);
    this.shipRed.body.debug = this.DEBUG;

    //emitter
    var redEmitterData = {
        lifespan: 3000,
        image: '4x4',
        vy: { min: -0.5, max: 0.5 },
        vx: { min: -0.5, max: 0.5 },
        alpha: { initial: 0, value: 1, control: 'linear' }
    };
    this.manager.addData('basic', redEmitterData);
    this.circle = this.manager.createCircleZone(10);
    this.emitter = this.manager.createEmitter();
    this.emitter.addToWorld();


    //controls
    this.cursors = this.game.input.keyboard.createCursorKeys();   
    this.shipRedUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W); 
    this.shipRedDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S); 
    this.shipRedLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A); 
    this.shipRedRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D); 
    //weapon fire
    this.blueFire = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL); 
    this.redFire = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);

    //asteroid
    this.asteroids = this.add.group();
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.P2JS;

    var asteroid1 =this.asteroids.create(500, 500, 'asteroid1');
    asteroid1.body.clearShapes();
    asteroid1.body.loadPolygon('physics', 'asteroid1');
    asteroid1.body.setCollisionGroup(this.asteroidCollisionGroup);
    asteroid1.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
    asteroid1.body.mass = 10;
    asteroid1.body.debug = this.DEBUG;

    var asteroid2 =this.asteroids.create(600, 600, 'asteroid2');
    asteroid2.body.clearShapes();
    asteroid2.body.loadPolygon('physics', 'asteroid2');
    asteroid2.body.setCollisionGroup(this.asteroidCollisionGroup);
    asteroid2.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
    asteroid2.body.mass = 0.5;
    asteroid2.body.debug = this.DEBUG;

    var data3={texture: 'asteroid3', physic: 'asteroid3', mass: 10}
    var asteroid3 = new AsteroidMath.Asteroid(this, 800, 400, data3);




  },   
  update: function() {  
    //reset ship frames
    this.shipRed.frameName = 'ship_red1.png'

    //ship movement
    if (this.cursors.left.isDown){this.shipBlue.body.rotateLeft(50);}
    else if(this.cursors.right.isDown){this.shipBlue.body.rotateRight(50);}
    else{this.shipBlue.body.setZeroRotation();}
    if(this.cursors.up.isDown){this.shipBlue.body.thrust(400);}
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(400);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(50); console.log(this.shipRed.angle)}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){
        //animation
        this.shipRed.frameName = 'ship_red2.png';
        this.shipRed.body.thrust(400);
        var angle = this.shipRed.body.angle
        var x = this.shipRed.x - Math.sin(angle* 0.0174532925) * 25;
        var y = this.shipRed.y + Math.cos(angle * 0.0174532925) * 25;
        this.emitter.emit('basic', x, y, { zone: this.circle, total: 1 });
    }
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(400);}


  },
  gameOver: function() {
    this.game.state.start('Game', true, false, this.currentLevel);
  }
};
