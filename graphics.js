class Graphics {
   constructor(){
      // Create pixel grid
      this.pixelGrid = createGraphics(128, 72);
      this.pixelGrid.noStroke();
      this.images = {};
      this.loadImages();
      this.camX = 0;
      this.camY = 0;
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

   image(imageName, x, y, w, h){
      this.pixelGrid.image(this.images[imageName], (Math.floor(x) + Math.floor(this.camX)), (Math.floor(y) + Math.floor(this.camY)), w, h);
   }

   staticImage(imageName, x, y, w, h){
      this.pixelGrid.image(this.images[imageName], x, y, w, h);
   }
}