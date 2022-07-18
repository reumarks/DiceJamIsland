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
      this.currentAction = "none";
      this.berryCount = 0;
      this.waterCount = 3;
   }
   
   display(){
      if(keys[RIGHT]){
         this.direction = 1;
      }else if(keys[LEFT]){
         this.direction = 0;
      }
      if(this.standingOn && !this.inWater){
         if((this.standingTime < 0.1) || keys[DOWN]){
            this.sprite = 1;
         }else{
            if(this.time % 15 > 0 && this.time % 15 < 0.5){
               this.sprite = 3;
            }else{
               this.sprite = 0;
            }
         }
      }else{
         this.sprite = 2;
      }

      main.graphics.image("FrogSheet" + this.sprite + "," + this.direction, this.x, this.y, 7, 7);

      if(this.currentAction == "roll"){
         main.graphics.image("DiceRollSheet" + this.currentRoll + "," + "0", this.x + 1, this.y - 6, 5, 5);
      }
   }

   update(){
      if(main.game.water.virtualLevel){
         if(this.y > main.game.water.virtualLevel - 5){
            this.ay = 300 - Math.abs(Math.pow(main.game.water.virtualLevel - this.y - 18, 2));
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
         this.sy *= Math.pow(0.998, deltaTime * FRAME_RATE);
         this.waterCount = Math.floor(this.waterCount);
      }else{
         if(this.sy > 0){
            this.sy *= Math.pow(0.98, deltaTime * FRAME_RATE);
         }else{
            this.sy *= Math.pow(0.89, deltaTime * FRAME_RATE)
         }
         if(this.waterCount < 3){
            this.waterCount += 5 * deltaTime;
         }
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
         this.hop = false;
      }

      // Controls
      if(!this.inWater){
         if((keys[RIGHT] && keys[LEFT]) || (!keys[LEFT] && !keys[RIGHT]) || keys[DOWN]){
            this.sx *= Math.pow(0.7, deltaTime * FRAME_RATE);
         }else{ 
            this.sx *= Math.pow(0.999, deltaTime * FRAME_RATE);
            if(this.standingTime > 0.1 && !this.hop){
               if(keys[UP] || keys[32]){
                  this.sy = -90;
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
            this.sx *= Math.pow(0.89, deltaTime * FRAME_RATE)
         }else{
            if(keys[UP] || keys[32]){
               this.sy = -110;
            }
            if(keys[RIGHT]){
               this.sx = 30;
            }else{
               this.sx = -30;
            }
         }
      }

      this.sy += this.ay * deltaTime;

      this.checkCollisions();

      if(this.tDown && this.sy >= 0){
         this.sy = 0;
         this.ay = 0;
         this.y = this.tDown[0].y - this.h;
      }
      if(this.tRight && this.sx >= 0){
         this.x = this.tRight[0].x - this.w;
      }else if(this.tLeft && this.sx <= 0){
         this.x = this.tLeft[0].x + TILE_SIZE;
      }
      
      if((this.standingTime > 0.1 || !this.standingOn || this.inWater) && !(this.tRight && this.sx > 0) && !(this.tLeft && this.sx < 0)){
         this.x += this.sx * deltaTime;
      }

      this.y += this.sy * deltaTime;

      if(keys[DOWN] && this.standingOn && Math.abs(this.x - main.game.jamStandX) < 6){
         console.log("You win");
      }else if(keys[DOWN] && this.standingOn && this.currentAction == "none" && !this.inWater){
         if(this.standingOn.action == "roll" && this.berryCount > 0){
            this.berryCount --;
            this.currentAction = this.standingOn.action;
         }
         if(this.standingOn.action == "pick"){
            main.game.started = true;
            this.berryCount += this.standingOn.num;
            this.standingOn.picked = true;
            this.currentAction = this.standingOn.action;
         }
         if(this.standingOn.action == "water" && !this.inWater){
            if(this.waterCount > 0){
               this.standingOn.water ++;
               this.waterCount --;
               this.currentAction = this.standingOn.action;
            }
         }
      }

      if(this.currentAction == "roll"){
         this.waitForRoll += 25 * deltaTime;
         if(this.waitForRoll > 1){
            this.currentRoll ++;
            this.currentRoll %= 5;
            this.waitForRoll = 0;
         }
         if(this.inWater){
            this.action = "none";
            this.currentRoll = 0;
         }else if(!keys[DOWN]){
            this.standingOn.chosen = true,
            this.currentRoll = 0;
            main.game.dice.push(new Dice(Math.round(Math.random() * 5), this.x + 1, this.y - 9, this.standingOn));
         }
      }

      if(this.currentAction != "none" && !keys[DOWN]){
         this.currentAction = "none";
      }

      this.cameraFollow();
   }
   
   checkCollisions(){
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
         this.standingOn = ((Math.abs((this.tDown[0].x + TILE_SIZE/2) - (Math.floor(this.x) + (this.direction == 0 ? -2 : 2) + 7/2)) < Math.abs((this.tDown[1].x + TILE_SIZE/2) - (Math.floor(this.x) + (this.direction == 0 ? -2 : 2) + 7/2))) ? this.tDown[0] : this.tDown[1]);
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
      main.game.camX = -floor(this.x) +  WIDTH / 2;
      if(main.game.camX > 2 * TILE_SIZE){
         main.game.camX = 2 * TILE_SIZE;
      }
      if(main.game.camX < -main.game.jamStandX + WIDTH - 2 * TILE_SIZE){
         main.game.camX = -main.game.jamStandX + WIDTH - 2 * TILE_SIZE;
      }
      main.game.camY = -floor(this.y) +  HEIGHT / 2;
   }
}