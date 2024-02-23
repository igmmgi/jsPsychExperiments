// jsPsych with p5js canvas
// Examples taken from https://p5js.org/examples/

const CANVAS_SIZE = [1280, 960];

const jsPsych = initJsPsych({
    override_safe_mode: true,
});

const p5js = new p5((sketch) => {
    sketch.setup = () => {};
});

// Pre-load?
let font = p5js.loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf");
let img = p5js.loadImage("jspsych-logo.jpeg");

function draw1() {
    p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
    let gridSize = 100;
    for (let x = gridSize; x <= p5js.width - gridSize; x += gridSize) {
        for (let y = gridSize; y <= p5js.height - gridSize; y += gridSize) {
            p5js.rect(x - 1, y - 1, 10, 10);
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
        p5js.background(255);
    }
}

function draw3() {
    p5js.translate(-p5js.width / 2, -p5js.height / 2); // origin at top left
    p5js.stroke(0);
    p5js.strokeWeight(5);
    p5js.line(p5js.mouseX, 0, p5js.mouseX, CANVAS_SIZE[1]);
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

const draw_calls = [draw1, draw2, draw3, draw4, draw5];

let exp = [];
for (let i = 0; i < draw_calls.length; i++) {
    const tmp = {
        type: jsPsychP5JSKeyboardResponse,
        canvas_size: CANVAS_SIZE,
        canvas_background: 200,
        draw: function () {
            return draw_calls[i];
        },
        response_ends_trial: true,
        use_webgl: true,
    };
    exp.push(tmp);
}

jsPsych.run(exp);
