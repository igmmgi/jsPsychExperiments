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
const nFiles  = getNumberOfFiles("/Common/num_files.php", dirName + "data/");

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 80,  // number of trials in first block (practice)
    nTrlsE: 80,  // number of trials in subsequent blocks 
    nBlks: 11,
    fixDur: 400,
    fbDur: [500, 1000, 1000, 1000],
    cueDur: 400,
    iti: 400,
    tooFast:    0,
    tooSlow: 3500,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    fbSize: "30px monospace",
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respKeysLife: [],
    respKeysSize: [],
    fixWidth: 3,
    fixSize: 15,
    stimPosX: 300,
    stimPosY:   0,
    stimSize: "40px monospace"
};

const nVersion = getVersionNumber(nFiles, 2)
jsPsych.data.addProperties({nVersion: nVersion});
if (nVersion === 1) {
    prms.respKeysLife = ["Q", "P", 27];
    prms.respKeysSize = ["Q", "P", 27];
    respText = "<h2 style='text-align: center;'>Leben: Lebendig = 'Q' &emsp;&emsp; Nicht Lebendig = 'P'</h2>" +
               "<h2 style='text-align: center;'>Größe: Klein = 'Q' &emsp;&emsp; Groß = 'P'</h2><br>";
} else if (nVersion === 2) {
    prms.respKeysLife = ["P", "Q", 27];
    prms.respKeysSize = ["Q", "P", 27];
    respText = "<h2 style='text-align: center;'>Leben: Nicht Lebendig = 'Q' &emsp;&emsp; Lebendig = 'P'</h4>" +
               "<h2 style='text-align: center;'>Größe: Klein = 'Q' &emsp;&emsp; Groß = 'P'</h4><br>";
}

const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste um fortzufahren!</h2>",
};


const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: 
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: center;'>Im Folgenden musst du 2 Aufgaben bearbeiten. </h2>" +
    "<h3 style='text-align: center;'>Wenn in der Mitte 'Größe' steht, entscheide ob das Objekt groß </h2>" +
    "<h3 style='text-align: center;'>oder klein ist (in Relation zur Größe eines Fußballs).</h2>" +
    "<h3 style='text-align: center;'>Wenn in der Mitte 'Leben' steht, entscheide ob das Objekt lebendig ist oder nicht.</h3>" +
    "<h3 style='text-align: center;'>Es gilt:</h3>" +
    respText +
    "<h3 style='text-align: center;'>Bediene 'S' mit deinem linken Zeigefinger und 'K' mit deinem rechten Zeigefinger.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte reagiere so schnell und korrekt wie möglich.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste um fortzufahren!</h2>",
};

const task_reminder = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h3 style='text-align: center;'>Versuche weiterhin so schnell und so genau wie möglich zu reagieren.</h3><br>" +
              "<h3 style='text-align: center;'>Wenn du wieder bereit für den nächsten Block bist, dann positioniere</h3>" +
              "<h3 style='text-align: center;'>deine Hände wieder auf der Tastatur. Es gilt weiterhin:</h3><br>" +
               respText + 
              "<h2 style='text-align: center;'>Weiter mit beliebiger Taste!</h2>"
}



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

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);

    let rt = (dat.rt !== null) ? dat.rt : prms.tooSlow 
    let comp = ((dat.position === "left" & dat.corrResp === "Q") | (dat.position === "right" & dat.corrResp === "P")) ? "comp" : "incomp";

    if (dat.key_press === corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
        corrCode = 1;  // correct
    } else if (dat.key_press !== corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
        corrCode = 2;  // choice error
    } else if (rt === prms.tooSlow) {
        corrCode = 3; // too slow
    } else if (rt <= prms.tooFast) {
        corrCode = 4; // too false
    }

    jsPsych.data.addDataToLastTrial({date: Date(), comp: comp, rt: rt, corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
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
        corrResp: jsPsych.timelineVariable('corrResp') 
    },
    on_finish: function() { codeTrial(); }
};


