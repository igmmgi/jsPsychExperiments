// Gesture Conflict Exp 2
//
// Participants always respond to the VOICE (Yes/No)
// Proportion congruency manipulation: experiment split into two halves (MC vs. MI)
// Catch trials use the negative gesture from the alternative gesture type (NoGo)
//
// Version 1: Thumb gestures, MC first half -> MI second half
// Version 2: Thumb gestures, MI first half -> MC second half
// Version 3: Head gestures,  MC first half -> MI second half
// Version 4: Head gestures,  MI first half -> MC second half
//
// Response keys are randomly assigned per participant

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
    ntrls_prac: 20, // number of trials per practice block
    ntrls_exp: 80, // number of trials per experimental block
    nblks_prac: 2, // number of practice blocks (one per half)
    nblks_exp: 8, // number of experimental blocks
    majority_prop: 0.75, // proportion of majority-congruency trials
    minority_prop: 0.20, // proportion of minority-congruency trials
    catch_prop: 0.05, // proportion of catch trials
    n_videos_per_type: 4, // distinct videos for comp, incomp, and catch
    fix_size: 15, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_colour: "black", // colour of fixation cross
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
let gesture_catch_text;
// or set explicitly if testing
// const VERSION = 1;
if ([1, 2].includes(VERSION)) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Thumb" });
    ((gesture_aff = "Daumen hoch"), (gesture_neg = "Daumen runter"));
    gesture_catch_text = "Kopfschütteln";
} else if ([3, 4].includes(VERSION)) {
    jsPsych.data.addProperties({ version: VERSION, gesture_type: "Head" });
    ((gesture_aff = "Kopfnicken"), (gesture_neg = "Kopfschütteln"));
    gesture_catch_text = "Daumen runter";
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
um das Experiment durchzuführen. Wir bitten Sie, die nächsten ca. <u>45</u> Minuten konzentriert zu arbeiten.<br><br>
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
Ihre Aufgabe ist es zu beurteilen, ob die Person im Video das Wort JA oder NEIN <b>sagt</b>.<br><br>
<b>WICHTIG:</b> Wenn die Person jedoch die Geste <b>${gesture_catch_text}</b> macht, 
dann drücken Sie <b>KEINE Taste</b> und warten Sie einfach ab!<br><br>
Ansonsten gilt:<br>
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

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: null,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cblk} von ${PRMS.nblks_prac + PRMS.nblks_exp}<br><br>
Entscheiden Sie: Sagt die Person JA oder NEIN?<br><br>
<b>AUSNAHME:</b> Bei der Geste <b>${gesture_catch_text}</b> <u>keine</u> Taste drücken!<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
            align: "center",
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
    let videos_catch_thumb = [
        "../../videos/F/Deutsch/Kopf/JaKopfNein_f_processed.mp4",
        "../../videos/F/Deutsch/Kopf/NeinKopfNein_f_processed.mp4",
        "../../videos/M/Deutsch/Kopf/JaKopfNein_m_processed.mp4",
        "../../videos/M/Deutsch/Kopf/NeinKopfNein_m_processed.mp4",
    ];
    let videos_catch_head = [
        "../../videos/F/Deutsch/Daumen/JaDaumenRunter_f_processed.mp4",
        "../../videos/F/Deutsch/Daumen/NeinDaumenRunter_f_processed.mp4",
        "../../videos/M/Deutsch/Daumen/JaDaumenRunter_m_processed.mp4",
        "../../videos/M/Deutsch/Daumen/NeinDaumenRunter_m_processed.mp4",
    ];
    if ([1, 2].includes(VERSION)) {
        return { std: videos_thumb, catch: videos_catch_thumb };
    } else if ([3, 4].includes(VERSION)) {
        return { std: videos_head, catch: videos_catch_head };
    }
}

const VIDEOS_ALL = assign_video_files();
const VIDEOS = VIDEOS_ALL.std;
const CATCH_VIDEOS = VIDEOS_ALL.catch;

const PRELOAD_VIDEOS = {
    type: jsPsychPreload,
    video: VIDEOS.concat(CATCH_VIDEOS),
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
        proportion_condition: jsPsych.timelineVariable("proportion_condition"),
    },
    video_scale: PRMS.video_scale,
    on_start: function (trial) {
        "use strict";
        trial.stimulus = [jsPsych.evaluateTimelineVariable("video")];
    },
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_ends_after_video: false,
    trial_duration: PRMS.too_slow,
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

    if (dat.correct_key === null) {
        // CATCH TRIAL
        if (dat.response === null) {
            corr_code = 1; // Correct
        } else {
            corr_code = 2; // False Alarm
        }
    } else {
        // NORMAL TRIAL
        let correct_key = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);

        if (correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
            corr_code = 1; // correct
        } else if (!correct_key && dat.response !== null && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
            corr_code = 2; // choice error
        } else if (dat.rt >= PRMS.too_slow) {
            corr_code = 3; // too slow
        } else if (dat.rt <= PRMS.too_fast) {
            corr_code = 4; // too fast
        }
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

const TRIAL_TABLE_CATCH = [
    {
        video: CATCH_VIDEOS[0],
        resp_modality: "voice",
        voice: "yes",
        gesture: "no",
        comp: "catch",
        aff_neg: "catch",
        correct_key: null,
    },
    {
        video: CATCH_VIDEOS[1],
        resp_modality: "voice",
        voice: "no",
        gesture: "no",
        comp: "catch",
        aff_neg: "catch",
        correct_key: null,
    },
    {
        video: CATCH_VIDEOS[2],
        resp_modality: "voice",
        voice: "yes",
        gesture: "no",
        comp: "catch",
        aff_neg: "catch",
        correct_key: null,
    },
    {
        video: CATCH_VIDEOS[3],
        resp_modality: "voice",
        voice: "no",
        gesture: "no",
        comp: "catch",
        aff_neg: "catch",
        correct_key: null,
    },
];

