// Free-Forced Errors:
// How do errors in free- and forced- choice tasks influence subsequent choices?
//
// Two tasks:
// 1) Letter task (more X's vs. O's; no-go #'s)
// 2) Colour task (more blue vs. red; no-go grey)
// with free-choice, forced-letter, and forced-colour tasks
//
// Responses for each task made with index/middle fingers of left/right
// hands (Q, W, O, P keys) with task-to-hand mapping randomly selected per participant
//
// Each block had 50% free-choice and 50% forced (25% letter, 25% colour) trials
//
// Trial sequence:
// Fixation cross for 500 ms
// 1st trial (random selection of which task appears at SOA of 300ms)
// Other trials SOA determined by repeat (+50) vs switch (-50 ms) free choice trials
// Blocks 1 and 2- Trial feedback for 1000 ms (correct vs. incorrect)
// Blank inter-trial-interval for 1000 ms

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    colour_task_ratio: [20, 80], // should sum to 100!
    letter_task_ratio: [20, 80], // should sum to 100!
    colour_task_colours: shuffle(["blue", "red"]),
    colour_task_nogo: ["grey"],
    letter_task_font: "20px Bold Monospace",
    letter_task_colour: "Black",
    letter_task_offset: 22,
    letter_task_letters: shuffle(["X", "O"]),
    letter_task_nogo: ["#"],
    dot_radius: 4,
    stimulus_size: [90, 10],
    dot_gaps: 20,
    task_side: shuffle(["Colour", "Letter"]),
    response_keys_lh: ["Q", "W"],
    response_keys_rh: ["O", "P"],
    response_keys: ["Q", "W", "O", "P"],
    count_block: 1,
    count_trial: 1,
};

const EN_DE = { blue: "blau", red: "rot" };

function calculate_number_of_dots() {
    // Required for ratio manipulation in VTS
    PRMS.n_dots = 0;
    for (let rows = -PRMS.stimulus_size[0]; rows <= PRMS.stimulus_size[0]; rows += PRMS.dot_gaps) {
        for (let cols = -PRMS.stimulus_size[1]; cols <= PRMS.stimulus_size[1]; cols += PRMS.dot_gaps) {
            PRMS.n_dots += 1;
        }
    }
  PRMS.n_dots /= 2; // two tasks
}

const COUNT_DOTS = {
    type: jsPsychCallFunction,
    func: calculate_number_of_dots,
};

function stimulus_to_key_mapping() {
    let key_mapping = {};
    if (PRMS.task_side[0] === "Colour") {
        PRMS.response_keys_colour = PRMS.response_keys_lh;
        PRMS.response_keys_letter = PRMS.response_keys_rh;
        key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_lh[0];
        key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_lh[1];
        key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_rh[0];
        key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_rh[1];
    } else if (PRMS.task_side[0] === "Letter") {
        PRMS.response_keys_letter = PRMS.response_keys_lh;
        PRMS.response_keys_colour = PRMS.response_keys_rh;
        key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_lh[0];
        key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_lh[1];
        key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_rh[0];
        key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_rh[1];
  }
    return key_mapping;
}

const KEY_MAPPING = stimulus_to_key_mapping();
// console.log(KEY_MAPPING);

const PERFORMANCE = {
  n_repetitions: 0,
  n_switches: 0,
  soa: 0,
  previous_task: null
}

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
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

function pad_me(str, npad) {
    let len = Math.floor((npad - str.length) / 2);
    str = " ".repeat(len) + str + " ".repeat(len);
    return str
        .split("")
        .map(function (c) {
            return c === " " ? "&nbsp;" : c;
        })
        .join("");
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    let idx = 0;
    for (let rows = -PRMS.stimulus_size[0]; rows <= PRMS.stimulus_size[0]; rows += PRMS.dot_gaps) {
        for (let cols = -PRMS.stimulus_size[1]; cols <= PRMS.stimulus_size[1]; cols += PRMS.dot_gaps * 2) {
            let centerX = rows;
            let centerY = cols;

            // draw dots
            if (args.draw_dots) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, PRMS.dot_radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = args.dots[idx];
                ctx.fill();
            }

            // draw letters
            if (args.draw_letters) {
                ctx.font = PRMS.letter_task_font;
                ctx.fillStyle = PRMS.letter_task_colour;
                ctx.textAlign = "center";
                ctx.fillText(args.letters[idx], centerX, centerY + PRMS.letter_task_offset);
            }

            idx += 1;
        }
    }
}

