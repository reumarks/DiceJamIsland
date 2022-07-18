class Game {
   constructor(){
      this.dice = [];
      this.tiles = [];
      this.clouds = [];
      this.map = [
         // -1 is air, 0 is full block, 1-6 is rolled dice, 7-14 is alive version of that, 15 is player, 16 is end
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 16, -1],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
         [-1, -1, -1, 15, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 11, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      this.worldGen();
      this.water = new Water(TILE_SIZE * (this.map.length - 4) - 6);
      for(var i = 0; i < 10; i++){
         this.clouds.push(new Cloud());
      }
      this.camX = 0;
      this.camY = 0;
      this.started = false;
   };

   worldGen(){
      for(let y = 0; y < this.map.length; y++){
         for(let x = 0; x < this.map[y].length; x++){
            let num = this.map[y][x];
            if(num == -1){
               continue;
            }else if(num >= 0 && num <= 6){
               this.addTile(num, x, y);
            }else if(num >= 7 && num <=14){
               this.addTile(num - 6, x, y);
               this.tiles[y][x].age = 8;
               this.tiles[y][x].water = num-6;
            }else if(num == 15){
               this.player = new Player(x * 15 + 2, y * 15 - 10);
            }else if(num = 16){
               this.jamStandX = x * TILE_SIZE - 2;
               this.jamStandY = y * TILE_SIZE - 3;
            }
         }
      }
   }

   update(){
      this.clouds.forEach((cloud) => {
         cloud.update();
      });
      this.player.update();
      this.dice.forEach((dice, index) => {
         dice.update(index);
      });
      this.tiles.forEach((row) => {
         row.forEach((tile) => {
            tile.update();
         });
      });
      this.water.update();
   }

   display(){
      main.graphics.staticImage("Background", 0, 0, 128, 72);
      this.clouds.forEach((cloud) => {
         cloud.display();
      });
      this.dice.forEach((dice) => {
         dice.display();
      });
      this.tiles.forEach((row) => {
         row.forEach((tile) => {
            tile.display();
         });
      });
      this.player.display();
      main.graphics.image("JamStand", this.jamStandX, this.jamStandY, 17, 17);
      this.water.display();
      this.displayUI();
   }

   displayUI(){
      // Water Drops
      for(let i = 0; i < 3; i++){
         if(i >= Math.floor(this.player.waterCount)){
            main.graphics.staticImage("IconSheet2,0", 2 + i * 6, 3, 6, 7);
         }else{
            main.graphics.staticImage("IconSheet1,0", 2 + i * 6, 3, 6, 7);
         }
      }
      // Divider
      main.graphics.staticImage("IconSheet4,0", 24, 3, 6, 7);

      // Berry Count
      main.graphics.staticImage("IconSheet0,0", 28, 3, 6, 7);
      main.graphics.staticImage("IconSheet3,0", 36, 4, 6, 7);
      this.player.berryCount.toString().split('').map(function(number, index) {
         main.graphics.staticImage("NumberSheet" + number + "," + 0, 38 + index * 4, 4, 4, 6);
      });
   }

   addTile(num, x, y){ // Num, Tile coords
      if(this.tiles[y] == null){
         let row = [];
         row[x] = new Tile(num, x * TILE_SIZE, y * TILE_SIZE);
         this.tiles[y] = row;
      }else{
         this.tiles[y][x] = new Tile(num, x * TILE_SIZE, y * TILE_SIZE);
      }
      let above = this.getTile(x, y - 1);
      let below = this.getTile(x, y + 1);
      if(above){
         this.tiles[y][x].canGrow = false;
      }
      if(below){
         below.canGrow = false;
      }
   }

   getTile(x, y){ // Tile coords
      if(y >= 0 && x >= 0){
         if(this.tiles[y] != null){
            if(this.tiles[y][x] != null){
               return this.tiles[y][x];
            }
         }
      }
      return false;
   }

   pixelHitTile(px, py){ // Pixel coords
      if(this.tiles[Math.floor(py/TILE_SIZE)] != null){
         if(this.tiles[Math.floor(py/TILE_SIZE)][Math.floor(px/TILE_SIZE)] != null){
            return this.tiles[Math.floor(py/TILE_SIZE)][Math.floor(px/TILE_SIZE)];
         }
      }
      return false;
   }
}