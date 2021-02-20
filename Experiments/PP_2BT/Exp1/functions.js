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

function checkVpInfoForm() {
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

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Returns a random int number between min (inclusive) and max (exclusive)
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

// Adapted from https://github.com/hauselin/lab_exp/blob/master/libraries/utils.js
function generate_formatted_html({
  text,
  width = '900px',
  color = 'black',
  align = 'center',
  fontsize = 20,
  xypos = [0, 0],
  lineheight = 1.5,
  bold = true,
  italics = false,
  underline = false,
  position = 'relative',
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
  if (bold) {
    div = '<b>' + div + '</b>';
  }
  if (italics) {
    div = '<i>' + div + '</i>';
  }
  if (underline) {
    div = '<u>' + div + '</u>';
  }
  return div;
}

function repeatArray(a, n) {
  return new Array(n).fill(a).flat();
}

////////////////////////////////////////////////////////////////////////
//                          Common Variables                          //
////////////////////////////////////////////////////////////////////////
const welcome = {
  type: 'html-keyboard-response',
  stimulus: '<h1>Willkommen. Drücke eine beliebige Taste, um fortzufahren!</h1>',
  on_finish: function () {
    'use strict';
    jsPsych.data.addProperties({ date: Date() });
  },
};

const resize = {
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

const vpInfoForm = {
  type: 'external-html',
  url: '/Common/vpInfoForm_de.html',
  cont_btn: 'start',
  check_fn: checkVpInfoForm,
};

const debrief = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Das Experiment ist beendet.</h1>' + '<h2>Drücke eine beliebige Taste, um das Experiment zu beenden!</h2>',
  response_ends_trial: true,
};
