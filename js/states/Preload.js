var MovingParts = MovingParts || {};

//loading the game assets
MovingParts.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);

    this.load.setPreloadSprite(this.preloadBar);

    //textures   
    this.load.image('sky', 'assets/images/sky.png');
    
    //playerdata
    this.load.image('ship_blue', 'assets/images/ship_blue.png');
    this.load.image('ship_red', 'assets/images/ship_red.png');
    this.load.image('bullet_red', 'assets/images/bullet_red.png');
    this.load.image('bullet_blue', 'assets/images/bullet_blue.png');

    //asteroids
    this.load.image('asteroid1', 'assets/images/asteroid1.png')
    this.load.image('asteroid2', 'assets/images/asteroid2.png')
    this.load.image('asteroid3', 'assets/images/asteroid3.png')

    //physics
    this.load.physics('physics', 'assets/data/physics.json');

    //load levels
    this.load.text('level1', 'assets/levels/level1.json');

  },
  create: function() {
    this.state.start('Game');
  }
};