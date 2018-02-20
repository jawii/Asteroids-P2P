var AsteroidMath = AsteroidMath || {};

AsteroidMath.GameState = {

init: function(currentLevel) {    
    //constants
    // this.MAX_DISTANCE_SHOOT = 190;
    // this.MAX_SPEED_SHOOT = 1000;
    // this.SHOOT_FACTOR = 12;
    this.THRUST = 200;
    this.DEBUG = true;
    this.DEBUG = false;
    this.SHIPMASS = 1;

    this.assetScaleFactor = 0.25;


    this.levelData = {
        xValue: -2,
    }


    this.blueData = {
      spawn: {x: 150, y: 130},
      homeArea: {x1: 25, x2: 225, y1: 25, y2: 125},
      getWidth: function(){return this.homeArea.x2 - this.homeArea.x1},
      getHeight: function(){return this.homeArea.y2 - this.homeArea.y1},
      angle: 135,
      score: 0,
      scoreText: {x: 263, y: 170},
      collecting: false,
      answerTextWithX: this.game.add.text(),
      answerTextWithOutX: this.game.add.text()
    }
    this.redData = {
      spawn: {x: 1060, y: 550},
      homeArea: {x1: 975, x2: 1176, y1: 680, y2: 775},
      getWidth: function(){return this.homeArea.x2 - this.homeArea.x1},
      getHeight: function(){return this.homeArea.y2 - this.homeArea.y1},
      angle: -45,
      score: 0,
      scoreText: {x: 930, y: 675},
      collecting: false,
      answerTextWithX: this.game.add.text(),
      answerTextWithOutX: this.game.add.text()

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

    this.colors = ['0xfbb03b', '0xFFFF00', '0x00FFFF', "0x0071bc", "0x7ac943", "0x3fa9f5"];
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
    // console.log(this.valueData);


    

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

    //BACKGROUND
    this.createBackground();

    //THE X VALUE
        var scoreStyle = {
            font: '26px Arial',
            fill: 'white'
        }
        var scoreTextStyle = {
            font: '18px Arial',
            fill: 'white'
        }
    this.xValueText = this.game.add.text(600, 400, 'x = ' + this.levelData.xValue, scoreStyle);
    this.xValueText.anchor.setTo(0.5);
    this.game.world.bringToTop(this.xValueText);

    //player scoreTexts
    this.redPlayerScoreText = this.game.add.text(this.redData.scoreText.x, this.redData.scoreText.y, this.redData.score, scoreStyle);
    this.redPlayerScoreText.anchor.setTo(0.5);
    
    this.bluePlayerScoreText = this.game.add.text(this.blueData.scoreText.x, this.blueData.scoreText.y, this.blueData.score, scoreStyle);
    this.bluePlayerScoreText.anchor.setTo(0.5);
    
    var scoreText = this.game.add.text(this.bluePlayerScoreText.x, this.bluePlayerScoreText.y + 30, "SCORE", scoreTextStyle);
    scoreText.anchor.setTo(0.5);
    // scoreText.fill = 'blue';

    var scoreText = this.game.add.text(this.redPlayerScoreText.x, this.redPlayerScoreText.y - 30, "SCORE", scoreTextStyle);
    scoreText.anchor.setTo(0.5);
    // scoreText.fill = 'red';

    //PLAYERS
    this.createShips();


    //MATERIALS
    this.asteroidMaterial = this.game.physics.p2.createMaterial('asteroidMaterial');
    this.shipMaterial = this.game.physics.p2.createMaterial('shipMaterial');
    this.game.physics.p2.setMaterial(this.shipMaterial, [this.shipRed.body, this.shipBlue.body]);
    
    this.asteroidShipContactMaterial = this.game.physics.p2.createContactMaterial(this.shipMaterial, this.asteroidMaterial);
    this.asteroidShipContactMaterial.restitution = 0;
    this.asteroidShipContactMaterial.relaxation = 15;
    // this.asteroidShipContactMaterial.frictionStiffness = 1e7;
    // this.asteroidShipContactMaterial.frictionRelaxation = 15;
    this.asteroidShipContactMaterial.surfaceVelocity = 0;
    this.asteroidShipContactMaterial.friction = 1;

    
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
    //ship movement
    if (this.cursors.left.isDown){this.shipBlue.body.rotateLeft(50);}
    else if(this.cursors.right.isDown){this.shipBlue.body.rotateRight(50);}
    else{this.shipBlue.body.setZeroRotation();}
    if(this.cursors.up.isDown){
        // this.shipBlue.frameName = 'ship_blue2.png';
        this.shipBlue.body.thrust(this.THRUST);
        var angle = this.shipBlue.body.angle
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipBlue.x + x_angle * 18;
        var y = this.shipBlue.y +  y_angle * 18;
        this.blueEmitterData.vx = { value: { min: x_angle * 4, max: x_angle * 5} };
        this.blueEmitterData.vy = { value: { min: y_angle * 4, max: y_angle * 5} };
        this.blueShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });
    }
    else if(this.cursors.down.isDown){this.shipBlue.body.reverse(this.THRUST/2);}

    if (this.shipRedLeft.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.shipRedRight.isDown){this.shipRed.body.rotateRight(50);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.shipRedUp.isDown){
        // this.shipRed.frameName = 'ship_red2.png';
        this.shipRed.body.thrust(this.THRUST);
        var angle = this.shipRed.body.angle
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipRed.x + x_angle * 18;
        var y = this.shipRed.y +  y_angle * 18;
        this.redEmitterData.vx = { value: { min: x_angle, max: x_angle * 2} };
        this.redEmitterData.vy = { value: { min: y_angle, max: y_angle * 2} };
        this.redShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });
    }
    else if(this.shipRedDown.isDown){this.shipRed.body.reverse(this.THRUST/2);}
  },

