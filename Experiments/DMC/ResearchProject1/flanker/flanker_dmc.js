// Modified version of a Flanker Task:
// VPs respond to the central letter within a 5-letter array (e.g., HHHHH, SSHSS)
//  whilst ignoring the surrounding letters using left and right key-presses ("D" and "J").
// 50% of trials involve the presentation of the "flankers" 
//  first followed by the presentation of the "target" HH HH -> H
// 50% of trials involve the presentation of the "target" 
//  first followed by the presentation of the "flankers" H -> HH HH

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
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 4,  // number of trials in first block (practice)
    nTrlsE: 4,  // number of trials in subsequent blocks 
    nBlks: 1,
    fixDur: 750,
    flankDur: 100,
    fbDur: 750,
    waitDur: 1000,
    iti: 1000,
    tooFast: 150,
    tooSlow: 1500,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respMapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
    respKeys: [],
    respDir: []
};

if (prms.respMapping === 1) {
    prms.respKeys = ["D", "J", 27];
    prms.respDir  = ["left", "right", 27];
} else {
    prms.respKeys = ["J", "D", 27];
    prms.respDir  = ["right", "left", 27];
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
let respText = ""
if (prms.respMapping === 1) {
    respText = "<h4 align='left'><b>H</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>S</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
} else {
    respText = "<h4 align='left'><b>S</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>H</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
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
    timing_post_trial: prms.waitDur,
};


const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: 
    "<h2 align='center'>Aufgabe:</h2><br>" +
    "<h4 align='left'>Dieses Experiment besteht aus insgesamt 13 Blöcken. Jeder Block besteht wiederum aus mehreren Durchgängen.</h4>" +
    "<h4 align='left'>Sie werden in jedem Durchgang des Experiments eine Reihe von 5 Buchstaben sehen (z.B. HHHHH, HHSHH).</h4>" +
    "<h4 align='left'>Bitte reagieren Sie immer auf den Buchstaben in der Mitte, die anderen Buchstaben sollen Sie möglichst ignorieren.</h4>" +
    respText +
    "<h4 align='left'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h4>" +
    "<h4 align='left'>Nach jedem Tastendruck erhalten Sie die Rückmeldung, ob Ihre Antwort <b>richtig</b> oder <b>falsch</b> war.</h4>" +
    "<h4 align='left'>Am Ende jedes Blocks haben Sie die Möglichkeit eine kleine Pause zu machen.</h4><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: prms.waitDur
};

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
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation
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


function drawFlanker(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "50px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(args["text"], 0, 0); 
}

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


const flanker_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, prms.flankDur, prms.flankDur*2],
    clear_screen: [0, 1, 1],
    func: [drawFlanker, drawFlanker, drawFlanker],
    func_args:[
        {"text": jsPsych.timelineVariable("flanker1")},
        {"text": jsPsych.timelineVariable("flanker2")},
        {"text": jsPsych.timelineVariable("flanker3")}
    ],
    data: {
        stim: "flanker",
        flanker: jsPsych.timelineVariable('flanker'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        flanker_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { flanker: "HHH", flanker1: " H ", flanker2: "H H", flanker3: " ", comp: "comp",   order: "TF", corrResp: prms.respKeys[0] },
        { flanker: "SSS", flanker1: " S ", flanker2: "S S", flanker3: " ", comp: "comp",   order: "TF", corrResp: prms.respKeys[1] },
        { flanker: "SHS", flanker1: " H ", flanker2: "S S", flanker3: " ", comp: "incomp", order: "TF", corrResp: prms.respKeys[1] },
        { flanker: "HSH", flanker1: " S ", flanker2: "H H", flanker3: " ", comp: "incomp", order: "TF", corrResp: prms.respKeys[0] },
        { flanker: "HHH", flanker1: "H H", flanker2: " H ", flanker3: " ", comp: "comp",   order: "FT", corrResp: prms.respKeys[1] },
        { flanker: "SSS", flanker1: "S S", flanker2: " S ", flanker3: " ", comp: "comp",   order: "FT", corrResp: prms.respKeys[0] },
        { flanker: "HSH", flanker1: "H H", flanker2: " S ", flanker3: " ", comp: "incomp", order: "FT", corrResp: prms.respKeys[0] },
        { flanker: "SHS", flanker1: "S S", flanker2: " H ", flanker3: " ", comp: "incomp", order: "FT", corrResp: prms.respKeys[1] },
    ],
    randomize_order:true,
};


const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>XXX@XXX</h2>" +
    "<h1>Code:" + randomString + "</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>"
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true,
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
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

    //exp.push(fullscreen_on);
    //exp.push(welcome_de);
    //exp.push(vpInfoForm);
    //exp.push(task_instructions1);
    //exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.repetitions = (blk === 0) ? (prms.nTrlsP/4) : (prms.nTrlsE/4);
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
        saveData("/Common/write_data.php", filename, rows = {stim: "flanker"}); 
    }
});

