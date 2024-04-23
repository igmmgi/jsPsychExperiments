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
// "How long was the reaction to the colored square?"
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

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.count_block >= 9) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=348&credit_token=367cea26e45247c0b58016ab4fcfdd0a&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

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
    n_blocks: 9, // number of blocks
    n_trials: 70, // number of trials
    fix_duration: 500, // duration of fixation cross
    fix_size: 10, // duration of the fixation cross
    fix_width: 3, // size of fixation cross
    fix_colour: "Black", // colour of the fixation cross
    wait_duration: 2500, // duration following block feedback screen + errors
    stimulus_duration: 400, // duration of stimulus
    block_end_wait_duration: 20000, // duration following block feedback screen
    iti: 700, // duration of inter-trial-interval
    rsi: 100, // duration of interval between rt response and slider scale
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
    frame_width: [4, 10],
    frame_position: [0, 0],
    slider_prompt: "Wie lang war die Reaktion auf das farbige Quadrat?",
    slider_prompt_size: 30,
    slider_start: 750,
    slider_width: 800,
    slider_range: [0, 1500],
    slider_labels: ["0 ms", "", "", "", "", "", "1500 ms"],
    slider_ticks_interval: 250,
    slider_ticks_length: 10,
    slider_ticks_offset: 40,
    slider_ticks_font: "25px monospace",
    slider_prompt_position: [0, -100],
    slider_prompt_text_font: "30px monospace",
    slider_prompt_text_colour: "Black",
    trial_feedback_position: [0, -100],
    trial_feedback_text: ["Falsch!", ""],
    trial_feedback_text_font: "50px monospace",
    trial_feedback_text_colour: "Black",
    trial_feedback_text_position: [0, 0],
    trial_feedback_duration_catch: [1000, 500], // feedback duration catch trials [error, correct]
    trial_feedback_text_catch: ["Falsch!", "Richtig!"], // feedback text catch trials [error, correct]
    trial_feedback_text_position_catch: [0, 0],
    count_trial: 1, // count trials
    count_block: 1, // count blocks
};

const DE_EN = { Red: "Rot", Blue: "Blau", Green: "Grün", Yellow: "Gelb" };

const PERFORMANCE = {
    previous_key: null,
    free_choice_count: { [PRMS.resp_keys[0]]: 0, [PRMS.resp_keys[1]]: 0 },
    free_choice_sequence: { repeat: 0, switch: 0 },
    errors: 0,
    task_correct: null,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
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
  text: `<span style="color:${PRMS.resp_colours[0]};">${DE_EN[PRMS.resp_colours[0]]}</span>/<span style="color:${PRMS.resp_colours_low[PRMS.resp_colours[0]]};">${DE_EN[PRMS.resp_colours[0]]}</span>: Linke Taste (${PRMS.resp_keys[0]}-Taste)<br>
<span style="color:${PRMS.resp_colours[1]};">${DE_EN[PRMS.resp_colours[1]]}</span>/<span style="color:${PRMS.resp_colours_low[PRMS.resp_colours[1]]};">${DE_EN[PRMS.resp_colours[1]]}</span>: Rechte Taste (${PRMS.resp_keys[1]}-Taste)<br>
<span style="color:${PRMS.resp_colours[2]};">${DE_EN[PRMS.resp_colours[2]]}</span>/<span style="color:${PRMS.resp_colours_low[PRMS.resp_colours[2]]};">${DE_EN[PRMS.resp_colours[2]]}</span>: Freie Zufallswahl Linke oder Rechte Taste (${PRMS.resp_keys[0]}- od. ${PRMS.resp_keys[1]}-Taste)<br><br>
Wenn das Quadrat <span style="color:${PRMS.resp_colours[3]};">${DE_EN[PRMS.resp_colours[3]]}</span> /<span style="color:${PRMS.resp_colours_low[PRMS.resp_colours[3]]};">${DE_EN[PRMS.resp_colours[3]]}</span> ist dann sollst du KEINE Taste drücken (es geht automatisch weiter)<br>`,
  align: "left",
  colour: "black",
  fontsize: 28,
  lineheight: 1.25,
});

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
    response_ends_trial: false,
    trial_duration: PRMS.block_end_wait_duration,
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
Es geht in 20 Sekunden automatisch weiter.`,
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
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Nachdem du mit dem Tastendruck auf das Quadrat reagiert hast, sollst du einschätzen, wie
lange du in diesem Durchgang gebraucht hast, um auf das Quadrat zu reagieren. Hierzu siehst
du folgende Skala:<br><br>
 <img src="./images/slider.png" width="100%"><br><br>
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
                text: `<span style="font-weight: bold;">Beachte:</span> Entscheide dich in jedem Durchgang zufällig für eine Antwort ohne irgendwelche
