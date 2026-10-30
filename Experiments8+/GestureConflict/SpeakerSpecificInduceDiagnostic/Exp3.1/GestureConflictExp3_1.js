// Gesture Conflict Exp 3.1
//
// Participants always respond to the VOICE (Ja/Nein)
// Inducer items: Thumb gestures (manipulated speaker-specifically: 80/20 vs. 20/80)
// Diagnostic items: Head gestures (unbiased: 50% congruent, 50% incongruent for both speakers)
//
// Version 1: Female = Mainly Valid (80/20), Male = Mainly Invalid (20/80)
// Version 2: Female = Mainly Invalid (20/80), Male = Mainly Valid (80/20)
//
// Response keys (F/J) are randomly assigned per participant

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
    ntrls_prac: 28, // 20 inducer (10 F, 10 M: 8 major, 2 minor each) + 8 diagnostic (4 F, 4 M: 2 comp, 2 incomp each)
    ntrls_exp: 56, // 40 inducer (20 F, 20 M: 16 major, 4 minor each) + 16 diagnostic (8 F, 8 M: 4 comp, 4 incomp each)
    nblks_prac: 1, // number of practice blocks
    nblks_exp: 8, // number of experimental blocks
    n_videos_per_type_speaker: 2, // distinct videos for comp and incomp per speaker
    fix_size: 15, // size of fixation cross
    fix_width: 5, // width of fixation cross
    fix_colour: "black", // colour of fixation cross
    fix_duration: 500, // duration of fixation cross
    feedback_duration: [500, 1500, 1500, 1500], // feedback duration (correct, incorrect, too slow, too fast)
    too_slow: 3350,
    too_fast: 350,
    feedback_text: ["Richtig!", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of inter-trial-interval
    feedback_font: "50px Arial",
    resp_keys: ["F", "J"],
    resp_mapping: shuffle(["Nein", "Ja"]), // no/yes randomly assigned to left/right keys
    video_scale: 1,
    ctrl: 1,
    cblk: 1,
};

