class GameWorld {
   constructor(){
      this.blocks = [];
      this.worldGen();
   };

   worldGen(){
      for(let i = -3; i <= 3; i++){
         this.blocks.push(new Block(0, i * 14, 0 * 14));
      }
   }

   display(pixelGrid, images){
      this.blocks.forEach((block) => {
         block.display(pixelGrid, images);
      });
   }
}

class Block{
   constructor(num, x, y){
      this.x = x;
      this.y = y;
      this.num = num;
   }

   display(){
      main.graphics.image("GroundDice" + 0 + "-" + this.num, Math.floor(this.x), Math.floor(this.y), 14, 14);
   }
}

class Player {
   constructor(x, y){
      this.x = x;
      this.y = y;
   }
   
   display(){
      main.graphics.image("Frog1", this.x, this.y, 7, 7);
   }

   update(deltaTime){
      if(keys[UP]){
         this.y -= 6 * deltaTime;
      }
      if(keys[RIGHT]){
         this.x += 6 * deltaTime;
      }
      if(keys[DOWN]){
         this.y += 6 * deltaTime;
      }
      if(keys[LEFT]){
         this.x -= 6 * deltaTime;
      }
      main.graphics.camX = WIDTH / 2 - this.x;
      main.graphics.camY = HEIGHT / 2 - this.y;
   }
}

class Game {
   constructor(){
      this.gameWorld = new GameWorld();
      this.player = new Player(0, 0);
   }

   update(deltaTime){
      this.player.update(deltaTime);
   }
   
   display(){
      main.graphics.staticImage("Background", 0, 0, 128, 72);
      this.gameWorld.display();
      this.player.display();
   }
}