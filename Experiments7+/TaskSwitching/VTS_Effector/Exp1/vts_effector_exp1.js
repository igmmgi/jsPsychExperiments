// Voluntary Task Switching
// Illuminating the role of effector-specific task representations in voluntary task switching
// Exp1 (online version)
//
// Two stimuli (i.e., letter/coloured square) are presented in each trial and are
//  associated with two-independent task sets (letter task vs. colour task)
//  1st half: tasks assigned to same hand (task-to-hand)
//  2nd half: tasks assigned to same finger (task-to-finger)
//  Participants decide which task to perform
// The onset of the task (letter/colour) performed in trial n-1 was delayed by increasing steps of 50 ms
// The onset of the task (letter/colour) not performed in trial n-1 was presented without delay
// Following a switch trial, the SOA delay wass reset

const jsPsych = initJsPsych({});

const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 720];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [960, 720], // minimum screen resolution requested
  nTrls: 100, // number of trials within a block
  nBlks: 14, // number of blocks
  fbDur: [0, 2500], // feedback duration for correct and incorrect trials, respectively
  rsi: 400,
  waitDur: 1000,
  stimFont: '50px Arial',
  stimPos: 25,
  fbFont: '28px Arial',
  colours: shuffle(['red', 'blue', 'green', 'yellow']),
  letters: shuffle(['Q', 'G', 'K', 'L']),
  soaStart: 0,
  soaStep: 50,
  respKeys: ['F', 'J', 'V', 'N'],
  leftHand: ['F', 'V'],
  rightHand: ['J', 'N'],
  indexFinger: ['V', 'N'],
  middleFinger: ['F', 'J'],
  respKeysColour: null,
  respKeysLetter: null,
};

const vts_data = {
  cTrl: 1,
  cBlk: 1,
  nLetter: 0,
  nNumber: 0,
  previousTask: 'na',
  soa: 0,
  repetitionCounter: 0,
  poor_performance: false,
};

const nVersion = 3; // getVersionNumber(nFiles, 2) + 2;
jsPsych.data.addProperties({ version: nVersion });

let mappingOrder;
if (nVersion === 1) {
  mappingOrder = ['hand_to_task', 'finger_to_task'];
} else if (nVersion === 2) {
  mappingOrder = ['finger_to_task', 'hand_to_task'];
}

let handMapping;
let handMappingInstructions;
let fingerMapping;
if (nVersion === 3) {
  handMapping = ['colour', 'letter'];
  handMappingInstructions = ['Farbeaufgabe', 'Buchstabenaufgabe'];
  prms.respKeysColour = [prms.respKeys[0], prms.respKeys[1]];
  prms.respKeysLetter = [prms.respKeys[2], prms.respKeys[3]];
  fingerMapping = shuffle(['Ungerade', 'Gerade']).concat(shuffle(['Vokal', 'Konsonant']));
} else if (nVersion === 4) {
  handMapping = ['letter', 'colour'];
  handMappingInstructions = ['Buchstabenaufgabe', 'Farbeaufgabe'];
  prms.respKeysLetter = [prms.respKeys[0], prms.respKeys[1]];
  prms.respKeysColour = [prms.respKeys[2], prms.respKeys[3]];
  fingerMapping = shuffle(['Vokal', 'Konsonant']).concat(shuffle(['Ungerade', 'Gerade']));
}

let respText1 = generate_formatted_html({
  text: `     ${handMappingInstructions[0]}:             ${handMappingInstructions[1]}:   <br>
     ${fingerMapping[0]}  ${fingerMapping[1]}           ${fingerMapping[2]}   ${fingerMapping[3]}   <br>`,
  fontsize: 30,
  bold: true,
  underline: false,
  align: 'left',
  lineheight: 0.75,
  preformatted: true,
});

let respText2 = generate_formatted_html({
  text: `     ("${prms.respKeys[0]}-Taste") ("${prms.respKeys[1]}-Taste")       ("${prms.respKeys[2]}-Taste") ("${prms.respKeys[3]}-Taste")  `,
  fontsize: 26,
  bold: false,
  underline: false,
  align: 'left',
  lineheight: 0.75,
  preformatted: true,
});

let respText = respText1 + respText2;

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
    bold: true,
    lineheight: 1.5,
  }),
  post_trial_gap: 1000,
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    bold: true,
    lineheight: 1.5,
  }),
};

