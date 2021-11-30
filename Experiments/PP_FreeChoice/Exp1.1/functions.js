///////////////////////////////////////////////////////////////////////
//                             Functions                              //
////////////////////////////////////////////////////////////////////////
function getDirName() {
  let name = document.currentScript.src;
  let server = location.protocol + '//' + document.location.host;
  name = name.slice(server.length, name.length);
  return name.substring(0, name.lastIndexOf('/') + 1);
}

function getFileName() {
  let name = document.currentScript.src;
  return name.substring(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
}

function filterDataPavlovia(
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  if (filetype === 'csv') {
    return jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
  } else if (filetype === 'json') {
    return jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
  }
}

function getNumberOfFiles(url, datDir) {
  let numDataFiles = 0;
  $.ajax({
    url: url,
    type: 'POST',
    async: false,
    data: { dir: datDir },
  }).done(function (data) {
    numDataFiles = data;
  });
  return numDataFiles;
}

function genVpNum() {
  'use strict';
  let num = new Date();
  num = num.getTime();
  jsPsych.data.addProperties({ vpNum: num });
  return num;
}

function getComputerInfo() {
  'use strict';
  let pc_info = navigator.userAgent;
  jsPsych.data.addProperties({ pc_info: pc_info });
}

const user_interaction_data = {
  event: null,
  trial: null,
  time: null,
};

function update_user_interaction_data(data) {
  'use strict';
  user_interaction_data.event = data.event;
  user_interaction_data.trial = data.trial;
  user_interaction_data.time = data.time;
}

function reload_if_not_fullscreen() {
  'use strict';
  if (user_interaction_data.event === 'fullscreenexit') {
    window.location.reload();
  }
}

function getVersionNumber(num, numberOfVersions) {
  return (num % numberOfVersions) + 1;
}

function checkVpInfoForm_en() {
  // get age, gender, handedness and VPs consent
  'use strict';
  let age = document.getElementById('age').value;

  let gender = '';
  if ($('#male').is(':checked')) {
    gender = 'male';
  } else if ($('#female').is(':checked')) {
    gender = 'female';
  } else if ($('#divers').is(':checked')) {
    gender = 'na';
  }

  let hand = '';
  if ($('#left').is(':checked')) {
    hand = 'left';
  } else if ($('#right').is(':checked')) {
    hand = 'right';
  }

  let consent = false;
  if ($('#consent_checkbox').is(':checked')) {
    consent = true;
  }

  if (consent && age !== '' && gender !== '' && hand !== '') {
    jsPsych.data.addProperties({ age: age, gender: gender, handedness: hand });
    return true;
  } else {
    window.alert('Please answer all questions and click the consent box to continue!');
    return false;
  }
}

function checkVpInfoForm_de() {
  // get age, gender, handedness and VPs consent
  'use strict';
  let age = document.getElementById('age').value;

  let gender = '';
  if ($('#male').is(':checked')) {
    gender = 'male';
  } else if ($('#female').is(':checked')) {
    gender = 'female';
  } else if ($('#divers').is(':checked')) {
    gender = 'na';
  }

  let hand = '';
  if ($('#left').is(':checked')) {
    hand = 'left';
  } else if ($('#right').is(':checked')) {
    hand = 'right';
  }

  let consent = false;
  if ($('#consent_checkbox').is(':checked')) {
    consent = true;
  }

  if (consent && age !== '' && gender !== '' && hand !== '') {
    jsPsych.data.addProperties({ age: age, gender: gender, handedness: hand });
    return true;
  } else {
    window.alert('Bitte beantworten Sie alle Fragen!');
    return false;
  }
}

function checkVpInfoForm_de_du() {
  // get age, gender, handedness and VPs consent
  'use strict';
  let age = document.getElementById('age').value;

  let gender = '';
  if ($('#male').is(':checked')) {
    gender = 'male';
  } else if ($('#female').is(':checked')) {
    gender = 'female';
  } else if ($('#divers').is(':checked')) {
    gender = 'na';
  }

  let hand = '';
  if ($('#left').is(':checked')) {
    hand = 'left';
  } else if ($('#right').is(':checked')) {
    hand = 'right';
  }

  let consent = false;
  if ($('#consent_checkbox').is(':checked')) {
    consent = true;
  }

  if (consent && age !== '' && gender !== '' && hand !== '') {
    jsPsych.data.addProperties({ age: age, gender: gender, handedness: hand });
    return true;
  } else {
    window.alert('Bitte beantworte alle Fragen!');
    return false;
  }
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  if (dat.key_press === corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

function trialFeedbackTxt(feedback_text) {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  return '<H1>' + feedback_text[dat.corrCode - 1] + '</H1>';
}

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 1;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 1 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' of ' +
    prms.nBlks +
    '</H1><br>' +
    '<H1>Mean RT: ' +
    Math.round(dat.select('rt').mean()) +
    ' ms </H1>' +
    '<H1>Error Rate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1><br>' +
    '<H2>Press any key to continue the experiment!</H2>';
  prms.cBlk += 1;
  return blockFbTxt;
}

function blockFeedbackTxt_de(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 1;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 1 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    '<H1>Mittlere Reaktionszeit: ' +
    Math.round(dat.select('rt').mean()) +
    ' ms </H1>' +
    '<H1>Fehlerrate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1><br>' +
    '<H2>Drücken Sie eine beliebige Taste um fortzufahren!</H2>';
  prms.cBlk += 1;
  return blockFbTxt;
}

function blockFeedbackTxt_de_du(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  let nTotal = dat.count();
  let nError = dat.select('corrCode').values.filter(function (x) {
    return x !== 1;
  }).length;
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 1 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' von ' +
    prms.nBlks +
    '</H1><br>' +
    '<H1>Mittlere Reaktionszeit: ' +
    Math.round(dat.select('rt').mean()) +
    ' ms </H1>' +
    '<H1>Fehlerrate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1><br>' +
    '<H2>Drücke eine beliebige Taste, um fortzufahren!</H2>';
  prms.cBlk += 1;
  return blockFbTxt;
}

function saveData(
  url,
  filename,
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  let dat;
  if (filetype === 'csv') {
    dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
  } else if (filetype === 'json') {
    dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}

function saveInteractionData(url, filename) {
  let dat = jsPsych.data.getInteractionData().csv();
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}

function saveDataLocal(
  filename,
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  jsPsych.data
    .get()
    .filter(rows)
    .ignore(colsToIgnore)
    .localSave(filetype, filename + '.' + filetype);
}

function generateRandomString(length) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = length; i > 0; --i) {
    randomString += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return randomString;
}

function generateRandomStringWithExpName(expName, length) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = length; i > 0; --i) {
    randomString += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return expName + '_' + randomString;
}

function saveRandomCode(url, filename, code) {
  $.ajax({
    type: 'post',
    cache: false,
    url: url,
    data: { filename: filename, filedata: code },
  });
}

function recordScreenSize() {
  jsPsych.data.addProperties({
    screenHeight: screen.height,
    screenWidth: screen.width,
    aspectRatio: screen.width / screen.height,
  });
}

function loadImages(imagefiles) {
  let loadcount = 0;
  let loadtotal = imagefiles.length;
  let preloaded = false;

  // Load the images
  let loadedimages = [];
  for (let i = 0; i < imagefiles.length; i++) {
    let image = new Image();
    image.onload = function () {
      loadcount++;
      if (loadcount === loadtotal) {
        preloaded = true;
      }
    };

    // set the source and save
    image.src = imagefiles[i];
    loadedimages[i] = image;
  }

  return loadedimages;
}

// Returns a random number between min and max
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Returns a random int number between min and max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Adapted from: https://stackoverflow.com/questions/9671203/how-to-round-all-the-values-in-an-array-to-2-decimal-points
function roundArray(array) {
  let len = array.length;
  while (len--) {
    array[len] = Math.round(array[len]);
  }
  return array;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

function mean(array) {
  return array.reduce((acc, cur) => acc + cur) / array.length;
}

// Deep copy: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
const deepCopy = (inObject) => {
  let outObject, value, key;

  if (typeof inObject !== 'object' || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];
    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopy(value);
  }

  return outObject;
};

// Adapted from https://github.com/hauselin/lab_exp/blob/master/libraries/utils.js
function generate_formatted_html({
  text,
  width = '900px',
  color = 'black',
  align = 'center',
  fontsize = 20,
  xypos = [0, 0],
  lineheight = 1,
  bold = false,
  italics = false,
  underline = false,
  position = 'relative',
  preformatted = false,
} = {}) {
  let div =
    '<p style="width:' +
    width +
    '; position:' +
    position +
    '; font-size:' +
    fontsize +
    'px; text-align:' +
    align +
    '; line-height:' +
    lineheight +
    ';color:' +
    color +
    ';transform: translate(' +
    xypos[0] +
    'px,' +
    xypos[1] +
    'px)" >' +
    text +
    '</p>';
  if (bold) div = '<b>' + div + '</b>';
  if (italics) div = '<i>' + div + '</i>';
  if (underline) div = '<u>' + div + '</u>';
  if (preformatted) div = '<pre>' + div + '</pre>';

  return div;
}

function repeatArray(a, n) {
  return new Array(n).fill(a).flat();
}

////////////////////////////////////////////////////////////////////////
//                          Common Variables                          //
////////////////////////////////////////////////////////////////////////
const welcome_en = {
  type: 'html-keyboard-response',
  stimulus: '<H1>Welcome. Press any key to continue.</H1>',
  response_ends_trial: true,
  on_finish: function () {
    'use strict';
    jsPsych.data.addProperties({ date: Date() });
  },
};

const welcome_de = {
  type: 'html-keyboard-response',
  stimulus: '<h1>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h1>',
  on_finish: function () {
    'use strict';
    jsPsych.data.addProperties({ date: Date() });
  },
};

const welcome_de_du = {
  type: 'html-keyboard-response',
  stimulus: '<h1>Willkommen. Drücke eine beliebige Taste, um fortzufahren!</h1>',
  on_finish: function () {
    'use strict';
    jsPsych.data.addProperties({ date: Date() });
  },
};

const welcome_de_du_click = {
  type: 'html-button-response',
  stimulus: '<h1>Willkommen. Bitte klicke "Continue" um fortzufahren!</h1>',
  choices: ['Continue'],
  on_finish: function () {
    'use strict';
    jsPsych.data.addProperties({ date: Date() });
  },
};

const resize_en = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt:
    '<p>Resize the rectangle (click and drag bottom right corner) until it is the same size as a standard bankcard.</p>',
  pixels_per_unit: 100,
};

