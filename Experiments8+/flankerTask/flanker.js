// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("D" and "J").

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    nTrlsP: 4, // number of trials in first block (practice)
    nTrlsE: 4, // number of trials in subsequent blocks
    nBlks: 1,
    fixDur: 500,
    fbDur: 1000,
    waitDur: 1000,
    iti: 1000,
    tooFast: 150,
    tooSlow: 2000,
    resp_keys: ["D", "J"],
    fbTxt: ["Correct", "Error", "Too Slow", "Too Fast"],
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        generate_formatted_html({
            text: "Welcome:",
            align: "center",
            color: "black",
            fontsize: 50,
            xypos: [0, -30],
            bold: true,
        }) +
        generate_formatted_html({
            text: "Respond to the direction of the central arrow.",
            align: "center",
            color: "black",
            fontsize: 40,
            xypos: [0, 0],
        }) +
        generate_formatted_html({
            text: 'LEFT = "D" key &emsp; RIGHT = "J" key<br><br>',
            align: "center",
            colour: "black",
            fontsize: 40,
            xypos: [0, 50],
        }) +
        generate_formatted_html({
            text: "Press any key to continue.",
            align: "center",
            colour: "black",
            fontsize: 40,
            xypos: [0, 50],
        }),
    post_trial_gap: PRMS.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
};

// prettier-ignore
const flankers = [
    [
        "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: right'></div>",
    ],
    [
        "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: left'></div>" +
        "<div class='right' style='float: right'></div>",
    ],
    [
        "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: right'></div>",
    ],
    [
        "<div class='left'  style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: right'></div>"
    ],
];

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too false
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

const FLANKER_STIMULUS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable("flanker"),
    trial_duration: PRMS.tooSlow,
    response_ends_trial: true,
    choices: PRMS.resp_keys,
    data: {
        stim: "flanker",
        comp: jsPsych.timelineVariable("comp"),
        corrResp: jsPsych.timelineVariable("key"),
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    trial_duration: PRMS.fbDur,
    response_ends_trial: false,
    post_trial_gap: PRMS.iti,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.stimulus = "<h2>" + PRMS.fbTxt[dat.corrCode - 1] + "</h2>";
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "flanker", blockNum: PRMS.cBlk } });
        trial.stimulus = blockFeedbackText(
            PRMS.cBlk,
            PRMS.nBlks,
            block_dvs.meanRt,
            block_dvs.errorRate,
            (language = "en"),
        );
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, FLANKER_STIMULUS, TRIAL_FEEDBACK],
    timeline_variables: [
        { flanker: flankers[0], comp: 'comp',   key: PRMS.resp_keys[0] },
        { flanker: flankers[1], comp: 'incomp', key: PRMS.resp_keys[0] },
        { flanker: flankers[2], comp: 'comp',   key: PRMS.resp_keys[1] },
        { flanker: flankers[3], comp: 'incomp', key: PRMS.resp_keys[1] },
    ],
};

// save
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    // saveData('/Common/write_data.php', fn, { stim: 'flanker' });
    saveDataLocal(fn, { stim: "flanker" });
}

const save_data = {
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
    exp.push(welcome_message());
    exp.push(vpInfoForm());
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        let blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: blk === 0 ? PRMS.nTrlsP / 4 : PRMS.nTrlsE / 4,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(save_data);
    exp.push(end_message());
    exp.push(mouseCursor(true));
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
