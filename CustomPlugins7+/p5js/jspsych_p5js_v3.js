const CANVAS_SIZE = [1280, 960];

const jsPsych = initJsPsych({});

const p5js = new p5((sketch) => {
    sketch.setup = () => {};
});

class Path {
    constructor(noise) {
        this.xpos = new Array(CANVAS_SIZE[1]).fill(0);
        this.ypos = range(CANVAS_SIZE[1] - 100, 0, -1);
        this.error = new Array(CANVAS_SIZE[1] - 100).fill(0);
        if (noise === "sine_waves") {
            this.sin_wave_coordinates();
        } else if (noise === "perlin") {
            this.perlin_noice_coordinates();
        }
    }

    sin_wave_coordinates() {
        let theta;
        let amplitude;
        let frequency;
        let dy;
        let nwaves = 15;
        for (let n = 0; n < nwaves; n++) {
            theta = 0;
            amplitude = p5js.random([10, 20, 30, 40, 50, 60]);
            frequency = p5js.random([200, 400, 600, 800]);
            dy = p5js.TWO_PI / frequency;
            for (let i = 0; i < this.xpos.length; i++) {
                this.xpos[i] += p5js.sin(theta) * amplitude;
                theta += dy;
            }
        }
        for (let i = 0; i < this.xpos.length; i++) {
            this.xpos[i] += CANVAS_SIZE[0] / 2;
        }
    }

    perlin_noice_coordinates() {
        for (let i = 0; i < CANVAS_SIZE[1]; i++) {
            this.xpos[i] += p5js.noise(i / 200) * 1000 + CANVAS_SIZE[1] / 2 - 250;
        }
    }

    calculate_distance(x, y, criterion) {
        if (y >= CANVAS_SIZE[1] - 100) {
            return;
        }
        let tmp_x_idx = Math.round(x);
        let tmp_y_idx = CANVAS_SIZE[1] - (Math.round(y) - 1);
        let distance = Math.abs(tmp_x_idx - path.xpos[tmp_y_idx - 100]);
        if (distance < criterion) {
            this.error[tmp_y_idx - 100] = 1;
        } else if (distance > criterion) {
            this.error[tmp_y_idx - 100] = -1;
        }
    }

    draw_target_path() {
        p5js.strokeWeight(10);
        for (let x = this.xpos.length - 1; x > 0; x--) {
            if (this.error[x] === 0) {
                p5js.stroke(150, 150, 150);
            } else if (this.error[x] === 1) {
                p5js.stroke(0, 255, 0);
            } else if (this.error[x] === -1) {
                p5js.stroke(255, 0, 0);
            }
            p5js.line(this.xpos[x - 1], this.ypos[x - 1], this.xpos[x], this.ypos[x]);
        }
    }
}

class Ball {
    constructor(xpos, x_sensitivity) {
        this.is_moving = false;
        this.diameter = 30;
        this.y_speed = 1;
        this.x_sensitivity = x_sensitivity;
        this.x_pos = xpos;
        this.y_pos = CANVAS_SIZE[1];
        this.x_path = [];
        this.y_path = [];
    }

    move() {
        if (p5js.keyIsDown(32)) this.is_moving = true;
        if (this.is_moving) {
            this.y_pos -= this.y_speed;
            if (this.y_pos < 0) this.is_moving = false;
            if (p5js.keyIsDown(p5js.LEFT_ARROW)) this.x_pos -= this.x_sensitivity;
            if (p5js.keyIsDown(p5js.RIGHT_ARROW)) this.x_pos += this.x_sensitivity;

            //mouse?
            this.x_pos += p5js.movedX;
            //this.y_pos += p5js.movedY;

            if (this.y_pos >= CANVAS_SIZE[1] - 100) return;
            this.x_path.push(this.x_pos);
            this.y_path.push(this.y_pos);
        }
    }

    draw_ball() {
        p5js.stroke(1);
        p5js.fill(0, 0, 0);
        p5js.circle(this.x_pos, this.y_pos, this.diameter);
    }

    draw_ball_path() {
        p5js.strokeWeight(2);
        for (let x = 1; x < this.x_path.length; x++) {
            p5js.stroke(0, 0, 0);
            p5js.line(this.x_path[x - 1], this.y_path[x - 1], this.x_path[x], this.y_path[x]);
        }
    }
}

//const path = new Path("perlin");
const path = new Path("sine_waves");
const ball = new Ball(path.xpos.slice(0)[0], 10);

function draw_trial() {
    p5js.background(200, 200, 200);
    ball.move();
    path.calculate_distance(ball.x_pos, ball.y_pos, ball.diameter);
    path.draw_target_path();
    ball.draw_ball();
    ball.draw_ball_path();
}

const draw_calls = [draw_trial];

const EXP = [];
const TRIAL = {
    type: jsPsychP5JSKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    draw: function () {
        return draw_trial;
    },
    response_ends_trial: true,
    choices: ["n"],
};
EXP.push(TRIAL);

jsPsych.run(EXP);
