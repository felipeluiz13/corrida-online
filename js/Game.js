class Game {
  constructor() {
    this.reset = createButton("");
    this.resetTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.leaderTitle = createElement("h2");
    this.isMoving = false;
    this.keyActive = false;
    this.isExplode = false;
  }

  createElements() {
    form.titleImg.position(50,50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("reset");
    this.resetTitle.class("resetText");
    this.reset.class("resetButton");
    this.resetTitle.position(width/2+200,40);
    this.reset.position(width/2+200,100);

    this.leaderTitle.html("ranking:");
    this.leaderTitle.class("resetText");
    this.leaderTitle.position(width/3-60,50);
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,100);
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,150);
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width/2-50,height-100);
    car2 = createSprite(width/2+50,height-100);
    car1.addImage("car1",car1Img);
    car2.addImage("car2",car2Img);
    car1.addImage("explodiu",explode);
    car2.addImage("explodiu",explode);
    car1.scale = 0.07;
    car2.scale = 0.07;
    cars = [car1,car2];
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    this.addSprites(coins,20,coinImg,0.1);
    this.addSprites(fuels,10,fuelImg,0.02);
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }

  play() {
    form.hide();
    this.createElements();
    this.resetButton();
    Player.getPlayerInfo();
    player.getCarsEnd();
    if(allPlayers !== undefined) {
      image(track,0,-height*5,width,height*6)
      this.showLeaders();
      this.showLife();
      this.showFuelBar();
      var index = 0
      for(var plr in allPlayers) {
        index = index + 1;
        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;
        cars[index-1].position.x=x;
        cars[index-1].position.y=y-100;
        var currentLife = allPlayers[plr].life;
        if(currentLife <= 0) {
          cars[index-1].changeImage("explodiu");
          cars[index-1].scale = 0.3;
        }
        if(index === player.index) {
          camera.position.y = cars[index-1].position.y-420;
          this.addFuel(index);
          this.addCoin(index);
          this.obstacleColision(index);
          this.carsColission(index);
          if(player.life <= 0) {
            this.isExplode = true;
            this.isMoving = false;
            this.gameOver();
          }
        }
      }
      if(this.isMoving) {
        player.positionY += 5;
        player.update(); 
      }
      this.playerControls();
      const finish = height*6-100
      if(player.positionY > finish) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsEnd(player.rank);
        player.update();
        this.showRanking();
      }
      drawSprites()
    }
  }

  getState() {
   var gameStateRef = database.ref("gameState")
    gameStateRef.on("value",function (data){
      gameState = data.val();
    })
  }

  updateState(state) {
    database.ref("/").update({
      gameState:state
    })
  }

  playerControls() {
    if(!this.isExplode) {
      if(keyIsDown(UP_ARROW)) {
        player.positionY+=10;
        player.update();
        this.isMoving = true;
      }
      if(keyIsDown(LEFT_ARROW)&& player.positionX > width/3-50) {
        player.positionX-=5;
        player.update();
        this.keyActive = false;
      }
      if(keyIsDown(RIGHT_ARROW)&& player.positionX < width/2+300) {
        player.positionX+=5;
        player.update();
        this.keyActive = true;
      }
    }
  }

  resetButton() {
    this.reset.mousePressed(()=>{
      database.ref("/").set({
        carsEnd:0,
        playerCount:0,
        gameState:0,
        Players:{}
      })
      location.reload();
    })
  }

  showLeaders() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  addSprites(spriteGroup,number,spriteImg,scale,positions=[]){
    for(var i = 0; i < number; i++){
      var X,Y
      if(positions.length > 0){
        X = positions[i].x
        Y = positions[i].y
        spriteImg = positions[i].image
      }
      else{
        X = random(width/2+150,width/2-150);
        Y = random(-height * 4.5,height - 400);
      }
      var sprite = createSprite(X,Y);
      sprite.addImage("sprite",spriteImg);
      sprite.scale = scale;
      spriteGroup.add(sprite)
      
    }
  }
  
  addFuel(index) {
    cars[index-1].overlap(fuels,function(coletor,coletavel){
      player.fuel = 200;
      coletavel.remove();
    }
    )
    if(player.fuel > 0 && this.isMoving) {
      player.fuel -= 1;
    }
    if(player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  addCoin(index) {
    cars[index-1].overlap(coins,function(coletor,coletavel){
      player.score += 10;
      coletavel.remove();
      player.update();
    }
    )
  }

  showRanking() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  showLife() {
    push()
    image(life, player.positionX - 130, height - player.positionY - 200, 20, 20);
    fill("white");
    rect(player.positionX, height - player.positionY - 200, 200, 20);
    fill("#f50057");
    rect(player.positionX, height - player.positionY - 200, player.life, 20);
    noStroke();
    pop()
  }

  showFuelBar() {
    push();
    image(fuelImg,player.positionX- 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(player.positionX, height - player.positionY - 300, 200, 20);
    fill("#ffc400");
    rect(player.positionX, height - player.positionY - 300, player.fuel, 20);
    noStroke();
    pop();
  }

  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  obstacleColision(index) {
    if(cars[index-1].collide(obstacles)) {
      if(this.keyActive) {
        player.positionX -= 100;
      }
      else {
        player.positionX += 100;
      }
      if(player.life > 0) {
        player.life -= 200/4;
      }
      player.update();
    }
  }

  carsColission(index) {
    if(index === 1) {
    if(cars[index-1].collide(cars[1])) {
      if(this.keyActive) {
        player.positionX -= 100;
      }
      else {
        player.positionX += 100;
      }
      if(player.life > 0) {
        player.life -= 200/4;
      }
      player.update();
    }
    }
    if(index === 2) {
      if(cars[index-1].collide(cars[0])) {
        if(this.keyActive) {
          player.positionX -= 100;
        }
        else {
          player.positionX += 100;
        }
        if(player.life > 0) {
          player.life -= 200/4;
        }
        player.update();
      }
      }
  }
}
