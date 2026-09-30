// B.Sc. Project DMC SimonWord
// ResearchProject 2.2
// Simon task with word stimuli presented
// to the left and right screen location. VPs
// should respond with left and right key-presses according
// to 1) living/non-liveing or 2) small/large

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [720, 960]; // height, width
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrlsP: 80, // number of trials in first block (practice)
  nTrlsE: 80, // number of trials in subsequent blocks
  nBlks: 11,
  fix_dur: 400,
  fb_dur: [500, 1000, 1000, 1000],
  cue_dur: 400,
  iti: 400,
  too_fast: 0,
  too_slow: 3500,
  fb_txt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  fb_size: '30px monospace',
  ctrl: 1, // count trials
  cblk: 1, // count blocks
  resp_keys_life: [],
  resp_keys_size: [],
  fix_width: 3,
  fix_size: 15,
  stim_pos_x: 300,
  stim_pos_y: 0,
  stim_size: '40px monospace',
};

const VERSION = Number(jsPsych.data.urlVariables().version) || (Math.random() < 0.5 ? 1 : 2);
jsPsych.data.addProperties({ version: VERSION });
let respText = "";
if (VERSION === 1) {
  PRMS.resp_keys_life = ['q', 'p'];
  PRMS.resp_keys_size = ['q', 'p'];
  respText =
    "<h2 style='text-align: center;'>Leben: Lebendig = 'Q' &emsp;&emsp; Nicht Lebendig = 'P'</h2>" +
    "<h2 style='text-align: center;'>Größe: Klein = 'Q' &emsp;&emsp; Groß = 'P'</h2><br>";
} else if (VERSION === 2) {
  PRMS.resp_keys_life = ['p', 'q'];
  PRMS.resp_keys_size = ['q', 'p'];
  respText =
    "<h2 style='text-align: center;'>Leben: Nicht Lebendig = 'Q' &emsp;&emsp; Lebendig = 'P'</h2>" +
    "<h2 style='text-align: center;'>Größe: Klein = 'Q' &emsp;&emsp; Groß = 'P'</h2><br>";
}

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste um fortzufahren!</h2>",
};

const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: center;'>Im Folgenden musst du 2 Aufgaben bearbeiten. </h3>" +
    "<h3 style='text-align: center;'>Wenn in der Mitte 'Größe' steht, entscheide ob das Objekt groß </h3>" +
    "<h3 style='text-align: center;'>oder klein ist (in Relation zur Größe eines Fußballs).</h3>" +
    "<h3 style='text-align: center;'>Wenn in der Mitte 'Leben' steht, entscheide ob das Objekt lebendig ist oder nicht.</h3>" +
    "<h3 style='text-align: center;'>Es gilt:</h3>" +
    respText +
    "<h3 style='text-align: center;'>Bediene 'Q' mit deinem linken Zeigefinger und 'P' mit deinem rechten Zeigefinger.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte reagiere so schnell und korrekt wie möglich.</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste um fortzufahren!</h2>",
};

const TASK_REMINDER = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<h3 style='text-align: center;'>Versuche weiterhin so schnell und so genau wie möglich zu reagieren.</h3><br>" +
    "<h3 style='text-align: center;'>Wenn du wieder bereit für den nächsten Block bist, dann positioniere</h3>" +
    "<h3 style='text-align: center;'>deine Hände wieder auf der Tastatur. Es gilt weiterhin:</h3><br>" +
    respText +
    "<h2 style='text-align: center;'>Weiter mit beliebiger Taste!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const FIXATION_CROSS = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.fix_dur,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function(c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.lineWidth = PRMS.fix_width;
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
  },
};

const WORD_CUE = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.cue_dur,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function(c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.font = PRMS.stim_size;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(jsPsych.evaluateTimelineVariable('cue'), 0, 0);
  }
};

