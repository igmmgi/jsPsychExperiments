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
    colour_task_nogo: "grey",
    letter_task_font: "20px Bold Monospace",
    letter_task_colour: "Black",
    letter_task_offset: 22,
    letter_task_letters: shuffle(["X", "O"]),
    letter_task_nogo: "#",
    dotRadius: 4,
    squareSize: 120,
    dotGaps: 15,
  n_rows: 5,
  n_cols: 5,
};

const EN_DE = { blue: "blau", red: "rot" };

// function calculateNumberOfDots() {
//     // Required for ratio manipulation in VTS
//     PRMS.nDots = 0;
//     for (let rows = -PRMS.squareSize; rows <= PRMS.squareSize; rows += PRMS.dotGaps) {
//         for (let cols = -PRMS.squareSize; cols <= PRMS.squareSize; cols += PRMS.dotGaps) {
//             PRMS.nDots += 1;
//         }
//     }
// }


function calculateNumberOfDots() {
    // Required for ratio manipulation in VTS
    PRMS.nDots = 0;
    for (let rows = 0; rows <= PRMS.n_rows; rows += 1) {
        for (let cols = 0; cols <= PRMS.n_cols; cols += 1) {
            PRMS.nDots += 1;
        }
    }
}



const COUNT_DOTS = {
    type: jsPsychCallFunction,
    func: calculateNumberOfDots,
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
               ruben.ellinghaus@fernuni-hagen.de<br><br>
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
    // draw colour dors
    let radius = PRMS.dotRadius;
    let idx = 0;
    for (let rows = -PRMS.n_cols * PRMS.squareSize; rows <= PRMS.squareSize; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.n_rows * PRMS.squareSize; cols <= PRMS.squareSize; cols += PRMS.dotGaps * 2) {
            let centerX = rows;
            let centerY = cols;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = args.colours[idx];
            ctx.fill();

            // draw text
            ctx.font = PRMS.letter_task_font;
            ctx.fillStyle = PRMS.letter_task_colour;
            ctx.textAlign = "center";
            ctx.fillText(args.letters[idx], centerX, centerY + PRMS.letter_task_offset);

            idx += 1;
        }
    }
}

const STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: null,
    trial_duration: PRMS.tooSlow,
    func: drawStimulus,
    func_args: null,
    data: {
        stim_type: "grid",
        colour_task_ratio: jsPsych.timelineVariable("colour_task_ratio"),
        colour_task_colour: jsPsych.timelineVariable("colour_task_colour"),
        letter_task_ratio: jsPsych.timelineVariable("letter_task_ratio"),
        letter_task_letter: jsPsych.timelineVariable("letter_task_letter"),
    },
    on_start: function (trial) {
        "use strict";
        let dot_colours = repeatArray(PRMS.colour_task_nogo, Math.round(PRMS.nDots));
        if (trial.data.colour_task_colour === PRMS.colour_task_colours[0]) {
            dot_colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[0],
                    Math.round(PRMS.nDots * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.colour_task_colours[1],
                        Math.round((PRMS.nDots * PRMS.colour_task_ratio[0]) / 100),
                    ),
                ),
            );
        } else if (trial.data.colour_task_colour === PRMS.colour_task_colours[1]) {
            dot_colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[1],
                    Math.round(PRMS.nDots * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.colour_task_colours[0],
                        Math.round((PRMS.nDots * PRMS.colour_task_ratio[0]) / 100),
                    ),
                ),
            );
        }

        let letters = repeatArray(PRMS.letter_task_nogo, Math.round(PRMS.nDots));
        if (trial.data.letter_task_letter === PRMS.letter_task_letters[0]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[0],
                    Math.round(PRMS.nDots * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.letter_task_letters[1],
                        Math.round((PRMS.nDots * PRMS.letter_task_ratio[0]) / 100),
                    ),
                ),
            );
        } else if (trial.data.letter_task_letter === PRMS.letter_task_letters[1]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[1],
                    Math.round(PRMS.nDots * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(
                        PRMS.letter_task_letters[0],
                        Math.round((PRMS.nDots * PRMS.letter_task_ratio[0]) / 100),
                    ),
                ),
            );
        }

        trial.func_args = [{ colours: dot_colours, letters: letters }];
    },
    on_finish: function () {
        PRMS.cTrl += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0]},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0]},
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1]},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1]},
    { colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0]},
    { colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1]},
    { colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0]},
    { colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0]},
];

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

  console.log("here")
    // let exp = [];
    // exp.push(fullscreen(true));
    // exp.push(browser_check(PRMS.screenRes));
    // exp.push(resize_browser());

    exp.push(COUNT_DOTS);
    exp.push(TRIAL_TIMELINE);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
