// Template for pilot SFB ironic errors series of experiments
// Participants are required to control a ball (small circle) that moves from the bottom
// to the top of the screen. The x-position is controlled  by moving the mouse/trackpad
// left/right so that the ball follows a path.
//
// 4 types of trials:
// 1) Easy speed / easy path
// 2) Hard speed / easy path
// 3) Easy speed / hard path
// 4) Hard speed / hard path
//
// Trials are presented in separate blocks
// Block order can be easy to hard 1/2/3/4 or randomised (e.g., 3/3/1/1/4/4/2/2)

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
    n_trials: 1, // number of trials per block
    n_blocks: 4, // number of blocks (must be multiple of 4)
    randomise_block_order: false,
    iti: 500, // duration of the inter-trial-interval
    font: "50px Arial",
    colours: { correct: [0, 255, 0], incorrect: [255, 0, 0], path: [150, 150, 150], background: [200, 200, 200] },
    count_block: 1,
    count_trial: 1,
    path_start: 100, // path starts X up from bottom of screen
    path_width: 10, // width of the path in pixels
    path_difficulty: { easy: 500, hard: 100 },
    speed_difficulty: { easy: 1, hard: 2 }, // controlled by frame rate (1px vs 2px per frame)
    ball_diameter: 20,
    show_ball_path: true, // the black line the ball travelled
    show_error_path: true, // the red/green path feedback
    distance_criterion: 15, // error criterion if shown
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

////////////////////////////////////////////////////////////////////////
//                      Experiment Parts                              //
////////////////////////////////////////////////////////////////////////
function get_scale_factor() {
    let dat = jsPsych.data.get().last(1).values()[0];
    PRMS.scale_factor = 1 / dat.scale_factor;
    jsPsych.data.addProperties({ scale_factor: PRMS.scale_factor });
}

const SCALE_FACTOR = {
    type: jsPsychCallFunction,
    func: get_scale_factor,
};

class Path {
    constructor(step) {
        this.reset(step);
    }

    reset(step) {
        this.x = new Array(Math.round((CANVAS_SIZE[1] - PRMS.path_start) / step)).fill(0);
        this.y = range(CANVAS_SIZE[1] - PRMS.path_start, 0, -step);
        this.on_path = new Array(Math.round((CANVAS_SIZE[1] - PRMS.path_start) / step)).fill(0);
    }

    // position within canvas and scale
    perlin_noice_coordinates(value) {
        let xpos = CANVAS_SIZE[0] * 0.75;
        let start = Math.round(Math.random() * xpos);
        for (let i = start; i < start + this.x.length; i++) {
            this.x[i - start] = p5js.noise(i / value) * xpos + CANVAS_SIZE[1] / 2 - xpos / 4;
        }
    }

    calculate_distance(x, y, criterion) {
        if (y > CANVAS_SIZE[1] - PRMS.path_start) return;
        let distance = Math.abs(Math.round(x) - PATH.x[y]);
        this.on_path[y - 1] = distance < criterion ? 1 : -1;
    }

    draw_target_path() {
        p5js.strokeWeight(PRMS.path_width);
        for (let x = this.x.length - 1; x > 0; x--) {
            if (this.on_path[x] === 0) {
                p5js.stroke(...PRMS.colours.path);
            } else if (this.on_path[x] === 1) {
                p5js.stroke(...PRMS.colours.correct);
            } else if (this.on_path[x] === -1) {
                p5js.stroke(...PRMS.colours.incorrect);
            }
            p5js.line(this.x[x - 1], this.y[x - 1], this.x[x], this.y[x]);
        }
    }
}

class Ball {
    constructor(length) {
        this.reset(length);
    }

    reset(length) {
        this.length = length;
        this.is_moving = false;
        this.is_complete = false;
        this.diameter = PRMS.ball_diameter;
        this.speed = null;
        this.step = 0;
        this.x = null;
        this.y = CANVAS_SIZE[1] - PRMS.ball_diameter;
        this.x_path = [];
        this.y_path = [];
    }

    set_x_position(x_pos) {
        this.x = x_pos;
    }
    set_speed(speed) {
        this.speed = speed;
    }

    move() {
        // trial initiation
        if (!this.is_moving && p5js.mouseIsPressed) {
            let dx = Math.abs(p5js.mouseX * PRMS.scale_factor) - this.x - 5;
            let dy = Math.abs(p5js.mouseY * PRMS.scale_factor) - this.y - 5;
            let distance = Math.sqrt(dx * dx + dy * dy);
            // console.log("----------------");
            // console.log("this.x:", this.x, "p5x", p5js.mouseX, p5js.mouseX * PRMS.scale_factor);
            // console.log("this.y:", this.x, "p5y", p5js.mouseY, p5js.mouseX * PRMS.scale_factor);
            // console.log("dx:", dx, "dy:", dy, "distance:", distance);
            this.is_moving = distance < this.diameter / 2;
        }
        if (!this.is_moving) return;

        // ball is moving, only interesred in x-movements
        this.y -= this.speed;
        this.x += p5js.movedX; // only interested in x-movements

        // wait till path start
        if (this.y > CANVAS_SIZE[1] - PRMS.path_start) return;

        if (this.step >= this.length) {
            this.is_moving = false;
            this.is_complete = true;
            return;
        }

        this.step += 1;
        this.x_path.push(this.x);
        this.y_path.push(this.y);
    }

