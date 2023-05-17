// Modal Congruency Exp2:
// Participants respond to a centrally presented letter (H or S) with randomly
//  assigned key responses (e.g., Key "Q" = H, Key "P" = S). This target stimulus
//  is combined with a distractor stimulus that is presented either in the visual
//  domain (standard flanker type trial) or in the auditory domain (spoken H or S
//  presented via speakers/headphones). Catch trials include the presentation of
//  the letter X as the target indicating that participants should respond to the
//  identity of the distractor (either visual or auditory). The proportion of
//  congruency to incongruent trials (75%/25%) is manipulated blockwise across
//  experiment half, with order of high/low congruency blocks counter-balanced
//  across participants.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    screenRes: [960, 720], // minimum screen resolution requested
    nBlks: 12, // number of blocks (must be multiple of 2)
    nTrlsHighP: { comp_inducer: 60, incomp_inducer: 12, comp_diagnostic: 12, incomp_diagnostic: 12, catch: 4 }, // number of trials practice high (all must be multiples of 4 with min 4)
    nTrlsLowP: { comp_inducer: 12, incomp_inducer: 60, comp_diagnostic: 12, incomp_diagnostic: 12, catch: 4 }, // number of trials practice low
    nTrlsHighE: { comp_inducer: 60, incomp_inducer: 12, comp_diagnostic: 12, incomp_diagnostic: 12, catch: 4 }, // number of trials exp high (all must be multiples of 4 with min 4)
    nTrlsLowE: { comp_inducer: 12, incomp_inducer: 60, comp_diagnostic: 12, incomp_diagnostic: 12, catch: 4 }, // number of trials exp low
    fixDur: 300, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [0, 2000, 2000, 2000], // duration of feedback for each type
    dti: 250, // distractor to target interval
    waitDur: 500, // duration following ...
    iti: 1000, // duration of inter-trial-interval
    tooSlow: 1750, // response slower than x ms -> too slow!
    tooFast: 350, // response slower than x ms -> too fast!
    respKeys: ["Q", "P"],
    respStim: shuffle(["H", "S"]).concat("X"), // stimuli
    stimSize: 75,
    fbTxt: ["", "Falsch", "Zu langsam", "Zu schnell"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

// 4 counter balanced versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, Chrome oder Firefox nutzt und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: prms.waitDur,
};

const task_instructions2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        generate_formatted_html({
            text: `In diesem Experiment siehst und hörst du Buchstaben. Reagiere wie folgt:<br>`,
            align: "left",
            colour: "black",
            fontsize: 30,
            bold: true,
            lineheight: 1.5,
        }) +
        generate_formatted_html({
            text: `${prms.respStim[0]} = "${prms.respKeys[0]} Taste" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${prms.respStim[1]} = "${prms.respKeys[1]} Taste"<br><br>`,
            align: "center",
            colour: "black",
            fontsize: 36,
            bold: true,
        }) +
        generate_formatted_html({
            text: `Aufgabe ist es so schnell und so korrekt wie möglich auf den zentralen Stimulus zu reagieren.<br><br>
             Drücke eine beliebige Taste, um fortzufahren.`,
            align: "center",
            colour: "black",
            fontsize: 30,
            bold: true,
        }),
    post_trial_gap: prms.waitDur,
};

const task_instructions3 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Weiterhin gibt es Trials in denen der zentrale Stimulus ein „X“ ist. <br>
           Reagiere in diesen Trials bitte auf die anderen (visuellen oder auditiven) Stimuli.<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: prms.waitDur,
};

const task_instructions_calibration = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir Buchstaben auditiv und visuell präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du
    deutlich zwischen den zwei Tönen differenzieren kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        colour: "black",
        fontsize: 30,
        bold: true,
        lineheight: 1.5,
    }),
    post_trial_gap: prms.waitDur,
};

