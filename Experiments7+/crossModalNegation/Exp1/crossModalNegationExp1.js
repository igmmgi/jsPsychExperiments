// Cross Modal Negation
// VPs respond to the combined auditory/visual presentation of the following stimuli:
// nicht/jetzt (auditory/visual) and links/rechts (auditory/visual)
// For example:
// "jetzt" (auditory) + "links" (visual) requiring a left keypress
// "nicht" (auditory) + "links" (visual) requiring a right keypress

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [960, 720],
  nBlks: 2, // number of blocks
  nTrlsP: 16, // number of blocks
  nTrlsE: 64, // number of blocks
  fixDur: 1000, // duration of fixation cross
  fixSize: 50, // size of fixation cross
  fbDur: [500, 1500, 1500, 1500], // duration of feedback for each type
  waitDur: 1000, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 2000, // response slower than x ms -> too slow!
  respKeys: ['Q', 'P'],
  stimSize: 75,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fbTxtSizeTrial: 30,
  fbTxtSizeBlock: 30,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 25 Minuten konzentriert zu arbeiten.<br><br>
Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
Bei Fragen oder Problemen wende dich bitte an:<br><br>
XXX<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment siehst und hörst du Wörter. Bitte kombiniere die Bedeutung. Reagiere wie folgt: 
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
"jetzt links/nicht rechts" = "Q"; "jetzt rechts/nicht links" = "P"<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions_calibration = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<h3 style='text-align: center;'>ACHTUNG-Soundkalibierung: </h3>" +
    "<h3 style='text-align: left;'>Im Folgenden werden dir Worter audativ und visuell präsentiert.</h3>" +
    "<h3 style='text-align: left;'>Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du </h3>" +
    "<h3 style='text-align: left;'>deutlich zwischen den zwei Tönen differenzieren kannst.</h3>" +
    "<h3 style='text-align: left;'>Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).</h3><br>" +
    "<h2 style='text-align: center;'>Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!</h2>",
};

const block_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  on_start: function(trial) {
    trial.stimulus = generate_formatted_html({
      text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>
            Q = links, P = rechts <br><br>
            Drücke eine beliebige Taste, um fortzufahren.<br>`,
      align: 'left',
      colour: 'black',
      fontsize: 30,
    });
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const sounds = ['../sounds/jetzt.wav', '../sounds/nicht.wav', '../sounds/links.wav', '../sounds/rechts.wav ', '../sounds/silence.wav'];
const words = ['jetzt', 'nicht', 'links', 'rechts'];

const preload = {
  type: jsPsychPreload,
  audio: sounds,
};

// prettier-ignore
const trials_calibration = [
  { audio: sounds[0], visual: words[0] },
  { audio: sounds[1], visual: words[1] },
  { audio: sounds[2], visual: words[2] },
  { audio: sounds[3], visual: words[3] },
]

// prettier-ignore
const trials = [
  { mod1: "audio", mod2: "audio", audio1: sounds[0], visual1: "", audio2: sounds[2], visual2: "", affneg: "aff", dir: "l", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "audio", mod2: "audio", audio1: sounds[0], visual1: "", audio2: sounds[3], visual2: "", affneg: "aff", dir: "r", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "audio", mod2: "audio", audio1: sounds[1], visual1: "", audio2: sounds[2], visual2: "", affneg: "neg", dir: "l", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "audio", mod2: "audio", audio1: sounds[1], visual1: "", audio2: sounds[3], visual2: "", affneg: "neg", dir: "r", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "visual", mod2: "visual", audio1: sounds[4], visual1: words[0], audio2: sounds[4], visual2: words[2], affneg: "aff", dir: "l", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "visual", mod2: "visual", audio1: sounds[4], visual1: words[0], audio2: sounds[4], visual2: words[3], affneg: "aff", dir: "r", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "visual", mod2: "visual", audio1: sounds[4], visual1: words[1], audio2: sounds[4], visual2: words[2], affneg: "neg", dir: "l", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "visual", mod2: "visual", audio1: sounds[4], visual1: words[1], audio2: sounds[4], visual2: words[3], affneg: "neg", dir: "r", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "audio", mod2: "visual", audio1: sounds[0], visual1: "", audio2: sounds[4], visual2: words[2], affneg: "aff", dir: "l", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "audio", mod2: "visual", audio1: sounds[0], visual1: "", audio2: sounds[4], visual2: words[3], affneg: "aff", dir: "r", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "audio", mod2: "visual", audio1: sounds[1], visual1: "", audio2: sounds[4], visual2: words[2], affneg: "neg", dir: "l", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "audio", mod2: "visual", audio1: sounds[1], visual1: "", audio2: sounds[4], visual2: words[3], affneg: "neg", dir: "r", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "visual", mod2: "audio", audio1: sounds[4], visual1: words[0], audio2: sounds[2], visual2: "", affneg: "aff", dir: "l", corrKey1: null, corrKey2: prms.respKeys[0] },
  { mod1: "visual", mod2: "audio", audio1: sounds[4], visual1: words[0], audio2: sounds[3], visual2: "", affneg: "aff", dir: "r", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "visual", mod2: "audio", audio1: sounds[4], visual1: words[1], audio2: sounds[2], visual2: "", affneg: "neg", dir: "l", corrKey1: null, corrKey2: prms.respKeys[1] },
  { mod1: "visual", mod2: "audio", audio1: sounds[4], visual1: words[1], audio2: sounds[3], visual2: "", affneg: "neg", dir: "r", corrKey1: null, corrKey2: prms.respKeys[0] },
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:${prms.fixSize}px;">+</div>`,
  response_ends_trial: false,
  trial_duration: prms.fixDur,
};

const iti = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: prms.iti,
};

const trial_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: false,
  trial_duration: null,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeTrial}px;">${prms.fbTxt[dat.corrCode - 1]}</div>`;
  },
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let corrCode = 0;
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrKey);

  if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (dat.rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (dat.rt <= prms.tooFast) {
    corrCode = 4; // too fast
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
    corrCode: corrCode,
  });
}

