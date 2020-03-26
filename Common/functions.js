function getDirName() {
    let name = document.currentScript.src;
    let server = location.protocol + "//" + document.location.host;
    name = name.slice(server.length, name.length);
    return name.substring(0, name.lastIndexOf("/")+1); 
}

function getFileName()   {
    let name = document.currentScript.src;
    return name.substring(name.lastIndexOf("/")+1, name.lastIndexOf("."));
}

function getNumberOfFiles(url, datDir) {
    var numDataFiles;
    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data:{"dir": datDir}
    }).done(function(data) {
        numDataFiles = data;
    });
    return numDataFiles;
}

function genVpNum() {
    "use strict";
    let num = new Date();
    num = num.getTime();
    return num;
}

function getVersionNumber(vpNumber, numberOfVersions) {
    if (vpNumber === 0) {
        vpNumber = 1;
    }
    return ((vpNumber - 1) % numberOfVersions) + 1;
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

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    if (dat.key_press === corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 1;  // correct
    } else if (dat.key_press !== corrKeyNum && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 2;  // choice error
    } else if (dat.rt === null) {
        corrCode = 3; // too slow
    } else if (dat.rt <= prms.tooFast) {
        corrCode = 4; // too false
    }
    jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

function trialFeedbackTxt(feedback_text) {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    return "<H1>" + feedback_text[dat.corrCode - 1] + "</H1>";
}

function blockFeedbackTxt(filter_options) {
    "use strict";
    let dat = jsPsych.data.get().filter({...filter_options, blockNum: prms.cBlk});
    let nError = dat.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
    dat = jsPsych.data.get().filter({...filter_options, corrCode: 1});
    let blockFbTxt = "<H1>Block: " + prms.cBlk + " of " + prms.nBlks + "</H1>" +
        "<H1>Mean RT: " + Math.round(dat.select("rt").mean()) + " ms </H1>" +
        "<H1>Error Rate: " + Math.round((nError / dat.count()) * 100) + " %</H1>" +
        "<H2>Press any key to continue the experiment!</H2>";
    prms.cBlk += 1;
    return blockFbTxt;
}

function saveData(url, datFile, datFilter = {}){
    let dat = jsPsych.data.get().filter(datFilter).csv();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: datFile, filedata: dat}));
}

function generateRandomString(length) {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";
    for (let i = length; i > 0; --i)
        randomString += chars[Math.round(Math.random()*(chars.length - 1))];
    return randomString;
}

function saveRandomCode(fname, code){
    $.ajax({
        type:"post",
        cache: false,
        url: "write_code.php",
        data: {filename: fname, filedata: code}
    });
};

function recordScreenSize() {
    jsPsych.data.addProperties({
        screenHeight: screen.height,
        screenWidth: screen.width,
        aspectRatio: screen.width / screen.height
    });
}

