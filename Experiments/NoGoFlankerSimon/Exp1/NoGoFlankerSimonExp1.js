// Modified version of a Flanker Task and Simon Task (blocked)
// Flanker Task:
// VPs respond to the central letter within a 5-letter array (e.g., HHHHH,
// SSHSS) whilst ignoring the surrounding letters using left and right
// key-presses ("Q" and "P"). Stimuli are presented in one of two colours
// (e.g., green vs. red) with one colour assigned to a "Go" response, and the
// other to the "NoGo" response. The proportion of Go vs. NoGo responses is
// manipulated blockwise (e.g., Low (10%) vs. High (50%) NoGo Probability).
//
// Simon Task:
// VPs respond to a laterally presented letter (e.g., H vs. S) with
// left/right-keypresses ("Q" and "P"). Stimuli are presented in one of two
// colours (e.g., green vs. red) with one colour assigned to a "Go" response,
// and the other to the "NoGo" response. The proportion of Go vs. NoGo
// responses is manipulated blockwise (e.g., Low (10%) vs. High NoGo (50%)
// Probability).
//
// Factors:
// Task (Flanker vs. Simon)
// Compatibility (Compatible vs. Incompatible)
// NoGo Probability (High vs. Low)
//
// Task (Flanker vs. Simon) alternates across blocks
// NoGo Prob (Low vs. High) counterbalanced across experiment half
//
// 8 Counter-balanced versions
// Version 1: H = left ("Q"), S = right ("P"), Flanker -> Simon,   Low  -> High
// Version 2: S = left ("Q"), H = right ("P"), Flanker -> Simon,   Low  -> High
// Version 3: H = left ("Q"), S = right ("P"), Simon   -> Flanker, Low  -> High
// Version 4: S = left ("Q"), H = right ("P"), Simon   -> Flanker, Low  -> High
// Version 5: H = left ("Q"), S = right ("P"), Flanker -> Simon,   High -> Low
// Version 6: S = left ("Q"), H = right ("P"), Flanker -> Simon,   High -> Low
// Version 7: H = left ("Q"), S = right ("P"), Simon   -> Flanker, High -> Low
// Version 8: S = left ("Q"), H = right ("P"), Simon   -> Flanker, High -> Low
//
// 24 blocks with Version 1: ((Flanker Low --> Simon Low) * 6) --> ((Flanker High --> Simon High) * 6)
// and counter-balanced versions ...

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
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
    nTrls: 40, // number of trials in each block
    nBlks: 24,
    fixDur: 500,
    fbDur: [1000, 2500, 2500],
    iti: 500,
    tooSlowPractice: 1500,
    tooSlow: 1000,
    fbTxtGo: ["Richtig", "Falsch: Falsche Taste gedrückt!", "Zu langsam: Reagiere wenn der Buchstabe grün ist!"],
    fbTxtNoGo: ["Richtig", "Falsch: Reagiere nicht, wenn der Buchstabe rot ist!"],
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 2,
    fixSize: 10,
    stimSize: "40px monospace",
    fbSize: "24px monospace",
    simonEccentricity: 150,
    colours: ["green", "red"], // go/nogo colours (although fixed within instruction text!)
    respKeys: [],
};