const block_start = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>
            Reagiere immer auf das zentralen visuellen Zielreiz mit den Tasten: <br><br>
            ${prms.respStim[0]} = "${prms.respKeys[0]} Taste" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${prms.respStim[1]} = "${prms.respKeys[1]} Taste"<br><br>
            Wenn ein "X" erscheint, reagiere auf die anderen Buchstaben.<br><br>
            Drücke eine beliebige Taste, um fortzufahren.<br>`,
            align: "center",
            colour: "black",
            fontsize: 30,
            bold: true,
            width: "920px",
        });
    },
    post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const visual_letters = [prms.respStim[0], prms.respStim[1]];
const auditory_letters =
    visual_letters[0] === "H"
        ? ["../Sounds/H.wav", "../Sounds/S.wav", "../Sounds/silence.wav"]
        : ["../Sounds/S.wav", "../Sounds/H.wav", "../Sounds/silence.wav"];

const preload = {
    type: jsPsychPreload,
    audio: auditory_letters,
};

// prettier-ignore
const trials_calibration = [
  { audio: auditory_letters[0], visual: visual_letters[0] },
  { audio: auditory_letters[1], visual: visual_letters[1] },
];

// prettier-ignore
function set_trials_congruent_inducer(version) {
    if ([1, 2].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[0], distractor: prms.respStim[0], modality: "Visual",   wav: auditory_letters[2], congruency: "Congruent", trialtype: "inducer", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[1], distractor: prms.respStim[1], modality: "Visual",   wav: auditory_letters[2], congruency: "Congruent", trialtype: "inducer", corrKey: prms.respKeys[1] },
        ];
    } else if ([3, 4].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[0], distractor: prms.respStim[0], modality: "Auditory", wav: auditory_letters[0], congruency: "Congruent", trialtype: "inducer", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[1], distractor: prms.respStim[1], modality: "Auditory", wav: auditory_letters[1], congruency: "Congruent", trialtype: "inducer", corrKey: prms.respKeys[1] },
        ];
    }
}
const trials_congruent_inducer = set_trials_congruent_inducer(version);

// prettier-ignore
function set_trials_congruent_diagnostic(version) {
    if ([1, 2].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[0], distractor: prms.respStim[0], modality: "Auditory", wav: auditory_letters[0], congruency: "Congruent", trialtype: "diagnostic", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[1], distractor: prms.respStim[1], modality: "Auditory", wav: auditory_letters[1], congruency: "Congruent", trialtype: "diagnostic", corrKey: prms.respKeys[1] }
        ];
    } else if ([3, 4].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[0], distractor: prms.respStim[0], modality: "Visual",   wav: auditory_letters[2], congruency: "Congruent", trialtype: "diagnostic", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[1], distractor: prms.respStim[1], modality: "Visual",   wav: auditory_letters[2], congruency: "Congruent", trialtype: "diagnostic", corrKey: prms.respKeys[1] }
        ];
    }
}
const trials_congruent_diagnostic = set_trials_congruent_diagnostic(version);

// prettier-ignore
function set_trials_incongruent_inducer(version) {
    if ([1, 2].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[0], distractor: prms.respStim[1], modality: "Visual",    wav: auditory_letters[2], congruency: "Incongruent", trialtype: "inducer", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[1], distractor: prms.respStim[0], modality: "Visual",    wav: auditory_letters[2], congruency: "Incongruent", trialtype: "inducer", corrKey: prms.respKeys[1] },
        ];
    } else if ([3, 4].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[0], distractor: prms.respStim[1], modality: "Auditory",  wav: auditory_letters[1], congruency: "Incongruent", trialtype: "inducer", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[1], distractor: prms.respStim[0], modality: "Auditory",  wav: auditory_letters[0], congruency: "Incongruent", trialtype: "inducer", corrKey: prms.respKeys[1] },
        ];
    }
}
const trials_incongruent_inducer = set_trials_incongruent_inducer(version);

// prettier-ignore
function set_trials_incongruent_diagnostic(version) {
    if ([1, 2].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[0], distractor: prms.respStim[1], modality: "Auditory",  wav: auditory_letters[1], congruency: "Incongruent", trialtype: "diagnostic", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "visual",   target: prms.respStim[1], distractor: prms.respStim[0], modality: "Auditory",  wav: auditory_letters[0], congruency: "Incongruent", trialtype: "diagnostic", corrKey: prms.respKeys[1] }
        ];
    } else if ([3, 4].includes(version)) {
        return [
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[0], distractor: prms.respStim[1], modality: "Visual",    wav: auditory_letters[2], congruency: "Incongruent", trialtype: "diagnostic", corrKey: prms.respKeys[0] },
            { type: "Flanker", inducer_modality: "auditory", target: prms.respStim[1], distractor: prms.respStim[0], modality: "Visual",    wav: auditory_letters[2], congruency: "Incongruent", trialtype: "diagnostic", corrKey: prms.respKeys[1] }
        ];
    }
}
const trials_incongruent_diagnostic = set_trials_incongruent_diagnostic(version);

// prettier-ignore
function set_trials_catch(version) {
    if ([1,2].includes(version)) {
        return [
            { type: "Catch", inducer_modality: "visual",   target: prms.respStim[2], distractor: prms.respStim[0], modality: "Visual",   wav: auditory_letters[2], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[0] },
            { type: "Catch", inducer_modality: "visual",   target: prms.respStim[2], distractor: prms.respStim[1], modality: "Visual",   wav: auditory_letters[2], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[1] },
            { type: "Catch", inducer_modality: "visual",   target: prms.respStim[2], distractor: prms.respStim[0], modality: "Auditory", wav: auditory_letters[0], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[0] },
            { type: "Catch", inducer_modality: "visual",   target: prms.respStim[2], distractor: prms.respStim[1], modality: "Auditory", wav: auditory_letters[1], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[1] }
        ];
    } else if ([3,4].includes(version)) {
        return [
            { type: "Catch", inducer_modality: "auditory", target: prms.respStim[2], distractor: prms.respStim[0], modality: "Visual",   wav: auditory_letters[2], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[0] },
            { type: "Catch", inducer_modality: "auditory", target: prms.respStim[2], distractor: prms.respStim[1], modality: "Visual",   wav: auditory_letters[2], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[1] },
            { type: "Catch", inducer_modality: "auditory", target: prms.respStim[2], distractor: prms.respStim[0], modality: "Auditory", wav: auditory_letters[0], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[0] },
            { type: "Catch", inducer_modality: "auditory", target: prms.respStim[2], distractor: prms.respStim[1], modality: "Auditory", wav: auditory_letters[1], congruency: "NA", trialtype: "catch", corrKey: prms.respKeys[1] }
        ];
    }
}
const trials_catch = set_trials_catch(version);

const trials_high_pc_practice = [
    repeatArray(deepCopy(trials_congruent_inducer), prms.nTrlsHighP.comp_inducer / 2),
    repeatArray(deepCopy(trials_incongruent_inducer), prms.nTrlsHighP.incomp_inducer / 2),
    repeatArray(deepCopy(trials_congruent_diagnostic), prms.nTrlsHighP.incomp_diagnostic / 2),
    repeatArray(deepCopy(trials_incongruent_diagnostic), prms.nTrlsHighP.incomp_diagnostic / 2),
    repeatArray(deepCopy(trials_catch), prms.nTrlsHighP.catch / 4),
].flat();
trials_high_pc_practice.forEach((i) => (i.block_congruency = "High"));

const trials_low_pc_practice = [
    repeatArray(deepCopy(trials_congruent_inducer), prms.nTrlsLowP.comp_inducer / 2),
    repeatArray(deepCopy(trials_incongruent_inducer), prms.nTrlsLowP.incomp_inducer / 2),
    repeatArray(deepCopy(trials_congruent_diagnostic), prms.nTrlsLowP.comp_diagnostic / 2),
    repeatArray(deepCopy(trials_incongruent_diagnostic), prms.nTrlsLowP.incomp_diagnostic / 2),
    repeatArray(deepCopy(trials_catch), prms.nTrlsLowP.catch / 4),
].flat();
trials_low_pc_practice.forEach((i) => (i.block_congruency = "Low"));

const trials_high_pc_exp = [
    repeatArray(deepCopy(trials_congruent_inducer), prms.nTrlsHighE.comp_inducer / 2),
    repeatArray(deepCopy(trials_incongruent_inducer), prms.nTrlsHighE.incomp_inducer / 2),
    repeatArray(deepCopy(trials_congruent_diagnostic), prms.nTrlsHighE.comp_diagnostic / 2),
    repeatArray(deepCopy(trials_incongruent_diagnostic), prms.nTrlsHighE.incomp_diagnostic / 2),
    repeatArray(deepCopy(trials_catch), prms.nTrlsHighE.catch / 4),
].flat();
trials_high_pc_exp.forEach((i) => (i.block_congruency = "High"));

const trials_low_pc_exp = [
    repeatArray(deepCopy(trials_congruent_inducer), prms.nTrlsLowE.comp_inducer / 2),
    repeatArray(deepCopy(trials_incongruent_inducer), prms.nTrlsLowE.incomp_inducer / 2),
    repeatArray(deepCopy(trials_congruent_diagnostic), prms.nTrlsLowE.comp_diagnostic / 2),
    repeatArray(deepCopy(trials_incongruent_diagnostic), prms.nTrlsLowE.incomp_diagnostic / 2),
    repeatArray(deepCopy(trials_catch), prms.nTrlsLowE.catch / 4),
].flat();
trials_low_pc_exp.forEach((i) => (i.block_congruency = "Low"));

// console.table(trials_high_pc_practice);
// console.table(trials_low_pc_practice);
// console.table(trials_high_pc_exp);
// console.table(trials_low_pc_exp);

function pseudo_shuffle(x) {
    x = shuffle(x);
    while (true) {
        x = shuffle(x);
        let item = 0;
        for (let idx = 0; idx < x.length; idx++) {
            // 1st trial must be inducer
            if ((idx === 0) & (x[idx].trialtype !== "inducer")) {
                break;
            }
            // diagnostic trial cannot follow a catch trial
            if (idx > 0 && x[idx - 1].trialtype === "catch" && x[idx].trialtype === "diagnostic") {
                break;
            }
            item++;
        }
        if (item === x.length) {
            break;
        }
    }
    return x;
}

// pseudo_shuffle(trials_high_pc_practice);
// pseudo_shuffle(trials_low_pc_practice);
// pseudo_shuffle(trials_high_pc_exp);
// pseudo_shuffle(trials_low_pc_exp);

// console.table(trials_high_pc_practice);
// console.table(trials_low_pc_practice_shuffled);
// console.table(trials_high_pc_exp_shuffled);
// console.table(trials_low_pc_exp_shuffled);

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:${prms.fixSize}px;">+</div>`,
    response_ends_trial: false,
    trial_duration: prms.fixDur,
};