Strategien zu verwenden, wenn du die Wahl hast.<br><span style="font-weight: bold;">Beachte auch: </span>Mit der linken Maus/Touchpad-taste sollst Du nach jedem Durchgang einschätzen, wie lange
du für deine Reaktion gebraucht hast.Nachdem Du eine Zeit gewählt hast, müssen die Finger wieder auf der ${PRMS.resp_keys[0]} bzw. ${PRMS.resp_keys[1]} Taste liegen, bevor Du den nächsten Durchgang mit der Leertaste startest.<br><br>
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
        // calculate some block performance metrics
        let error_bias = PERFORMANCE.errors / PRMS.n_trials > 0.1 ? true : false;

        let response_bias =
            PERFORMANCE.free_choice_count[PRMS.resp_keys[0]] /
            (PERFORMANCE.free_choice_count[PRMS.resp_keys[0]] + PERFORMANCE.free_choice_count[PRMS.resp_keys[1]]);
        response_bias = response_bias < 0.2 || response_bias > 0.8 ? true : false;

        let sequence_bias =
            PERFORMANCE.free_choice_sequence.repeat /
            (PERFORMANCE.free_choice_sequence.repeat + PERFORMANCE.free_choice_sequence.switch);
        sequence_bias = sequence_bias < 0.2 || sequence_bias > 0.8 ? true : false;

        // Option 1:
        if (!error_bias && !response_bias && !sequence_bias) {
            trial.stimulus = generate_formatted_html({
                text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
Kurze Pause. Drücke die Leertaste um fortzufahren.`,
                align: "left",
                colour: "black",
                fontsize: 30,
                lineheight: 1.25,
            });
            trial.response_ends_trial = true;
            trial.choices = [" "];
            return;
        }
        // Option 2:
        if (error_bias) {
            trial.stimulus =
                generate_formatted_html({
                    text: `Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
        Achtung: Du hast relativ viele Fehler in diesem Block gemacht. Bitte schaue dir
        nochmal die Tastenzuordnung und Instruktionen genau an. Reagiere zunächst auf das Quadrat wie folgt:`,
                    align: "left",
                    colour: "black",
                    fontsize: 28,
                    lineheight: 1.25,
                }) +
                RESP_MAPPING +
                generate_formatted_html({
                    text: `Beachte: Entscheide dich in jedem Durchgang zufällig für eine Antwort ohne irgendwelche
        Strategien zu verwenden, wenn du die Wahl hast.<br><br>
        In 20 Sekunden geht es automatisch weiter...`,
                    align: "left",
                    colour: "black",
                    fontsize: 28,
                    lineheight: 1.25,
                });
            trial.response_ends_trial = false;
            trial.trial_duration = PRMS.block_end_wait_duration;
            return;
        }
        // Option 3:
        if (response_bias || sequence_bias) {
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
            return;
        }
    },
    on_finish: function () {
        // reset block performance
        PERFORMANCE.previous_key = null;
        PERFORMANCE.free_choice_count = { [PRMS.resp_keys[0]]: 0, [PRMS.resp_keys[1]]: 0 };
        PERFORMANCE.free_choice_sequence = { repeat: 0, switch: 0 };
        PERFORMANCE.errors = 0;
        PERFORMANCE.task_correct = null;
        PRMS.count_block += 1;
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

function display_slider() {
    let ctx = document.getElementById("canvas").getContext("2d");

    // // show additional error
    // ctx.font = PRMS.trial_feedback_text_font;
    // ctx.fillStyle = PRMS.trial_feedback_text_colour;
    // ctx.fillText(PRMS.trial_feedback_text[correct], PRMS.trial_feedback_position[0], PRMS.trial_feedback_position[1]);

    ctx.textAlign = "center";
    ctx.font = PRMS.slider_prompt_text_font;
    ctx.fillStyle = PRMS.slider_prompt_text_colour;
    ctx.fillText(PRMS.slider_prompt, PRMS.slider_prompt_position[0], PRMS.slider_prompt_position[1]);

    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.font = PRMS.slider_ticks_font;
    let i = 0;
    for (
        let x = -PRMS.slider_width / 2;
        x <= PRMS.slider_width / 2 + 1;
        x += PRMS.slider_ticks_interval * (PRMS.slider_width / PRMS.slider_range[1])
    ) {
        ctx.stroke();
        ctx.moveTo(x, PRMS.slider_ticks_length - PRMS.slider_ticks_offset);
        ctx.lineTo(x, -PRMS.slider_ticks_length - PRMS.slider_ticks_offset);
        ctx.stroke();
        ctx.fillText(PRMS.slider_labels[i], x, 0);
        i += 1;
    }
}

const VAS = {
    type: jsPsychCanvasSliderResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    min: PRMS.slider_range[0],
    max: PRMS.slider_range[1],
    slider_start: PRMS.slider_start,
    slider_width: PRMS.slider_width,
    require_movement: true,
    data: {
        stim: "vas",
        task_type: jsPsych.timelineVariable("task_type"),
        colour: jsPsych.timelineVariable("colour"),
        discriminability: jsPsych.timelineVariable("discriminability"),
        correct_response1: jsPsych.timelineVariable("correct_response1"),
        correct_response2: jsPsych.timelineVariable("correct_response2"),
    },
    stimulus: function () {
        display_slider();
    },
    button_label: null,
    on_start: function (trial) {
        if (PRMS.count_block === 1) {
            trial.button_label = `Nachdem Du eine Zeit gewählt hast, müssen die Finger wieder auf der <br>${PRMS.resp_keys[0]} bzw. ${PRMS.resp_keys[1]} Taste liegen, bevor Du den nächsten Durchgang mit der Leertaste startest.`;
        } else {
            trial.button_label = `<br><br><br>`;
        }
    },
    on_finish: function () {
        code_trial();
    },
};

const IF_NODE_FREE_FORCED = {
    timeline: [VAS],
    conditional_function: function () {
        let dat;
        if (PERFORMANCE.task_correct === 1) {
            dat = jsPsych.data.get().last(2).values()[0];
        } else {
            dat = jsPsych.data.get().last(3).values()[0];
        }
        return dat.task_type !== "catch";
    },
};

function draw_catch_feedback(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // show additional error
    ctx.textAlign = "center";
    ctx.font = PRMS.trial_feedback_text_font;
    ctx.fillStyle = PRMS.trial_feedback_text_colour;
    ctx.fillText(
        PRMS.trial_feedback_text_catch[args.correct],
        PRMS.trial_feedback_text_position_catch[0],
        PRMS.trial_feedback_text_position_catch[1] + 20,
    );
}

const CATCH_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: null,
    func: draw_catch_feedback,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(2).values()[0];
        trial.trial_duration = PRMS.trial_feedback_duration_catch[dat.correct];
        trial.func_args = [{ correct: dat.correct }];
    },
};

const IF_NODE_CATCH = {
    timeline: [CATCH_FEEDBACK],
    conditional_function: function () {
        let dat = jsPsych.data.get().last(2).values()[0];
        return dat.task_type === "catch";
    },
};

const ERROR_MAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.wait_duration,
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Falsch!<br>`,
                align: "left",
                colour: "black",
                fontsize: 38,
                lineheight: 1.25,
            }) + RESP_MAPPING;
    },
};