const resize_de = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt:
    '<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>',
  pixels_per_unit: 100,
};

const resize_de_du = {
  type: 'resize',
  item_width: 3 + 3 / 8,
  item_height: 2 + 1 / 8,
  prompt:
    '<p>Klicke und ziehe die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder dein Universitätsausweis hat.</p>',
  pixels_per_unit: 100,
};

const screenInfo = {
  type: 'call-function',
  func: recordScreenSize,
  timing_post_trial: 50,
};

const fullscreen_on = {
  type: 'fullscreen',
  fullscreen_mode: true,
};

const fullscreen_off = {
  type: 'fullscreen',
  fullscreen_mode: false,
};

const hideMouseCursor = {
  type: 'call-function',
  func: function () {
    $('body').css('cursor', 'none');
  },
};

const showMouseCursor = {
  type: 'call-function',
  func: function () {
    $('body').css('cursor', 'default');
  },
};

const vpInfoForm_en = {
  type: 'external-html',
  url: '/Common/vpInfoForm_en.html',
  cont_btn: 'start',
  check_fn: checkVpInfoForm_en,
};

const vpInfoForm_de = {
  type: 'external-html',
  url: '/Common/vpInfoForm_de.html',
  cont_btn: 'start',
  check_fn: checkVpInfoForm_de,
};

const debrief_en = {
  type: 'html-keyboard-response',
  stimulus: '<H1>The experiment is finished.</H1>' + '<H2>Press any key to end the experiment!</H2>',
  response_ends_trial: true,
};

const debrief_de = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Das Experiment ist beendet.</h1>' + '<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>',
  response_ends_trial: true,
};

const debrief_de_du = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Das Experiment ist beendet.</h1>' + '<h2>Drücke eine beliebige Taste, um das Experiment zu beenden!</h2>',
  response_ends_trial: true,
};
