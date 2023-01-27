// jsPsych with p5js canvas
// Examples taken from https://p5js.org/examples/

const p5js = new p5((sketch) => {
    sketch.setup = () => {};
});

// Pre-load?
let font = p5js.loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf");
let img = p5js.loadImage("jspsych-logo.jpeg");

p5js.mouseClicked = function () {
    if (p5js.isLooping()) {
        p5js.noLoop();
    } else {
        p5js.loop();
    }
};

p5js.keyPressed = function () {
    console.log(p5js.keyCode);
};

function draw_example1() {
    p5js.background(255);

    // frame counter
    p5js.textFont(font);
    p5js.textSize(30);
    p5js.fill(0, 0, 20);
    p5js.text(p5js.frameCount, -p5js.width / 2, -p5js.height / 2 + 30);

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

// function draw_example2() {
//     p5js.background(255, 255, 255);
//     p5js.translate(-p5js.width / 2, -p5js.height / 2 + 30); // origin at top left
//
//     // frame counter
//     p5js.textFont(font);
//     p5js.textSize(30);
//     p5js.fill(0, 0, 20);
//     p5js.text(p5js.frameCount, 0, 0);
//
//     p5js.textFont(font);
//     p5js.textSize(30);
//     p5js.fill(0, 0, 0);
//
//     p5js.push();
//     p5js.translate(p5js.width / 2, p5js.height / 2);
//     p5js.textAlign(p5js.CENTER, p5js.CENTER);
//     let s = "The quick brown fox jumped over the lazy dog.";
//     p5js.rotateY(p5js.frameCount * 0.02);
//     p5js.rotateX(p5js.frameCount * 0.03);
//     p5js.rotateZ(p5js.frameCount * 0.04);
//     p5js.text(s, 0, 0); // Text wraps within text box
//     p5js.pop();
// }

let exp = [];

const example1 = {
    type: "p5js-canvas-keyboard-response",
    canvas_size: [1280, 960],
    draw: function () {
        return draw_example1;
    },
    response_ends_trial: true,
};
exp.push(example1);

// const example2 = {
//     type: "p5js-canvas-keyboard-response",
//     canvas_size: [1280, 960],
//     draw: function () {
//         return draw_example2;
//     },
//     response_ends_trial: true,
// };
// exp.push(example2);

jsPsych.init({
    timeline: exp,
});
