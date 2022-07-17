class Game {
   constructor(){
      const r = 4;
      const c = 3;
      this.seedDice = [];
      this.tiles = [];
      this.map = [// -1 is air, 0 is full block, 1-6 is rolled dice, 7-14 is alive version of that, 15 is player, 16 is end
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, 0, 16, 0],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
         [-1, -1, -1, 15, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 10, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      this.clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
      this.worldGen();
      this.player;
      this.waterLevel = 4 * 15 - 4;
      this.waterTime = 0;
      this.virtualWaterLevel = 0;
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
               this.tiles[y][x].age = 6;
            }else if(num == 15){
               this.player = new Player(x * 15 + 2, y * 15 - 10);
            }
         }
      }
   }

   display(pixelGrid, images){
      main.graphics.staticImage("Background", 0, 0, 128, 72);
      this.clouds.forEach((cloud) => {
         cloud.display();
      });
      this.seedDice.forEach((dice) => {
         dice.display();
      });
      this.tiles.forEach((row) => {
         row.forEach((tile) => {
            tile.display();
         });
      });
      this.player.display();
      this.displayWater();
      //main.graphics.staticImage("Foreground", 0, 0, 128, 72);
   }

   updateWater(deltaTime){
      this.waterTime += deltaTime;
      this.waterLevel -= deltaTime/3;
      this.virtualWaterLevel = Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2);
   }

   displayWater(){
      main.graphics.staticImage("Water1", Math.floor(main.graphics.camX) % 9 - 12 - Math.floor(Math.cos(this.waterTime * 3) * 4), Math.floor(main.graphics.camY) + Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2), 85, 41);
      main.graphics.staticImage("Water1",  Math.floor(main.graphics.camX) % 9 + 85 - 12 - Math.floor(Math.cos(this.waterTime * 3) * 4), Math.floor(main.graphics.camY) + Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2), 85, 41);
   }

   update(deltaTime){
      this.clouds.forEach((cloud) => {
         cloud.update(deltaTime);
      });
      this.player.update(deltaTime);
      this.seedDice.forEach((dice, index) => {
         dice.update(deltaTime, index);
      });
      this.tiles.forEach((row) => {
         row.forEach((tile) => {
            tile.update(deltaTime);
         });
      });
      this.updateWater(deltaTime);
   }

   addTile(num, x, y){ // Num, Tile coords
      if(this.tiles[y] == null){
         let row = [];
         row[x] = new Tile(num, x * 14, y * 14);
         this.tiles[y] = row;
      }else{
         this.tiles[y][x] = new Tile(num, x * 14, y * 14);
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
      if(this.tiles[Math.floor(py/14)] != null){
         if(this.tiles[Math.floor(py/14)][Math.floor(px/14)] != null){
            return this.tiles[Math.floor(py/14)][Math.floor(px/14)];
         }
      }
      return false;
   }
}

class Tile{
   constructor(num, x, y){
      this.x = x;
      this.y = y;
      this.s = 14;
      this.num = num;
      this.age = 0;
      this.canGrow = true;
   }

   display(){
      if(this.canGrow){
         main.graphics.image("GroundDice" + Math.floor(this.age) + "," + this.num, this.x, this.y, this.s, this.s);
      }else{
         main.graphics.image("GroundDice1,0", this.x, this.y, this.s, this.s);
      }
   }

   update(deltaTime){
      if(this.canGrow){
         if(this.age < 6 && this.num > 0){
            this.age += deltaTime;
         }
      }
   }
}

class Cloud{
   constructor(x, y){
      this.x = -75 + Math.random() * WIDTH;
      this.y = Math.random() * HEIGHT / 2;
      this.speed = 2 + Math.random() * 10;
   }

   display(){
      main.graphics.staticImage("Cloud1", this.x, this.y, 75, 40);
   }

   update(deltaTime){
      this.x += deltaTime * this.speed;
      if(this.x > WIDTH){
         this.x = -75;
         this.y = Math.random() * HEIGHT / 4;
         this.speed = 2 + Math.random() * 10;
      }
   }
}