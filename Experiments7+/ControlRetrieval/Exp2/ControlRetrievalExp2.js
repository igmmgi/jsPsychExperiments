// Control Retrieval Exp4
// M.Sc. Project: Paul Kelber 2022
//
// Stimuli:
// Targets + distractors: coloured circles (red, green, blue, yellow)
// and spoken colour words (red, green, blue, yellow)
// Context: Low or high target + distractor intensity (brightness/loudness)
// Response keys:
// "Q"/"W" and "O"/"P"
//
// Targets, distractors and context randomly divided into two sets: E.g.,
// red/green targets+distractors visual; blue/yellow targets+distractors auditory
// with the above pairs randomly assigned to key pairs ("S"/"D" vs. "K"/"L")
//
// 16 different trial types from combinations of:
// 2 context modalities, 2 targets, 2 distractors, 2 context intensities
//
// Randomisation constraint:
// S-R sets and target/distractor modalities alternated from trial to trial
// Only context intensity was allowed to repeat across trials
//
// Experiment structure:
// 1 practice block followed by 11 experimental blocks (64 trials each; 16 * 4)
//
// Trial structure:
// Central fixation cross for 200 ms
// Distractor (prime) for 300 ms
// Blank screen for 150 ms (?)
// Target for 300 ms
// Blank screen until response (or 2250 ms)
// Visual feedback for 1000 ms following
//  incorrect ("Falsch")
//  too slow ("Zu langsam")
// Blank ITI for 1000 ms
//
// Block feedback provided regarding previous block mean RT/ER
//
// Design:
// 2(Current congruency: congruent vs. incongruent) X
// 2(Previous congruency: congruent vs. incongruent) X
// 2(Context transition: repetition vs. alternation)
// with DVs being RT and ER

const jsPsych = initJsPsych({
    on_finish: function (data) {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=121&credit_token=a911377a8b704c02bdc19f555540e139&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
        );
    },
});

const CANVAS_COLOUR = "rgba(0, 0, 0, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "0px solid black";

// index positions: 0,1=visual context; 2,3=auditory context
const STIM_COLS = shuffle(["red", "green", "blue", "yellow"]);

// auditory stimuli (only the colours needed + silence)
const AUD_STIM = [
    ["../tones_exp1_2/silence.wav"],
    ["../tones_exp1_2/low_" + STIM_COLS[2] + ".wav", "../tones_exp1_2/low_" + STIM_COLS[3] + ".wav"],
    ["../tones_exp1_2/high_" + STIM_COLS[2] + ".wav", "../tones_exp1_2/high_" + STIM_COLS[3] + ".wav"],
];

