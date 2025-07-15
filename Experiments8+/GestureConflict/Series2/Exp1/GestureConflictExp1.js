// Gesture Conflict Exp 1
//
// Participants respond to either verbal (Yes/No) or gestural (Head: nod/shake or Thumbs: up/down) information
// Response modality (verbal/gestural) is manipulated blockwise, whilst gesture type is separated across versions
//
// Version 1: verbal -> thumb -> verbal -> thumb
// Version 2: thumb -> verbal -> thumb -> verbal
// Version 3: verbal -> head -> verbal -> head
// Version 4: head -> verbal -> head -> verbal
//
// Reponse keys are randomly assigned per participant

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({
    on_finish: function () {},
});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [720, 1280];

// Experiment Parameters
const PRMS = {
    ntrls_prac: 16, // number of trials per block (multiple of 8)
    ntrls_exp: 32, // number of trials per block (multiple of 8)
    nblks_prac: 2, // number of blocks
    nblks_exp: 8, // number of blocks
    fix_size: 15, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    feedback_duration: [500, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    too_slow: 3350, // feedback duration for correct and incorrect trials, respectively
    too_fast: 350, // feedback duration for correct and incorrect trials, respectively
    feedback_text: ["Richtig!", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    feedback_font: "50px Arial",
    resp_keys: ["F", "J"],
    resp_mapping: shuffle(["Nein", "Ja"]), // no/yes randomly assigned to left right/keys
    video_scale: 1,
    ctrl: 1,
    cblk: 1,
};

// 4 versions (thumb gestures version 1 vs. head gestures version 2)
const VERSION = Number(jsPsych.data.urlVariables().version); // version is provided in the url
let gesture_aff;
let gesture_neg;
// or set explicitly if testing
// const VERSION = 1;
if ([1, 2].includes(VERSION)) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Thumb" });
    ((gesture_aff = "Daumen hoch"), (gesture_neg = "Daumen runter"));
} else if ([3, 4].includes(VERSION)) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Head" });
    ((gesture_aff = "Kopfnicken"), (gesture_neg = "Kopfschütteln"));
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
        text: `Im folgenden Experiment wird Ihnen in jedem Trial ein Video präsentiert.<br><br>
Ihre Aufgabe ist es zu beurteilen ob die Person im Video Ja oder Nein gestikuliert oder gesagt hat.
Das heißt, ${gesture_aff} oder das Wort JA für Ja und ${gesture_neg} oder das Wort NEIN für Nein.<br><br>
Im Laufe des Experiments wird sich dabei abwechseln auf welche der beiden Dimensionen, Gesten oder Sprache,
Sie achten sollen.<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    post_trial_gap: 1000,
};

const BLOCK_START_GESTURE = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: null,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cblk} von ${PRMS.nblks_prac + PRMS.nblks_exp}<br><br>
Im folgenden Block sollen Sie auf die dargestellten Gesten reagieren.<br>
Das heißt: ${gesture_aff} entspricht 'Ja' und ${gesture_neg} entspricht 'Nein'.<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
            align: "left",
            color: "black",
            fontsize: 30,
            bold: true,
        });
    },
    post_trial_gap: 1000,
};

const BLOCK_START_VOICE = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: null,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cblk} von ${PRMS.nblks_prac + PRMS.nblks_exp}<br><br>
Im folgenden Block sollen Sie auf die Aussagen reagieren.<br><br>
Das heißt: JA entspricht 'Ja' und NEIN entspricht 'Nein'.<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
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
        "../../videos/F/Deutsch/Daumen/JaDaumenRunter_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenHoch_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenRunter_f_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenHoch_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenRunter_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenHoch_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenRunter_m_processed.mp4",
    ];
    let videos_head = [
        "../../videos/F/Deutsch/Kopf/JaKopfJa_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/JaKopfNein_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/NeinKopfJa_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/NeinKopfNein_f_processed.mp4",
        "../../videos/M/Deutsch/Kopf/JaKopfJa_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/JaKopfNein_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/NeinKopfJa_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/NeinKopfNein_m_processed.mp4",
    ];
    if ([1, 2].includes(VERSION)) {
        return videos_thumb;
    } else if ([3, 4].includes(VERSION)) {
        return videos_head;
    }
}

const VIDEOS = assign_video_files();

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
const PLAY_VIDEO = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [],
    data: {
        stim_type: "gc",
        video: jsPsych.timelineVariable("video"),
        resp_modality: jsPsych.timelineVariable("resp_modality"),
        voice: jsPsych.timelineVariable("voice"),
        gesture: jsPsych.timelineVariable("gesture"),
        comp: jsPsych.timelineVariable("comp"),
        aff_neg: jsPsych.timelineVariable("aff_neg"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    video_scale: PRMS.video_scale,
    on_start: function (trial) {
        "use strict";
        trial.stimulus = [jsPsych.evaluateTimelineVariable("video")];
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
        corr_code = 4; // too fast
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
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
            filter_options: { stim_type: "gc", block_num: PRMS.cblk },
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
const TRIAL_TABLE_VOICE = [
  { video: VIDEOS[0], resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp",   aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[1], resp_modality: "voice", voice: "yes", gesture: "no",  comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[2], resp_modality: "voice", voice: "no",  gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[3], resp_modality: "voice", voice: "no",  gesture: "no",  comp: "comp",   aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[4], resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp",   aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[5], resp_modality: "voice", voice: "yes", gesture: "no",  comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[6], resp_modality: "voice", voice: "no",  gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[7], resp_modality: "voice", voice: "no",  gesture: "no",  comp: "comp",   aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
];

// prettier-ignore
const TRIAL_TABLE_GESTURE = [
  { video: VIDEOS[0], resp_modality: "gesture", voice: "yes", gesture: "yes", comp: "comp",   aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[1], resp_modality: "gesture", voice: "yes", gesture: "no",  comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[2], resp_modality: "gesture", voice: "no",  gesture: "yes", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[3], resp_modality: "gesture", voice: "no",  gesture: "no",  comp: "comp",   aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[4], resp_modality: "gesture", voice: "yes", gesture: "yes", comp: "comp",   aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[5], resp_modality: "gesture", voice: "yes", gesture: "no",  comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[6], resp_modality: "gesture", voice: "no",  gesture: "yes", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[7], resp_modality: "gesture", voice: "no",  gesture: "no",  comp: "comp",   aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
];

// useful debugging commands
// console.table(TRIAL_TABLE_VOICE);
// console.table(TRIAL_TABLE_GESTURE);

const TRIAL_TIMELINE_VOICE = {
    timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_VOICE,
};

const TRIAL_TIMELINE_GESTURE = {
    timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_GESTURE,
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
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "gc" });
    // save_data_local(data_fn, { stim_type: "gc" }); // saves to download folder
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
    on_finish: function () {
        window.location.replace("https://app.prolific.com/submissions/complete?cc=C1OYPSA2");
    },
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

    // alternating block types with random assignment of starting order
    let blk_type;
    if ([1, 3].includes(VERSION)) {
        blk_type = repeat_array(["voice", "gesture"], (PRMS.nblks_prac + PRMS.nblks_exp) / 2);
    } else if ([2, 4].includes(VERSION)) {
        blk_type = repeat_array(["gesture", "voice"], (PRMS.nblks_prac + PRMS.nblks_exp) / 2);
    }

    for (let blk = 0; blk < PRMS.nblks_prac + PRMS.nblks_exp; blk += 1) {
        if (blk_type[blk] === "voice") {
            exp.push(BLOCK_START_VOICE);
        } else if (blk_type[blk] === "gesture") {
            exp.push(BLOCK_START_GESTURE);
        }
        let blk_timeline;
        if (blk_type[blk] === "voice") {
            blk_timeline = { ...TRIAL_TIMELINE_VOICE };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: (blk < PRMS.nblks_prac ? PRMS.ntrls_prac : PRMS.ntrls_exp) / TRIAL_TABLE_GESTURE.length,
            };
        } else if (blk_type[blk] === "gesture") {
            blk_timeline = { ...TRIAL_TIMELINE_GESTURE };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: (blk < PRMS.nblks_prac ? PRMS.ntrls_prac : PRMS.ntrls_exp) / TRIAL_TABLE_GESTURE.length,
            };
        }
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));
    exp.push(END_SCREEN);

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generates datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