// 2 versions (counterbalancing speaker validity)
const VERSION = Number(jsPsych.data.urlVariables().version) || 1;
jsPsych.data.addProperties({
    version: VERSION,
    series: "SpeakerSpecificInduceDiagnostic",
    experiment: "Exp3.1",
    inducer_modality: "Thumb",
    diagnostic_modality: "Head",
    resp_mapping: `${PRMS.resp_keys[0]}=${PRMS.resp_mapping[0]}, ${PRMS.resp_keys[1]}=${PRMS.resp_mapping[1]}`,
});

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
um das Experiment durchzuführen. Wir bitten Sie, die nächsten ca. <u>30</u> Minuten konzentriert zu arbeiten.<br><br>
Informationen zur Versuchspersonenstunde erhalten Sie nach dem Experiment.
Bei Fragen oder Problemen wenden Sie sich bitte an:<br><br>
samuel.sonntag@uni-tuebingen.de<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
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
Ihrer Tastatur verwenden.<br><br>
Verwenden Sie dafür bitte Ihre beiden Zeigefinger wie folgt:<br><br>
${PRMS.resp_keys[0]}-Taste = Linker Zeigefinger 
&ensp;&ensp;
${PRMS.resp_keys[1]}-Taste = Rechter Zeigefinger<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Im folgenden Experiment wird Ihnen in jedem Trial ein kurzes Video präsentiert.<br><br>
Ihre Aufgabe ist es zu beurteilen, ob die Person im Video das Wort <b>JA</b> oder <b>NEIN</b> spricht.<br><br>
Reagieren Sie bitte so schnell und so korrekt wie möglich:<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
    post_trial_gap: 1000,
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    choices: [" "],
    stimulus: null,
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cblk} von ${PRMS.nblks_prac + PRMS.nblks_exp}<br><br>
Entscheiden Sie: Sagt die Person JA oder NEIN?<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]}
&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; 
${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
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

const VIDEOS_INDUCE_THUMB = [
    "../../videos/F/Deutsch/Daumen/JaDaumenHoch_f_processed.mp4",
    "../../videos/F/Deutsch/Daumen/JaDaumenRunter_f_processed.mp4",
    "../../videos/F/Deutsch/Daumen/NeinDaumenHoch_f_processed.mp4",
    "../../videos/F/Deutsch/Daumen/NeinDaumenRunter_f_processed.mp4",
    "../../videos/M/Deutsch/Daumen/JaDaumenHoch_m_processed.mp4",
    "../../videos/M/Deutsch/Daumen/JaDaumenRunter_m_processed.mp4",
    "../../videos/M/Deutsch/Daumen/NeinDaumenHoch_m_processed.mp4",
    "../../videos/M/Deutsch/Daumen/NeinDaumenRunter_m_processed.mp4",
];

const VIDEOS_DIAGNOSTIC_HEAD = [
    "../../videos/F/Deutsch/Kopf/JaKopfJa_f_processed.mp4",
    "../../videos/F/Deutsch/Kopf/JaKopfNein_f_processed.mp4",
    "../../videos/F/Deutsch/Kopf/NeinKopfJa_f_processed.mp4",
    "../../videos/F/Deutsch/Kopf/NeinKopfNein_f_processed.mp4",
    "../../videos/M/Deutsch/Kopf/JaKopfJa_m_processed.mp4",
    "../../videos/M/Deutsch/Kopf/JaKopfNein_m_processed.mp4",
    "../../videos/M/Deutsch/Kopf/NeinKopfJa_m_processed.mp4",
    "../../videos/M/Deutsch/Kopf/NeinKopfNein_m_processed.mp4",
];

const PRELOAD_VIDEOS = {
    type: jsPsychPreload,
    video: VIDEOS_INDUCE_THUMB.concat(VIDEOS_DIAGNOSTIC_HEAD),
};

////////////////////////////////////////////////////////////////////////
//                           Exp Canvas Parts                         //
////////////////////////////////////////////////////////////////////////

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
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

const PLAY_VIDEO = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [],
    data: {
        stim_type: "gc",
        item_type: jsPsych.timelineVariable("item_type"),
        stim_modality: jsPsych.timelineVariable("stim_modality"),
        video: jsPsych.timelineVariable("video"),
        resp_modality: jsPsych.timelineVariable("resp_modality"),
        voice: jsPsych.timelineVariable("voice"),
        gesture: jsPsych.timelineVariable("gesture"),
        comp: jsPsych.timelineVariable("comp"),
        aff_neg: jsPsych.timelineVariable("aff_neg"),
        correct_key: jsPsych.timelineVariable("correct_key"),
        speaker_validity: jsPsych.timelineVariable("speaker_validity"),
        proportion_condition: jsPsych.timelineVariable("proportion_condition"),
        gender: jsPsych.timelineVariable("gender"),
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
    choices: [" "],
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
            "de",
        );
        text = text.replace("Drücke eine beliebige Taste, um fortzufahren!", "Drücken Sie die Leertaste, um fortzufahren!");
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

////////////////////////////////////////////////////////////////////////
//                        Trial Tables Creation                       //
////////////////////////////////////////////////////////////////////////

// prettier-ignore
const TRIAL_TABLE_INDUCE = [
    { video: VIDEOS_INDUCE_THUMB[0], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "F" },
    { video: VIDEOS_INDUCE_THUMB[1], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "yes", gesture: "no", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "F" },
    { video: VIDEOS_INDUCE_THUMB[2], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "no", gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "F" },
    { video: VIDEOS_INDUCE_THUMB[3], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "no", gesture: "no", comp: "comp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "F" },
    { video: VIDEOS_INDUCE_THUMB[4], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "M" },
    { video: VIDEOS_INDUCE_THUMB[5], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "yes", gesture: "no", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "M" },
    { video: VIDEOS_INDUCE_THUMB[6], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "no", gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "M" },
    { video: VIDEOS_INDUCE_THUMB[7], item_type: "inducer", stim_modality: "thumb", resp_modality: "voice", voice: "no", gesture: "no", comp: "comp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "M" },
];

// prettier-ignore
const TRIAL_TABLE_DIAGNOSTIC = [
    { video: VIDEOS_DIAGNOSTIC_HEAD[0], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "F" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[1], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "yes", gesture: "no", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "F" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[2], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "no", gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "F" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[3], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "no", gesture: "no", comp: "comp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "F" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[4], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "M" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[5], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "yes", gesture: "no", comp: "incomp", aff_neg: "aff", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")], gender: "M" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[6], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "no", gesture: "yes", comp: "incomp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "M" },
    { video: VIDEOS_DIAGNOSTIC_HEAD[7], item_type: "diagnostic", stim_modality: "head", resp_modality: "voice", voice: "no", gesture: "no", comp: "comp", aff_neg: "neg", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")], gender: "M" },
];

function create_block_trials(is_prac) {
    "use strict";
    let trials = [];

    // Inducer counts per speaker:
    // Exp: 20 per speaker -> 16 majority (8 per video), 4 minority (2 per video) = 80/20 ratio
    // Prac: 10 per speaker -> 8 majority (4 per video), 2 minority (1 per video) = 80/20 ratio
    const n_inducer_major = is_prac ? 8 : 16;
    const n_inducer_minor = is_prac ? 2 : 4;

    // Diagnostic counts per speaker:
    // Exp: 8 per speaker -> 4 comp (2 per video), 4 incomp (2 per video) = 50/50 ratio
    // Prac: 4 per speaker -> 2 comp (1 per video), 2 incomp (1 per video) = 50/50 ratio
    const n_diag_comp = is_prac ? 2 : 4;
    const n_diag_incomp = is_prac ? 2 : 4;

    for (let gender of ["F", "M"]) {
        // Determine speaker validity condition based on counterbalanced version
        let speaker_validity;
        if (VERSION === 1) {
            speaker_validity = gender === "F" ? "mainly_valid" : "mainly_invalid";
        } else {
            speaker_validity = gender === "F" ? "mainly_invalid" : "mainly_valid";
        }

        // 1. INDUCER TRIALS
        let ind_comp = TRIAL_TABLE_INDUCE.filter((t) => t.comp === "comp" && t.gender === gender);
        let ind_incomp = TRIAL_TABLE_INDUCE.filter((t) => t.comp === "incomp" && t.gender === gender);

        let ind_major = speaker_validity === "mainly_valid" ? ind_comp : ind_incomp;
        let ind_minor = speaker_validity === "mainly_valid" ? ind_incomp : ind_comp;

        ind_major = ind_major.map((t) => ({ ...t, speaker_validity: speaker_validity, proportion_condition: speaker_validity }));
        ind_minor = ind_minor.map((t) => ({ ...t, speaker_validity: speaker_validity, proportion_condition: speaker_validity }));

        let reps_major = n_inducer_major / PRMS.n_videos_per_type_speaker;
        let reps_minor = n_inducer_minor / PRMS.n_videos_per_type_speaker;

        for (let i = 0; i < reps_major; i++) trials = trials.concat(ind_major);
        for (let i = 0; i < reps_minor; i++) trials = trials.concat(ind_minor);

        // 2. DIAGNOSTIC PROBE TRIALS (Unbiased 50/50 for both speakers)
        let diag_comp = TRIAL_TABLE_DIAGNOSTIC.filter((t) => t.comp === "comp" && t.gender === gender);
        let diag_incomp = TRIAL_TABLE_DIAGNOSTIC.filter((t) => t.comp === "incomp" && t.gender === gender);

        diag_comp = diag_comp.map((t) => ({ ...t, speaker_validity: speaker_validity, proportion_condition: speaker_validity }));
        diag_incomp = diag_incomp.map((t) => ({ ...t, speaker_validity: speaker_validity, proportion_condition: speaker_validity }));

        let reps_diag_comp = n_diag_comp / PRMS.n_videos_per_type_speaker;
        let reps_diag_incomp = n_diag_incomp / PRMS.n_videos_per_type_speaker;

        for (let i = 0; i < reps_diag_comp; i++) trials = trials.concat(diag_comp);
        for (let i = 0; i < reps_diag_incomp; i++) trials = trials.concat(diag_incomp);
    }

    return shuffle(trials);
}

////////////////////////////////////////////////////////////////////////
//                       Surveys & Debriefing                         //
////////////////////////////////////////////////////////////////////////

const AUDIO_QUESTION_EXPLANATION = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Fast geschafft! Wir haben nur noch ein paar letzte Fragen. In der 
Folge möchten wir von Ihnen wissen, ob Sie zu einem Zeitpunkt des Experiments
Ihren Ton ausgeschaltet haben, die Videos nicht angeschaut haben, oder ob 
technische Probleme auftraten.<br><br>
<u><i>Ihre Antwort hat keine Auswirkung auf Ihre Vergütung.</i></u><br><br>
Seien Sie daher bitte ehrlich in Ihrer Antwort, damit wir Ihren Datensatz 
gegebenenfalls von der Auswertung ausschließen können.<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
    post_trial_gap: 1000,
};

const PRACTICE_QUESTION_EXPLANATION = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Sie haben die Übungsphase abgeschlossen!<br><br>
Bevor das eigentliche Experiment beginnt, möchten wir kurz von Ihnen wissen, 
ob Sie bisher Ihren Ton ausgeschaltet haben, die Videos nicht beobachtet haben, 
oder ob technische Probleme auftraten.<br><br>
<u><i>Ihre Antwort hat keine Auswirkung auf Ihre Vergütung.</i></u><br><br>
Seien Sie daher bitte ehrlich in Ihrer Antwort, damit wir Ihren Datensatz 
gegebenenfalls von der Auswertung ausschließen können.<br><br>
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: true,
    }),
    choices: [" "],
    post_trial_gap: 1000,
};