const task_instructions3 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: ` Es gibt eine Buchstabenaufgabe (ist der Buchstabe ein Vokal oder Konsonant?) und eine Zahlenaufgabe (ist die Zahl gerade oder ungerade?).<br>
        Jede Aufgabe wird mit einer Hand bearbeitet:<br>`,
      fontsize: 26,
      width: '1000px',
      align: 'left',
      lineheight: 1.5,
    }) +
    respText +
    generate_formatted_html({
      text: `<br>Drücke eine beliebige Taste, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
      lineheight: 1.5,
    }),
};

const task_instructions4 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du siehst in jedem Durchgang einen Buchstaben und eine Zahl, aber eine
    Aufgabe erscheint später als die andere Aufgabe.<br><br>
    Du darfst frei entscheiden, ob du die zuerst erscheinende Aufgabe bearbeiten
    willst oder auf die andere Aufgabe wartest, aber versuche so schnell und so
      genau wie möglich zu sein!<br><br>
      Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe erscheint und endet
      sobald du eine der beiden Aufgaben bearbeitet hast!<br><br>
      Drücke eine beliebige Taste um fortzufahren.`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

// prettier-ignore
const task_instructions5 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: generate_formatted_html({
        text: `In jedem Block gibt es insgesamt ${prms.nTrls} Aufgaben (${prms.nTrls / 2} Buchstaben und ${prms.nTrls / 2} Zahlenaufgaben).<br><br>
        Du hast freie Aufgabenwahl, wenn beide Aufgaben verfügbar sind.<br><br>
        Wenn nur ein “#”-Zeichen statt einer Aufgabe (Buchstabe oder Zahl) erscheint, dann musst du die verbliebende Anzahl der andere Aufgabe bearbeiten bis der Block zu Ende ist.<br><br>
        Drücke eine beliebige Taste um fortzufahren.`,
        fontsize: 26,
        align: 'left',
        lineheight: 1.5,
    }),
};

const task_instructions_responses = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    respText +
    generate_formatted_html({
      text: `Drücke eine beliebige Taste, um fortzufahren.`,
      align: 'center',
      fontsize: 26,
      lineheight: 1.5,
    }),
};

const task_instructions_block_start = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${vts_data.cBlk} von ${prms.nBlks}<br>`,
        fontsize: 26,
        align: 'center',
      }) +
      generate_formatted_html({
        text: `Du darfst in jedem frei Durchgang entscheiden, ob du die zuerst erscheinende Aufgabe bearbeitest oder auf die andere Aufgabe wartest (sofern beide Aufgaben noch verfügbar sind)!<br><br>
Versuche aber alle ${prms.nTrls} Aufgaben (${prms.nTrls / 2} Buchstaben und ${
          prms.nTrls / 2
        } Zahlen) so schnell und so genau wie möglich zu bearbeiten!`,
        fontsize: 26,
        lineheight: 1.5,
        align: 'left',
      }) +
      respText +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren.`,
        align: 'center',
        fontsize: 26,
        lineheight: 1.5,
      });
  },
};

const blank_canvas = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  trial_duration: prms.waitDur,
};

function drawStimulus(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stimFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';

  // draw surrounding rectangle
  if (args.draw_colour === 1) {
    ctx.strokeStyle = args.colour;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(-40, -50, 80, 100);
    ctx.stroke();
  }

  // letter task
  if (args.draw_letter === 1) {
    ctx.fillText(args.letter, 0, 0);
  }
}

function draw_rsi() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw surrounding rectangle
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 5;
  // ctx.beginPath();
  // ctx.rect(-40, -50, 80, 100);
  // ctx.stroke();
}

