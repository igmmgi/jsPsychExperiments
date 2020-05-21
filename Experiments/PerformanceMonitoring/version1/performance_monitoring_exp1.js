// Performance Monitoring V1 
// Speeded reaction time task with standard feedback (e.g., Correct/Incorrect) and
//  more informative feedback (e.g., Correct/Incorrect + faster/slower than average).
//  The feedback manipulation (termed "partial" vs. "full") is manipulated blockwise.
// Current performance is determined by the mean rt in the previous X trials.
// Task: Repond to shapes (square, circle triangle, star) with one of
//  four response keys (S, D, K, L)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(220, 220, 220, 1)";
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
    nTrlsP:  20, 
    nTrlsE: 100,
    nBlks: 4, 
    fixDur: 500,
    fbDur: 1000,
    iti: 500,
    tooFast:  150,   
    tooSlow: 2000,   
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    fbSize: "40px monospace",
    perFbTxt: ["Faster than average", "Slower than average"],
    perFbCol: shuffle(["Chocolate", "DodgerBlue"]),
    respKeys: ["S", "D", "K", "L"],
    respShapes: shuffle(["square", "circle", "triangle", "star"]),
    fixSize: 15,
    fixWidth: 3,
    shapeSize: 50,
    cTrl: 1,
    cBlk: 1,
    nMeanTrl: 10,  // current performance determined by previous x trials for full feedback
    meanRt: null,  // mean performance in previous nMeanTrl
}

////////////////////////////////////////////////////////////////////////
//                      canvas drawing functions                      //
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

function drawSquare(ctx, size) {
    "use strict"
    ctx.fillRect(-size, -size, size*2, size*2)
}

function drawCircle(ctx, size) {
    "use strict"
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawTriangle(ctx, size) {
    "use strict"
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size, size);
    ctx.lineTo( size, size);
    ctx.fill();
}

function drawStar(ctx, size) {
    "use strict"
    let points = 5;
    let inset = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    for (let i = 0; i < points; i++) {
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - (size*inset));
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, -size);
    }
    ctx.fill();
}

function drawInstructions() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.font         = "30px monospace";
    ctx.fillStyle    = "black"
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("Respond to the following shapes", 0, -200);
    ctx.fillText("with the corresponding keys",     0, -150); 
    ctx.save();

    ctx.translate(-300, 0);
    for (let i = 0; i < 4; i++) {
        if (prms.respShapes[i] === "square") {
            drawSquare(ctx, prms.shapeSize)
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] === "circle") {
            drawCircle(ctx, prms.shapeSize)
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] === "triangle") {
            drawTriangle(ctx, prms.shapeSize)
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] === "star") {
            drawStar(ctx, prms.shapeSize * 1.2)
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        }
        ctx.translate(200, 0);
    }
    ctx.restore();

    ctx.fillText("Press any key to continue!", 0, 200);

}

function drawShape(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle = "black"
    switch (args["shape"]) {
        case "square":
            drawSquare(ctx, prms.shapeSize);
            break;
        case "circle":
            drawCircle(ctx, prms.shapeSize);
            break;
        case "triangle":
            drawTriangle(ctx, prms.shapeSize);
            break;
        case "star":
            drawStar(ctx, prms.shapeSize * 1.2);
            break;
    }
}