const nVersion = getVersionNumber(nFiles, 8);
jsPsych.data.addProperties({ version: nVersion });
let respText;
if (nVersion % 2 == 1) {
    prms.respKeys = ["Q", "P", 27];
    respText =
        "<h3 style='text-align:center;'><b>H = linker Zeigefinger (Taste 'Q')</b></h3>" +
        "<h3 style='text-align:center;'><b>S = rechter Zeigefinger (Taste 'P')</b></h3><br>";
} else {
    prms.respKeys = ["P", "Q", 27];
    respText =
        "<h3 style='text-align:center;'><b>S = linker Zeigefinger (Taste 'Q')</b></h3>" +
        "<h3 style='text-align:center;'><b>H = rechter Zeigefinger (Taste 'P')</b></h3><br>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
        "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
        "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
        "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
        "<h3 style='text-align: center;'>Wir bitten dich, die ca. 40 Minuten konzentriert zu arbeiten.</h3><br>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        "<h3 style='text-align: left;'>Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen</h3>" +
        "<h3 style='text-align: left;'>am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:</h3><br>" +
        "<h3 style='text-align: center;'>hiwipibio@gmail.com</h3><br>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        "<h2 style='text-align: center;'>Aufgabe:</h2>" +
        "<h3 style='text-align: left;'>In diesem Experiment musst du auf verschiedene Buchstaben</h3>" +
        "<h3 style='text-align: left;'>reagieren. Der Ziel-Buchstabe erscheint in manchen Blöcken </h3>" +
        "<h3 style='text-align: left;'>in der Mitte des Bildschirms und in anderen Blöcken rechts oder</h3>" +
        "<h3 style='text-align: left;'>links auf dem Bildschirm. Es gilt die folgende Zuordnung: </h3><br>" +
        respText +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions4 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        "<h2 style='text-align: center;'>WICHTIG:</h2>" +
        "<h3 style='text-align: left;'>Der Ziel-Buchstabe H oder S erscheint manchmal in grün und manchmal in</h3>" +
        "<h3 style='text-align: left;'>roter Farbe. Reagiere nur so schnell und so genau wie möglich, wenn der </h3>" +
        "<h3 style='text-align: left;'>Buchstabe grün ist! Somit sollst du keine Taste drücken, wenn der Buchstabe </h3>" +
        "<h3 style='text-align: left;'>in rot erscheint. Es folgen insgesamt 24 Blöcke.</h3><br>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions5_flanker = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            "<h2 style='text-align: center;'>Block " +
            prms.cBlk +
            " von 24:</h2><br>" +
            "<h3 style='text-align: left;'>Wenn du bereit für den Block bist, dann positioniere </h3>" +
            "<h3 style='text-align: left;'>deine Hände auf die Tastatur.</h3>" +
            "<h3 style='text-align: left;'>Ziel - Buchstabe erscheint in der Mitte des Bildschirms. Es gilt:</h3><br>" +
            respText +
            "<h3 style='text-align: left;'>Reagiere nur, wenn der Buchstabe in grün erscheint und drücke </h3>" +
            "<h3 style='text-align: left;'>keine Taste, wenn der Buchstabe in rot erscheint!</h3><br>" +
            "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
    },
};

const task_instructions5_simon = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            "<h2 style='text-align: center;'>Block " +
            prms.cBlk +
            " von 24:</h2><br>" +
            "<h3 style='text-align: left;'>Wenn du bereit für den Block bist, dann positioniere </h3>" +
            "<h3 style='text-align: left;'>deine Hände auf die Tastatur.</h3>" +
            "<h3 style='text-align: left;'>Ziel - Buchstabe erscheint rechts oder links auf dem Bildschirm. Es gilt:</h3><br>" +
            respText +
            "<h3 style='text-align: left;'>Reagiere nur wenn der Buchstabe in grün erscheint und drücke </h3>" +
            "<h3 style='text-align: left;'>keine Taste wenn der Buchstabe in rot erscheint!</h3><br>" +
            "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
    },
};

const task_instructions6 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
        "<h3 style='text-align: left;'>Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit</h3>" +
        "<h3 style='text-align: left;'> für den nächsten Block bist, dann drücke eine beliebige Taste.</h3>",
    on_finish: function () {
        prms.cBlk += 1;
    },
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
    if (dat.type === "go") {
        ctx.fillText(prms.fbTxtGo[dat.corrCode - 1], 0, 0);
    } else if (dat.type == "nogo") {
        ctx.fillText(prms.fbTxtNoGo[dat.corrCode - 1], 0, 0);
    }
}

function drawFlanker(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = prms.stimSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw flanker
    ctx.fillStyle = args.colour;
    ctx.fillText(args.stimulus, 0, 0); // always central
}

function drawSimon(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = prms.stimSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw Simon
    ctx.fillStyle = args.colour;
    switch (args.position) {
        case "left":
            ctx.fillText(args.stimulus, -prms.simonEccentricity, 0);
            break;
        case "right":
            ctx.fillText(args.stimulus, prms.simonEccentricity, 0);
            break;
    }
}

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;

    let corrKeyNum;
    let rt;
    if (dat.type === "go") {
        corrKeyNum = dat.corrResp !== null ? jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp) : null;
        rt = dat.rt !== null ? dat.rt : prms.tooSlow;
        if (dat.key_press === corrKeyNum && rt < prms.tooSlow) {
            corrCode = 1; // correct
        } else if (dat.key_press !== corrKeyNum && rt < prms.tooSlow) {
            corrCode = 2; // choice error
        } else if (rt >= prms.tooSlow) {
            corrCode = 3; // too slow
        }
    } else if (dat.type === "nogo") {
        if (dat.key_press === null) {
            corrCode = 1; // correct withheld response
        } else if (dat.key_press !== null) {
            corrCode = 2; // response to nogo trial
        }
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
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
        trial.stimulus = blockFeedbackTxt_de_du({ stim: "flanker_simon", type: "go" }); // between block feedback based on "go" trials only
    },
};

