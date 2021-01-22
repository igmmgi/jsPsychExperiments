// jsPsych with p5js canvas
// Examples taken from https://p5js.org/examples/

const s = (p5js) => {
  p5js.setup = function () {};
};
let p5js = new p5(s); // invoke p5

let img = p5js.loadImage('jspsych-logo.jpeg');

function draw1() {
  let gridSize = 100;
  for (let x = gridSize; x <= p5js.width - gridSize; x += gridSize) {
    for (let y = gridSize; y <= p5js.height - gridSize; y += gridSize) {
      p5js.rect(x - 1, y - 1, 2, 2);
      p5js.stroke(p5js.random(0, 255), p5js.random(0, 255), p5js.random(0, 255));
      p5js.line(x, y, p5js.width / 2, p5js.height / 2);
    }
  }
}

function draw2() {
  p5js.fill(0);
  p5js.ellipse(p5js.mouseX, p5js.mouseY, 50, 50);
  if (p5js.mouseIsPressed) {
    p5js.clear();
  }
}

function draw3() {
  p5js.background(255);
  p5js.stroke(0);
  p5js.strokeWeight(5);
  p5js.line(p5js.mouseX, 0, p5js.mouseX, 960);
  p5js.line(0, p5js.mouseY, 1280, p5js.mouseY);
}

function draw4() {
  p5js.background(255);
  let locX = p5js.mouseX - p5js.height / 2;
  let locY = p5js.mouseY - p5js.width / 2;
  p5js.ambientLight(50);
  p5js.directionalLight(255, 0, 0, 0.25, 0.25, 0);
  p5js.pointLight(0, 0, 255, locX, locY, 250);
  p5js.push();
  p5js.translate(-p5js.width / 8, 0, 0);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.specularMaterial(250);
  p5js.box(100, 100, 100);
  p5js.pop();
  p5js.translate(p5js.width / 8, 0, 0);
  p5js.ambientMaterial(250);
  p5js.sphere(120, 64);
}

function draw5() {
  p5js.background(255);
  p5js.rotateX(p5js.frameCount * 0.05);
  p5js.rotateY(p5js.frameCount * 0.05);
  p5js.torus(100, 20);
}

function draw6() {
  p5js.background(255);

  p5js.push();
  p5js.translate(-200, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.plane(70);
  p5js.pop();

  p5js.push();
  p5js.translate(0, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.box(70, 70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(200, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.cylinder(70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(-200, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.cone(70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(0, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.torus(70, 20);
  p5js.pop();

  p5js.push();
  p5js.translate(200, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.02);
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.sphere(70);
  p5js.pop();
}

function star(x, y, radius1, radius2, npoints) {
  let angle = p5js.TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  p5js.beginShape();
  for (let a = 0; a < p5js.TWO_PI; a += angle) {
    let sx = x + p5js.cos(a) * radius2;
    let sy = y + p5js.sin(a) * radius2;
    p5js.vertex(sx, sy);
    sx = x + p5js.cos(a + halfAngle) * radius1;
    sy = y + p5js.sin(a + halfAngle) * radius1;
    p5js.vertex(sx, sy);
  }
  p5js.endShape(p5js.CLOSE);
}

const draw_calls = [draw1, draw2, draw3, draw4, draw5, draw6];
const use_webgl = [false, false, false, true, true, true];

let exp = [];
for (let i = 0; i < draw_calls.length; i++) {
  exp.push({
    type: 'p5js-canvas-keyboard-response',
    canvas_size: [1280, 960],
    draw: function () {
      return draw_calls[i];
    },
    stimulus_duration: 10000,
    trial_duration: 10000,
    response_ends_trial: true,
    webgl: use_webgl[i],
  });
}

jsPsych.init({
  timeline: exp,
});
