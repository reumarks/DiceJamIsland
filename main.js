createCanvas(640, 360);
cn = createGraphics(64, 36);
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
cn.noStroke();
noStroke();
frameRate(0);
let lastUpdate = Date.now();

draw = () => {
   var now = Date.now();
   var dt = now - lastUpdate;
   lastUpdate = now;

   game();

   image(cn, 0, 0, 640, 360);

   fill(255, 255, 255);
   rect(0, 0, 60, 20);
   fill(0, 0, 0);
   text((1000/dt).toFixed(1) + " fps", 5, 15);
}