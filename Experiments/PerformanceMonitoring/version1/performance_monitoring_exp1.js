// Performance Monitoring V1 
// Speeded reaction time task with partial (e.g., Correct/Incorrect) and
//  full feedback (e.g., Correct/Incorrect + faster/slower than average)
// Task: Repond to shapes (square, circle triangle, star) with one of
//  four response keys (S,D,K,L)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(200, 200, 200, 1)";
const canvas_size = [960, 720];
const canvas_border = "5px solid black";


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 2;
    ctx.moveTo(-15, 0);
    ctx.lineTo( 15, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -15);
    ctx.lineTo(0,  15);
    ctx.stroke(); 
}

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


function drawShape() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle = "black"
    
    // example square
    ctx.translate(-300, 0);
    ctx.fillRect(-50, -50, 100, 100)

    // example circle
    ctx.translate(200, 0);
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();

    // example triangle
    ctx.translate(200, 0);
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(-50, 50);
    ctx.lineTo( 50, 50);
    ctx.fill();

    // example star shape
    ctx.translate(200, 0);
    let points = 5;
    let size = 60;
    let inset = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    for (var i = 0; i < points; i++) {
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, 0 - (size*inset));
        ctx.rotate(Math.PI / points);
        ctx.lineTo(0, -size);
    }
    ctx.fill();


    ctx.restore();

}


const shape_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: 5000,
    translate_origin: true,
    stimulus_onset: 0,
    response_ends_trial: true,
    func: [drawShape]
};


////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

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
    exp.push(fixation_cross);
    exp.push(shape_stimulus);
    
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

