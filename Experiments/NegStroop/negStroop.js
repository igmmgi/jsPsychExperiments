// Stroop-like task with not/now words in front of colour words 

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 96,  // number of trials in practise blocks 
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 5,
    fixDur: 500,
    fbDur: 1000,
    iti: 1000,  // feedback shown during iti for incorrect responses only
    tooFast: 150,
    tooSlow: 1500,
    respKeys: ["D", "C", "M", "K", 27],
    fbTxt: ["Correct", "Error", "Too Slow", "Too Fast"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
};

const respMap = shuffle(["red", "blue", "green", "yellow"]);
const respKey = {
    red:    prms.respKeys[respMap.findIndex(x => x === "red")],
    blue:   prms.respKeys[respMap.findIndex(x => x === "blue")],
    green:  prms.respKeys[respMap.findIndex(x => x === "green")],
    yellow: prms.respKeys[respMap.findIndex(x => x === "yellow")]
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
    type: "html-keyboard-response-canvas",
    canvas_colour: "rgba(200, 200, 200, 0.5)",
    canvas_border: "4px solid black",
    stimulus: "<H1 style='text-align: center;'>Welcome:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font </H2><br>" +
    "<H2 style='text-align: center;'>" + respMap[0] + " = D&emsp;&emsp;&emsp;&emsp;" + respMap[3] + " = K </H2>" +
    "<H2 style='text-align: center;'>" + respMap[1] + " = C&emsp;"                   + respMap[2] + " = M </H2>",
};

function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 3;
    ctx.moveTo(-20, 0);
    ctx.lineTo( 20, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -20);
    ctx.lineTo(0,  20);
    ctx.stroke(); 
}

function drawStroop(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = "30px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = args["fontcolour"]; 
    ctx.fillText(args["text"], args["posx"], args["posy"]); 
}

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black"; 
    if (prms.cBlk === 1) {
        ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0); 
    } else if (prms.cBlk > 1 && dat.corrCode !== 1) {
        ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0); 
    }
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "rgba(200, 200, 200, 1)",
    canvas_border: "4px solid black",
    trial_duration: prms.fixDur,
    translate_origin: true,
    func: drawFixation
};

const trial_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "rgba(200, 200, 200, 1)",
    canvas_border: "4px solid black",
    trial_duration: prms.tooSlow,
    translate_origin: true,
    func: drawStroop,
    func_args:[
        {"text": jsPsych.timelineVariable("text"),
         "fontcolour": jsPsych.timelineVariable('fontcolour'),
         "posx": jsPsych.timelineVariable('posx'),
         "posy": jsPsych.timelineVariable('posy')
        }
    ],
    data: {
        stim: "negStroop",
        text: jsPsych.timelineVariable('text'), 
        fontcolour: jsPsych.timelineVariable('fontcolour'), 
        affneg: jsPsych.timelineVariable('affneg'), 
        posx: jsPsych.timelineVariable('posx'), 
        posy: jsPsych.timelineVariable('posy'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_finish: function() { codeTrial(); }
};

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "rgba(200, 200, 200, 1)",
    canvas_border: "4px solid black",
    trial_duration: prms.fbDur,
    translate_origin: true,
    func: drawFeedback
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "rgba(200, 200, 200, 1)",
    canvas_border: "4px solid black",
    trial_duration: prms.iti,
    translate_origin: true,
    func: function() {}
};


const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: "rgba(200, 200, 200, 0.5)",
    canvas_border: "4px solid black",
    stimulus: '',
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt({stim: "stroop"});
    },
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        trial_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { text: "now red",    fontcolour: "red",    affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now red",    fontcolour: "red",    affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now red",    fontcolour: "red",    affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now red",    fontcolour: "green",  affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now red",    fontcolour: "blue",   affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "now red",    fontcolour: "yellow", affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not red",    fontcolour: "red",    affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not red",    fontcolour: "red",    affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not red",    fontcolour: "red",    affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not red",    fontcolour: "green",  affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not red",    fontcolour: "blue",   affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not red",    fontcolour: "yellow", affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now green",  fontcolour: "green",  affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now green",  fontcolour: "green",  affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now green",  fontcolour: "green",  affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now green",  fontcolour: "red",    affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now green",  fontcolour: "blue",   affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "now green",  fontcolour: "yellow", affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not green",  fontcolour: "green",  affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not green",  fontcolour: "green",  affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not green",  fontcolour: "green",  affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not green",  fontcolour: "red",    affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not green",  fontcolour: "blue",   affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not green",  fontcolour: "yellow", affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now blue",   fontcolour: "blue",   affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "now blue",   fontcolour: "blue",   affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "now blue",   fontcolour: "blue",   affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "now blue",   fontcolour: "red",    affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now blue",   fontcolour: "green",  affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now blue",   fontcolour: "yellow", affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not blue",   fontcolour: "blue",   affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not blue",   fontcolour: "blue",   affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not blue",   fontcolour: "blue",   affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not blue",   fontcolour: "red",    affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not blue",   fontcolour: "green",  affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not blue",   fontcolour: "yellow", affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now yellow", fontcolour: "yellow", affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now yellow", fontcolour: "yellow", affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now yellow", fontcolour: "yellow", affneg: "aff", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "now yellow", fontcolour: "red",    affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "now yellow", fontcolour: "green",  affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "now yellow", fontcolour: "blue",   affneg: "aff", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
        { text: "not yellow", fontcolour: "yellow", affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not yellow", fontcolour: "yellow", affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not yellow", fontcolour: "yellow", affneg: "neg", comp: 'comp',   posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["yellow"] },
        { text: "not yellow", fontcolour: "red",    affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["red"] },
        { text: "not yellow", fontcolour: "green",  affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["green"] },
        { text: "not yellow", fontcolour: "blue",   affneg: "neg", comp: 'incomp', posx: getRandomInt(-300, 300), posy: getRandomInt(-300, 300), corrResp: respKey["blue"] },
    ],
    sample: {
        type: "fixed-repetitions"
    }
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    // exp.push(fullscreen_on);
    // exp.push(welcome_en);
    // exp.push(vpInfoForm);
    exp.push(task_instructions);
    exp.push(iti);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.sample.size = (blk === 0) ? 1 : 2;
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
        exp.push(iti);
    }
    exp.push(debrief_en);
    exp.push(fullscreen_off);
    return exp;

}
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen_mode: true,
    show_progress_bar: false,
    exclusions: {
        min_width:960,
        min_height:720,
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, {stim: "negStroop"});
    }
});

