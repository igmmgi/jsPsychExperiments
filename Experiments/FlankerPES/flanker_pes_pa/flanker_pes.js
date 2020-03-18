/*
 Standard Flanker Task with 80% correct feedback, 20% false feedback
 VPs respond to the direction of the central arrow whilst ignoring the 
 surrounding arrows using key responses ("C" and "M"). 
 */

///////////////// Exp Parameters ////////////////////////////////////////////
var numTrlsP = 48;
var numTrlsE = 96;
var numBlks = 9;
var flankerDur = 150;
var fbDur = 150;
var waitDur = 750;
var iti = 1150;
var tooFast = 50;
var tooSlow = 1000;
var fbTxt = ["Richtig", "Falsch", "Zu langsam", "Zu schnell"];
var nTrl = 1;
var nBlk = 1;
var respMapping = Math.round(Math.random()) + 1;

var respKeys, respDir;
if (respMapping === 1) {
  respKeys = ["X", "M", 27];
  respDir = ["left", "right", 27];
} else {
  respKeys = ["M", "X", 27];
  respDir = ["right", "left", 27];
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

function generateFlankerLetters() {
  "use strict";
  var vowel = ["A", "E", "O", "U"];
  var consonant = ["B", "H", "T", "S"];
  var letters = vowel.concat(consonant);
  letters = letters.sort(() => Math.random() - 0.5);
  var letterCombs = [];
  var i, j;
  var removed;
  for (i = 0; i < letters.length; i++) {
    removed = false;
    for (j = 0; j < letters.length; j++) {
      if (letters[i] === letters[j]) { // e.g., no AAAAAA, EEEEEE
        continue;
      }
      if (!removed) {  // need to remove 1 incompatible combination
        if ((vowel.includes(letters[i])) && (consonant.includes(letters[j]))) {
          removed = true;
          continue;
        } else if ((vowel.includes(letters[j])) && (consonant.includes(letters[i]))) {
          removed = true;
          continue;
        }
      }
      letterCombs.push(letters[i] + letters[i] + letters[j] + letters[i] + letters[i]);
    }
  }
  return letterCombs;
}

//////////////////// Text Instructions ////////////////////////////////////////
var welcome = {
  type: "text",
  text: "<h1>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h1>",
  on_finish: function () {
    jsPsych.data.addProperties({ date: new Date(), respMapping: respMapping });
  }
};

if (respMapping === 1) {
  respText = "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Vokal (A, E, O oder U)</b> drücken Sie die <b>Taste X</b> (mit dem Zeigefinger der linken Hand)</h2>" +
             "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Konsonanten (B, H, T oder S)</b> drücken Sie die <b>Taste m</b> (mit dem Zeigefinger der rechten Hand) </h2>";
} else {
  respText = "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Konsonanten (B, H, T oder S)</b> drücken Sie die <b>Taste X</b> (mit dem Zeigefinger der linken Hand)</h2>" +
             "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Vokal (A, E, O oder U)</b> drücken Sie die <b>Taste M</b> (mit dem Zeigefinger der rechten Hand) </h2>";

}

var instructions1 = {
  type: "text",
  text: "<h2 align='left'>Willkommen bei unserem Experiment:</h2><br>" +
  "<h3 align='left'>Diese Studie wird im Rahmen einer Projektarbeit durchgeführt.</h3>" +
  "<h3 align='left'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
  "<h2 align='left'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
  timing_post_trial: waitDur
};

var instructions2 = {
  type: "text",
  text: "<h2 align='left'>Aufgabe:</h2><br>" +
  "<h3 align='left'>Dieses Experiment besteht aus insgesamt 9 Blöcken. Jeder Block besteht wiederum aus mehreren Durchgängen.</h3>" +
  "<h3 align='left'>Sie werden in jedem Durchgang des Experiments eine Reihe von 5 Buchstaben sehen (z.B. BBHBB, AABAA). Bitte reagieren Sie immer auf den Buchstaben in der Mitte, die anderen Buchstaben sollen Sie möglichst ignorieren.</h3>" +
  respText +
  "<h3 align='left'>Bitte reagieren Sie so schnell und korrekt wie möglich</h3>" +
  "<h3 align='left'>Nach jedem Tastendruck erhalten Sie die Rückmeldung, ob Ihre Antwort <b>richtig</b> oder <b>falsch</b> war. </h3>" +
  "<h3 align='left'>Am Ende jedes Blocks haben Sie die Möglichkeit eine kleine Pause zu machen. Sie erhalten zusätzlich eine Rückmeldung zu Ihrer Gesamtleistung während dieses Blocks.</h3><br>" +
  "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
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
    jsPsych.data.addProperties({ vpNum: vpNum, age: age, gender: gender, handedness: hand });
    return true;
  } else {
    window.alert("Bitte antworten Sie alle Fragen und klicken Sie auf die Zustimmungs box um weiter zumachen!");
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
var resize = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt: "<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>",
  pixels_per_unit: 150
};

function generate_flankers(letters) {
  var flanker = [];
  var vowels = ["A", "E", "O", "U"];
  for (var i = 0; i < letters.length; i++) {
    var stim = "<div class='flank'>" + letters[i] + "</div>";
    var rd, rk;
    if (vowels.includes(letters[i][2])) {
      rd = respDir[0];
      rk = respKeys[0];
    } else {
      rd = respDir[1];
      rk = respKeys[1];
    }

    if (["A", "E", "O", "U"].includes(letters[i][0]) && ["A", "E", "O", "U"].includes(letters[i][2])) {
      comp = "comp";
    } else if (["B", "H", "T", "S"].includes(letters[i][0]) && ["B", "H", "T", "S"].includes(letters[i][2])) {
      comp = "comp";
    } else {
      comp = "incomp";
    }

var trial_dict = {
      type: "single-stim",
      stimulus: stim,
      is_html: true,
      timing_response: flankerDur,
      timing_post_trial: 0,
      response_ends_trial: true,
      data: {
        stim: "flanker_stim",
        letterArray: letters[i],
        respDir: rd,
        comp: comp,
        corrResp: rk
      }
    };
    flanker.push(trial_dict);
  }
  return flanker;
}

var trlFb = {
  type: "single-stim",
  stimulus: trialFeedbackTxt,
  is_html: true,
  timing_stim: fbDur,
  timing_response: fbDur,
  timing_post_trial: 0,
  response_ends_trial: false,
  data: { stim: "feedback" }
};

var interTrialInterval = {
  type: "single-stim",
  stimulus: '<div class="feedback">&nbsp;</div>',
  is_html: true,
  timing_stim: iti,
  timing_response: iti,
  timing_post_trial: 0,
  response_ends_trial: false,
  data: { stim: "iti" }
};

function trialFeedbackTxt() {
  var data = jsPsych.data.get().last(1).values()[0];
  return '<div class="feedback">' + fbTxt[data.corrCodeFB - 1] + '</div>';
}

function codeTrial() {
  var data = jsPsych.data.get().last(1).values()[0];
  var corrCode = 0;
  var corrCodeFB = 0;
  var corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);

  if (data.stim === "flanker_resp") {
    if (data.key_press === corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
      corrCode = 1;
      if (nBlk > 1) {  // only give false feedback after practice blocks
        corrCodeFB = (Math.random() >= 0.75) ? 2 : 1;
      } else {
        corrCodeFB = 1;
      }
    } else if (data.key_press !== corrKeyNum && data.rt > tooFast && data.rt < tooSlow) {
      corrCode = 2;
      corrCodeFB = 2; 
    } else if (data.rt === -1) {
      corrCode = 3;
      corrCodeFB = 3;
    } else if (data.rt <= tooFast) {
      corrCode = 4;
      corrCodeFB = 4;
    }

    jsPsych.data.addDataToLastTrial({
      date: Date(),
      corrCode: corrCode,
      corrCodeFB: corrCodeFB,
      blockNum: nBlk,
      trialNum: nTrl
    });
    nTrl += 1;
  }
  if (data.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function blockFeedbackTxt() {
  "use strict";
  var dat = jsPsych.data.get().filter({ stim: "flanker_resp", blockNum: nBlk });
  var nTotal = dat.count();
  var nError = dat.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
  var errorRate = Math.round((nError / nTotal) * 100);
  
  var errorRateTxt = "<h2>&nbsp;</h2><br>";
  if (errorRate < 5) {
    errorRateTxt = "<h2><b>Bitte reagieren Sie schneller!</h2></b><br>";
  } else if (errorRate > 15) {
    errorRateTxt = "<h2><b>Bitte reagieren Sie genauer!</h2></b><br>";
  }
  
  dat = jsPsych.data.get().filter({ stim: "flanker_resp", corrCodeFB: 1 });
  var meanRT = dat.select("rt").mean();
  var fbTxtBlk = "<h1>Block: " + nBlk + " von " + numBlks + "</h1>" +
    "<h1>Mittlere Reaktionszeit: " + Math.round(meanRT) + " ms </h1>" +
    "<h1>Fehlerrate: " + errorRate + " %</h1><br>" +
    errorRateTxt + 
    "<h1>Drücken Sie eine beliebige Taste, um fortzufahren!</h1>";
  nBlk += 1;
  return fbTxtBlk;
}

var blkFb = {
  type: "text",
  timing_post_trial: waitDur,
  text: blockFeedbackTxt
};

function checkEndQuestion() {
  "use strict";
  var questionGroup = $('input[name=questionGroup]:checked', '#endQuestion').val();
  if (questionGroup == null) {
    window.alert("Bitte beantworten Sie die Frage!");
    return;
  }
  jsPsych.data.addProperties({questionGroup:questionGroup});
  return true;
}

var endQuestion = {
  type: "html",
  url: "endQuestion.html",
  cont_btn: "start",
  check_fn: checkEndQuestion
};

var debrief = {
  type: "text",
  timing_post_trial: waitDur,
  text: "<h1>Das Experiment ist beendet.</h1>" +
  "<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>"
};

/////////////////////////////// Save Data /////////////////////////////////////
var writeDataFile = function () {
  var fname = "flanker_pes_" + vpNum + ".csv";
  //var data = jsPsych.data.get().filter([{stim: "flanker_stim" }, {stim: "flanker_resp"}]).csv();
  var data = jsPsych.data.get().filter({stim: "flanker_resp"}).csv();
  $.ajax({
    type: "post",
    cache: false,
    url: "write_data.php",
    data: { filename: fname, filedata: data }
  });
};

var saveData = {
  type: "call-function",
  func: writeDataFile,
  timing_post_trial: 50
};

//////////////////// Generate experiment sequence /////////////////////////////
function genExpSeq() {
  "use strict";

  var letters = generateFlankerLetters();
  var flanker = generate_flankers(letters);

  var blk;
  var trl;
  var stim;
  var exp = [];
  var flankers;
  var block;
  var respInt;
  var numberTrials;

  exp.push(welcome);
  exp.push(resize);
  exp.push(vpInfoForm);
  exp.push(screenInfo);
  exp.push(instructions1);
  exp.push(instructions2);
  for (blk = 0; blk < numBlks; blk++) {

    stim = [];
    if (blk === 0) {
      flankers = jsPsych.randomization.repeat(flanker, numTrlsP / flanker.length);
      numberTrials = 16;  // to shorten experiment
    } else {
      flankers = jsPsych.randomization.repeat(flanker, numTrlsE / flanker.length);
      numberTrials = flankers.length;
    }

    for (trl = 0; trl < numberTrials; trl++) {
      
      stim.push(flankers[trl]);

      respInt = {
        type: "single-stim",
        stimulus: "<div class='flank'></div>",
        is_html: true,
        timing_response: tooSlow,
        timing_post_trial: 0,
        response_ends_trial: true,
        data: {
          stim: "flanker_resp",
          letterArray: flankers[trl].data.letterArray,
          respDir: flankers[trl].data.respDir,
          comp: flankers[trl].data.comp,
          corrResp: flankers[trl].data.corrResp
        }
      };
      stim.push(respInt);
      stim.push(trlFb);
      stim.push(interTrialInterval);
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
  exp.push(endQuestion);
  exp.push(saveData);
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

