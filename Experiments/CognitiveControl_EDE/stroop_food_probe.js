/*
 Standard Stroop Task followed by food stimulus followed by dot probe task:
 VPs respond to the colour of the text, not the word meaning using key responses ("D" and "J").

Replication of Experiment 1 in Kleiman, Trope, & Amodio (2016). Cognitive control modulates
attention to food cues: Support for the control readiness model of self-control
*/

///////////////// Exp Parameters ////////////////////////////////////////////
var numBlks = 2;
var fixDur = 750;
var fbDur = 750;
var waitDur = 1000;
var stroopDur = 5000;
var picDur = 500;
var dotProbeDur = 5000;
var iti = 1500;
var sfi = 1000;  // stroop --> food pic interval
var tooFast = 200;
var tooSlow = 1500;
var fbTxt = ["Richtig", "Falsch", "Zu langsam", "Zu schnell"];
var nTrl = 1;
var nBlk = 1;
var respMapping = Math.round(Math.random()) + 1;
var respKeys = [];
var instTxt = "";

var images = [];
for (var i = 1; i <=50; i++){
  images = images.concat("img/healthy/h" + i + ".bmp")
}
for (var i = 1; i <=50; i++){
  images = images.concat("img/unhealthy/u" + i + ".bmp")
}

if (respMapping === 1) {
  respKeys = ["D", "K", 27];
  instTxt = "<H1 align='center'>Willkommen:</H1><br><br>" +
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> Im Folgenden werden Sie im Wechsel zwei Aufgaben bearbeiten. Bitte führen Sie das Experiment am Computer und in einer ruhigen Umgebung durch. </H2>" + 
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> Zunächst fixieren Sie dazu das Kreuz, welches am Anfang eines Durchgangs erscheint. </H2>" + 
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> In der ersten Aufgabe reagieren Sie möglichst schnell und möglichst fehlerfrei auf die <u>Schriftfarbe</u> und ignorieren die Wortbedeutung. Drücken Sie bei <span style='color:red'> roter </span> <u>Schriftfarbe</u> mit dem Zeigefinger Ihrer linken Hand die Taste D und bei <span style='color:blue'> blauer </span> <u>Schriftfarbe</u> mit dem Zeigefinger Ihrer rechten Hand die Taste K. </H2>" +
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> In der zweiten Aufgabe reagieren Sie möglichst schnell und möglichst fehlerfrei auf die Seite, auf der ein schwarzer Punkt auftaucht. Sehen Sie den Punkt links, drücken Sie mit Ihrer linken Hand die Taste D, sehen Sie den Punkt rechts, drücken Sie mit Ihrer rechten Hand die Taste K. </H2><br><br>" +
    "<H1 align='center'> <span style='color:red'>XXX</span>/LINKS = D" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style='color:blue'>XXX</span>/RECHTS = K </H1><br><br>" + 
    "<H1 align='center'> Drücken Sie eine beliebige Taste, um mit dem Übungsblock zu beginnen. </H1>";
} else {
  respKeys = ["K", "D", 27];
  instTxt = "<H1 align='center'>Willkommen:</H1><br><br>" +
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> Im Folgenden werden Sie im Wechsel zwei Aufgaben bearbeiten. Bitte führen Sie das Experiment am Computer und in einer ruhigen Umgebung durch. </H2>" + 
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> Zunächst fixieren Sie dazu das Kreuz, welches am Anfang eines Durchgangs erscheint. </H2>" + 
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> In der ersten Aufgabe reagieren Sie möglichst schnell und möglichst fehlerfrei auf die <u>Schriftfarbe</u> und ignorieren die Wortbedeutung. Drücken Sie bei <span style='color:blue'> blauer </span> <u>Schriftfarbe</u> mit dem Zeigefinger Ihrer linken Hand die Taste D und bei <span style='color:red'> roter </span> <u>Schriftfarbe</u> mit dem Zeigefinger Ihrer rechten Hand die Taste K. </H2>" +
    "<H2 align='left' style= 'margin-left: 20%; margin-right:20%'> In der zweiten Aufgabe reagieren Sie möglichst schnell und möglichst fehlerfrei auf die Seite, auf der ein schwarzer Punkt auftaucht. Sehen Sie den Punkt links, drücken Sie mit Ihrer linken Hand die Taste D, sehen Sie den Punkt rechts, drücken Sie mit Ihrer rechten Hand die Taste K. </H2><br><br>" +
    "<H1 align='center'> <span style='color:blue'>XXX</span>/LINKS = D" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style='color:red'>XXX</span>/RECHTS = K </H1><br><br>" + 
    "<H1 align='center'> Drücken Sie eine beliebige Taste, um mit dem Übungsblock zu beginnen. </H1>";
}