const IF_NODE_ERROR = {
    timeline: [ERROR_MAPPING],
    conditional_function: function () {
        let dat = jsPsych.data.get().last(2).values()[0];
        return dat.correct === 0;
    },
};

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw frame
    ctx.beginPath();
    ctx.lineWidth = args.discrim === "low" ? PRMS.frame_width[0] : PRMS.frame_width[1];
    ctx.strokeStyle = args.discrim === "low" ? PRMS.resp_colours_low[args.colour] : PRMS.resp_colours_high[args.colour];
    ctx.rect(
        -(PRMS.frame_size[0] / 2) + PRMS.frame_position[0],
        -PRMS.frame_size[1] / 2 + PRMS.frame_position[1],
        PRMS.frame_size[0],
        PRMS.frame_size[1],
    );
    ctx.stroke();
}

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let correct;
    if (dat.stim === "task") {
        if (PERFORMANCE.previous_key !== null) {
            if (PERFORMANCE.previous_key === dat.key_press) {
                PERFORMANCE.free_choice_sequence.repeat += 1;
            } else if (PERFORMANCE.previous_key !== dat.key_press) {
                PERFORMANCE.free_choice_sequence.switch += 1;
            }
        }
        PERFORMANCE.previous_key = dat.key_press;
        if (dat.task_type === "forced") {
            // one correct response
            correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response1) ? 1 : 0;
        } else if (dat.task_type === "free") {
            // both responses correct
            let correct1 = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response1) ? 1 : 0;
            let correct2 = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_response2) ? 1 : 0;
            correct = correct1 || correct2;
            PERFORMANCE.free_choice_count[dat.key_press.toUpperCase()] += 1;
        } else if (dat.task_type === "catch") {
            // NoGo response
            if (dat.rt === null) {
                dat.rt = PRMS.trial_timeout;
                dat.key_press = "na";
                correct = 1;
            } else {
                correct = 0;
            }
        }
        dat.response = null;
        dat.slider_start = null;
        PERFORMANCE.task_correct = correct;
    } else {
        let datp;
        if (PERFORMANCE.task_correct) {
            datp = jsPsych.data.get().last(3).values()[0];
        } else {
            datp = jsPsych.data.get().last(4).values()[0];
        }
        correct = datp.correct;
        dat.task_rt = datp.rt;
        dat.task_key = datp.key_press;
        dat.slider_rt = dat.rt;
    }
    if (correct === 0) {
        PERFORMANCE.errors += 1;
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_number: PRMS.count_block,
        trial_number: PRMS.count_trial,
        correct: correct,
    });
}

