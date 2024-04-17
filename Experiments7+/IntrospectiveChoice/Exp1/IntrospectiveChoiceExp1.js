// Reaction time introspective study with two types of trial
// 1) Forced choice vs. 2) Free choice
//
// Participants respond to coloured square frames (red, blue, green, yellow) with
// two colours assigned to the left vs. right hand (forced-choice), one colour to a
// free choice (either left or right), and one colour to a NoGo catch condition.
// Reponses were made using the left/right index finger on keys "X" and "M", respectively.
//
// Stimulus discriminability was manipulated by varying the thickness and colour
// saturation of the lines.
//
// A visual analogue scale (VAS) was used to collect introspective RT estimates,
// with responses made using the mouse/trackpad.
//
// Trial Structure:
// Fixation Cross 500 ms
// Stimulus remained on screen until response (NoGo trials rerminated after 1500ms)
// After free/forced choice trials, VAS scale presented
// “How long was the reaction to the colored square?"
// Next trial initiated with keypress (spacebar)
// After NoGo trials: no response -> Correct (500 ms), response -> Incorrect (1000ms)
//
// Block structure:
// 8 blocks of 70 trials
// 70 trials consisted of 60 free/forced trials and 10 no-go trials
//
// Block feedback
// Showed instruction reminder if >80% response/transition bias in
// free choice trials for 20 seconds
// Also, reminder if >10% errors made

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(120, 120, 120, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "0px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    n_blocks: 9, // number of blocks association phase
    n_trials: 16, // number of trials association phase practice block
    fix_duration: 500, // duration of fixation cross
    fix_size: 10, // duration of the fixation cross
    fix_width: 3, // size of fixation cross
    fix_colour: "White", // colour of the fixation cross
    wait_duration: 1000, // duration following block feedback screen
    block_end_wait_duration: 10000, // duration following block feedback screen
    iti: 500, // duration of inter-trial-interval
    trial_timeout: 1500, // time out duration for NoGo trials
    resp_keys: ["X", "M"],
    resp_colours: shuffle(["Red", "Blue", "Green", "Yellow"]),
    resp_colours_low: {
        Red: "rgb(165, 128, 128)",
        Blue: "rgb(128, 128, 165)",
        Green: "rgb(128, 165, 128)",
        Yellow: "rgb(165, 165, 128)",
    },
    resp_colours_high: {
        Red: "rgb(255, 0, 0)",
        Blue: "rgb(0, 0, 255)",
        Green: "rgb(0, 255, 0)",
        Yellow: "rgb(255, 255, 0)",
    },
    frame_size: [50, 50],
    frame_width: [1, 10],
    frame_position: [0, 0],
    vas_font: "30px Arial",
    count_trial: 1, // count trials
    count_block: 1, // count blocks
};

const DE_EN = { Red: "Rot", Blue: "Blau", Green: "Grün", Yellow: "Gelb" };

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    //type: jsPsychHtmlKeyboardResponseCanvas,
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
              Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
              Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
              um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
              Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        lineheight: 1.5,
        fontsize: 28,
    }),
};

// prettier-ignore
const RESP_MAPPING = generate_formatted_html({
  text: `<span style="color:${PRMS.resp_colours[0]};">${DE_EN[PRMS.resp_colours[0]]}</span>: Linke Taste (${PRMS.resp_keys[0]}-Taste)<br>
<span style="color:${PRMS.resp_colours[1]};">${DE_EN[PRMS.resp_colours[1]]}</span>: Rechte Taste (${PRMS.resp_keys[1]}-Taste)<br>
<span style="color:${PRMS.resp_colours[2]};">${DE_EN[PRMS.resp_colours[2]]}</span>: Freie Zufallswahl Linke oder Rechte Taste (${PRMS.resp_keys[0]}- od. ${PRMS.resp_keys[1]}-Taste)<br><br>
Wenn das Quadrat <span style="color:${PRMS.resp_colours[3]};">${DE_EN[PRMS.resp_colours[3]]}</span> ist dann sollst du KEINE Taste drücken (es geht automatisch weiter)<br>`,
  align: "left",
  colour: "black",
  fontsize: 28,
  lineheight: 1.25,
})

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `In diesem Experiment musst du auf ein farbiges Quadrat reagieren. Verwende hierzu die
Tasten "${PRMS.resp_keys[0]}" oder "${PRMS.resp_keys[1]}" mit dem Zeigefinger deiner linken und rechten Hand.<br><br>
Es gibt vier verschiedene Farben (${DE_EN[PRMS.resp_colours[0]]}, ${DE_EN[PRMS.resp_colours[1]]}, ${
                    DE_EN[PRMS.resp_colours[2]]
                }, ${DE_EN[PRMS.resp_colours[3]]}). Reagiere wie folgt:<br>`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            }) +
            RESP_MAPPING +
            generate_formatted_html({
                text: `Drücke eine beliebige Taste, um fortzufahren.`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            });
    },
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Nachdem du mit dem Tastendruck auf das Quadrat reagiert hast, sollst du einschätzen, wie
lange du in diesem Durchgang gebraucht hast, um auf das Quadrat zu reagieren. Hierzu siehst
du folgende Skala:<br><br>
PICTURE<br><br>
Verwende den Cursor mit deiner Maus/Touchpad, um eine Zeit auf der Skala auszuwählen.
Klicke dann mit der linken Maus-/Touchpad-taste auf die Zeit, von der du denkst, dass sie
Deiner Reaktionszeit entspricht (vom Erscheinen des Quadrats bis zum Tastendruck).<br><br>
                  Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 28,
            lineheight: 1.25,
        });
    },
};

