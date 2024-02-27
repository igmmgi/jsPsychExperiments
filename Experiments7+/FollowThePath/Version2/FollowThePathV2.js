// Template for pilot SFB ironic errors series of experiments
const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

const p5js = new p5((sketch) => {
    sketch.setup = () => {};
});

const PRMS = {
    nTrls: 1, // number of trials per block
    nBlks: 1, // number of blocks
    iti: 500, // duration of the inter-trial-interval
    wait: 500, // duration of the inter-trial-interval
    font: "50px Arial",
    colours: { Correct: [0, 255, 0], Incorrect: [255, 0, 0], Path: [150, 150, 150], Background: [200, 200, 200] },
    cBlk: 1,
    cTrl: 1,
    path_difficulty: { easy: 500, hard: 100 },
    y_speed_difficulty: { easy: 1, hard: 2 }, // controlled by frame rate
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst Informationen zur Versuchspersonenstunde nach dem Experiment.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               xxx.xxx<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

class Path {
    constructor(step) {
        this.reset(step);
    }

    reset(step) {
        this.x_path = new Array((CANVAS_SIZE[1] - 100) / step).fill(0);
        this.y_path = range(CANVAS_SIZE[1] - 100, 0, -step);
        this.error = new Array((CANVAS_SIZE[1] - 100) / step).fill(0);
    }

    perlin_noice_coordinates(value) {
        let start = Math.round(Math.random() * 1000);
        for (let i = start; i < start + this.x_path.length; i++) {
            this.x_path[i - start] = p5js.noise(i / value) * 1000 + CANVAS_SIZE[1] / 2 - 250;
        }
    }

    calculate_distance(x, y, criterion) {
        if (y >= CANVAS_SIZE[1] - 100) return;
        let tmp_x_idx = Math.round(x);
        let tmp_y_idx = y; //CANVAS_SIZE[1] - (Math.round(y / 2) - 1);
        let distance = Math.abs(tmp_x_idx - PATH.x_path[tmp_y_idx]);
        if (distance < criterion) {
            //this.error[tmp_y_idx - 50] = 1;
            this.error[tmp_y_idx] = 1;
        } else if (distance > criterion) {
            //this.error[tmp_y_idx - 50] = -1;
            this.error[tmp_y_idx] = -1;
        }
    }

    draw_target_path() {
        p5js.strokeWeight(10);
        for (let x = this.x_path.length - 1; x > 0; x--) {
            if (this.error[x] === 0) {
                p5js.stroke(...PRMS["colours"]["Path"]);
            } else if (this.error[x] === 1) {
                p5js.stroke(...PRMS["colours"]["Correct"]);
            } else if (this.error[x] === -1) {
                p5js.stroke(...PRMS["colours"]["Incorrect"]);
            }
            p5js.line(this.x_path[x - 1], this.y_path[x - 1], this.x_path[x], this.y_path[x]);
        }
    }
}

class Ball {
    constructor() {
        this.reset();
    }

    reset() {
        this.is_moving = false;
        this.is_complete = false;
        this.diameter = 30;
        this.y_speed = null;
        this.step = 0;
        this.x_sensitivity = null;
        this.x_pos = null;
        this.y_pos = CANVAS_SIZE[1];
        this.x_path = [];
        this.y_path = [];
    }

    set_x_position = (x_pos) => (this.x_pos = x_pos);
    set_x_sensitivity = (x_sensitivity) => (this.x_sensitivity = x_sensitivity);
    set_y_speed = (y_speed) => (this.y_speed = y_speed);

    move() {
        if (p5js.keyIsDown(32)) this.is_moving = true;
        if (this.is_moving) {
            this.y_pos -= this.y_speed;
            if (this.y_pos <= 0) {
                this.is_moving = false;
                this.is_complete = true;
            }
            //if (p5js.keyIsDown(p5js.LEFT_ARROW)) this.x_pos -= this.x_sensitivity;
            //if (p5js.keyIsDown(p5js.RIGHT_ARROW)) this.x_pos += this.x_sensitivity;

            //mouse?
            this.x_pos += p5js.movedX;
            //this.y_pos += p5js.movedY;

            if (this.y_pos >= CANVAS_SIZE[1] - 100) return;
            this.step += 1;
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

const PATH = new Path(1);
const BALL = new Ball();

function draw_trial() {
    p5js.background(...PRMS["colours"]["Background"]);
    BALL.move();
    PATH.calculate_distance(BALL.x_pos, BALL.step, BALL.diameter); // comment/uncomment to draw green/red correctness feedback
    PATH.draw_target_path();
    BALL.draw_ball();
    BALL.draw_ball_path(); // comment/uncomment to draw black line representing ball path
    if (BALL.is_complete) {
        p5js.stroke(0);
        p5js.strokeWeight(2);
        p5js.textAlign(p5js.CENTER);
        p5js.textSize(50);
        p5js.text("Press 'n' to start the next trial", CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2);
    }
}

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    console.log(dat);

    // console.log(`-------`);
    // console.log(dat.rt);
    // console.log(PATH.x_path);
    // console.log(PATH.y_path);
    // console.log(PATH.error);
    // console.log(BALL.x_path);
    // console.log(BALL.y_path);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block: PRMS.cBlk,
        trial: PRMS.cTrl,
        path_x: PATH.x_path,
        path_y: PATH.y_path,
        ball_x: BALL.x_path,
        ball_y: BALL.y_path,
        error: PATH.error,
    });
}

const TRIAL = {
    type: jsPsychP5JSKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    canvas_background: CANVAS_COLOUR,
    draw: function () {
        return draw_trial;
    },
    response_ends_trial: true,
    choices: ["n"],
    data: {
        stim_type: "ftp",
        block_type: jsPsych.timelineVariable("block_type"),
        path_difficulty: jsPsych.timelineVariable("path_difficulty"),
        y_speed_difficulty: jsPsych.timelineVariable("y_speed_difficulty"),
    },
    on_start: function (trial) {
        PATH.reset(PRMS["y_speed_difficulty"][trial.data.y_speed_difficulty]);
        PATH.perlin_noice_coordinates(PRMS["path_difficulty"][trial.data.path_difficulty]);
        BALL.reset();
        BALL.set_y_speed(PRMS["y_speed_difficulty"][trial.data.y_speed_difficulty]);
        BALL.set_x_position(PATH.x_path[0]);
        BALL.set_x_sensitivity(8); // how sensitive should keys be?
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const WAIT_BLANK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    stimulus: "",
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    func: function () {},
    trial_duration: PRMS.wait,
    response_ends_trial: false,
};

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        console.log(trial);
        trial.stimulus = generate_formatted_html({
            text: `Start Block ${PRMS.cBlk} von 4:<br><br> 
Press the spacebar to start the trial. Control the ball using the mouse by moving left and right. Try to follow the path!<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
            align: "center",
            colour: "black",
            fontsize: 30,
        });
    },
};

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.cBlk} von 4:<br><br> Drücke eine beliebige Taste, um fortzufahren`,
            align: "center",
            colour: "black",
            fontsize: 30,
        });
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE_EASY_PATH_EASY_SPEED = [
    {"block_type": "easy_path_easy_speed", "path_difficulty": "easy", "y_speed_difficulty": "easy"},
];

// prettier-ignore
const TRIAL_TABLE_EASY_PATH_HARD_SPEED = [
    {"block_type": "easy_path_hard_speed", "path_difficulty": "easy", "y_speed_difficulty": "hard"},
];

// prettier-ignore
const TRIAL_TABLE_HARD_PATH_EASY_SPEED = [
    {"block_type": "hard_path_easy_speed", "path_difficulty": "hard", "y_speed_difficulty": "easy"},
];

// prettier-ignore
const TRIAL_TABLE_HARD_PATH_HARD_SPEED = [
    {"block_type": "hard_path_hard_speed", "path_difficulty": "hard", "y_speed_difficulty": "hard"},
];

// prettier-ignore
const TRIAL_TIMELINE_EASY_PATH_EASY_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_EASY_PATH_EASY_SPEED
};

// prettier-ignore
const TRIAL_TIMELINE_EASY_PATH_HARD_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_EASY_PATH_HARD_SPEED
};

