// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("D" and "J").

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 4,  // number of trials in first block (practice)
    nTrlsE: 4,  // number of trials in subsequent blocks 
    nBlks: 1,
    fixDur: 750,
    fbDur: 750,
    waitDur: 1000,
    iti: 1000,
    tooFast: 150,
    tooSlow: 1500,
    respKeys: ["D", "J", 27],
    fbTxt: ["Correct", "Error", "Too Slow", "Too Fast"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
    type: "html-keyboard-response",
    stimulus: "<H1 style='text:align=center;'>Welcome:</H1><br>" +
        "<H2 style='text:align=center;'>Respond to the direction of the central arrow</H2><br>" +
        "<H2 style='text:align=center;'>LEFT = 'D' key &emsp; RIGHT = 'J' key</H2>",
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
    data: {stim: "fixation"},
};

const flankers = [
    [
        "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: right'></div>"
    ],
    [
        "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: left'></div>" +
        "<div class='right' style='float: right'></div>"
    ],
    [
        "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: right'></div>"
    ],
    [
        "<div class='left'  style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: right'></div>"
    ],
];

// const flankers = [
//     ['<div style="font-size:100px;"> <<<<< </div>'],
//     ['<div style="font-size:100px;"> >><>> </div>'],
//     ['<div style="font-size:100px;"> >>>>> </div>'],
//     ['<div style="font-size:100px;"> <<><< </div>']
// ]

const flanker_stimulus = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('flanker'), 
    trial_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    post_trial_gap: 0,
    data: {
        stim: "flanker", 
        comp: jsPsych.timelineVariable('comp'), 
        corrResp: jsPsych.timelineVariable('key')
    },
    on_finish: function() { codeTrial(); }
};

const trial_feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    trial_duration: prms.fbDur,
    response_ends_trial: false,
    post_trial_gap: prms.iti,
    data: {stim: "feedback"},
    on_start: function(trial) {
        trial.stimulus = trialFeedbackTxt(prms.fbTxt);
    }
};

const block_feedback = {
    type: 'html-keyboard-response',
    stimulus: '' ,
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt({stim: "flanker"});
    },
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        flanker_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { flanker: flankers[0], comp: 'comp',   key: prms.respKeys[0] },
        { flanker: flankers[1], comp: 'incomp', key: prms.respKeys[0] },
        { flanker: flankers[2], comp: 'comp',   key: prms.respKeys[1] },
        { flanker: flankers[3], comp: 'incomp', key: prms.respKeys[1] }
    ],
    randomize_order:true
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(welcome_en);
    exp.push(vpInfoForm);
    exp.push(task_instructions);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP/4) : (prms.nTrlsE/4);
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_en);
    return exp;

}
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "flanker"}); 
    }
});

