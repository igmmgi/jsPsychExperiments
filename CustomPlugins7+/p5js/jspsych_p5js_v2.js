// jsPsych with p5js canvas
// Examples taken from https://p5js.org/examples/

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

// function calculate_coordinates(xvalues) {
//     let theta;
//     let amplitude;
//     let frequency;
//     let dy;
//     let nwaves = 1;
//     for (let n = 0; n < nwaves; n++) {
//         theta = 0;
//         amplitude = p5js.width / 4;
//         frequency = p5js.height / 4;
//         dy = p5js.TWO_PI / frequency;
//         for (let i = 0; i < xvalues.length; i++) {
//             xvalues[i] += p5js.sin(theta) * amplitude;
//             theta += dy;
//         }
//     }
//     return xvalues;
// }

// function calculate_coordinates(xvalues) {
//     let theta;
//     let amplitude;
//     let frequency;
//     let dy;
//     let nwaves = 20;
//     for (let n = 0; n < nwaves; n++) {
//         theta = 0;
//         amplitude = p5js.random([10, 20, 30, 40]);
//         frequency = p5js.random([200, 400, 600, 800]);
//         dy = p5js.TWO_PI / frequency;
//         for (let i = 0; i < xvalues.length; i++) {
//             xvalues[i] += p5js.sin(theta) * amplitude;
//             theta += dy;
//         }
//     }
//     return xvalues;
// }

// function draw_line(xvalues) {
//     //p5js.background(255);
//     p5js.fill(0);
//     p5js.strokeWeight(10);
//     for (let x = 1; x < xvalues.length; x++) {
//         p5js.line(p5js.width / 2 + xvalues[x - 1], x, p5js.width / 2 + xvalues[x], x);
//     }
// }

// function draw_line(xvalues) {
//     p5js.stroke(0);
//     p5js.strokeWeight(10);
//     for (let x = 1; x < xvalues.length; x++) {
//         p5js.line(p5js.width / 2 + xvalues[x - 1], x, p5js.width / 2 + xvalues[x], x);
//     }
// }

// let xvalues = new Array(960).fill(0);
// xvalues = calculate_coordinates(xvalues);

class Path {
    constructor() {
        this.xpos = new Array(960).fill(0);
        this.calculate_coordinates();
    }
    calculate_coordinates() {
        let theta;
        let amplitude;
        let frequency;
        let dy;
        let nwaves = 20;
        for (let n = 0; n < nwaves; n++) {
            theta = 0;
            amplitude = p5js.random([10, 20, 30, 40]);
            frequency = p5js.random([200, 400, 600, 800]);
            dy = p5js.TWO_PI / frequency;
            for (let i = 0; i < this.xpos.length; i++) {
                this.xpos[i] += p5js.sin(theta) * amplitude;
                theta += dy;
            }
        }
    }
    draw() {
        p5js.stroke(0);
        p5js.strokeWeight(10);
        for (let x = 1; x < this.xpos.length; x++) {
            p5js.line(p5js.width / 2 + this.xpos[x - 1], x, p5js.width / 2 + this.xpos[x], x);
        }
    }
}

class Ball {
    constructor(xpos, ypos) {
        this.diameter = 50;
        this.speed = 5;
        this.x = xpos;
        this.y = ypos - this.diameter / 2;
    }
    move() {
        if (p5js.keyIsDown(p5js.LEFT_ARROW)) {
            this.x -= 10;
        }
        if (p5js.keyIsDown(p5js.RIGHT_ARROW)) {
            this.x += 10;
        }
        this.y -= this.speed;
        if (this.y < 0) {
            this.y = 960 - this.diameter / 2;
        }
    }
    draw() {
        p5js.stroke(255, 0, 0);
        p5js.fill(255, 0, 0);
        p5js.circle(this.x, this.y, this.diameter);
    }
}

const ball = new Ball(1280 / 2, 960);
const path = new Path();

function draw6() {
    p5js.background(255);
    ball.move();
    ball.draw();
    path.draw();
}

//const draw_calls = [draw1, draw2, draw3, draw4, draw5];
const draw_calls = [draw6];

let exp = [];
for (let i = 0; i < draw_calls.length; i++) {
    const tmp = {
        type: jsPsychP5JSKeyboardResponse,
        canvas_size: [1280, 960],
        canvas_background: 255,
        draw: function () {
            return draw_calls[i];
        },
        response_ends_trial: true,
    };
    exp.push(tmp);
}

jsPsych.run(exp);
