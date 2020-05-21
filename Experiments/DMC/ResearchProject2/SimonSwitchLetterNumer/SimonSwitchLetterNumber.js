// B.Sc. Project DMC SimonWord
// ResearchProject 2.2
// Simon task with letters (A,E,O,U,B,F,R,S) and numbers (1,2,3,4,6,7,8,9)
// presented to the left and right screen location. VPs
// should respond with left and right key-presses according
// to 1) vowel vs. consonant or 2) odd vs. even 

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
    nTrlsE: 64,  // number of trials in subsequent blocks 
    nBlks: 2,
    fixDur: 500,
    fbDur: [500, 1000, 1000, 1000],
    iti: 500,
    tooFast:    0,
    tooSlow: 5000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respKeysLife: [],
    respKeysSize: [],
    fixWidth: 3,
    fixSize: 15,
    stimPosX: 300,
    stimPosY:   0,
    stimSize: "50px monospace"
};

const versionNumber = getVersionNumber(vpNum, 4)
if (versionNumber === 1) {
    prms.respKeysNumber = ["S", "K", 27];
    prms.respKeysLetter = ["S", "K", 27];
    respText = "<h4 align='center'>Odd = S    Even = K</h4>" +
               "<h4 align='center'>Vowel = S    Consonant = K</h4>";
} else if (versionNumber === 2) {
    prms.respKeysNumber = ["S", "K", 27];
    prms.respKeysLetter = ["K", "S", 27];
    respText = "<h4 align='center'>Odd = S    Even = K</h4>" +
               "<h4 align='center'>Consonant = S    Vowel = K</h4>";
} else if (versionNumber === 3) {
    prms.respKeysNumber = ["K", "S", 27];
    prms.respKeysLetter = ["K", "S", 27];
    respText = "<h4 align='center'>Even = S    Odd = K</h4>" +
               "<h4 align='center'>Vowel = S    Consonant = K</h4>";
} else if (versionNumber === 4) {
    prms.respKeysNumber = ["K", "S", 27];
    prms.respKeysLetter = ["S", "K", 27];
    respText = "<h4 align='center'>Even = S    Odd = K</h4>" +
               "<h4 align='center'>Consonant = S    Vowel = K</h4>";
}

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
    respText + 
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

function drawStimulus(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle    = "black"
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.font         = prms.stimSize;

    switch (args["position"]) {
        case "left":
            ctx.fillText(args["stimulus"], -prms.stimPosX, prms.stimPosY);
            break;
        case "right":
            ctx.fillText(args["stimulus"],  prms.stimPosX, prms.stimPosY);
            break;
    }
}

const stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeysNumber,
    func: drawStimulus,
    func_args:[ 
        { 
            "stimulus": jsPsych.timelineVariable("stimulus"), 
            "position": jsPsych.timelineVariable("position"),
        }, 
    ],
    data: {
        stim: "SimonLetterNumber",
        stimulus: jsPsych.timelineVariable('stimulus'), 
        type: jsPsych.timelineVariable('type'), 
        category: jsPsych.timelineVariable('category'), 
        position: jsPsych.timelineVariable('position'), 
        cong: jsPsych.timelineVariable('cong'), 
        corrResp: jsPsych.timelineVariable('corrResp') 
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
        trial.stimulus = blockFeedbackTxt_de({stim: "SimonLetterNumber"});
    },
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables:[
        { stimulus: "odd",       type: "number", category: "odd",        position: "left",   cong: "cong",    corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "left",   cong: "incong",  corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "left",   cong: "cong",    corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "left",   cong: "incong",  corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "left",   cong: "cong",    corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "left",   cong: "incong",  corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "left",   cong: "cong",    corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "left",   cong: "incong",  corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "right",  cong: "incong",  corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "right",  cong: "cong",    corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "right",  cong: "incong",  corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "right",  cong: "cong",    corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "right",  cong: "incong",  corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "right",  cong: "cong",    corrResp: prms.respKeysNumber[1] },        
        { stimulus: "odd",       type: "number", category: "odd",        position: "right",  cong: "incong",  corrResp: prms.respKeysNumber[0] },        
        { stimulus: "even",      type: "number", category: "even",       position: "right",  cong: "cong",    corrResp: prms.respKeysNumber[1] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "left",   cong: "cong",    corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "left",   cong: "incong",  corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "left",   cong: "cong",    corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "left",   cong: "incong",  corrResp: prms.respKeysLetter[0] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "left",   cong: "cong",    corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "left",   cong: "incong",  corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "left",   cong: "cong",    corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "left",   cong: "incong",  corrResp: prms.respKeysLetter[1] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "right",  cong: "cong",    corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "right",  cong: "incong",  corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "right",  cong: "cong",    corrResp: prms.respKeysLetter[0] },        
        { stimulus: "vowel",     type: "letter", category: "vowel",      position: "right",  cong: "incong",  corrResp: prms.respKeysLetter[0] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "right",  cong: "cong",    corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "right",  cong: "incong",  corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "right",  cong: "cong",    corrResp: prms.respKeysLetter[1] },        
        { stimulus: "consonant", type: "letter", category: "consonant",  position: "right",  cong: "incong",  corrResp: prms.respKeysLetter[1] },        
   ],
    sample:{
        type:"with-replacement"
    }
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
    exp.push(resize_de);
    // exp.push(vpInfoForm_de);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.sample.size = (blk === 0) ? prms.nTrlsP/32 : prms.nTrlsE/32;
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
        saveData("/Common/write_data.php", filename, rows = {stim: "SimonLetterNumber"}); 
    }
});

