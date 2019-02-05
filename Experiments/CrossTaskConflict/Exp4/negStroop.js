// Standard Stroop combined with a negation language task (not left vs now left)
// VPs respond to font colour in the stroop task and phrase meaning in the
// negation task using the "C" and "M" keys.

function randomMapping(){
  return Math.round(Math.random()) + 1;
}

function colourMapping(mapping){
  if (mapping==1){
    return ["ROT", "BLAU"]
  } else {
    return ["BLAU", "ROT"]
  }
}

function keyMapping(mapping){
  if (mapping==1){
    return ["C", "M", 27]
  } else {
    return ["M", "C", 27]
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
var colours = colourMapping(mapping);
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

var vpInfoForm = {
  type: 'html',
  url: 'vpInfoForm.html',
  cont_btn: "start",
  check_fn: checkVpInfoForm,
};

var instructions = {
  type: "text",
  text: "<h1 align='left'>Aufgabe:</h1>" +
    "<h2 align='left'>Reagieren Sie auf die Schriftfarbe bzw. auf die Bedeutung des Texts:</h2><br>" +
    "<h2 align='center'>" + colours[0] + " bzw. Links = C Taste<h2>" +
    "<h2 align='center'>" + colours[1] + " bzw. Rechts = M Taste<h2>" +
    "<h2 align='left'>Drücken Sie eine beliebige Taste, um fortzufahren!<h2>",
  timing_post_trial: waitDur
};

/////////////////////// VP Info ///////////////////////////////////////////////
function genVpNum(){
  var num = new Date();
  var num = num.getTime();
  return num;
}
var vpNum = genVpNum();

function checkVpInfoForm(){
  var age = document.getElementById("age").value;

  if ($('#male').is(':checked')){
    var gender = "male";
  } else if ($('#female').is(':checked')){
    var gender = "female";
  } else {
    var gender = "";
  }

  if ($('#left').is(':checked')){
    var hand= "left";
  } else if ($('#right').is(':checked')){
    var hand= "right";
  } else {
    var hand= "";
  }

  if ($('#consent_checkbox').is(':checked')) {
    var consent = true;
  }
  else {
    var consent = false;
  }

  if (consent && age != "" && gender != "" && hand != ""){
    jsPsych.data.addProperties({vpNum: vpNum, age: age, gender: gender, handedness: hand})
    return true;
  } else {
    alert("Bitte beantworten Sie alle Fragen!");
    return false;
  }
}

/////////////////////////////// Stimuli ///////////////////////////////////////
var fix = {
  stimulus: '<p>&#10010</p>',
  is_html: true,
  timing_stim: fixDur,
  timing_response: fixDur,
  timing_post_trial: 0,
  response_ends_trial: false,
  data: {stim: 'fixation'},
}

var stroop = [
  {
    stimulus: '<h1 style="color:red">rot</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'stroop', comp: 'comp', corrResp: respKeys[0]}
  },
  {
    stimulus: '<h1 style="color:red">blau</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'stroop', comp: 'incomp', corrResp: respKeys[0]}
  },
  {
    stimulus: '<h1 style="color:blue">blau</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'stroop', comp: 'comp', corrResp: respKeys[1]}
  },
  {
    stimulus: '<h1 style="color:blue">rot</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'stroop', comp: 'incomp', corrResp: respKeys[1]}
  }
];

var word = [
  {
    stimulus: '<h1>jetzt links</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'affneg', comp: 'comp', corrResp: 'C'}
  },
  {
    stimulus: '<h1>jetzt rechts</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'affneg', comp: 'comp', corrResp: 'M'}
  },
  {
    stimulus: '<h1>nicht links</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'affneg', comp: 'incomp', corrResp: 'M'}
  },
  {
    stimulus: '<h1>nicht rechts</h1>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: 'negStroop', task: 'affneg', comp: 'incomp', corrResp: 'C'}
  }
];

var negStroop = stroop.concat(word);

var trlFbPrac = {
  type: 'single-stim',
  stimulus: trialFeedbackTxt,
  is_html: true,
  timing_stim: fbDur,
  timing_response: fbDur,
  timing_post_trial: iti,
  response_ends_trial: false,
  data: {stim: 'feedbackPrac'}
};

var trlFbExp = {
  type: 'single-stim',
  stimulus: '',
  is_html: false,
  timing_stim: iti,
  timing_response: iti,
  timing_post_trial: 0,
  response_ends_trial: false,
  data: {stim: 'feedbackExp'}
};

function trialFeedbackTxt(){
  var data = jsPsych.data.get().last(1).values()[0];
  return "<h1>" + fbTxt[data.corrCode-1] + "</h1>";
};

function codeTrial(){
  var data = jsPsych.data.get().last(1).values()[0];
  var corrCode = 0;
  var corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);
  if (data.stim == "negStroop"){
    if (data.key_press == corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
      corrCode = 1;
    } else if (data.key_press != corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
      corrCode = 2;
    } else if (data.rt == -1){
      corrCode = 3;
    } else if (data.rt <= tooFast){
      corrCode = 4;
    }
    jsPsych.data.addDataToLastTrial({corrCode: corrCode, blockNum: nBlk, trialNum: nTrl});
    nTrl++;
  }
  if (data.key_press == 27){
    jsPsych.endExperiment()
  }
};

function blockFeedbackTxt(){
  var dat = jsPsych.data.get().filter({stim:"negStroop", blockNum: nBlk});
  var nTotal = dat.count();
  var nError = dat.select("corrCode").values.filter(function(x){return x !=1}).length;
  var dat = jsPsych.data.get().filter({stim:"negStroop", corrCode: 1});
  var meanRT = dat.select("rt").mean();
  var fbTxt = "<h1>Block: " + nBlk + " von " + numBlks + "</h1>" +
    "<h1>Mittlere Reaktionszeit: " + Math.round(meanRT) + " ms </h1>" +
    "<h1>Fehlerrate: " + Math.round((nError/nTotal)*100) + " %</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
  nBlk++;
  return fbTxt
};

var blkFb = {
  type: "text",
  timing_post_trial: waitDur,
  text: blockFeedbackTxt
};

var debrief= {
  type: "text",
  timing_post_trial: waitDur,
  text: "<h1>Das Experiment ist beendet.</h1>" +
        "<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>",
};

/////////////////////////////// Save Data /////////////////////////////////////
var writeDataFile = function(){
  var fname = "negStroop_" + vpNum + ".csv";
  var data  = jsPsych.data.get().filter({stim: "negStroop"}).csv();
   $.ajax({
      type:'post',
      cache: false,
      url: 'write_data.php',
      data: {filename: fname, filedata: data}
   });
};

var saveData = {
  type: 'call-function',
  func: writeDataFile,
  timing_post_trial: 50
};

var writeRandomCode = function(code){
  var fname = "negStroop.csv";
  $.ajax({
      type:'post',
      cache: false,
      url: 'write_code.php',
      data: {filename: fname, filedata: code}
   });
};

var genRandomCode = {
  type: 'call-function',
  func: writeRandomCode,
  timeing_post_trial: 50
};

function randomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random()*(chars.length - 1))];
  writeRandomCode(result);
  return result;
}

