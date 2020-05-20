// B.Sc. Project DMC SimonWord
// ResearchProject 2.2
// Simon task with word stimuli presented
// to the left and right screen location. VPs
// should respond with left and right key-presses according
// to 1) living/non-liveing or 2) small/large

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(200, 200, 200, 1)";
const canvas_size = [960, 720];
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
    nTrlsP: 80,  // number of trials in first block (practice)
    nTrlsE: 80,  // number of trials in subsequent blocks 
    nBlks: 2,
    fixDur: 500,
    fbDur: [500, 1000, 1000, 1000],
    cueDur: 500,
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
    prms.respKeysLife = ["S", "K", 27];
    prms.respKeysSize = ["S", "K", 27];
    respText = "<h4 align='center'>Leben: Living = S    Dead = K</h4>" +
               "<h4 align='center'>Große: Small = S    Large  = K</h4>";
} else if (versionNumber === 2) {
    prms.respKeysLife = ["S", "K", 27];
    prms.respKeysSize = ["K", "S", 27];
    respText = "<h4 align='center'>Leben: Living = S    Non-living = K</h4>" +
               "<h4 align='center'>Große: Large = S    Small = K</h4>";
} else if (versionNumber === 3) {
    prms.respKeysLife = ["K", "S", 27];
    prms.respKeysSize = ["K", "S", 27];
    respText = "<h4 align='center'>Leben: Non-Living = S    Living = K</h4>" +
               "<h4 align='center'>Große: Large = S    Small = K</h4>";
} else if (versionNumber === 4) {
    prms.respKeysLife = ["K", "S", 27];
    prms.respKeysSize = ["S", "K", 27];
    respText = "<h4 align='center'>Leben: Non-Living = S    Living = K</h4>" +
               "<h4 align='center'>Große: Small = S    Large = K</h4>";
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

function drawWordCue(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = prms.stimSize;
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(args["cue"], 0, 0);
}

const word_cue = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.cueDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawWordCue,
    func_args:[ { "cue": jsPsych.timelineVariable("cue") } ],
};

function drawWord(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.fillStyle    = "black"
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.font         = prms.stimSize;

    switch (args["position"]) {
        case "left":
            ctx.fillText(args["word"], -prms.stimPosX, prms.stimPosY);
            ctx.fillText(args["cue"], 0, 0);
            break;
        case "right":
            ctx.fillText(args["word"], prms.stimPosX, prms.stimPosY);
            ctx.fillText(args["cue"], 0, 0);
            break;
    }
}

const word_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeysSize,
    func: drawWord,
    func_args:[ 
        { 
            "word": jsPsych.timelineVariable("word"), 
            "position": jsPsych.timelineVariable("position"),
            "cue": jsPsych.timelineVariable("cue"), 
        }, 
    ],
    data: {
        stim: "SimonWord",
        cue: jsPsych.timelineVariable('cue'), 
        word: jsPsych.timelineVariable('word'), 
        size: jsPsych.timelineVariable('size'), 
        life: jsPsych.timelineVariable('life'), 
        position: jsPsych.timelineVariable('position'), 
        cong: jsPsych.timelineVariable('cong'), 
        corrResp: jsPsych.timelineVariable('corrResp') 
    },
    on_finish: function() { codeTrial(); }
};


function drawFeedback() {
    "use strict"
    console.log("here")
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
        trial.stimulus = blockFeedbackTxt_de({stim: "SimonWord"});
    },
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        word_cue,
        word_stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables:[
        { cue: "LEBEN", word: "Spinne",   size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Ameise",   size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Mücke",    size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Schnecke", size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Wespe",    size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Spinne",   size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Ameise",   size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Mücke",    size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Schnecke", size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Wespe",    size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "GROßE", word: "Spinne",   size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Ameise",   size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Mücke",    size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Schnecke", size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Wespe",    size: "small", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Spinne",   size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Ameise",   size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Mücke",    size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Schnecke", size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Wespe",    size: "small", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "LEBEN", word: "Kamel",    size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Delfin",   size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Elefant",  size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Zebra",    size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Esel",     size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Kamel",    size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Delfin",   size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Elefant",  size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Zebra",    size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Esel",     size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysLife[0]},        
        { cue: "GROßE", word: "Kamel",    size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Delfin",   size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Elefant",  size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Zebra",    size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Esel",     size: "large", life: "living",    position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Kamel",    size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Delfin",   size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Elefant",  size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Zebra",    size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Esel",     size: "large", life: "living",    position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "LEBEN", word: "Armband",  size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Socke",    size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Perle",    size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Zigarre",  size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Löffel",   size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Armband",  size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Socke",    size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Perle",    size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Zigarre",  size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Löffel",   size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "GROßE", word: "Armband",  size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Socke",    size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Perle",    size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Zigarre",  size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Löffel",   size: "small", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Armband",  size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Socke",    size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Perle",    size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Zigarre",  size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "GROßE", word: "Löffel",   size: "small", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[0]},        
        { cue: "LEBEN", word: "Eisberg",  size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Sofa",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Tuba",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Asteroid", size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Kanu",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Eisberg",  size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Sofa",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Tuba",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Asteroid", size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Kanu",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysLife[1]},        
        { cue: "GROßE", word: "Eisberg",  size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Sofa",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Tuba",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Asteroid", size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Kanu",     size: "large", life: "nonliving", position: "left",  cong: "cong",   corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Eisberg",  size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Sofa",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Tuba",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Asteroid", size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
        { cue: "GROßE", word: "Kanu",     size: "large", life: "nonliving", position: "right", cong: "incong", corrResp: prms.respKeysSize[1]},        
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
    exp.push(resize_de);
    exp.push(vpInfoForm_de);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? prms.nTrlsP/32 : prms.nTrlsE/32;
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
        saveData("/Common/write_data.php", filename, rows = {stim: "SimonWord"}); 
    }
});

