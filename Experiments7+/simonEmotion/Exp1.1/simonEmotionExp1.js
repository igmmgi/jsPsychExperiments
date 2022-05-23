// Simon Task:
// VPs respond to the emotion (positive/negative vs. negative) of the a face
// presented to the left/right side of the screen.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  screenRes: [960, 720],
  nBlks: 8, // number of blocks
  fixDur: 500, // duration of fixation cross
  fixSize: 50, // size of fixation cross
  fbDur: [0, 1500, 1500, 1500], // duration of feedback for each type
  waitDur: 1000, // duration following ...
  iti: 500, // duration of inter-trial-interval
  tooFast: 150, // responses faster than x ms -> too fast!
  tooSlow: 2000, // response slower than x ms -> too slow!
  respKeys: ['Q', 'P'],
  target: shuffle(['negatives', 'positives']),
  stimHeight: 175,
  stimSpacing: 0,
  fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fbTxtSizeTrial: 30,
  fbTxtSizeBlock: 30,
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

// position/size stimuli
prms.stimHeight = Number(jsPsych.data.urlVariables().stimHeight);
prms.stimSpacing = Number(jsPsych.data.urlVariables().stimSpacing);
jsPsych.data.addProperties({ stimHeight : prms.stimHeight, stimSpacing : prms.stimSpacing });

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           charlotte.kost@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment siehst du Gesichter mit positiven oder negativen Emotionen.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
    Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine negative oder positive Emotion zeigt.<br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
