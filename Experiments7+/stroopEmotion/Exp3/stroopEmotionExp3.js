// Emotional Stroop task with participants classifying a word (FREUDE, ANGST) as +ve/-ve, whilst
//  ignoring task-irrelevant facial expressions
// Feeling of control is manipulated at the start of the experiment (between-subject factor)
// Task relevant words (FREUDE, ANGST) written in blue font and positioned below the eyes
// Task irrelevant faces (64 images in total; 16 male, 16 female with happy/fearful expressions)
// Responses made with left/right index fingers (Q/P keys)
//
// Block structure
// 24 mini blocks of 32 randomly ordered trials with each actor appearing once in each block
//
// Trial structure
// Fixation cross for 400 ms
// Face + word presented at centre of screen
// Correct responses -> next trial after blank screen of 500 ms
// Error responses -> additional 1.5 screen showing type of error -> next trials after blank of 500 ms
//
// Between-subject control manipulation
// Mood indication screen Likert 5 point
// Choice screen Reaction vs. Attention task (actually both the same)
// Further selections: colour of background screen, font type + font size

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.cBlk >= 13) {
            window.location.assign(
                "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=342&credit_token=40cc144c18064be29b5145fb43a94e36&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    nBlks: 13, // number of blocks
    fixDur: 400, // duration of fixation cross
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixColor: "Black", // colour of the fixation cross
    fbDur: 1500, // duration of feedback for each type
    waitDur: 1000, // duration following block feedback screen
    thinkDur: 20000, // thinking duration during inital questions
    iti: 500, // duration of inter-trial-interval
    tooFast: 0, // responses faster than x ms -> too fast!
    tooSlow: 2000, // response slower than x ms -> too slow!
    respKeys: ["Q", "P"],
    distractor_emotion: ["Angst", "Freude"],
    distractor_position: [0, -20],
    target_text_emotion: shuffle(["ANGST", "FREUDE"]),
    target_text_position: [0, 15],
    target_text_font: "bold 55px",
    target_text_colour: "White",
    feedback_text: ["", "Falsch!", "Zu langsam!", "Zu schnell!!"],
    feedback_text_font: "30px",
    feedback_text_colour: "Black",
    feedback_text_position: [0, 0],
    fbTxtSizeBlock: 26,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
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
              um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 20 Minuten konzentriert zu arbeiten.<br><br>
              Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        lineheight: 1.5,
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `<span style="font-family: ${CHOICES.font_choice}">Du bearbeitest nun die <span style="font-weight: bold">${CHOICES.task_choice_de}</span><br><br>
In diesem Experiment siehst du Gesichter mit den freudigen und ängstlichen Emotionen und ein Wort. 
Bitte entscheide in jedem Durchgang, ob das Wort "Freude" oder "Angst" ist und ignoriere das Gesicht.<br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
"Q" = ${PRMS.target_text_emotion[0]} Word &emsp; "P" = ${PRMS.target_text_emotion[1]} Wort<br><br>
Bitte antworte so schnell und so genau wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.</span>`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
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
        trial.stimulus = generate_formatted_html({
            text: `<span style="font-family: ${CHOICES.font_choice}"><span style="font-weight: bold">${CHOICES.task_choice_de}</span><br><br>
             Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             "Q" = ${PRMS.target_text_emotion[0]} Wort &emsp; "P" = ${PRMS.target_text_emotion[1]} Wort<br><br>
             Drücke eine beliebige Taste, um fortzufahren.</span>`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

// pre-load images
const PRELOAD = {
    type: jsPsychPreload,
    images: [FEAR_IMAGES, HAPPY_IMAGES],
};

////////////////////////////////////////////////////////////////////////
//             Control manipulation screens                           //
////////////////////////////////////////////////////////////////////////
const CHOICES = {
    mood: null,
    task_choice: null,
    task_choice_de: null,
    colour_choice: null,
    colour_choice_hex: null,
    font_choice: null,
};

const MOOD_SCALE = ["😢", "🙁", "😐", "🙂", "😀"];

// prettier-ignore
const MOOD_QUESTION = [
  { prompt: 'Wie fühlst du dich gerade?', name: 'mood', labels: MOOD_SCALE, required: true },
];

const MOOD_QUESTIONNAIRE = {
    type: jsPsychSurveyLikert,
    preamble: "",
    questions: MOOD_QUESTION,
    scale_width: 400,
    button_label: "Weiter",
    post_trial_gap: 1000,
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        CHOICES.mood = dat.response.mood;
        jsPsych.data.addProperties({ mood: CHOICES.mood });
    },
};

const CHOICE_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Aktuelle Forschung zeigt, dass die Möglichkeit, zu wählen, eine positive Auswirkung auf die Aufgabenleistung hat.<br><br>
Für dieses Experiment darfst du verschiedene Einstellungen und die Aufgabe welche du bearbeiten willst wählen:<br><br>
Zum Weitermachen drücke bitte eine beliebige Taste.`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.5,
    }),
};

const COLOUR_CHOICE_SCREEN1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    trial_duration: PRMS.thinkDur,
    stimulus: generate_formatted_html({
        text: `Die nächsten 20 Sekunden darfst du nun entscheiden, welche Farbe der Hintergrund in deinem Experiment haben soll:<br><br>
<span style="color: Blue;">Blau</span> oder <span style="color: Green;">Grün</span>?<br><br>
Es geht in 20 Sekunden automatisch weiter.`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.5,
    }),
};

const COLOUR_CHOICE_SCREEN2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: ["1", "2"],
    stimulus: generate_formatted_html({
        text: `Du hast die freie Wahl.<br><br>
Bitte entscheide dich jetzt, welche Hintergrundfarbe du möchtest:<br><br>
• Die Taste "1" für <span style="color:#0000FF; font-weight: bold">Blau</span><br>
• Die Taste "2" für <span style="color:#259F25; font-weight: bold">Grün</span><br>`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.5,
    }),
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.key_press === "1") {
            CHOICES.colour_choice = "blue";
            CHOICES.colour_choice_hex = "#0000FF";
        } else if (dat.key_press === "2") {
            CHOICES.colour_choice = "green";
            CHOICES.colour_choice_hex = "#259F25";
        }
        document.body.style.background = CHOICES.colour_choice_hex;
        jsPsych.data.addProperties({ colour_choice: CHOICES.colour_choice });
    },
};

const FONT_CHOICE_SCREEN1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    trial_duration: PRMS.thinkDur,
    stimulus: generate_formatted_html({
        text: `Im folgenden Experiment musst du Wörter klassifizieren. Die nächsten 20 Sekunden darfst du
nun entscheiden, in welcher Schriftart die Wörter präsentiert werden sollen.<br><br>
• <span style="font-weight: bold; font-family: Comic Sans MS, Comic Sans, cursive;">Schriftart Eins</span><br>
• <span style="font-weight: bold; font-family: Georgia, Times, serif;">Schriftart Zwei</span><br><br>
Es geht in 20 Sekunden automatisch weiter.`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.5,
    }),
};

const FONT_CHOICE_SCREEN2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: ["1", "2"],
    stimulus: generate_formatted_html({
        text: `Du hast die freie Wahl.<br><br>
Bitte entscheide dich jetzt, welche Schriftart du möchtest:<br><br>
• Die Taste "1" für <span style="font-weight: bold; font-family: Comic Sans MS, Comic Sans, cursive;">Schriftart Zwei</span><br>
• Die Taste "2" für <span style="font-weight: bold; font-family: Georgia, Times, serif;">Schriftart Drei</span>`,
        align: "left",
        colour: "black",
        fontsize: 30,
        lineheight: 1.5,
    }),
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.key_press === "1") {
            CHOICES.font_choice = "Comic Sans MS, Comic Sans, cursive";
        } else if (dat.key_press === "2") {
            CHOICES.font_choice = "Georgia, Times, serif";
        }
        PRMS.target_text_font = PRMS.target_text_font.concat(" ", CHOICES.font_choice);
        jsPsych.data.addProperties({ font_choice: CHOICES.font_choice });
    },
};

const TASK_CHOICE_SCREEN1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    trial_duration: PRMS.thinkDur,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `<span style="font-family: ${CHOICES.font_choice}">Die Forschung zeigt auch, dass die Möglichkeit, die Aufgabe zu wählen, eine positive Auswirkung auf die Aufgabenleistung hat.<br><br> 
Du darfst somit entscheiden, welche Aufgabe du für die nächsten ca. 20 min bearbeiten möchtest:<br><br> 
Bitte überlege nun die nächsten 20 Sekunden welche Aufgabe du bearbeiten möchtest.<br><br>
• Reaktions-Aufgabe: Erforderd insbesondere deine Handlungsfähigkeit heraus.<br>
• Aufmerksamkeits-Aufgabe:  Erfordert insbesondere deine Fähigkeit zur Zuordnung von angezeigten Reizen.<br><br>
               Es geht in 20 Sekunden automatische weiter.</span>`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
        });
    },
};

const TASK_CHOICE_SCREEN2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: ["1", "2"],
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `<span style="font-family: ${CHOICES.font_choice}">Du hast die freie Wahl.<br>
Bitte entscheide dich jetzt, welche Aufgabe du bearbeiten willst und drücke:<br><br>
• Die Taste "1" für die "Reaktions-Aufgabe"<br><br>
ODER<br><br>
• Die Taste "2" für die "Aufmerksamkeits-Aufgabe"</span>`,
            align: "left",
            colour: "black",
            fontsize: 30,
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.key_press === "1") {
            CHOICES.task_choice = "reaction_task";
            CHOICES.task_choice_de = "Reaktions-Aufgabe";
        } else if (dat.key_press === "2") {
            CHOICES.task_choice = "attention_task";
            CHOICES.task_choice_de = "Aufmerksamkeits-Aufgabe";
        }
        jsPsych.data.addProperties({ task_choice: CHOICES.task_choice });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = PRMS.fixWidth;
    ctx.strokeStyle = PRMS.fixColor;
    ctx.moveTo(-PRMS.fixSize, 0);
    ctx.lineTo(PRMS.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fixSize);
    ctx.lineTo(0, PRMS.fixSize);
    ctx.stroke();

    // display task-choice text
    ctx.font = "40px".concat(" ", CHOICES.font_choice);
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText(CHOICES.task_choice_de, 0, -250);
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
    func: draw_fixation_cross,
};

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);

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

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // image
    const img = new Image();
    img.src = args.distractor;
    ctx.drawImage(img, PRMS.distractor_position[0] - img.width / 2, PRMS.distractor_position[1] - img.height / 2);

    // text
    ctx.font = PRMS.target_text_font;
    ctx.textAlign = "center";
    ctx.fillStyle = PRMS.target_text_colour;
    ctx.fillText(args.target, PRMS.target_text_position[0], PRMS.target_text_position[1]);

    // display task-choice text
    ctx.font = "40px".concat(" ", CHOICES.font_choice);
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText(CHOICES.task_choice_de, 0, -250);
}

// prettier-ignore
const STROOP_STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: null,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: PRMS.tooSlow,
    func: draw_stimulus,
    func_args: null,
    data: {
        stim: 'stroop',
        target: jsPsych.timelineVariable('target'),
        distractor: jsPsych.timelineVariable('distractor'),
        compatibility: jsPsych.timelineVariable('comp'),
        corrResp: jsPsych.timelineVariable('key'),
    },
    on_start: function(trial) {
        trial.func_args = [{ target: trial.data.target, distractor: trial.data.distractor }];
    },
    on_finish: function() {
        code_trial();
        PRMS.cTrl += 1;
    },
};

function draw_feedback(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.textAlign = "center";
    ctx.font = PRMS.feedback_text_font.concat(" ", CHOICES.font_choice);
    ctx.fillStyle = PRMS.feedback_text_colour;
    ctx.fillText(args.feedback, PRMS.feedback_text_position[0], PRMS.feedback_text_position[1]);

    // display task-choice text
    ctx.font = "40px".concat(" ", CHOICES.font_choice);
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText(CHOICES.task_choice_de, 0, -250);
}

const TRIAL_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fbDur,
    func: draw_feedback,
    func_args: null,
    stimulus: "",
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.func_args = [{ feedback: PRMS.feedback_text[dat.corrCode - 1] }];
    },
};

const IF_ERROR = {
    timeline: [TRIAL_FEEDBACK],
    conditional_function: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        return dat.corrCode !== 1;
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "stroop", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-family: ${CHOICES.font_choice}; font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

function generate_trials_within_block(fear_set, happy_set) {
    let stroop_type = shuffle(
        repeatArray(["fear_comp", "fear_incomp", "happy_comp", "happy_incomp"], fear_set.length / 4),
    );
    let image_numbers = shuffle([...Array(32).keys()]);
    let trials = [];
    for (let i = 0; i < stroop_type.length; i++) {
        let tmp = {};
        if (stroop_type[i] === "fear_comp") {
            tmp.distractor = fear_set[image_numbers[i]];
            tmp.distractor_type = "fear";
            tmp.comp = "comp";
            tmp.target = "ANGST";
            tmp.key = PRMS.respKeys[PRMS.target_text_emotion.indexOf(tmp.target)];
        } else if (stroop_type[i] === "fear_incomp") {
            tmp.distractor = fear_set[image_numbers[i]];
            tmp.distractor_type = "fear";
            tmp.comp = "incomp";
            tmp.target = "FREUDE";
            tmp.key = PRMS.respKeys[PRMS.target_text_emotion.indexOf(tmp.target)];
        } else if (stroop_type[i] === "happy_comp") {
            tmp.distractor = happy_set[image_numbers[i]];
            tmp.distractor_type = "happy";
            tmp.comp = "comp";
            tmp.target = "FREUDE";
            tmp.key = PRMS.respKeys[PRMS.target_text_emotion.indexOf(tmp.target)];
        } else if (stroop_type[i] === "happy_incomp") {
            tmp.distractor = happy_set[image_numbers[i]];
            tmp.distractor_type = "happy";
            tmp.comp = "incomp";
            tmp.target = "ANGST";
            tmp.key = PRMS.respKeys[PRMS.target_text_emotion.indexOf(tmp.target)];
        }
        trials.push(tmp);
    }
    return trials;
}

function draw_iti() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    // display task-choice text
    ctx.font = "40px".concat(" ", CHOICES.font_choice);
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText(CHOICES.task_choice_de, 0, -250);
}

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

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, STROOP_STIMULUS, IF_ERROR, ITI],
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
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common7+/write_data.php", data_fn, { stim: "stroop" });
    //saveDataLocal(data_fn, { stim: "stroop" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: PRMS.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));
    exp.push(TASK_INSTRUCTIONS1);

    // control manipulation questions
    exp.push(MOOD_QUESTIONNAIRE);
    exp.push(CHOICE_SCREEN);
    exp.push(COLOUR_CHOICE_SCREEN1);
    exp.push(COLOUR_CHOICE_SCREEN2);
    exp.push(FONT_CHOICE_SCREEN1);
    exp.push(FONT_CHOICE_SCREEN2);
    exp.push(TASK_CHOICE_SCREEN1);
    exp.push(TASK_CHOICE_SCREEN2);

    // experiment
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS2);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline = deepCopy(TRIAL_TIMELINE);
        blk_timeline.timeline_variables = generate_trials_within_block(FEAR_IMAGES, HAPPY_IMAGES);
        blk_timeline.sample = { type: "fixed-repetitions", size: 1 };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