const rsi = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  trial_duration: prms.rsi,
  response_ends_trial: false,
  func: draw_rsi,
};

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  // Which hand/task did they respond with/to?
  let respHand = prms.respKeys.slice(0, 2).includes(dat.key_press.toUpperCase()) ? 'left' : 'right';
  let respTask = respHand === 'left' ? handMapping[0] : handMapping[1];

  console.log(respHand);
  console.log(respTask);

  // Was it a repeat or repetition of task?
  let transition = 'na';
  if (vts_data.previousTask !== 'na') {
    transition = respTask === vts_data.previousTask ? 'repeat' : 'switch';
  }
  vts_data.repetitionCounter = transition === 'repeat' ? vts_data.repetitionCounter + 1 : 0;

  let error = 1; // If correct, this is changed to 0
  let offset = respHand === 'left' ? 0 : 2;
  if (respTask === 'letter') {
    if (prms.lettersVowel.includes(dat.letter)) {
      if (
        (fingerMapping[offset] === 'Vokal' && jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[offset])) ||
        (fingerMapping[1 + offset] === 'Vokal' &&
          jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[1 + offset]))
      ) {
        error = 0;
      }
    } else if (prms.lettersConsonant.includes(dat.letter)) {
      if (
        (fingerMapping[offset] === 'Konsonant' &&
          jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[offset])) ||
        (fingerMapping[1 + offset] === 'Konsonant' &&
          jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[1 + offset]))
      ) {
        error = 0;
      }
    }
  } else if (respTask === 'colour') {
    if (prms.numbersOdd.includes(dat.number)) {
      if (
        (fingerMapping[offset] === 'Ungerade' && jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[offset])) ||
        (fingerMapping[1 + offset] === 'Ungerade' &&
          jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[1 + offset]))
      ) {
        error = 0;
      }
    } else if (prms.numbersEven.includes(dat.number)) {
      if (
        (fingerMapping[offset] === 'Gerade' && jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[offset])) ||
        (fingerMapping[1 + offset] === 'Gerade' &&
          jsPsych.pluginAPI.compareKeys(dat.key_press, prms.respKeys[1 + offset]))
      ) {
        error = 0;
      }
    }
  }

  // Calculate RT: NB if responding to the repeat stimulus, subtract SOA
  let rt1 = dat.rt;
  let rt2 = transition !== 'repeat' ? dat.rt : dat.rt - vts_data.soa;

  // console.log('Resp hand: ', respHand);
  // console.log('Resp task: ', respTask);
  // console.log('Transitiion: ', transition);
  // console.log('SOA: ', vts_data.soa);
  // console.log('Transitiion: ', transition);
  // console.log('RepetitionCounter: ', vts_data.repetitionCounter);
  // console.log('RT1: ', rt1);
  // console.log('RT2: ', rt2);
  // console.log('Error: ', error);

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: vts_data.cBlk,
    trialNum: vts_data.cTrl,
    respHand: respHand,
    respTask: respTask,
    transition: transition,
    repetitionCounter: vts_data.repetitionCounter,
    soa: vts_data.soa,
    rt1: rt1,
    rt2: rt2,
    error: error,
  });

  // Update vts_data for next trial
  vts_data.cTrl++;
  if (respTask === 'letter') vts_data.nLetter++;
  if (respTask === 'colour') vts_data.nColour++;
  vts_data.previousTask = respTask;
  vts_data.soa = transition === 'repeat' ? vts_data.soa + prms.soaStep : 50;

  //if (error === 0) vts_data.soa = 0;
}

const vts_stimulus = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: [drawStimulus, drawStimulus],
  stimulus_onset: null,
  letter: null,
  colour: null,
  func_args: null,
  data: {},
  on_start: function (trial) {
    'use strict';

    // Which letter/colour to show
    let letter = prms.letters[getRandomInt(0, prms.letters.length - 1)];
    let colour = prms.colours[getRandomInt(0, prms.colours.length - 1)];

    // SOA interval
    trial.stimulus_onset = vts_data.cTrl === 1 ? [0, 0] : [0, vts_data.soa];

    // repeat vs. switch task
    let draw_colour, draw_letter;
    if (vts_data.previousTask === 'na') {
      draw_colour = [1, 1];
      draw_letter = [1, 1];
    } else if (vts_data.previousTask === 'colour') {
      draw_colour = [0, 1];
      draw_letter = [1, 1];
    } else if (vts_data.previousTask === 'letter') {
      draw_colour = [1, 1];
      draw_letter = [0, 1];
    }

    trial.func_args = [
      { letter: letter, colour: colour, draw_colour: draw_colour[0], draw_letter: draw_letter[0] },
      { letter: letter, colour: colour, draw_colour: draw_colour[1], draw_letter: draw_letter[1] },
    ];

    trial.data = { stim: 'vts', letter: letter, colour: colour };
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_feedback = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: false,
  func: drawTrialFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.error];
  },
};