const flanker_stimulus = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    trial_duration: prms.tooSlow,
    func: drawFlanker,
    func_args: [{ stimulus: jsPsych.timelineVariable("stimulus"), colour: jsPsych.timelineVariable("colour") }],
    data: {
        stim: "flanker_simon",
        task: jsPsych.timelineVariable("task"),
        flanker_simon: jsPsych.timelineVariable("stimulus"),
        prob: jsPsych.timelineVariable("prob"),
        type: jsPsych.timelineVariable("type"),
        comp: jsPsych.timelineVariable("comp"),
        position: jsPsych.timelineVariable("position"),
        colour: jsPsych.timelineVariable("colour"),
        corrResp: jsPsych.timelineVariable("corrResp"),
    },
    on_start: function (trial) {
        trial.trial_duration = [1, 2, 11, 12].includes(prms.cBlk) ? prms.tooSlowPractice : prms.tooSlow;
    },
    on_finish: function () {
        codeTrial();
    },
};

const simon_stimulus = {
    type: "static-canvas-keyboard-response",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    trial_duration: prms.tooSlow,
    func: drawSimon,
    func_args: [
        {
            stimulus: jsPsych.timelineVariable("stimulus"),
            position: jsPsych.timelineVariable("position"),
            colour: jsPsych.timelineVariable("colour"),
        },
    ],
    data: {
        stim: "flanker_simon",
        task: jsPsych.timelineVariable("task"),
        flanker_simon: jsPsych.timelineVariable("stimulus"),
        prob: jsPsych.timelineVariable("prob"),
        type: jsPsych.timelineVariable("type"),
        comp: jsPsych.timelineVariable("comp"),
        position: jsPsych.timelineVariable("position"),
        colour: jsPsych.timelineVariable("colour"),
        corrResp: jsPsych.timelineVariable("corrResp"),
    },
    on_start: function (trial) {
        trial.trial_duration = [1, 2, 13, 14].includes(prms.cBlk) ? prms.tooSlowPractice : prms.tooSlow;
    },
    on_finish: function () {
        codeTrial();
    },
};

function generate_flanker_combinations(nGo, nNoGo) {
    let flanker_go = repeatArray(
        [
            {
                task: "flanker",
                stimulus: "HHHHH",
                position: "centre",
                colour: prms.colours[0],
                type: "go",
                comp: "comp",
                corrResp: prms.respKeys[0],
            },
            {
                task: "flanker",
                stimulus: "SSSSS",
                position: "centre",
                colour: prms.colours[0],
                type: "go",
                comp: "comp",
                corrResp: prms.respKeys[1],
            },
            {
                task: "flanker",
                stimulus: "SSHSS",
                position: "centre",
                colour: prms.colours[0],
                type: "go",
                comp: "incomp",
                corrResp: prms.respKeys[0],
            },
            {
                task: "flanker",
                stimulus: "HHSHH",
                position: "centre",
                colour: prms.colours[0],
                type: "go",
                comp: "incomp",
                corrResp: prms.respKeys[1],
            },
        ],
        nGo,
    );

    let flanker_nogo = repeatArray(
        [
            {
                task: "flanker",
                stimulus: "HHHHH",
                position: "centre",
                colour: prms.colours[1],
                type: "nogo",
                comp: "comp",
                corrResp: null,
            },
            {
                task: "flanker",
                stimulus: "SSSSS",
                position: "centre",
                colour: prms.colours[1],
                type: "nogo",
                comp: "comp",
                corrResp: null,
            },
            {
                task: "flanker",
                stimulus: "SSHSS",
                position: "centre",
                colour: prms.colours[1],
                type: "nogo",
                comp: "incomp",
                corrResp: null,
            },
            {
                task: "flanker",
                stimulus: "HHSHH",
                position: "centre",
                colour: prms.colours[1],
                type: "nogo",
                comp: "incomp",
                corrResp: null,
            },
        ],
        nNoGo,
    );
    return flanker_go.concat(flanker_nogo);
}

const flanker_combinations_low_nogo = generate_flanker_combinations(9, 1); // 10% NoGo
const flanker_combinations_high_nogo = generate_flanker_combinations(5, 5); // 50% NoGo

const trial_timeline_flanker_low_nogo = {
    timeline: [fixation_cross, flanker_stimulus, trial_feedback],
    timeline_variables: flanker_combinations_low_nogo,
};

const trial_timeline_flanker_high_nogo = {
    timeline: [fixation_cross, flanker_stimulus, trial_feedback],
    timeline_variables: flanker_combinations_high_nogo,
};

