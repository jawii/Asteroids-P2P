var AsteroidMath = AsteroidMath || {};

//setting game configuration and loading the assets for the loading screen
AsteroidMath.EndState = {
  init: function() {

  },
  preload: function() {

    this.blueScore = AsteroidMath.MenuState.blueScore;
    this.redScore = AsteroidMath.MenuState.redScore;

    // this.blueScore = [{level: 'Round 1', score: 10}, {level: 'Round 2', score: 5}];
    // this.redScore = [{level: 'Round 1', score: -20}, {level: 'Round 2', score: 5}];

    // this.blueScore = [{level: 'Round 1', score: 10}, {level: 'Round 2', score: -10}, {level: 'Round 3', score: 7}];
    // this.redScore = [{level: 'Round 1', score: -20}, {level: 'Round 2', score: 5}, {level: 'Round 3', score: 20}];

    // console.log(this.blueScore);
    // console.log(this.redScore);

    this.roundLen = this.blueScore.length;

    this.blueTotalScore = 0;
    this.redTotalScore = 0;

  },
  create: function() {

    this.game.stage.backgroundColor = "#12242D";


    
    this.roundTexts = this.game.add.group();
    this.blueScoreTexts = this.game.add.group();
    this.redScoreTexts = this.game.add.group();

    this.createScoreTexts();    


    console.log(this.roundTexts);
    console.log(this.blueScoreTexts);
    console.log(this.redScoreTexts);

    var tweenLen = 750;

    var delay = 1500;
    var dealyIncr = 1500;
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
    var tween = this.game.add.tween(this.blueTotalScoreText).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, playerScoreDelay, 0);
    tween.onStart.add(function(){this.blueTotalScoreText.visible = true;}, this);
    var tween = this.game.add.tween(this.redTotalScoreText).from( { y: -50 }, tweenLen, Phaser.Easing.Bounce.Out, true, playerScoreDelay, 0);
    tween.onStart.add(function(){ this.redTotalScoreText.visible = true;}, this);
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
    var text = this.game.add.text(xStart, yStart + (yOffset * this.roundLen), "Total", roundNameStyle);
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
    this.blueNameText = this.game.add.text(xStart + xOffset1, yStart - yOffset, "BLUE", roundNameStyle);
    this.blueNameText.anchor.setTo(0.5);

    this.redNameText = this.game.add.text(xStart + xOffset2, yStart - yOffset, "RED", roundNameStyle);
    this.redNameText.anchor.setTo(0.5);
  }

};