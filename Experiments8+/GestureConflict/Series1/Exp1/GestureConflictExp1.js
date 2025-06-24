// Gesture Conflict Exp 1
//
// Participants respond to information regarding the location of a ball (left vs. right box)
// The information is either conveyed in compatible (both voice and gesture information) or a single modality
//
// Two versions
// Version 1: Thumb gestures
// Version 2: Head gestures

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [720, 1280];

// Experiment Parameters
const PRMS = {
    ntrls_prac: 16, // number of trials per block (multiple of 8)
    ntrls_exp: 32, // number of trials per block (multiple of 8)
    nblks_prac: 1, // number of blocks practice
    nblks_exp: 6, // number of blocks experimental blocks
    fix_size: 15, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    feedback_duration: [500, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    too_slow: 5000, // feedback duration for correct and incorrect trials, respectively
    too_fast: 350, // feedback duration for correct and incorrect trials, respectively
    feedback_text: ["Richtig!", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    feedback_font: "50px Arial",
    resp_keys: ["F", "J"],
    box_colours: ["green", "blue"],
    question: ["Ist der Ball in der grünen Box?", "Ist der Ball in der blauen Box?"],
    prompt_font_size: "40px",
    prompt_font_weight: "bold",
    prompt_offset: -30,
    video_scale: 1,
    square_size: 100,
    square_x_offset: 400,
    square_y_offset: 60,
    square_border_width: 5,
    ctrl: 1,
    cblk: 1,
};

// 2 versions (thumb gestures version 1 vs. head gestures version 2)
const VERSION = Number(jsPsych.data.urlVariables().version); // version is provided in the url
// or set explicitly if testing
// const VERSION = 1;
let gesture_type;
if (VERSION === 1) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Thumb" });
    gesture_type = "Daumen hoch oder Daumen herunter";
} else if (VERSION === 2) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Head" });
    gesture_type = "Kopfnicken oder Kopfschütteln";
}

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
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig, Sie dürfen das Experiment jederzeit abbrechen.
Bitte stellen Sie sicher, dass Sie sich in einer ruhigen Umgebung befinden und genügend Zeit haben,
um das Experiment durchzuführen. Wir bitten Sie, die nächsten ca. <u>20</u> Minuten konzentriert zu arbeiten.<br><br>
Informationen zur Versuchspersonenstunde erhalten Sie nach dem Experiment.
Bei Fragen oder Problemen wenden Sie sich bitte an:<br><br>
samuel.sonntag@uni-tuebingen.de<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    post_trial_gap: 1000,
};

const AUDIO_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Das Experiment enthält Videos mit Audio-Inhalten. Bitte stellen Sie daher jetzt Ihre Lautsprecher an 
oder setzen Sie Ihre Kopfhörer auf.<br><br>
Es ist entscheidend, dass die Lautsprecher bzw. Kopfhörer während 
des gesamten Experiments angestellt sind. Wir bitten Sie, dies unbedingt zu beachten!<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
    post_trial_gap: 1000,
};

