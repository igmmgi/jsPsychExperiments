// Modified version of a Prioritized Processing task with lateralized stimuli.
// VPs respond to a laterally presented stimulus (e.g., H,S,K) with left and
// right key-presses ("Q" and "P"). Two of the three letters are assigned to
// left and right keys (primary task), whilst the third letter indicates that
// the background task is to be performed (respond according to stimulus
// location). The proportion of required primary vs. background responses is
// manipulated blockwise, with HighPri vs. LowPri at 90/10 and 50/50,
// respectively.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = 'rgba(200, 200, 200, 1)';
const cs = [960, 720];
const cb = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsBase: 52, // number of trials in Simon baseline blocks
    nBlksBase: 4,  // number of blocks of Simon baseline 
    nTrlsPP: 80, // number of trials in subsequent blocks
    nBlksPP: 8,
    fixDur: 500,
    fbDur: [1000, 2000, 2000, 2000],
    iti: 500,
    tooFast: 100,
    tooSlow: 1500,
    respLetters: shuffle(["H", "S", "K"]),
    fbTxt: ['Richtig', 'Falsch', 'Zu langsam'],
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 2,
    fixSize: 10,
    stimSize: '40px monospace',
    fbSize: '30px monospace',
    colours: ["green", "red"],
    respKeys: ["Q", "P", 27],
};

const nVersion = getVersionNumber(nFiles, 8);
jsPsych.data.addProperties({ version: nVersion });
let respText =
        "<h3 style='text-align:center;'><b>" + prms.respLetters[0] + " = 'Q'</b> (linker Zeigefinger).</h3>" +
        "<h3 style='text-align:center;'><b>" + prms.respLetters[1] + " = 'P'</b> (rechter Zeigefinger).</h3><br>";

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. XXX Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: center;'>Bitte reagiere ... </h3>" +
    respText +
    "<h3 style='text-align: center;'>Bitte reagiere so schnell und korrekt wie möglich.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_reminder = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    "<h3 style='text-align: center;'>Versuche weiterhin so schnell und so genau wie möglich zu reagieren.</h3><br>" +
    "<h3 style='text-align: center;'>Wenn du wieder bereit für den nächsten Block bist, dann positioniere</h3>" +
    "<h3 style='text-align: center;'>deine Hände wieder auf der Tastatur. Es gilt weiterhin:</h3><br>" +
    respText +
    "<h2 style='text-align: center;'>Weiter mit beliebiger Taste!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo(prms.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0, prms.fixSize);
    ctx.stroke();
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation,
};

function drawFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);
}

function drawSimon(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = prms.stimSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // draw Simon
    ctx.fillStyle = "black";
    switch (args.position) {
        case 'left':
            ctx.fillText(args.stimulus, -100, 0);
            break;
        case 'right':
            ctx.fillText(args.stimulus, 100, 0);
            break;
    }
}

function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
  
    let corrKeyNum;
    let rt;

    corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    rt = dat.rt !== null ? dat.rt : prms.tooSlow;
    if (dat.key_press === corrKeyNum && rt < prms.tooSlow) {
        corrCode = 1; // correct
    } else if (dat.key_press !== corrKeyNum && rt < prms.tooSlow) {
        corrCode = 2; // choice error
    } else if (rt >= prms.tooSlow) {
        corrCode = 3; // too slow
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
    type: 'static-canvas-keyboard-response',
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
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function () {},
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: '',
    response_ends_trial: true,
    on_start: function (trial) {
        trial.stimulus = blockFeedbackTxt_de_du({ stim: 'pp_simon' });
    },
};

const simon_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    trial_duration: prms.tooSlow,
    func: drawSimon,
    func_args: [ 
        { stimulus: jsPsych.timelineVariable('stimulus'), position: jsPsych.timelineVariable('position') },
    ],
    data: {
        stim: 'pp_simon',
        simon: jsPsych.timelineVariable('stimulus'),
        comp: jsPsych.timelineVariable('comp'),
        position: jsPsych.timelineVariable('position'),
        corrResp: jsPsych.timelineVariable('corrResp'),
    },
    on_finish: function () {
        codeTrial();
    },
};