const AUDIO_QUESTION = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Abschließende Fragen",
        showQuestionNumbers: "off",
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
            {
                type: "radiogroup",
                name: "TechnicalQuestion",
                isRequired: true,
                title: "Hatten Sie bei vielen Trials (mindestens 10 Trials pro Block) während der Teilnahme am Experiment technische Probleme (z.B. Video spielt nicht ab, kein Ton oder stark verzögerter Start der Wiedergabe)?",
                choices: ["Ja", "Nein"],
            },
        ],
    },
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addProperties({
            audio_question: dat.response ? dat.response["AudioQuestion"] : null,
            video_question: dat.response ? dat.response["VideoQuestion"] : null,
            technical_question: dat.response ? dat.response["TechnicalQuestion"] : null,
            question_rt: dat.rt,
        });
    },
};

// URL variable to toggle simulation mode: e.g., ?simulate=data-only or ?simulate=visual
const SIMULATION_MODE = jsPsych.data.urlVariables().simulate || null;

const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "gc" });
    if (SIMULATION_MODE) {
        save_data_local(data_fn, { stim_type: "gc" });
    }
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<p><strong>Experiment beendet! Vielen Dank für Ihre Teilnahme!</strong></p>" +
        "<p><strong>Mit der Leertaste gelangen Sie zurück zu Prolific, wo Ihnen die Vergütung gutgeschrieben wird.</strong></p>",
    response_ends_trial: true,
    choices: [" "],
    on_finish: function () {
        window.location.replace("XXX:link end for full experiment");
    },
};

