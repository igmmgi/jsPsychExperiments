/*
 Simon Task:
 VPs respond to the colour of the presented stimulus using
 left and right key responses.
*/


////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
var prms = {
    nTrls: 4,
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
//                      Participant Infomration                       //
////////////////////////////////////////////////////////////////////////
var vpNum = genVpNum();

var vpInfoForm = {
    type: "html",
    url: "vpInfoForm.html",
    cont_btn: "start",
    check_fn: checkVpInfoForm
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
var welcome = {
    type: "html-keyboard-response",
    stimulus: "<H1>Welcome. Press any key to continue.</H1>",
    on_finish: function () {
        "use strict";
        var date = new Date()
        jsPsych.data.addProperties({date: date.toISOString()});
    }
};

var task_instructions = {
    type: "html-keyboard-response",
    stimulus: "<H1 align='center'>Welcome:</H1><br>" +
              "<H2 align='center'>Respond to the colour of the presented square</H2>" +
              "<H2 align='center'>Square = 'D' key &emsp; Circle = 'J' key</H2>", 
    post_trial_gap: prms.waitDur
};

var debrief = {
    type: 'html-keyboard-response',
    stimulus: "<H1>The experiment is finished.</H1>" + "<H2>Press any key to end the experiment!</H2>",
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
};




////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
var fixation_cross = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: prms.fixDur,
    post_trial_gap: 0,
    data: {stim: "fixation"},
}

var simons = [
    "<div class='square_left'></div>",
    "<div class='circle_left'></div>",
    "<div class='square_right'></div>",
    "<div class='circle_right'></div>",
]


var simon_stimulus = {
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
}

var trial_feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    trial_duration: prms.fbDur,
    response_ends_trial: false,
    post_trial_gap: prms.iti,
    data: {stim: "feedback"},
    on_start: function(trial) {
        trial.stimulus = trialFeedbackTxt();
    }
}

var block_feedback = {
    type: 'html-keyboard-response',
    stimulus: blockFeedbackTxt,
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
};

var trial_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { simon: simons[0], comp: 'comp',   side: 'left',  key: prms.respKeys[0]},
        { simon: simons[1], comp: 'incomp', side: 'left',  key: prms.respKeys[0]},
        { simon: simons[2], comp: 'comp',   side: 'right', key: prms.respKeys[1]},
        { simon: simons[3], comp: 'incomp', side: 'right', key: prms.respKeys[1]}
    ],
    randomize_order:true,
    repetitions: 4 / prms.nTrls
}

var save = {
    type: "call-function",
    func: saveData,
    timing_post_trial: 50
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
var EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false
});

