// Simon Task:
// VPs respond to the emotion (happy vs. fear or happy vs. sad)
// of a face presented to the left/right side of the screen.

var _0xfc4b = [
    "\x63\x42\x6C\x6B",
    "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x75\x6E\x69\x2D\x74\x75\x65\x62\x69\x6E\x67\x65\x6E\x2E\x73\x6F\x6E\x61\x2D\x73\x79\x73\x74\x65\x6D\x73\x2E\x63\x6F\x6D\x2F\x77\x65\x62\x73\x74\x75\x64\x79\x5F\x63\x72\x65\x64\x69\x74\x2E\x61\x73\x70\x78\x3F\x65\x78\x70\x65\x72\x69\x6D\x65\x6E\x74\x5F\x69\x64\x3D\x31\x38\x36\x26\x63\x72\x65\x64\x69\x74\x5F\x74\x6F\x6B\x65\x6E\x3D\x39\x37\x36\x32\x62\x64\x62\x33\x63\x35\x32\x38\x34\x31\x65\x63\x39\x39\x31\x37\x37\x61\x36\x65\x33\x36\x38\x34\x64\x36\x30\x34\x26\x73\x75\x72\x76\x65\x79\x5F\x63\x6F\x64\x65\x3D",
    "\x73\x6F\x6E\x61\x5F\x69\x64",
    "\x75\x72\x6C\x56\x61\x72\x69\x61\x62\x6C\x65\x73",
    "\x64\x61\x74\x61",
    "\x61\x73\x73\x69\x67\x6E",
    "\x6C\x6F\x63\x61\x74\x69\x6F\x6E",
];

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS[_0xfc4b[0]] >= 8) {
            window[_0xfc4b[6]][_0xfc4b[5]](_0xfc4b[1] + jsPsych[_0xfc4b[4]][_0xfc4b[3]]()[_0xfc4b[2]]);
        }
    },
});

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 16, // number of blocks
    fixDur: 500, // duration of fixation cross
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fbDur: [0, 1500, 1500, 1500], // duration of feedback for each type
    waitDur: 1000, // duration following ...
    iti: 500, // duration of inter-trial-interval
    tooFast: 150, // responses faster than x ms -> too fast!
    tooSlow: 1500, // response slower than x ms -> too slow!
    respKeys: ["Q", "P"],
    target_fh: shuffle(["änglichstes", "glückliches"]),
    target_sh: [],
    stimEccentricity: 250,
    fbTxt: ["", "Falsch", "Zu langsam", "Zu schnell"],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

let idx = PRMS.target_fh.indexOf("änglichstes");
if (idx === 0) {
    PRMS["target_sh"] = ["trauriges", "glückliches"];
} else if (idx === 1) {
    PRMS["target_sh"] = ["glückliches", "trauriges"];
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_1ST_HALF_SAD_HAPPY = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In dem ersten Teil des Experimentes siehst du glückliche und traurige Gesichter.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
           Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine glückliche oder traurige Emotion zeigt.<br><br>
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
           "Q" = ${PRMS.target_sh[0]} Gesicht &emsp; "P" = ${PRMS.target_sh[1]} Gesicht<br><br>
           Bitte antworte so schnell und so korrekt wie möglich!<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_1ST_HALF_FEAR_HAPPY = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In dem ersten Teil des Experimentes siehst du glückliche und ängstliche Gesichter.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
           Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine glückliche oder ängstliche Emotion zeigt.<br><br>
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
           "Q" = ${PRMS.target_fh[0]} Gesicht &emsp; "P" = ${PRMS.target_fh[1]} Gesicht<br><br>
           Bitte antworte so schnell und so korrekt wie möglich!<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const BLOCK_START_FH = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
             "Q" = ${PRMS.target_fh[0]} Gesicht &emsp; "P" = ${PRMS.target_fh[1]} Gesicht<br><br>
             Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

const BLOCK_START_SH = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
             "Q" = ${PRMS.target_sh[0]} Gesicht &emsp; "P" = ${PRMS.target_sh[1]} Gesicht<br><br>
             Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            colour: "black",
            fontsize: 30,
        });
    },
};

