class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setPosition(){
    this.titleImg.position(120,50);
    this.input.position(width/2,height/2);
    this.playButton.position(width/2+15,height/2+50);
    this.greeting.position(width/3,height/2);
  }

  setStyle(){
    this.titleImg.class("gameTitle");
    this.playButton.class("customButton");
    this.input.class("customInput");
    this.greeting.class("greeting");
  }

  MousePressed(){
    this.playButton.mousePressed(()=>{
      this.input.hide()
      this.playButton.hide()
      this.greeting.html(`olá,${this.input.value()}.</br> Aguarde o próximo jogador...`)
      playerCount +=1;
      player.name = this.input.value();
      player.index=playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
    })

  }

  display(){
    this.setPosition();
    this.setStyle();
    this.MousePressed();
  }
}

 