const iti = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: prms.iti,
};

const trial_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.corrCode - 1];
        trial.stimulus = `<div style="font-size:${prms.fbTxtSizeTrial}px;">${prms.fbTxt[dat.corrCode - 1]}</div>`;
        if (dat.corrCode != 1) {
            trial.stimulus += `<div style="font-size:${prms.fbTxtSizeTrial}px;"><br>${prms.respStim[0]} = "${prms.respKeys[0]} Taste" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${prms.respStim[1]} = "${prms.respKeys[1]} Taste"<br><br></div>`;
        }
    },
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrKey);

    if (correctKey && (dat.rt > prms.tooFast) & (dat.rt < prms.tooSlow)) {
        corrCode = 1; // correct
    } else if (!correctKey && (dat.rt > prms.tooFast) & (dat.rt < prms.tooSlow)) {
        corrCode = 2; // choice error
    } else if (dat.rt >= prms.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= prms.tooFast) {
        corrCode = 4; // too fast
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: prms.cBlk,
        trialNum: prms.cTrl,
        corrCode: corrCode,
    });
}

const audio_calibration = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable("audio"),
    prompt: "",
    choices: [],
    trial_duration: 500,
    response_ends_trial: false,
    post_trial_gap: 500,
    on_start: function (trial) {
        let v = jsPsych.timelineVariable("visual");
        trial.prompt = `<div style="font-size:${prms.stimSize}px;">${v}</div>`;
    },
};

