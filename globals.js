let keys = [];
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const WIDTH = 128;
const HEIGHT = 72;

keyPressed = () => {
   keys[keyCode] = true;
}

keyReleased = () => {
   keys[keyCode] = false;
}