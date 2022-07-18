let keys = [];
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const WIDTH = 128;
const HEIGHT = 72;
const TILE_SIZE = 14;
const FRAME_RATE = 60;

let deltaTime = 0;

function lerp(a, b, t) {
   return (1 - t) * a + t * b;
}