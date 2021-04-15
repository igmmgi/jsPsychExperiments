// jsPsych with p5js canvas
// Examples taken from https://p5js.org/examples/

const s = (p5js) => {
  p5js.setup = function () {};
};
let p5js = new p5(s); // invoke p5

// Pre-load?
let font = p5js.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
let img = p5js.loadImage('jspsych-logo.jpeg');

function draw1() {
  p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
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
  p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
  p5js.fill(p5js.random(0, 255), p5js.random(0, 255), p5js.random(0, 255));
  p5js.ellipse(p5js.mouseX, p5js.mouseY, 25, 25);
  if (p5js.mouseIsPressed) {
    p5js.clear();
  }
}

function draw3() {
  p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
  // p5js.background(255);
  p5js.stroke(0);
  p5js.strokeWeight(5);
  p5js.line(p5js.mouseX, 0, p5js.mouseX, 960);
  p5js.line(0, p5js.mouseY, 1280, p5js.mouseY);
}

function draw4() {
  p5js.background(255);
  let locX = p5js.mouseX - p5js.height / 2;
  let locY = p5js.mouseY - p5js.width / 2;
  p5js.ambientLight(25);
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
  p5js.rotateY(p5js.frameCount * 0.1);
  p5js.torus(100, 20);
}

function draw6() {
  p5js.background(255);

  p5js.push();
  p5js.translate(-200, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.plane(70);
  p5js.pop();

  p5js.push();
  p5js.translate(0, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.box(70, 70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(200, -100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.cylinder(70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(-200, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.cone(70, 70);
  p5js.pop();

  p5js.push();
  p5js.translate(0, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.torus(70, 20);
  p5js.pop();

  p5js.push();
  p5js.translate(200, 100, 0);
  p5js.texture(img);
  p5js.rotateZ(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateY(p5js.frameCount * 0.04);
  p5js.sphere(70);
  p5js.pop();
}

let rSlider;
let gSlider;
let bSlider;

function draw7() {
  // create sliders
  p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
  const r = rSlider.value();
  const g = gSlider.value();
  const b = bSlider.value();
  p5js.background(r, g, b);
  p5js.textFont(font);
  p5js.textSize(15);
  p5js.text('red', 180, 25);
  p5js.text('green', 180, 55);
  p5js.text('blue', 180, 85);

  p5js.push();
  p5js.translate(p5js.width / 2, p5js.height / 2);
  p5js.textAlign(p5js.CENTER, p5js.CENTER);
  let s = 'The quick brown fox jumped over the lazy dog.';
  p5js.rotateY(p5js.frameCount * 0.02);
  p5js.rotateX(p5js.frameCount * 0.03);
  p5js.rotateZ(p5js.frameCount * 0.04);
  p5js.textSize(36);
  p5js.text(s, 0, 0); // Text wraps within text box
  p5js.pop();
}

const draw_calls = [draw1, draw2, draw3, draw4, draw5, draw6, draw7];

function setup1() {
  'use strict';
  let offsetTop = document.getElementById('p5js_container').offsetTop;
  let offsetLeft = document.getElementById('p5js_container').offsetLeft;

  // create sliders
  rSlider = p5js.createSlider(0, 255, 100);
  rSlider.position(offsetLeft + 20, offsetTop + 20);
  gSlider = p5js.createSlider(0, 255, 0);
  gSlider.position(offsetLeft + 20, offsetTop + 50);
  bSlider = p5js.createSlider(0, 255, 255);
  bSlider.position(offsetLeft + 20, offsetTop + 80);
}

let exp = [];
for (let i = 0; i < draw_calls.length; i++) {
  const tmp = {
    type: 'p5js-canvas-keyboard-response',
    canvas_size: [1280, 960],
    draw: function () {
      return draw_calls[i];
    },
    response_ends_trial: true,
  };
  if (i === 6) {
    tmp.setup = function () {
      return setup1;
    };
  }
  exp.push(tmp);
}

jsPsych.init({
  timeline: exp,
});