"Q" = ${prms.target[0]} Gesicht &emsp; "P" = ${prms.target[1]} Gesicht<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const block_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>
             Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
             "Q" = ${prms.target[0]} Gesicht &emsp; "P" = ${prms.target[1]} Gesicht<br><br>
             Drücke eine beliebige Taste, um fortzufahren.`,
      align: 'left',
      colour: 'black',
      fontsize: 30,
    });
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// console.log(nimstim_negative);
// console.log(nimstim_positive);
// console.log(mpi_negative_old);
// console.log(mpi_negative_middle);
// console.log(mpi_negative_young);
// console.log(mpi_positive_old);
// console.log(mpi_positive_middle);
// console.log(mpi_positive_young);
// console.log(kdef_negative);
// console.log(kdef_positive);
// console.log(radboud_negative);
// console.log(radboud_positive);
// console.log(radiate_negative);
// console.log(radiate_positive);

const preload = {
  type: jsPsychPreload,
  images: [
    nimstim_negative,
    nimstim_positive,
    mpi_negative_old,
    mpi_positive_old,
    mpi_negative_middle,
    mpi_positive_middle,
    mpi_negative_young,
    mpi_positive_young,
    kdef_negative,
    kdef_positive,
    radboud_negative,
    radboud_positive,
    radiate_negative,
    radiate_positive,
    '../images/blank/blank.png',
  ],
};

const image_numbers = {
  nimstim: randomSelection(range(0, nimstim_negative.length), 40),
  mpi_old: randomSelection(range(0, mpi_negative_old.length), 52),
  mpi_middle: randomSelection(range(0, mpi_negative_middle.length), 52),
  mpi_young: randomSelection(range(0, mpi_negative_young.length), 52),
  kdef: randomSelection(range(0, kdef_negative.length), 52),
  radboud: randomSelection(range(0, radboud_negative.length), 52),
  radiate1: randomSelection(range(0, radiate_negative.length), 52),
  radiate2: null,
};
image_numbers.radiate2 = randomSelection(
  range(0, radiate_negative.length).filter((x) => !image_numbers.radiate1.includes(x)),
  52,
);
// console.log(image_numbers);

function generateStimulusCombinations(dataset_negative, dataset_positive, dataset_name, image_numbers) {
  let simon_type = shuffle(
    repeatArray(['negative_left', 'negative_right', 'positive_left', 'positive_right'], image_numbers.length / 4),
  );
  let trials = [];
  for (let i = 0; i < simon_type.length; i++) {
    let tmp = {};
    tmp.database = dataset_name;
    if (simon_type[i] === 'negative_left') {
      tmp.target = dataset_negative[image_numbers[i]];
      tmp.target_type = 'negative';
      tmp.target_side = 'left';
      tmp.key = prms.respKeys[prms.target.indexOf('negatives')];
      tmp.comp = tmp.key === prms.respKeys[0] ? 'comp' : 'incomp';
    } else if (simon_type[i] === 'negative_right') {
      tmp.target = dataset_negative[image_numbers[i]];
      tmp.target_type = 'negative';
      tmp.target_side = 'right';
      tmp.key = prms.respKeys[prms.target.indexOf('negatives')];
      tmp.comp = tmp.key === prms.respKeys[1] ? 'comp' : 'incomp';
    } else if (simon_type[i] === 'positive_left') {
      tmp.target = dataset_positive[image_numbers[i]];
      tmp.target_type = 'positive';
      tmp.target_side = 'left';
      tmp.key = prms.respKeys[prms.target.indexOf('positives')];
      tmp.comp = tmp.key === prms.respKeys[0] ? 'comp' : 'incomp';
    } else if (simon_type[i] === 'positive_right') {
      tmp.target = dataset_positive[image_numbers[i]];
      tmp.target_type = 'positive';
      tmp.target_side = 'right';
      tmp.key = prms.respKeys[prms.target.indexOf('positives')];
      tmp.comp = tmp.key === prms.respKeys[1] ? 'comp' : 'incomp';
    }
    trials.push(tmp);
  }
  return trials;
}

const trials_nimstim = generateStimulusCombinations(
  nimstim_negative,
  nimstim_positive,
  'nimstim',
  image_numbers.nimstim,
);
const trials_mpi_young = generateStimulusCombinations(
  mpi_negative_young,
  mpi_positive_young,
  'mpi_young',
  image_numbers.mpi_young,
);
const trials_mpi_middle = generateStimulusCombinations(
  mpi_negative_middle,
  mpi_positive_middle,
  'mpi_middle',
  image_numbers.mpi_middle,
);
const trials_mpi_old = generateStimulusCombinations(
  mpi_negative_old,
  mpi_positive_old,
  'mpi_old',
  image_numbers.mpi_old,
);
const trials_kdef = generateStimulusCombinations(kdef_negative, kdef_positive, 'kdef', image_numbers.kdef);
const trials_radboud = generateStimulusCombinations(
  radboud_negative,
  radboud_positive,
  'radboud',
  image_numbers.radboud,
);
const trials_radiate1 = generateStimulusCombinations(
  radiate_negative,
  radiate_positive,
  'radiate',
  image_numbers.radiate1,
);
const trials_radiate2 = generateStimulusCombinations(
  radiate_negative,
  radiate_positive,
  'radiate',
  image_numbers.radiate2,
);

// console.log(trials_nimstim);
// console.log(trials_mpi_young);
// console.log(trials_mpi_middle);
// console.log(trials_mpi_old);
// console.log(trials_kdef);
// console.log(trials_radboud);
// console.log(trials_radiate1);
// console.log(trials_radiate2);

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
  on_start: function (trial) {
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
  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

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

const simon_stimulus = {
  type: jsPsychImageKeyboardResponse,
  stimulus: '',
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  stimulus_height: prms.stimHeight,
  stimulus_spacing: prms.stimSpacing,
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'simon',
    target: jsPsych.timelineVariable('target'),
    target_type: jsPsych.timelineVariable('target_type'),
    target_side: jsPsych.timelineVariable('target_side'),
    compatibility: jsPsych.timelineVariable('comp'),
    database: jsPsych.timelineVariable('database'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_start: function (trial) {
    trial.data.target = baseFileName(trial.data.target);
    if (trial.data.target_side === 'left') {
      trial.stimulus = [jsPsych.timelineVariable('target'), '../images/blank/blank.png', '../images/blank/blank.png'];
    } else if (trial.data.target_side === 'right') {
      trial.stimulus = ['../images/blank/blank.png', '../images/blank/blank.png', jsPsych.timelineVariable('target')];
    }
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline_nimstim = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_nimstim,
};

const trial_timeline_kdef = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_kdef,
};

const trial_timeline_mpi_young = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_young,
};

const trial_timeline_mpi_middle = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_middle,
};

const trial_timeline_mpi_old = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_old,
};

const trial_timeline_radboud = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_radboud,
};

const trial_timeline_radiate1 = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_radiate1,
};

const trial_timeline_radiate2 = {
  timeline: [fixation_cross, simon_stimulus, trial_feedback, iti],
  timeline_variables: trials_radiate2,
};

const trial_timelines = [trial_timeline_nimstim].concat(
  shuffle([
    trial_timeline_kdef,
    trial_timeline_mpi_young,
    trial_timeline_mpi_middle,
    trial_timeline_mpi_old,
    trial_timeline_radboud,
    trial_timeline_radiate1,
    trial_timeline_radiate2,
  ]),
);
// console.log(trial_timelines);

const block_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'simon', blockNum: prms.cBlk } });
    let text = blockFeedbackText(prms.cBlk, prms.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
    trial.stimulus = `<div style="font-size:${prms.fbTxtSizeBlock}px;">${text}</div>`;
  },
  on_finish: function () {
    prms.cTrl = 1;
    prms.cBlk += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16, 'se1_');

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
        charlotte.kost@student.uni-tuebingen.de<br><br>
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
//                            password                                //
////////////////////////////////////////////////////////////////////////
const enter_password = {
  type: jsPsychExternalHtml,
  url: '/Common7+/password.html',
  cont_btn: 'start',
  check_fn: function () {
    let password = document.getElementById('pass').value;
    let correct = getPassword('/Common7+/password.php', password);
    if (correct !== '0') {
      alert('Falsch');
      return false;
    } else {
      return true;
    }
  },
  post_trial_gap: 1000,
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
  saveData('/Common/write_data.php', data_fn, { stim: 'simon' });
  // saveDataLocal(data_fn, { stim: 'simon' });

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

  exp.push(enter_password);

  exp.push(fullscreen(true));
  exp.push(browser_check(prms.screenRes));
  exp.push(preload);
  exp.push(resize_browser());
  exp.push(welcome_message());
  // exp.push(vpInfoForm('/Common7+/vpInfoForm_de_copyright.html'));
  exp.push(mouseCursor(false));
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  for (let blk = 0; blk < trial_timelines.length; blk += 1) {
    exp.push(block_start);
    let blk_timeline = trial_timelines[blk];
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: 1,
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
