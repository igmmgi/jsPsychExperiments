// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with two trial types:
// 1) Central target and flankers presented simultaneously
// 2) Central target presented 300 ms after presentation of flankers 

////////////////////////////////////////////////////////////////////////
const cc = 'rgba(200, 200, 200, 1)';
const cs = [960, 720];
const cb = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 12, // number of trials in Simon baseline blocks
  nTrlsE: 72, // number of trials in Simon baseline blocks
  nBlks: 11,
  fixDur: 500,
  fbDur: [500, 1500, 3000],
  iti: 500,
  tooSlow: 2000,
  respLetters: shuffle(['H', 'S']),
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam!'],
  simonEccentricity: 150,
  respKeys: ['Q', 'P', 27],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const respText = 
    generate_formatted_html({
        text:  prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')",
        bold: true,
        fontsize: 26}) +
    generate_formatted_html({
        text:  prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')",
        bold: true,
        fontsize: 26})


const task_instructions1 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: 
    generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br> 
        Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen. 
        Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und 
        genügend Zeit hast, um das Experiment durchzuführen. 
        Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
        Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    })
};


const task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    generate_formatted_html({
        text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
        am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
        hiwipibio@gmail.com<br><br>
        Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    })
};

const task_instructions3 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    generate_formatted_html({
        text: `Aufgabe:<br><br>
        In diesem Experiment musst du auf verschiedene Buchstaben
        so schnell und so genau wie möglich reagieren. Der Ziel-Buchstabe
        erscheint in manchen Durchgängen in der Mitte des Bildschirms (und ist
        von irrelevanten Buchstaben umgeben) und in anderen Durchgängen links oder
        rechts auf dem Bildschirm. Es gilt die folgende Zuordnung:<br><br>`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    }) +
    respText +
    generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    }) 
};


const task_instructions4 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    generate_formatted_html({
        text: `Reagiere immer nur auf den Ziel-Buchstaben. Das heißt:<br><br>
        Wenn der Ziel-Buchstabe in der Mitte erscheint, dann ignoriere die umliegenden Buchstaben.<br><br>
        Wenn nur ein Ziel-Buchstabe links oder rechts auf dem Bildschirm präsentiert wird,
        dann ignoriere die links/rechts Position auf dem Bildschirm.<br><br>
        Reagiere so schnell und so genau wie möglich!<br><br>
        Drücke eine beliebige Taste, um fortzufahren.`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    }) 
};


const task_instructions_block = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus:
    generate_formatted_html({
        text: `Wenn du bereit für den Block bist, dann positioniere
        deine Hände auf die Tastatur.<br> 
        Zeil - Buchstabe erscheint entweder in der Mitte des Bildschirms
        oder links/rechts auf dem Bildschirm. Es gilt:`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    }) +
    respText +
    generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5 
    }) 
};


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fixWidth;
  ctx.moveTo(-prms.fixSize, 0);
  ctx.lineTo(prms.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fixSize);
  ctx.lineTo(0, prms.fixSize);
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
  func: drawFixation,
};

function drawFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.corrCode], 0, 0);
}


function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  let corrCode = 0;
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  if (dat.key_press === corrKeyNum && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    keyPress: dat.key_press,
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

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
  },
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'cse_sf' });
  },
};





const randomString = generateRandomStringWithExpName("CSE_SF1", 16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde benötigst, </h3>" +
    "<h3 style='text-align:left;'>kopiere den folgenden zufällig generierten Code</h3>" +
    "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer</h3><br>" +
    "<h3 style='text-align:left;'>und deiner Universität (Bremen/Tübingen) per Email an:</h3><br>" +
    '<h2>hiwipibio@gmail.com</h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 align='left'>Drücke die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'cse_sf1' });
  },
  timing_post_trial: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  timing_post_trial: 200,
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  // exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);


  // save data
  // exp.push(save_data);
  // exp.push(save_code);

  // debrief
  // exp.push(alphaNum);
  // exp.push(debrief_de);
  // exp.push(showMouseCursor);
  // exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    exclusions: {
        min_width: cs[0],
        min_height: cs[1],
    },
});