    draw_ball() {
        p5js.stroke(1);
        p5js.fill(0, 0, 0);
        p5js.circle(this.x, this.y, this.diameter);
    }

    draw_ball_path() {
        p5js.strokeWeight(2);
        p5js.stroke(0, 0, 0);
        for (let x = 1; x < this.x_path.length; x++) {
            p5js.line(this.x_path[x - 1], this.y_path[x - 1], this.x_path[x], this.y_path[x]);
        }
    }
}

const PATH = new Path(1);
const BALL = new Ball(1);

function draw_trial() {
    p5js.background(...PRMS.colours.background);
    BALL.move();
    PATH.draw_target_path();
    BALL.draw_ball();
    if (PRMS.show_error_path) PATH.calculate_distance(BALL.x, BALL.step, PRMS.distance_criterion);
    if (PRMS.show_ball_path) BALL.draw_ball_path();
    if (BALL.is_complete) {
        p5js.stroke(0);
        p5js.strokeWeight(2);
        p5js.textAlign(p5js.CENTER);
        p5js.textSize(50);
        p5js.text("Press 'n' to start the next trial", CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2);
    }
}

function add_data() {
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block: PRMS.count_block,
        trial: PRMS.count_trial,
        path_x: PATH.x,
        path_y: PATH.y,
        ball_x: BALL.x_path,
        ball_y: BALL.y_path,
        on_path: PATH.on_path,
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
        speed_difficulty: jsPsych.timelineVariable("speed_difficulty"),
    },
    on_start: function (trial) {
        PATH.reset(PRMS.speed_difficulty[trial.data.speed_difficulty]);
        PATH.perlin_noice_coordinates(PRMS.path_difficulty[trial.data.path_difficulty]);
        BALL.reset(PATH.y.length);
        BALL.set_speed(PRMS.speed_difficulty[trial.data.speed_difficulty]);
        BALL.set_x_position(PATH.x[0]);
    },
    on_finish: function () {
        add_data();
        PRMS.count_trial += 1;
    },
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
        trial.stimulus = generate_formatted_html({
            text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}:<br><br> 
                   Click the left mouse button inside the black ball to start the trial.<br><br>
                   Control the ball using the mouse by moving left and right.<br><br>
                   Try to follow the path!<br><br><br>
                   Drücke eine beliebige Taste, um fortzufahren`,
            align: "left",
            colour: "black",
            fontsize: 30,
            bold: true,
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
            text: `Ende Block ${PRMS.count_block} von 4:<br><br> Drücke eine beliebige Taste, um fortzufahren`,
            align: "center",
            colour: "black",
            fontsize: 30,
            bold: true,
        });
    },
    on_finish: function () {
        PRMS.count_trial = 1;
        PRMS.count_block += 1;
    },
};

const TRIAL_TABLE_EASY_PATH_EASY_SPEED = [
    { block_type: "easy_path_easy_speed", path_difficulty: "easy", speed_difficulty: "easy" },
];

const TRIAL_TABLE_EASY_PATH_HARD_SPEED = [
    { block_type: "easy_path_hard_speed", path_difficulty: "easy", speed_difficulty: "hard" },
];

const TRIAL_TABLE_HARD_PATH_EASY_SPEED = [
    { block_type: "hard_path_easy_speed", path_difficulty: "hard", speed_difficulty: "easy" },
];

const TRIAL_TABLE_HARD_PATH_HARD_SPEED = [
    { block_type: "hard_path_hard_speed", path_difficulty: "hard", speed_difficulty: "hard" },
];

const TRIAL_TIMELINE_EASY_PATH_EASY_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_EASY_PATH_EASY_SPEED,
};

const TRIAL_TIMELINE_EASY_PATH_HARD_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_EASY_PATH_HARD_SPEED,
};

const TRIAL_TIMELINE_HARD_PATH_EASY_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_HARD_PATH_EASY_SPEED,
};

const TRIAL_TIMELINE_HARD_PATH_HARD_SPEED = {
    timeline: [TRIAL, ITI],
    timeline_variables: TRIAL_TABLE_HARD_PATH_HARD_SPEED,
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
        lineheight: 1.5,
        bold: true,
        align: "left",
    }),
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
    // saveData("/Common/write_data.php", data_fn, { stim_type: "ftp" }, (filetype = "json"));
    saveDataLocal(data_fn, { stim_type: "ftp" }, (filetype = "json"));
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
    exp.push(SCALE_FACTOR);
    exp.push(welcome_message());
    //exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(WELCOME_INSTRUCTIONS);

    let blk_type;
    if (!PRMS.randomise_block_order) {
        blk_type = ["easy_path_easy_speed", "easy_path_hard_speed", "hard_path_easy_speed", "hard_path_hard_speed"];
    } else {
        blk_type = shuffle([
            "easy_path_easy_speed",
            "easy_path_hard_speed",
            "hard_path_easy_speed",
            "hard_path_hard_speed",
        ]);
    }
    blk_type = repEach(blk_type, PRMS.n_blocks / 4);

    let blk_timeline;
    for (let blk = 0; blk < PRMS.n_blocks / 2; blk += 1) {
        exp.push(BLOCK_START); // trials within a block
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
            size: PRMS.n_trials,
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