const simon_t1 = [
    { stimulus: prms.respLetters[0], position: 'left',  comp: 'comp',   corrResp: prms.respKeys[0]},
    { stimulus: prms.respLetters[1], position: 'right', comp: 'comp',   corrResp: prms.respKeys[1]},
    { stimulus: prms.respLetters[0], position: 'right', comp: 'incomp', corrResp: prms.respKeys[0]},
    { stimulus: prms.respLetters[1], position: 'left',  comp: 'incomp', corrResp: prms.respKeys[1]} 
];

const trial_timeline_simon_base = {
    timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
    timeline_variables: simon_t1
};

const simon_t2 = [
    { stimulus: prms.respLetters[2], position: 'left',  comp: 'comp', corrResp: prms.respKeys[0]},
    { stimulus: prms.respLetters[2], position: 'right', comp: 'comp', corrResp: prms.respKeys[1]},
]

const trial_timeline_simon_low = {
    timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
    timeline_variables: repeatArray(simon_t1, 9).concat(repeatArray(simon_t2, 2))  // 90% vs 10%&
};

const trial_timeline_simon_high = {
    timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
    timeline_variables: repeatArray(simon_t1, 5).concat(repeatArray(simon_t2, 5))  // 50% vs. 50%
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    response_ends_trial: true,
    choices: [32],
    stimulus:
    "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde benötigst, </h3>" +
    "<h3 style='text-align:left;'>kopiere den folgenden zufällig generierten Code</h3>" +
    "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer per Email an:</h3><br>" +
    '<h2>xxx@xxx</h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    'use strict';

    let exp = [];

    exp.push(fullscreen_on);
    exp.push(welcome_de_du);
    exp.push(resize_de_du);
    // exp.push(vpInfoForm_de);
    exp.push(hideMouseCursor);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    // // baseline Simon block    
    // for (let blk = 0; blk < prms.nBlksBase; blk += 1) {
    //     let blk_timeline_base = { ...trial_timeline_base };
    //     blk_timeline_base.sample = { type: 'fixed-repetitions', size: prms.nTrlsBase / 4 };
    //     exp.push(blk_timeline_base);   // trials within a block
    //     exp.push(block_feedback);      // show previous block performance
    // }

    
    // PP Simon block    
    let blk_prob;
    if (nVersion % 2 == 0) {
        blk_prob = repeatArray(["L"], prms.nBlksPP/2).concat(repeatArray(["H"], prms.nBlksPP/2))
    } else {
        blk_prob = repeatArray(["H"], prms.nBlksPP/2).concat(repeatArray(["L"], prms.nBlksPP/2))
    }

    let blk_timeline_pp;
    for (let blk = 0; blk < prms.nBlksPP; blk += 1) {
        if (blk_prob[blk] === "L") {
            blk_timeline_pp = { ...trial_timeline_simon_low };
        } else if (blk_prob[blk] === "H") {
            blk_timeline_pp = { ...trial_timeline_simon_high };
        }
        blk_timeline_pp.sample = { type: 'fixed-repetitions', size: prms.nTrlsBase / 40 };
        exp.push(blk_timeline_pp);   // trials within a block
        exp.push(block_feedback);    // show previous block performance
    }


    exp.push(debrief_de);
    exp.push(showMouseCursor);
    exp.push(alphaNum);
    exp.push(fullscreen_off);

    return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + 'data/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width: cs[0],
        min_height: cs[1],
    },
    on_finish: function () {
        saveData('/Common/write_data.php', data_filename, { stim: 'pp_simon' });
        saveRandomCode('/Common/write_code.php', code_filename, randomString);
    },
});
