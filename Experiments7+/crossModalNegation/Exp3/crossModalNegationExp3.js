// Cross Modal Negation
// VPs respond to the combined auditory/visual presentation of the following stimuli:
// nicht/jetzt (auditory/visual) and links/rechts (auditory/visual)
// For example:
// "jetzt" (auditory) + "links" (visual) requiring a left keypress
// "nicht" (auditory) + "links" (visual) requiring a right keypress

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 1, // number of blocks
    nTrlsP: 16, // number of blocks
    nTrlsE: 64, // number of blocks
    fixDur: 1000, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [500, 1500, 1500, 1500], // duration of feedback for each type
    waitDur: 1000, // duration following ...
    iti: 500, // duration of inter-trial-interval
    tooFast: 150, // responses faster than x ms -> too fast!
    tooSlow: 2000, // response slower than x ms -> too slow!
    respKeys: ["Q", "P"],
    stimSize: 75,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 25 Minuten konzentriert zu arbeiten.<br><br>
Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
Bei Fragen oder Problemen wende dich bitte an:<br><br>
XXX<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment siehst und hörst du Wörter. Bitte kombiniere die Bedeutung. Reagiere wie folgt: 
              WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
              "jetzt links/nicht rechts" = "Q"; "jetzt rechts/nicht links" = "P"<br><br>
              Bitte antworte so schnell und so korrekt wie möglich!<br><br>
              Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<h3 style='text-align: center;'>ACHTUNG-Soundkalibierung: </h3>" +
        "<h3 style='text-align: left;'>Im Folgenden werden dir Worter audativ und visuell präsentiert.</h3>" +
        "<h3 style='text-align: left;'>Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du </h3>" +
        "<h3 style='text-align: left;'>deutlich zwischen den zwei Tönen differenzieren kannst.</h3>" +
        "<h3 style='text-align: left;'>Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).</h3><br>" +
        "<h2 style='text-align: center;'>Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!</h2>",
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    on_start: function(trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
            Q = links, P = rechts <br><br>
            Drücke eine beliebige Taste, um fortzufahren.<br>`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const SOUNDS = [
    "../sounds/jetzt.wav",
    "../sounds/nicht.wav",
    "../sounds/links.wav",
    "../sounds/rechts.wav ",
    "../sounds/silence.wav",
];
const WORDS = ["jetzt", "nicht", "links", "rechts"];

const PRELOAD = {
    type: jsPsychPreload,
    audio: SOUNDS,
};

// prettier-ignore
const TRIALS_CALIBRATION = [
    { audio: SOUNDS[0], visual: WORDS[0] },
    { audio: SOUNDS[1], visual: WORDS[1] },
    { audio: SOUNDS[2], visual: WORDS[2] },
    { audio: SOUNDS[3], visual: WORDS[3] },
]

// prettier-ignore
const TRIAL_TABLE = [
    { mod1: "aud", mod2: "aud", audio1: SOUNDS[0], visual1: "",       audio2: SOUNDS[2], visual2: "",       affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "aud", mod2: "aud", audio1: SOUNDS[0], visual1: "",       audio2: SOUNDS[3], visual2: "",       affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "aud", mod2: "aud", audio1: SOUNDS[1], visual1: "",       audio2: SOUNDS[2], visual2: "",       affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "aud", mod2: "aud", audio1: SOUNDS[1], visual1: "",       audio2: SOUNDS[3], visual2: "",       affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "vis", mod2: "vis", audio1: SOUNDS[4], visual1: WORDS[0], audio2: SOUNDS[4], visual2: WORDS[2], affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "vis", mod2: "vis", audio1: SOUNDS[4], visual1: WORDS[0], audio2: SOUNDS[4], visual2: WORDS[3], affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "vis", mod2: "vis", audio1: SOUNDS[4], visual1: WORDS[1], audio2: SOUNDS[4], visual2: WORDS[2], affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "vis", mod2: "vis", audio1: SOUNDS[4], visual1: WORDS[1], audio2: SOUNDS[4], visual2: WORDS[3], affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "aud", mod2: "vis", audio1: SOUNDS[0], visual1: "",       audio2: SOUNDS[4], visual2: WORDS[2], affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "aud", mod2: "vis", audio1: SOUNDS[0], visual1: "",       audio2: SOUNDS[4], visual2: WORDS[3], affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "aud", mod2: "vis", audio1: SOUNDS[1], visual1: "",       audio2: SOUNDS[4], visual2: WORDS[2], affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "aud", mod2: "vis", audio1: SOUNDS[1], visual1: "",       audio2: SOUNDS[4], visual2: WORDS[3], affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "vis", mod2: "aud", audio1: SOUNDS[4], visual1: WORDS[0], audio2: SOUNDS[2], visual2: "",       affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[0] },
    { mod1: "vis", mod2: "aud", audio1: SOUNDS[4], visual1: WORDS[0], audio2: SOUNDS[3], visual2: "",       affneg: "aff", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "vis", mod2: "aud", audio1: SOUNDS[4], visual1: WORDS[1], audio2: SOUNDS[2], visual2: "",       affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[1] },
    { mod1: "vis", mod2: "aud", audio1: SOUNDS[4], visual1: WORDS[1], audio2: SOUNDS[3], visual2: "",       affneg: "neg", corrKey1: null, corrKey2: PRMS.respKeys[0] },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
};

const ITI = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px;">${PRMS.fbTxt[dat.corrCode - 1]}</div>`;
    },
};

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrKey);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

