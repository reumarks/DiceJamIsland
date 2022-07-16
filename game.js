class GameWorld {
   constructor(){
      this.blocks = {};
      this.worldGen();
   };

   worldGen(){
      for(let i = -3; i <= 3; i++){
         //this.blocks.push(new Block(i, 0, Math.random() * 6));
      }
   }

}

class Block{
   constructor(x, y, num){
      this.x = x;
      this.y = y;
      this.num = num;
   }

   display(pixelGrid, images){
      pixelGrid.image(images["GroundDice" + this.num + "-" + i], 2 + i * 14, 2, 14, 14);
   }
}

class Game {
   constructor(){
      this.gameWorld = new GameWorld();
   }

   update(deltaTime){

   }
   
   display(pixelGrid, images){
      pixelGrid.image(images["Background"], 0, 0, 128, 72);
      for(var i = 0; i < 6; i ++){
         pixelGrid.image(images["GroundDice" + 0 + "-" + i], 2 + i * 14, 2, 14, 14);
      }
   }
}