const MAPPING_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Sie werden im folgenden Experiment in jedem Trial eine Antwort
geben müssen. Dafür sollen Sie die ${PRMS.resp_keys[0]}-Taste und die ${PRMS.resp_keys[1]}-Taste 
ihrer Tastatur verwenden.<br><br>
Verwenden Sie dafür bitte Ihre beiden Zeigefinger wie folgt:<br><br>
${PRMS.resp_keys[0]}-Taste = Linker Zeigefinger 
&ensp;&ensp;
${PRMS.resp_keys[1]}-Taste = Rechter Zeigefinger<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Während des Experiments wird Ihre Aufgabe darin bestehen zu beurteilen, in welcher
der vor Ihnen präsentierten Boxen sich ein imaginärer Ball befindet. Die grundsätzliche Prämisse hierbei ist, dass
der Ball sich stets in einer der beiden vor Ihnen präsentierten befindet.<br><br>
In jedem Durchgang wird auf dem Bildschirm eine Frage präsentiert: Entweder „Ist der Ball in der blauen Box?“ oder „Ist der 
Ball in der grünen Box?“. Weiter unten auf dem Bildschirm erscheinen zudem nebeneinander eine blaue und eine grüne Box. <br><br>
Abschließend sehen Sie ein Video, das eine verbale Antwort (das Wort JA oder NEIN) und/oder eine gestische Antwort (${gesture_type}) 
auf die Frage liefert.<br><br>
${PRMS.resp_keys[0]}-Taste = Linke Box 
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = Rechte Box<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    post_trial_gap: 1000,
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: null,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cblk} von ${PRMS.nblks_prac + PRMS.nblks_exp}<br><br>
Zur Erinnerung, Sie sollen in jedem Trial beurteilen in welcher der beiden
Boxen sich ein imaginärer Ball befindet.
Verwenden Sie hierfür die Ihnen präsentierten Videos.<br><br>
Bedienen Sie die Tasten jeweils mit einem Zeigefinger.<br><br>
${PRMS.resp_keys[0]}-Taste = Linke Box 
&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = Rechte Box<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
            align: "left",
            color: "black",
            fontsize: 30,
            bold: true,
        });
    },
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

function assign_video_files() {
    "use strict";
    let videos_thumb = [
        "../../videos/F/Deutsch/Daumen/JaDaumenHoch_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenRunter_f_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenHoch_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenRunter_m_processed.mp4",
        "../../videos/F/Deutsch/Daumen/JaDaumenHoch_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenRunter_f_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenHoch_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenRunter_m_processed.mp4",
        "../../videos/F/Deutsch/Daumen/JaDaumenNeutral_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenNeutral_f_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenNeutral_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenNeutral_m_processed.mp4",
        "../../videos/F/Gestures/ThumbsUp_f_processed.mp4",
        "../../videos/F/Gestures/ThumbsDown_f_processed.mp4",
        "../../videos/M/Gestures/ThumbsUp_m_processed.mp4",
        "../../videos/M/Gestures/ThumbsDown_m_processed.mp4",
    ];
    let videos_head = [
        "../../videos/F/Deutsch/Kopf/JaKopfJa_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/NeinKopfNein_f_processed.mp4",
        "../../videos/M/Deutsch/Kopf/JaKopfJa_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/NeinKopfNein_m_processed.mp4",
        "../../videos/F/Deutsch/Kopf/JaKopfJa_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/NeinKopfNein_f_processed.mp4",
        "../../videos/M/Deutsch/Kopf/JaKopfJa_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/NeinKopfNein_m_processed.mp4",
        "../../videos/F/Deutsch/Ja_Nein/Ja_f_processed.mp4",
        "../../videos/F/Deutsch/Ja_Nein/Nein_f_processed.mp4",
        "../../videos/M/Deutsch/Ja_Nein/Ja_m_processed.mp4",
        "../../videos/M/Deutsch/Ja_Nein/Nein_m_processed.mp4",
        "../../videos/F/Gestures/HeadYes_f_processed.mp4",
        "../../videos/F/Gestures/HeadNo_f_processed.mp4",
        "../../videos/M/Gestures/HeadYes_m_processed.mp4",
        "../../videos/M/Gestures/HeadNo_m_processed.mp4",
    ];
    if (VERSION === 1) {
        return videos_thumb;
    } else if (VERSION === 2) {
        return videos_head;
    }
}

const VIDEOS = assign_video_files();
// console.log(VIDEOS);

const PRELOAD_VIDEOS = {
    type: jsPsychPreload,
    video: VIDEOS,
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
    return ctx;
}

function draw_fixation(c) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: draw_fixation,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: PRMS.fix_duration,
};

