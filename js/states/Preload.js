var AsteroidMath = AsteroidMath || {};

//loading the game assets
AsteroidMath.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(this.preloadBar);

    //textures   
    this.load.image('sky', 'assets/images/sky.png');

    //floors and walls

    //LVL1
    this.load.image('background1', 'assets/images/background1.png');
    this.load.image('wall4', 'assets/images/wall4.png');
    //LVL2
    this.load.image('background2', 'assets/images/background2.png');
    this.load.image('wall1', 'assets/images/wall1.png');
    this.load.image('wall2', 'assets/images/wall2.png');
    this.load.image('wall3', 'assets/images/wall3.png');
    
    //ships
    this.game.load.atlasJSONHash('ships', 'assets/images/ships.png', 'assets/images/ships.json');

    //physics
    this.load.physics('physics', 'assets/data/physics.json');
    this.load.image('4x4_red', 'assets/images/4x4_red.png');
    this.load.image('4x4_blue', 'assets/images/4x4_blue.png');

    //load values
    this.load.text('values1', 'js/data/values1.json');
    this.load.text('values2', 'js/data/values2.json');
    // this.load.text('values', 'js/data/valuesTest.json');
    
    //emitter
    this.game.load.path = 'assets/images/';
    this.game.load.atlas('colorsHD');

    //load levels
    // this.load.text('level1', 'assets/levels/level1.json');

  },
  create: function() {
    this.state.start('Game');
  }
};