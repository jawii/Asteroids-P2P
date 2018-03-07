var AsteroidMath = AsteroidMath || {};

//loading the game assets
AsteroidMath.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(this.preloadBar);

    //buttons
    this.load.image('button1', 'assets/images/button1.png');
    //increment and decrement buttons
    this.load.image('incrBtn', 'assets/images/incrBtn.png');
    this.load.image('decrBtn', 'assets/images/decrBtn.png');
    this.load.image('soundOn', 'assets/images/soundOn.png');
    this.load.image('soundOff', 'assets/images/soundOff.png');

    //menubg
    this.load.image('menubackground', 'assets/images/menubackground.png');
    this.load.image('endbackground', 'assets/images/endbackground.png');
    //keys
    this.load.image('keysBlue', 'assets/images/keysBlue.png');
    this.load.image('keysRed', 'assets/images/keysRed.png');


    //LVL1
    this.load.image('background1', 'assets/images/background1.png');
    // this.load.image('wall4', 'assets/images/wall4.png');
    //LVL2
    this.load.image('background2', 'assets/images/background2.png');
    // this.load.image('wall1', 'assets/images/wall1.png');
    // this.load.image('wall2', 'assets/images/wall2.png');
    // this.load.image('wall3', 'assets/images/wall3.png');
    //LVL3
    this.load.image('background3', 'assets/images/background3.png');
    // this.load.image('wall5', 'assets/images/wall5.png');
    // this.load.image('wall6', 'assets/images/wall6.png');
    // this.load.image('wall7', 'assets/images/wall7.png');
    // this.load.image('wall8', 'assets/images/wall8.png');
    // this.load.image('wall9', 'assets/images/wall9.png');
    // this.load.image('wall10', 'assets/images/wall10.png');
    
    //ships
    this.game.load.atlasJSONHash('ships', 'assets/images/ships.png', 'assets/images/ships.json');
    this.game.load.atlasJSONHash('sprites', 'assets/images/sprites.png', 'assets/images/sprites.json');

    //physics
    this.load.physics('physics', 'assets/data/physics.json');
    this.load.image('4x4_red', 'assets/images/4x4_red.png');
    this.load.image('4x4_blue', 'assets/images/4x4_blue.png');

    //load values
    this.load.text('values1', 'js/data/values1.json');
    this.load.text('values2', 'js/data/values2.json');
    this.load.text('values3', 'js/data/values3.json');
    // this.load.text('values', 'js/data/valuesTest.json');

    //music
    this.game.load.audio('click', ['assets/audio/click.mp3', 'assets/audio/click.ogg' ]);
    this.game.load.audio('1', ['assets/audio/1.mp3', 'assets/audio/1.ogg' ]);
    this.game.load.audio('2', ['assets/audio/2.mp3', 'assets/audio/2.ogg' ]);
    this.game.load.audio('3', ['assets/audio/3.mp3', 'assets/audio/3.ogg' ]);
    this.game.load.audio('begin', ['assets/audio/begin.mp3', 'assets/audio/begin.ogg' ]);
    this.game.load.audio('bgMusic', ['assets/audio/bgMusic.mp3', 'assets/audio/bgMusic.ogg' ]);
    // this.game.load.audio('hit', ['assets/audio/hit.mp3', 'assets/audio/hit.ogg' ]);
    
    //emitter
    this.game.load.path = 'assets/images/';
    this.game.load.atlas('colorsHD');

    //load levels
    // this.load.text('level1', 'assets/levels/level1.json');



  },
  create: function() {
    this.state.start('Menu');
  }
};