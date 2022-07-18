class Tile{
   constructor(num, x, y){
      this.x = x;
      this.y = y;
      this.num = num;
      this.age = 0;
      this.canGrow = true;
      this.picked = false;
      this.action = "";
      this.water = 0;
      this.chosen = false;
   }

   display(){
      if(this.canGrow){
         if(this.num > 0 && this.water < this.num){
            main.graphics.image("TileSeedSheet" + (this.num - 1).toString() + "," + this.water.toString(), this.x, this.y, TILE_SIZE, TILE_SIZE);
         }else{
            main.graphics.image("TileRootSheet" + this.num.toString() + "," + Math.floor(this.age < 3 ? this.age : 3).toString(), this.x, this.y, TILE_SIZE, TILE_SIZE);
         }
         if(this.age >= 5){
            if(this.picked){
               main.graphics.image("TilePlantSheet" + "5" + "," + (this.num - 1).toString(), this.x, this.y - TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }else{
               main.graphics.image("TilePlantSheet" + Math.floor(this.age - 4).toString() + "," + (this.num - 1).toString(), this.x, this.y - TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
         }
      }else{
         main.graphics.image("TileRootSheet0,1", this.x, this.y, TILE_SIZE, TILE_SIZE);
      }
   }

   update(){
      if(this.picked){
         this.action = "none";
      }else if(this.canGrow){
         if(Math.floor(this.age) < 8 && this.water >= this.num && this.num > 0){
            this.age += deltaTime;
         }
         if(Math.floor(this.age) == 8){
            this.action = "pick";
         }else if(this.water < this.num){
            this.action = "water";
         }else if(!this.chosen){
            this.action = "roll";
         }else{
            this.action = "none";
         } 
      }else{
         this.action = "none";
      }
   }
}