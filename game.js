class Game {
   constructor(){
      const r = 4;
      const c = 3;
      this.seedDice = [];
      this.tiles = [];
      this.clouds = [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
      this.worldGen();
      this.player = new Player(14 * 15, 17 * 15 + 8);
   };

   worldGen(){
      for(let i = 10; i <= 20; i++){
         this.addTile(0, i, 21);
      }
      for(let i = 12; i <= 16; i++){
         this.addTile(0, i, 20);
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
            tile.display(pixelGrid, images);
         });
      });
      this.player.display();
      main.graphics.staticImage("Foreground", 0, 0, 128, 72);
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
   }

   addTile(num, x, y){ // Num, Tile coords
      if(this.tiles[y] == null){
         let row = [];
         row[x] = new Tile(num, x * 14, y * 14);
         this.tiles[y] = row;
      }else{
         this.tiles[y][x] = new Tile(num, x * 14, y * 14);
      }
   }

   getTile(x, y){ // Tile coords
      if(this.tiles[y] == null){
         return null;
      }else{
         return this.tiles[y][x];
      }
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
   }

   display(){
      main.graphics.image("GroundDice" + Math.floor(this.age) + "," + this.num, this.x, this.y, this.s, this.s);
   }

   update(deltaTime){
      if(this.num > 0 && this.age < 6){
         this.age += deltaTime;
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