// jsPsych video plugin
const PLAY_VIDEO_1 = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [],
    prompt: null,
    prompt_font_size: PRMS.prompt_font_size,
    prompt_font_weight: PRMS.prompt_font_weight,
    prompt_offset: PRMS.prompt_offset,
    show_squares: true,
    left_square_color: null, // left square color
    right_square_color: null, // right square color
    square_size: PRMS.square_size,
    square_x_offset: PRMS.square_x_offset,
    square_y_offset: PRMS.square_y_offset,
    square_border_width: PRMS.square_border_width,
    mask_video: true,
    video_scale: PRMS.video_scale,
    data: {
        stim_type: "gc1",
        video: jsPsych.timelineVariable("video"),
        voice: jsPsych.timelineVariable("voice"),
        gesture: jsPsych.timelineVariable("gesture"),
        aff_neg: jsPsych.timelineVariable("aff_neg"),
        comp: jsPsych.timelineVariable("comp"),
    },
    on_start: function (trial) {
        "use strict";
        trial.stimulus = [jsPsych.evaluateTimelineVariable("video")];
        PRMS.question = shuffle(PRMS.question);
        trial.prompt = PRMS.question[0];
        PRMS.box_colours = shuffle(PRMS.box_colours);
        trial.left_square_color = PRMS.box_colours[0];
        trial.right_square_color = PRMS.box_colours[1];
        trial.data.question = trial.prompt;
    },
    choices: PRMS.resp_keys,
    response_ends_trial: false,
    trial_ends_after_video: false,
    trial_duration: 1000,
};

// jsPsych video plugin
const PLAY_VIDEO_2 = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [],
    prompt: null,
    prompt_font_size: PRMS.prompt_font_size,
    prompt_font_weight: PRMS.prompt_font_weight,
    prompt_offset: PRMS.prompt_offset,
    show_squares: true,
    left_square_color: null, // left square color
    right_square_color: null, // right square color
    square_size: PRMS.square_size,
    square_x_offset: PRMS.square_x_offset,
    square_y_offset: PRMS.square_y_offset,
    square_border_width: PRMS.square_border_width,
    mask_video: false,
    video_scale: PRMS.video_scale,
    data: {
        stim_type: "gc2",
        video: jsPsych.timelineVariable("video"),
        voice: jsPsych.timelineVariable("voice"),
        gesture: jsPsych.timelineVariable("gesture"),
        aff_neg: jsPsych.timelineVariable("aff_neg"),
        comp: jsPsych.timelineVariable("comp"),
        question: null,
    },
    on_start: function (trial) {
        "use strict";
        trial.stimulus = [jsPsych.evaluateTimelineVariable("video")];
        trial.prompt = PRMS.question[0];
        trial.left_square_color = PRMS.box_colours[0];
        trial.right_square_color = PRMS.box_colours[1];
    },
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_ends_after_video: false,
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // What would be the correct key?
    let correct_key;
    if (PRMS.question[0].includes("blauen") && dat.aff_neg === "aff") {
        correct_key = PRMS.resp_keys[PRMS.box_colours.indexOf("blue")];
    } else if (PRMS.question[0].includes("grünen") && dat.aff_neg === "aff") {
        correct_key = PRMS.resp_keys[PRMS.box_colours.indexOf("green")];
    } else if (PRMS.question[0].includes("blauen") && dat.aff_neg === "neg") {
        correct_key = PRMS.resp_keys[PRMS.box_colours.indexOf("green")];
    } else if (PRMS.question[0].includes("grünen") && dat.aff_neg === "neg") {
        correct_key = PRMS.resp_keys[PRMS.box_colours.indexOf("blue")];
    }

    dat.rt = dat.rt !== null ? dat.rt : PRMS.too_slow;

    let corr_code = 0;
    correct_key = jsPsych.pluginAPI.compareKeys(dat.response, correct_key);

    if (correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (dat.rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    } else if (dat.rt <= PRMS.too_fast) {
        corr_code = 4; // too fast
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
        question: PRMS.question[0],
        box_colour_left: PRMS.box_colours[0],
        box_colour_right: PRMS.box_colours[1],
        corr_code: corr_code,
    });
}

function draw_trial_feedback(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_font;
    ctx.textAlign = "center";

    // draw target
    ctx.fillStyle = "black";
    ctx.fillText(`${args.feedback_text}`, 0, 15);
}