var alphaNum = {
  type: 'text',
  text: '<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>' +
    '<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>' +
    '<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>' +
    '<h2>ian.mackenzie@uni.tuebingen.de<h2>' +
    '<h1>Code:' + randomString(16) + '</h1>' +
    '<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h3>'
};

//////////////////// Generate experiment sequence /////////////////////////////
function genExpSeq(){

  var blk;
  var trl;
  var negStroops;
  var stim;
  var exp = [];
  var block;

  exp.push(welcome);
  exp.push(vpInfoForm);
  exp.push(instructions);
  for (blk = 0; blk < numBlks; blk++){
    stim = [];
    if (blk == 0) {
      negStroops = jsPsych.randomization.repeat(negStroop, numTrlsP/(negStroop.length));
    } else {
      negStroops = jsPsych.randomization.repeat(negStroop, numTrlsE/(negStroop.length));
    }
    for (trl = 0; trl < negStroops.length; trl++){
      stim.push(fix);
      stim.push(negStroops[trl]);
      if (blk == 0) {
        stim.push(trlFbPrac);
      } else {
        stim.push(trlFbExp);
      }
    }
    block = {
      type: 'single-stim',
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
  return exp
}
EXP = genExpSeq();

/////////////////////////////// Run Experiment ////////////////////////////////
jsPsych.init({
  timeline: EXP,
  fullscreen: true,
  show_progress_bar: false
});

