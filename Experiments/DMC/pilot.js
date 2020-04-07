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

function drawFlanker(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    
    ctx.font         = "200px Courier";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(args["txt"], 0, 0); 
}

function drawStroop(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
 
    // rectangle outline
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = "black";
    ctx.rect(-300, -100, 600, 200);
    ctx.stroke();

    // rectange fill
    ctx.fillStyle = args["col"];
    ctx.fillRect(-300, -100, 600, 200);
   
    // word
    ctx.font = "200px Courier";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(args["word"], 0, 0); 

}

function drawSimon(args) {
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle = args["col"];

    if (args["pos"] === "left") {
        ctx.fillRect(-300, -50, 100, 100);
    } else if (args["pos"] === "middle") {
        ctx.fillRect(-50, -50, 100, 100);
    } else if (args["pos"] === "right") {
        ctx.fillRect(200, -50, 100, 100);
    }

}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "10px solid black",
    func: drawFixation
};

const flanker_stimulus = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 2000,
    translate_origin: true,
    canvas_border: "10px solid black",
    stimulus_onset: [0, 100],
    clear_screen: [true, true],
    stimulus_duration: 200,
    func: [drawFlanker, drawFlanker],
    func_args: [
        { "txt": jsPsych.timelineVariable('flanker1') },
        { "txt": jsPsych.timelineVariable('flanker2') }
    ]
}

const stroop_stimulus = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 2000,
    translate_origin: true,
    canvas_border: "10px solid black",
    stimulus_onset: [0, 100],
    clear_screen: [true, true],
    stimulus_duration: 200,
    func: [drawStroop, drawStroop],
    func_args: [
        { "col": jsPsych.timelineVariable('col1'), "word": jsPsych.timelineVariable('word1') },
        { "col": jsPsych.timelineVariable('col2'), "word": jsPsych.timelineVariable('word2') },
    ]
}

const simon_stimulus = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 2000,
    translate_origin: true,
    canvas_border: "10px solid black",
    stimulus_onset: [0, 100, 200],
    clear_screen: [true, true, true],
    stimulus_duration: 300,
    func: [drawSimon, drawSimon, drawSimon],
    func_args: [
        { "col": jsPsych.timelineVariable('col1'), "pos": jsPsych.timelineVariable('pos1') },
        { "col": jsPsych.timelineVariable('col2'), "pos": jsPsych.timelineVariable('pos2') },
        { "col": jsPsych.timelineVariable('col3'), "pos": jsPsych.timelineVariable('pos3') }
    ]
}

const flanker_timeline = {
    timeline: [
        fixation_cross,
        flanker_stimulus
    ],
    timeline_variables:[
        { flanker1: " < ", flanker2: "< <" },
        { flanker1: " > ", flanker2: "> >" },
        { flanker1: " < ", flanker2: "> >" },
        { flanker1: " > ", flanker2: "< <" },
        { flanker1: "< <", flanker2: " < " },
        { flanker1: "> >", flanker2: " < " },
        { flanker1: "< <", flanker2: " < " },
        { flanker1: "> >", flanker2: " < " },
    ],
    repetitions: 1
};


const stroop_timeline = {
    timeline: [
        fixation_cross,
        stroop_stimulus
    ],
    timeline_variables:[
        { col1: "RED",    word1: " ",     col2: "WHITE",  word2: "RED"},
        { col1: "RED",    word1: " ",     col2: "WHITE",  word2: "GREEN"},
        { col1: "GREEN",  word1: " ",     col2: "WHITE",  word2: "GREEN"},
        { col1: "GREEN",  word1: " ",     col2: "WHITE",  word2: "RED"},
        { col1: "WHITE",  word1: "RED",   col2: "RED",    word2: " "},
        { col1: "WHITE",  word1: "RED",   col2: "GREEN",  word2: " "},
        { col1: "WHITE",  word1: "GREEN", col2: "RED",    word2: " "},
        { col1: "WHITE",  word1: "GREEN", col2: "GREEN",  word2: " "},
    ],
    repetitions: 1
};


const simon_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus
    ],
    timeline_variables:[
        { col1: "BLACK", pos1: "left",  col2: "RED",   pos2: "middle", col3: "WHITE", pos3: "left"},
        { col1: "BLACK", pos1: "right", col2: "RED",   pos2: "middle", col3: "WHITE", pos3: "right"},
        { col1: "WHITE", pos1: "left",  col2: "GREEN", pos2: "middle", col3: "BLACK", pos3: "left"},
        { col1: "WHITE", pos1: "right", col2: "GREEN", pos2: "middle", col3: "BLACK", pos3: "right"},
        { col1: "BLACK", pos1: "left",  col2: "RED",   pos2: "middle", col3: "WHITE", pos3: "left"},
        { col1: "BLACK", pos1: "right", col2: "RED",   pos2: "middle", col3: "WHITE", pos3: "right"},
        { col1: "WHITE", pos1: "left",  col2: "GREEN", pos2: "middle", col3: "BLACK", pos3: "left"},
        { col1: "WHITE", pos1: "right", col2: "GREEN", pos2: "middle", col3: "BLACK", pos3: "right"},
    ],
    repetitions: 1
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(flanker_timeline);
    exp.push(stroop_timeline);
    exp.push(simon_timeline);

    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
});