createShips: function(){
    //BLUESHIP
    this.shipBlue = this.game.add.sprite(this.blueData.spawn.x, this.blueData.spawn.y, 'ships', 'ship_blue.png');
    this.game.physics.p2.enable(this.shipBlue, this.DEBUG);
    // this.shipBlue.scale.set(this.assetScaleFactor);
    this.shipBlue.body.clearShapes();
    this.shipBlue.body.loadPolygon('physics', 'ship');
    this.shipBlue.body.collideWorldBounds = true;
    this.shipBlue.body.setCollisionGroup(this.playerCollisionGroup);
    this.shipBlue.body.collides(this.asteroidCollisionGroup, this.asteroidCollide, this);
    this.shipBlue.body.collides(this.playerCollisionGroup, null, this);
    this.shipBlue.body.collides(this.wallsCollisionGroup, null, this);
    this.shipBlue.body.mass = this.SHIPMASS;
    this.shipBlue.body.angle = this.blueData.angle;
    this.shipBlue.anchor.setTo(0.5);
    

    //particle storm
    this.blueParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    this.blueEmitterData = {
        image: '4x4_blue',
        // frame: ['blue'],
        lifespan: 750,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.9, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.35 }] },
        sendToBack: true
    };

    this.blueParticleManager.addData('basic', this.blueEmitterData);
    this.blueShipCircle = this.blueParticleManager.createCircleZone(10);
    this.blueShipEmitter = this.blueParticleManager.createEmitter();
    this.blueShipEmitter.addToWorld();


    //REDSHIP
    this.shipRed = this.game.add.sprite(this.redData.spawn.x, this.redData.spawn.y, 'ships', 'ship_red.png');
    this.game.physics.p2.enable(this.shipRed, this.DEBUG);
    this.shipRed.body.clearShapes();
    // this.shipRed.scale.set(this.assetScaleFactor);
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
        // frame: ['blue'],
        lifespan: 750,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.9, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.35 }] },
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

createBackground: function(){
    //background
    var background = this.game.add.sprite(this.game.width/2, this.game.height/2, 'background');
    this.game.physics.p2.enable(background, this.DEBUG);
    background.body.clearShapes();
    background.scale.set(0.5);
    background.body.loadPolygon('physics', 'background');
    background.body.static = true;
    // console.log(background.body.y);
    background.body.setCollisionGroup(this.wallsCollisionGroup);
    background.body.collides(this.asteroidCollisionGroup, null, this);
    background.body.collides(this.playerCollisionGroup, null, this);
    this.game.world.sendToBack(background);

    var wall1 = this.game.add.sprite(600, 400, 'wall1');
    this.game.physics.p2.enable(wall1, this.DEBUG);
    wall1.body.clearShapes();
    wall1.scale.set(this.assetScaleFactor);
    wall1.body.loadPolygon('physics', 'wall1');
    wall1.body.static = true;
    wall1.body.setCollisionGroup(this.wallsCollisionGroup);
    wall1.body.collides(this.asteroidCollisionGroup, null, this);
    wall1.body.collides(this.playerCollisionGroup, null, this);
    // background.body.debug = true;

    var wall2 = this.game.add.sprite(200, 600, 'wall2');
    this.game.physics.p2.enable(wall2, this.DEBUG);
    wall2.body.clearShapes();
    wall2.scale.set(this.assetScaleFactor);
    wall2.body.loadPolygon('physics', 'wall2');
    wall2.body.static = true;
    wall2.body.angle = 180;
    wall2.body.setCollisionGroup(this.wallsCollisionGroup);
    wall2.body.collides(this.asteroidCollisionGroup, null, this);
    wall2.body.collides(this.playerCollisionGroup, null, this);

    var wall3 = this.game.add.sprite(1000, 150, 'wall3');
    this.game.physics.p2.enable(wall3, this.DEBUG);
    wall3.body.clearShapes();
    wall3.scale.set(this.assetScaleFactor);
    wall3.body.loadPolygon('physics', 'wall3');
    wall3.body.static = true;
    wall3.body.angle = 180;
    wall3.body.setCollisionGroup(this.wallsCollisionGroup);
    wall3.body.collides(this.asteroidCollisionGroup, null, this);
    wall3.body.collides(this.playerCollisionGroup, null, this);
},

loadLevel: function(){
    //creates 10 asteroids
    for (var i = 0 ; i < 16 ; i++){
        this.createRandomAsteroid();
    }
    

  },

