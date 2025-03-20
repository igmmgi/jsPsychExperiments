// AffNegEval Exp1
//
// Participants rate word pairs using a slider scale.
// 8 pairs of words.

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
        text: `
Im folgenden Experiment wird Ihnen ein Wort auf dem Bildschirm präsentiert. Bitte bewerten Sie das Wort danach, wie positiv oder negativ Sie es empfinden.<br><br>
Sie bewerten das Wort, indem Sie einen Schieberegler bewegen. 
Die linke Seite steht für negativ (0 = sehr negativ) und die rechte Seite für positiv (100 = sehr positiv). 
Sie können den Schieberegler an beliebiger Stelle auf der Skala positionieren. Um ein neutrales Rating abzugeben (= 50) muss man den Schieberegler zuerst auf eine Seite bewegen und dann zurück zur Mitte (um unabsichtliche 50 Eingaben zu vermeiden).<br><br>
Verlassen Sie sich einfach auf Ihre spontane Intuition, ohne zu lange darüber nachzudenken.<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
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
    labels: ["Sehr<br>negativ", "Sehr<br>positiv"],
    canvas_size: CANVAS_SIZE,
    prompt: `<p>
Hier ist ein Beispiel: Sie lesen das Wort „MORGEN“ und finden, dass „MORGEN“ eine positive Konnotation hat.<br>
Daher klicken Sie auf den Schieberegler und bewegen ihn nach rechts.<br>
Machen Sie eine Bewertung für das Wort, um den „Weiter“-Button zu aktivieren.<\p>`,
    require_movement: true,
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    slider_labels: "MORGEN",
    slider_spacing: 100,
    post_trial_gap: PRMS.gap,
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychCanvasSliderResponse,
    stimulus: function () {},
    labels: ["Sehr<br>negativ", "Sehr<br>positiv"],
    canvas_size: CANVAS_SIZE,
    prompt: `<p>
Hier ist noch ein Beispiel: Sie lesen das Wort „WECKER“ und finden, dass „WECKER“ eine negative Konnotation hat.<br>
Daher klicken Sie auf den Schieberegler und bewegen ihn nach links.<br>
Machen Sie eine Bewertung für das Wort, um den „Weiter“-Button zu aktivieren.<\p>`,
    require_movement: true,
    min: 0,
    max: 100,
    slider_start: 50,
    step: 1,
    slider_labels: "WECKER",
    slider_spacing: 100,
    post_trial_gap: PRMS.gap,
};

const CONTINUE_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Ende der Übung. Jetzt geht es los.<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
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
    labels: ["Sehr<br>negativ", "Sehr<br>positiv"],
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
  { word: "JA",         word_type: "aff"},        
  { word: "NEIN",       word_type: "neg"},
  { word: "MIT",        word_type: "aff"},
  { word: "OHNE",       word_type: "neg"},
  { word: "ALLES",      word_type: "aff"},
  { word: "NICHTS",     word_type: "neg"},
  { word: "ALLE",       word_type: "aff"},
  { word: "NIEMAND",    word_type: "neg"},
  { word: "NEUTRAL",    word_type: "aff"},
  { word: "NICHT",      word_type: "neg"},
  { word: "IMMER",      word_type: "aff"},
  { word: "NIE",        word_type: "neg"},
  { word: "ÜBERALL",    word_type: "aff"},
  { word: "NIRGENDS",   word_type: "neg"},
  { word: "EIN",        word_type: "aff"},
  { word: "KEIN",       word_type: "neg"},
  { word: "NEBEN",      word_type: "filler"},        
  { word: "SO",         word_type: "filler"},
  { word: "VON",        word_type: "filler"},
  { word: "DAVON",      word_type: "filler"},
  { word: "AN",         word_type: "filler"},
  { word: "TISCH",      word_type: "filler"},
  { word: "PAPIER",     word_type: "filler"},
  { word: "STUHL",      word_type: "filler"},
  { word: "DING",       word_type: "filler"},
  { word: "SCHREIBEN ", word_type: "filler"},
  { word: "TELLER",     word_type: "filler"},
  { word: "MINUTE",     word_type: "filler"},
  { word: "BEREICH",    word_type: "filler"},
  { word: "STELLE",     word_type: "filler"},
  { word: "KONTEXT",    word_type: "filler"},
  { word: "DREHEN",     word_type: "filler"},
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
        '<p style="text-align: left;">Was könnte eine Studie untersuchen mit diesen Wörtern, die hier gerade eingeschätzt wurden?</p>',
    html: '<p style="text-align: left;"><input type="radio" name="response" value="no_idea"> Keine Idee!<br><input type="radio" name="response" value="has_idea"> Ja, ich habe folgende Idee:<br><textarea id="test-resp-box" name="response" rows="4" cols="50" style="margin-left: 20px;"></textarea></p>',
    autofocus: "test-resp-box",
    data: {
        stim_type: "affneg",
    },
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addDataToLastTrial({
            debrief_response: dat.response.response,
        });
    },
};

const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Das Experiment ist zu Ende.<br><br>
Weiter mit einem Tastendruck.`,
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

    // setup
    exp.push(fullscreen(true));
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser());

    // instructions/demographics
    exp.push(welcome_message());
    exp.push(HTML_CONSENT_FORM);
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    exp.push(CONTINUE_SCREEN);

    // run trials
    exp.push(TRIAL_TIMELINE);

    // debrief
    exp.push(DEBRIEF_SCREEN);
    exp.push(SAVE_DATA);
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generatees datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