const TASK_INSTRUCTIONS4 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.wait_duration,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `WICHTIG: Wie beschrieben, darfst du zwar entscheiden, mit welchem Finger/Taste du
antwortest, wenn das Quadrat <span style="color:${PRMS.resp_colours[2]};">${
                DE_EN[PRMS.resp_colours[2]]
            }</span> ist, aber du sollst in jedem Durchgang zufällig
entscheiden, welche Antwort du wählst, ohne irgendwelche Strategien zu verwenden.
Versuche, beide Antworten ungefähr gleich häufig auszuwählen, aber du sollst nicht mitzählen
oder vorplanen. Versuche einfach, in jedem Durchgang mit freier Wahl dich spontan/zufällig
für eine Antwort zu entscheiden.<br><br>
Es geht in 30 Sekunden automatisch weiter.`,
            align: "left",
            colour: "black",
            fontsize: 28,
            lineheight: 1.25,
        });
    },
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
                text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
Reagiere zunächst auf das Quadrat wie folgt:`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            }) +
            RESP_MAPPING +
            generate_formatted_html({
                text: `Beachte: Entscheide dich in jedem Durchgang zufällig für eine Antwort ohne irgendwelche
Strategien zu verwenden, wenn du die Wahl hast.Mit der linken Maus/Touchpad-taste sollst Du nach jedem Durchgang einschätzen, wie lange
du für deine Reaktion gebraucht hast.<br><br>
             Drücke eine beliebige Taste, um fortzufahren.</span>`,
                align: "left",
                colour: "black",
                fontsize: 28,
                lineheight: 1.25,
            });
    },
};

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        // Option 1:
        //        trial.stimulus = generate_formatted_html({
        //            text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
        //Kurze Pause. Drücke die Leertaste um fortzufahren.`,
        //            align: "left",
        //            colour: "black",
        //            fontsize: 30,
        //            lineheight: 1.25,
        //        });
        //        trial.response_ends_trial = true;
        //        trial.choices = [" "];
        //    },
        // Option 2:
        //        trial.stimulus =
        //            generate_formatted_html({
        //                text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
        //Achtung: Du hast relativ viele Fehler in diesem Block gemacht. Bitte schaue dir
        //nochmal die Tastenzuordnung und Instruktionen genau an. Reagiere zunächst auf das Quadrat wie folgt:`,
        //                align: "left",
        //                colour: "black",
        //                fontsize: 28,
        //                lineheight: 1.25,
        //            }) +
        //            RESP_MAPPING +
        //            generate_formatted_html({
        //                text: `Beachte: Entscheide dich in jedem Durchgang zufällig für eine Antwort ohne irgendwelche
        //Strategien zu verwenden, wenn du die Wahl hast.<br><br>
        //In 20 Sekunden geht es automatisch weiter...`,
        //                align: "left",
        //                colour: "black",
        //                fontsize: 28,
        //                lineheight: 1.25,
        //            });
        //        trial.response_ends_trial = false;
        //        trial.trial_duration = PRMS.block_end_wait_duration;
        //    },
        // Option 3:
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
Achtung: Du darfst zwar entscheiden, mit welcher Taste du antwortest, wenn du die
Wahl hast, aber du sollst dich in diesen Durchgängen <span style="font-weight: bold">zufällig</span> für eine Antwort entscheiden
und <span style="font-weight: bold">keine Strategien</span> verwenden. Versuche, beide Antworten ungefähr gleich häufig
auszuwählen, aber du sollst nicht mitzählen oder vorplanen.<br><br>
Versuche somit dich in jedem Durchgang mit freier Wahl spontan/zufällig für eine Antwort zu
entscheiden.<br><br>
In 20 Sekunden geht es automatisch weiter...`,
            align: "left",
            colour: "black",
            fontsize: 28,
            lineheight: 1.25,
        });
        trial.response_ends_trial = false;
        trial.trial_duration = PRMS.block_end_wait_duration;
    },
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fix_duration,
    func: draw_fixation_cross,
};

var colors;

function vas() {
    // let ctx = document.getElementById("canvas").getContext("2d");
    // let val = document.querySelector("#jspsych-canvas-slider-response-response").valueAsNumber;
    // // draw text
    // ctx.font = PRMS.vas_font;
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";
    // ctx.fillStyle = "Black";
    // ctx.fillStyle = "Black";
    // ctx.fillText(val, 0, 100);
}

var trial = {
    type: jsPsychCanvasSliderResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    min: 0,
    max: 1500,
    slider_start: 750,
    stimulus: function () {
        vas();
    },
    //labels: ["0", "250", "500", "750", "1000", "1250", "1500"],
    labels: ["0", "750", "1500"],
    prompt: "<p>Wie lang war die Reaktion auf das farbige Quadrat?</p>",
    button_label: "Weiter",
};

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw frame
    ctx.beginPath();
    ctx.lineWidth = args.discriminability === "low" ? PRMS.frame_width[0] : PRMS.frame_width[1];
    ctx.strokeStyle = args.discrim === "low" ? PRMS.resp_colours_low[args.colour] : PRMS.resp_colours_high[args.colour];
    ctx.rect(
        -(PRMS.frame_size[0] / 2) + PRMS.frame_position[0],
        -PRMS.frame_size[1] / 2 + PRMS.frame_position[1],
        PRMS.frame_size[0],
        PRMS.frame_size[1],
    );
    ctx.stroke();
}

// prettier-ignore
const STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.resp_keys,
  func: draw_stimulus,
  func_args: null,
  data: {
    stim: 'ic',
    task_type: jsPsych.timelineVariable("task_type"),
    colour: jsPsych.timelineVariable("colour"),
    discriminability: jsPsych.timelineVariable("discriminability"),
    correct_response1: jsPsych.timelineVariable("correct_response1"),
    correct_response2: jsPsych.timelineVariable("correct_response2"),
  },
  on_start: function(trial) {
    if (trial.data.task_type === "catch") {
      trial.trial_duration = PRMS.trial_timeout;
    }
    trial.func_args = [{colour: trial.data.colour, discrim: trial.data.discriminability}];
  },
  on_finish: function() {
    // code_trial();
    PRMS.count_trial += 1;
  },
};

function draw_iti() {}

const ITI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.iti,
    func: draw_iti,
    func_args: null,
};

// prettier-ignore
const TRIAL_TABLE = [
    { task_type: "forced", colour: PRMS.resp_colours[0], discriminability: "low",  correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[0])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[1], discriminability: "low",  correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[1])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[0], discriminability: "high", correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[0])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[1], discriminability: "high", correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[1])], correct_response2: "na"},
    { task_type: "free",   colour: PRMS.resp_colours[2], discriminability: "low",  correct_response1: PRMS.resp_keys[0],                                               correct_response2: PRMS.resp_keys[1]},
    { task_type: "free",   colour: PRMS.resp_colours[2], discriminability: "high", correct_response1: PRMS.resp_keys[0],                                               correct_response2: PRMS.resp_keys[1]},
    { task_type: "forced", colour: PRMS.resp_colours[0], discriminability: "low",  correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[0])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[1], discriminability: "low",  correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[1])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[0], discriminability: "high", correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[0])], correct_response2: "na"},
    { task_type: "forced", colour: PRMS.resp_colours[1], discriminability: "high", correct_response1: PRMS.resp_keys[PRMS.resp_colours.indexOf(PRMS.resp_colours[1])], correct_response2: "na"},
    { task_type: "free",   colour: PRMS.resp_colours[2], discriminability: "low",  correct_response1: PRMS.resp_keys[0],                                               correct_response2: PRMS.resp_keys[1]},
    { task_type: "free",   colour: PRMS.resp_colours[2], discriminability: "high", correct_response1: PRMS.resp_keys[0],                                               correct_response2: PRMS.resp_keys[1]},
    { task_type: "catch",  colour: PRMS.resp_colours[3], discriminability: "low",  correct_response1: "na",                                                            correct_response2: "na"},
    { task_type: "catch",  colour: PRMS.resp_colours[3], discriminability: "high", correct_response1: "na",                                                            correct_response2: "na"},
];

const TRIAL_TIMELINE = {
    //timeline: [FIXATION_CROSS, STIMULUS, ITI],
    timeline: [trial],
    timeline_variables: TRIAL_TABLE,
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
    saveData("/Common7+/write_data.php", data_fn, { stim: "ic" });
    //saveDataLocal(data_fn, { stim: "ic" });
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

    // exp.push(fullscreen(true));
    // exp.push(browser_check(CANVAS_SIZE));
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));
    // exp.push(mouseCursor(false));

    // general instructions
    //exp.push(TASK_INSTRUCTIONS1);
    // exp.push(TASK_INSTRUCTIONS2);
    // exp.push(TASK_INSTRUCTIONS3);
    // exp.push(TASK_INSTRUCTIONS4);
    // exp.push(BLOCK_START);
    /// exp.push(BLOCK_END);
    exp.push(TRIAL_TIMELINE);

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        // let blk_timeline;
    }

    exp.push(SAVE_DATA);

    // // debrief
    // exp.push(mouseCursor(true));
    // exp.push(end_message());
    // exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
