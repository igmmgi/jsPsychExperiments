// Standard Flanker Task with horizontal arrow and letter stimulus arrays:
// VPs respond to the direction of the central arrow/letter whilst
// ignoring the surrounding arrows/letters using key responses ("X" and "M").
// Feedback provided during the practice block

function randomMapping(){
    return Math.round(Math.random()) + 1;
}

function stimMapping(mapping){
    if (mapping===1){
        return ["H", "S"];
    } else {
        return ["S", "H"];
    }
}

function keyMapping(mapping){
    if (mapping===1){
        return ["C", "M", "C", "M", 27];
    } else {
        return ["C", "M", "M", "C", 27];
    }
}

/////////////////// Exp Parameters ////////////////////////////////////////////
var numTrlsP = 16;
var numTrlsE = 96;
var numBlks = 11;
var fixDur = 500;
var fbDur = 1000;
var waitDur = 1000;
var iti = 500;
var tooFast = 150;
var tooSlow = 1500;
var mapping = randomMapping();
var stimMap = stimMapping(mapping);
var respKeys = keyMapping(mapping);
var fbTxt = ["Richtig", "Falsch", "Zu langsam", "Zu schnell"];
var nTrl = 1;
var nBlk = 1;

//////////////////// Text Instructions ////////////////////////////////////////
var welcome = {
    type: "text",
    text: "<h1>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h1>",
    on_finish: function(){
        jsPsych.data.addProperties({date: new Date(), mapping: mapping});
    }
};

var instructions = {
    type: "text",
    text: "<h1 align='left'>Aufgabe:</h1>" +
    "<h2 align='left'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils oder des mittleren Buchstabe:</h2><br>" +
    "<h2 align='center'>LINKS oder " + stimMap[0] + " = C Taste</h2>" +
    "<h2 align='center'>RECHTS oder " + stimMap[1] + " = M Taste</h2>" +
    "<h2 align='left'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: waitDur
};

/////////////////////////////// VP Info ///////////////////////////////////////
function genVpNum() {
    "use strict";
    var num = new Date();
    num = num.getTime();
    return num;
}
var vpNum = genVpNum();

function checkVpInfoForm() {
    // get age, gender, handedness and VPs consent
    "use strict";
    var age = document.getElementById("age").value;

    var gender = "";
    if ($("#male").is(":checked")) {
        gender = "male";
    } else if ($("#female").is(":checked")) {
        gender = "female";
    }

    var hand = "";
    if ($("#left").is(":checked")) {
        hand = "left";
    } else if ($("#right").is(":checked")) {
        hand = "right";
    }

    var consent = false;
    if ($("#consent_checkbox").is(":checked")) {
        consent = true;
    }

    if (consent && age !== "" && gender !== "" && hand !== "") {
        jsPsych.data.addProperties({vpNum: vpNum, age: age, gender: gender, handedness: hand});
        return true;
    } else {
        window.alert("Please answer all questions and click the consent box to continue!");
        return false;
    }

}
var vpInfoForm = {
    type: "html",
    url: "vpInfoForm.html",
    cont_btn: "start",
    check_fn: checkVpInfoForm
};

/////////////////////////////// Stimuli ///////////////////////////////////////
var fix = {
    stimulus: "<p>&#10010</p>",
    is_html: true,
    timing_stim: fixDur,
    timing_response: fixDur,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "fixation"}
};

var flanker= [
    {
        stimulus: "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: left'></div>" +
        "<div class='left' style='float: right'></div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:"arrow", respDir: "left", comp: "comp", corrResp: respKeys[0]}
    },
    {
        stimulus: "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: left'></div>" +
        "<div class='right' style='float: right'></div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        data: {stim: "flanker", type:"arrow", respDir: "left", comp: "incomp", corrResp: respKeys[0]}
    },
    {
        stimulus: "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='right' style='float: right'></div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:"arrow", respDir: "right", comp: "comp", corrResp: respKeys[1]}
    },
    {
        stimulus: "<div class='left' style='float: left'></div>" +
        "<div class='right' style='float: left'></div>" +
        "<div class='left'  style='float: right'></div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:"arrow", respDir: "right", comp: 'incomp', corrResp: respKeys[1]}
    },
    {
        stimulus: "<div style='font-size:3.0cm'>H H H</div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:"letter", respDir: "left", comp: "comp", corrResp: respKeys[2]}
    },
    {
        stimulus: "<div style='font-size:3.0cm'>S H S</div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        data: {stim: "flanker", type:"letter", respDir: "left", comp: "incomp", corrResp: respKeys[2]}
    },
    {
        stimulus: "<div style='font-size:3.0cm'>S S S</div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:"letter", respDir: "right", comp: "comp", corrResp: respKeys[3]}
    },
    {
        stimulus: '<div style="font-size:3.0cm">H S H</div>',
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "flanker", type:'letter', respDir: "right", comp: 'incomp', corrResp: respKeys[3]}
    }
];

