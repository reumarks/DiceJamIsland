class Main {
   constructor(){
      // Create canvas
      createCanvas(1280, 720);

      // Configure canvas
      document.querySelector("canvas").getContext("2d").imageSmoothingEnabled = false;
      noStroke();
      frameRate(0);

      // Create pixel grid
      this.pixelGrid = createGraphics(128, 72);
      this.pixelGrid.noStroke();

      // Track update times
      this.now = 0;
      this.lastUpdate = Date.now();
      this.deltaTime = 0;
      
      // Load images
      this.images = {};
      this.loadImages();

      // Create scene
      this.game = new Game();
   }

   loadImages() {
      let imagePaths = [
         // [Image name, Image Path]
         ["Background", "images/Background.png"]
      ];

      let spriteSheetsPaths = [
         // [Sprite Name (without index), Sprite Sheet Path, X, Y, Width, Height, Num]
         ["Frog", "images/FrogSheet.png", 0, 0, 7, 7, 3],
         ["Dice", "images/DiceSheet.png", 0, 0, 7, 7, 6],
         ["GroundDice0-", "images/GroundSheet.png", 0, 0, 14, 14, 7],
         ["GroundDice1-", "images/GroundSheet.png", 0, 14, 14, 14, 7],
         ["GroundDice2-", "images/GroundSheet.png", 0, 28, 14, 14, 7],
         ["GroundDice3-", "images/GroundSheet.png", 0, 42, 14, 14, 7],
         ["GroundDice4-", "images/GroundSheet.png", 0, 56, 14, 14, 7],
         ["GroundDice5-", "images/GroundSheet.png", 0, 70, 14, 14, 7],
         ["GroundDice6-", "images/GroundSheet.png", 0, 84, 14, 14, 7],
      ];

      imagePaths.forEach((item, index) => {
         this.images[item[0]] = loadImage(item[1]); 
      });

      spriteSheetsPaths.forEach((item) => {
         loadImage(item[1], img => {
            for(let i = 0; i < item[6]; i++){
               this.images[item[0] + i] = img.get(item[2] + (item[4] * i), item[3], item[4], item[5]);
            }
         });
      });
   }

   setDeltaTime(){
      // Update deltaTime
      this.now = Date.now();
      this.deltaTime = this.now - this.lastUpdate;
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
      text((1000/this.deltaTime).toFixed(1) + " fps", 5, 15);
   }
   
   display(){
      // Display scene to pixel grid
      this.game.display(this.pixelGrid, this.images);

      // Display pixel grid
      image(this.pixelGrid, 0, 0, 1280, 720);

      // Display debug
      if(this.debug){
         displayDebug();
      }
   }
}