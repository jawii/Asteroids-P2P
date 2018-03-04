var AsteroidMath = AsteroidMath || {};

//setting game configuration and loading the assets for the loading screen
AsteroidMath.MenuState = {
  init: function() {

  },
  preload: function() {

    //SCOREDATA
    //acces these at gamesate with AsteroidMath.MenuState.BLUESCORE
    this.blueScore = [];
    this.redScore = [];

    

    this.game.stage.backgroundColor = "#646464";

  },
  create: function() {

    //background
    this.game.stage.backgroundColor = "black";

    var bgSprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'menubackground');
    bgSprite.anchor.setTo(0.5);
    bgSprite.scale.setTo(0.5);


    this.createTexts();
    this.createButtons();
    this.generateKeyInfos();

    //generate levels
    this.generateLevelDatas();
  },

  startGame: function(){
    this.levelData1.roundTime = this.roundTime * 60;
    this.levelData2.roundTime = this.roundTime * 60;
    this.levelData3.roundTime = this.roundTime * 60;
    this.game.state.start('Game', true, false, this.levelData3);
  },
  createTexts: function(){
    //gameName
    // var gameNameSprite = this.game.add.sprite(this.game.width/2, 100, 'gameNameText');
    // gameNameSprite.anchor.setTo(0.5);
    // gameNameSprite.scale.setTo(0.25);
    var gameNamestyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'white',
      fontSize: '100px'
    };
    var gameNameInfoStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'black',
      fontSize: '40px'
    };
    var gameInfoTextStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'white',
      fontSize: '28px',
      wordWrap: true,
      wordWrapWidth: 800,
      align: 'center'
    };

    var gameNameText = this.game.add.text(this.game.width/2, 150, 'ASTEROIDMATH', gameNamestyle);
    gameNameText.anchor.setTo(0.5);
    gameNameText.setShadow(5, 5, 'rgba(0,0,0,0.9)', 10);

    var gameNameInfoText = this.game.add.text(gameNameText.x, gameNameText.y + 75, 'Kahden pelaajan avaruuspeli', gameNameInfoStyle);
    gameNameInfoText.anchor.setTo(0.5);

    var text = 'Kerää aluksellasi kappaleita omaan kotipaikkaasi. Kappaleen arvo riippuu muuttujan x arvosta. Yritä kerätä mahdollisimman monta pistettä';
    var gameInfoText = this.game.add.text(gameNameText.x, gameNameText.y + 200, text, gameInfoTextStyle);
    gameInfoText.anchor.setTo(0.5);
    gameInfoText.setShadow(3, 3, 'rgba(0,0,0,0.8)', 5);
  },
  generateLevelDatas: function(){

    this.levelData3 = {
      name: "Taso 3",
      jsonValues: 'values2',
      background: 'background3',
      nextLevel: null,
      // roundTime: 60 * 5,
      roundTime: AsteroidMath.MenuState.roundTime,
      walls: {
        wall5: {x:200, y: 200, angle: 0, staticBody: false, mass: 6}, 
        wall6: {x:200, y: 400, angle: 180, staticBody: false, mass: 6}, 
        wall7: {x: 800, y: 400, angle: 180, staticBody: false, mass: 6},
        wall8: {x: 600, y: 400, angle: 0, staticBody: true}
      },
      textColor: 'white',
      xValue: -2,
      xValues: [-3, -2, -1, 0, 1, 2, 3],
      xChangeTime: 90,
      colors: ['0xfbb03b', '0xFFFF00', '0x00FFFF', "0x0071bc", "0x7ac943", "0x3fa9f5"],
      spawnCoords: [[600, 300], [600, 600]],
      //BLUEDATA
      BLUEspawn: {x: 300, y: 750},
      BLUEhomeArea: {x1: 0, x2: 250, y1: 660, y2: 800},
      BLUEangle: 90,
      BLUEscoreText: {x: 263, y: 170},
      BLUEcollecting: false,
      BLUEgravityLine: {x1: 300, y1: 670, x2: 300, y2: 790},
      //REDDATA
      REDspawn: {x: 900, y: 75},
      REDhomeArea: {x1: 950, x2: 1200, y1: 0, y2: 150},
      REDangle: -90,
      REDscore: 0,
      REDscoreText: {x: 930, y: 675},
      REDcollecting: false,
      REDgravityLine: {x1: 900, y1: 10, x2: 900, y2: 140},
    };

    this.levelData2 = {
      name: "Taso 2",
      jsonValues: 'values2',
      background: 'background2',
      nextLevel: AsteroidMath.MenuState.levelData3,
      // roundTime: 60 * 5,
      roundTime: AsteroidMath.MenuState.roundTime,
      walls: {wall1: {x:600, y: 400, angle: 0, staticBody: true}, wall2: {x:200, y: 600, angle: 180, staticBody: true}, wall3: {x: 1000, y: 150, angle: 180, staticBody: true}},
      textColor: 'white',
      xValue: -2,
      xValues: [-3, -2, -1, 0, 1, 2, 3],
      xChangeTime: 90,
      colors: ['0xfbb03b', '0xFFFF00', '0x00FFFF', "0x0071bc", "0x7ac943", "0x3fa9f5"],
      spawnCoords: [[100, 600], [105, 700], [220, 710], [985, 54], [1105, 74.7], [1118, 137], [380, 88], [815, 703], [974, 186], [215, 560],[587, 531], [603, 290]],
      //BLUEDATA
      BLUEspawn: {x: 150, y: 130},
      BLUEhomeArea: {x1: 25, x2: 225, y1: 25, y2: 125},
      BLUEangle: 135,
      BLUEscoreText: {x: 263, y: 170},
      BLUEcollecting: false,
      BLUEgravityLine: {x1: 80, y1: 235, x2: 165, y2: 235},
      //REDDATA
      REDspawn: {x: 1060, y: 550},
      REDhomeArea: {x1: 975, x2: 1176, y1: 680, y2: 775},
      REDangle: -45,
      REDscore: 0,
      REDscoreText: {x: 930, y: 675},
      REDcollecting: false,
      REDgravityLine: {x1: 1040, y1: 600, x2: 1140, y2: 600},
    };
    this.levelData1 = {
      name: "Taso 1",
      jsonValues: 'values1',
      isLastRound: false,
      nextLevel: AsteroidMath.MenuState.levelData2,
      // roundTime: 4 * 60,
      roundTime: AsteroidMath.MenuState.roundTime,
      textColor: 'black',
      background: 'background1',
      walls: {wall4: {x:600, y: 400, angle: 0 , staticBody: true}},
      xValue: -2,
      xValues: [1, 2, 3],
      xChangeTime: 60,
      colors: ['0xfbb03b', '0xFFFF00', '0x00FFFF', "0x0071bc", "0x7ac943", "0x3fa9f5"],
      spawnCoords: [[170, 120], [170, 240], [170, 550], [170, 670], [950, 120], [950, 240], [950, 550], [950, 670], [600, 150], [600, 240],[600, 550], [600, 670]],
      BLUEspawn: {x: 250, y: 400},
      BLUEhomeArea: {x1: 0, x2: 190, y1: 317, y2: 487},
      BLUEangle: 90,
      BLUEscoreText: {x: 35, y: 260},
      BLUEcollecting: false,
      BLUEgravityLine: {x1: 213, y1: 353, x2: 213, y2: 450},
      //REDDATA
      REDspawn: {x: 950, y: 400},
      REDhomeArea: {x1: 1030, x2: 1200, y1: 317, y2: 487},
      REDangle: -90,
      REDscore: 0,
      REDscoreText: {x: 1162, y: 550},
      REDcollecting: false,
      REDgravityLine: {x1: 988, y1: 353, x2: 988, y2: 450},
    };
  },
  generateKeyInfos: function(){
    //keyinfo
    var keysBlue = this.game.add.sprite(200, 600, 'keysBlue');
    keysBlue.anchor.setTo(0.5);
    keysBlue.scale.setTo(0.25);

    var keysRed = this.game.add.sprite(1000, 600, 'keysRed');
    keysRed.anchor.setTo(0.5);
    keysRed.scale.setTo(0.25);

    var blueShipSprite = this.game.add.sprite(200, 475, 'ships', 'ship_blue.png');
    blueShipSprite.anchor.setTo(0.5);
    blueShipSprite.scale.setTo(1.5);
    blueShipSprite.angle = 180;
    blueShipSprite.alpha = 0.8;

    var redShipSprite = this.game.add.sprite(1000, 475, 'ships', 'ship_red.png');
    redShipSprite.anchor.setTo(0.5);
    redShipSprite.scale.setTo(1.5);
    redShipSprite.angle = 180;
    redShipSprite.alpha = 0.8;
  },
  createButtons: function(){

    // //ROUND LEN BUTTON

    var textStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'white',
      fontSize: '30px'
    };

    // var roundLenInfoTextStyle = {
    //   font: AsteroidMath.GameState.font1,
    //   fill: 'black',
    //   fontSize: '24px'
    // };

    // this.roundLen = 3;

    // this.roundLenInfoText = this.game.add.text(450, 460, "Tasojen lukumäärä", roundLenInfoTextStyle);
    // this.roundLenInfoText.anchor.setTo(0.5);

    // this.roundLenText = this.game.add.text(this.roundLenInfoText.x, this.roundLenInfoText.y + 40, this.roundLen, textStyle);
    // this.roundLenText.anchor.setTo(0.5);

    // this.roundLenIncrBtn = this.game.add.button(this.roundLenText.x + 40, this.roundLenText.y, 'incrBtn', function(){ 
    //   var newLen = this.roundLen + 1;
    //   this.roundLen = Math.min(newLen, 3); 
    //   this.roundLenText.setText(this.roundLen);
    // }, this);
    // this.roundLenIncrBtn.anchor.setTo(0.5);
    // this.roundLenIncrBtn.scale.setTo(0.10);

    // this.roundLenDecrBtn = this.game.add.button(this.roundLenText.x - 40, this.roundLenText.y, 'decrBtn', function(){ 
    //   var newLen = this.roundLen - 1;
    //   this.roundLen = Math.max(newLen, 1); 
    //   this.roundLenText.setText(this.roundLen);
    //   this.roundLenText.setText(this.roundLen);
    // }, this);
    // this.roundLenDecrBtn.anchor.setTo(0.5);
    // this.roundLenDecrBtn.scale.setTo(0.10);

    //ROUND TIME BUTTON

    var roundTimeInfoTextStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'black',
      fontSize: '24px'
    };

    this.roundTime = 3;

    this.roundTimeInfoText = this.game.add.text(600, 460, "Tason pituus (min)", roundTimeInfoTextStyle);
    this.roundTimeInfoText.anchor.setTo(0.5);
    

    this.roundTimeText = this.game.add.text(this.roundTimeInfoText.x, this.roundTimeInfoText.y + 40, this.roundTime.toFixed(1), textStyle);
    this.roundTimeText.anchor.setTo(0.5);
    this.roundTimeText.setShadow(3, 3, 'rgba(0,0,0,0.8)', 5);

    this.roundTimeIncrBtn = this.game.add.button(this.roundTimeText.x + 50, this.roundTimeText.y, 'incrBtn', function(){ 
      var newLen = this.roundTime + 0.5;
      this.roundTime = Math.min(newLen, 6); 
      this.roundTimeText.setText(this.roundTime.toFixed(1));
    }, this);
    this.roundTimeIncrBtn.anchor.setTo(0.5);
    this.roundTimeIncrBtn.scale.setTo(0.10);

    this.roundTimeDecrBtn = this.game.add.button(this.roundTimeText.x - 50, this.roundTimeText.y, 'decrBtn', function(){ 
      var newLen = this.roundTime - 0.5;
      this.roundTime = Math.max(newLen, 0.5); 
      this.roundTimeText.setText(this.roundTime.toFixed(1));
    }, this);
    this.roundTimeDecrBtn.anchor.setTo(0.5);
    this.roundTimeDecrBtn.scale.setTo(0.10);



    //PLAYBUTTON
    this.playButton = this.game.add.button(this.game.width/2, 600, 'button1', this.startGame, this);
    this.playButton.anchor.setTo(0.5);
    this.playButton.scale.setTo(0.5);
    var playBtnTxtStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'green',
      fontSize: '34px'
    }
    this.playButtonText = this.game.add.text(this.playButton.x, this.playButton.y + 10, 'Aloita', playBtnTxtStyle);
    this.playButtonText.anchor.setTo(0.5);
    this.playButtonText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

    this.playButton.onInputOver.add(function(){this.playButton.alpha = 0.7;}, this);
    this.playButton.onInputOut.add(function(){this.playButton.alpha = 1;}, this);
  }
};