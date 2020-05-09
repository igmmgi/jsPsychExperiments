// Modified version of a Simon Task:
// VPs respond to the colour of a centrally presented square whilst ignoring
//  laterally presented squares. The laterally presented squares 
// VPs respond to the colour of the presented stimulus using
// left and right key responses.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = "rgba(200, 200, 200, 1)";
const cs = [960, 720];
const cb = "5px solid black";

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
    nTrlsE: 8,  // number of trials in subsequent blocks 
    nBlks: 2,   
    fixDur: 750,
    simonDur: 100,
    fbDur: 750,
    waitDur: 1000,
    iti: 1000,
    tooFast: 150,
    tooSlow: 1500,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respMapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
    respColours: ["red", "green"],
    respKeys: [],
};

if (prms.respMapping === 1) {
    prms.respKeys = ["D", "J", 27];
} else {
    prms.respKeys = ["J", "D", 27];
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
let respText = ""
if (prms.respMapping === 1) {
    respText = "<h4 align='left'><b>BLUE</b> drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>RED</b>  drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
} else {
    respText = "<h4 align='left'><b>RED</b>  drücken Sie die <b>Taste D</b> (linken Zeigefinger).</h4>" +
               "<h4 align='left'><b>BLUE</b> drücken Sie die <b>Taste J</b> (rechten Zeigefinger).</h4>";
}

const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "<h2 align='center'>Willkommen bei unserem Experiment:</h2><br>" +
              "<h3 align='center'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
              "<h3 align='center'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
              "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: prms.waitDur,
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
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
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
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


function drawSimon(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    // left rectangle
    ctx.fillStyle = args["sl"];
    ctx.fillRect(-100, -25, 50, 50);

    // middle rectangle
    ctx.fillStyle = args["sm"];
    ctx.fillRect(-25, -25, 50, 50);

    // right rectangle
    ctx.fillStyle = args["sr"];
    ctx.fillRect(50, -25, 50, 50);

}

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.fbDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: blockFeedbackTxt,
    response_ends_trial: true,
    data: { stim: "block_feedback" },
};


const simon_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, 100, 200, 300],
    func: [drawSimon, drawSimon, drawSimon, drawSimon],
    func_args:[
        {"sl": jsPsych.timelineVariable("sl1"), "sm": jsPsych.timelineVariable("sm1"), "sr": jsPsych.timelineVariable("sr1")},
        {"sl": jsPsych.timelineVariable("sl2"), "sm": jsPsych.timelineVariable("sm2"), "sr": jsPsych.timelineVariable("sr2")},
        {"sl": jsPsych.timelineVariable("sl3"), "sm": jsPsych.timelineVariable("sm3"), "sr": jsPsych.timelineVariable("sr3")},
        {"sl": jsPsych.timelineVariable("sl4"), "sm": jsPsych.timelineVariable("sm4"), "sr": jsPsych.timelineVariable("sr4")}
    ],
    data: {
        stim: "simon",
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        simon_stimulus,
        trial_feedback
    ],
    timeline_variables:[
        { sl1: "black", sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[0], sr2: cc, sl3: cc,      sm3: cc, sr3: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "comp",    order: "BA", corrResp: prms.respKeys[0] },
        { sl1: "black", sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[1], sr2: cc, sl3: cc,      sm3: cc, srr: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "incomp",  order: "BA", corrResp: prms.respKeys[1] },
        { sl1: cc,      sm1: cc, sr1: "black", sl2: cc, sm2: prms.respColours[0], sr2: cc, sl3: cc,      sm3: cc, sr3: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "incomp",  order: "BA", corrResp: prms.respKeys[0] },
        { sl1: cc,      sm1: cc, sr1: "black", sl2: cc, sm2: prms.respColours[1], sr2: cc, sl3: cc,      sm3: cc, sr3: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "comp",    order: "BA", corrResp: prms.respKeys[1] },
        { sl1: cc,      sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[0], sr2: cc, sl3: "black", sm3: cc, sr3: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "comp",    order: "AB", corrResp: prms.respKeys[0] },
        { sl1: cc,      sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[1], sr2: cc, sl3: "black", sm3: cc, sr3: cc,      sl4: cc, sm4: cc, sr4: cc, comp: "incomp",  order: "AB", corrResp: prms.respKeys[1] },
        { sl1: cc,      sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[0], sr2: cc, sl3: cc,      sm3: cc, sr3: "black", sl4: cc, sm4: cc, sr4: cc, comp: "incomp",  order: "AB", corrResp: prms.respKeys[0] },
        { sl1: cc,      sm1: cc, sr1: cc,      sl2: cc, sm2: prms.respColours[1], sr2: cc, sl3: cc,      sm3: cc, sr3: "black", sl4: cc, sm4: cc, sr4: cc, comp: "comp",    order: "AB", corrResp: prms.respKeys[1] },
    ],
    randomize_order:true,
};


const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
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
        min_width:cs[0],
        min_height:cs[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "flanker"}); 
    }
});