// visual stimuli (only the other two colours + darkness)
const VIS_STIM = [["rgba(0, 0, 0, 1)"]];
if (STIM_COLS[0] == "red" && STIM_COLS[1] == "green") {
    VIS_STIM.push(["rgba(50, 0, 0, 1)", "rgba(0, 50, 0, 1)"], ["rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "green" && STIM_COLS[1] == "red") {
    VIS_STIM.push(["rgba(0, 50, 0, 1)", "rgba(50, 0, 0, 1)"], ["rgba(0, 255, 0, 1)", "rgba(255, 0, 0, 1)"]);
} else if (STIM_COLS[0] == "red" && STIM_COLS[1] == "blue") {
    VIS_STIM.push(["rgba(50, 0, 0, 1)", "rgba(0, 0, 50, 1)"], ["rgba(255, 0, 0, 1)", "rgba(0, 0, 255, 1)"]);
} else if (STIM_COLS[0] == "blue" && STIM_COLS[1] == "red") {
    VIS_STIM.push(["rgba(0, 0, 50, 1)", "rgba(50, 0, 0, 1)"], ["rgba(0, 0, 255, 1)", "rgba(255, 0, 0, 1)"]);
} else if (STIM_COLS[0] == "red" && STIM_COLS[1] == "yellow") {
    VIS_STIM.push(["rgba(50, 0, 0, 1)", "rgba(50, 50, 0, 1)"], ["rgba(255, 0, 0, 1)", "rgba(255, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "yellow" && STIM_COLS[1] == "red") {
    VIS_STIM.push(["rgba(50, 50, 0, 1)", "rgba(50, 0, 0, 1)"], ["rgba(255, 255, 0, 1)", "rgba(255, 0, 0, 1)"]);
} else if (STIM_COLS[0] == "green" && STIM_COLS[1] == "blue") {
    VIS_STIM.push(["rgba(0, 50, 0, 1)", "rgba(0, 0, 50, 1)"], ["rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)"]);
} else if (STIM_COLS[0] == "blue" && STIM_COLS[1] == "green") {
    VIS_STIM.push(["rgba(0, 0, 50, 1)", "rgba(0, 50, 0, 1)"], ["rgba(0, 0, 255, 1)", "rgba(0, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "green" && STIM_COLS[1] == "yellow") {
    VIS_STIM.push(["rgba(0, 50, 0, 1)", "rgba(100, 50, 0, 1)"], ["rgba(0, 255, 0, 1)", "rgba(255, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "yellow" && STIM_COLS[1] == "green") {
    VIS_STIM.push(["rgba(50, 50, 0, 1)", "rgba(0, 50, 0, 1)"], ["rgba(255, 255, 0, 1)", "rgba(0, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "blue" && STIM_COLS[1] == "yellow") {
    VIS_STIM.push(["rgba(0, 0, 50, 1)", "rgba(50, 50, 0, 1)"], ["rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)"]);
} else if (STIM_COLS[0] == "yellow" && STIM_COLS[1] == "blue") {
    VIS_STIM.push(["rgba(50, 50, 0, 1)", "rgba(0, 0, 50, 1)"], ["rgba(255, 255, 0, 1)", "rgba(0, 0, 255, 1)"]);
}

// index positions 0=visual context; 1=auditory context
const RESP_KEYS = ["q", "w", "o", "p"];
const RESP_KEYS_SHUFFLED = shuffle([
    [RESP_KEYS[0], RESP_KEYS[1]],
    [RESP_KEYS[2], RESP_KEYS[3]],
]).flat();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nBlksExp: 12, // number of blocks
    nTrlsExp: 64, // number of trials per block
    fixDur: 200, // duration of fixation cross
    fixWidth: 5, // width fixation cross
    fixSize: 20, // size of fixation
    primeDur: 300, // duration of prime stimulus
    primeTargetISI: 150, // duration of interval between prime and target
    targetDur: 300, // duration of target stimulus
    circleRadius: 100, // size of the prime/target circles
    tooFast: 0, // response limit min
    tooSlow: 2250, // response interval timeout
    fbDur: [0, 1000, 1000, 1000], // duration of feedback for each type (correct, error, too slow, too fast)
    fbTxt: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 26,
    waitBlankDur: 500, // interval between screens (e.g. instructions)
    iti: 1000, // duration of inter-trial-interval
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
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
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, Chrome oder Firefox nutzt und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           paul.kelber@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        color: "White",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const RESP_TEXT = generate_formatted_html({
    text: `In jedem Durchgang werden zwei Farben hintereinander dargeboten.
  Dabei liegen die Farben abwechselnd (1) als farbiger Kreis und (2) als gesprochenes Farbwort vor. 
  Beide Arten von Reizen können zudem entweder schwach oder stark intensiv sein.
  Deine Aufgabe ist es, so schnell und akkurat wie möglich auf die <i>zweite</i> Farbe zu reagieren. 
  Welche Taste Du bei welcher Farbe drücken sollst, ist unten dargestellt:<br><br>
  <span style="color: ${
      STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]
  }">${RESP_KEYS[0].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]
    }">${RESP_KEYS[1].toUpperCase()} Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3].toUpperCase()} Taste</span><br><br>
    Wenn du dir die Zuordnungen gut eingeprägt hast, kannst du eine beliebige Taste drücken.`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const RESP_TEXT_BLOCK = generate_formatted_html({
    text: `
  Deine Aufgabe ist es, so schnell und akkurat wie möglich auf die <i>zweite</i> Farbe zu reagieren. Es gilt: <br/><br/>
  <span style="color: ${
      STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]
  }">${RESP_KEYS[0].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]
    }">${RESP_KEYS[1].toUpperCase()} Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3].toUpperCase()} Taste</span><br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const RESP_TEXT_TRIAL = generate_formatted_html({
    text: `<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[0])]
    }">${RESP_KEYS[0].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[1])]
    }">${RESP_KEYS[1].toUpperCase()} Taste</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[2])]
    }">${RESP_KEYS[2].toUpperCase()} Taste</span>&emsp;&emsp;<span style="color: ${
        STIM_COLS[RESP_KEYS_SHUFFLED.indexOf(RESP_KEYS[3])]
    }">${RESP_KEYS[3].toUpperCase()} Taste</span>`,
    align: "center",
    color: "White",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS_RESP_MAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: RESP_TEXT,
};

// ////////////////////////////////////////////////////////////////////////
// //               Preload Tones and Calibration Routine                //
// ////////////////////////////////////////////////////////////////////////
const PRELOAD = {
    type: jsPsychPreload,
    audio: AUD_STIM,
};

////////////////////////////////////////////////////////////////////////
//                         Timeline Variables                         //
////////////////////////////////////////////////////////////////////////

// Experiment trials
const TRIALS_EXP = [
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "l",
        prime_col: STIM_COLS[0],
        target_col: STIM_COLS[0],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[1][0],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[1][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "l",
        prime_col: STIM_COLS[1],
        target_col: STIM_COLS[1],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[1][1],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[1][1],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "l",
        prime_col: STIM_COLS[1],
        target_col: STIM_COLS[0],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[1][1],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[1][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "l",
        prime_col: STIM_COLS[0],
        target_col: STIM_COLS[1],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[1][0],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[1][1],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "h",
        prime_col: STIM_COLS[0],
        target_col: STIM_COLS[0],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[2][0],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[2][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "h",
        prime_col: STIM_COLS[1],
        target_col: STIM_COLS[1],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[2][1],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[2][1],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "h",
        prime_col: STIM_COLS[1],
        target_col: STIM_COLS[0],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[2][1],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[2][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[0])],
    },
    {
        blk: "exp",
        ctx_mod: "vis",
        intensity: "h",
        prime_col: STIM_COLS[0],
        target_col: STIM_COLS[1],
        aud_prime: AUD_STIM[0][0],
        vis_prime: VIS_STIM[2][0],
        aud_target: AUD_STIM[0][0],
        vis_target: VIS_STIM[2][1],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[1])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "l",
        prime_col: STIM_COLS[2],
        target_col: STIM_COLS[2],
        aud_prime: AUD_STIM[1][0],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[1][0],
        vis_target: VIS_STIM[0][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "l",
        prime_col: STIM_COLS[3],
        target_col: STIM_COLS[3],
        aud_prime: AUD_STIM[1][1],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[1][1],
        vis_target: VIS_STIM[0][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "l",
        prime_col: STIM_COLS[3],
        target_col: STIM_COLS[2],
        aud_prime: AUD_STIM[1][1],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[1][0],
        vis_target: VIS_STIM[0][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "l",
        prime_col: STIM_COLS[2],
        target_col: STIM_COLS[3],
        aud_prime: AUD_STIM[1][0],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[1][1],
        vis_target: VIS_STIM[0][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "h",
        prime_col: STIM_COLS[2],
        target_col: STIM_COLS[2],
        aud_prime: AUD_STIM[2][0],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[2][0],
        vis_target: VIS_STIM[0][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "h",
        prime_col: STIM_COLS[3],
        target_col: STIM_COLS[3],
        aud_prime: AUD_STIM[2][1],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[2][1],
        vis_target: VIS_STIM[0][0],
        comp: "comp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "h",
        prime_col: STIM_COLS[3],
        target_col: STIM_COLS[2],
        aud_prime: AUD_STIM[2][1],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[2][0],
        vis_target: VIS_STIM[0][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[2])],
    },
    {
        blk: "exp",
        ctx_mod: "aud",
        intensity: "h",
        prime_col: STIM_COLS[2],
        target_col: STIM_COLS[3],
        aud_prime: AUD_STIM[2][0],
        vis_prime: VIS_STIM[0][0],
        aud_target: AUD_STIM[2][1],
        vis_target: VIS_STIM[0][0],
        comp: "incomp",
        correct_key: RESP_KEYS_SHUFFLED[STIM_COLS.indexOf(STIM_COLS[3])],
    },
];

////////////////////////////////////////////////////////////////////////
//                         Trial Parts                                //
////////////////////////////////////////////////////////////////////////

const WAIT_BLANK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
};

function draw_fixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = "White";
    ctx.lineWidth = PRMS.fixWidth;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
    func: draw_fixation,
};

const AUD_PRIME = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("aud_prime"),
    trial_duration: 0,
    response_ends_trial: false,
};

function draw_prime(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = args.colour;
    ctx.beginPath();
    ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

const PRIME = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    trial_duration: PRMS.primeDur,
    func: draw_prime,
    func_args: [{ colour: jsPsych.timelineVariable("vis_prime") }],
};

const PRIME_TARGET_ISI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.primeTargetISI,
    response_ends_trial: false,
};

function draw_target(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = args.colour;
    ctx.beginPath();
    ctx.arc(0, 0, PRMS.circleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function code_trial_exp() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

const AUD_TARGET = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("aud_target"),
    trial_duration: 0,
    response_ends_trial: false,
};

const TARGET = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    stimulus_duration: PRMS.targetDur,
    trial_duration: PRMS.tooSlow,
    func: draw_target,
    func_args: [{ colour: jsPsych.timelineVariable("vis_target") }],
    data: {
        stim: "cr1",
        blk: jsPsych.timelineVariable("blk"),
        ctx_mod: jsPsych.timelineVariable("ctx_mod"),
        intensity: jsPsych.timelineVariable("intensity"),
        prime_col: jsPsych.timelineVariable("prime_col"),
        target_col: jsPsych.timelineVariable("target_col"),
        comp: jsPsych.timelineVariable("comp"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_finish: function () {
        code_trial_exp();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK_EXP = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: 0,
    response_ends_trial: false,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.corrCode !== 1) {
            trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
            trial.stimulus =
                `<div style="font-size:${PRMS.fbTxtSizeTrial}px; color:White;">${PRMS.fbTxt[dat.corrCode - 1]}</div>` +
                RESP_TEXT_TRIAL;
        }
    },
};

const ITI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
};

const TASK_INSTRUCTIONS_BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cBlk} von ${PRMS.nBlksExp}`,
                fontsize: 30,
                color: "white",
                align: "left",
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            }) +
            generate_formatted_html({
                text: RESP_TEXT_BLOCK,
                align: "center",
                fontsize: 30,
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            });
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: null,
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "cr1", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(
            PRMS.cBlk,
            PRMS.nBlksExp,
            block_dvs.meanRt,
            block_dvs.errorRate,
            (language = "de"),
        );
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px; color:White;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Timelines                            //
////////////////////////////////////////////////////////////////////////

const TRIAL_TIMELINE_EXP = {
    timeline: [FIXATION_CROSS, AUD_PRIME, PRIME, PRIME_TARGET_ISI, AUD_TARGET, TARGET, TRIAL_FEEDBACK_EXP, ITI],
    timeline_variables: TRIALS_EXP,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, [{ stim: "cr1" }, { stim: "cr1_check" }]);
    // saveDataLocal(data_fn, [{ stim: 'cr1'}, {stim: 'cr1_check'}]);
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
    exp.push(browser_check(PRMS.screenRes));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(WAIT_BLANK);

    // start of experiment blocks
    exp.push(TASK_INSTRUCTIONS_RESP_MAPPING);
    exp.push(WAIT_BLANK);

    for (let blk = 0; blk < PRMS.nBlksExp; blk++) {
        // manipulation instructions at very start or half way
        exp.push(TASK_INSTRUCTIONS_BLOCK_START);
        exp.push(WAIT_BLANK); // blank before 1st trial start

        let blk_timeline = { ...TRIAL_TIMELINE_EXP };
        blk_timeline.sample = {
            type: "alternate-groups",
            groups: [
                repeatArray([0, 1, 2, 3, 4, 5, 6, 7], PRMS.nTrlsExp / TRIALS_EXP.length),
                repeatArray([8, 9, 10, 11, 12, 13, 14, 15], PRMS.nTrlsExp / TRIALS_EXP.length),
            ],
            randomize_group_order: true,
        };
        exp.push(blk_timeline);

        // between block feedback
        exp.push(BLOCK_FEEDBACK);
        exp.push(WAIT_BLANK);
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