const HALF = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Die Hälfte ist geschafft. Es folgt nun der zweite Teil.
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_2ND_HALF_SAD_HAPPY = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In dem zweiten Teil des Experimentes siehst du glückliche und traurige Gesichter.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
           Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine glückliche oder traurige Emotion zeigt.<br><br>
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
           "Q" = ${PRMS.target_sh[0]} Gesicht &emsp; "P" = ${PRMS.target_sh[1]} Gesicht<br><br>
           Bitte antworte so schnell und so korrekt wie möglich!<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS_2ND_HALF_FEAR_HAPPY = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In dem zweiten Teil des Experimentes siehst du glückliche und ängstliche Gesichter.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
           Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine glückliche oder ängstliche Emotion zeigt.<br><br>
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
           "Q" = ${PRMS.target_fh[0]} Gesicht &emsp; "P" = ${PRMS.target_fh[1]} Gesicht<br><br>
           Bitte antworte so schnell und so korrekt wie möglich!<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// console.log(nimstim_fear);
// console.log(nimstim_happy);
// console.log(nimstim_sad);
// console.log(mpi_fear_old);
// console.log(mpi_happy_old);
// console.log(mpi_sad_old);
// console.log(mpi_fear_middle);
// console.log(mpi_happy_middle);
// console.log(mpi_sad_middle);
// console.log(mpi_fear_young);
// console.log(mpi_happy_young);
// console.log(mpi_sad_young);
// console.log(kdef_fear);
// console.log(kdef_happy);
// console.log(kdef_sad);
// console.log(radboud_fear);
// console.log(radboud_happy);
// console.log(radboud_sad);
// console.log(radiate_fear);
// console.log(radiate_happy);
// console.log(radiate_sad);

const PRELOAD = {
    type: jsPsychPreload,
    images: [
        nimstim_fear,
        nimstim_happy,
        nimstim_sad,
        mpi_fear_old,
        mpi_happy_old,
        mpi_sad_old,
        mpi_fear_middle,
        mpi_happy_middle,
        mpi_sad_middle,
        mpi_fear_young,
        mpi_happy_young,
        mpi_sad_young,
        kdef_fear,
        kdef_happy,
        kdef_sad,
        radboud_fear,
        radboud_happy,
        radboud_sad,
        radiate_fear,
        radiate_happy,
        radiate_sad,
    ],
};

const IMAGE_NUMBERS_FH = {
    nimstim: randomSelection(range(0, nimstim_fear.length), 40),
    mpi_old: randomSelection(range(0, mpi_fear_old.length), 52),
    mpi_middle: randomSelection(range(0, mpi_fear_middle.length), 52),
    mpi_young: randomSelection(range(0, mpi_fear_young.length), 52),
    kdef: randomSelection(range(0, kdef_fear.length), 52),
    radboud: randomSelection(range(0, radboud_fear.length), 52),
    radiate1: randomSelection(range(0, radiate_fear.length), 52),
    radiate2: null,
};
IMAGE_NUMBERS_FH.radiate2 = randomSelection(
    range(0, radiate_fear.length).filter((x) => !IMAGE_NUMBERS_FH.radiate1.includes(x)),
    52,
);
// console.log(IMAGE_NUMBERS_FH);

function generateStimulusCombinationsFearHappy(dataset_fear, dataset_happy, dataset_name, image_numbers) {
    let simon_type = shuffle(
        repeatArray(["fear_left", "fear_right", "happy_left", "happy_right"], image_numbers.length / 4),
    );
    let trials = [];
    for (let i = 0; i < simon_type.length; i++) {
        let tmp = {};
        tmp.database = dataset_name;
        if (simon_type[i] === "fear_left") {
            tmp.target = dataset_fear[image_numbers[i]];
            tmp.target_type = "fear";
            tmp.target_side = "left";
            tmp.key = PRMS.respKeys[PRMS.target_fh.indexOf("änglichstes")];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? "comp" : "incomp";
        } else if (simon_type[i] === "fear_right") {
            tmp.target = dataset_fear[image_numbers[i]];
            tmp.target_type = "fear";
            tmp.target_side = "right";
            tmp.key = PRMS.respKeys[PRMS.target_fh.indexOf("änglichstes")];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? "comp" : "incomp";
        } else if (simon_type[i] === "happy_left") {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.target_side = "left";
            tmp.key = PRMS.respKeys[PRMS.target_fh.indexOf("glückliches")];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? "comp" : "incomp";
        } else if (simon_type[i] === "happy_right") {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.target_side = "right";
            tmp.key = PRMS.respKeys[PRMS.target_fh.indexOf("glückliches")];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? "comp" : "incomp";
        }
        trials.push(tmp);
    }
    return trials;
}

