/*
 Simon Task:
 VPs respond to the colour of the presented stimulus using
 left and right key responses.
*/


////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
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
    mapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
};


////////////////////////////////////////////////////////////////////////
//                      Participant Infomration                       //
////////////////////////////////////////////////////////////////////////
const vpNum = genVpNum();

const vpInfoForm = {
    type: "html",
    url: "vpInfoForm.html",
    cont_btn: "start",
    check_fn: checkVpInfoForm
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const welcome = {
    type: "html-keyboard-response",
    stimulus: "<H1>Welcome. Press any key to continue.</H1>",
    on_finish: function () {
        "use strict";
        const date = new Date();
        jsPsych.data.addProperties({date: date.toISOString()});
    }
};

if (prms.mapping === 1) {
    prms.respKeys = ["D", "J", 27];
    const task_instructions = {
        type: "html-keyboard-response",
        stimulus: "<H1 align='center'>Welcome:</H1><br>" +
                  "<H2 align='center'>Respond to the colour of the font </H2><br>" +
                  "<H2 align='center'> red = 'D' key &emsp; blue = 'J' key</H2>",
        post_trial_gap: prms.waitDur
    };
} else {
    prms.respKeys = ["J", "D", 27];
    const task_instructions = {
        type: "html-keyboard-response",
        stimulus: "<H1 align='center'>Welcome:</H1><br>" +
                  "<H2 align='center'>Respond to the colour of the font </H2><br>" +
                  "<H2 align='center'> blue = 'D' key &emsp; red = 'J' key</H2>",
        post_trial_gap: prms.waitDur
    };
}

const debrief = {
    type: 'html-keyboard-response',
    stimulus: "<H1>The experiment is finished.</H1>" + "<H2>Press any key to end the experiment!</H2>",
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
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

const stroops = [
    "<h1 style='color:red'>red</h1>",
    "<h1 style='color:red'>blue</h1>",
    "<h1 style='color:blue'>blue</h1>",
    "<h1 style='color:blue'>red</h1>",
];


const stroop_stimulus = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('stroop'), 
    trial_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    post_trial_gap: 0,
    data: {
        stim: "simon", 
        word: jsPsych.timelineVariable('word'), 
        color: jsPsych.timelineVariable('colour'), 
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
        trial.stimulus = trialFeedbackTxt();
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
        stroop_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { stroop: stroops[0], word: 'red',  colour: 'red',  comp: 'comp',   key: prms.respKeys[0]},
        { stroop: stroops[1], word: 'blue', colour: 'red',  comp: 'incomp', key: prms.respKeys[0]},
        { stroop: stroops[2], word: 'blue', colour: 'blue', comp: 'comp',   key: prms.respKeys[1]},
        { stroop: stroops[3], word: 'red',  colour: 'blue', comp: 'incomp', key: prms.respKeys[1]}
    ],
    randomize_order:true,
    repetitions: 4 / prms.nTrls
};

const save = {
    type: "call-function",
    func: saveData,
    timing_post_trial: 50
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false
});