function codeTrial() {
    "use strict";

    // data from last trial
    let dat = jsPsych.data.get().last(1).values()[0];

    // data from last X trials to calculate mean performance
    // 1 (2) = current trial faster (slower) than mean of previous X trials
    let perfDat  = jsPsych.data.get().filter({stim: "shape"}).last(prms.nMeanTrl);
    let perfCode = null;
    try {
        prms.meanRt = perfDat.select("rt").mean();
        perfCode = (dat.rt <= prms.meanRt) ? 1 : 2
    } catch {
        prms.meanRt = null;  // not enough trials to calculate mean from x trials
    }

    // Code Correct (1), Incorrect (2), Too Slow (3), Too Fast (4)
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    if (dat.key_press === corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 1; // correct
    } else if (dat.key_press !== corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt === null) {
        corrCode = 3; // too slow
    } else if (dat.rt <= prms.tooFast) {
        corrCode = 4; // too fast
    }

    jsPsych.data.addDataToLastTrial( 
        { 
            date: Date(), 
            blockNum: prms.cBlk, 
            trialNum: prms.cTrl,
            corrCode: corrCode, 
            perfCode: perfCode, 
            meanPerf: prms.meanRt, 
        }
    );

    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }

}

function drawFeedback() {
    "use strict"

    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    // feedback text 
    let fbText   = prms.fbTxt[dat.corrCode-1];
    let givePerf = (dat.fbType === "full" && dat.corrCode === 1 && dat.perfCode !== null)
    let perfTxt  = (givePerf) ? prms.perFbTxt[dat.perfCode-1] : ""

    ctx.font         = prms.fbSize; 
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "black";

    // standard feedback (Correct, Error, Too Slow, Too Fast)
    ctx.fillText(fbText, 0, 0); 
   
    // informative feedback (faster, slower)
    ctx.fillStyle = perfTxt === prms.perFbTxt[0] ? prms.perFbCol[0] : prms.perFbCol[1];
    ctx.fillText(perfTxt, 0, 50);

}

////////////////////////////////////////////////////////////////////////
//                              jsPsych stimuli                       //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: 500,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation
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

const task_instructions1 = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    response_ends_trial: true,
    func: drawInstructions,
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const shape_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    func: drawShape,
    func_args:[ { "shape": jsPsych.timelineVariable("shape") }, ],
    data: {
        stim: "shape",
        shape: jsPsych.timelineVariable('shape'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_finish: function() { codeTrial(); }
};

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.fbDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "",
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt_de({stim: "shape"});
    },
};

const trial_timeline_partial = {
    timeline: [
        fixation_cross,
        shape_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { shape: prms.respShapes[0], corrResp: prms.respKeys[0] },
        { shape: prms.respShapes[1], corrResp: prms.respKeys[1] },
        { shape: prms.respShapes[2], corrResp: prms.respKeys[2] },
        { shape: prms.respShapes[3], corrResp: prms.respKeys[3] },
    ],
    data: {fbType: "partial"},
    sample: {
        type: "with-repalcement"
    }
};

const trial_timeline_full = {
    timeline: [
        fixation_cross,
        shape_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { shape: prms.respShapes[0], corrResp: prms.respKeys[0] },
        { shape: prms.respShapes[1], corrResp: prms.respKeys[1] },
        { shape: prms.respShapes[2], corrResp: prms.respKeys[2] },
        { shape: prms.respShapes[3], corrResp: prms.respKeys[3] },
    ],
    data: {fbType: "full"},
    sample: {
        type: "with-repalcement"
    }
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
    //exp.push(vpInfoForm_de);
    exp.push(task_instructions1);

    // random order following initial partial/full practice blocks
    // let order = ["P", "F"];
    // order = order.concat(shuffle(new Array(prms.nBlks-2).fill(["P", "F"]).flat()));

    // or keep alternating partial -> full -> partial ...
    let order = new Array(prms.nBlks).fill(["P", "F"]).flat();

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = (order[blk] === "P") ? {...trial_timeline_partial} : {...trial_timeline_full}
        blk_timeline.sample.size = (blk < 2) ? (prms.nTrlsP/4) : (prms.nTrlsE/4);
        exp.push(blk_timeline);        // trials within a block
        exp.push(block_feedback);      // show previous block performance 
        exp.push(task_instructions1);  // task-mapping reminder
    }
    exp.push(debrief_de);
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
        saveData("/Common/write_data.php", filename, rows = {stim: "shape"}); 
    }
});