// prettier-ignore
const TRIALS_NIMSTIM_FH = generateStimulusCombinationsFearHappy(
  nimstim_fear, 
  nimstim_happy, 
  'nimstim', 
  IMAGE_NUMBERS_FH.nimstim
);
const TRIALS_MPI_YOUNG_FH = generateStimulusCombinationsFearHappy(
    mpi_fear_young,
    mpi_happy_young,
    "mpi_young",
    IMAGE_NUMBERS_FH.mpi_young,
);
const TRIALS_MPI_MIDDLE_FH = generateStimulusCombinationsFearHappy(
    mpi_fear_middle,
    mpi_happy_middle,
    "mpi_middle",
    IMAGE_NUMBERS_FH.mpi_middle,
);
const TRIALS_MPI_OLD_FH = generateStimulusCombinationsFearHappy(
    mpi_fear_old,
    mpi_happy_old,
    "mpi_old",
    IMAGE_NUMBERS_FH.mpi_old,
);
const TRIALS_KDEF_FH = generateStimulusCombinationsFearHappy(kdef_fear, kdef_happy, "kdef", IMAGE_NUMBERS_FH.kdef);
const TRIALS_RADBOUD_FH = generateStimulusCombinationsFearHappy(
    radboud_fear,
    radboud_happy,
    "radboud",
    IMAGE_NUMBERS_FH.radboud,
);
const TRIALS_RADIATE1_FH = generateStimulusCombinationsFearHappy(
    radiate_fear,
    radiate_happy,
    "radiate",
    IMAGE_NUMBERS_FH.radiate1,
);
const TRIALS_RADIATE2_FH = generateStimulusCombinationsFearHappy(
    radiate_fear,
    radiate_happy,
    "radiate",
    IMAGE_NUMBERS_FH.radiate2,
);

// console.log(TRIALS_NIMSTIM_FH);
// console.log(TRIALS_MPI_YOUNG_FH);
// console.log(TRIALS_MPI_MIDDLE_FH);
// console.log(TRIALS_MPI_OLD_FH);
// console.log(TRIALS_KDEF_FH);
// console.log(TRIALS_RADBOUD_FH);
// console.log(TRIALS_RADIATE1_FH);
// console.log(TRIALS_RADIATE2_FH);
// function check_comp(dataset) {
//     let comp = 0;
//     for (var i = 0; i < dataset.length; i++) {
//         if (dataset[i].comp === "comp") {
//             comp += 1;
//         }
//     }
//     console.log(comp);
// }
// check_comp(TRIALS_NIMSTIM_FH);
// check_comp(TRIALS_MPI_YOUNG_FH);
// check_comp(TRIALS_MPI_MIDDLE_FH);
// check_comp(TRIALS_MPI_OLD_FH);
// check_comp(TRIALS_KDEF_FH);
// check_comp(TRIALS_RADBOUD_FH);
// check_comp(TRIALS_RADIATE1_FH);
// check_comp(TRIALS_RADIATE2_FH);

