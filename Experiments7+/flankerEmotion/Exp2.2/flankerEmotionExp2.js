// Flanker Task:
// VPs respond to the emotion (positive/negative vs. neutral) of the central face
// whilst ignoring the surrounding faces

const jsPsych = initJsPsych({});

const stimHeight = Number(jsPsych.data.urlVariables().stimHeight);

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
  flankerSOA: 100, // interval between flanker "prime" and fullflanker array
  respKeys: ['Q', 'P'],
  target: shuffle(['neutrales', 'negatives']),
  stimHeight: stimHeight,
  stimSpacing: 0,
  fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
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
um das Experiment durchzuführen. Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.<br><br>
Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
Bei Fragen oder Problemen wende dich bitte an:<br><br>
matthias.viteritti@student.uni-tuebingen.de<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment werden dir immer drei Gesichter präsentiert. Deine Aufgabe ist es,
    zu entscheiden, ob das mittlere Gesicht eine Emotion zeigt oder nicht.<br><br>
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.
Zunächst hast du die Gelegenheit die Aufgabe zu üben.<br><br>
"Q" = ${prms.target[0]} Gesicht &emsp; "P" = ${prms.target[1]} Gesicht<br><br>
Bitte antworte so schnell und so korrekt wie möglich!<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const task_instructions_key_mapping = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment werden dir immer drei Gesichter präsentiert. Deine Aufgabe ist es,
    zu entscheiden, ob das mittlere Gesicht eine Emotion zeigt oder nicht.
WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.
Zunächst hast du die Gelegenheit die Aufgabe zu üben.<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

const block_start = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: null,
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Block ${prms.cBlk} von ${prms.nBlks}<br><br>
    Zur Erinnerung:<br><br>
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

// console.log(nimstim_neutral);
// console.log(nimstim_negative);
// console.log(mpi_neutral_old);
// console.log(mpi_neutral_middle);
// console.log(mpi_neutral_young);
// console.log(mpi_negative_old);
// console.log(mpi_negative_middle);
// console.log(mpi_negative_young);
// console.log(kdef_neutral);
// console.log(kdef_negative);
// console.log(radboud_neutral);
// console.log(radboud_negative);
// console.log(radiate_neutral);
// console.log(radiate_negative);

const preload = {
  type: jsPsychPreload,
  images: [
    nimstim_neutral,
    nimstim_negative,
    mpi_neutral_old,
    mpi_negative_old,
    mpi_neutral_middle,
    mpi_negative_middle,
    mpi_neutral_young,
    mpi_negative_young,
    kdef_neutral,
    kdef_negative,
    radboud_neutral,
    radboud_negative,
    radiate_neutral,
    radiate_negative,
    '../images/blank/blank.png',
  ],
};

const image_numbers = {
  nimstim: randomSelection(range(0, nimstim_neutral.length), 40),
  mpi_old: randomSelection(range(0, mpi_neutral_old.length), 52),
  mpi_middle: randomSelection(range(0, mpi_neutral_middle.length), 52),
  mpi_young: randomSelection(range(0, mpi_neutral_young.length), 52),
  kdef: randomSelection(range(0, kdef_neutral.length), 52),
  radboud: randomSelection(range(0, radboud_neutral.length), 52),
  radiate1: randomSelection(range(0, radiate_neutral.length), 52),
  radiate2: null,
};
image_numbers.radiate2 = randomSelection(
  range(0, radiate_neutral.length).filter((x) => !image_numbers.radiate1.includes(x)),
  52,
);
// console.log(image_numbers);

function generateStimulusCombinations(dataset_neutral, dataset_negative, dataset_name, image_numbers) {
  let flanker_type = shuffle(
    repeatArray(['neutral_comp', 'neutral_incomp', 'negative_comp', 'negative_incomp'], image_numbers.length / 4),
  );
  let trials = [];
  for (let i = 0; i < flanker_type.length; i++) {
    let tmp = {};
    tmp.database = dataset_name;
    if (flanker_type[i] === 'neutral_comp') {
      tmp.target = dataset_neutral[image_numbers[i]];
      tmp.flanker = dataset_neutral[image_numbers[i]];
      tmp.target_type = 'neutral';
      tmp.flanker_type = 'neutral';
      tmp.comp = 'comp';
      tmp.key = prms.respKeys[prms.target.indexOf('neutrales')];
    } else if (flanker_type[i] === 'neutral_incomp') {
      tmp.target = dataset_neutral[image_numbers[i]];
      tmp.flanker = dataset_negative[image_numbers[i]];
      tmp.target_type = 'neutral';
      tmp.flanker_type = 'negative';
      tmp.comp = 'incomp';
      tmp.key = prms.respKeys[prms.target.indexOf('neutrales')];
    } else if (flanker_type[i] === 'negative_comp') {
      tmp.target = dataset_negative[image_numbers[i]];
      tmp.flanker = dataset_negative[image_numbers[i]];
      tmp.target_type = 'negative';
      tmp.flanker_type = 'negative';
      tmp.comp = 'comp';
      tmp.key = prms.respKeys[prms.target.indexOf('negatives')];
    } else if (flanker_type[i] === 'negative_incomp') {
      tmp.target = dataset_negative[image_numbers[i]];
      tmp.flanker = dataset_neutral[image_numbers[i]];
      tmp.target_type = 'negative';
      tmp.flanker_type = 'neutral';
      tmp.comp = 'incomp';
      tmp.key = prms.respKeys[prms.target.indexOf('negatives')];
    }
    trials.push(tmp);
  }
  return trials;
}