function code_trial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  
  let rt = dat.rt !== null ? dat.rt : PRMS.too_slow;
  let comp =
    (dat.position === 'left' && dat.corrResp.toLowerCase() === 'q') || (dat.position === 'right' && dat.corrResp.toLowerCase() === 'p')
      ? 'comp'
      : 'incomp';

  let correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);

  if (correctKey && rt > PRMS.too_fast && rt < PRMS.too_slow) {
    corrCode = 1; // correct
  } else if (!correctKey && rt > PRMS.too_fast && rt < PRMS.too_slow) {
    corrCode = 2; // choice error
  } else if (rt >= PRMS.too_slow) {
    corrCode = 3; // too slow
  } else if (rt <= PRMS.too_fast) {
    corrCode = 4; // too false
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    comp: comp,
    rt: rt,
    corrCode: corrCode,
    blockNum: PRMS.cblk,
    trialNum: PRMS.ctrl,
  });
  PRMS.ctrl += 1;
  if (jsPsych.pluginAPI.compareKeys(dat.response, 'escape')) {
    jsPsych.endExperiment();
  }
}

const WORD_STIMULUS = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.too_slow,
  response_ends_trial: true,
  choices: ['q', 'p', 'escape'],
  stimulus: function(c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = PRMS.stim_size;

    let pos = jsPsych.evaluateTimelineVariable('position');
    let word = jsPsych.evaluateTimelineVariable('word');
    let cue = jsPsych.evaluateTimelineVariable('cue');

    if (pos === 'left') {
      ctx.fillText(word, -PRMS.stim_pos_x, PRMS.stim_pos_y);
      ctx.fillText(cue, 0, 0);
    } else if (pos === 'right') {
      ctx.fillText(word, PRMS.stim_pos_x, PRMS.stim_pos_y);
      ctx.fillText(cue, 0, 0);
    }
  },
  data: {
    stim: 'SimonWord',
    cue: jsPsych.timelineVariable('cue'),
    word: jsPsych.timelineVariable('word'),
    size: jsPsych.timelineVariable('size'),
    life: jsPsych.timelineVariable('life'),
    position: jsPsych.timelineVariable('position'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    code_trial();
  },
};

const TRIAL_FEEDBACK = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function(c) {
    let ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = PRMS.fb_size;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(PRMS.fb_txt[dat.corrCode - 1], 0, 0);
  },
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.fb_dur[dat.corrCode - 1];
  },
};

