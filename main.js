class Main {
   constructor(){
      // Create canvas
      let clarity = 10;
      let unitSize = window.innerWidth / WIDTH < window.innerHeight / HEIGHT ? window.innerWidth / (WIDTH * clarity) : window.innerHeight / (HEIGHT * clarity);
      createCanvas(unitSize * WIDTH * clarity, unitSize * HEIGHT * clarity);
      window.addEventListener('resize', this.resizeCanvas, false);
      
      // Configure canvas
      this.canvas = document.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d")
      this.ctx.imageSmoothingEnabled = false;
      noStroke();
      frameRate(0);

      // Track update times
      this.now = 0;
      this.lastUpdate = Date.now();
      this.deltaTime = 0;
      
      // Load images
      this.graphics = new Graphics(this.pixelGrid);

      // Create scene
      this.game = new Game();

      // Debug mode
      this.debug = true;
   }
   
   setDeltaTime(){
      // Update deltaTime
      this.now = Date.now();
      this.deltaTime = (this.now - this.lastUpdate) / 1000;
      this.lastUpdate = this.now;
   }

   update(){
      // Update deltaTime
      this.setDeltaTime();

      // Update scene
      this.game.update(this.deltaTime);
   }

   displayDebug(){
      fill(255, 255, 255);
      rect(0, 0, 60, 20);
      fill(0, 0, 0);
      text((1/this.deltaTime).toFixed(1) + " fps", 5, 15);
   }
   
   display(){
      // Display scene to pixel grid
      this.game.display();

      // Display pixel grid
      image(this.graphics.pixelGrid, 0, 0, width, height);

      // Display debug
      if(this.debug){
         this.displayDebug();
      }
   }
}