const IMAGE_NUMBERS_SH = {
    nimstim: randomSelection(range(0, nimstim_sad.length), 40),
    mpi_old: randomSelection(range(0, mpi_sad_old.length), 52),
    mpi_middle: randomSelection(range(0, mpi_sad_middle.length), 52),
    mpi_young: randomSelection(range(0, mpi_sad_young.length), 52),
    kdef: randomSelection(range(0, kdef_sad.length), 52),
    radboud: randomSelection(range(0, radboud_sad.length), 52),
    radiate1: randomSelection(range(0, radiate_sad.length), 52),
    radiate2: null,
};
IMAGE_NUMBERS_SH.radiate2 = randomSelection(
    range(0, radiate_sad.length).filter((x) => !IMAGE_NUMBERS_SH.radiate1.includes(x)),
    52,
);
// console.log(IMAGE_NUMBERS_SH);

function generateStimulusCombinationsSadHappy(dataset_sad, dataset_happy, dataset_name, image_numbers) {
    let simon_type = shuffle(
        repeatArray(["sad_left", "sad_right", "happy_left", "happy_right"], image_numbers.length / 4),
    );
    let trials = [];
    for (let i = 0; i < simon_type.length; i++) {
        let tmp = {};
        tmp.database = dataset_name;
        if (simon_type[i] === "sad_left") {
            tmp.target = dataset_sad[image_numbers[i]];
            tmp.target_type = "sad";
            tmp.target_side = "left";
            tmp.key = PRMS.respKeys[PRMS.target_sh.indexOf("trauriges")];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? "comp" : "incomp";
        } else if (simon_type[i] === "sad_right") {
            tmp.target = dataset_sad[image_numbers[i]];
            tmp.target_type = "sad";
            tmp.target_side = "right";
            tmp.key = PRMS.respKeys[PRMS.target_sh.indexOf("trauriges")];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? "comp" : "incomp";
        } else if (simon_type[i] === "happy_left") {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.target_side = "left";
            tmp.key = PRMS.respKeys[PRMS.target_sh.indexOf("glückliches")];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? "comp" : "incomp";
        } else if (simon_type[i] === "happy_right") {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = "happy";
            tmp.target_side = "right";
            tmp.key = PRMS.respKeys[PRMS.target_sh.indexOf("glückliches")];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? "comp" : "incomp";
        }
        trials.push(tmp);
    }
    return trials;
}

// prettier-ignore
const TRIALS_NIMSTIM_SH = generateStimulusCombinationsSadHappy(
  nimstim_sad, 
  nimstim_happy, 
  'nimstim', 
  IMAGE_NUMBERS_SH.nimstim
);
const TRIALS_MPI_YOUNG_SH = generateStimulusCombinationsSadHappy(
    mpi_sad_young,
    mpi_happy_young,
    "mpi_young",
    IMAGE_NUMBERS_SH.mpi_young,
);
const TRIALS_MPI_MIDDLE_SH = generateStimulusCombinationsSadHappy(
    mpi_sad_middle,
    mpi_happy_middle,
    "mpi_middle",
    IMAGE_NUMBERS_SH.mpi_middle,
);
const TRIALS_MPI_OLD_SH = generateStimulusCombinationsSadHappy(
    mpi_sad_old,
    mpi_happy_old,
    "mpi_old",
    IMAGE_NUMBERS_SH.mpi_old,
);
const TRIALS_KDEF_SH = generateStimulusCombinationsSadHappy(kdef_sad, kdef_happy, "kdef", IMAGE_NUMBERS_SH.kdef);
const TRIALS_RADBOUD_SH = generateStimulusCombinationsSadHappy(
    radboud_sad,
    radboud_happy,
    "radboud",
    IMAGE_NUMBERS_SH.radboud,
);
const TRIALS_RADIATE1_SH = generateStimulusCombinationsSadHappy(
    radiate_sad,
    radiate_happy,
    "radiate",
    IMAGE_NUMBERS_SH.radiate1,
);
const TRIALS_RADIATE2_SH = generateStimulusCombinationsSadHappy(
    radiate_sad,
    radiate_happy,
    "radiate",
    IMAGE_NUMBERS_SH.radiate2,
);

