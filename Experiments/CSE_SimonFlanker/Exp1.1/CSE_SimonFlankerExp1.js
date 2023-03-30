// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with two trial types:
// 1) Central target and flankers presented simultaneously
// 2) Central target presented 300 ms after presentation of flankers

////////////////////////////////////////////////////////////////////////
const cc = "rgba(200, 200, 200, 1)";
const cs = [960, 720];
const cb = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles("/Common/num_files.php", dirName + "data/");

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 36, // number of trials in 1st block
    nTrlsE: 84, // number of trials in subsequent blocks
    nBlks: 11,
    fixDur: 500,
    fbDur: [500, 1500, 1500],
    iti: 500,
    tooSlow: 2000,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 2,
    fixSize: 10,
    stimSize: "40px monospace",
    simonPos: 200,
    fbSize: "24px monospace",
    fbTxt: ["Richtig", "Falsch", "Zu langsam!"],
    simonEccentricity: 150,
    respLetters: [],
    respKeys: [],
};

const nVersion = getVersionNumber(nFiles, 2);
if (nVersion === 1) {
    prms.respKeys = ["Q", "P"];
    prms.respLetters = ["H", "S"];
} else {
    prms.respKeys = ["P", "Q"];
    prms.respLetters = ["S", "H"];
}
jsPsych.data.addProperties({ version: nVersion });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const respText =
    generate_formatted_html({
        text: prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')",
        bold: true,
        fontsize: 26,
    }) +
    generate_formatted_html({
        text: prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')",
        bold: true,
        fontsize: 26,
    });

