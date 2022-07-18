class Main {
   constructor(){
      // Create canvas
      this.state = "playing";
      let clarity = 10;
      let unitSize = window.innerWidth / WIDTH < window.innerHeight / HEIGHT ? window.innerWidth / (WIDTH * clarity) : window.innerHeight / (HEIGHT * clarity);
      createCanvas(unitSize * WIDTH * clarity, unitSize * HEIGHT * clarity);
      window.addEventListener('resize', this.resizeCanvas, false);
      
      // Configure canvas
      this.canvas = document.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d")
      this.ctx.imageSmoothingEnabled = false;
      this.canvas.tabIndex = "1";
      this.canvas.addEventListener('keydown', function(e){
         var thisKeycode;
         if (window.event){
            thisKeycode = window.event.keyCode;
         }
         keys[thisKeycode] = true;
         e.preventDefault();
         return false;
      });
      this.canvas.addEventListener('keyup', function(e){
         var thisKeycode;
         if (window.event){
            thisKeycode = window.event.keyCode;
         }
         keys[thisKeycode] = false;
         e.preventDefault();
         return false;
      });
      noStroke();
      frameRate(FRAME_RATE);

      // Track update times
      this.now = 0;
      this.lastUpdate = Date.now();
      
      // Load images
      this.graphics = new Graphics(this.pixelGrid);

      // Create scene
      this.game = new Game();

      // Debug mode
      this.debug = false;

      this.highscore = 0;
   }
   
   setDeltaTime(){
      // Update deltaTime
      this.now = Date.now();
      deltaTime = (this.now - this.lastUpdate) / 1000;
      if(deltaTime > 0.033){
         deltaTime = 0.033;
      }
      this.lastUpdate = this.now;
   }

   update(){
      // Update deltaTime
      this.setDeltaTime();

      // Update scene
      this.game.update();
   }

   displayDebug(){
      fill(255, 255, 255);
      rect(0, 0, 60, 20);
      fill(0, 0, 0);
      text((1/deltaTime).toFixed(1) + " fps", 5, 15);
   }
   
   display(){
      // Display scene to pixel grid
      this.game.display();

      if(keys[82]){
         this.game = new Game();
      }

      // Display pixel grid
      image(this.graphics.pixelGrid, 0, 0, width, height);

      // Display debug
      if(this.debug){
         this.displayDebug();
      }
   }
}