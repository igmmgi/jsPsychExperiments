// Performance Monitoring V1 
// Speeded reaction time task with partial (e.g., Correct/Incorrect) and
//  full feedback (e.g., Correct/Incorrect + faster/slower than average)
// Task: Repond to shapes (square, circle triangle, star) with one of
//  four response keys (S, D, K, L)

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
    nTrlsP:  20, 
    nTrlsE: 100,
    nBlks: 5, 
    fixDur: 500,
    fbDur: 500,
    iti: 500,
    tooFast:  150,   
    tooSlow: 1500,   
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    respKeys: ["S", "D", "K", "L"],
    respShapes: shuffle(["square", "circle", "triangle", "star"]),
    fixSize: 15,
    fixWidth: 3,
    shapeSize: 50,
    fbSize: "40px monospace",
    cTrl: 1,
    cBlk: 1,
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

function drawInstructions() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.font         = "30px monospace";
    ctx.fillStyle    = "black"
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("Respond to the following shapes", 0, -200);
    ctx.fillText("with the corresponding keys", 0, -150); 
    ctx.save();

    ctx.translate(-300, 0);
    for (let i = 0; i < 4; i++) {
        if (prms.respShapes[i] == "square") {
            ctx.fillRect(-prms.shapeSize, -prms.shapeSize, prms.shapeSize*2, prms.shapeSize*2)
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] == "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, prms.shapeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] == "triangle") {
            ctx.beginPath();
            ctx.moveTo(0, -prms.shapeSize);
            ctx.lineTo(-prms.shapeSize, prms.shapeSize);
            ctx.lineTo( prms.shapeSize, prms.shapeSize);
            ctx.fill();
            ctx.fillText(prms.respKeys[i], 0, prms.shapeSize * 1.5); 
        } else if (prms.respShapes[i] == "star") {
            let points = 5;
            let size = prms.shapeSize * 1.2;
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
            ctx.fillRect(-prms.shapeSize, -prms.shapeSize, prms.shapeSize*2, prms.shapeSize*2)
            break;
        case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, prms.shapeSize, 0, Math.PI * 2);
            ctx.fill();
            break;
        case "triangle":
            ctx.beginPath();
            ctx.moveTo(0, -prms.shapeSize);
            ctx.lineTo(-prms.shapeSize, prms.shapeSize);
            ctx.lineTo( prms.shapeSize, prms.shapeSize);
            ctx.fill();
            break;
        case "star":
            let points = 5;
            let size = prms.shapeSize * 1.2;
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
            break;
    }
}

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    ctx.font         = prms.fbSize; 
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "black";
    
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
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
    func: [drawInstructions]
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
    stimulus: blockFeedbackTxt,
    response_ends_trial: true,
    data: { stim: "block_feedback" },
};

const trial_timeline = {
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
    randomize_order:true,
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
    exp.push(welcome_de);
    exp.push(task_instructions1);
   
    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP/4) : (prms.nTrlsE/4);
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
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

