function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.moveTo(-50, 0);
    ctx.lineTo( 50, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -50);
    ctx.lineTo(0,  50);
    ctx.stroke(); 
}

function drawCircle() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.stroke(); 
    ctx.beginPath();
    ctx.arc(0, 200, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke(); 
    ctx.beginPath();
    ctx.arc(200, 0, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 5;
    ctx.stroke(); 
}

function drawText() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Hello World", 0, 0); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "2px solid black",
    func: function(){ drawFixation(); },
};

const line = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: function(){ drawLine(); },
};

const circle = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "6px solid red",
    func: function(){ drawCircle(); },
};

const text = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "8px solid green",
    func: function(){ drawText(); },
};

const combined = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "10px solid blue",
    func: function(){ 
        drawFixation(); 
        drawCircle(); 
        drawText(); 
    },
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    for (let i = 0; i < 10; i++) {
        exp.push(fixation_cross);
        exp.push(circle);
        exp.push(fixation_cross);
        exp.push(text);
        exp.push(fixation_cross);
        exp.push(combined);
    }
    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
});