const trials_nimstim = generateStimulusCombinations(
  nimstim_neutral,
  nimstim_negative,
  'nimstim',
  image_numbers.nimstim,
);
const trials_mpi_young = generateStimulusCombinations(
  mpi_neutral_young,
  mpi_negative_young,
  'mpi_young',
  image_numbers.mpi_young,
);
const trials_mpi_middle = generateStimulusCombinations(
  mpi_neutral_middle,
  mpi_negative_middle,
  'mpi_middle',
  image_numbers.mpi_middle,
);
const trials_mpi_old = generateStimulusCombinations(
  mpi_neutral_old,
  mpi_negative_old,
  'mpi_old',
  image_numbers.mpi_old,
);
const trials_kdef = generateStimulusCombinations(kdef_neutral, kdef_negative, 'kdef', image_numbers.kdef);
const trials_radboud = generateStimulusCombinations(
  radboud_neutral,
  radboud_negative,
  'radboud',
  image_numbers.radboud,
);
const trials_radiate1 = generateStimulusCombinations(
  radiate_neutral,
  radiate_negative,
  'radiate',
  image_numbers.radiate1,
);
const trials_radiate2 = generateStimulusCombinations(
  radiate_neutral,
  radiate_negative,
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
  // console.log(dat);

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

const flanker_prime = {
  type: jsPsychImageKeyboardResponse,
  stimulus: [jsPsych.timelineVariable('flanker'), '../images/blank/blank.png', jsPsych.timelineVariable('flanker')],
  trial_duration: prms.flankerSOA,
  response_ends_trial: false,
  stimulus_height: prms.stimHeight,
  stimulus_spacing: prms.stimSpacing,
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'prime',
    comp: jsPsych.timelineVariable('comp'),
    target: jsPsych.timelineVariable('target'),
    target_type: jsPsych.timelineVariable('target_type'),
    flanker: jsPsych.timelineVariable('flanker'),
    flanker_type: jsPsych.timelineVariable('flanker_type'),
    database: jsPsych.timelineVariable('database'),
    corrResp: jsPsych.timelineVariable('key'),
  },
};

const flanker_stimulus = {
  type: jsPsychImageKeyboardResponse,
  stimulus: [
    jsPsych.timelineVariable('flanker'),
    jsPsych.timelineVariable('target'),
    jsPsych.timelineVariable('flanker'),
  ],
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  stimulus_height: prms.stimHeight,
  stimulus_spacing: prms.stimSpacing,
  choices: prms.respKeys,
  render_on_canvas: false,
  data: {
    stim: 'flanker',
    comp: jsPsych.timelineVariable('comp'),
    target: jsPsych.timelineVariable('target'),
    target_type: jsPsych.timelineVariable('target_type'),
    flanker: jsPsych.timelineVariable('flanker'),
    flanker_type: jsPsych.timelineVariable('flanker_type'),
    database: jsPsych.timelineVariable('database'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_start: function (trial) {
    trial.data.target = baseFileName(trial.data.target);
    trial.data.flanker = baseFileName(trial.data.flanker);
  },
  on_finish: function () {
    codeTrial();
    prms.cTrl += 1;
  },
};

const trial_timeline_nimstim = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_nimstim,
};

const trial_timeline_kdef = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_kdef,
};

const trial_timeline_mpi_young = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_young,
};

const trial_timeline_mpi_middle = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_middle,
};

const trial_timeline_mpi_old = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_mpi_old,
};

const trial_timeline_radboud = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_radboud,
};

const trial_timeline_radiate1 = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
  timeline_variables: trials_radiate1,
};

const trial_timeline_radiate2 = {
  timeline: [fixation_cross, flanker_prime, flanker_stimulus, trial_feedback, iti],
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
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'flanker', blockNum: prms.cBlk } });
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
const randomString = generateRandomString(16, 'fe1_');

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
        matthias.viteritti@student.uni-tuebingen.de<br><br>
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
  // saveDataLocal(data_fn, { stim: 'flanker' });

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

  // exp.push(enter_password);

  exp.push(fullscreen(true));
  exp.push(browser_check(prms.screenRes));
  exp.push(preload);
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm('/Common7+/vpInfoForm_de_copyright.html'));
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
