function genVpNum() {
    "use strict";
    let num = new Date();
    num = num.getTime();
    return num;
}

function checkVpInfoForm() {
    // get age, gender, handedness and VPs consent
    "use strict";
    let age = document.getElementById("age").value;

    let gender = "";
    if ($("#male").is(":checked")) {
        gender = "male";
    } else if ($("#female").is(":checked")) {
        gender = "female";
    }

    let hand = "";
    if ($("#left").is(":checked")) {
        hand = "left";
    } else if ($("#right").is(":checked")) {
        hand = "right";
    }

    let consent = false;
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

function codeTrial(trial_type) {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    if (dat.key_press === corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 1;
    } else if (dat.key_press !== corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 2;
    } else if (dat.rt === null) {
        corrCode = 3;
    } else if (dat.rt <= prms.tooFast) {
        corrCode = 4;
    }
    jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

function trialFeedbackTxt() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    return "<H1>" + prms.fbTxt[dat.corrCode - 1] + "</H1>";
}

function blockFeedbackTxt() {
    "use strict";
    let dat = jsPsych.data.get().filter({stim: "stroop", blockNum: prms.cBlk});
    let nTotal = dat.count();
    let nError = dat.select("corrCode").values.filter(function (x) {
        return x !== 1;
    }).length;
    dat = jsPsych.data.get().filter({stim: "stroop", corrCode: 1});
    let meanRT = dat.select("rt").mean();
    let blockFbTxt = "<H1>Block: " + prms.cBlk + " of " + prms.nBlks + "</H1>" +
        "<H1>Mean RT: " + Math.round(meanRT) + " ms </H1>" +
        "<H1>Error Rate: " + Math.round((nError / nTotal) * 100) + " %</H1>" +
        "<H2>Press any key to continue the experiment!</H2>";
    prms.cBlk += 1;
    return blockFbTxt;
}

function saveData() {
    "use strict";
    let fname = "stroop_" + vpNum + ".csv";
    let dat = jsPsych.data.get().filter({stim: "stroop"}).csv();
    $.ajax({
        type: "post",
        cache: false,
        url: "write_data.php",
        data: {filename: fname, filedata: dat}
    });
}

function genExpSeq() {
    "use strict";

    let blk;
    let exp = [];

    exp.push(welcome);
    //exp.push(vpInfoForm);
    exp.push(task_instructions);

    for (blk = 0; blk < prms.nBlks; blk += 1) {
        exp.push(trial_timeline);
        exp.push(block_feedback);  // show previous block performance 
        exp.push(save);            // save data after each block
    }
    exp.push(debrief);

    return exp;
}


