// RedundantGestures 
// VPs respond to the auditory/visual presentation of the following stimuli:

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = 'rgba(255, 255, 255, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '0px solid black';


////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 1, // number of blocks
    nTrlsP: 16, // number of blocks
    nTrlsE: 64, // number of blocks
    fixDur: 1000, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [500, 1500, 1500, 1500], // duration of feedback for each type
    waitDur: 1000, // duration following ...
    iti: 500, // duration of inter-trial-interval
    tooFast: 150, // responses faster than x ms -> too fast!
    tooSlow: 2000, // response slower than x ms -> too slow!
    respKeys: ["Q", "P"],
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 25 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               XXX<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const VIDEOS = [
    "../videos/f_0_1.mp4",
    "../videos/f_0_2.mp4",
    "../videos/f_1_1_0.mp4",
    "../videos/f_1_1_1.mp4",
    "../videos/f_1_1_2.mp4",
    "../videos/f_1_2_0.mp4",
    "../videos/f_1_2_1.mp4",
    "../videos/f_2_1_0.mp4",
    "../videos/f_2_2_1.mp4",
    "../videos/f_2_2_1.mp4",
    "../videos/f_3_1_0.mp4",
    "../videos/f_3_1_1.mp4",
    "../videos/f_3_1_2.mp4",
    "../videos/f_3_2_0.mp4",
    "../videos/f_3_2_1.mp4",
    "../videos/f_3_2_2.mp4",
];

const PRELOAD = {
    type: jsPsychPreload,
    video: VIDEOS,
};


////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
};

function drawQuestion() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = 'bold 70px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText("Is the ball in the blue box?", 0, -200);

  ctx.fillRect(-200, 150, 100, 100);
  ctx.fillRect(100,  150, 100, 100);
}


const QUESTION = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  trial_duration: 1000,
  func: drawQuestion,
};

const ITI = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const VIDEO_TRIAL = {
    type: jsPsychVideoKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: [jsPsych.timelineVariable("video")],
    width: 500,
    choices: PRMS.respKeys,
    trial_ends_after_video: false,
    translate_origin: true,
    response_ends_trial: true,
};

// prettier-ignore
const TRIAL_TABLE = [
    { video: VIDEOS[0], corrKey: PRMS.respKeys[0] },
    { video: VIDEOS[1], corrKey: PRMS.respKeys[1] },
    { video: VIDEOS[2], corrKey: PRMS.respKeys[1] },
    { video: VIDEOS[3], corrKey: PRMS.respKeys[0] },
    { video: VIDEOS[4], corrKey: PRMS.respKeys[0] },
    { video: VIDEOS[4], corrKey: PRMS.respKeys[1] },
    { video: VIDEOS[4], corrKey: PRMS.respKeys[1] },
    { video: VIDEOS[4], corrKey: PRMS.respKeys[0] },
];

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, ITI],
    timeline_variables: TRIAL_TABLE,
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
    saveData("/Common/write_data.php", data_fn, { stim: "cmn1" });

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
    // exp.push(browser_check(PRMS.screenRes));
    // exp.push(PRELOAD);
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
    // exp.push(mouseCursor(false));
    // exp.push(TASK_INSTRUCTIONS1);

    exp.push(TRIAL_TIMELINE);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
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