if (respMapping === 1) {
  respMappingTxt = "<H1 align='center'> <span style='color:red'>XXX</span>/LINKS = D" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style='color:blue'>XXX</span>/RECHTS = K </H1><br><br>" + 
    "<H1 align='center'> Drücken Sie eine beliebige Taste, um mit dem Experiment zu beginnen. </H1>";
} else {
  respMappingTxt = "<H1 align='center'> <span style='color:blue'>XXX</span>/LINKS = D" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "<span style='color:red'>XXX</span>/RECHTS = K </H1><br><br>" + 
    "<H1 align='center'> Drücken Sie eine beliebige Taste, um mit dem Experiment zu beginnen. </H1>";
}

///////////////// Functions //////////////////////////////////////////////////
function recordScreenSize() {
  "use strict";
  jsPsych.data.addProperties({
    screenHeight: screen.height,
    screenWidth: screen.width,
    aspectRatio: screen.width / screen.height
  });
}

var screenInfo = {
  type: "call-function",
  func: recordScreenSize,
  timing_post_trial: 50
};

//////////////////// Text Instructions ////////////////////////////////////////
var welcome = {
  type: "text",
  text: "<H1>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren.</H1>",
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

var respMappingScreen = {
  type: "text",
  text: respMappingTxt,
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
  } else if ($("#divers").is(":checked")) {
    gender = "divers";
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
    window.alert("Bitte beantworten Sie alle Fragen!");
    return false;
  }

}
var vpInfoForm = {
  type: "html",
  url: "vpInfoForm.html",
  cont_btn: "start",
  check_fn: checkVpInfoForm
};

/////////////////////////////// EDE Questionnaire /////////////////////////////
function checkEDEform1() {
  "use strict";
  var q1, q2, q3, q4, q5, q6; 
  q1 = $('input[name=q1]:checked', '#edeq1').val();
  q2 = $('input[name=q2]:checked', '#edeq1').val();
  q3 = $('input[name=q3]:checked', '#edeq1').val();
  q4 = $('input[name=q4]:checked', '#edeq1').val();
  q5 = $('input[name=q5]:checked', '#edeq1').val();
  q6 = $('input[name=q6]:checked', '#edeq1').val();
  if (q1 == null) {
    window.alert("Bitte beantworten Sie Q1!");
    return;
  }
  if (q2 == null) {
    window.alert("Bitte beantworten Sie Q2!");
    return;
  }
  if (q3 == null) {
    window.alert("Bitte beantworten Sie Q3!");
    return;
  }
  if (q4 == null) {
    window.alert("Bitte beantworten Sie Q4!");
    return;
  }
  if (q5 == null) {
    window.alert("Bitte beantworten Sie Q5!");
    return;
  }
  if (q6 == null) {
    window.alert("Bitte beantworten Sie Q6!");
    return;
  }
  jsPsych.data.addProperties({q1:q1, q2:q2, q3:q3, q4:q4, q5:q5, q6:q6});
  return true;
}

var ede1 = {
  type: "html",
  url: "edeq1.html",
  cont_btn: "start",
  check_fn: checkEDEform1
};