const audio_calibration = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('audio'),
  prompt: '',
  choices: [],
  trial_duration: 1000,
  response_ends_trial: false,
  post_trial_gap: 500,
  on_start: function(trial) {
    let p = jsPsych.timelineVariable('visual');
    trial.prompt = `<div style="font-size:${prms.stimSize}px;">${p}</div>`;
  },
};


const negation_stimulus1 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('audio1'),
  prompt: '',
  trial_duration: 650,
  prompt_duration: 650,
  response_ends_trial: false,
  choices: prms.respKeys,
  data: {
    stim: 'modal_negation',
    audio: jsPsych.timelineVariable('audio1'),
    visual: jsPsych.timelineVariable('visual'),
    affneg: jsPsych.timelineVariable('affneg'),
    dir: jsPsych.timelineVariable('dir'),
    corrKey: jsPsych.timelineVariable('corrKey1'),
  },
  on_start: function(trial) {
    let p = jsPsych.timelineVariable('visual1');
    trial.prompt = `<div style="font-size:${prms.stimSize}px;">${p}</div>`;
  },
};

const negation_stimulus2 = {
  type: jsPsychAudioKeyboardResponse,
  stimulus: jsPsych.timelineVariable('audio2'),
  prompt: '',
  trial_duration: prms.tooSlow,
  prompt_duration: 650,
  response_ends_trial: true,
  choices: prms.respKeys,
  data: {
    stim: 'modal_negation',
    audio: jsPsych.timelineVariable('audio2'),
    visual: jsPsych.timelineVariable('visual'),
    affneg: jsPsych.timelineVariable('affneg'),
    dir: jsPsych.timelineVariable('dir'),
    corrKey: jsPsych.timelineVariable('corrKey2'),
  },
  on_start: function(trial) {
    let p = jsPsych.timelineVariable('visual2');
    trial.prompt = `<div style="font-size:${prms.stimSize}px;">${p}</div>`;
  },
  on_finish: function() {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline_calibration = {
  timeline: [audio_calibration],
  timeline_variables: trials_calibration,
  sample: {
    type: 'fixed-repetitions',
    size: 2,
  },
};

const trial_timeline = {
  timeline: [fixation_cross, negation_stimulus1, negation_stimulus2, trial_feedback, iti],
  timeline_variables: trials,
};

const block_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function(trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'modal_negation', blockNum: prms.cBlk } });
    let text = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function() {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'mn1_');

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
        xxx<br><br>
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

  const data_fn = `${dirName}data/${expName}_${vpNum}`;
  saveData('/Common/write_data.php', data_fn, { stim: 'flanker' });

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

  exp.push(fullscreen(true));
  exp.push(browser_check(prms.screenRes));
  exp.push(preload);
  exp.push(resize_browser());
  exp.push(welcome_message());
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
  exp.push(mouseCursor(false));
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // audio calibration
  exp.push(task_instructions_calibration);
  exp.push(trial_timeline_calibration);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    exp.push(block_start);
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / trials.length : prms.nTrlsE / trials.length,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

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
