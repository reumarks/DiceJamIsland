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
      this.currentRoll = 0;
      this.waitForRoll = 1;
      this.inWater = false;
      this.swimTime = 0;
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

      if(this.rolling){
         main.graphics.image("RollingDice" + this.currentRoll, this.x, this.y - 8, 8, 8);
      }
   }

   update(deltaTime){
      // General Player Management
      if(main.game.virtualWaterLevel){
         if(this.y > main.game.virtualWaterLevel - 5){
            //this.y = main.game.virtualWaterLevel - 2;
            this.sy = 30 + (main.game.virtualWaterLevel - 4 - this.y) * 10;
            this.ay = 0;
            this.inWater = true;
            this.swimTime += 4 * deltaTime;
         }else{
            this.swimTime = 0;
            this.inWater = false;
         }
      }
      this.time += 5 * deltaTime;
      this.time %= 100;

      
      // Air, water resistance and gravity
      if(!this.inWater){
         this.ay = 300;
         this.sy *= 0.998;
      }else{
         this.sy *= 0.998;
      }

      // Jump calc
      if(this.standingOn && !this.inWater){
         this.sy = 0;
         this.ay = 0;
         this.ax = 0;
         this.lastGrounded = 0;
         this.standingTime += 1 * deltaTime;
         this.hop = false;
      }else{
         this.lastGrounded += 1 * deltaTime;
         this.standingTime = 0;
      }

      // Controls
      if(!this.inWater){
         if((keys[RIGHT] && keys[LEFT]) || (!keys[LEFT] && !keys[RIGHT]) || keys[DOWN]){
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
      }else{
         if((keys[RIGHT] && keys[LEFT]) || (!keys[LEFT] && !keys[RIGHT]) || this.swimTime < 1){
            this.sx *= 0.89;
         }else{
            if(keys[UP] || keys[32]){
               this.sy = -110;
            }else{
               this.sy = -70;
            }
            if(keys[RIGHT]){
               this.sx = 30;
            }else{
               this.sx = -30;
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
      
      if((this.standingTime > 0.1 || !this.standingOn) && !(this.tRight && this.sx > 0) && !(this.tLeft && this.sx < 0)){
         this.x += this.sx * deltaTime;
      }

      this.y += this.sy * deltaTime;

      // Plant
      if(keys[DOWN] && this.standingOn){
         if(this.standingOn.action == "roll"){
            this.rolling = true;
         }
         if(this.standingOn.action == "pick"){
            main.game.berries += this.standingOn.num;
            this.standingOn.picked = true;
         }
      }
      if(this.rolling){
         this.waitForRoll += 25 * deltaTime;
         if(this.waitForRoll > 1){
            this.currentRoll ++;
            this.currentRoll %= 5;
            this.waitForRoll = 0;
         }
         if(!keys[DOWN]){
            this.rolling = false;
            this.currentRoll = 0;
            main.game.seedDice.push(
               new SeedDice(
                  Math.round(Math.random() * 5),
                  this.x,
                  this.y - 10,
                  this.standingOn
               )
            );
         }
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
         1, this.h + Math.max(this.sy * deltaTime,  1),
         this.w - 1, this.h + Math.max(this.sy * deltaTime,  1)
      );
      if(this.tDown[0] && this.tDown[1]){
         this.standingOn = ((Math.abs((this.tDown[0].x + 14/2) - (Math.floor(this.x) + (this.direction == 0 ? -2 : 2) + 7/2)) < Math.abs((this.tDown[1].x + 14/2) - (Math.floor(this.x) + (this.direction == 0 ? -2 : 2) + 7/2))) ? this.tDown[0] : this.tDown[1]);
      }else{
         this.standingOn = this.tDown[0] ? this.tDown[0] : this.tDown[1] ? this.tDown[1] : false;
      }
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

class SeedDice {
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
         main.graphics.image("Dice" + this.num, Math.floor(this.x), Math.floor(this.y), 7, 7);
      }
   }

   update(deltaTime, index){
      this.time += 5 * deltaTime;
      if(this.time > 1){
         this.x = lerp(this.startX, this.tile.x + 7, (this.time - 1) * 2);
         this.y = lerp(this.startY, this.tile.y + 7, (this.time - 1) * 2);
      }
      if(this.time >= 1.5){
         this.tile.num = this.num + 1;
         this.tile.age = 0;
         main.game.seedDice.pop(index);
      }
   }
}