var trlFbPrac = {
    type: "single-stim",
    stimulus: trialFeedbackTxt,
    is_html: true,
    timing_stim: fbDur,
    timing_response: fbDur,
    timing_post_trial: iti,
    response_ends_trial: false,
    data: {stim: "feedbackPrac"}
};

var trlFbExp = {
    type: "single-stim",
    stimulus: "",
    is_html: false,
    timing_stim: iti,
    timing_response: iti,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "feedbackExp"}
};

function trialFeedbackTxt(){
    var data = jsPsych.data.get().last(1).values()[0];
    return "<h1>" + fbTxt[data.corrCode-1] + "</h1>";
}

function codeTrial(){
    var data = jsPsych.data.get().last(1).values()[0];
    var corrCode = 0;
    var corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);
    if (data.stim === "flanker"){
        if (data.key_press === corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
            corrCode = 1;
        } else if (data.key_press !== corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
            corrCode = 2;
        } else if (data.rt === -1){
            corrCode = 3;
        } else if (data.rt <= tooFast){
            corrCode = 4;
        }
        jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: nBlk, trialNum: nTrl});
        nTrl++;
    }
    if (data.key_press === 27){
        jsPsych.endExperiment();
    }
}

function blockFeedbackTxt(){
    var dat = jsPsych.data.get().filter({stim:"flanker", blockNum: nBlk});
    var nTotal = dat.count();
    var nError = dat.select("corrCode").values.filter(function(x){return x !== 1}).length;
    dat = jsPsych.data.get().filter({stim:"flanker", corrCode: 1});
    var meanRT = dat.select("rt").mean();
    var fbTxt = "<h1>Block: " + nBlk + " von " + numBlks + "</h1>" +
        "<h1>Mittlere Reaktionszeit: " + Math.round(meanRT) + " ms </h1>" +
        "<h1>Fehlerrate: " + Math.round((nError/nTotal)*100) + " %</h1>" +
        "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
    nBlk++;
    return fbTxt;
}

var blkFb = {
    type: "text",
    timing_post_trial: waitDur,
    text: blockFeedbackTxt
};

var debrief= {
    type: "text",
    timing_post_trial: waitDur,
    text: "<h1>Das Experiment ist beendet.</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>"
};

/////////////////////////////// Save Data /////////////////////////////////////

var writeDataFile = function(){
    var fname = "flanker_" + vpNum + ".csv";
    var data  = jsPsych.data.get().filter({stim: "flanker"}).csv();
    $.ajax({
        type:'post',
        cache: false,
        url: 'write_data.php',
        data: {filename: fname, filedata: data}
    });
}

var saveData = {
    type: 'call-function',
    func: writeDataFile,
    timing_post_trial: 50
};

var writeRandomCode = function(code){
  var fname = "flanker.csv";
  $.ajax({
      type:"post",
      cache: false,
      url: "write_code.php",
      data: {filename: fname, filedata: code}
   });
};

function randomString(length) {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random()*(chars.length - 1))];
  writeRandomCode(result);
  return result;
}

var alphaNum = {
    type: "text",
    text: "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>ian.mackenzie@uni-tuebingen.de</h2>" +
    "<h1>Code:' + randomString(16) + '</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>"
};

//////////////////// Generate experiment sequence /////////////////////////////
function genExpSeq(){

    var blk;
    var trl;
    var flankers;
    var stim;
    var exp = [];
    var block;

    exp.push(welcome);
    exp.push(vpInfoForm);
    exp.push(instructions);
    for (blk = 0; blk < numBlks; blk++){
        stim = [];
        if (blk === 0) {
            flankers = jsPsych.randomization.repeat(flanker, numTrlsP/(flanker.length));
        } else {
            flankers = jsPsych.randomization.repeat(flanker, numTrlsE/(flanker.length));
        }
        for (trl = 0; trl < flankers.length; trl++){
            stim.push(fix);
            stim.push(flankers[trl]);
            if (blk === 0) {
                stim.push(trlFbPrac);
            } else {
                stim.push(trlFbExp);
            }
        }
        block = {
            type: "single-stim",
            choices: respKeys,
            on_finish: codeTrial,
            timeline: stim
        };
        exp.push(block);
        exp.push(blkFb);
    }
    exp.push(saveData);
    exp.push(alphaNum);
    exp.push(debrief);
    return exp;
}
EXP = genExpSeq();

/////////////////////////////// Run Experiment ////////////////////////////////
jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false
});