const EARLY_EXIT_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<p><strong>Experiment beendet!</strong></p>" +
        "<p><strong>Da Probleme mit dem Video aufgetreten sind, kann das Experiment leider nicht fortgesetzt werden.</strong></p>" +
        "<p><strong>Mit der Leertaste gelangen Sie zurück zu Prolific.</strong></p>",
    response_ends_trial: true,
    choices: [" "],
    on_finish: function () {
        window.location.replace("XXX: link for end of practice problems");
    },
};

const EARLY_EXIT_CONDITIONAL = {
    timeline: [SAVE_DATA, EARLY_EXIT_SCREEN],
    conditional_function: function () {
        let last_survey = jsPsych.data.get().last(1).values()[0];
        return last_survey.response && last_survey.response["TechnicalQuestion"] === "Ja";
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
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(PRELOAD_VIDEOS);
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(AUDIO_INSTRUCTIONS);
    exp.push(MAPPING_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    let blocks = [];
    for (let i = 0; i < PRMS.nblks_prac; i++) blocks.push({ is_prac: true });
    for (let i = 0; i < PRMS.nblks_exp; i++) blocks.push({ is_prac: false });

    for (let blk = 0; blk < blocks.length; blk += 1) {
        exp.push(BLOCK_START);

        let blk_timeline = {
            timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
            timeline_variables: create_block_trials(blocks[blk].is_prac),
        };

        exp.push(blk_timeline);
        exp.push(BLOCK_FEEDBACK);

        // Quality check questions after the practice block
        if (blk === 0 && !SIMULATION_MODE) {
            exp.push(mouse_cursor(true));
            exp.push(PRACTICE_QUESTION_EXPLANATION);
            exp.push(AUDIO_QUESTION);
            exp.push(EARLY_EXIT_CONDITIONAL);
            exp.push(mouse_cursor(false));
        }
    }

    // Debriefing and final save
    if (!SIMULATION_MODE) {
        exp.push(mouse_cursor(true));
        exp.push(AUDIO_QUESTION_EXPLANATION);
        exp.push(AUDIO_QUESTION);
        exp.push(end_message());
        exp.push(fullscreen(false));
    }
    exp.push(SAVE_DATA);
    if (!SIMULATION_MODE) {
        exp.push(END_SCREEN);
    }

    return exp;
}

const EXP = generate_exp();

if (SIMULATION_MODE) {
    jsPsych.simulate(EXP, SIMULATION_MODE);
} else {
    jsPsych.run(EXP);
}