function checkEDEform2() {
  "use strict";
  var q7, q8, q9, q10, q11, q12;
  q7 = $('input[name=q7]:checked', '#edeq2').val();
  q8 = $('input[name=q8]:checked', '#edeq2').val();
  q9 = $('input[name=q9]:checked', '#edeq2').val();
  q10 = $('input[name=q10]:checked', '#edeq2').val();
  q11 = $('input[name=q11]:checked', '#edeq2').val();
  q12 = $('input[name=q12]:checked', '#edeq2').val();
  if (q7 == null) {
    window.alert("Bitte beantworten Sie Q7!");
    return;
  }
  if (q8 == null) {
    window.alert("Bitte beantworten Sie Q8!");
    return;
  }
  if (q9 == null) {
    window.alert("Bitte beantworten Sie Q9!");
    return;
  }
  if (q10 == null) {
    window.alert("Bitte beantworten Sie Q10!");
    return;
  }
  if (q11 == null) {
    window.alert("Bitte beantworten Sie Q11!");
    return;
  }
  if (q12 == null) {
    window.alert("Bitte beantworten Sie Q12!");
    return;
  }
  jsPsych.data.addProperties({q7:q7, q8:q8, q9:q9, q10:q10, q11:q11, q12:q12});
  return true;
}

var ede2 = {
  type: "html",
  url: "edeq2.html",
  cont_btn: "start",
  check_fn: checkEDEform2
};


function checkEDEform3() {
  "use strict";
  var q19, q20, q21, q22, q23;
  q19 = $('input[name=q19]:checked', '#edeq3').val();
  q20 = $('input[name=q20]:checked', '#edeq3').val();
  q21 = $('input[name=q21]:checked', '#edeq3').val();
  q22 = $('input[name=q22]:checked', '#edeq3').val();
  q23 = $('input[name=q23]:checked', '#edeq3').val();
  if (q19 == null) {
    window.alert("Bitte beantworten Sie Q19!");
    return;
  }
  if (q20 == null) {
    window.alert("Bitte beantworten Sie Q20!");
    return;
  }
  if (q21 == null) {
    window.alert("Bitte beantworten Sie Q21!");
    return;
  }
  if (q22 == null) {
    window.alert("Bitte beantworten Sie Q22!");
    return;
  }
  if (q23 == null) {
    window.alert("Bitte beantworten Sie Q23!");
    return;
  }
  jsPsych.data.addProperties({q19:q19, q20:q20, q21:q21, q22:q22, q23:q23});
  return true;
}

var ede3 = {
  type: "html",
  url: "edeq3.html",
  cont_btn: "start",
  check_fn: checkEDEform3
};

function checkEDEform4() {
  "use strict";
  var q24, q25, q26, q27, q28;
  q24 = $('input[name=q24]:checked', '#edeq4').val();
  q25 = $('input[name=q25]:checked', '#edeq4').val();
  q26 = $('input[name=q26]:checked', '#edeq4').val();
  q27 = $('input[name=q27]:checked', '#edeq4').val();
  q28 = $('input[name=q28]:checked', '#edeq4').val();
  if (q24 == null) {
    window.alert("Bitte beantworten Sie Q18!");
    return;
  }
  if (q25 == null) {
    window.alert("Bitte beantworten Sie Q19!");
    return;
  }
  if (q26 == null) {
    window.alert("Bitte beantworten Sie Q20!");
    return;
  }
  if (q27 == null) {
    window.alert("Bitte beantworten Sie Q21!");
    return;
  }
  if (q28 == null) {
    window.alert("Bitte beantworten Sie Q22!");
    return;
  }
  jsPsych.data.addProperties({q24:q24, q25:q25, q26:q26, q27:q27, q28:q28});
  return true;
}

var ede4 = {
  type: "html",
  url: "edeq4.html",
  cont_btn: "start",
  check_fn: checkEDEform4
};

/////////////////////////////// Resize ////////////////////////////////////////
var resize = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt: "<p> Klicken Sie und ziehen Sie die untere Ecke, bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat. </p>",
  pixels_per_unit: 175
};

/////////////////////////////// Stimuli ///////////////////////////////////////
var fix = {
  stimulus: '<div class="fix">+</div>',
  is_html: true,
  timing_stim: fixDur,
  timing_response: fixDur,
  timing_post_trial: 0,
  response_ends_trial: false,
  data: {stim: "fixation"}
};