const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br>
        Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
        Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
        genügend Zeit hast, um das Experiment durchzuführen.
        Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
        Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: generate_formatted_html({
        text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
        am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
        hiwipibio@gmail.com<br><br>
        Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
};

const task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        generate_formatted_html({
            text: `Aufgabe:<br><br>
        In diesem Experiment musst du auf verschiedene Buchstaben
        so schnell und so genau wie möglich reagieren. Der Ziel-Buchstabe
        erscheint in manchen Durchgängen in der Mitte des Bildschirms (und ist
        von irrelevanten Buchstaben umgeben) und in anderen Durchgängen links oder
        rechts auf dem Bildschirm. Es gilt die folgende Zuordnung:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        respText +
        generate_formatted_html({
            text: `<br>Drücke eine beliebige Taste, um fortzufahren!`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }),
};

const task_instructions4 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: generate_formatted_html({
        text: `Reagiere immer nur auf den Ziel-Buchstaben. Das heißt:<br><br>
        Wenn der Ziel-Buchstabe in der Mitte erscheint, dann ignoriere die umliegenden Buchstaben.<br><br>
        Wenn nur ein Ziel-Buchstabe links oder rechts auf dem Bildschirm präsentiert wird,
        dann ignoriere die links/rechts Position auf dem Bildschirm.<br><br>
        Reagiere so schnell und so genau wie möglich!<br><br>
        Drücke eine beliebige Taste, um fortzufahren.`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
};

const task_instructions_block = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        generate_formatted_html({
            text: `Wenn du bereit für den Block bist, dann positioniere
        deine Hände auf die Tastatur.<br>
        Zeil - Buchstabe erscheint entweder in der Mitte des Bildschirms
        oder links/rechts auf dem Bildschirm. Es gilt:`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        respText +
        generate_formatted_html({
            text: `Drücke eine beliebige Taste, um fortzufahren!`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo(prms.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0, prms.fixSize);
    ctx.stroke();
}

const fixation_cross = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation,
};

function drawFeedback() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);
    if (dat.corrCode !== 1) {
        let reminder_l = prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')";
        let reminder_r = prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')";
        ctx.fillText(reminder_l, 0, 50);
        ctx.fillText(reminder_r, 0, 100);
    }
}

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corrCode = 0;
    let rt = dat.rt !== null ? dat.rt - dat.delay : prms.tooSlow;

    let comp;
    if (dat.stim_type === "simon") {
        comp =
            ((dat.corrResp == "Q") & (dat.position < 0)) | ((dat.corrResp == "P") & (dat.position > 0))
                ? "comp"
                : "incomp";
    } else {
        comp = dat.flankers[0] === dat.target ? "comp" : "incomp";
    }

    console.log(dat);
    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
    }

    if (correctKey && rt < prms.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && rt < prms.tooSlow) {
        corrCode = 2; // choice error
    } else if (rt >= prms.tooSlow) {
        corrCode = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
        comp: comp,
        rt: rt,
        corrCode: corrCode,
        blockNum: prms.cBlk,
        trialNum: prms.cTrl,
    });
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

const trial_feedback = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.corrCode - 1];
    },
};

const iti = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function () {},
};

const block_feedback = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        trial.stimulus = blockFeedbackTxt_de_du({ stim: "cse_sf" });
    },
    on_finish: function () {
        prms.cTrl = 1;
    },
};

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = prms.stimSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw
    ctx.fillStyle = "black";
    ctx.fillText(args.flankers, args.position, 0);
    ctx.fillText(args.target, args.position, 0);
}

const sf_stimulus = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    clear_screen: [1, 1],
    stimulus_onset: [1, jsPsych.timelineVariable("delay")],
    trial_duration: null,
    func: [drawStimulus, drawStimulus],
    func_args: [
        {
            flankers: jsPsych.timelineVariable("flankers"),
            target: jsPsych.timelineVariable("t1"),
            position: jsPsych.timelineVariable("position"),
        },
        {
            flankers: jsPsych.timelineVariable("flankers"),
            target: jsPsych.timelineVariable("target"),
            position: jsPsych.timelineVariable("position"),
        },
    ],
    data: {
        stim: "cse_sf",
        stim_type: jsPsych.timelineVariable("stim_type"),
        target: jsPsych.timelineVariable("target"),
        flankers: jsPsych.timelineVariable("flankers"),
        delay: jsPsych.timelineVariable("delay"),
        position: jsPsych.timelineVariable("position"),
        corrResp: jsPsych.timelineVariable("corrResp"),
    },
    on_start: function (trial) {
        trial.trial_duration = prms.tooSlow + trial.data.delay;
    },
    on_finish: function () {
        codeTrial();
    },
};

// prettier-ignore
const stimuli = [
    { stim_type: "flanker",       target: "H", t1: "H", flankers: "HH HH", delay:   0, position: 0,              corrResp: prms.respKeys[0] },
    { stim_type: "flanker",       target: "S", t1: "S", flankers: "SS SS", delay:   0, position: 0,              corrResp: prms.respKeys[1] },
    { stim_type: "flanker",       target: "H", t1: "H", flankers: "SS SS", delay:   0, position: 0,              corrResp: prms.respKeys[0] },
    { stim_type: "flanker",       target: "S", t1: "S", flankers: "HH HH", delay:   0, position: 0,              corrResp: prms.respKeys[1] },
    { stim_type: "flanker_delay", target: "H", t1: "",  flankers: "HH HH", delay: 400, position: 0,              corrResp: prms.respKeys[0] },
    { stim_type: "flanker_delay", target: "S", t1: "",  flankers: "SS SS", delay: 400, position: 0,              corrResp: prms.respKeys[1] },
    { stim_type: "flanker_delay", target: "H", t1: "",  flankers: "SS SS", delay: 400, position: 0,              corrResp: prms.respKeys[0] },
    { stim_type: "flanker_delay", target: "S", t1: "",  flankers: "HH HH", delay: 400, position: 0,              corrResp: prms.respKeys[1] },
    { stim_type: "simon",         target: "H", t1: "H", flankers: "",      delay:   0, position: -prms.simonPos, corrResp: prms.respKeys[0] },
    { stim_type: "simon",         target: "S", t1: "S", flankers: "",      delay:   0, position: -prms.simonPos, corrResp: prms.respKeys[1] },
    { stim_type: "simon",         target: "H", t1: "H", flankers: "",      delay:   0, position:  prms.simonPos, corrResp: prms.respKeys[0] },
    { stim_type: "simon",         target: "S", t1: "S", flankers: "",      delay:   0, position:  prms.simonPos, corrResp: prms.respKeys[1] },
];

const trial_timeline = {
    timeline: [fixation_cross, sf_stimulus, trial_feedback, iti],
    randomize_order: true,
    timeline_variables: stimuli,
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomStringWithExpName("cse_sf1", 16);

const alphaNum = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    response_ends_trial: true,
    choices: [32],
    stimulus:
        "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde benötigst, </h3>" +
        "<h3 style='text-align:left;'>kopiere den folgenden zufällig generierten Code</h3>" +
        "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer</h3>" +
        "<h3 style='text-align:left;'>und deiner Universität per Email an:</h3><br>" +
        "<h2>hiwipibio@gmail.com</h2>" +
        "<h1>Code: " +
        randomString +
        "</h1><br>" +
        "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
    type: "call-function",
    func: function () {
        let data_filename = dirName + "data/" + expName + "_" + vpNum;
        saveData("/Common/write_data.php", data_filename, { stim: "cse_sf" });
    },
    timing_post_trial: 200,
};

const save_code = {
    type: "call-function",
    func: function () {
        let code_filename = dirName + "code/" + expName;
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    },
    timing_post_trial: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen_on);
    exp.push(welcome_de_du);
    exp.push(resize_de_du);
    // exp.push(vpInfoForm_de);
    exp.push(hideMouseCursor);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);
    exp.push(task_instructions3);
    exp.push(task_instructions4);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = { ...trial_timeline };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: blk === 0 ? prms.nTrlsP / 12 : prms.nTrlsE / 12,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(block_feedback); // show previous block performance
    }

    // save data
    exp.push(save_data);
    exp.push(save_code);

    // debrief
    exp.push(showMouseCursor);
    exp.push(alphaNum);
    exp.push(debrief_de);
    exp.push(fullscreen_off);

    return exp;
}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    exclusions: {
        min_width: cs[0],
        min_height: cs[1],
    },
});