const TRIAL_FEEDBACK = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: draw_iti,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
        trial.stimulus = function (c) {
            draw_trial_feedback(c, { feedback_text: PRMS.feedback_text[dat.corr_code - 1] });
        };
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim_type: "gc2", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(
            PRMS.cblk,
            PRMS.nblks_prac + PRMS.nblks_exp,
            block_dvs.mean_rt,
            block_dvs.error_rate,
            (language = "de"),
        );
        trial.stimulus = `<div style="color: black; font-size:30px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
    post_trial_gap: 1000,
};

function draw_iti(c) {
    "use strict";
    let ctx = c.getContext("2d");
    canvas_style(ctx);
}

const ITI = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: draw_iti,
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

// prettier-ignore
const TRIAL_TABLE = [
  { video: VIDEOS[ 0], voice: "yes",  gesture: "yes", aff_neg: "aff", comp: "comp"     },
  { video: VIDEOS[ 1], voice: "no",   gesture: "no",  aff_neg: "neg", comp: "comp"     },
  { video: VIDEOS[ 2], voice: "yes",  gesture: "yes", aff_neg: "aff", comp: "comp"     },
  { video: VIDEOS[ 3], voice: "no",   gesture: "no",  aff_neg: "neg", comp: "comp"     },
  { video: VIDEOS[ 4], voice: "yes",  gesture: "yes", aff_neg: "aff", comp: "comp"     },
  { video: VIDEOS[ 5], voice: "no",   gesture: "no",  aff_neg: "neg", comp: "comp"     },
  { video: VIDEOS[ 6], voice: "yes",  gesture: "yes", aff_neg: "aff", comp: "comp"     },
  { video: VIDEOS[ 7], voice: "no",   gesture: "no",  aff_neg: "neg", comp: "comp"     },
  { video: VIDEOS[ 8], voice: "yes",  gesture: "na",  aff_neg: "aff", comp: "unimodal" },
  { video: VIDEOS[ 9], voice: "no",   gesture: "na",  aff_neg: "neg", comp: "unimodal" },
  { video: VIDEOS[10], voice: "yes",  gesture: "na",  aff_neg: "aff", comp: "unimodal" },
  { video: VIDEOS[11], voice: "no",   gesture: "na",  aff_neg: "neg", comp: "unimodal" },
  { video: VIDEOS[12], voice: "na",   gesture: "yes", aff_neg: "aff", comp: "unimodal" },
  { video: VIDEOS[13], voice: "na",   gesture: "no",  aff_neg: "neg", comp: "unimodal" },
  { video: VIDEOS[14], voice: "na",   gesture: "yes", aff_neg: "aff", comp: "unimodal" },
  { video: VIDEOS[15], voice: "na",   gesture: "no",  aff_neg: "neg", comp: "unimodal" },
];
// useful debugging commands
// console.table(TRIAL_TABLE);

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, PLAY_VIDEO_1, PLAY_VIDEO_2, TRIAL_FEEDBACK, ITI],
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

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "gc2" });
    // save_data_local(data_fn, { stim_type: "gc2" }); // saves to download folder
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate End Message                            //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<p><strong>Experiment beendet! Vielen Dank für Ihre Teilnahme!</strong></p>" +
        "<p><strong>Mit der Leertaste gelangen Sie zurück zu Prolific, wo Ihnen die Vergütung</strong></p>" +
        "<p><strong>gutgeschrieben wird.</strong></p>",
    response_ends_trial: true,
    choices: [" "],
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    let exp = [];

    exp.push(HTML_CONSENT_FORM);
    exp.push(fullscreen(true));
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(AUDIO_INSTRUCTIONS);
    exp.push(MAPPING_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    for (let blk = 0; blk < PRMS.nblks_prac + PRMS.nblks_exp; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: (blk < PRMS.nblks_prac ? PRMS.ntrls_prac : PRMS.ntrls_exp) / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generates datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