// console.log(TRIALS_NIMSTIM_SH);
// console.log(TRIALS_MPI_YOUNG_SH);
// console.log(TRIALS_MPI_MIDDLE_SH);
// console.log(TRIALS_MPI_OLD_SH);
// console.log(TRIALS_KDEF_SH);
// console.log(TRIALS_RADBOUD_SH);
// console.log(TRIALS_RADIATE1_SH);
// console.log(TRIALS_RADIATE2_SH);
// function check_comp(dataset) {
//     let comp = 0;
//     for (var i = 0; i < dataset.length; i++) {
//         if (dataset[i].comp === "comp") {
//             comp += 1;
//         }
//     }
//     console.log(comp);
// }
// check_comp(TRIALS_NIMSTIM_SH);
// check_comp(TRIALS_MPI_YOUNG_SH);
// check_comp(TRIALS_MPI_MIDDLE_SH);
// check_comp(TRIALS_MPI_OLD_SH);
// check_comp(TRIALS_KDEF_SH);
// check_comp(TRIALS_RADBOUD_SH);
// check_comp(TRIALS_RADIATE1_SH);
// check_comp(TRIALS_RADIATE2_SH);

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px;">${PRMS.fbTxt[dat.corrCode - 1]}</div>`;
    },
};

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt - PRMS.fixDur : PRMS.tooSlow;
    dat.target = baseFileName(dat.target);

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);

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

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // fixation cross
    if (args.draw_fixation) {
        ctx.lineWidth = PRMS.fixWidth;
        ctx.moveTo(-PRMS.fixSize, 0);
        ctx.lineTo(PRMS.fixSize, 0);
        ctx.stroke();
        ctx.moveTo(0, -PRMS.fixSize);
        ctx.lineTo(0, PRMS.fixSize);
        ctx.stroke();
    }

    // image
    if (args.draw_image) {
        const img = new Image();
        img.src = args.image;
        if (args.side === "left") {
            ctx.drawImage(img, -PRMS.stimEccentricity - img.width / 2, -img.height / 2);
        } else if (args.side === "right") {
            ctx.drawImage(img, PRMS.stimEccentricity - img.width / 2, -img.height / 2);
        }
    }
}

// prettier-ignore
const SIMON_STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: PRMS.fixDur + PRMS.tooSlow,
    func: [drawStimulus, drawStimulus],
    clear_screen: [1, 1],
    stimulus_onset: [0, PRMS.fixDur],
    func_args: null,
    data: {
        stim: 'simon',
        target: jsPsych.timelineVariable('target'),
        target_type: jsPsych.timelineVariable('target_type'),
        target_side: jsPsych.timelineVariable('target_side'),
        compatibility: jsPsych.timelineVariable('comp'),
        database: jsPsych.timelineVariable('database'),
        corrResp: jsPsych.timelineVariable('key'),
    },
    on_start: function(trial) {
    console.log(trial.data.target);
        trial.func_args = [
            { draw_fixation: true, draw_image: false, image: trial.data.target, side: trial.data.target_side },
            { draw_fixation: true, draw_image: true, image: trial.data.target, side: trial.data.target_side },
        ];
    },
    on_finish: function() {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: "simon", blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = "de"));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

const TRIAL_TIMELINE_NIMSTIM_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_NIMSTIM_FH,
};

const TRIAL_TIMELINE_KDEF_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_KDEF_FH,
};

const TRIAL_TIMELINE_MPI_YOUNG_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_YOUNG_FH,
};

const TRIAL_TIMELINE_MPI_MIDDLE_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_MIDDLE_FH,
};

const TRIAL_TIMELINE_MPI_OLD_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_OLD_FH,
};

const TRIAL_TIMELINE_RADBOUD_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADBOUD_FH,
};

const TRIAL_TIMELINE_RADIATE1_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE1_FH,
};

const TRIAL_TIMELINE_RADIATE2_FH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE2_FH,
};

const TRIAL_TIMELINES_FH = [TRIAL_TIMELINE_NIMSTIM_FH].concat(
    shuffle([
        TRIAL_TIMELINE_KDEF_FH,
        TRIAL_TIMELINE_MPI_YOUNG_FH,
        TRIAL_TIMELINE_MPI_MIDDLE_FH,
        TRIAL_TIMELINE_MPI_OLD_FH,
        TRIAL_TIMELINE_RADBOUD_FH,
        TRIAL_TIMELINE_RADIATE1_FH,
        TRIAL_TIMELINE_RADIATE2_FH,
    ]),
);
// console.log(TRIALS_NIMSTIM_FH);