function combinations() {
  "use strict";
  var combs = [];
  for (var i = 0; i < 4; i++) {      // 4 stroop type stimuli
    for (var j = 0; j < 2; j++) {    // 2 healthy pic locations
      for (var k = 0; k < 2; k++) {  // 2 probe locations
        combs.push([i, j, k]);
      }
    }
  }
  return combs;
}

var word = [
  {
    stimulus: "rot",
    type: "text",
    text: "<h1 style='color:red'>rot</h1>",
    timing_response: stroopDur,
    timing_post_trial: sfi,
    response_ends_trial: true,
    data: {stim: "stroop", comp: "comp", stim_location:"centre", corrResp: respKeys[0]}
  }, {
    stimulus: "blau",
    type: "text",
    text: "<h1 style='color:red'>blau</h1>",
    timing_response: stroopDur,
    timing_post_trial: sfi,
    response_ends_trial: true,
    data: {stim: "stroop", comp: "incomp", stim_location:"centre", corrResp: respKeys[0]}
  }, {
    stimulus: "blau",
    type: "text",
    text: "<h1 style='color:blue'>blau</h1>",
    timing_response: stroopDur,
    timing_post_trial: sfi,
    response_ends_trial: true,
    data: {stim: "stroop", comp: "comp", stim_location:"centre", corrResp: respKeys[1]}
  }, {
    stimulus: "rot",
    type: "text",
    text: "<h1 style='color:blue'>rot</h1>",
    timing_response: stroopDur,
    timing_post_trial: sfi,
    response_ends_trial: true,
    data: {stim: "stroop", comp: "incomp", stim_location:"centre", corrResp: respKeys[1]}
  }
];

