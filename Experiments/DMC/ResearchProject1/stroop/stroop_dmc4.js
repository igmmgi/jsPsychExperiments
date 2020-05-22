// Modified version of a Simon Task:
// VPs respond to the colour of the presented stimulus and ignore the text
//  using left and right key-presses ("D" and "J")
// 50% of trials involve the presentation of the "word" 
//  first followed by the presentation of the "colour" word -> colour 
// 50% of trials involve the presentation of the "colour" 
//  first followed by the presentation of the "word" colour -> word 

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
    stroopDur: 400,
    iti: 500,
    tooFast: 150,
    tooSlow: 2000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    fixWidth: 3,
    fixSize: 15,
    stroopSize: "60px monospace",
    fbSize: "30px monospace",
    respKeys: [],
};

const versionNumber = getVersionNumber(vpNum, 2)
if (versionNumber === 1) {
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

function drawStroop(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    // draw word
    ctx.font = prms.stroopSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = args["colour"];
    ctx.fillText("####", 0, 0); 

    // draw word
    ctx.font = prms.stroopSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(args["word"], 0, 0); 

}

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);

    let rt = (dat.order === "RI") ? dat.rt : dat.rt - prms.stroopDur;

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
        trial.stimulus = blockFeedbackTxt_de({stim: "stroop"});
    },
};

const stroop_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, 400],
    stimulus_duration: 800,
    clear_screen: [0, 1],
    func: [drawStroop, drawStroop],
    func_args:[
        {"word": jsPsych.timelineVariable("w1"), "colour": jsPsych.timelineVariable("c1")},
        {"word": jsPsych.timelineVariable("w2"), "colour": jsPsych.timelineVariable("c2")},
    ],
    data: {
        stim: "stroop",
        word: jsPsych.timelineVariable('word'), 
        colour: jsPsych.timelineVariable('colour'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_start: function(trial) {
        if (trial.data.order === "RI") {
            trial.trial_duration = prms.tooSlow;
        } else {
            trial.trial_duration = prms.tooSlow + prms.stroopDur;
        }
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        stroop_stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables:[
        { word: "blau", colour: "blue",  w1: "blau", c1: cc,      w2: "",     c2: "blue" , comp: 'comp',   order: "IR", corrResp: prms.respKeys[0]},
        { word: "blau", colour: "green", w1: "blau", c1: cc,      w2: "",     c2: "green", comp: 'incomp', order: "IR", corrResp: prms.respKeys[1]},
        { word: "grün", colour: "green", w1: "grün", c1: cc,      w2: "",     c2: "green", comp: 'comp',   order: "IR", corrResp: prms.respKeys[1]},
        { word: "grün", colour: "blue",  w1: "grün", c1: cc,      w2: "",     c2: "blue",  comp: 'incomp', order: "IR", corrResp: prms.respKeys[0]},
        { word: "blau", colour: "blue",  w1: "" ,    c1: "blue" , w2: "blau", c2:cc,       comp: 'comp',   order: "RI", corrResp: prms.respKeys[0]},
        { word: "blau", colour: "green", w1: "" ,    c1: "green", w2: "blau", c2:cc,       comp: 'incomp', order: "RI", corrResp: prms.respKeys[1]},
        { word: "grün", colour: "green", w1: "",     c1: "green", w2: "grün", c2:cc,       comp: 'comp',   order: "RI", corrResp: prms.respKeys[1]},
        { word: "grün", colour: "blue",  w1: "",     c1: "blue",  w2: "grün", c2:cc,       comp: 'incomp', order: "RI", corrResp: prms.respKeys[0]}
    ],
    sample:{
        type:"fixed-repetitions"
    }
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
        blk_timeline.sample.size = (blk === 0) ? (prms.nTrlsP/8) : (prms.nTrlsE/8);
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
        saveData("/Common/write_data.php", data_filename, {stim: "stroop"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});

