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
// SOA determined by repeat (+X ms) vs switch (-X ms) free choice trials
// Blocks 1 and 2- Trial feedback for 1000 ms (correct vs. incorrect)
// Blank inter-trial-interval for 1000 ms

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.count_block >= 10) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=353&credit_token=53fd0370d86f474d9604675615ba7bec&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

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
    screen_res: [960, 720], // minimum screen resolution requested
    n_blocks: 10,
    n_trials: 64,
    fixation_size: 15, // length of the fixation cross
    fixation_width: 5, // line thickness of fixation cross
    fixation_duration: 500, // duration of the fixation cross
    feedback_duration_practice: 1600, // duration of the feedback practice
    feedback_duration_experiment: 0, // duration of the feedback experiment
    feedback_text: ["Richtig!", "Falsch!", "Zu Schnell!"], // feedback text
    iti: 1000,
    grid_size: [1, 5], // rows, cols (1 row but with two tasks)
    grid_gaps: [0, 26], // rows, cols
    task_side: shuffle(["Colour", "Letter"]),
    task_position: shuffle(["Colour", "Letter"]),
    colour_task_colours: shuffle(["blue", "red"]),
    colour_task_nogo: ["grey"],
    colour_task_ratio: [35, 65], // should sum to 100!
    colour_task_offset: null,
    colour_task_dot_size: 12,
    colour_task_dot_size_nogo: 8,
    letter_task_letters: shuffle(["X", "O"]),
    letter_task_nogo: ["#"],
    letter_task_ratio: [35, 65], // should sum to 100!
    letter_task_font: "bold 34px Monospace",
    letter_task_font_nogo: "bold 24px Monospace",
    letter_task_colour: "Black",
    letter_task_offset: null,
    soa_step: 50,
    response_keys_lh: ["Q", "W"],
    response_keys_rh: ["O", "P"],
    response_keys: ["Q", "W", "O", "P"],
    key_mapping: {},
    count_block: 1,
    count_trial: 1,
};

const COLOUR_VALUES = { blue: "rgb(0, 0, 130)", red: "rgb(130, 0, 0)", grey: "rgb(120, 120, 120)" };

if (PRMS.task_side[0] === "Colour") {
    PRMS.response_keys_colour = PRMS.response_keys_lh;
    PRMS.response_keys_letter = PRMS.response_keys_rh;
    PRMS.response_stimuli = PRMS.colour_task_colours.concat(PRMS.letter_task_letters);
    PRMS.key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_lh[0];
    PRMS.key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_lh[1];
    PRMS.key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_rh[0];
    PRMS.key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_rh[1];
} else if (PRMS.task_side[0] === "Letter") {
    PRMS.response_keys_letter = PRMS.response_keys_lh;
    PRMS.response_keys_colour = PRMS.response_keys_rh;
    PRMS.response_stimuli = PRMS.letter_task_letters.concat(PRMS.colour_task_colours);
    PRMS.key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_lh[0];
    PRMS.key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_lh[1];
    PRMS.key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_rh[0];
    PRMS.key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_rh[1];
}
PRMS.response_keys = PRMS.response_keys_lh.concat(PRMS.response_keys_rh);

if (PRMS.task_position[0] === "Colour") {
    PRMS.colour_task_offset = -15;
    PRMS.letter_task_offset = 2;
} else if (PRMS.task_position[1] === "Colour") {
    PRMS.colour_task_offset = 15;
    PRMS.letter_task_offset = -28;
}

jsPsych.data.addProperties({ task_left_hand: PRMS.task_side[0], task_top_position: PRMS.task_position[0] });

const EN_DE = {
    blue: "Blau",
    red: "Rot",
    grey: "Grau",
    X: "X",
    O: "O",
    Letter: "Buchstabeaufgabe",
    Colour: "Farbaufgabe",
};

