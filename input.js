class Input{
   constructor() {
      this.kp = []; // Keys Pressed [bool array indexed by keyCode]
      this.kh = [];  // Keys Held [bool array indexed by keyCode]
      this.kr = []; // Keys Released [bool array indexed by keyCode]
      this.mp = false; // Mouse Pressed [bool]
      this.mr = false; // Mouse Released [bool]
      this.mh = false; // Mouse Held [bool]
   }
   
   getKeyCode = char => {
      var k = char.charCodeAt(0);
      return k > 90 ? k - 32 : k;
   }
   
   Refresh = () => {
      this.mp = false;
      this.mr = false;
      this.kp = [];
      this.kr = [];
   }
}

keyPressed = () => {
   Input.kp[keyCode] = true;
   Input.kh[keyCode] = true;
}

keyReleased = () => {
   Input.kr[keyCode] = true;
   Input.kh[keyCode] = false;
}

mousePressed = () => {
   Input.mp = true;
   Input.mh = true;
}

mouseReleased = () => {
   Input.mr = true;
   Input.mh = false;
}