function generate_simon_combinations(nGo, nNoGo) {
    let simon_go = repeatArray(
        [
            {
                task: "simon",
                stimulus: "H",
                position: "left",
                colour: prms.colours[0],
                type: "go",
                corrResp: prms.respKeys[0],
            },
            {
                task: "simon",
                stimulus: "S",
                position: "right",
                colour: prms.colours[0],
                type: "go",
                corrResp: prms.respKeys[1],
            },
            {
                task: "simon",
                stimulus: "H",
                position: "right",
                colour: prms.colours[0],
                type: "go",
                corrResp: prms.respKeys[0],
            },
            {
                task: "simon",
                stimulus: "S",
                position: "left",
                colour: prms.colours[0],
                type: "go",
                corrResp: prms.respKeys[1],
            },
        ],
        nGo,
    );
    let simon_nogo = repeatArray(
        [
            {
                task: "simon",
                stimulus: "H",
                position: "left",
                colour: prms.colours[1],
                type: "nogo",
                corrResp: null,
            },
            {
                task: "simon",
                stimulus: "S",
                position: "right",
                colour: prms.colours[1],
                type: "nogo",
                corrResp: null,
            },
            {
                task: "simon",
                stimulus: "H",
                position: "right",
                colour: prms.colours[1],
                type: "nogo",
                corrResp: null,
            },
            {
                task: "simon",
                stimulus: "S",
                position: "left",
                colour: prms.colours[1],
                type: "nogo",
                corrResp: null,
            },
        ],
        nNoGo,
    );
    return simon_go.concat(simon_nogo);
}

const simon_combinations_low_nogo = generate_simon_combinations(9, 1); // 10% NoGo
const simon_combinations_high_nogo = generate_simon_combinations(5, 5); // 50% NoGo

const trial_timeline_simon_low_nogo = {
    timeline: [fixation_cross, simon_stimulus, trial_feedback],
    timeline_variables: simon_combinations_low_nogo,
};

const trial_timeline_simon_high_nogo = {
    timeline: [fixation_cross, simon_stimulus, trial_feedback],
    timeline_variables: simon_combinations_high_nogo,
};

const randomString = generateRandomString(16);

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
        "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer</h3><br>" +
        "<h3 style='text-align:left;'>und deiner Universität (Bremen/Tübingen) per Email an:</h3><br>" +
        "<h2>hiwipibio@gmail.com</h2>" +
        "<h1>Code: " +
        randomString +
        "</h1><br>" +
        "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",
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
    exp.push(vpInfoForm_de);
    exp.push(hideMouseCursor);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);
    exp.push(task_instructions3);
    exp.push(task_instructions4);

    // Counter-balanced task order Flanker-Simon vs. Simon-Flanker
    let blk_task = [];
    if ([1, 2, 5, 6].includes(nVersion)) {
        blk_task = repeatArray(["F", "S"], prms.nBlks / 2);
    } else {
        blk_task = repeatArray(["S", "F"], prms.nBlks / 2);
    }

    // Counter-balanced Go-NoGo high prob
    let blk_prob = [];
    if ([1, 2, 3, 4].includes(nVersion)) {
        blk_prob = repeatArray(["L"], prms.nBlks / 2).concat(repeatArray(["H"], prms.nBlks / 2));
    } else {
        blk_prob = repeatArray(["H"], prms.nBlks / 2).concat(repeatArray(["L"], prms.nBlks / 2));
    }

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        // add approprite block start flanker vs. simon instructions
        if (blk_task[blk] === "F") {
            exp.push(task_instructions5_flanker);
        } else {
            exp.push(task_instructions5_simon);
        }

        // select appropriate blk_timeline
        let blk_timeline;
        if ((blk_task[blk] === "F") & (blk_prob[blk] === "L")) {
            blk_timeline = { ...trial_timeline_flanker_low_nogo };
        } else if ((blk_task[blk] === "F") & (blk_prob[blk] === "H")) {
            blk_timeline = { ...trial_timeline_flanker_high_nogo };
        } else if ((blk_task[blk] === "S") & (blk_prob[blk] === "L")) {
            blk_timeline = { ...trial_timeline_simon_low_nogo };
        } else if ((blk_task[blk] === "S") & (blk_prob[blk] === "H")) {
            blk_timeline = { ...trial_timeline_simon_high_nogo };
        }

        // add low vs. high to block timeline variables
        for (let i = 0; i < blk_timeline.timeline_variables.length; i++) {
            blk_timeline.timeline_variables[i].prob = blk_prob[blk];
        }

        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        if (blk < prms.nBlks) {
            exp.push(task_instructions6); // show PAUSE
        }
        // exp.push(block_feedback); // show previous block performance
    }
    exp.push(debrief_de);
    exp.push(showMouseCursor);
    exp.push(alphaNum);
    exp.push(fullscreen_off);

    return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + vpNum;
const code_filename = dirName + "code/" + expName;

jsPsych.init({
    timeline: EXP,
    show_progress_bar: false,
    exclusions: {
        min_width: cs[0],
        min_height: cs[1],
    },
    on_finish: function () {
        saveData("/Common/write_data.php", data_filename, { stim: "flanker_simon" });
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    },
});
