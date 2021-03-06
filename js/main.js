var AsteroidMath = AsteroidMath || {};

AsteroidMath.game = new Phaser.Game(1200, 800, Phaser.AUTO);

AsteroidMath.game.state.add('Boot', AsteroidMath.BootState); 
AsteroidMath.game.state.add('Preload', AsteroidMath.PreloadState); 
AsteroidMath.game.state.add('Menu', AsteroidMath.MenuState); 
AsteroidMath.game.state.add('Game', AsteroidMath.GameState);
AsteroidMath.game.state.add('End', AsteroidMath.EndState);

AsteroidMath.game.state.start('Boot'); 
