// Simon Task:
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 4,
    nTrlsE: 8,
    nBlks: 2,
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
    stimulus: "<H1 style='text-align=center;'>Welcome:</H1><br>" +
              "<H2 style='text-align=center;'>Respond to the colour of the presented square</H2>" +
              "<H2 style='text-align=center;'>Square = 'D' key &emsp; Circle = 'J' key</H2>",
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

const simons = [
    "<div class='square_left'></div>",
    "<div class='circle_left'></div>",
    "<div class='square_right'></div>",
    "<div class='circle_right'></div>",
];

const simon_stimulus = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('simon'), 
    trial_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    post_trial_gap: 0,
    data: {
        stim: "simon", 
        comp: jsPsych.timelineVariable('comp'), 
        side: jsPsych.timelineVariable('side'), 
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
    stimulus: blockFeedbackTxt,
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { simon: simons[0], comp: 'comp',   side: 'left',  key: prms.respKeys[0]},
        { simon: simons[1], comp: 'incomp', side: 'left',  key: prms.respKeys[1]},
        { simon: simons[2], comp: 'comp',   side: 'right', key: prms.respKeys[0]},
        { simon: simons[3], comp: 'incomp', side: 'right', key: prms.respKeys[0]}
    ],
    randomize_order:true,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(welcome_en);
    //exp.push(vpInfoForm);
    exp.push(task_instructions);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        for (let blk = 0; blk < prms.nBlks; blk += 1) {
            let blk_timeline = {...trial_timeline};
            blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP / 4) : (prms.nTrlsE / 4);
            exp.push(blk_timeline);    // trials within a block
            exp.push(block_feedback);  // show previous block performance
        }
    }
    exp.push(debrief_en);
    return exp;

}
const EXP = genExpSeq();
const datname = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
    on_finish: function(){ 
        saveData("/Common/write_data.php", datname, {stim: "simon"}); 
    }
});

