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

    //floors
    this.load.image('background', 'assets/images/background.png')
    // this.load.image('corners', 'assets/images/gamearea.png');
    
    //ships
    this.game.load.atlasJSONHash('sprites', 'assets/images/sprites.png', 'assets/images/sprites.json');

    //physics
    this.load.physics('physics', 'assets/data/physics.json');
    this.load.image('4x4_red', 'assets/images/4x4_red.png');
    this.load.image('4x4_blue', 'assets/images/4x4_blue.png');

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