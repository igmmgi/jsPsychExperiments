// Modified version of a Flanker Task:
// VPs respond to the central letter within a 5-letter array (e.g., HHHHH, SSHSS)
//  whilst ignoring the surrounding letters using left and right key-presses ("D" and "J").
// 50% of trials involve the presentation of the "flankers" 
//  first followed by the presentation of the "target" HH HH -> H
// 50% of trials involve the presentation of the "target" 
//  first followed by the presentation of the "flankers" H -> HH HH

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(200, 200, 200, 1)";
const canvas_size   = [960, 720];
const canvas_border = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum   = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 32,  // number of trials in first block (practice)
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 2,
    fixDur: 500,
    flankDur: 200,
    fbDur: [500, 1000, 1000, 1000],
    iti: 500,
    tooFast:  150,  
    tooSlow: 2000,  
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respKeys: [],
    fixWidth: 3,
    fixSize: 15,
    flankSize: "50px monospace",
    fbSize: "30px monospace"
};

const versionNumber = getVersionNumber(vpNum, 2)
let respText = ""
if (versionNumber === 1) {
    prms.respKeys = ["D", "J", 27];
    respText      = "<h4 align='center'><b>H = Taste D</b> (linken Zeigefinger).</h4>" +
                    "<h4 align='center'><b>S = Taste J</b> (rechten Zeigefinger).</h4>";
} else {
    prms.respKeys = ["J", "D", 27];
    respText      = "<h4 align='center'><b>S = Taste D</b> (linken Zeigefinger).</h4>" +
                    "<h4 align='center'><b>H = Taste J</b> (rechten Zeigefinger).</h4>";
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h2 align='center'>Willkommen bei unserem Experiment:</h2><br>" +
              "<h3 align='center'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
              "<h3 align='center'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
              "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: 
    "<h2 align='center'>Aufgabe:</h2><br>" +
    "<h4 align='center'>Bitte reagieren Sie immer auf den Buchstaben in der Mitte.</h4>" +
    respText +
    "<h4 align='center'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h4><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
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
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
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

function drawFlanker(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.flankSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(args["text"], 0, 0); 
}

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);

    let rt = (dat.order === "RI") ? dat.rt : dat.rt - prms.flankDur;

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
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
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
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() {}
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "",
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt_de({stim: "flanker"});
    },
};

const flanker_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    stimulus_onset: [0, prms.flankDur],
    response_ends_trial: true,
    choices: prms.respKeys,
    clear_screen: [0, 1],
    stimulus_duration: 400,
    func: [drawFlanker, drawFlanker],
    func_args:[
        {"text": jsPsych.timelineVariable("flanker1")},
        {"text": jsPsych.timelineVariable("flanker2")}
    ],
    data: {
        stim: "flanker",
        flanker: jsPsych.timelineVariable('flanker'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_start: function(trial) {
        if (trial.data.order === "RI") {
            trial.trial_duration = prms.tooSlow;
        } else {
            trial.trial_duration = prms.tooSlow + prms.flankDur;
        }
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        flanker_stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables:[
        { flanker: "HHHHH", flanker1: "  H  ", flanker2: "HH HH", comp: "comp",   order: "RI", corrResp: prms.respKeys[0] },
        { flanker: "SSSSS", flanker1: "  S  ", flanker2: "SS SS", comp: "comp",   order: "RI", corrResp: prms.respKeys[1] },
        { flanker: "SSHSS", flanker1: "  H  ", flanker2: "SS SS", comp: "incomp", order: "RI", corrResp: prms.respKeys[0] },
        { flanker: "HHSHH", flanker1: "  S  ", flanker2: "HH HH", comp: "incomp", order: "RI", corrResp: prms.respKeys[1] },
        { flanker: "HHHHH", flanker1: "HH HH", flanker2: "  H  ", comp: "comp",   order: "IR", corrResp: prms.respKeys[0] },
        { flanker: "SSSSS", flanker1: "SS SS", flanker2: "  S  ", comp: "comp",   order: "IR", corrResp: prms.respKeys[1] },
        { flanker: "HHSHH", flanker1: "HH HH", flanker2: "  S  ", comp: "incomp", order: "IR", corrResp: prms.respKeys[1] },
        { flanker: "SSHSS", flanker1: "SS SS", flanker2: "  H  ", comp: "incomp", order: "IR", corrResp: prms.respKeys[0] },
    ],
    randomize_order:true,
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>XXX@XXX</h2>" +
    "<h1>Code:" + randomString + "</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>"
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
    exp.push(resize_de) 
    exp.push(vpInfoForm_de);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP/8) : (prms.nTrlsE/8);
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(alphaNum);
    exp.push(fullscreen_off);

    return exp;

}
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:canvas_size[0],
        min_height:canvas_size[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "flanker"}); 
    }
});

