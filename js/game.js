class Game {
   constructor(){
      const r = 4;
      const c = 3;
      this.seedDice = [];
      this.tiles = [];
      this.map = [// -1 is air, 0 is full block, 1-6 is rolled dice, 7-14 is alive version of that, 15 is player, 16 is end
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 16, -1],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0],
         [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
         [-1, -1, -1, 15, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 11, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      this.clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
      this.worldGen();
      this.player;
      this.waterLevel = 6 * 15 - 6;
      this.waterTime = 0;
      this.virtualWaterLevel = 0;
      this.berries = 0;
      this.water = 3;
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
               this.jamStandX = (x * 14) - 2;
               this.jamStandY = y * 14 - 3;
            }
         }
      }
   }

   display(){
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
      this.displayUI();
      main.graphics.image("JamStand", this.jamStandX, this.jamStandY, 17, 17);
   }

   updateWater(deltaTime){
      this.waterTime += deltaTime;
      this.waterLevel -= deltaTime/3;
      this.virtualWaterLevel = Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2);
   }

   displayWater(){
      main.graphics.staticImage("Water", Math.floor(main.graphics.camX) % 9 - 12 - Math.floor(Math.cos(this.waterTime * 3) * 4), Math.floor(main.graphics.camY) + Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2), 85, 41);
      main.graphics.staticImage("Water",  Math.floor(main.graphics.camX) % 9 + 85 - 12 - Math.floor(Math.cos(this.waterTime * 3) * 4), Math.floor(main.graphics.camY) + Math.floor(this.waterLevel + Math.PI/2 - Math.sin(this.waterTime * 3) * 2), 85, 41);
   }

   displayUI(){
      var berriesAsString = this.berries.toString();
      berriesAsString.split('').map(function(number, index) {
         main.graphics.staticImage("Number" + number, 12 + index * 4, 4, 4, 5);
      });
      main.graphics.staticImage("UIBerry", 1, 1, 16, 11);
      for(let i = 0; i < 3; i++){
         if(i >= Math.floor(this.water)){
            main.graphics.staticImage("WaterBubble2", WIDTH - 10 - i * 10, 3, 8, 8);
         }else{
            main.graphics.staticImage("WaterBubble", WIDTH - 10 - i * 10, 3, 8, 8);
         }
      }
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
      this.picked = false;
      this.action = "";
      this.water = 0;
      this.chosen = false;
   }

   display(){
      if(this.canGrow){
         if(this.num > 0 && this.water < this.num){
            main.graphics.image("DiceWatering" + this.water + "," + (this.num - 1).toString(), this.x, this.y, this.s, this.s);
         }else{
            main.graphics.image("GroundDice" + Math.floor(this.age < 3 ? this.age : 3) + "," + this.num, this.x, this.y, this.s, this.s);
         }
         if(this.age >= 5){
            if(this.picked){
               main.graphics.image("Plant" + (this.num - 1).toString() + ",5", this.x, this.y - 14, this.s, this.s);
            }else{
               main.graphics.image("Plant" + (this.num - 1).toString() + "," + (Math.floor(this.age - 4) < 0 ? 0 : Math.floor(this.age - 4)).toString(), this.x, this.y - 14, this.s, this.s);
            }
         }
      }else{
         main.graphics.image("GroundDice1,0", this.x, this.y, this.s, this.s);
      }
   }

   update(deltaTime){
      if(this.picked){
         this.action = "none";
      }else if(this.canGrow){
         if(Math.floor(this.age) < 8 && this.water >= this.num && this.num > 0){
            this.age += deltaTime * 3;
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

class Cloud{
   constructor(x, y){
      this.x = -75 + Math.random() * WIDTH;
      this.y = Math.random() * HEIGHT / 2;
      this.speed = 2 + Math.random() * 10;
   }

   display(){
      main.graphics.staticImage("Cloud", this.x, this.y, 75, 40);
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