// prettier-ignore
function drawTrialFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];

  ctx.fillStyle = 'black';
  ctx.font = prms.fbFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (dat.error === 0) {
    // draw square
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(-40, -50, 80, 100);
    ctx.stroke();

  } else {
    ctx.fillText(`Falsch`, 0, -100);
    ctx.fillText(`${handMappingInstructions[0]}               ${handMappingInstructions[1]}`, 0, -50);
    ctx.fillText(`${fingerMapping[0]}   ${fingerMapping[1]}              ${fingerMapping[2]}   ${fingerMapping[3]}`, 0, 0);
    ctx.fillText( `("${prms.respKeys[0]}-Taste") ("${prms.respKeys[1]}-Taste")         ("${prms.respKeys[2]}-Taste") ("${prms.respKeys[3]}-Taste")`, 0, 25);
  }
}

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: vts_data.cBlk });
  let meanTime = Math.round(dat.select('rt1').mean());
  let nError = dat.select('error').values.filter(function (x) {
    return x === 1;
  }).length;
  let blockFbTxt =
    generate_formatted_html({
      text: `Kurze Pause.`,
      fontsize: 30,
      lineheight: 1.5,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Du hast im Durchschnitt ${meanTime} ms zur Bearbeitung aller ${prms.nTrls} Aufgaben gebraucht und dabei ${nError} Fehler gemacht.<br><br>
Versuche weiterhin so schnell und so genau wie möglich in jedem Durchgang zu sein. Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe (oder #-Zeichen) erscheint und endet, sobald du eine der beiden Aufgaben bearbeitet hast! <br><br>
Drücke eine beliebige Taste um fortzufahren.`,
      fontsize: 30,
      lineheight: 1.5,
      align: 'left',
    });

  // reset vts_data for next block
  vts_data.cTrl = 1;
  vts_data.cBlk += 1;
  vts_data.nNumber = 0;
  vts_data.nLetter = 0;
  vts_data.previousTask = 'na';
  vts_data.soa = 0;
  vts_data.poor_performance = nError >= prms.nPoor;

  return blockFbTxt;
}

const block_feedback1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt({ stim: 'vts' });
  },
};

const block_feedback2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `ACHTUNG!`,
      fontsize: 26,
      align: 'center',
    }) +
    generate_formatted_html({
      text: `Du hast viele Fehler in diesem Block gemacht. Du sollst zwar so schnell wie möglich sein, aber dabei auch nicht zuviele Fehler Machen. Bitte schaue dir nochmal die Antworttasten genau an. Es geht in 30 s automatisch weiter.`,
      fontsize: 26,
      align: 'left',
    }) +
    respText,
  response_ends_trial: false,
  on_start: function (trial) {
    if (vts_data.poor_performance) {
      trial.trial_duration = 30000;
    } else {
      trial.trial_duration = 0;
    }
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'vtse1_');

const alphaNum = {
  type: jsPsychHtmlKeyboardResponse,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank für Ihre Teilnahme.<br><br>
       Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
       zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       hiwipibio@gmail.com <br><br>
       Code: ` +
      randomString +
      `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    bold: true,
    align: 'left',
  }),
};
////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
  const vpNum = getTime();
  jsPsych.data.addProperties({ vpNum: vpNum });

  const data_fn = `${dirName}data/version${version}/${expName}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'modal_flanker' });
  // saveDataLocal(data_fn, { stim: 'modal_flanker' });

  const code_fn = `${dirName}code/${expName}`;
  saveRandomCode('/Common/write_code.php', code_fn, randomString);
}

const save_data = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  // exp.push(fullscreen_on);
  // exp.push(check_screen);
  // exp.push(welcome_de);
  // exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  // exp.push(hideMouseCursor);
  // exp.push(task_instructions1);
  // exp.push(task_instructions2);
  // exp.push(task_instructions3);
  // exp.push(task_instructions4);
  // exp.push(task_instructions5);

  for (let blk = 0; blk < prms.nBlks; blk++) {
    // task-reminder
    // exp.push(task_instructions_block_start);
    // exp.push(blank_canvas);
    // trials within block
    for (let trl = 0; trl < prms.nTrls; trl++) {
      exp.push(rsi);
      exp.push(vts_stimulus);
      // exp.push(trial_feedback);
    }
    // between block feedback
    exp.push(block_feedback1);
    if (blk < prms.nBlks - 1) {
      exp.push(block_feedback2);
    }
  }

  // save data
  exp.push(save_data);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(alphaNum);
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
