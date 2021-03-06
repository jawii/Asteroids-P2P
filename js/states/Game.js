var AsteroidMath = AsteroidMath || {};

AsteroidMath.GameState = {

init: function(levelData) {    
    //constants
    // this.MAX_DISTANCE_SHOOT = 190;
    // this.MAX_SPEED_SHOOT = 1000;
    // this.SHOOT_FACTOR = 12;
    this.THRUST = 350;
    // this.DEBUG = true;
    this.DEBUG = false;
    this.SHIPMASS = 1;
    this.SHIPBODYDAMPING = 0.4;
    this.ASTEROIDBODYDAMPING = 0.5;
    this.gameOn = true;
    this.font2 = "source_sans_prosemibold";
    this.font1 = "inconsolataregular";
    this.assetScaleFactor = 0.25;

    this.levelData = levelData;
    
    this.blueData = {};
    this.blueData.spawn = this.levelData.BLUEspawn;
    this.blueData.homeArea = this.levelData.BLUEhomeArea;
    this.blueData.getWidth = function(){return this.homeArea.x2 - this.homeArea.x1};
    this.blueData.getHeight = function(){return this.homeArea.y2 - this.homeArea.y1};
    this.blueData.angle = this.levelData.BLUEangle;
    this.blueData.score = 0;
    this.blueData.scoreText = this.levelData.BLUEscoreText;
    this.blueData.collecting = this.levelData.BLUEcollecting;
    this.blueData.gravityLine = this.levelData.BLUEgravityLine;

    this.redData = {};
    this.redData.spawn = this.levelData.REDspawn;
    this.redData.homeArea = this.levelData.REDhomeArea;
    this.redData.getWidth = function(){return this.homeArea.x2 - this.homeArea.x1};
    this.redData.getHeight = function(){return this.homeArea.y2 - this.homeArea.y1};
    this.redData.angle = this.levelData.REDangle;
    this.redData.score = 0;
    this.redData.scoreText = this.levelData.REDscoreText;
    this.redData.collecting = this.levelData.REDcollecting;
    this.redData.gravityLine = this.levelData.REDgravityLine;


    this.redData.answerTextWithX = this.game.add.text();
    this.redData.answerTextWithOutX = this.game.add.text();
    this.blueData.answerTextWithX = this.game.add.text();
    this.blueData.answerTextWithOutX = this.game.add.text();
    
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
    this.backgroundCollisionGroup = this.game.physics.p2.createCollisionGroup();

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
    this.valueData = Object.values(JSON.parse(this.game.cache.getText(this.levelData.jsonValues)));

    //BACKGROUND
    this.createBackground();

    //PLAYERS
    this.createShips();

    //MATERIALS
    this.materialsSetUp();

    //asteroid
    this.asteroids = this.add.group();
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.P2JS;
    //group for geometry piece info 
    this.missionTable = this.game.add.group();

    //LOAD LEVELS AND TEXTS
    this.loadLevel();

    //TEST TASKS
    this.testTasks();

    //pausemenu
    this.createPauseBtn();

    //this create sounds
    this.sound1 = this.game.add.audio("1");
    this.sound2 = this.game.add.audio("2");
    this.sound3 = this.game.add.audio("3");
    this.soundBegin = this.game.add.audio("begin");
    // this.soundHit = this.game.add.audio("hit");

    this.bgSound = this.game.add.audio("bgMusic");

    this.bgSound.loop = true;
    this.bgSound.play();
  },   

update: function() {

    //timer
    // if(this.xValueChangeText){
    //     this.xValueChangeText.setText(Math.ceil(this.xTimer.duration / 1000));
    //     this.xValueChangeText.fill = 'white';
    //     if(this.xTimer.duration / 1000 < 10){
    //         this.xValueChangeText.fill = 'red';
    //     }
    //     else if(this.xTimer.duration / 1000 < 30){
    //         this.xValueChangeText.fill = 'orange';
    //     }
    //     else if(this.xTimer.duration / 1000 < this.levelData.xChangeTime){
    //         this.xValueChangeText.fill = 'green';
    //     }
    //     else{
    //         this.xValueChangeText.setText(this.levelData.xChangeTime);
    //     }
    // }

    //ship movement
    if (this.cursors.left.isDown){this.shipRed.body.rotateLeft(50);}
    else if(this.cursors.right.isDown){this.shipRed.body.rotateRight(50);}
    else{this.shipRed.body.setZeroRotation();}
    if(this.cursors.up.isDown){
        // this.shipRed.frameName = 'ship_Red2.png';
        this.shipRed.body.thrust(this.THRUST);
        var angle = this.shipRed.body.angle
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipRed.x + x_angle * 18;
        var y = this.shipRed.y +  y_angle * 18;
        this.redEmitterData.vx = { value: { min: x_angle * 4, max: x_angle * 5} };
        this.redEmitterData.vy = { value: { min: y_angle * 4, max: y_angle * 5} };
        this.redShipEmitter.emit('basic', x, y, { zone: this.redShipCircle, total: 1 });
    }
    else if(this.cursors.down.isDown){this.shipRed.body.reverse(this.THRUST/2);}

    if (this.shipBlueLeft.isDown){this.shipBlue.body.rotateLeft(50);}
    else if(this.shipBlueRight.isDown){this.shipBlue.body.rotateRight(50);}
    else{this.shipBlue.body.setZeroRotation();}
    if(this.shipBlueUp.isDown){
        // this.shipBlue.frameName = 'ship_Blue2.png';
        this.shipBlue.body.thrust(this.THRUST);
        var angle = this.shipBlue.body.angle
        var x_angle = - Math.sin(angle* 0.0174532925);
        var y_angle = Math.cos(angle * 0.0174532925);
        var x = this.shipBlue.x + x_angle * 18;
        var y = this.shipBlue.y +  y_angle * 18;
        this.blueEmitterData.vx = { value: { min: x_angle, max: x_angle * 2} };
        this.blueEmitterData.vy = { value: { min: y_angle, max: y_angle * 2} };
        this.blueShipEmitter.emit('basic', x, y, { zone: this.blueShipCircle, total: 1 });
    }
    else if(this.shipBlueDown.isDown){this.shipBlue.body.reverse(this.THRUST/2);}
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
    this.shipBlue.body.collides(this.backgroundCollisionGroup, null, this);
    this.shipBlue.body.mass = this.SHIPMASS;
    this.shipBlue.body.angle = this.blueData.angle;
    this.shipBlue.anchor.setTo(0.5);
    this.shipBlue.body.damping = this.SHIPBODYDAMPING;
    //particle storm
    this.blueParticleManager = this.game.plugins.add(Phaser.ParticleStorm);
    this.blueEmitterData = {
        image: '4x4_blue',
        // frame: ['blue'],
        lifespan: 750,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.9, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.75 }] },
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
    this.shipRed.body.collides(this.backgroundCollisionGroup, null, this);
    this.shipRed.body.mass = this.SHIPMASS;
    this.shipRed.body.angle = this.redData.angle;
    // this.shipRed.scale.set(0.25);
    this.shipRed.body.debug = this.DEBUG;
    this.shipRed.body.damping = this.SHIPBODYDAMPING;
    this.redParticleManager = this.game.plugins.add(Phaser.ParticleStorm);

    this.redEmitterData = {
        image: '4x4_red',
        // frame: ['blue'],
        lifespan: 750,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.9, control: 'linear' },
        scale: { value: 1.0, control: [ { x: 0, y: 0.75 }] },
        sendToBack: true
    };

    this.redParticleManager.addData('basic', this.redEmitterData);
    this.redShipCircle = this.redParticleManager.createCircleZone(10);
    this.redShipEmitter = this.redParticleManager.createEmitter();
    this.redShipEmitter.addToWorld();
    //controls
    this.cursors = this.game.input.keyboard.createCursorKeys();   
    this.shipBlueUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W); 
    this.shipBlueDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S); 
    this.shipBlueLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A); 
    this.shipBlueRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D); 
    //weapon fire
    // this.blueFire = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL); 
    // this.redFire = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
  },