var probe = [
  {
    stimulus: '<div class="probe_left"></div>',
    is_html: true,
    timing_stim: dotProbeDur,
    timing_post_trial: 1000,
    response_ends_trial: true,
    data: {stim: "probe", comp: "comp", location:"left", corrResp: "D"}
  }, {
    stimulus: '<div class="probe_right"></div>',
    is_html: true,
    timing_stim: dotProbeDur,
    timing_post_trial: 1000,
    response_ends_trial: true,
    data: {stim: "probe", comp: "comp", location: "right", corrResp: "K"}
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
  if ((data.stim === "stroop") || (data.stim === "probe")) {
    if (data.key_press === corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
      corrCode = 1;
    } else if (data.key_press !== corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
      corrCode = 2;
    } else if (data.rt === -1) {
      corrCode = 3;
    } else if (data.rt <= tooFast) {
      corrCode = 4;
    }
  }
  jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: nBlk, trialNum: nTrl});
  if (data.stim === "probe") {
    nTrl += 1;
  }
  if (data.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function blockFeedbackTxt() {
  "use strict";

  var dat_stroop = jsPsych.data.get().filter({stim: "stroop", blockNum: nBlk});
  var nTotal_stroop = dat_stroop.count();
  var nError_stroop = dat_stroop.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
  dat_stroop = jsPsych.data.get().filter({stim: "stroop", corrCode: 1});
  var meanRT_stroop = dat_stroop.select("rt").mean();

  var dat_probe = jsPsych.data.get().filter({stim: "probe", blockNum: nBlk});
  var nTotal_probe = dat_probe.count();
  var nError_probe = dat_probe.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
  dat_probe = jsPsych.data.get().filter({stim: "probe", corrCode: 1});
  var meanRT_probe = dat_probe.select("rt").mean();

  var fbTxtBlk = "<h1>Block: " + nBlk + " von " + numBlks + "</h1>" +
    "<h1>Mittlere Reaktionszeit Task 1: " + Math.round(meanRT_stroop) + " ms </h1>" +
    "<h1>Fehlerrate Task 1: " + Math.round((nError_stroop / nTotal_stroop) * 100) + " %</h1>" +
    "<h1>Mittlere Reaktionszeit Task 2: " + Math.round(meanRT_probe) + " ms </h1>" +
    "<h1>Fehlerrate Task 2: " + Math.round((nError_probe / nTotal_probe) * 100) + " %</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
  nBlk += 1;
  return fbTxtBlk;
}


var blkFb = {
  type: "text",
  timing_post_trial: waitDur,
  text: blockFeedbackTxt
};

var debrief = {
  type: "text",
  timing_post_trial: waitDur,
  text: "<h1>Das Experiment ist beendet. Drücken Sie eine beliebige Taste, um das Experiment zu beenden.</h1>" +
  "<h1>Vielen Dank für Ihre Teilnahme!</h1>"  
};

/////////////////////////////// Save Data /////////////////////////////////////
var saveData = function () {
  "use strict";
  var fname = "stroop_food_probe_" + vpNum + ".csv";
  var data = jsPsych.data.get().filter([{stim: "stroop"}, {stim: "picture"}, {stim: "probe"}]).csv();
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

  var blk, trl, numTrls, stim, block, leftnum, rightnum, leftimg, rightimg, stim_location;

  var exp = [];
 
  exp.push(welcome);
  exp.push(resize);
  exp.push(vpInfoForm);
  exp.push(screenInfo);
  exp.push(instructions);
  for (blk = 0; blk < numBlks; blk += 1) {

    stim = [];

    var combs = combinations();
    var combs_all = combs;
    for (var i = 0; i < 9; i++) {
       combs_all = combs_all.concat(combs);
    }
    combs_all = combs_all.sort(() => Math.random() - 0.5);

    if (blk == 0) {
      numTrls = 3;
    } else {
      numTrls = combs_all.length;
    }

    for (trl = 0; trl < numTrls; trl += 1) {

      // Each "trial" consists of the following parts
      // 1) Fixation cross
      stim.push(fix);

      // 2) Stroop task
      stim.push(word[combs_all[trl][0]]);

      // 3) Food pictures to the left AND right locations
      // Here, location codes the location of the unhealthy image
      leftnum = Math.ceil(Math.random() * 50);
      rightnum = Math.ceil(Math.random() * 50);

      if (combs_all[trl][1] == 0) {
        leftimg = "img/healthy/h" + leftnum + ".bmp";
        rightimg = "img/unhealthy/u" + rightnum + ".bmp";
        stim_location = "right";
      } else {
        leftimg = "img/unhealthy/u" + leftnum + ".bmp";
        rightimg = "img/healthy/h" + rightnum + ".bmp";
        stim_location = "left";
      }

      var picture = {
        stimulus: '<div class="picleft"> <img src=' + leftimg + '></div><div class="picleft"> <img src=' + rightimg + '></div>',
        is_html: true,
        type: 'single-stim',
        timing_response: picDur,
        timing_post_trial: 0,
        response_ends_trial: false,
        data: {stim: "picture", leftimg: leftimg, rightimg:rightimg, stim_location: stim_location}
      };
      stim.push(picture);

      // Probe dot to the left or the right screen location
      var probe;
      if (combs_all[trl][2] === 0) {
        probe = {
          stimulus: '<div class="probe_left"></div>',
          is_html: true,
          timing_stim: dotProbeDur,
          timing_post_trial: 1000,
          response_ends_trial: true,
          data: {stim: "probe", leftimg: leftimg, rightimg:rightimg, stim_location:"left", corrResp: "D"}
        };
      } else if (combs_all[trl][2] === 1) {
        probe = {
          stimulus: '<div class="probe_right"></div>',
          is_html: true,
          timing_stim: dotProbeDur,
          timing_post_trial: 1000,
          response_ends_trial: true,
          data: {stim: "probe", leftimg: leftimg, rightimg:rightimg, stim_location: "right", corrResp: "K"}
        };
      }
      stim.push(probe);
    }
    block = {
      type: "single-stim",
      choices: respKeys,
      on_finish: codeTrial,
      timeline: stim
    };
    exp.push(block);
    exp.push(blkFb);
    if (blk == 0) {
      exp.push(respMappingScreen);
    }
  }
  exp.push(ede1);
  exp.push(ede2);
  exp.push(ede3);
  exp.push(ede4);
  exp.push(save);
  exp.push(debrief);
  return exp;
}
var EXP = genExpSeq();

/////////////////////////////// Run Experiment ////////////////////////////////
jsPsych.init({
  timeline: EXP,
  fullscreen: true,
  show_progress_bar: false,
  preload_images: images,
  show_preload_progress_bar: true,
});