const flanker_modality_trial = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable("wav"),
    prompt: "",
    prompt2: "",
    trial_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    prompt2_onset: prms.dti,
    data: {
        stim: "modal_flanker",
        type: jsPsych.timelineVariable("type"),
        target: jsPsych.timelineVariable("target"),
        distractor: jsPsych.timelineVariable("distractor"),
        modality: jsPsych.timelineVariable("modality"),
        wav: jsPsych.timelineVariable("wav"),
        congruency: jsPsych.timelineVariable("congruency"),
        block_congruency: jsPsych.timelineVariable("block_congruency"),
        corrKey: jsPsych.timelineVariable("corrKey"),
    },
    on_start: function (trial) {
        let distractor = trial.data.modality === "Visual" ? jsPsych.timelineVariable("distractor") : "\xa0";
        let stimulus = distractor + "\xa0" + distractor;
        trial.prompt = `<div style="font-size:${prms.stimSize}px; font-family: monospace">${stimulus}</div>`;

        let target = jsPsych.timelineVariable("target");
        distractor = trial.data.modality === "Visual" ? jsPsych.timelineVariable("distractor") : "\xa0";
        stimulus = distractor + target + distractor;
        trial.prompt2 = `<div style="font-size:${prms.stimSize}px; font-family: monospace">${stimulus}</div>`;
    },
    on_finish: function () {
        codeTrial();
        prms.cTrl += 1;
    },
};

