// Standard Flanker Task:
// VPs respond to the direction of the central arrow whilst
// ignoring the surrounding arrows using key responses ("D" and "J").

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrlsp: 4, // number of trials in first block (practice)
    ntrlse: 4, // number of trials in subsequent blocks
    nblks: 1,
    fix_duration: 500,
    feedback_duration: 1000,
    wait_duration: 1000,
    iti: 1000,
    too_fast: 150,
    too_slow: 2000,
    resp_keys: ["D", "J"],
    feedback_text: ["Correct", "Error", "Too Slow", "Too Fast"],
    ctrl: 1, // count trials
    cblk: 1, // count blocks
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
    dat.rt = dat.rt !== null ? dat.rt : PRMS.too_slow;

    let corr_code = 0;
    let correct_key = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);

    if (correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (dat.rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    } else if (dat.rt <= PRMS.too_fast) {
        corr_code = 4; // too false
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
        corr_code: corr_code,
    });
}

const FLANKER_STIMULUS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable("flanker"),
    trial_duration: PRMS.too_slow,
    response_ends_trial: true,
    choices: PRMS.resp_keys,
    data: {
        stim: "flanker",
        comp: jsPsych.timelineVariable("comp"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    trial_duration: PRMS.feedback_duration,
    response_ends_trial: false,
    post_trial_gap: PRMS.iti,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.stimulus = "<h2>" + PRMS.feedback_text[dat.corr_code - 1] + "</h2>";
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({ filter_options: { stim: "flanker", block_num: PRMS.cblk } });
        trial.stimulus = block_feedback_text(
            PRMS.cblk,
            PRMS.nblks,
            block_dvs.mean_rt,
            block_dvs.error_rate,
            (language = "en"),
        );
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, FLANKER_STIMULUS, TRIAL_FEEDBACK],
    timeline_variables: [
        { flanker: flankers[0], comp: 'comp',   correct_key: PRMS.resp_keys[0] },
        { flanker: flankers[1], comp: 'incomp', correct_key: PRMS.resp_keys[0] },
        { flanker: flankers[2], comp: 'comp',   correct_key: PRMS.resp_keys[1] },
        { flanker: flankers[3], comp: 'incomp', correct_key: PRMS.resp_keys[1] },
    ],
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    // save_data('/Common/write_data.php', fn, { stim: 'flanker' });
    save_data_local(fn, { stim: "flanker" });
}

const save_data = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(welcome_message());
    exp.push(vp_info_form());
    exp.push(mouse_cursor(false));
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
    exp.push(mouse_cursor(true));
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

jsPsych.run(EXP);
