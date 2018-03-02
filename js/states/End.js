var AsteroidMath = AsteroidMath || {};

//setting game configuration and loading the assets for the loading screen
AsteroidMath.EndState = {
  init: function() {

  },
  preload: function() {

    // this.blueScore = AsteroidMath.MenuState.blueScore;
    // this.redScore = AsteroidMath.MenuState.redScore;

    // this.blueScore = [{level: 'Round 1', score: 10}, {level: 'Round 2', score: 5}];
    // this.redScore = [{level: 'Round 1', score: -20}, {level: 'Round 2', score: 5}];

    this.blueScore = [{level: 'Taso 1', score: 14}, {level: 'Taso 2', score: -10}, {level: 'Taso 3', score: 7}];
    this.redScore = [{level: 'Taso 1', score: -20}, {level: 'Taso 2', score: 10}, {level: 'Taso 3', score: 20}];

    // console.log(this.blueScore);
    // console.log(this.redScore);

    this.roundLen = this.blueScore.length;

    this.blueTotalScore = 0;
    this.redTotalScore = 0;

  },
  create: function() {

    // this.game.stage.backgroundColor = "#12242D";
    this.game.stage.backgroundColor = "black";


    
    this.roundTexts = this.game.add.group();
    this.blueScoreTexts = this.game.add.group();
    this.redScoreTexts = this.game.add.group();

    this.createScoreTexts();    


    // console.log(this.roundTexts);
    // console.log(this.blueScoreTexts);
    // console.log(this.redScoreTexts);

    this.createScoreTable();
  },

  createScoreTexts: function(){

    var roundNameStyle = {
      font: AsteroidMath.GameState.font1,
      fill: 'white',
      fontSize: '40px'
    }

    
    var xStart = 300;
    var yStart = 300;
    var xOffset1 = 220;
    var xOffset2 = 440;
    var yOffset = 55;

    //create score texts
    for (var i = 0 ; i < this.roundLen ; i++){

      //HeadLine
      var headLineStyle = {font: AsteroidMath.GameState.font1, fill: 'white', fontSize: '50px'};
      var headLineText = this.game.add.text(this.game.width/2, 100, "TULOKSET", headLineStyle);
      headLineText.anchor.setTo(0.5);

      //roundName
      var roundName = this.game.add.text(xStart, yStart + yOffset * i, this.blueScore[i].level, roundNameStyle);
      roundName.visible = false;
      roundName.anchor.setTo(0.5);
      this.roundTexts.add(roundName);

      var redColor = (this.blueScore[i].score < this.redScore[i].score) ? 'green' : 'white';
      var blueColor = (redColor == 'white') ? 'green' : 'white';

      if(this.blueScore[i].score == this.redScore[i].score){
        redColor = 'white';
        blueColor = 'white';
      }
      //score
      var scoreTextBlue = this.game.add.text(roundName.x + xOffset1, yStart + yOffset * i, this.blueScore[i].score, roundNameStyle);
      scoreTextBlue.anchor.setTo(0.5);
      scoreTextBlue.visible = false;
      scoreTextBlue.fill = blueColor;
      this.blueScoreTexts.add(scoreTextBlue);
      this.blueTotalScore += this.blueScore[i].score;

      var scoreTextRed = this.game.add.text(roundName.x + xOffset2, yStart + yOffset * i, this.redScore[i].score, roundNameStyle);
      scoreTextRed.anchor.setTo(0.5);
      scoreTextRed.visible = false;
      scoreTextRed.fill = redColor;
      this.redScoreTexts.add(scoreTextRed);
      this.redTotalScore += this.redScore[i].score;
    }
    //total score  - text
    var text = this.game.add.text(xStart, yStart + (yOffset * this.roundLen), "Yhteensä", roundNameStyle);
    text.anchor.setTo(0.5);
    text.visible = false;
    this.roundTexts.add(text);

    //final scores
    this.blueTotalScoreText = this.game.add.text(xStart + xOffset1, yStart + (yOffset * this.roundLen), this.blueTotalScore, roundNameStyle);
    this.blueTotalScoreText.anchor.setTo(0.5);
    this.blueTotalScoreText.visible = false;

    this.redTotalScoreText = this.game.add.text(xStart + xOffset2, yStart + (yOffset * this.roundLen), this.redTotalScore, roundNameStyle);
    this.redTotalScoreText.anchor.setTo(0.5);
    this.redTotalScoreText.visible = false;

    //player names
    this.blueNameText = this.game.add.text(xStart + xOffset1, yStart - yOffset, "Sininen", roundNameStyle);
    this.blueNameText.anchor.setTo(0.5);

    this.redNameText = this.game.add.text(xStart + xOffset2, yStart - yOffset, "Punainen", roundNameStyle);
    this.redNameText.anchor.setTo(0.5);

    //player ships
    var blueShip = this.game.add.sprite(this.blueNameText.x, this.blueNameText.y - 50, 'ships', 'ship_blue.png');
    blueShip.anchor.setTo(0.5);
    blueShip.scale.setTo(-1.2);

    var redShip = this.game.add.sprite(this.redNameText.x, this.redNameText.y - 50, 'ships', 'ship_red.png');
    redShip.anchor.setTo(0.5);
    redShip.scale.setTo(-1.2);

  },

  createScoreTable: function(){
    var tweenLen = 500;

    var delay = 1000;
    var dealyIncr = 1000;
    var delay1 = delay;
    var delay2 = delay;
    var delay3 = delay;

    this.roundTexts.forEach(function(text){
      var bounces = 5;
      text.visible = true;
      var tween = this.game.add.tween(text).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, delay1, 0);
      delay1 += dealyIncr;
    }, this);

    this.blueScoreTexts.forEach(function(text){
      var bounces = 5;
      text.visible = true;
      var tween = this.game.add.tween(text).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, delay2, 0);
      delay2 += dealyIncr;
    }, this);

    this.redScoreTexts.forEach(function(text){
      var bounces = 5;
      text.visible = true;
      var tween = this.game.add.tween(text).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, delay3, 0);
      delay3 += dealyIncr;
    }, this);

    //End scores
    var totalDelay = delay + dealyIncr * this.roundTexts.children.length;
    var playerScoreDelay = totalDelay + tweenLen;
    // console.log(totalDelay);

    var totalScoreText = this.game.add.text()
    //Player Scores
    var tween1 = this.game.add.tween(this.blueTotalScoreText).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, playerScoreDelay, 0);
    tween1.onStart.add(function(){this.blueTotalScoreText.visible = true;}, this);
    var tween2 = this.game.add.tween(this.redTotalScoreText).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, playerScoreDelay, 0);
    tween2.onStart.add(function(){ this.redTotalScoreText.visible = true;}, this);

    //check who won
    var winnerStyle = {font: AsteroidMath.GameState.font1, fill: "white", fontSize: '44px'}
    var tie = this.blueTotalScore == this.redTotalScore;
    if(!tie){
      //get the winnertext and winner sprite
      var winnerText = (this.blueTotalScore > this.redTotalScore) ? this.blueTotalScoreText : this.redTotalScoreText;
      var winnerSprite = (this.blueTotalScore > this.redTotalScore) ? 'ship_blue.png' : 'ship_red.png';
      var winnerShip = (this.blueTotalScore > this.redTotalScore) ? 'Sininen' : 'Punainen';

      //tween the winnertext and set it to green
      var tween3 = this.game.add.tween(winnerText.scale).to({x: 1.5, y: 1.5}, 500, "Linear", true, playerScoreDelay + 500, -1, true);
      tween3.onStart.add(function(){ winnerText.fill = 'green';}, this);

      this.game.time.events.add(playerScoreDelay + 1000, function(){
        
        var winnerMessage = this.game.add.text(300, 600, 'Voittaja: ' + winnerShip, winnerStyle);

        var winnerMsgSpriteX = winnerMessage.x + 500;
        var winnerMsgSpriteY = winnerMessage.y + 25


        //PARTICLESTORM EMITTER TO WINNER SPRITE
        manager = this.game.plugins.add(Phaser.ParticleStorm);
        var data = {
            lifespan: 5000,
            red: 255,
            green: 255,
            blue: 255,
            vx: { min: -0.5, max: 0.5 },
            vy: { min: -0.5, max: 0.5 }
        };
        manager.addData('basic', data);
        var line = manager.createLineZone(winnerMsgSpriteX - 50, winnerMsgSpriteY, winnerMsgSpriteX + 50, winnerMsgSpriteY);
        //  This creates a Pixel Renderer.
        //  It works by rendering just pixels (it can't render images or textures)
        //  The red, green and blue properties of the particle data control the
        //  color of the pixel particles.
        emitter = manager.createEmitter(Phaser.ParticleStorm.PIXEL);
        emitter.addToWorld();
        emitter.emit('basic', 0, 0, { zone: line, total: 7, repeat: -1, frequency: 60 });

        //WINNER SPRITE
        var winnerMessageSprite = this.game.add.sprite(winnerMsgSpriteX, winnerMsgSpriteY, 'ships', winnerSprite);
        winnerMessageSprite.anchor.setTo(0.5);
        winnerMessageSprite.scale.setTo(-2.5, 2.5);


      }, this);
      
    }
    else{
      this.game.time.events.add(playerScoreDelay + 1000, function(){
        var winnerMessage = this.game.add.text(600, 600, "Tasapeli!", winnerStyle);
        winnerMessage.anchor.setTo(0.5);
      },this)
       
    }
  },  

  update: function() {


}


};