const trial_timeline_calibration = {
    timeline: [audio_calibration],
    timeline_variables: trials_calibration,
    sample: {
        type: "fixed-repetitions",
        size: 10,
    },
};

const block_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "modal_flanker", blockNum: prms.cBlk } });
        let text = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        prms.cTrl = 1;
        prms.cBlk += 1;
    },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////

const PROLIFIC = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Super, du bist am Ende des Experiments!
               Vielen Dank für deine Teilnahme :)<br><br>
               Über folgenden Link geht es zurück zu Prolific:<br><br>
               https://app.prolific.co/submissions/complete?cc=CXBEBDM6<br><br>
               Drücke die Leertaste, um das Experiment abzuschließen!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    on_finish: function () {
        window.location.replace("https://app.prolific.co/submissions/complete?cc=CXBEBDM6");
    },
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${dirName}data/version${version}/${expName}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, { stim: "modal_flanker" });
    // saveDataLocal(data_fn, { stim: 'modal_flanker' });
}

const save_data = {
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
    exp.push(browser_check(prms.screenRes));
    exp.push(preload);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(task_instructions1);
    exp.push(task_instructions2);
    exp.push(task_instructions3);

    // audio calibration
    exp.push(task_instructions_calibration);
    exp.push(trial_timeline_calibration);

    // Counter-balanced congruency proportion order: high --> low vs. low --> high
    let blk_proportion_congruency;
    if ([1, 3].includes(version)) {
        blk_proportion_congruency = repeatArray(["high_pc"], prms.nBlks / 2).concat(
            repeatArray(["low_pc"], prms.nBlks / 2),
        );
    } else if ([2, 4].includes(version)) {
        blk_proportion_congruency = repeatArray(["low_pc"], prms.nBlks / 2).concat(
            repeatArray(["high_pc"], prms.nBlks / 2),
        );
    }

    let blk_timeline;
    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        exp.push(block_start);
        if ((blk == 0) | (blk == prms.nBlks / 2)) {
            // practice blocks
            if (blk_proportion_congruency[blk] === "high_pc") {
                blk_timeline = {
                    timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
                    timeline_variables: deepCopy(pseudo_shuffle(trials_high_pc_practice)),
                };
            } else if (blk_proportion_congruency[blk] === "low_pc") {
                blk_timeline = {
                    timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
                    timeline_variables: deepCopy(pseudo_shuffle(trials_low_pc_practice)),
                };
            }
        } else {
            // experiment blocks
            if (blk_proportion_congruency[blk] === "high_pc") {
                blk_timeline = {
                    timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
                    timeline_variables: deepCopy(pseudo_shuffle(trials_high_pc_exp)),
                };
            } else if (blk_proportion_congruency[blk] === "low_pc") {
                blk_timeline = {
                    timeline: [fixation_cross, flanker_modality_trial, trial_feedback, iti],
                    timeline_variables: deepCopy(pseudo_shuffle(trials_low_pc_exp)),
                };
            }
        }
        exp.push(blk_timeline); // trials within a block
        exp.push(block_feedback);
    }

    exp.push(save_data);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));
    exp.push(PROLIFIC);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
