// AffNegEval Exp1
//
// Participants rate word using a slider scale.
// 16 words.

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({
    // can set it to return to SONA
    on_finish: function () {},
});

const CANVAS_SIZE = [720, 1280];

// Experiment Parameters
const PRMS = {
    gap: 1000, // gap between screens
    ctrl: 1,
    cblk: 1,
};

// show declaration of consent
const check_consent_form = function (elem) {
    if (document.getElementById("consent_checkbox").checked) {
        return true;
    } else {
        alert(
            "Thank you for your interest in our experiment. If you want to participate, please check the consent box near the bottom of the page.",
        );
        return false;
    }
};

const HTML_CONSENT_FORM = {
    type: jsPsychExternalHtml,
    url: "consent.html",
    cont_btn: "start_experiment",
    check_fn: check_consent_form,
    post_trial_gap: PRMS.gap,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `In the following experiment you will see a word presented on the screen. Please rate the word regarding how positive or negative you think the word is.<br><br>
You rate the word via moving a slider to a position with the left side being negative (0 = very negative) and the right side being positive (100 = very positive). You can position 
the slider anywhere on the scale. To submit a neutral rating (= 50) you first need to move the slider to one of the sides and then move it back to the middle (in order to avoid accidental 50 ratings).<br><br>
Just give your spontaneous intuition without thinking too much about it.<br><br>
Press any key to continue`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: PRMS.gap,
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychCanvasSliderResponse,
    stimulus: function () {},
    labels: ["Very<br>Negative", "Very<br>Positive"],
    canvas_size: CANVAS_SIZE,
    prompt: `<p>Here is an example. You read the word "MORNING", and you think "MORNING" has a positive connotation.<br>
Thus, you click on the slider and move it towards the right.<br>
Make a rating for this practice word in order to activate the "Continue" button.<\p>`,
    require_movement: true,
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    slider_label: "MORNING",
    post_trial_gap: PRMS.gap,
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychCanvasSliderResponse,
    stimulus: function () {},
    labels: ["Very<br>Negative", "Very<br>Positive"],
    canvas_size: CANVAS_SIZE,
    prompt: `<p>Here is another example. You read the word "ALARM", and you think "ALARM" has a negative connotation.<br>
Thus, you click on the slider and move it towards the left.<br>
Make a rating for this practice word in order to activate the "Continue" button.<\p>`,
    require_movement: true,
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    slider_label: "ALARM",
    post_trial_gap: PRMS.gap,
};

const CONTINUE_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `End of practice.<br><br>
Now the experiment starts.<br><br>
Press any key to continue`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: PRMS.gap,
    on_finish: function () {
        PRMS.cblk += 1;
        PRMS.ctrl = 1;
    },
};

const RATING_SCREEN = {
    type: jsPsychCanvasSliderResponse,
    stimulus: function () {},
    labels: ["Very<br>Negative", "Very<br>Positive"],
    canvas_size: CANVAS_SIZE,
    prompt: "",
    require_movement: true,
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    slider_label: "test",
    data: {
        stim_type: "affneg",
        word: jsPsych.timelineVariable("word"),
        word_type: jsPsych.timelineVariable("word_type"),
    },
    on_start: function (trial) {
        trial.slider_label = jsPsych.evaluateTimelineVariable("word");
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
    post_trial_gap: PRMS.gap,
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        word: dat.slider_label,
        rating: dat.response[0],
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
    });
}

// prettier-ignore
const TRIAL_TABLE = [
  { word: "YES",        word_type: "aff"},        
  { word: "NO",         word_type: "neg"},
  { word: "WITH",       word_type: "aff"},
  { word: "WITHOUT",    word_type: "neg"},
  { word: "EVERYTHING", word_type: "aff"},
  { word: "NOTHING",    word_type: "neg"},
  { word: "EVERYBODY",  word_type: "aff"},
  { word: "NOBODY",     word_type: "neg"},
  { word: "NEUTRAL",    word_type: "aff"},
  { word: "NOT",        word_type: "neg"},
  { word: "ALWAYS",     word_type: "aff"},
  { word: "NEVER",      word_type: "neg"},
  { word: "EVERYWHERE", word_type: "aff"},
  { word: "NOWHERE",    word_type: "neg"},
  { word: "ONE",        word_type: "aff"},
  { word: "NONE",       word_type: "neg"},
  { word: "NEXT",       word_type: "filler"},        
  { word: "SO",         word_type: "filler"},
  { word: "BY",         word_type: "filler"},
  { word: "OF",         word_type: "filler"},
  { word: "TO",         word_type: "filler"},
  { word: "TABLE",      word_type: "filler"},
  { word: "PAPER",      word_type: "filler"},
  { word: "CHAIR",      word_type: "filler"},
  { word: "THING",      word_type: "filler"},
  { word: "WRITE",      word_type: "filler"},
  { word: "PLATE",      word_type: "filler"},
  { word: "MINUTE",     word_type: "filler"},
  { word: "REGION",     word_type: "filler"},
  { word: "ZONE",       word_type: "filler"},
  { word: "CONTEXT",    word_type: "filler"},
  { word: "TURN",       word_type: "filler"},
  { word: "MOVE TO 40", word_type: "na"}, 
  { word: "MOVE TO 60", word_type: "na"},
];

const TRIAL_TIMELINE = {
    timeline: [RATING_SCREEN],
    timeline_variables: TRIAL_TABLE,
    sample: {
        type: "fixed-repetitions",
        size: 1,
    },
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "affneg" });
    // save_data_local(data_fn, { stim_type: "affneg" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: PRMS.gap,
};

////////////////////////////////////////////////////////////////////////
//                             VP DEBRIEF                             //
////////////////////////////////////////////////////////////////////////
var DEBRIEF_SCREEN = {
    type: jsPsychSurveyHtmlForm,
    preamble:
        '<p style="text-align: left;">What could an experiment using the words that you rated be investigating?</p>',
    html: '<p style="text-align: left;"><input type="radio" name="response" value="no_idea"> No idea!<br><input type="radio" name="response" value="has_idea"> Yes, I have the following idea:<br><textarea id="test-resp-box" name="response" rows="4" cols="50" style="margin-left: 20px;"></textarea></p>',
    autofocus: "test-resp-box",
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addDataToLastTrial({
            debrief_response: dat.response,
        });
    },
};

const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `The experiment has ended.<br><br>
Press any key to continue.`,
        fontsize: 28,
        color: "black",
        lineheight: 1.0,
        bold: true,
        align: "center",
    }),
    on_finish: function () {
        window.location.replace("https://app.prolific.com/submissions/complete?cc=C1OYPSA2");
    },
    post_trial_gap: PRMS.gap,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    let exp = [];

    exp.push(DEBRIEF_SCREEN);

    // setup
    exp.push(fullscreen(true, "en"));
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser("en"));

    // instructions/demographics
    exp.push(welcome_message("en"));
    exp.push(HTML_CONSENT_FORM);
    exp.push(vp_info_form("/Common8+/vpInfoForm_en.html"));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    exp.push(CONTINUE_SCREEN);

    // run trials
    exp.push(TRIAL_TIMELINE);

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(DEBRIEF_SCREEN);
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generatees datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