createRandomAsteroid: function(){
    //create random place in game area
    var x = this.game.rnd.integerInRange(150, this.game.width - 150);
    var y = this.game.rnd.integerInRange(150, this.game.height - 150);

    //check if x and y dont overlap with walls
    var data = {}
    data.color = this.colors[Math.floor(Math.random()*this.colors.length)];
    data.physic = data.texture;
    // data.mass = Math.random() * 10;
    data.mass = 1;
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

asteroidCollide: function(ship, asteroid){
        asteroid.sprite.valuetext.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            asteroid.sprite.valuetext.visible = false;
        }, this);

},
updateShipScore: function(shipColor, valueText){
    // console.log(valueText);
    var player = (shipColor == 'blue') ? this.blueData : this.redData;

    //convert X from valueText to current text and evaluate it
    var value = eval(valueText.value.replace(/x/g, this.levelData.xValue));

    var textWithX = this.parseText(valueText.value);
    var textType = (this.levelData.xValue < 0) ? "valueNeg" : "value";
    var textWithoutX = this.parseText(valueText[textType].replace(/x/g, this.levelData.xValue));
    var textWithAnswer = textWithoutX + " = " + value;

    //GET MIDDLE of HomeArea and set the valueTextThere
    var answerStyle = {
        font: '20px Arial',
        fill: 'white'
    };
    var marginalX = 10;
    var offsetTextY = -10;

    var dummyText = this.game.add.text(0, 0, textWithAnswer, answerStyle);
    var textWidth = dummyText.width;
    dummyText.destroy();
    var textX = player.homeArea.x1 + (player.getWidth() - textWidth)/2;
    var textY = (player.homeArea.y2 + player.homeArea.y1)/2 + offsetTextY

    player.answerTextWithX.reset();
    player.answerTextWithX.x = textX;
    player.answerTextWithX.y = textY;
    player.answerTextWithX.setText(textWithX);
    player.answerTextWithX.setStyle(answerStyle);
    player.answerTextWithX.alpha = 1;

    player.answerTextWithOutX.reset();
    player.answerTextWithOutX.x = textX;
    player.answerTextWithOutX.y = textY;
    player.answerTextWithOutX.setText(textWithoutX);
    player.answerTextWithOutX.setStyle(answerStyle);
    player.answerTextWithOutX.alpha = 0;
    player.answerTextWithOutX.clearColors();

    //tween
    var tween1 = this.game.add.tween(player.answerTextWithX).to({alpha: 0}, 1500, "Expo.easeOut", true);
    var tween2 = this.game.add.tween(player.answerTextWithOutX).to({alpha: 1}, 2000, 'Linear', true);
    tween2.onComplete.add(function(){
        player.answerTextWithOutX.setText(textWithAnswer);
        var index = player.answerTextWithOutX.text.indexOf("=") + 1;
        if(value > 0){
            player.answerTextWithOutX.addColor("green", index);
        }else{
            player.answerTextWithOutX.addColor("red", index);
        }
        player.answe
        player.answerTextWithX.kill();
    }, this);

    this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
        player.answerTextWithOutX.kill();
        player.score += value
        this.bluePlayerScoreText.setText(this.blueData.score);
        this.redPlayerScoreText.setText(this.redData.score);
        player.collecting = false;

    }, this);
},

parseText: function(text, replace, replacement){
    var replaceObj = {
        "^2": '\u{00B2}',
        "*": '\u{22C5}',
        "^0": '\u{2070}',
        "^3": '\u{00B3}',
        "^4": '\u{2074}',
        "^6": '\u{2076}',
        "^1": '\u{00B9}',
        "^5": '\u{2075}',
        "1/2": '\u{00BD}',
        "1/3": '\u{2153}',
        "1/5": '\u{2155}',
        "2/3": '\u{2154}',
        "1/4": '\u{00BC}',
        ">=:": '\u{2265}',
        "+-:": '\u{00B1}'
        }
    for(var key in replaceObj){
        // console.log(key);
        // console.log(replaceObj[key]);
        while(text.includes(key)){
            var index = text.indexOf(key);
            text = text.slice(0, index) + replaceObj[key] + text.slice(index + key.length)
        }
    }
    return text
},
testTasks: function(){
    var valueData = Object.values(JSON.parse(this.game.cache.getText('values')));
    var x = -1
    for (var i = 0 ; i < valueData.length ; i++){
        eval(valueData[i].valueNeg.replace(/x/g, x));
    }
    for (var i = 0 ; i < valueData.length ; i++){
        eval(valueData[i].valueNeg.replace(/x/g, x));
    }

    x = 1;
    for (var i = 0 ; i < valueData.length ; i++){
        eval(valueData[i].value.replace(/x/g, x));
    }
    
    for (var i = 0 ; i < valueData.length ; i++){
        eval(valueData[i].value.replace(/x/g, x));
    }
    
}
};


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
/*
xRizeTween: function(reward, time){
    //create object score for tweening
    
    var tween = this.game.add.tween(this.xData).to( { xNow: this.xData.xNow + reward }, time, Phaser.Easing.Linear.None);
    tween.start()
  },


*/