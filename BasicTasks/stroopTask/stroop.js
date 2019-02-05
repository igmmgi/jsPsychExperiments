/*
 Standard Stroop Task:
 VPs respond to the colour of the text, not the word meaning
 using key responses ("D" and "J").
*/

///////////////// Exp Parameters ////////////////////////////////////////////
var numTrls = 4;
var numBlks = 1;
var fixDur = 750;
var fbDur = 750;
var waitDur = 1000;
var iti = 1000;
var tooFast = 150;
var tooSlow = 1500;
var fbTxt = ["Correct", "Error", "Too Slow", "Too Fast"];
var nTrl = 1;
var nBlk = 1;

function randomMapping() {
    "use strict";
    var t = new Date().getSeconds();
    if (t % 2 === 0) {
        return 1;
    } else {
        return 2;
    }
}

var mapping = randomMapping();
var respKeys = [];
var instTxt = "";
if (mapping === 1) {
    respKeys = ["D", "J", 27];
    instTxt = "<H1 align='left'>Welcome:</H1>" +
            "<H2 align='left'>Respond to the colour of the font </H2><br>" +
            "<H2 align='left'> <span style='color:red'> red </span> = 'D' key:</H2>" +
            "<H2 align='left'> <span style='color:blue'> blue </span> = 'J' key:</H2>";
} else {
    respKeys = ["J", "D", 27];
    instTxt = "<H1 align='left'>Welcome:</H1>" +
            "<H2 align='left'>Respond to the colour of the font </H2><br>" +
            "<H2 align='left'> <span style='color:blue'> blue </span> = 'D' key:</H2>" +
            "<H2 align='left'> <span style='color:red'> red </span> = 'J' key:</H2>";
}

//////////////////// Text Instructions ////////////////////////////////////////
var welcome = {
    type: "text",
    text: "<H1>Welcome. Press any key to continue.</H1>",
    on_finish: function () {
        "use strict";
        jsPsych.data.addProperties({date: new Date()});
    }
};

var instructions = {
    type: "text",
    text: instTxt,
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

var word = [
    {
        type: "text",
        text: "<h1 style='color:red'>red</h1>",
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "stroop", comp: "comp", corrResp: respKeys[0]}
    }, {
        type: "text",
        text: "<h1 style='color:red'>blue</h1>",
        timing_response: tooSlow,
        timing_post_trial: 0,
        data: {stim: "stroop", comp: "incomp", corrResp: respKeys[0]}
    }, {
        type: "text",
        text: "<h1 style='color:blue'>blue</h1>",
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "stroop", comp: "comp", corrResp: respKeys[1]}
    }, {
        type: "text",
        text: "<h1 style='color:blue'>red</h1>",
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {stim: "stroop", comp: "incomp", corrResp: respKeys[1]}
    }
];

function trialFeedbackTxt() {
    "use strict";
    var data = jsPsych.data.get().last(1).values()[0];
    return "<H1>" + fbTxt[data.corrCode - 1] + "</H1>";
}

var trlFb = {
    stimulus: trialFeedbackTxt,
    is_html: true,
    timing_stim: fbDur,
    timing_response: fbDur,
    timing_post_trial: iti,
    response_ends_trial: false,
    data: {stim: "feedback"}
};

function codeTrial() {
    "use strict";
    var data = jsPsych.data.get().last(1).values()[0];
    var corrCode = 0;
    var corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);
    if (data.stim === "stroop") {
        if (data.key_press === corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
            corrCode = 1;
        } else if (data.key_press !== corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
            corrCode = 2;
        } else if (data.rt === -1) {
            corrCode = 3;
        } else if (data.rt <= tooFast) {
            corrCode = 4;
        }
        jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: nBlk, trialNum: nTrl});
        nTrl += 1;
    }
    if (data.key_press === 27) {
        jsPsych.endExperiment();
    }
}

function blockFeedbackTxt() {
    "use strict";
    var dat = jsPsych.data.get().filter({stim: "stroop", blockNum: nBlk});
    var nTotal = dat.count();
    var nError = dat.select("corrCode").values.filter(function (x) {return x !== 1;}).length;
    dat = jsPsych.data.get().filter({stim: "stroop", corrCode: 1});
    var meanRT = dat.select("rt").mean();
    var blockFbTxt = "<H1>Block: " + nBlk + "</H1>" +
            "<H1>Mean RT: " + Math.round(meanRT) + " ms </H1>" +
            "<H1>Error Rate: " + Math.round((nError / nTotal) * 100) + " %</H1>" +
            "<H2>Press any key to continue the experiment!</H2>";
    nBlk += 1;
    return blockFbTxt;
}

var blkFb = {
    type: "text",
    timing_post_trial: waitDur,
    text: blockFeedbackTxt
};

var debrief = {
    type: "text",
    timing_post_trial: waitDur,
    text: "<H1>The experiment is finished.</H1>" +
            "<H2>Press any key to end the experiment!</H2>"
};

/////////////////////////////// Save Data /////////////////////////////////////
var saveData = function () {
    "use strict";
    var fname = "stroop_" + vpNum + ".csv";
    var data = jsPsych.data.get().filter({stim: "stroop"}).csv();
    $.ajax({
        type: "post",
        cache: false,
        url: "write_data.php",
        data: {filename: fname, filedata: data}
    });
};

var save = {
    type: "call-function",
    func: saveData,
    timing_post_trial: 50
};

//////////////////// Generate experiment sequence /////////////////////////////
function genExpSeq() {
    "use strict";

    var ii;
    var jj;
    var exp = [];
    var stim;
    var words;
    var block;

    exp.push(welcome);
    exp.push(vpInfoForm);
    exp.push(instructions);
    for (ii = 0; ii < numBlks; ii += 1) {
        stim = [];
        words = jsPsych.randomization.repeat(word, numTrls / (word.length));
        for (jj = 0; jj < words.length; jj += 1) {
            stim.push(fix);
            stim.push(words[jj]);
            stim.push(trlFb);
        }
        block = {
            type: "single-stim",
            choices: respKeys,
            on_finish: codeTrial,
            timeline: stim
        };
        exp.push(block);
        exp.push(save);
        exp.push(blkFb);
    }
    exp.push(debrief);
    return exp;
}
var EXP = genExpSeq();

/////////////////////////////// Run Experiment ////////////////////////////////
jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: true
});

