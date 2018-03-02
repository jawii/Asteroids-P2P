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

    this.levelData2 = {
        name: "Taso 2",
        jsonValues: 'values2',
        background: 'background2',
        nextLevel: null,
        // roundTime: 60 * 5,
        roundTime: 90,
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
      roundTime: 90,
      textColor: 'black',
      background: 'background1',
      walls: {wall4: {x:600, y: 400, angle: 0 , staticBody: true}},
      xValue: -2,
      xValues: [1, 2, 3],
      xChangeTime: 60,
      colors: ['0xfbb03b', '0xFFFF00', '0x00FFFF', "0x0071bc", "0x7ac943", "0x3fa9f5"],
      spawnCoords: [[170, 120], [170, 240], [170, 550], [170, 670], [950, 120], [950, 240], [950, 550], [950, 670], [600, 150], [600, 240],[600, 550], [600, 670]],
      BLUEspawn: {x: 240, y: 400},
      BLUEhomeArea: {x1: 0, x2: 190, y1: 317, y2: 487},
      BLUEangle: 135,
      BLUEscoreText: {x: 35, y: 260},
      BLUEcollecting: false,
      BLUEgravityLine: {x1: 213, y1: 353, x2: 213, y2: 450},
      //REDDATA
      REDspawn: {x: 800, y: 400},
      REDhomeArea: {x1: 1030, x2: 1200, y1: 317, y2: 487},
      REDangle: -45,
      REDscore: 0,
      REDscoreText: {x: 1162, y: 550},
      REDcollecting: false,
      REDgravityLine: {x1: 988, y1: 353, x2: 988, y2: 450},
    };

  },
  create: function() {
    this.game.state.start('Game', true, false, this.levelData1);
  }
};