function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
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
        trial.stimulus = blockFeedbackTxt_de_du({stim: "SimonWord"});
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
        { cue: "LEBEN", word: "Spinne",   size: "small", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Ameise",   size: "small", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Mücke",    size: "small", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Schnecke", size: "small", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Wespe",    size: "small", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Spinne",   size: "small", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Ameise",   size: "small", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Mücke",    size: "small", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Schnecke", size: "small", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Wespe",    size: "small", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "GRÖßE", word: "Spinne",   size: "small", life: "living",    position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Ameise",   size: "small", life: "living",    position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Mücke",    size: "small", life: "living",    position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Schnecke", size: "small", life: "living",    position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Wespe",    size: "small", life: "living",    position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Spinne",   size: "small", life: "living",    position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Ameise",   size: "small", life: "living",    position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Mücke",    size: "small", life: "living",    position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Schnecke", size: "small", life: "living",    position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Wespe",    size: "small", life: "living",    position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "LEBEN", word: "Kamel",    size: "large", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Delfin",   size: "large", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Elefant",  size: "large", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Zebra",    size: "large", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Esel",     size: "large", life: "living",    position: "left",  corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Kamel",    size: "large", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Delfin",   size: "large", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Elefant",  size: "large", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Zebra",    size: "large", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "LEBEN", word: "Esel",     size: "large", life: "living",    position: "right", corrResp: prms.respKeysLife[0]},        
        { cue: "GRÖßE", word: "Kamel",    size: "large", life: "living",    position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Delfin",   size: "large", life: "living",    position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Elefant",  size: "large", life: "living",    position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Zebra",    size: "large", life: "living",    position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Esel",     size: "large", life: "living",    position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Kamel",    size: "large", life: "living",    position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Delfin",   size: "large", life: "living",    position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Elefant",  size: "large", life: "living",    position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Zebra",    size: "large", life: "living",    position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Esel",     size: "large", life: "living",    position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "LEBEN", word: "Armband",  size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Socke",    size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Perle",    size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Zigarre",  size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Löffel",   size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Armband",  size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Socke",    size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Perle",    size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Zigarre",  size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Löffel",   size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "GRÖßE", word: "Armband",  size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Socke",    size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Perle",    size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Zigarre",  size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Löffel",   size: "small", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Armband",  size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Socke",    size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Perle",    size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Zigarre",  size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "GRÖßE", word: "Löffel",   size: "small", life: "nonliving", position: "right", corrResp: prms.respKeysSize[0]},        
        { cue: "LEBEN", word: "Eisberg",  size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Sofa",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Tuba",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Asteroid", size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Kanu",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Eisberg",  size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Sofa",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Tuba",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Asteroid", size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "LEBEN", word: "Kanu",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysLife[1]},        
        { cue: "GRÖßE", word: "Eisberg",  size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Sofa",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Tuba",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Asteroid", size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Kanu",     size: "large", life: "nonliving", position: "left",  corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Eisberg",  size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Sofa",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Tuba",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Asteroid", size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysSize[1]},        
        { cue: "GRÖßE", word: "Kanu",     size: "large", life: "nonliving", position: "right", corrResp: prms.respKeysSize[1]},        
    ],
    sample:{
        type: "fixed-repetitions",
        size: 1
    }
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus: "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde benötigst, </h3>" +
              "<h3 style='text-align:left;'>kopiere den folgenden zufällig generierten Code</h3>" +
              "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer per Email an:</h3><br>" +
              "<h2>jul (dot) wiess (at) student (dot) uni-tuebingen (dot) de</h2>" +
              "<h1>Code: " + randomString + "</h1><br>" +
              "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",  
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    
    exp.push(fullscreen_on);
    exp.push(welcome_de_du);
    exp.push(resize_de_du);
    exp.push(vpInfoForm_de);
    exp.push(hideMouseCursor);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        if (blk > 0) {
            exp.push(task_reminder)
        }
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(alphaNum);
    exp.push(fullscreen_off);
    exp.push(showMouseCursor);

    return exp;

}
const EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + genVpNum();
const code_filename = dirName + "code/" + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:canvas_size[0],
        min_height:canvas_size[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", data_filename, {stim: "SimonWord"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});