// prettier-ignore
const STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  stimulus_duration: PRMS.stimulus_duration,
  choices: PRMS.resp_keys,
  func: draw_stimulus,
  func_args: null,
  data: {
    stim: 'task',
    task_type: jsPsych.timelineVariable("task_type"),
    colour: jsPsych.timelineVariable("colour"),
    discriminability: jsPsych.timelineVariable("discriminability"),
    correct_response1: jsPsych.timelineVariable("correct_response1"),
    correct_response2: jsPsych.timelineVariable("correct_response2"),
  },
  on_start: function(trial) {
    if (trial.data.task_type === "catch") {
      trial.trial_duration = PRMS.trial_timeout;
    } else {
      trial.trial_duration = null;
    }
    trial.func_args = [{colour: trial.data.colour, discrim: trial.data.discriminability}];
  },
  on_finish: function() {
    code_trial();
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
    on_finish: function () {
        PRMS.count_trial += 1;
    },
};

function draw_rsi() {}

const RSI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.rsi,
    func: draw_rsi,
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
    timeline: [FIXATION_CROSS, STIMULUS, RSI, IF_NODE_ERROR, IF_NODE_FREE_FORCED, IF_NODE_CATCH, ITI],
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
    saveData("/Common7+/write_data.php", data_fn, [{ stim: "vas" }], "csv", [
        "stimulus",
        "trial_type",
        "internal_node_id",
        "trial_index",
        "time_elapsed",
        "rt",
        "key_press",
    ]);
    //saveDataLocal(data_fn, [{ stim: "task" }, { stim: "vas" }], "csv", [
    //    "stimulus",
    //    "trial_type",
    //    "internal_node_id",
    //    "trial_index",
    //    "time_elapsed",
    //    "rt",
    //    "key_press",
    //]);
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
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));

    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);
    exp.push(TASK_INSTRUCTIONS4);
    exp.push(mouseCursor(false));

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.n_trials / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_END);
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(end_message());
    exp.push(mouseCursor(true));
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