function code_trial() {
  "use strict";

  let dat = jsPsych.data.get().last(1).values()[0];

  // which task did they perform?
  let responded_letter = PRMS.response_keys_letter.includes(dat.key_press.toUpperCase());
  let responded_colour = PRMS.response_keys_colour.includes(dat.key_press.toUpperCase());
  let response_task    = responded_letter && !responded_colour ? "letter" : "colour";

  let error = 0;
  if (responded_letter & (dat.key_press.toUpperCase() !== dat.letter_task_key)) {
    error = 1;
  } else if (responded_colour & (dat.key_press.toUpperCase() !== dat.colour_task_key)) {
    error = 1;
  }

  // get current trial soa
  let soa = PERFORMANCE.soa;

  if (PRMS.count_trial > 1) {
    if (response_task === PERFORMANCE.previous_task) {
      PERFORMANCE.n_repetitions += 1;
      PERFORMANCE.soa += 50;
    } else {
      PERFORMANCE.n_switches += 1;
      PERFORMANCE.soa -= 50;
    }
  }
  PERFORMANCE.previous_task = response_task;

  console.log(PERFORMANCE);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    response_task: response_task,
    soa: soa,
    error: error,
    blockNum: PRMS.count_block,
    trialNum: PRMS.count_trial,
  });

}



const STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.response_keys,
    trial_duration: null,
    func: [drawStimulus, drawStimulus],
    func_args: null,
    stimulus_onset: null,
    clear_screen: [1, 1],
    data: {
        stim_type: "grid",
        colour_task_colour: jsPsych.timelineVariable("colour_task_colour"),
        letter_task_letter: jsPsych.timelineVariable("letter_task_letter"),
    },
    on_start: function (trial) {
        "use strict";
        let colours = repeatArray(PRMS.colour_task_nogo, Math.round(PRMS.n_dots));
        if (trial.data.colour_task_colour === PRMS.colour_task_colours[0]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[0],
                    Math.round(PRMS.n_dots * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.colour_task_colours[1],
                        Math.round((PRMS.n_dots * PRMS.colour_task_ratio[0]) / 100),
                    ),
                ),
            );
        } else if (trial.data.colour_task_colour === PRMS.colour_task_colours[1]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[1],
                    Math.round(PRMS.n_dots * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.colour_task_colours[0],
                        Math.round((PRMS.n_dots * PRMS.colour_task_ratio[0]) / 100),
                    ),
                ),
            );
        }

        let letters = repeatArray(PRMS.letter_task_nogo, Math.round(PRMS.n_dots));
        if (trial.data.letter_task_letter === PRMS.letter_task_letters[0]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[0],
                    Math.round(PRMS.n_dots * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.letter_task_letters[1],
                        Math.round((PRMS.n_dots * PRMS.letter_task_ratio[0]) / 100),
                    ),
                ),
            );
        } else if (trial.data.letter_task_letter === PRMS.letter_task_letters[1]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[1],
                    Math.round(PRMS.n_dots * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.letter_task_letters[0],
                        Math.round((PRMS.n_dots * PRMS.letter_task_ratio[0]) / 100),
                    ),
                ),
            );
        }

        trial.stimulus_onset = [0, PERFORMANCE.soa];

    console.log(PERFORMANCE);

        trial.func_args = [
            { draw_dots: true, dots: colours, draw_letters: false, letters: letters },
            { draw_dots: true, dots: colours, draw_letters: true,  letters: letters },
        ];
    },
    on_finish: function () {
        code_trial();
        PRMS.count_trial += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[0]], letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[0]]},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[1]], letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[0]]},
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[0]], letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[1]]},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[1]], letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[1]]},
    { colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: "na",                                     letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[0]]},
    { colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: "na",                                     letter_task_key: KEY_MAPPING[PRMS.letter_task_letters[1]]},
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[0]], letter_task_key: "na"},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: KEY_MAPPING[PRMS.colour_task_colours[1]], letter_task_key: "na"},
];
// console.table(TRIAL_TABLE);

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [STIMULUS],
    timeline_variables: TRIAL_TABLE
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    //exp.push(fullscreen(true));
    //exp.push(browser_check(PRMS.screenRes));
    //exp.push(resize_browser());

    exp.push(COUNT_DOTS);
    exp.push(TRIAL_TIMELINE);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
