// B.Sc. Project DMC SimonNumber  
// ResearchProject 2.1
// Simon task with number stimuli presented
// to the left and right screen location. VPs
// should respond with left and right key-presses according
// to numerical distance from a reference number (e.g.,
// smaller/larger than 45). Numbers can be near/far from 
// the reference number.

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
    nTrlsP: 96,  // number of trials in first block (practice)
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 11,
    fixDur: 500,
    fbDur: [500, 1000, 1000, 1000],
    iti: 500,
    tooFast:    0,
    tooSlow: 2000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respKeys: ["S", "K", 27],
    fixWidth: 3,
    fixSize: 15,
    stimPosX: 300,
    stimPosY:   0,
    stimSize: "50px monospace"
};

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
    "<h4 align='left'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h4>" +
    "<h4 align='left'>Nach jedem Tastendruck erhalten Sie die Rückmeldung, ob Ihre Antwort <b>richtig</b> oder <b>falsch</b> war.</h4>" +
    "<h4 align='left'>Am Ende jedes Blocks haben Sie die Möglichkeit eine kleine Pause zu machen.</h4><br>" +
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


function drawNumber(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle    = "black"
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.font         = prms.stimSize;
    
    switch (args["position"]) {
        case "left":
            ctx.fillText(args["number"], -prms.stimPosX, prms.stimPosY);
            break;
        case "right":
            ctx.fillText(args["number"],  prms.stimPosX, prms.stimPosY);
            break;
    }
 
}

const number_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    func: drawNumber,
    func_args:[ 
        { "number": jsPsych.timelineVariable("number"), "position": jsPsych.timelineVariable("position") }, 
    ],
    data: {
        stim: "SimonNumber",
        number: jsPsych.timelineVariable('number'), 
        size: jsPsych.timelineVariable('size'), 
        distance: jsPsych.timelineVariable('distance'), 
        position: jsPsych.timelineVariable('position'), 
        cong: jsPsych.timelineVariable('cong'), 
        corrResp: jsPsych.timelineVariable('corrResp'), 
    },
    on_finish: function() { codeTrial(); }
};


function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "40px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
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
        trial.stimulus = blockFeedbackTxt_de({stim: "SimonNumber"});
    },
};


const trial_timeline = {
    timeline: [
        fixation_cross,
        number_stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables:[
        { number: "21", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "22", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "23", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "24", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "25", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "26", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "27", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "28", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "29", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "30", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "31", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "32", size: "small", distance: "far",  position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "33", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "34", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "35", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "36", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "37", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "38", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "39", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "40", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "41", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "42", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "43", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "44", size: "small", distance: "near", position: "left",  cong: "cong",   corrResp: prms.respKeys[0]},
        { number: "46", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "47", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "48", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "49", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "50", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "51", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "52", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "53", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "54", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "55", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "56", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "57", size: "large", distance: "near", position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "58", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "59", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "60", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "61", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "62", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "63", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "64", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "65", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "66", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "67", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "68", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "69", size: "large", distance: "far",  position: "left",  cong: "incong", corrResp: prms.respKeys[1]},
        { number: "21", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "22", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "23", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "24", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "25", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "26", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "27", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "28", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "29", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "30", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "31", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "32", size: "small", distance: "far",  position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "33", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "34", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "35", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "36", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "37", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "38", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "39", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "40", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "41", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "42", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "43", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "44", size: "small", distance: "near", position: "right", cong: "incong", corrResp: prms.respKeys[0]},
        { number: "46", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "47", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "48", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "49", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "50", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "51", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "52", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "53", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "54", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "55", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "56", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "57", size: "large", distance: "near", position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "58", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "59", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "60", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "61", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "62", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "63", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "64", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "65", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "66", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "67", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "68", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
        { number: "69", size: "large", distance: "far",  position: "right", cong: "cong",   corrResp: prms.respKeys[1]},
    ],
    randomize_order:true,
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h2 align='left'>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h2>" +
    "<h2 align='left'>benötigen, kopieren Sie den folgenden zufällig generierten</h2>" +
    "<h2 align='left'Code und senden Sie diesen</h2>" +
    "<h2 align='left'>und senden Sie diesen zusammen mit Ihrer Matrikelnummer</h2>" +
    "<h2 align='left'>per Email an:</h2></br>" +
    "<h2>XXX@XXX</h2>" +
    "<h2>Code: " + randomString + "</h2></br></br>" +
    "<h3>Drücken Sie eine beliebige Taste, um fortzufahren!</h3>"
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
    // exp.push(vpInfoForm_de);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = 1;
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
        min_width:  canvas_size[0],
        min_height: canvas_size[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "SimonNumber"}); 
    }
});

