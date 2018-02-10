var MovingParts = MovingParts || {};

MovingParts.GameState = {

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

  },
  create: function() {     

    //set bounds 
    this.game.world.setBounds(0, 0, 1200, 700); 
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
    this.shipBlue.body.mass = 0.5;
    // this.shipBlue.scale.set(0.5);
    this.shipBlue.body.debug = this.DEBUG;

    this.shipRed = this.game.add.sprite(this.redData.spawn.x, this.redData.spawn.y, 'ship_red');
    this.game.physics.p2.enable(this.shipRed, this.DEBUG);
    this.shipRed.body.clearShapes();
    this.shipRed.body.loadPolygon('physics', 'ship_red');
    this.shipRed.body.collideWorldBounds = true;
    this.shipRed.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipRed.body.collides(this.asteroidCollisionGroup, null, this);
    this.shipRed.body.collides(this.playerCollisionGroup, null, this);
    this.shipRed.body.mass = 0.5;
    // this.shipRed.scale.set(0.5);
    this.shipRed.body.debug = this.DEBUG;

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
    // asteroid.scale.set(0.5);
    asteroid1.body.clearShapes();
    asteroid1.body.loadPolygon('physics', 'asteroid1');
    asteroid1.body.setCollisionGroup(this.asteroidCollisionGroup);
    asteroid1.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
    asteroid1.body.mass = 10;
    asteroid1.body.debug = this.DEBUG;

    var asteroid2 =this.asteroids.create(600, 600, 'asteroid2');
    // asteroid.scale.set(0.5);
    asteroid2.body.clearShapes();
    asteroid2.body.loadPolygon('physics', 'asteroid2');
    asteroid2.body.setCollisionGroup(this.asteroidCollisionGroup);
    asteroid2.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
    asteroid2.body.mass = 0.5;
    asteroid2.body.debug = this.DEBUG;

    var asteroid3 =this.asteroids.create(600, 600, 'asteroid3');
    // asteroid.scale.set(0.5);
    asteroid3.body.clearShapes();
    asteroid3.body.loadPolygon('physics', 'asteroid3');
    asteroid3.body.setCollisionGroup(this.asteroidCollisionGroup);
    asteroid3.body.collides([this.asteroidCollisionGroup, this.playerCollisionGroup])
    asteroid3.body.mass = 1;
    asteroid3.body.debug = this.DEBUG;


    console.log(this.asteroids);




  },   
  update: function() {  

    //ship movement
    if (this.cursors.left.isDown){this.shipBlue.body.rotateLeft(100);}
    else if(this.cursors.right.isDown){this.shipBlue.body.rotateRight(100);}
    else{this.shipBlue.body.setZeroRotation();}
    if(this.cursors.up.isDown){this.shipBlue.body.thrust(400);}
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(400);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(100);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(100);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){this.shipRed.body.thrust(400);}
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(400);}


  },
  gameOver: function() {
    this.game.state.start('Game', true, false, this.currentLevel);
  }
};