roundEnd: function() {
    AsteroidMath.MenuState.blueScore.push({level: this.levelData.name, score: this.blueData.score});
    AsteroidMath.MenuState.redScore.push({level: this.levelData.name, score: this.redData.score});
    

    if(this.levelData.nextLevel == null){
        //console.log("GameEnd");
        this.bgSound.destroy();
        this.game.state.start('End');
    }
    else{
        //create next level menu
        this.nextLevelMenu();
    }
  },
nextLevelMenu: function(){
        var graphics = this.game.add.graphics();
        graphics.lineStyle(1, "black", 1);            
        graphics.beginFill(0xFFFFFF, 0.9);            
        graphics.drawRoundedRect(400, 300, 400, 200);            
        graphics.endFill(); 


        var textStyle = {
            fontSize: '24px',
            fill: this.font1,
            fill: 'black'
        }

        var levelCompletedText = this.game.add.text(this.game.width/2, this.game.height/2 - 50, "Taso suoritettu!", textStyle);
        levelCompletedText.anchor.setTo(0.5);

        //button 
        var nextLvlBtn = this.add.graphics(0, 0);            
        // draw a rectangle            
        nextLvlBtn.lineStyle(1, "black", 1);            
        nextLvlBtn.beginFill(0x0000FF, 1);            
        nextLvlBtn.drawRect(this.game.width/2 - 100, this.game.height/2 + 25, 200, 50);                       
        nextLvlBtn.endFill();            
     
        nextLvlBtn.inputEnabled = true;           
        nextLvlBtn.events.onInputDown.add(function(){
             AsteroidMath.MenuState.click.play();
             this.bgSound.destroy();
             this.game.state.start('Game', true, false, this.levelData.nextLevel);
        }, this);

        //button hover
        nextLvlBtn.events.onInputOut.add(function(){
          nextLvlBtn.alpha = 1;
        }, this)
        nextLvlBtn.events.onInputOver.add(function(){
          nextLvlBtn.alpha = 0.8;
        }, this)      

        //button label
        var nextRoundtextStyle = {
            fontSize: '24px',
            fill: this.font1,
            fill: 'white'
        }
        var nextRoundText = this.game.add.text(this.game.width/2, this.game.height/2 + 50, "Seuraava taso", nextRoundtextStyle);
        nextRoundText.anchor.setTo(0.5);
},
createBackground: function(){
    //create gravity wells
    var blueGravityWellmanager = this.game.plugins.add(Phaser.ParticleStorm);
    var data = {
        lifespan: 3500,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.5, control: 'linear' },
        image: '4x4_blue',
        vy: { min: -0.5, max: 0 },  
        vx: { min: -0.2, max: 0.2 }  
    }
    blueGravityWellmanager.addData('basic', data);
    blueGravityEmitter = blueGravityWellmanager.createEmitter();
    //  Create a Gravity Well on the Emitter.
    var well = blueGravityEmitter.createGravityWell(this.blueData.homeArea.x1 + this.blueData.getWidth()/2, this.blueData.homeArea.y1 + this.blueData.getHeight()/2, 1, 200);
    var line = blueGravityWellmanager.createLineZone(this.blueData.gravityLine.x1, this.blueData.gravityLine.y1, this.blueData.gravityLine.x2, this.blueData.gravityLine.y2);
    blueGravityEmitter.addToWorld();
    blueGravityEmitter.emit('basic', 0, 0, { zone: line, total: 2, repeat: -1, frequency: 150 });


    //create gravity wells
    var redGravityWellmanager = this.game.plugins.add(Phaser.ParticleStorm);
    var data = {
        lifespan: 3500,
        blendMode: 'ADD',
        alpha: { initial: 0, value: 0.5, control: 'linear' },
        image: '4x4_red',
        vy: { min: 0, max: 0.5 },  
        vx: { min: -0.2, max: 0.2 }  
    }
    redGravityWellmanager.addData('basic', data);
    redGravityEmitter = redGravityWellmanager.createEmitter();
    //  Create a Gravity Well on the Emitter.
    var well = redGravityEmitter.createGravityWell(this.redData.homeArea.x1 + this.redData.getWidth()/2, this.redData.homeArea.y1 + this.redData.getHeight()/2, 1, 200);
    var line = redGravityWellmanager.createLineZone(this.redData.gravityLine.x1, this.redData.gravityLine.y1, this.redData.gravityLine.x2, this.redData.gravityLine.y2);
    redGravityEmitter.addToWorld();
    redGravityEmitter.emit('basic', 0, 0, { zone: line, total: 2, repeat: -1, frequency: 150 });
    //background
    var background = this.game.add.sprite(this.game.width/2, this.game.height/2, this.levelData.background);
    this.game.physics.p2.enable(background, this.DEBUG);
    background.body.clearShapes();
    background.scale.set(0.5);
    background.body.loadPolygon('physics', this.levelData.background);
    background.body.static = true;
    // console.log(background.body.y);
    background.body.setCollisionGroup(this.backgroundCollisionGroup);
    background.body.collides(this.asteroidCollisionGroup, null, this);
    background.body.collides(this.playerCollisionGroup, null, this);
    background.body.collides(this.wallsCollisionGroup, null, this);
    this.game.world.sendToBack(background);


    //make the walls if given in leveldata
    if(this.levelData.walls){
        var obj = this.levelData.walls
        Object.keys(obj).forEach(function(key) {
            // console.log(key, obj[key]);
            var wall = this.game.add.sprite(obj[key].x, obj[key].y, 'sprites', key + '.png');
            this.game.physics.p2.enable(wall, this.DEBUG);
            wall.body.clearShapes();
            wall.scale.set(this.assetScaleFactor);
            wall.body.loadPolygon('physics', key);
            wall.body.static = obj[key].staticBody;
            wall.body.angle =  obj[key].angle;
            if(obj[key].mass){wall.body.mass = obj[key].mass;}
            wall.body.setCollisionGroup(this.wallsCollisionGroup);
            wall.body.collides([this.backgroundCollisionGroup, this.wallsCollisionGroup, this.asteroidCollisionGroup, this.playerCollisionGroup]);
        }, this);
    }
},
loadLevel: function(){

    this.countDownTime = this.game.time.create(true);

    var style = { 
      font: "64px Arial Black", 
      fill: "#0037ff", 
      align: "center" 
    };

    var counter = 0;

    var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 200, "", style);
    text.anchor.setTo(0.5);
    this.countDownTime.start();
    this.countDownTime.loop(1000, function(){
       counter += 0.5;
       //text.setText(counter);
       if (counter == 0.5){
        text.setText(this.levelData.name);
        //console.log(this.currentTaskid);
        // this.updateTaskQuestion(this, this.currentTaskid);
       }
       else if (counter == 1.0){
        text.setText("3");
        this.sound3.play();
       }
       else if (counter == 2.0) {
        text.setText("2");
        this.sound2.play();
       }
       else if (counter == 3.0) {
        text.setText("1");
        this.sound1.play();
       }
       else if (counter == 4.0){
         this.soundBegin.play();
         this.countDownTime.stop();
         text.destroy(); 
         this.loadLevelTexts();
         //creates 10 asteroidwaas
        var spawnP = this.levelData.spawnCoords;
        
        for (var i = 0 ; i < this.levelData.spawnCoords.length ; i++){
            this.createRandomAsteroid(spawnP[i][0], spawnP[i][1]);
        }

       }
    }, this);
},
loadLevelTexts: function(){

    //THE X VALUE
        var scoreStyle = {
            font: this.font1,
            fontSize: '34px',
            fill: this.levelData.textColor
        };
        var scoreTextStyle = {
            font: this.font1,
            fontSize: '26px',
            fill: this.levelData.textColor
        };

        var xTimerStyle = {
            font: this.font1,
            fontSize: '30px',
            fill: this.levelData.textColor
        }
        var xChangeTextInfoStyle = {
            font: this.font1,
            fontSize: '14px',
            fill: this.levelData.textColor
        }
        var roundNameTextStyle = {
            font: this.font1,
            fontSize: '16px',
            fill: this.levelData.textColor
        }

    this.roundNoText = this.game.add.text(600, 350, this.levelData.name, roundNameTextStyle);
    this.roundNoText.anchor.setTo(0.5);

    this.xValueText = this.game.add.text(600, 370, 'x = ' + this.levelData.xValue, scoreStyle);
    this.xValueText.anchor.setTo(0.5);
    this.game.world.bringToTop(this.xValueText);

    //set random value to x
    this.levelData.xValue = this.levelData.xValues[Math.floor(Math.random() * this.levelData.xValues.length)];
    this.xValueText.setText('x = ' + this.levelData.xValue)



    this.xTimer = this.game.time.create(true);
    this.xTimer.loop(1000 * this.levelData.xChangeTime + 3, function(){
        //pop the current value from list and se x a new value
        var values = this.levelData.xValues.slice();
        var index = values.indexOf(this.levelData.xValue);
        values.splice(index, 1);
        this.levelData.xValue = values[Math.floor(Math.random() * values.length)];
        this.xValueText.setText('x = ' + this.levelData.xValue)   

        var tween1 = this.game.add.tween(this.xValueText.scale).to({x: 1.5, y:1.5}, 500, "Expo.easeOut", true);
        var tween2 = this.game.add.tween(this.xValueText.scale).to({x: 1, y:1}, 500, "Expo.easeOut", false);
        tween1.onComplete.add(function(){
            tween2.start();
        }, this);
    }, this);

    this.xTimer.start();

    //NEXT ROUND PROGRESS BAR BG
    var barX = 515;
    var barY = 412;
    var barWidth = 170;
    var barHeight = 22;
    var barAlpha = 0.25;
    var lineWidth = 1;

    var barBGLineColor = '0x000000';
    var barBGColor = '0x0000FF';
    var barLineColor = '0x000000'
    var barColor = '0x00FF00'

    this.nextRoundBarBG = this.game.add.graphics(0,0);
    this.nextRoundBarBG.lineStyle(lineWidth, barBGLineColor);
    this.nextRoundBarBG.beginFill(barBGColor, barAlpha) 
    this.nextRoundBarBG.drawRoundedRect(barX, barY, barWidth, barHeight, 1);
    this.nextRoundBarBG.endFill();
    //NEXT ROUND PROGRESS BAR 
    this.nextRoundBar = this.game.add.graphics(0,0);
    //TEXT
    this.nextRoundText = this.game.add.text(600, barY + 13, "Seuraava taso", xChangeTextInfoStyle)
    this.nextRoundText.anchor.setTo(0.5);
    //TIMER
    this.roundTimer = this.game.time.create(true);
    this.roundTimerCount = 0;
    this.roundTimer.loop(250, function(){
            var width = Math.min((barWidth * this.roundTimerCount)/this.levelData.roundTime, barWidth);
            if(width > 0){
                this.nextRoundBar.clear();
                this.nextRoundBar.lineStyle(0.5, barLineColor);
                this.nextRoundBar.beginFill(barColor, 1) 
                this.nextRoundBar.drawRoundedRect(barX, barY, width, barHeight, 1);
                this.nextRoundBar.endFill();
            }
        if(this.levelData.roundTime - this.roundTimerCount <= 0 & this.gameOn){
                this.gameOn = false;
                this.roundEnd();
        }
        this.roundTimerCount += 0.25;
    }, this);
    this.roundTimer.start();


    //XCHANGEBAR

    
    //xChangeBar
    var barX1 = 515;
    var barY2 = 385;
    var barWidth2 = 170;
    var barHeight2 = 20;
    this.xChangeBarBG = this.game.add.graphics(0,0);
    this.xChangeBarBG.lineStyle(lineWidth, barBGLineColor);
    this.xChangeBarBG.beginFill(barBGColor, barAlpha) 
    this.xChangeBarBG.drawRoundedRect(barX1, barY2, barWidth2, barHeight2, 1);
    this.xChangeBarBG.endFill();
    //xChangeBar 
    this.xChangeBar = this.game.add.graphics(0,0);

    this.xValueChangeTextInfo = this.game.add.text(600, barY2 + 12, "Aikaa muuttujan vaihtoon", xChangeTextInfoStyle);
    this.xValueChangeTextInfo.anchor.setTo(0.5);

    this.xChangeTimer = this.game.time.create(true);
    this.xChangeTimer.loop(250, function(){
        //xChangeBar
        var width = ((barWidth2 * this.roundTimerCount)/this.levelData.xChangeTime) % barWidth2
        if(width > 0){
            this.xChangeBar.clear();
            this.xChangeBar.lineStyle(0.5, barLineColor);
            this.xChangeBar.beginFill(barColor, 1) 
            this.xChangeBar.drawRoundedRect(barX1, barY2, width, barHeight2, 1);
            this.xChangeBar.endFill();
        }

    }, this);
    this.xChangeTimer.start();
    

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
},
render: function() {

    // Sprite debug info
    // this.game.debug.spriteInfo(this.shipBlue, 32, 32);

},
materialsSetUp: function(){
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
    this.shipShipContactMaterial.restitution = 3.0;
},
createRandomAsteroid: function(xCoord, yCoord){
    //create random place in game area
    //spawn areas
    var spawnP = this.levelData.spawnCoords;
    // console.log(spawnP);
    
    var xy = spawnP[Math.floor(Math.random()* spawnP.length)];
    var x = this.game.rnd.integerInRange(-15, 15);
    var y = this.game.rnd.integerInRange(-15, 15);

    //check if x and y dont overlap with walls
    var data = {}
    data.color = this.levelData.colors[Math.floor(Math.random()*this.levelData.colors.length)];
    data.physic = data.texture;
    // data.mass = Math.random() * 10;
    data.mass = 1;
    data.value = this.valueData[Math.floor(Math.random()* this.valueData.length)]
    //look for dead element
    var newElement = this.asteroids.getFirstDead();

    //if coordinates as arguments, set them
    if(xCoord && yCoord){
        // console.log("Here");
        xy = [xCoord, yCoord];
    }

    if(!newElement || this.asteroids.children.length < 20){
      newElement = new AsteroidMath.Asteroid(this, xy[0] + x, xy[1] + y, data);
      this.asteroids.add(newElement);
    }
    else{
      newElement.reset(xy[0] + x, xy[1] + y, data);
    }
    return newElement;
}, 
asteroidCollide: function(ship, asteroid){
        // this.soundHit.play();
        asteroid.sprite.valuetext.visible = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            asteroid.sprite.valuetext.visible = false;
        }, this);
},
updateShipScore: function(shipColor, valueText){
    // console.log(valueText);
    var player = (shipColor == 'blue') ? this.blueData : this.redData;
    // console.log(player);

    //convert X from valueText to current text and evaluate it
    var value = eval(valueText.value.replace(/x/g, this.levelData.xValue));

    var textWithX = this.parseText(valueText.value);
    var textType = (this.levelData.xValue < 0) ? "valueNeg" : "value";
    var textWithoutX = this.parseText(valueText[textType].replace(/x/g, this.levelData.xValue));
    var textWithAnswer = textWithoutX + " = " + value;

    //GET MIDDLE of HomeArea and set the valueTextThere

    var dummyText = this.game.add.text(0, 0, textWithAnswer, answerStyle);
    var textWidth = dummyText.width;
    dummyText.destroy();
    var marginalX = 10;
    var offsetTextY = -10;
    var textX = player.homeArea.x1 + (player.getWidth() - textWidth)/2;
    var textY = (player.homeArea.y2 + player.homeArea.y1)/2 + offsetTextY

    var answerStyle = {
        font: this.font1,
        fontSize: '20px',
        fill: 'white'
        // wordWrap: true,
        // wordWrapWidth: textWidth
    };
    if(textWidth > player.getWidth()){
        answerStyle.wordWrap = true;
        wordWrapWidth =  player.getWidth() - 75;
        textX = player.homeArea.x1 + 50;
        textY = player.homeArea.y1 + 10;
    }
    this.game.world.bringToTop(player.answerTextWithX);   
    this.game.world.bringToTop(player.answerTextWithOutX);   

    player.answerTextWithX.reset();
    player.answerTextWithX.x = textX;
    player.answerTextWithX.y = textY;
    player.answerTextWithX.setText(textWithX);
    player.answerTextWithX.setStyle(answerStyle);
    player.answerTextWithX.alpha = 1;
    player.answerTextWithX.clearColors();

    player.answerTextWithOutX.reset();
    player.answerTextWithOutX.x = textX;
    player.answerTextWithOutX.y = textY;
    player.answerTextWithOutX.setText(textWithoutX);
    player.answerTextWithOutX.setStyle(answerStyle);
    player.answerTextWithOutX.alpha = 0;
    player.answerTextWithOutX.clearColors();

    //make x to yellow
    //get all x indexes
    var str = player.answerTextWithX.text;
    var indices = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === "x") indices.push(i);
    }
    //make them yellow
    for(var i=0; i<indices.length; i ++){
        player.answerTextWithX.addColor('yellow', indices[i]);
        player.answerTextWithX.addColor('white', indices[i] + 1);
    }

    var tween1 = this.game.add.tween(player.answerTextWithX).to({alpha: 0}, 1000, "Expo.easeIn", true);

    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
        //convert all this.levelData.xValue to yewllo
        // var str = player.answerTextWithOutX.text;
        // var index = str.indexOf(this.levelData.xValue.toString());
        // player.answerTextWithOutX.addColor('yellow', index);
        // player.answerTextWithOutX.addColor('white', index + this.levelData.xValue.toString().length);
        // console.log(index + this.levelData.xValue.toString().length);
        var tween2 = this.game.add.tween(player.answerTextWithOutX).to({alpha: 1}, 2500, 'Expo.easeOut', true);

        tween2.onComplete.add(function(){
            player.answerTextWithOutX.setText(textWithAnswer);
            // console.log(textWithAnswer);
            var index = player.answerTextWithOutX.text.indexOf("=") + 1;
            if(value > 0){
                player.answerTextWithOutX.addColor("green", index);
            }else{
                player.answerTextWithOutX.addColor("red", index);
            }
            player.answerTextWithX.kill();
        }, this);

        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
            player.answerTextWithOutX.kill();
            player.score += value
            this.bluePlayerScoreText.setText(this.blueData.score);
            this.redPlayerScoreText.setText(this.redData.score);
            player.collecting = false;
            

        }, this, true);
    }, this, true);
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
        "+-:": '\u{00B1}',
        "-:": '\u{2212}',
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
    var valueData = Object.values(JSON.parse(this.game.cache.getText(this.levelData.jsonValues)));
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
},
createPauseBtn: function(){
    //pause menu
    this.pause_label = this.game.add.text(1050, 10, 'Pause', {font: this.font1, fill: 'black', fontSize: '40px'});
    this.pause_label.inputEnabled = true;
    this.pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        if (!this.game.paused == true){
        this.game.paused = true;
        this.pause_label.text = "Paused";
        this.pause_label.fill = "red";
        }
        else{
          this.game.paused = false;
          this.pause_label.text = "Pause";
          this.pause_label.fill = "black";
        }
        }, this);
    // sound pause
    this.bgMusicPlaying = true;
    this.soundButton = this.game.add.button(10, 10, 'soundOn', function(){
        this.bgMusicPlaying = !this.bgMusicPlaying;
        if(!this.bgMusicPlaying){
            this.bgSound.stop();
            this.soundButton.loadTexture('soundOff');
        }
        else{
            this.bgSound.play();
            this.soundButton.loadTexture('soundOn');

        }
    }, this);
    this.soundButton.scale.setTo(0.5);

}

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
/*
xRizeTween: function(reward, time){
    //create object score for tweening
    
    var tween = this.game.add.tween(this.xData).to( { xNow: this.xData.xNow + reward }, time, Phaser.Easing.Linear.None);
    tween.start()
  },


*/