const AUDIO_CALIBRATION = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable("audio"),
    prompt: "",
    choices: [],
    trial_duration: 1000,
    response_ends_trial: false,
    post_trial_gap: 500,
    on_start: function(trial) {
        let p = jsPsych.timelineVariable("visual");
        trial.prompt = `<div style="font-size:${PRMS.stimSize}px;">${p}</div>`;
    },
};

const NEGATION_STIMULUS1 = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable("audio1"),
    prompt: "",
    trial_duration: 650,
    prompt_duration: 650,
    response_ends_trial: false,
    choices: PRMS.respKeys,
    data: {
        stim: "cmn3",
        audio: jsPsych.timelineVariable("audio1"),
        visual: jsPsych.timelineVariable("visual"),
        affneg: jsPsych.timelineVariable("affneg"),
        corrKey: jsPsych.timelineVariable("corrKey1"),
    },
    on_start: function(trial) {
        let p = jsPsych.timelineVariable("visual1");
        trial.prompt = `<div style="font-size:${PRMS.stimSize}px;">${p}</div>`;
    },
};

const NEGATION_STIMULUS2 = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable("audio2"),
    prompt: "",
    trial_duration: PRMS.tooSlow,
    prompt_duration: 650,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    data: {
        stim: "cmn3",
        audio: jsPsych.timelineVariable("audio2"),
        visual: jsPsych.timelineVariable("visual"),
        affneg: jsPsych.timelineVariable("affneg"),
        corrKey: jsPsych.timelineVariable("corrKey2"),
    },
    on_start: function(trial) {
        let p = jsPsych.timelineVariable("visual2");
        trial.prompt = `<div style="font-size:${PRMS.stimSize}px;">${p}</div>`;
    },
    on_finish: function() {
        codeTrial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [AUDIO_CALIBRATION],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "fixed-repetitions",
        size: 2,
    },
};

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, NEGATION_STIMULUS1, NEGATION_STIMULUS2, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE,
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function(trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "cmn3", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function() {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, "cmn3_");

const ALPHA_NUM = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text:
            `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>
        xxx<br><br>
        Code: ` +
            RANDOM_STRING +
            `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
        fontsize: 28,
        lineheight: 1.0,
        bold: true,
        align: "left",
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, { stim: "cmn3" });

    const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
    saveRandomCode("/Common/write_code.php", code_fn, RANDOM_STRING);
}

const SAVE_DATA = {
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
    exp.push(browser_check(PRMS.screenRes));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    // audio calibration
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: blk === 0 ? PRMS.nTrlsP / TRIAL_TABLE.length : PRMS.nTrlsE / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(ALPHA_NUM);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
