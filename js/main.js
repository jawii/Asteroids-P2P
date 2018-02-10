var MovingParts = MovingParts || {};

MovingParts.game = new Phaser.Game(1200, 700, Phaser.AUTO);

MovingParts.game.state.add('Boot', MovingParts.BootState); 
MovingParts.game.state.add('Preload', MovingParts.PreloadState); 
MovingParts.game.state.add('Game', MovingParts.GameState);

MovingParts.game.state.start('Boot'); 