const PERFORMANCE = {
    n_repetitions: 0,
    n_switches: 0,
    soa: 0,
    previous_task: null,
    time: new Date(),
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
Du wirst nach dem Experiment auf SONA zurückgeleitet um die VP-Stunde zu erhalten.
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

const TASK_INSTRUCTIONS_TEXT = generate_formatted_html({
    text: `In diesem Experiment gibt es <span style="font-weight: bold;">zwei</span> Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
<span style="font-weight: bold;">${EN_DE[PRMS.task_side[0]]}</span> = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten <span style="font-weight: bold;">"${PRMS.response_keys_lh[0]}"</span> und <span style="font-weight:bold;">"${PRMS.response_keys_lh[1]}"</span>.<br><br>
<span style="font-weight: bold;">${EN_DE[PRMS.task_side[1]]}</span> = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten <span style="font-weight: bold;">"${PRMS.response_keys_rh[0]}"</span> und <span style="font-weight:bold;">"${PRMS.response_keys_rh[1]}"</span>.<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
    align: "left",
    fontsize: 30,
    width: "1200px",
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: TASK_INSTRUCTIONS_TEXT,
};

const RESPONSE_MAPPING = generate_formatted_html({
    text: `${EN_DE[PRMS.task_side[0]]} = Linke Hand ${"&emsp;".repeat(6)} ${EN_DE[PRMS.task_side[1]]} = Rechte Hand<br>
${EN_DE[PRMS.response_stimuli[0]]} ${pad_me("vs.", 28)} ${EN_DE[PRMS.response_stimuli[1]]}${"&emsp;".repeat(12)}${EN_DE[PRMS.response_stimuli[2]]} ${pad_me("vs.", 25)} ${EN_DE[PRMS.response_stimuli[3]]}<br>
(${PRMS.response_keys[0]}-Taste) ${"&emsp;".repeat(3)}(${PRMS.response_keys[1]}-Taste)${"&emsp;".repeat(11)}(${PRMS.response_keys[2]}-Taste)${"&emsp;".repeat(3)}(${PRMS.response_keys[3]}-Taste)`,
    align: "center",
    fontsize: 30,
    width: "1200px",
    bold: true,
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Für die Buchstabenaufgabe musst Du entscheiden, ob der Mehrheit der Buchstabe "${PRMS.letter_task_letters[0]}" oder "${PRMS.letter_task_letters[1]}" ist.<br><br>
Für die Farbaufgabe musst Du entscheiden, ob die Mehrheit der Punkte ${EN_DE[PRMS.colour_task_colours[0]]} oder ${EN_DE[PRMS.colour_task_colours[1]]} ist. Es gilt: `,
            align: "left",
            fontsize: 26,
            width: "1200px",
            lineheight: 1.25,
        }) +
        RESPONSE_MAPPING +
        generate_formatted_html({
            text: `Du darfst frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest wenn beide Aufgaben (Buchstabe und Farbe) eine Antwort erfordern.<br><br>
Wenn statt den Buchstabe jedoch "###" erscheinen, dann musst du die Farbaufgabe bearbeiten.<br><br>
Wenn statt den farbigen Punkte graue Punkte erscheinen, dann musst du die Buchstabenaufgabe bearbeiten.<br><br>
Drücke eine beliebige Taste, um fortzufahren!`,
            align: "left",
            fontsize: 26,
            width: "1200px",
            lineheight: 1.25,
        }),
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
Du darfst frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest, wenn beide Aufgaben (Buchstabe und Farbe) eine Antwort erfordern.<br><br>
Wenn jedoch nur ein Aufgabe eine Antwort erfordert, dann musst du diese Aufgabe bearbeiten.<br><br>
Die ersten zwei Blöcken hast du Gelegenheit zu üben.<br><br>
Drücke eine beliebige Taste um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.25,
    }),
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben eine Antwort erfordern.<br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            });
    },
    on_finish: function () {
        PERFORMANCE.time = new Date();
    },
};

