// Volitional Control Experiment modelled after Luo et al. (2024)
// Volition motivates cognitive performance at the response-execution level by attenuating task-irrelevant motor activations

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


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

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
    // save_data_local(fn, { stim: "flanker" });
}

const save_data = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function gengenerate_exp() {
    "use strict";

    let exp = [];

    // exp.push(fullscreen(true));
    // exp.push(welcome_message());
    // exp.push(vp_info_form());
    // exp.push(mouse_cursor(false));
    // exp.push(TASK_INSTRUCTIONS);


    // exp.push(save_data);
    // exp.push(end_message());
    // exp.push(mouse_cursor(true));
    // exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

jsPsych.run(EXP);
