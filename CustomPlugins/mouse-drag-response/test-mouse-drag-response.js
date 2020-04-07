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

// const fixation_cross = {
//     type: 'html-keyboard-response',
//     stimulus: '<div style="font-size:60px;">+</div>',
//     choices: jsPsych.NO_KEYS,
//     trial_duration: 500,
//     post_trial_gap: 0,
//     data: {stim: "fixation"},
// };


const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: drawFixation
};

var trial = {
    type: 'mouse-drag-response',
    stim_height: 80,
    stim_width: 200,
    sort_area_height: 960,
    sort_area_width: 1280,
    stimuli: jsPsych.timelineVariable('word'), 
};


const trial_timeline = {
    timeline: [
        fixation_cross,
        trial,
    ],
    timeline_variables:[
        { word: 'img/cloud_blue.png'},
        { word: 'img/cloud_green.png'},
        { word: 'img/cloud_red.png'},
        { word: 'img/cloud_yellow.png'},
        { word: 'img/grass_blue.png'},
        { word: 'img/grass_green.png'},
        { word: 'img/grass_red.png'},
        { word: 'img/grass_yellow.png'},
        { word: 'img/sun_blue.png'},
        { word: 'img/sun_green.png'},
        { word: 'img/sun_red.png'},
        { word: 'img/sun_yellow.png'},
        { word: 'img/worm_blue.png'},
        { word: 'img/worm_green.png'},
        { word: 'img/worm_red.png'},
        { word: 'img/worm_yellow.png'}
    ],
    randomize_order:true,
    repetitions: 9
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    // just draw stuff
    exp.push(fixation_cross);
    exp.push(trial_timeline);

    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
});

