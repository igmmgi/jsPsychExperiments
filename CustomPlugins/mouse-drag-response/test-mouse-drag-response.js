// Stroop-like task with VPs required to drag words up/down according to colour

function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 5;
    ctx.moveTo(-25, 0);
    ctx.lineTo( 25, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -25);
    ctx.lineTo(0,  25);
    ctx.stroke(); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: drawFixation
};

const trial = {
    type: 'mouse-drag-response',
    canvas_border: "4px solid black",
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'), 
};



const trial_timeline = {
    timeline: [
        fixation_cross,
        trial,
    ],
    timeline_variables:[
        { word: 'cloud', colour: 'blue'},
        { word: 'cloud', colour: 'green'},
        { word: 'cloud', colour: 'red'},
        { word: 'cloud', colour: 'orange'},
        { word: 'grass', colour: 'blue'},
        { word: 'grass', colour: 'green'},
        { word: 'grass', colour: 'red'},
        { word: 'grass', colour: 'orange'},
        { word: 'sun',   colour: 'blue'},
        { word: 'sun',   colour: 'green'},
        { word: 'sun',   colour: 'red'},
        { word: 'sun',   colour: 'orange'},
        { word: 'worm',  colour: 'blue'},
        { word: 'worm',  colour: 'green'},
        { word: 'worm',  colour: 'red'},
        { word: 'worm',  colour: 'orange'}
    ],
    randomize_order:true,
    repetitions: 16
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(trial_timeline);
    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
});

