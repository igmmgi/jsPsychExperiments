// AffNegProd Exp1
//
// Participants describe picture pairs
// 60 pairs of words.

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({
    show_progress_bar: true,
    // can set it to return to SONA
    on_finish: function () {},
});

const CANVAS_SIZE = [720, 1280];

// Experiment Parameters
const PRMS = {
    gap: 500, // gap between screens
    ctrl: 1,
    cblk: 1,
};

/* show declaration of consent */
const check_consent_form = function (elem) {
    if (document.getElementById("consent_checkbox").checked) {
        return true;
    } else {
        alert(
            "Vielen Dank für Ihr Interesse an unserem Experiment. Wenn Sie teilnehmen möchten, geben Sie uns bitte Ihr Einverständnis.",
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
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Du siehst immer zwei Bilder auf dem Bildschirm. Auf eins der Bilder zeigt ein Pfeil, deine Aufgabe ist es dieses Bild zu beschreiben. Stell dir dazu vor, du redest mit jemandem am Telefon und beschreibst, was genau du in diesem Bild siehst. Tippe deine Beschreibung in die Box unter den Bildern. Das andere Bild musst du NICHT beschreiben. Benutze immer ganze Sätze. Wenn du fertig bist, dann kannst du über den „Weiter“ Button direkt zum nächsten Bilderpaar. Hier kommen ein paar Beispiele, die ersten beiden haben bereits eine Antwort, danach kannst du selbst tippen.<br><br>
Weiter mit einem Tastendruck.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: PRMS.gap,
};

const CONTINUE_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Ende der Übung.<br><br>
Es geht jetzt mit dem richtigen Experiment los.<br><br>
Weiter mit einem Tastendruck.`,
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

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function image_names() {
    // 394 available images
    let images = [];
    for (let i = 1; i <= 60; i++) {
        images.push(`../Images/Folie${i}_base.jpeg`);
        images.push(`../Images/Folie${i}_alt.jpeg`);
    }
    return images;
}

const IMAGES = image_names();
const IMAGES_PRACTICE = [
    "../Images/practice/practice1_base.jpg",
    "../Images/practice/practice1_alt.jpg",
    "../Images/practice/practice2_base.jpg",
    "../Images/practice/practice2_alt.jpg",
    "../Images/practice/practice3_base.jpg",
    "../Images/practice/practice3_alt.jpg",
];

function find_index(imageArray, fullFileName) {
    return imageArray.findIndex((img) => {
        const fileName = img.split("/").pop();
        return fileName === fullFileName;
    });
}

function create_trial_table() {
    let image_number = shuffle(range(1, 61));
    let image_types = ["alt", "base"];
    let image_type = shuffle(repeat_array(image_types, 30));
    let trial_table = [];
    let base_arrow = shuffle(range(0, 60)).slice(30); // half for base image

    for (const [index, element] of image_number.entries()) {
        let trial = {};
        let image_type_left = image_type[index];
        let image_type_right;
        if (image_type_left === "alt") {
            image_type_right = "base";
        } else {
            image_type_right = "alt";
        }
        if (base_arrow.includes(index)) {
            trial["relevant_image_type"] = "base";
            if (image_type_left === "base") {
                trial["relevant_image_side"] = "left";
            } else {
                trial["relevant_image_side"] = "right";
            }
        } else {
            trial["relevant_image_type"] = "alt";
            if (image_type_left === "alt") {
                trial["relevant_image_side"] = "left";
            } else {
                trial["relevant_image_side"] = "right";
            }
        }
        // make actual image name
        trial["image_left"] = "Folie" + element + "_" + image_type_left + ".jpeg";
        trial["image_left_index"] = find_index(IMAGES, trial["image_left"]);
        trial["image_right"] = "Folie" + element + "_" + image_type_right + ".jpeg";
        trial["image_right_index"] = find_index(IMAGES, trial["image_right"]);
        trial_table.push(trial);
    }

    return trial_table;
}

const TRIAL_TABLE = create_trial_table();

// hard-coded practice examples
// prettier-ignore
const TRIAL_TABLE_PRACTICE = [
  {"image_left": "practice1_base.jpg", "image_left_index": 0, "image_right": "practice1_alt.jpg", "image_right_index": 1, "relevant_image_side": "left", "relevant_image_type": "base"},
  {"image_left": "practice2_base.jpg", "image_left_index": 2, "image_right": "practice2_alt.jpg", "image_right_index": 3, "relevant_image_side": "right", "relevant_image_type": "alt"},
  {"image_left": "practice3_base.jpg", "image_left_index": 4, "image_right": "practice3_alt.jpg", "image_right_index": 5, "relevant_image_side": "right", "relevant_image_type": "alt"},
];

const PRELOAD = {
    type: jsPsychPreload,
    images: [IMAGES],
};

const TRIAL_PRACTICE = {
    type: jsPsychSurveyText,
    questions: [],
    data: {
        stim_type: "affneg",
        image_left: jsPsych.timelineVariable("image_left"),
        image_right: jsPsych.timelineVariable("image_right"),
        relevant_image_side: jsPsych.timelineVariable("relevant_image_side"),
        relevant_image_type: jsPsych.timelineVariable("relevant_image_type"),
    },
    on_start: function (trial) {
        if (PRMS.cblk === 1 && PRMS.ctrl === 1) {
            trial.questions = [{ prompt: "", rows: 4, value: "Da liegt ein aufgeschlagenes Buch." }];
        } else if (PRMS.cblk === 1 && PRMS.ctrl === 2) {
            trial.questions = [{ prompt: "", rows: 4, value: "Hier ist eine offene Schatzkiste ohne Inhalt." }];
        } else {
            trial.questions = [{ prompt: "", rows: 4, value: " " }];
        }
        trial.preamble = [
            IMAGES_PRACTICE[jsPsych.evaluateTimelineVariable("image_left_index")],
            IMAGES_PRACTICE[jsPsych.evaluateTimelineVariable("image_right_index")],
        ];
        trial.arrow_number = jsPsych.evaluateTimelineVariable("relevant_image_side") === "left" ? 0 : 1;
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
    post_trial_gap: PRMS.gap,
};

const TRIAL = {
    type: jsPsychSurveyText,
    questions: [{ prompt: "", rows: 4, value: " " }],
    data: {
        stim_type: "affneg",
        image_left: jsPsych.timelineVariable("image_left"),
        image_right: jsPsych.timelineVariable("image_right"),
        relevant_image_side: jsPsych.timelineVariable("relevant_image_side"),
        relevant_image_type: jsPsych.timelineVariable("relevant_image_type"),
    },
    on_start: function (trial) {
        trial.preamble = [
            IMAGES[jsPsych.evaluateTimelineVariable("image_left_index")],
            IMAGES[jsPsych.evaluateTimelineVariable("image_right_index")],
        ];
        trial.arrow_number = jsPsych.evaluateTimelineVariable("relevant_image_side") === "left" ? 0 : 1;
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
    post_trial_gap: PRMS.gap,
};

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.response = dat.response.Q0;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
    });
}

const TRIAL_TIMELINE_PRACTICE = {
    timeline: [TRIAL_PRACTICE],
    timeline_variables: TRIAL_TABLE_PRACTICE,
};

const TRIAL_TIMELINE = {
    timeline: [TRIAL],
    timeline_variables: TRIAL_TABLE,
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
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Das Experiment ist jetzt vorbei.<br><br>
Vielen Dank für Ihre Teilnahme!`,
        fontsize: 28,
        lineheight: 1.5,
        bold: true,
        align: "left",
    }),
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(HTML_CONSENT_FORM);
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(PRELOAD);
    exp.push(TASK_INSTRUCTIONS1);

    exp.push(TRIAL_TIMELINE_PRACTICE);
    exp.push(CONTINUE_SCREEN);
    exp.push(TRIAL_TIMELINE);

    // save data
    exp.push(SAVE_DATA);

    // debrief
    // exp.push(END_SCREEN);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generatees datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
