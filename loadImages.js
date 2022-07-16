let images = {};
function loadImages() {
   let imagePaths = [
      // [Image name, Image Path]
      ["Background", "images/Background.png"]
   ];
   let spriteSheetsPaths = [
      // [Sprite Name (without index), Sprite Sheet Path, X, Y, Width, Height, Num]
      ["Dice", "images/DiceSheet.png", 0, 0, 7, 7, 6]
   ];
   imagePaths.forEach((item, index) => {
      images[item[0]] = loadImage(item[1]); 
   });
   spriteSheetsPaths.forEach((item) => {
      loadImage(item[1], img => {
         for(let i = 0; i < item[6]; i++){
            images[item[0] + i] = img.get(item[2] + (item[4] * i), item[3], item[4], item[5]);
         }
      });
   });
}
loadImages();