const TRIAL_TIMELINE_NIMSTIM_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_NIMSTIM_SH,
};

const TRIAL_TIMELINE_KDEF_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_KDEF_SH,
};

const TRIAL_TIMELINE_MPI_YOUNG_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_YOUNG_SH,
};

const TRIAL_TIMELINE_MPI_MIDDLE_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_MIDDLE_SH,
};

const TRIAL_TIMELINE_MPI_OLD_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_OLD_SH,
};

const TRIAL_TIMELINE_RADBOUD_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADBOUD_SH,
};

const TRIAL_TIMELINE_RADIATE1_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE1_SH,
};

const TRIAL_TIMELINE_RADIATE2_SH = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE2_SH,
};

const TRIAL_TIMELINES_SH = [TRIAL_TIMELINE_NIMSTIM_SH].concat(
    shuffle([
        TRIAL_TIMELINE_KDEF_SH,
        TRIAL_TIMELINE_MPI_YOUNG_SH,
        TRIAL_TIMELINE_MPI_MIDDLE_SH,
        TRIAL_TIMELINE_MPI_OLD_SH,
        TRIAL_TIMELINE_RADBOUD_SH,
        TRIAL_TIMELINE_RADIATE1_SH,
        TRIAL_TIMELINE_RADIATE2_SH,
    ]),
);
// console.log(TRIALS_NIMSTIM_SH);

////////////////////////////////////////////////////////////////////////
//                            password                                //
////////////////////////////////////////////////////////////////////////
const PASSWORD = {
    type: jsPsychExternalHtml,
    url: "/Common7+/password.html",
    cont_btn: "start",
    check_fn: function () {
        let password = document.getElementById("pass").value;
        let correct = getPassword("/Common7+/password.php", password);
        if (correct !== "0") {
            alert("Falsch");
            return false;
        } else {
            return true;
        }
    },
    post_trial_gap: 1000,
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
    saveData("/Common/write_data.php", data_fn, { stim: "simon" });
    //saveDataLocal(data_fn, { stim: "simon" });
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

    exp.push(PASSWORD);

    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de_copyright.html"));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);

    let blk_type;
    if (VERSION === 1) {
        exp.push(TASK_INSTRUCTIONS_1ST_HALF_FEAR_HAPPY);
        blk_type = repeatArray(["FH"], PRMS.nBlks / 2).concat(repeatArray(["SH"], PRMS.nBlks / 2));
    } else if (VERSION === 2) {
        exp.push(TASK_INSTRUCTIONS_1ST_HALF_SAD_HAPPY);
        blk_type = repeatArray(["SH"], PRMS.nBlks / 2).concat(repeatArray(["FH"], PRMS.nBlks / 2));
    }

    let blk_type_count = 0;
    for (let blk = 0; blk < TRIAL_TIMELINES_FH.length * 2; blk += 1) {
        if (blk == PRMS.nBlks / 2) {
            blk_type_count = 0;
            exp.push(HALF);
            if (VERSION === 1) {
                exp.push(TASK_INSTRUCTIONS_2ND_HALF_SAD_HAPPY);
            } else if (VERSION === 2) {
                exp.push(TASK_INSTRUCTIONS_2ND_HALF_FEAR_HAPPY);
            }
        }
        if (blk_type[blk] === "SH") {
            exp.push(BLOCK_START_SH);
        } else if (blk_type[blk] === "FH") {
            exp.push(BLOCK_START_FH);
        }
        let blk_timeline;
        if (blk_type[blk] === "FH") {
            blk_timeline = TRIAL_TIMELINES_FH[blk_type_count];
        } else if (blk_type[blk] === "SH") {
            blk_timeline = TRIAL_TIMELINES_SH[blk_type_count];
        }
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
        blk_type_count += 1;
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
