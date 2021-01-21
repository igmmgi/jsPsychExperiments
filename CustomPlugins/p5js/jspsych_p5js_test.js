// jsPsych Template
// Start jsPsych, show "Hello, jsPsych", and wait for key press

// p.draw = function() {
//     p.background(255, 255, 255);
//     p.rotateX(p.frameCount * 0.01);
//     p.rotateY(p.frameCount * 0.01);
//     p.torus(100, 20);
//     p.noLoop();
// }

const s = p5js => {
    p5js.setup = function() {};
};
let p5js = new p5(s); // invoke p5

p5js.draw = function() {
  p5js.background(0);
    p5js.stroke(255);
    p5js.noFill();
  for (let i = 0; i < 200; i += 20) {
    p5js.bezier(
      p5js.mouseX - i / 2.0,
      40 + i,
      410,
      20,
      440,
      300,
      240 - i / 16.0,
      300 + i / 8.0
    );
  }
}

// p5js.draw = function() {
//     p5js.background(244, 248, 252);
//     p5js.line(p5js.mouseX, 0, p5js.mouseX, 800);
// }


// p.draw = function() {
//     p.background(255);
//     let locX = p.mouseX - p.height / 2;
//     let locY = p.mouseY - p.width / 2;
//     p.ambientLight(50);
//     p.directionalLight(255, 0, 0, 0.25, 0.25, 0);
//     p.pointLight(0, 0, 255, locX, locY, 250);
//     p.push();
//     p.translate(-p.width / 4, 0, 0);
//     p.rotateZ(p.frameCount * 0.02);
//     p.rotateX(p.frameCount * 0.02);
//     p.specularMaterial(250);
//     p.box(100, 100, 100);
//     p.pop();
//     p.translate(p.width / 4, 0, 0);
//     p.ambientMaterial(250);
//     p.sphere(120, 64);
// }

const p5js_test = {
  type: "p5js-canvas-keyboard-response",
};

jsPsych.init({
  timeline: [p5js_test],
});


