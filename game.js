function game(){
   cn.image(images["Background"], 0, 0, 64, 36);
   for(var i = 0; i < 6; i ++){
      cn.image(images["Dice" + i], 2 + i * 9, 2, 7, 7);
   }
}