function create_block_trials(condition, is_prac) {
    "use strict";
    let trials = [];

    let ntrls = is_prac ? PRMS.ntrls_prac : PRMS.ntrls_exp;
    let n_majority = Math.round(ntrls * PRMS.majority_prop);
    let n_minority = Math.round(ntrls * PRMS.minority_prop);
    let n_catch = Math.round(ntrls * PRMS.catch_prop);

    // Sanity check: proportions must sum to the requested block size
    console.assert(
        n_majority + n_minority + n_catch === ntrls,
        `Trial counts (${n_majority}+${n_minority}+${n_catch}=${n_majority + n_minority + n_catch}) != ntrls (${ntrls})`,
    );

    let v_comp = TRIAL_TABLE_VOICE.filter((t) => t.comp === "comp");
    let v_incomp = TRIAL_TABLE_VOICE.filter((t) => t.comp === "incomp");
    let v_catch = TRIAL_TABLE_CATCH;

    // Determine which type is majority/minority based on MC vs. MI
    let [v_major, v_minor] = condition === "MC" ? [v_comp, v_incomp] : [v_incomp, v_comp];

    if (is_prac) {
        // Build oversized pools and sample the required number
        let reps = Math.ceil(n_majority / PRMS.n_videos_per_type);
        let pool_major = [];
        let pool_minor = [];
        for (let i = 0; i < reps; i++) pool_major = pool_major.concat(v_major);
        for (let i = 0; i < reps; i++) pool_minor = pool_minor.concat(v_minor);

        trials = trials.concat(shuffle(pool_major).slice(0, n_majority));
        trials = trials.concat(shuffle(pool_minor).slice(0, n_minority));
        trials = trials.concat(shuffle(v_catch).slice(0, n_catch));
    } else {
        // Experimental blocks: repeat each video an equal number of times
        let reps_major = n_majority / PRMS.n_videos_per_type;
        let reps_minor = n_minority / PRMS.n_videos_per_type;
        let reps_catch = n_catch / PRMS.n_videos_per_type;

        console.assert(
            Number.isInteger(reps_major) && Number.isInteger(reps_minor) && Number.isInteger(reps_catch),
            `Non-integer repetitions: major=${reps_major}, minor=${reps_minor}, catch=${reps_catch}`,
        );

        for (let i = 0; i < reps_major; i++) trials = trials.concat(v_major);
        for (let i = 0; i < reps_minor; i++) trials = trials.concat(v_minor);
        for (let i = 0; i < reps_catch; i++) trials = trials.concat(v_catch);
    }

    // Tag each trial with the proportion condition
    trials = trials.map((t) => ({ ...t, proportion_condition: condition }));

    return shuffle(trials);
}

const AUDIO_QUESTION_EXPLANATION = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Fast geschafft! Wir haben nur noch eine letzte Frage. In der 
Folge möchten wir von Ihnen wissen ob Sie zu einem Zeitpunkt des Experiments
ihren Ton ausgeschaltet haben, oder die Geste gar nicht beobachtet haben.<br><br>
<u><i>Ihre Antwort hat keine Auswirkung auf Ihre Vergütung.</i></u><br><br>
Seien Sie daher bitte ehrlich in Ihrer Antwort, damit wir Ihren Datensatz 
gegebenenfalls von der Auswertung ausschließen können.<br><br>
Drücken Sie eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    post_trial_gap: 1000,
};

const AUDIO_QUESTION = {
    type: jsPsychSurvey,
    survey_json: {
        elements: [
            {
                type: "radiogroup",
                name: "AudioQuestion",
                isRequired: true,
                title: "Haben Sie zu einem beliebigen Zeitpunkt des Experiments den Ton abgestellt?",
                choices: ["Ja", "Nein"],
            },
            {
                type: "radiogroup",
                name: "VideoQuestion",
                isRequired: true,
                title: "Haben Sie zu einem beliebigen Zeitpunkt des Experiments das Video nicht angeschaut?",
                choices: ["Ja", "Nein"],
            },
        ],
    },
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addProperties({
            audio_question: dat.response["AudioQuestion"],
            video_question: dat.response["VideoQuestion"],
            question_rt: dat.rt,
        });
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
    exp.push(PRELOAD_VIDEOS);
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(AUDIO_INSTRUCTIONS);
    exp.push(MAPPING_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    // 2 practice blocks + 8 experimental blocks = 10 total
    // Structure: 1 prac + 4 exp (half 1) then 1 prac + 4 exp (half 2)
    let blocks;
    if ([1, 3].includes(VERSION)) {
        blocks = [
            { condition: "MC", is_prac: true },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
            { condition: "MI", is_prac: true },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
        ];
    } else if ([2, 4].includes(VERSION)) {
        blocks = [
            { condition: "MI", is_prac: true },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
            { condition: "MI", is_prac: false },
            { condition: "MC", is_prac: true },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
            { condition: "MC", is_prac: false },
        ];
    }

    for (let blk = 0; blk < blocks.length; blk += 1) {
        exp.push(BLOCK_START);

        let blk_timeline = {
            timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
            timeline_variables: create_block_trials(blocks[blk].condition, blocks[blk].is_prac),
        };

        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(AUDIO_QUESTION_EXPLANATION);
    exp.push(AUDIO_QUESTION);
    exp.push(end_message());
    exp.push(fullscreen(false));

    // save data
    exp.push(SAVE_DATA);

    // Return to Prolific
    exp.push(END_SCREEN);

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generates datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