// prettier-ignore
const TRIAL_TIMELINE_HARD_PATH_EASY_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_HARD_PATH_EASY_SPEED
};

// prettier-ignore
const TRIAL_TIMELINE_HARD_PATH_HARD_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_HARD_PATH_HARD_SPEED
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf SONA.
             Drücke eine beliebige Taste, um die Weiterleitung zu SONA zu starten.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common/write_data.php", data_fn, { stim_type: "ftp" }, (filetype = "json"));
    //saveDataLocal(data_fn, { stim_type: "ftp" }, (filetype = "json"));
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    //exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(WELCOME_INSTRUCTIONS);

    let blk_type = ["easy_path_easy_speed", "easy_path_hard_speed", "hard_path_easy_speed", "hard_path_hard_speed"];

    let blk_timeline;
    for (let blk = 0; blk < blk_type.length; blk += 1) {
        exp.push(BLOCK_START); // trials within a block
        exp.push(WAIT_BLANK); // trials within a block
        if (blk_type[blk] === "easy_path_easy_speed") {
            blk_timeline = { ...TRIAL_TIMELINE_EASY_PATH_EASY_SPEED };
        } else if (blk_type[blk] === "easy_path_hard_speed") {
            blk_timeline = { ...TRIAL_TIMELINE_EASY_PATH_HARD_SPEED };
        } else if (blk_type[blk] === "hard_path_easy_speed") {
            blk_timeline = { ...TRIAL_TIMELINE_HARD_PATH_EASY_SPEED };
        } else if (blk_type[blk] === "hard_path_hard_speed") {
            blk_timeline = { ...TRIAL_TIMELINE_HARD_PATH_HARD_SPEED };
        }
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_END); // trials within a block
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
