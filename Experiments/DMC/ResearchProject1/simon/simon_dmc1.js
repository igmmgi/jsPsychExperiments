// Modified version of a Simon Task:
// VPs respond to the colour of a centrally presented square whilst ignoring
//  laterally presented squares. The laterally presented squares 
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

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
const vpNum   = genVpNum();
const nFiles  = getNumberOfFiles("/Common/num_files.php", dirName + "data/");

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 32,  // number of trials in first block (practice)
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 2,   
    fixDur: 500,
    fbDur: [500, 1000, 1000, 1000],
    simonDur: 200,
    iti: 500,
    tooFast: 150,
    tooSlow: 2000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respCols: ["blue", "green"],
    fixWidth: 3,
    fixSize: 15,
    fbSize: "30px monospace",
    respKeys: [],
};


const nVersion = getVersionNumber(nFiles, 2)
jsPsych.data.addProperties({nVersion: nVersion});
if (nVersion === 1) {
    prms.respKeys = ["D", "J", 27];
    respText = "<h4 style='text-align: center;'><b>BLAU</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 style='text-align: center;'><b>GRÜN</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
} else {
    prms.respKeys = ["J", "D", 27];
    respText = "<h4 style='text-align: center;'><b>GRÜN</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 style='text-align: center;'><b>BLAU</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
              "<h3 style='text-align: center;'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
              "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
              "<h2 style='text-align: center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: 
    "<h2 style='text-align: center;'>Aufgabe:</h2><br>" +
    respText +
    "<h4 style='text-align: center;'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h4>" +
    "<h2 style='text-align: center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo( prms.fixSize, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0,  prms.fixSize);
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
    func: drawFixation
};

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}


function drawSimon(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    // left
    ctx.fillStyle = args["left"];
    ctx.fillRect(-100, -25, 50, 50);
   
    // middle
    ctx.fillStyle = args["middle"];
    ctx.fillRect(-25, -25, 50, 50);
   
    // right
    ctx.fillStyle = args["right"];
    ctx.fillRect(50, -25, 50, 50);

}

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);

    let rt = (dat.order === "RI") ? dat.rt : dat.rt - prms.simonDur;

    if (dat.key_press === corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
        corrCode = 1;  // correct
    } else if (dat.key_press !== corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
        corrCode = 2;  // choice error
    } else if (rt === null) {
        corrCode = 3; // too slow
    } else if (rt <= prms.tooFast) {
        corrCode = 4; // too false
    }

    jsPsych.data.addDataToLastTrial({date: Date(), rt: rt, corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
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
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.corrCode - 1]; 
    }
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() {}
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "",
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt_de({stim: "simon"});
    },
};

const simon_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, 200],
    clear_screen: [0, 1],
    stimulus_duration: 400,
    response_ends_trial: true,
    choices: prms.respKeys,
    func: [drawSimon, drawSimon],
    func_args:[
        { 
            "left":   jsPsych.timelineVariable("l1") ,
            "middle": jsPsych.timelineVariable("m1") ,
            "right":  jsPsych.timelineVariable("r1") ,
        },
        { 
            "left":   jsPsych.timelineVariable("l2") ,
            "middle": jsPsych.timelineVariable("m2") ,
            "right":  jsPsych.timelineVariable("r2") ,
        },
    ],
    data: {
        stim: "simon",
        side: jsPsych.timelineVariable('side'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_start: function(trial) {
        if (trial.data.order === "RI") {
            trial.trial_duration = prms.tooSlow;
        } else {
            trial.trial_duration = prms.tooSlow + prms.simonDur;
        }
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { l1: "black", m1: cc,               r1: cc,      l2: cc,      m2: prms.respCols[0], r2: cc,      side: "left",  comp: "comp",   order: "IR", corrResp: prms.respKeys[0] },
        { l1: cc,      m1: cc,               r1: "black", l2: cc,      m2: prms.respCols[0], r2: cc,      side: "right", comp: "incomp", order: "IR", corrResp: prms.respKeys[0] },
        { l1: "black", m1: cc,               r1: cc,      l2: cc,      m2: prms.respCols[1], r2: cc,      side: "left",  comp: "comp",   order: "IR", corrResp: prms.respKeys[1] },
        { l1: cc,      m1: cc,               r1: "black", l2: cc,      m2: prms.respCols[1], r2: cc,      side: "right", comp: "incomp", order: "IR", corrResp: prms.respKeys[1] },
        { l1: cc,      m1: prms.respCols[0], r1: cc,      l2: "black", m2: cc,               r2: cc,      side: "left",  comp: "comp",   order: "RI", corrResp: prms.respKeys[0] },
        { l1: cc,      m1: prms.respCols[0], r1: cc,      l2: cc,      m2: cc,               r2: "black", side: "right", comp: "incomp", order: "RI", corrResp: prms.respKeys[0] },
        { l1: cc,      m1: prms.respCols[1], r1: cc,      l2: "black", m2: cc,               r2: cc,      side: "left",  comp: "comp",   order: "RI", corrResp: prms.respKeys[1] },
        { l1: cc,      m1: prms.respCols[1], r1: cc,      l2: cc,      m2: cc,               r2: "black", side: "right", comp: "incomp", order: "RI", corrResp: prms.respKeys[1] },
    ],
};


const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    response_ends_trial: true,
    choices: [32],
    stimulus: "<h3 style='text-align:left;'>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h3>" +
              "<h3 style='text-align:left;'>benötigen, kopieren Sie den folgenden zufällig generierten Code</h3>" +
              "<h3 style='text-align:left;'>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h3><br>" +
              "<h2>XXX@XXX</h2>" +
              "<h1>Code: " + randomString + "</h1><br>" +
              "<h2 align='left'>Drücken Sie die Leertaste, um fortzufahren!</h2>",  
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true,
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
    on_start: function() {
        $('body').css('cursor', 'default')
    }
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(welcome_de);
    exp.push(resize_de);
    exp.push(vpInfoForm_de);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.sample = {type: "fixed-repetitions", size: (blk === 0) ? (prms.nTrlsP/8) : (prms.nTrlsE/8)}
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(alphaNum);
    exp.push(fullscreen_off);
    
    return exp;

}
const EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + genVpNum();
const code_filename = dirName + "code/" + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:cs[0],
        min_height:cs[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", data_filename, {stim: "simon"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});

