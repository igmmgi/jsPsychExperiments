// Version 1 for pilot SFB ironic errors series of experiments
// Participants are required to control a ball (small circle) that moves from the bottom
// to the top of the screen. The x-position is controlled  by moving the mouse/trackpad
// left/right so that the ball follows a path.
//
// 4 types of trials:
// 1) Feedback present / Low noise
// 2) Feedback present / High noise
// 3) Feedback absent / Low noise
// 4) Feedback absent / High noise
//
// Trials are presented in mixed blocks containing all trial types.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

const p5js = new p5((sketch) => {
    sketch.setup = () => {
    };
});

const PRMS = {
    n_trials: 20, // number of trials per block (must be multiple of 4)
    n_blocks: 8, // total number of mixed blocks
    iti: 500, // duration of the inter-trial-interval
    survey_type: "slider", // options: "likert" or "slider"
    survey_scale: [0, 100],
    survey_question_1: "Wie viel Kontrolle hattest du über den Ball?",
    survey_anchors: ["Sehr wenig", "Sehr viel"],
    font: "50px Arial",
    colours: { correct: [0, 255, 0], incorrect: [255, 0, 0], path: [150, 150, 150], background: [200, 200, 200] },
    count_block: 1,
    count_trial: 1,
    path_start: 100, // path starts X up from bottom of screen
    path_width: 10, // width of the path in pixels
    path_difficulty: { standard: 500 },
    speed_difficulty: { standard: 0.1 }, // px/ms (0.1 = 100px/s; path completes in ~6.2s)
    noise_difficulty: { low: 0.10, high: 0.30 }, // probability of reversing mouse movement
    ball_diameter: 20,
    show_ball_path: false, // the black line the ball travelled
    show_error_path: true, // the red/green path feedback
    show_percentage_path: false, // display percentage time on path after trial
    show_condition_info: true, // display condition info for piloting
    hide_cursor: true, // hide the real mouse cursor when moving the ball
    distance_criterion: 15, // error criterion if shown
    scale_factor: 1, // default scale factor if SCALE_FACTOR trial is skipped
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
        this.last_path_idx = 0;
    }

    // position within canvas and scale
    perlin_noise_coordinates(noise_value) {
        let xpos = CANVAS_SIZE[0] * 0.75;
        let start = Math.round(Math.random() * xpos);
        for (let i = start; i < start + this.x.length; i++) {
            this.x[i - start] = p5js.noise(i / noise_value) * xpos + (CANVAS_SIZE[0] / 2) - (xpos / 2);
        }
    }

    calculate_distance(x, ball_y, criterion) {
        if (ball_y > CANVAS_SIZE[1] - PRMS.path_start) return;
        let idx = Math.round(CANVAS_SIZE[1] - PRMS.path_start - ball_y);
        idx = Math.max(0, Math.min(idx, this.x.length - 1));
        for (let i = this.last_path_idx; i <= idx; i++) {
            let distance = Math.abs(Math.round(x) - this.x[i]);
            this.on_path[i] = distance < criterion ? 1 : -1;
        }
        this.last_path_idx = idx + 1;
    }

    draw_target_path() {
        p5js.strokeWeight(PRMS.path_width);
        for (let x = this.x.length - 1; x > 0; x--) {
            if (this.feedback === "absent" || this.on_path[x] === 0 || !PRMS.show_error_path) {
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
        this.noise_prob = 0;
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

    move(dt) {
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
            if (this.is_moving && PRMS.hide_cursor) {
                p5js.noCursor();
                document.body.style.cursor = 'none';
            }
        }
        if (!this.is_moving) return;

        // ball is moving, only interesred in x-movements
        this.y -= this.speed * dt;

        let move_x = p5js.movedX;
        if (Math.random() < this.noise_prob) {
            move_x *= -1;
        }
        this.x += move_x;

        // wait till path start
        if (this.y > CANVAS_SIZE[1] - PRMS.path_start) return;

        if (this.y <= 0) {
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
    BALL.move(p5js.deltaTime);
    PATH.draw_target_path();
    BALL.draw_ball();
    PATH.calculate_distance(BALL.x, BALL.y, PRMS.distance_criterion);
    if (PRMS.show_ball_path) BALL.draw_ball_path();

    // Piloting text
    if (PRMS.show_condition_info) {
        p5js.noStroke();
        p5js.fill(0);
        p5js.textAlign(p5js.LEFT);
        p5js.textSize(20);
        p5js.text(`Feedback: ${PATH.feedback} | Noise: ${BALL.noise_level}`, 20, 30);
    }

    if (BALL.is_complete && !BALL.trial_finished) {
        if (PRMS.hide_cursor) {
            p5js.cursor();
            document.body.style.cursor = 'auto';
        }
        BALL.trial_finished = true;
        jsPsych.finishTrial();
    }
}

function add_data() {
    let on_path_count = PATH.on_path.filter(x => x === 1).length;
    let total_count = PATH.on_path.filter(x => x === 1 || x === -1).length;
    let performance = total_count > 0 ? Math.round((on_path_count / total_count) * 100) : 0;
    PRMS.last_performance = performance;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block: PRMS.count_block,
        trial: PRMS.count_trial,
        path_x: PATH.x,
        path_y: PATH.y,
        ball_x: BALL.x_path,
        ball_y: BALL.y_path,
        on_path: PATH.on_path,
        performance: performance,
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
    response_ends_trial: false,
    choices: "NO_KEYS",
    data: {
        stim_type: "ftp",
        feedback: jsPsych.timelineVariable("feedback"),
        noise: jsPsych.timelineVariable("noise"),
    },
    on_start: function (trial) {
        let speed_diff = "standard";
        let path_diff = "standard";
        let noise_level = jsPsych.evaluateTimelineVariable("noise");
        let feedback = jsPsych.evaluateTimelineVariable("feedback");

        PATH.reset(1);
        PATH.perlin_noise_coordinates(
            PRMS.path_difficulty[path_diff],
        );
        PATH.feedback = feedback;

        BALL.reset(PATH.y.length);
        BALL.set_speed(PRMS.speed_difficulty[speed_diff]);
        BALL.set_x_position(PATH.x[0]);
        BALL.noise_prob = PRMS.noise_difficulty[noise_level];
        BALL.noise_level = noise_level;
        BALL.trial_finished = false;
    },
    on_finish: function () {
        add_data();
        PRMS.count_trial += 1;
    },
};

const TRIAL_PERFORMANCE_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    trial_duration: 1500,
    stimulus: function () {
        return generate_formatted_html({
            text: `Time on Path: ${PRMS.last_performance}%`,
            align: "center",
            colour: "black",
            fontsize: 50,
            bold: true,
        });
    }
};

const TRIAL_PERFORMANCE_FEEDBACK_NODE = {
    timeline: [TRIAL_PERFORMANCE_FEEDBACK],
    conditional_function: function () {
        return PRMS.show_percentage_path;
    }
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
                   - Klicke mit der linken Maustaste auf den schwarzen Ball, um den Durchgang zu starten.<br><br>
                   - Kontrolliere den Ball, indem du die Maus nach links und nach rechts bewegst.<br><br>
                   - Versuche, dem Pfad zu folgen.<br><br><br>
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
            text: `Ende Block ${PRMS.count_block} von ${PRMS.n_blocks}:<br><br> Drücke eine beliebige Taste, um fortzufahren`,
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

function generate_likert_labels(min, max, left_label, right_label) {
    let labels = [];
    for (let i = min; i <= max; i++) {
        if (i === min) labels.push(`${i}<br>${left_label}`);
        else if (i === max) labels.push(`${i}<br>${right_label}`);
        else labels.push(`${i}`);
    }
    return labels;
}

const SURVEY_LIKERT = {
    type: jsPsychSurveyLikert,
    scale_width: CANVAS_SIZE[0] * 0.9,
    questions: [
        {
            prompt: `<span style="font-weight: bold; font: 36px Arial;">${PRMS.survey_question_1}</span>`,
            name: "question_1",
            labels: generate_likert_labels(PRMS.survey_scale[0], PRMS.survey_scale[1], PRMS.survey_anchors[0], PRMS.survey_anchors[1]),
        },
    ],
};

const SURVEY_SLIDER = {
    type: jsPsychSurveyHtmlForm,
    button_label: "Weiter",
    html: `
        <div style="margin-bottom: 40px; text-align: center; width: 80%; margin-left: auto; margin-right: auto;">
            <p style="margin-bottom: 40px;"><span style="font-weight: bold; font: 36px Arial;">${PRMS.survey_question_1}</span></p>
            <input type="range" name="question_1" min="${PRMS.survey_scale[0]}" max="${PRMS.survey_scale[1]}" value="${Math.round((PRMS.survey_scale[0] + PRMS.survey_scale[1]) / 2)}" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; width: 100%; font: 24px Arial; margin-top: 15px;">
                <span style="text-align: center; width: 200px; margin-left: -100px;">${PRMS.survey_scale[0]}<br>${PRMS.survey_anchors[0]}</span>
                <span style="text-align: center; width: 200px; margin-right: -100px;">${PRMS.survey_scale[1]}<br>${PRMS.survey_anchors[1]}</span>
            </div>
        </div>
    `,
    on_finish: function (data) {
        let response = Number(data.response.question_1);
        let rt = Math.round(data.rt);
        data.response.question_1 = response;

        let last_trial_data = jsPsych.data.get().filter({ stim_type: "ftp" }).last(1).values()[0];
        if (last_trial_data) {
            last_trial_data.survey_response = response;
            last_trial_data.survey_rt = rt;
        }
    }
};

const SURVEY = {
    timeline: [
        {
            timeline: [SURVEY_LIKERT],
            conditional_function: function () { return PRMS.survey_type === "likert"; }
        },
        {
            timeline: [SURVEY_SLIDER],
            conditional_function: function () { return PRMS.survey_type === "slider"; }
        }
    ]
};

const TRIAL_TABLE = [
    { feedback: "present", noise: "low" },
    { feedback: "present", noise: "high" },
    { feedback: "absent", noise: "low" },
    { feedback: "absent", noise: "high" },
];

const TRIAL_TIMELINE = {
    timeline: [TRIAL, TRIAL_PERFORMANCE_FEEDBACK_NODE, SURVEY, ITI],
    timeline_variables: TRIAL_TABLE,
    sample: {
        type: "fixed-repetitions",
        size: PRMS.n_trials / 4,
    }
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
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common/write_data.php", data_fn, { stim_type: "ftp" }, (filetype = "json"));
    // save_data_local(data_fn, { stim_type: "ftp" }, (filetype = "json"));
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
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser());
    exp.push(SCALE_FACTOR);
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(WELCOME_INSTRUCTIONS);

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        exp.push(BLOCK_START);
        exp.push(TRIAL_TIMELINE);
        exp.push(BLOCK_END);
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
