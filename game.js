class Game {
   constructor(){
      const r = 4;
      const c = 3;
      this.tiles = [];
      this.worldGen();
      this.player = new Player(14 * 15, - 30);
   };

   worldGen(){
      for(let i = 10; i <= 20; i++){
         this.addTile(Math.round(Math.random() * 6), i, 21);
      }
      for(let i = 12; i <= 16; i++){
         this.addTile(Math.round(Math.random() * 6), i, 20);
      }
   }

   display(pixelGrid, images){
      main.graphics.staticImage("Background", 0, 0, 128, 72);
      this.tiles.forEach((row) => {
         row.forEach((tile) => {
            tile.display(pixelGrid, images);
         });
      });
      this.player.display();
   }

   update(deltaTime){
      this.player.update(deltaTime);
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
      main.graphics.image("GroundDice" + this.age + "," + this.num, this.x, this.y, this.s, this.s);
   }
}

class Player {
   constructor(x, y){
      this.x = x;
      this.y = y;
      this.w = 7;
      this.h = 7;
      this.sx = 0;
      this.sy = 0;
      this.ax = 0;
      this.ay = 0;
      this.tDown = [];
      this.tRight = [];
      this.tLeft = [];
      this.tUp = [];
      this.standingOn = null;
      this.lastGrounded = 0;
      this.standingTime = 0;
      this.hop = false;
      this.direction = 0; // 0 left, 1 right
      this.sprite = 0;
      this.time = 0;
   }
   
   display(){
      if(keys[RIGHT]){
         this.direction = 1;
      }else if(keys[LEFT]){
         this.direction = 0;
      }
      if(this.standingOn){
         if(this.standingTime < 0.1 || keys[DOWN]){
            this.sprite = 1;
         }else{
            if(this.time % 15 > 0 && this.time % 15 < 0.5){
               this.sprite = 4;
            }else{
               this.sprite = 0;
            }
         }
      }else{
         this.sprite = 2;
      }
      main.graphics.image("Frog" + (this.sprite + this.direction * 5).toString(), this.x, this.y, 7, 7);
   }

   update(deltaTime){
      // General Time
      this.time += 5 * deltaTime;
      this.time %= 100;

      // Jump calc
      if(this.standingOn){
         this.sy = 0;
         this.lastGrounded = 0;
         this.standingTime += 1 * deltaTime;
         this.hop = false;
      }else{
         this.lastGrounded += 1 * deltaTime;
         this.standingTime = 0;
      }

      // Air resistance and gravity
      this.ay = 300;
      this.sy *= 0.998;

      // Controls
      if((keys[RIGHT] && keys[LEFT]) || (!keys[LEFT] && !keys[RIGHT])){
         this.ax = 0;
         this.sx *= 0.70;
      }else{ 
         this.sx *= 0.999;
         if(this.standingTime > 0.1 && !this.hop){
            if(keys[UP] || keys[32]){
               this.sy = -120;
            }else{
               this.sy = -40;
            }
            this.hop = true;
            if(keys[RIGHT]){
               this.sx = 50;
            }else{
               this.sx = -50;
            }
         }
      }

      this.sy += this.ay * deltaTime;

      this.checkCollisions(deltaTime);

      if(this.tDown && this.sy >= 0){
         this.sy = 0;
         this.ay = 0;
         this.y = this.tDown[0].y - this.h;
      }
      if(this.tRight && this.sx >= 0){
         this.x = this.tRight[0].x - this.w;
      }else if(this.tLeft && this.sx <= 0){
         this.x = this.tLeft[0].x + 14;
      }
      
      if((this.standingTime > 0.1 || !this.standingOn) && !this.tRight && !this.tLeft){
         this.x += this.sx * deltaTime;
      }
      this.y += this.sy * deltaTime;

      // Plant
      if(keys[DOWN] && this.standingOn){
         this.standingOn.age += 1;
         this.standingOn.age = this.standingOn.age % 6;
      }

      this.cameraFollow();
   }
   
   checkCollisions(deltaTime){
      this.tRight = this.checkCollision(
         this.w + Math.max(this.sx * deltaTime,  1), 0.1,
         this.w + Math.max(this.sx * deltaTime,  1), this.h - 0.1
      );
      this.tLeft = this.checkCollision(
         Math.min(this.sx * deltaTime,  -1), 0.1,
         Math.min(this.sx * deltaTime,  -1), this.h - 0.1
      );
      this.tDown = this.checkCollision(
         0.1, this.h + Math.max(this.sy * deltaTime,  1),
         this.w - 0.1, this.h + Math.max(this.sy * deltaTime,  1)
      );
      if(this.tDown[0] && this.tDown[1]){
         this.standingOn = ((Math.abs((this.tDown[0].x + 14/2) - (this.x + 7/2)) < Math.abs((this.tDown[1].x + 14/2) - (this.x + 7/2))) ? this.tDown[0] : this.tDown[1]);
      }else{
         this.standingOn = this.tDown[0] ? this.tDown[0] : this.tDown[1] ? this.tDown[1] : false;
      }
      //this.tUp = this.checkCollision(
      //   0.1, Math.min(this.sy * deltaTime,  -1),
      //   this.w - 0.1, Math.min(this.sy * deltaTime,  -1)
      //);
   }

   checkCollision(x1, y1, x2, y2){
      let output = [];
      let hit1 = main.game.pixelHitTile(this.x + x1, this.y + y1);
      if(hit1){
         output.push(hit1);
      }
      let hit2 = main.game.pixelHitTile(this.x + x2, this.y + y2);
      if(hit2){
         output.push(hit2);
      }
      if(!hit1 && !hit2){
         return false;
      }
      return output;
   }

   cameraFollow(){
      //main.graphics.camX = lerp(main.graphics.camX, WIDTH / 2 - this.x, (1 - 0.5^(deltaTime)));
      //main.graphics.camY = lerp(main.graphics.camY, HEIGHT / 2 - this.y, (1 - 0.5^(deltaTime)));
      main.graphics.camX = -floor(this.x) +  WIDTH / 2;
      main.graphics.camY = -floor(this.y) +  HEIGHT / 2;
   }
}