const ITI = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  trial_duration: PRMS.iti,
  response_ends_trial: false,
  choices: "NO_KEYS",
  stimulus: function(c) {},
};

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: PRMS.wait_duration,
  on_start: function (trial) {
    let block_dvs = calculate_block_performance({ filter_options: { stim: 'SimonWord', blockNum: PRMS.cblk }, corr_column: "corrCode" });
    let text = block_feedback_text(PRMS.cblk, PRMS.nBlks, block_dvs.mean_rt, block_dvs.error_rate, "de");
    trial.stimulus = `<div style="max-width:960px; margin:auto;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.ctrl = 1;
    PRMS.cblk += 1;
  },
};

const TRIAL_TIMELINE = {
  timeline: [FIXATION_CROSS, WORD_CUE, WORD_STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: [

    { cue: 'LEBEN', word: 'Spinne', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Ameise', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Mücke', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Schnecke', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Wespe', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Spinne', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Ameise', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Mücke', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    {
      cue: 'LEBEN',
      word: 'Schnecke',
      size: 'small',
      life: 'living',
      position: 'right',
      corrResp: PRMS.resp_keys_life[0],
    },
    { cue: 'LEBEN', word: 'Wespe', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'GRÖßE', word: 'Spinne', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Ameise', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Mücke', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Schnecke', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Wespe', size: 'small', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Spinne', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Ameise', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Mücke', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[0] },
    {
      cue: 'GRÖßE',
      word: 'Schnecke',
      size: 'small',
      life: 'living',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    { cue: 'GRÖßE', word: 'Wespe', size: 'small', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'LEBEN', word: 'Kamel', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Delfin', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Elefant', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Zebra', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Esel', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Kamel', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Delfin', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Elefant', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Zebra', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'LEBEN', word: 'Esel', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_life[0] },
    { cue: 'GRÖßE', word: 'Kamel', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Delfin', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Elefant', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Zebra', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Esel', size: 'large', life: 'living', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Kamel', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Delfin', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Elefant', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Zebra', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Esel', size: 'large', life: 'living', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    {
      cue: 'LEBEN',
      word: 'Armband',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_life[1],
    },
    { cue: 'LEBEN', word: 'Socke', size: 'small', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_life[1] },
    { cue: 'LEBEN', word: 'Perle', size: 'small', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_life[1] },
    {
      cue: 'LEBEN',
      word: 'Zigarre',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Löffel',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Armband',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Socke',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Perle',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Zigarre',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'LEBEN',
      word: 'Löffel',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    {
      cue: 'GRÖßE',
      word: 'Armband',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_size[0],
    },
    { cue: 'GRÖßE', word: 'Socke', size: 'small', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    { cue: 'GRÖßE', word: 'Perle', size: 'small', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_size[0] },
    {
      cue: 'GRÖßE',
      word: 'Zigarre',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Löffel',
      size: 'small',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Armband',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Socke',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Perle',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Zigarre',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'GRÖßE',
      word: 'Löffel',
      size: 'small',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[0],
    },
    {
      cue: 'LEBEN',
      word: 'Eisberg',
      size: 'large',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_life[1],
    },
    { cue: 'LEBEN', word: 'Sofa', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_life[1] },
    { cue: 'LEBEN', word: 'Tuba', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_life[1] },
    {
      cue: 'LEBEN',
      word: 'Asteroid',
      size: 'large',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_life[1],
    },
    { cue: 'LEBEN', word: 'Kanu', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_life[1] },
    {
      cue: 'LEBEN',
      word: 'Eisberg',
      size: 'large',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    { cue: 'LEBEN', word: 'Sofa', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_life[1] },
    { cue: 'LEBEN', word: 'Tuba', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_life[1] },
    {
      cue: 'LEBEN',
      word: 'Asteroid',
      size: 'large',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_life[1],
    },
    { cue: 'LEBEN', word: 'Kanu', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_life[1] },
    {
      cue: 'GRÖßE',
      word: 'Eisberg',
      size: 'large',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_size[1],
    },
    { cue: 'GRÖßE', word: 'Sofa', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Tuba', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    {
      cue: 'GRÖßE',
      word: 'Asteroid',
      size: 'large',
      life: 'nonliving',
      position: 'left',
      corrResp: PRMS.resp_keys_size[1],
    },
    { cue: 'GRÖßE', word: 'Kanu', size: 'large', life: 'nonliving', position: 'left', corrResp: PRMS.resp_keys_size[1] },
    {
      cue: 'GRÖßE',
      word: 'Eisberg',
      size: 'large',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[1],
    },
    { cue: 'GRÖßE', word: 'Sofa', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    { cue: 'GRÖßE', word: 'Tuba', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_size[1] },
    {
      cue: 'GRÖßE',
      word: 'Asteroid',
      size: 'large',
      life: 'nonliving',
      position: 'right',
      corrResp: PRMS.resp_keys_size[1],
    },
    { cue: 'GRÖßE', word: 'Kanu', size: 'large', life: 'nonliving', position: 'right', corrResp: PRMS.resp_keys_size[1] },
  
  ],
};



////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
function save() {
  jsPsych.data.addProperties({ vpNum: VP_NUM });
  const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
  save_data_local(fn, { stim: "SimonWord" });
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
  'use strict';

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(welcome_message("de_du"));
  exp.push(resize_browser("de_du"));
  exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
  exp.push(mouse_cursor(false));
  exp.push(browser_check(CANVAS_SIZE));
  exp.push(TASK_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS2);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    let blk_timeline = { ...TRIAL_TIMELINE };
    if (blk > 0) {
      exp.push(TASK_REMINDER);
    }
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: blk === 0 ? PRMS.nTrlsP / 80 : PRMS.nTrlsE / 80,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
  }
  exp.push(SAVE_DATA);
  exp.push(end_message("de_du"));
  exp.push(mouse_cursor(true));
  exp.push(fullscreen(false));

  return exp;
}
const EXP = generate_exp();

jsPsych.run(EXP);
