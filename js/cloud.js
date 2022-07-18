class Cloud{
   constructor(x, y){
      this.x = -75 + Math.random() * (WIDTH + 75);
      this.y = Math.random() * HEIGHT - 10;
      this.speed = 2 + Math.random() * 10;
   }

   display(){
      main.graphics.staticImage("Cloud", this.x, this.y, 75, 40);
   }

   update(){
      this.x += deltaTime * this.speed;
      if(this.x > WIDTH){
         this.x = -75;
         this.y = Math.random() * HEIGHT - 10;
         this.speed = 4 + Math.random() * 13;
      }
   }
}