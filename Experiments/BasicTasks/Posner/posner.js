// Standard Posner Task:
// Example adapted from the PsychoPy Online Video Tutorial:
// https://www.youtube.com/watch?v=ZQd2QEK_Gn4
// Demo Script written as an example for Tübingen Workshop on Online Experiments

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 10,      // number of trials in first block (practice)
    nTrlsE: 10,      // number of trials in subsequent blocks
    nBlks: 1,        // number of blocks
    fixDur: 500,     // duration of the fixation cross
    cueDur: 200,     // cue duration
    fbDur: 500,      // feedback duration
    cti: 0,          // cue-target-interval duration
    targetPos: 500,  // target position +-
    waitDur: 1000,   // duration to wait following ...
    iti: 1000,       // inter-trial-interval
    tooFast: 150,    // response criterion for too fast
    tooSlow: 1500,   // response criterion for too slow
    respKeys: ['Q', 'P'],  // define response keys
    fbTxt: ['Correct', 'Error', 'Too Slow', 'Too Fast'],  // text to show for feedback
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
    type: 'html-keyboard-response',
    stimulus: `
    <H2>Welcome: <br><br>
    Your task is to respond to the location of a circle that is presented <br>
    to the left or right side of the screen. Respond with the following keys:<br><br>
    Left Side = ` + prms.respKeys[0] + `&emsp;&emsp;Right Side = ` + prms.respKeys[1] + ` key<br><br>
    Press the spacebar to continue!</H2>`,
    post_trial_gap: prms.waitDur
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: prms.fixDur,
    post_trial_gap: 0,
    data: { stim: 'fixation' },
};

const cue_stimulus = {
    type: 'canvas-keyboard-response',
    stimulus: drawCue,
    trial_duration: prms.cueDur,
    response_ends_trial: false,
    choices: prms.respKeys,
    post_trial_gap: prms.cti,
    canvas_size: [1280, 960],
    data: {
        stim: 'posner_cue',
        cue_side: jsPsych.timelineVariable('cue_dir'),
    },
};

function drawCue(c) {

    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2); // make center (0, 0)

    var img = new Image();
    img.src = jsPsych.timelineVariable('cue_img', true);

    let w = img.width;
    let h = img.height;
    console.log(h)
    ctx.drawImage(img, -(w/2), -(h/2), w, h);

}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let correctKey;
  if (dat.response !== null) {
      correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);
  }

  if (correctKey && (rt > prms.tooFast && rt < prms.tooSlow)) {
    corrCode = 1; // correct
  } else if (!correctKey && (rt > prms.tooFast && rt < prms.tooSlow)) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}



const target_stimulus = {
    type: 'canvas-keyboard-response',
    stimulus: drawTarget,
    trial_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    canvas_size: [1280, 960],
    post_trial_gap: 0,
    data: {
        stim: 'posner_target',
        target_side: jsPsych.timelineVariable('target_side'),
        validity: jsPsych.timelineVariable('validity'),
        corrResp: jsPsych.timelineVariable('key')
    },
    on_finish: function () {
        codeTrial();
    },
};


function drawTarget(c) {

    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2); // make center (0, 0)

    var img = new Image();
    img.src = jsPsych.timelineVariable('target_img', true);

    let w = img.width;
    let h = img.height;
    let x_pos = jsPsych.timelineVariable('x_pos', true);
    ctx.drawImage(img, x_pos-(w/2), -(h/2), w, h);

}

const trial_feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    trial_duration: prms.fbDur,
    response_ends_trial: false,
    post_trial_gap: prms.iti,
    data: { stim: 'feedback' },
    on_start: function (trial) {
        trial.stimulus = trialFeedbackTxt(prms.fbTxt);
    },
};

const block_feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    on_start: function (trial) {
        trial.stimulus = blockFeedbackTxt({ stim: 'posner_target' });
    },
};

const imgs = [
    'images/arrow_left.png',
    'images/arrow_right.png',
    'images/target.png',
]

// prettier-ignore
const trial_timeline = {
    timeline: [fixation_cross, cue_stimulus, target_stimulus, trial_feedback],
    timeline_variables: [
        { cue_img: imgs[0], cue_dir: "left",  target_img: imgs[2], target_side: "left",  x_pos: -prms.targetPos, validity: 'valid',   key: prms.respKeys[0] },
        { cue_img: imgs[0], cue_dir: "left",  target_img: imgs[2], target_side: "left",  x_pos: -prms.targetPos, validity: 'valid',   key: prms.respKeys[0] },
        { cue_img: imgs[0], cue_dir: "left",  target_img: imgs[2], target_side: "left",  x_pos: -prms.targetPos, validity: 'valid',   key: prms.respKeys[0] },
        { cue_img: imgs[0], cue_dir: "left",  target_img: imgs[2], target_side: "left",  x_pos: -prms.targetPos, validity: 'valid',   key: prms.respKeys[0] },
        { cue_img: imgs[1], cue_dir: "right", target_img: imgs[2], target_side: "right", x_pos:  prms.targetPos, validity: 'valid',   key: prms.respKeys[1] },
        { cue_img: imgs[1], cue_dir: "right", target_img: imgs[2], target_side: "right", x_pos:  prms.targetPos, validity: 'valid',   key: prms.respKeys[1] },
        { cue_img: imgs[1], cue_dir: "right", target_img: imgs[2], target_side: "right", x_pos:  prms.targetPos, validity: 'valid',   key: prms.respKeys[1] },
        { cue_img: imgs[0], cue_dir: "left",  target_img: imgs[2], target_side: "right", x_pos:  prms.targetPos, validity: 'invalid', key: prms.respKeys[1] },
        { cue_img: imgs[1], cue_dir: "right", target_img: imgs[2], target_side: "left",  x_pos: -prms.targetPos, validity: 'invalid', key: prms.respKeys[0] },
    ],
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    'use strict';

    let exp = [];

    exp.push( {
        type: 'fullscreen',
        fullscreen_mode: true
    });

    exp.push(welcome_en);
    // exp.push(vpInfoForm_en);
    exp.push(task_instructions);

    for (let blk = 0; blk < prms.nBlks; blk++) {
        let blk_timeline = { ...trial_timeline };
        blk_timeline.sample = {
            type: 'fixed-repetitions',
            size: blk === 0 ? prms.nTrlsP / 10 : prms.nTrlsE / 10,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(block_feedback); // show previous block performance
    }
    exp.push(debrief_en);
    return exp;
}
const EXP = genExpSeq();
const filename = dirName + 'data/' + expName + '_' + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen_mode: true,
    show_progress_bar: false,
    preload_images: imgs,
    on_finish: function () {
        saveData('/Common/write_data.php', filename, [{ stim: 'posner_cue'}, {stim: 'posner_target'} ]);
    },
});