function calculate_block_performance({ filter_options = {} } = {}) {
    let dat = jsPsych.data.get().filter(filter_options);

    let n_total = dat.count();
    let n_error = dat.select("error").values.filter(function (x) {
        return x !== 0;
    }).length;
    let total_rt = Math.round(dat.select("rt").sum());
    let error_rate = Math.round((n_error / n_total) * 100);

    return { total_rt: total_rt, error_rate: error_rate };
}

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: {
                stim_type: "vtse",
                block: PRMS.count_block,
            },
        });

        let additional_text = "";
        if (block_dvs["error_rate"] < 15) {
            additional_text =
                "Du machst zwar wenige Fehler, aber du bist zu langsam! WICHTIG: Versuche im nächsten Block schneller zu sein auch wenn du dabei etwas mehr Fehler machst";
        } else if (block_dvs["error_rate"] > 30) {
            additional_text =
                "Du bist zwar schnell, aber du machst etwas zu viele Fehler! WICHTIG: Versuche im nächsten Block etwas weniger Fehler zu machen auch wenn du dabei etwas langsamer bist!";
        } else {
            additional_text = "*** Super!!! ***--—du bist schnell und machst nicht zuviele Fehler! Weiter so!";
        }

        let time = (new Date() - PERFORMANCE.time) / 1000;
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.count_block} von ${PRMS.n_blocks}: Kurze Pause<br><br>
Dein Feedback:
            ${additional_text}<br><br>
             Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        PRMS.count_block += 1;
        PRMS.count_trial = 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = [1, 2].includes(PRMS.count_block)
            ? PRMS.feedback_duration_practice
            : PRMS.feedback_duration_experiment;
        if (trial.trial_duration !== 0) {
            trial.stimulus = generate_formatted_html({
                text: `${PRMS.feedback_text[dat.error]}`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            });
            if (dat.error === 1) {
                trial.stimulus += RESPONSE_MAPPING;
            }
        }
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
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = PRMS.fixation_width;
    ctx.moveTo(-PRMS.fixation_size, 0);
    ctx.lineTo(PRMS.fixation_size, 0);
    ctx.moveTo(0, -PRMS.fixation_size);
    ctx.lineTo(0, PRMS.fixation_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixation_duration,
    func: draw_fixation_cross,
};

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    let idx = 0;
    let centerX;
    let centerY = ((PRMS.grid_size[0] - 1) / 2) * PRMS.grid_gaps[0];
    let dot_size = args.free_forced === "forced_letter" ? PRMS.colour_task_dot_size_nogo : PRMS.colour_task_dot_size;

    // some canvas text properties
    ctx.font = args.free_forced === "forced_colour" ? PRMS.letter_task_font_nogo : PRMS.letter_task_font;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let rows = 0; rows < PRMS.grid_size[0]; rows += 1) {
        centerX = -(((PRMS.grid_size[1] - 1) / 2) * PRMS.grid_gaps[1]);
        for (let cols = 0; cols < PRMS.grid_size[1]; cols += 1) {
            // draw dots
            if (args.draw_dots) {
                ctx.beginPath();
                ctx.arc(centerX, centerY + PRMS.colour_task_offset, dot_size, 0, 2 * Math.PI, false);
                ctx.fillStyle = COLOUR_VALUES[args.dots[idx]];
                ctx.fill();
            }

            // draw letters
            if (args.draw_letters) {
                ctx.fillStyle = PRMS.letter_task_colour;
                ctx.fillText(args.letters[idx], centerX, centerY + PRMS.letter_task_offset);
            }

            idx += 1;
            centerX += PRMS.grid_gaps[1];
        }
        centerY -= PRMS.grid_gaps[0];
    }

    // // fixation cross for piloting positions
    // ctx.beginPath();
    // ctx.moveTo(-200, 0);
    // ctx.lineTo(200, 0);
    // ctx.stroke();
    // ctx.moveTo(0, -200);
    // ctx.lineTo(0, 200);
    // ctx.stroke();
}

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // which task did they perform?
    let responded_letter = PRMS.response_keys_letter.includes(dat.key_press.toUpperCase());
    let responded_colour = PRMS.response_keys_colour.includes(dat.key_press.toUpperCase());
    let response_task = responded_letter && !responded_colour ? "Letter" : "Colour";

    // adjust rt according to responded stimulus
    if (response_task === dat.s2) {
        dat.rt = dat.rt - PERFORMANCE.soa;
    }

    let error = 0;
    if (responded_letter & (dat.key_press.toUpperCase() !== dat.letter_task_key)) {
        error = 1;
    } else if (responded_colour & (dat.key_press.toUpperCase() !== dat.colour_task_key)) {
        error = 1;
    }

    if (dat.rt < 0) {
        error = 2; // too fast
    }

    let repetition_switch = "na";
    if (PERFORMANCE.previous_task !== null) {
        repetition_switch = response_task === PERFORMANCE.previous_task ? "repetition" : "switch";
    }

    // get current trial soa
    let soa = PERFORMANCE.soa;

    // adjust soa for next trial
    if (repetition_switch === "repetition") {
        PERFORMANCE.n_repetitions += 1;
        PERFORMANCE.soa += dat.free_forced === "free" ? PRMS.soa_step : 0;
    } else if (repetition_switch === "switch") {
        PERFORMANCE.n_switches += 1;
        PERFORMANCE.soa -= dat.free_forced === "free" ? PRMS.soa_step : 0;
    }
    PERFORMANCE.previous_task = response_task;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        response_task: response_task,
        repetition_switch: repetition_switch,
        n_repetitions: PERFORMANCE.n_repetitions,
        n_switches: PERFORMANCE.n_switches,
        soa: soa,
        error: error,
        block: PRMS.count_block,
        trial: PRMS.count_trial,
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
    func: [draw_stimulus, draw_stimulus],
    func_args: null,
    stimulus_onset: null,
    clear_screen: [1, 1],
    data: {
        stim_type: "vtse",
        free_forced: jsPsych.timelineVariable("free_forced"),
        colour_task_colour: jsPsych.timelineVariable("colour_task_colour"),
        colour_task_key: jsPsych.timelineVariable("colour_task_key"),
        letter_task_letter: jsPsych.timelineVariable("letter_task_letter"),
        letter_task_key: jsPsych.timelineVariable("letter_task_key"),
    },
    on_start: function (trial) {
        "use strict";
        let n_stimuli = PRMS.grid_size[0] * PRMS.grid_size[1];

        // colour task
        let colours = repeatArray(PRMS.colour_task_nogo, Math.round(n_stimuli));
        if (trial.data.colour_task_colour === PRMS.colour_task_colours[0]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[0],
                    Math.round(n_stimuli * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.colour_task_colours[1], Math.round((n_stimuli * PRMS.colour_task_ratio[0]) / 100)),
                ),
            );
        } else if (trial.data.colour_task_colour === PRMS.colour_task_colours[1]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[1],
                    Math.round(n_stimuli * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.colour_task_colours[0], Math.round((n_stimuli * PRMS.colour_task_ratio[0]) / 100)),
                ),
            );
        }

        // letter task
        let letters = repeatArray(PRMS.letter_task_nogo, Math.round(n_stimuli));
        if (trial.data.letter_task_letter === PRMS.letter_task_letters[0]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[0],
                    Math.round(n_stimuli * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.letter_task_letters[1], Math.round((n_stimuli * PRMS.letter_task_ratio[0]) / 100)),
                ),
            );
        } else if (trial.data.letter_task_letter === PRMS.letter_task_letters[1]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[1],
                    Math.round(n_stimuli * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.letter_task_letters[0], Math.round((n_stimuli * PRMS.letter_task_ratio[0]) / 100)),
                ),
            );
        }

        // task order
        trial.stimulus_onset = [0, Math.abs(PERFORMANCE.soa)];

        if (PERFORMANCE.soa > 0 && PERFORMANCE.previous_task === "Letter") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: false,
                    letters: letters,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
            ];
            trial.data.s1 = "Colour";
            trial.data.s2 = "Letter";
        } else if (PERFORMANCE.soa > 0 && PERFORMANCE.previous_task === "Colour") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: false,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
            ];
            trial.data.s1 = "Letter";
            trial.data.s2 = "Colour";
        } else if (PERFORMANCE.soa < 0 && PERFORMANCE.previous_task === "Colour") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: false,
                    letters: letters,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
            ];
            trial.data.s1 = "Colour";
            trial.data.s2 = "Letter";
        } else if (PERFORMANCE.soa < 0 && PERFORMANCE.previous_task === "Letter") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: false,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
            ];
            trial.data.s1 = "Letter";
            trial.data.s2 = "Colour";
        } else if (PERFORMANCE.soa === 0) {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                },
            ];
            trial.data.s1 = "Simultaneous";
            trial.data.s2 = "Simultaneous";
        }
    },
    on_finish: function () {
        code_trial();
        PRMS.count_trial += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
   { free_forced: "free",          colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]]},
   { free_forced: "free",          colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]]},
   { free_forced: "free",          colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]]},
   { free_forced: "free",          colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]]},
   { free_forced: "forced_letter", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]]},
   { free_forced: "forced_letter", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]]},
   { free_forced: "forced_colour", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: "na"},
   { free_forced: "forced_colour", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: "na"},
];
// console.table(TRIAL_TABLE);

// prettier-ignore
const TRIAL_TIMELINE = {
  timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });
    saveData("/Common/write_data.php", `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vtse" });
    // saveDataLocal(`${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vtse" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 2000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    // // setup
    // exp.push(fullscreen(true));
    // exp.push(browser_check(PRMS.screen_res));
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    // exp.push(mouseCursor(false));

    // // instructions
    // exp.push(WELCOME_INSTRUCTIONS);
    // exp.push(TASK_INSTRUCTIONS1);
    // exp.push(TASK_INSTRUCTIONS2);
    // exp.push(TASK_INSTRUCTIONS3);

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        // exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.n_trials / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        if (blk < PRMS.n_blocks - 1) {
            exp.push(BLOCK_END);
        }
    }

    // debrief
    exp.push(mouseCursor(true));

    // save data
    exp.push(SAVE_DATA);

    // end
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
