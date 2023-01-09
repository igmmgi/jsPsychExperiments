// RedundantGestures
// VPs respond to the auditory/visual presentation of the following stimuli:

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid Black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 6, // number of blocks
    nTrlsP: 8, // number of blocks
    nTrlsE: 48, // number of blocks
    fixDur: 1000, //1000, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [1000, 1000], // duration of feedback for each type
    fbTxt: ['Richtig!', 'Falsch!'],
    iti: 1000, // duration of inter-trial-interval
    respKeys: ["F", "J"],
    box_position: [100, 150],
    box_size: 100,
    box_frame: 5,
    question_duration: 2500,
    question_font: "bold 40px Arial",
    question_colour: "Black",
    question_position: [0, -160],
    answer_text: "",
    answer_font: "bold 40px Arial",
    answer_position: [0, -160],
    video_width: 500,
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
               um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 30 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst die Versuchspersonenstunden automatisch am Ende des Experiments.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               lisa2.fischer@student.uni-tuebingen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang siehst du zwei farbige Boxen sowie eine 
               Fragestellung (“Ist der Ball in der blauen Box?” oder “Ist der Ball in
               der grünen Box?”). Die Anordnung der farbigen Boxen (linke vs. rechte Seite) kann von Durchgang 
               zu Durchgang variieren.<br><br>
               Die Frage wird durch eine kurze Video Sequenz mit “ja” oder “nein”
               beantwortet. Dies kann durch eine Geste, verbal oder beides
               gleichzeitig ausgedrückt werden.<br><br>
               Gib danach per Tastendruck an, ob sich der Ball in der linken oder
               rechten Box befindet.<br><br>
               Wenn der Ball in der linken Box ist, drücke die Taste F.<br>
               Wenn der Ball in der rechten Box ist, drücke die Taste J.<br><br>
               Das Experiment beginnt mit 8 Durchgängen zur Einstellung der
               Ton-Lautstärke. Danach folgen 8 Übungsdurchgänge. Im Anschluss beginnt
               das eigentliche Experiment, es besteht aus 5 Blöcken, maximal dauert
               es 30 Minuten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `ACHTUNG-Soundkalibierung:<br><br>
              Im Folgenden werden dir Video Ausschnitte präsentiert.
              Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du 
              deutlich die Tönen hören kannst.
              Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).<br><br>
        Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        colour: "Black",
        fontsize: 30,
    }),
};


const TASK_INSTRUCTIONS_BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function(trial) {
        trial.stimulus = generate_formatted_html({
            text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}.<br><br>
            Wenn du wieder bereit bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 28,
            bold: false,
            lineheight: 1.5,
        })
    }
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const VIDEOS = [
    "../videos/Exp1/f_thumb_ja.mp4",
    "../videos/Exp1/f_thumb_no.mp4",
    "../videos/Exp1/f_thumb_verbal_ja.mp4",
    "../videos/Exp1/f_thumb_verbal_no.mp4",
    "../videos/Exp1/f_verbal_ja.mp4",
    "../videos/Exp1/f_verbal_no.mp4",
    "../videos/Exp1/m_thumb_ja.mp4",
    "../videos/Exp1/m_thumb_no.mp4",
    "../videos/Exp1/m_thumb_verbal_ja.mp4",
    "../videos/Exp1/m_thumb_verbal_no.mp4",
    "../videos/Exp1/m_verbal_ja.mp4",
    "../videos/Exp1/m_verbal_no.mp4",
];

const PRELOAD = {
    type: jsPsychPreload,
    video: VIDEOS,
};

const QUESTIONS = ["Ist der Ball in der grünen Box?", "Ist der Ball in der blauen Box?"];

const COLOURS = ["Green", "Blue"];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

const TRIALS_CALIBRATION = [
    { video: VIDEOS[ 2]},
    { video: VIDEOS[ 3]},
    { video: VIDEOS[ 4]},
    { video: VIDEOS[ 5]},
    { video: VIDEOS[ 8]},
    { video: VIDEOS[ 9]},
    { video: VIDEOS[10]},
    { video: VIDEOS[11]},
]

const VIDEO_TRIAL_CALIBRATION = {
    type: jsPsychVideoKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: [jsPsych.timelineVariable("video")],
    width: PRMS.video_width,
    choices: PRMS.respKeys,
    trial_ends_after_video: true,
    translate_origin: true,
    response_ends_trial: false,
    box_colour_left: CANVAS_COLOUR,
    box_colour_right: CANVAS_COLOUR,
    answer_text: "",
    answer_font: "",
    answer_position: PRMS.answer_position,
    box_position: PRMS.box_position,
    box_size: 0,
    box_frame: 0,
};

const FIXATION_CROSS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
};

function drawQuestion(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // question
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = PRMS.question_font;
    ctx.fillStyle = PRMS.question_colour;
    ctx.fillText(args.question, PRMS.question_position[0], PRMS.question_position[1]);

    // boxes colour
    ctx.fillStyle = args.box_colour_left;
    ctx.fillRect(-PRMS.box_position[0]*2, PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.fillStyle = args.box_colour_right;
    ctx.fillRect(PRMS.box_position[0], PRMS.box_position[1], PRMS.box_size, PRMS.box_size);

    // boxes border
    ctx.beginPath();
    ctx.lineWidth = PRMS.box_frame;
    ctx.strokeStyle = "Black";
    ctx.rect(-PRMS.box_position[0]*2, PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.stroke();

    // boxes border
    ctx.beginPath();
    ctx.lineWidth = PRMS.box_frame;
    ctx.strokeStyle = "Black";
    ctx.rect(PRMS.box_position[0], PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.stroke();

}

const QUESTION = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.question_duration,
    func: drawQuestion,
    on_start: function(trial) {
        trial.func_args = [{"question": jsPsych.timelineVariable("question"),
                            "box_colour_left": jsPsych.timelineVariable("box_colour_left"),
                            "box_colour_right": jsPsych.timelineVariable("box_colour_right")}];
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

function code_trial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];

  let is_correct = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);
  let error = is_correct ? 0 : 1;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
    error: error,
  });
}

const VIDEO_TRIAL = {
    type: jsPsychVideoKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: [jsPsych.timelineVariable("video")],
    width: PRMS.video_width,
    choices: PRMS.respKeys,
    trial_ends_after_video: false,
    translate_origin: true,
    response_ends_trial: true,
    box_colour_left: jsPsych.timelineVariable("box_colour_left"),
    box_colour_right: jsPsych.timelineVariable("box_colour_right"),
    answer_text: PRMS.answer_text,
    answer_font: PRMS.answer_font,
    answer_position: PRMS.answer_position,
    box_position: PRMS.box_position,
    box_size: PRMS.box_size,
    box_frame: PRMS.box_frame,
    data: {
        stim: "rg1",
        video: jsPsych.timelineVariable("video"),
        question: jsPsych.timelineVariable("question"),
        box_colour_left: jsPsych.timelineVariable("box_colour_left"),
        box_colour_right: jsPsych.timelineVariable("box_colour_right"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_finish: function() {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.error];
        trial.stimulus = generate_formatted_html({
            text: `${PRMS.fbTxt[dat.error]}`,
            align: 'center',
            fontsize: 30,
        });
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    stimulus: "",
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'rg1', blockNum: PRMS.cBlk }, corrColumn: "error", corrValue: 0 });
        trial.stimulus = generate_formatted_html({
            text: `Block: ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
            Mittlere Reaktionzeit: ${block_dvs.meanRt} ms<br>
            Fehlerrate: ${block_dvs.errorRate} %<br><br>
            Wenn du wieder bereit bist, dann drücke eine beliebige Taste.`,
            align: 'center',
            fontsize: 30,
        });
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};


function create_trial_table() {
    // prettier-ignore
    let trial_table = [];
    for (let i = 0; i < 12; i++) {
        if (i % 2 == 0) {
            trial_table = trial_table.concat([
                { video: VIDEOS[i], question: QUESTIONS[0], box_colour_left: COLOURS[0], box_colour_right: COLOURS[1], correct_key: PRMS.respKeys[0] },
                { video: VIDEOS[i], question: QUESTIONS[1], box_colour_left: COLOURS[0], box_colour_right: COLOURS[1], correct_key: PRMS.respKeys[1] },
                { video: VIDEOS[i], question: QUESTIONS[0], box_colour_left: COLOURS[1], box_colour_right: COLOURS[0], correct_key: PRMS.respKeys[1] },
                { video: VIDEOS[i], question: QUESTIONS[1], box_colour_left: COLOURS[1], box_colour_right: COLOURS[0], correct_key: PRMS.respKeys[0] }
            ])
        } else {
            trial_table = trial_table.concat([
                { video: VIDEOS[i], question: QUESTIONS[0], box_colour_left: COLOURS[0], box_colour_right: COLOURS[1], correct_key: PRMS.respKeys[1] },
                { video: VIDEOS[i], question: QUESTIONS[1], box_colour_left: COLOURS[0], box_colour_right: COLOURS[1], correct_key: PRMS.respKeys[0] },
                { video: VIDEOS[i], question: QUESTIONS[0], box_colour_left: COLOURS[1], box_colour_right: COLOURS[0], correct_key: PRMS.respKeys[0] },
                { video: VIDEOS[i], question: QUESTIONS[1], box_colour_left: COLOURS[1], box_colour_right: COLOURS[0], correct_key: PRMS.respKeys[1] }
            ])
        }
    }
    return trial_table;
}

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [FIXATION_CROSS, VIDEO_TRIAL_CALIBRATION, ITI],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "fixed-repetitions",
        size: 1,
    },
};

const TRIAL_TABLE_PRACTICE = shuffle(create_trial_table()).slice(0, PRMS.nTrlsP);
const TRIAL_TABLE_EXP = create_trial_table();

const TRIAL_TIMELINE_PRACTICE = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_PRACTICE,
};

const TRIAL_TIMELINE_EXP = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_EXP,
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
    saveData("/Common/write_data.php", data_fn, { stim: "rg1" });
    // saveDataLocal(data_fn, { stim: "rg1" });
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
    // exp.push(browser_check(PRMS.screenRes));
    // exp.push(resize_browser());
    // exp.push(PRELOAD);
    // exp.push(welcome_message());
    // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
    // exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) { 
        exp.push(TASK_INSTRUCTIONS_BLOCK_START);
        let blk_timeline;
        if (blk === 0) {
            blk_timeline = {... TRIAL_TIMELINE_PRACTICE};
        } else {
            blk_timeline = {... TRIAL_TIMELINE_EXP};
        }
        blk_timeline.sample = {
            type: 'fixed-repetitions',
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK);
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
