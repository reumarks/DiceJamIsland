const spriteInfo = [
   ["Background"],
   ["Cloud"],
   ["Water"],
   ["JamStand"],
   ["IconSheet", 0, 0, 6, 7, 6],
   ["FrogSheet", 0, 0, 7, 7, 8, 2],
   ["DiceSheet", 0, 0, 5, 5, 6],
   ["DiceRollSheet", 0, 0, 8, 8, 5],
   ["NumberSheet", 0, 0, 4, 6, 10],
   ["TilePlantSheet", 0, 0, TILE_SIZE, TILE_SIZE, 6, 7],
   ["TileRootSheet", 0, 0, TILE_SIZE, TILE_SIZE, 7, 5],
   ["TileSeedSheet", 0, 0, TILE_SIZE, TILE_SIZE, 6, 7],
];

class Graphics {
   constructor(){
      // Settings
      this.imageFolderPath = "images/";
      this.imageExtension = ".png";
      this.pixelGrid = createGraphics(128, 72);
      
      // Load Images
      this.images = {};
      this.loadImages();
   }

   loadImages() {
      spriteInfo.forEach((info) => {
         if(info[1] == null){
            this.images[info[0]] = loadImage(this.imageFolderPath + info[0] + this.imageExtension); 
         }else{
            loadImage(this.imageFolderPath + info[0] + this.imageExtension, img => {
               for(let j = 0; j < (info[6] != null ? info[6] : 1); j++){
                  for(let i = 0; i < info[5]; i++){
                     this.images[(info[0] + i.toString() + "," + j.toString())] = img.get(info[1] + (info[3] * i), info[2] + (info[4] * j), info[3], info[4]);
                  }
               }
            });
         }
      });
   }

   image(imageName, x, y, w, h){
      this.pixelGrid.image(this.images[imageName], (Math.floor(x) + Math.floor(main.game.camX)), (Math.floor(y) + Math.floor(main.game.camY)), w, h);
   }

   staticImage(imageName, x, y, w, h){
      this.pixelGrid.image(this.images[imageName], x, y, w, h);
   }
}