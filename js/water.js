class Water{
   constructor(level){
      this.level = level;
      this.virtualLevel = 0;
      this.time = 0;
   }

   update(){
      this.time += deltaTime;
      this.level -= deltaTime/3;
      this.virtualLevel = Math.floor(this.level + Math.PI/2 - Math.sin(this.time * 3) * 2);
   }

   display(){
      for(let i = 0; i < 2; i++){
         main.graphics.staticImage(
            "Water", 
            Math.floor(main.game.camX) % 9 - 12 - Math.floor(Math.cos(this.time * 3) * 4) + i * 85, 
            Math.floor(main.game.camY) + Math.floor(this.level + Math.PI/2 - Math.sin(this.time * 3) * 2), 
            85, 
            41
         );
      }
   }
}