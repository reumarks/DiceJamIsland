class Dice {
   constructor(num, x, y, tile){
      this.num = num;
      this.tile = tile;
      this.x = x;
      this.y = y;
      this.startX = x;
      this.startY = y;
      this.time = 0;
   }

   display(){
      if(this.time <= 1.5){
         main.graphics.image("DiceSheet" + this.num + "," + "0", Math.floor(this.x), Math.floor(this.y), 5, 5);
      }
   }

   update(index){
      this.time += 5 * deltaTime;
      if(this.time > 1){
         this.x = lerp(this.startX, this.tile.x + 7, (this.time - 1) * 2);
         this.y = lerp(this.startY, this.tile.y + 7, (this.time - 1) * 2);
      }
      if(this.time >= 1.5){
         this.tile.num = this.num + 1;
         this.tile.age = 0;
         main.game.dice.pop(index);
      }
   }
}