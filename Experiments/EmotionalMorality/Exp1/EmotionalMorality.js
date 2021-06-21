// Moral Decision Task with a task-irrelevant face prime showing
// happy/disgust presented between the context sentence and the
// target sentence. The participants task is to make a speeded
// "Morally Acceptable" vs. "Morally Unacceptable" response using
// the keys "S" and "K"
//
// The moral materials have been taken from:
// Leuthold, H., Kunkel, A., Mackenzie, I.G., & Filik, R. (2015). Online
// processing of moral transgressions: ERP evidence for spontaneous evaluation.
// Social Cognitive and Affective Neuroscience, 10(8), 1021-1029.
//
// Basic trial structure:
// Context sentence (until response, min duration = 1000 ms)
// Fixation Cross (500 ms)
// Face Prime (250 ms)
// Fixation Cross (50 ms)
// Target Sentence (until response)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [960, 720];
const canvas_border = '0px solid black';

const check_screen = {
  type: 'check-screen-resolution',
  width: canvas_size[0],
  height: canvas_size[1],
  timing_post_trial: 0,
  on_finish: function () {
    reload_if_not_fullscreen();
  },
};

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  // Fixation Cross
  fix_duration: 500,
  fix_size: 10,
  fix_linewidth: 2,

  post_trial_gap: 500,
  iti: 1000,
  image_target_interval: 50,
  imageDur: 250,
  minContextDur: 0,

  // Response Keys
  resp_keys: ['s', 'k'],
};

const counters = {
  trl: 0,
  blk: 0,
  AKZEPTABEL: 0,
  INAKZEPTABEL: 0,
  FILLER: 0,
  PRACTICE: 0,
  male_disgust: 0,
  male_happy: 0,
  female_disgust: 0,
  female_happy: 0,
};

// 4 counter-balanced order key versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

const keyMappingMoral = [1, 2].includes(version) ? ['AKZEPTABEL', 'INAKZEPTABEL'] : ['INAKZEPTABEL', 'AKZEPTABEL'];
const keyMappingFiller = [1, 3].includes(version) ? ['WAHR', 'FALSCH'] : ['FALSCH', 'WAHR'];

const respTextMoral = generate_formatted_html({
  text: `${keyMappingMoral[0]} &emsp;&emsp;&emsp;&emsp; ${keyMappingMoral[1]}<br>
    (Taste ‚S') &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (Taste ‚K')`,
  fontsize: 22,
  lineheight: 1.5,
  bold: false,
  align: 'center',
  xypos: [0, 40],
});

const respTextFiller = generate_formatted_html({
  text: `${keyMappingFiller[0]} &emsp;&emsp;&emsp;&emsp; ${keyMappingFiller[1]}<br>
    (Taste ‚S') &emsp;&emsp;&emsp;&emsp;&emsp; (Taste ‚K')`,
  fontsize: 22,
  lineheight: 1.5,
  bold: false,
  align: 'center',
  xypos: [0, 40],
});

//////////////////////////////////////////////////////////////////////////
////                      Experiment Instructions                       //
//////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Willkommen bei unserem Experiment:<br><br>
    Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
    Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
    genügend Zeit hast, um das Experiment durchzuführen.
    Wir bitten dich, in den folgenden 25 Minuten konzentriert zu arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Am Ende des Experiments erhältst du einen Code für die
    Versuchspersonenstunde und weitere Informationen. Bei Fragen oder
    Problemen, wende dich gerne an:<br><br>
    emotion-und-moral@web.de<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Im Folgenden werden dir verschiedene Szenarien präsentiert, in denen
    sich Menschen moralisch AKZEPTABEL oder moralisch INAKZEPTABEL verhalten.
      Deine Aufgabe ist es zu entscheiden, ob das beschriebene Verhalten
      moralisch AKZEPTABEL oder moralisch INAKZEPTABEL ist.<br><br>
      Drücke die LEERTASTE, um fortzufahren.`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions4 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Die Szenarien bestehen aus zwei Teilen. Zuerst siehst du ein Kreuz
    in der Mitte des Bildschirms. Dann wir dir automatisch der erste Teil des
      Szenarios präsentiert. Sobald du diesen gelesen hast, drücke die
      LEERTASTE, um fortzufahren. Für eine kurze Zeit wird das Bild eines
      Gesichts erscheinen, welches für die Aufgabenbearbeitung nicht relevant
      ist. Anschließend wird automatisch der zweite Teil des Szenarios
      präsentiert.<br><br>
        Nun musst du dich entscheiden: Ist das beschriebene Verhalten moralisch
        AKZEPTABEL oder moralisch INAKZEPTABEL?<br><br>
      Drücke die LEERTASTE, um fortzufahren.`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions5 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Um deine Antwort anzugeben, nutzt du die Tasten auf deiner
        Tastatur. Lege deinen linken Zeigefinger auf den Buchstaben ‚S‘ und
        deinen rechten Zeigefinger auf den Buchstaben ‚K‘. Sobald der zweite
        Teil des Szenarios erscheint, sollst du entscheiden, ob das Verhalten
        AKZEPTABEL oder INAKZEPTABEL ist.`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }) +
    respTextMoral +
    generate_formatted_html({
      text: `<br><br>Drücke die LEERTASTE, um fortzufahren.`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions6 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Bei einigen Szenarien wirst du im zweiten Teil NICHT um eine
        moralische Einschätzung des Verhaltens gebeten. Hier werden dir
        Verständnisfragen zum ersten Teil der Szenarien gestellt. Die
        Antwortoptionen lauten WAHR und FALSCH.<br>`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }) +
    respTextFiller +
    generate_formatted_html({
      text: `<br><br>Drücke die LEERTASTE, um fortzufahren.`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions_practice = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Es folgen vier Übungsdurchgänge, damit du dich mit der Aufgabe und
        der Tastenzuordnung vertraut machen kannst.<br><br>
      Drücke die LEERTASTE, um fortzufahren.`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions_practice_start = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Zur Erinnerung:<br><br>
        Drücke LEERTASTE, sobald du den ersten Teil des Szenarios gelesen hast.<br>`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }) +
    respTextMoral +
    respTextFiller +
    generate_formatted_html({
      text: `<br><br>Drücke die LEERTASTE, um fortzufahren.`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
  on_start: function () {
    counters.trl = 0;
    counters.blk++;
  },
};

const task_instructions_exp_start = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Nun startet das Experiment. Zur Erinnerung:<br>`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }) +
    respTextMoral +
    respTextFiller +
    generate_formatted_html({
      text: `<br><br>Drücke die LEERTASTE, um fortzufahren.`,
      fontsize: 24,
      align: 'left',
      lineheight: 1.5,
    }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
  on_start: function () {
    counters.trl = 0;
    counters.blk++;
  },
};

const task_instructions_pause = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${counters.blk + 1} von 5:<br><br>
      Pause! Wenn du bereit für den Block bist dann positioniere die Zeigefinger
      deiner beiden Hände auf der Tastatur. Es gilt:`,
        fontsize: 24,
        align: 'left',
        lineheight: 1.5,
      }) +
      respTextMoral +
      respTextFiller +
      generate_formatted_html({
        text: `<br><br>Drücke LEERTASTE, sobald du den ersten Teil des Szenarios gelesen hast.
          <br><br>Drücke die LEERTASTE, um fortzufahren.`,
        fontsize: 24,
        align: 'left',
        lineheight: 1.5,
      });
  },
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
  on_finish: function () {
    counters.trl = 0;
    counters.blk++;
  },
};

const task_instructions_questionnaire1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Das Experiment ist fast beendet.<br><br>
    Nun möchten wir dich bitten, den folgenden Fragebogen auszufüllen. Bitte
    sei ehrlich, es gibt keine richtigen oder falschen Antworten. Falls du dir
      bei einer Frage unsicher bist, antworte so, wie es sich für dich passend
      anfühlt. Bitte versuche nicht zu lange nachzudenken und antworte nach
      deinem Bauchgefühl. Deine Daten werden anonymisiert und nur im Rahmen
      dieser Bachelorarbeit verwendet.<br><br>
    Drücke die LEERTASTE, um fortzufahren.`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

const task_instructions_questionnaire2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Die folgenden Punkte beschreiben eine Reihe von verschiedenen
    Verhaltensweisen. Bitte lese jeden Punkt und berichte anhand der folgenden
      Skala, wie oft du dich so verhalten hast.<br><br>
    Drücke die LEERTASTE, um fortzufahren.`,
    fontsize: 24,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
  post_trial_gap: prms.post_trial_gap,
};

////////////////////////////////////////////////////////////////////////
//                               Images                               //
////////////////////////////////////////////////////////////////////////
// prettier-ignore
const imageNumbersFemale = ["010", "020", "022", "028", "034", "040",
    "048", "054", "063", "069", "071", "085", "090", "098", "101",
    "106", "115", "125", "132", "134", "140", "150", "152", "162",
    "163", "171", "173", "177", "182"];

var imageFilesFemaleDisgust = [];
imageNumbersFemale.forEach((imageNumber) => {
  imageFilesFemaleDisgust.push(`images/female_disgust/${imageNumber}_y_f_d_a.jpg`);
});
// console.log(imageFilesFemaleDisgust);
const imagesFemaleDisgust = shuffle(loadImages(imageFilesFemaleDisgust));

var imageFilesFemaleHappy = [];
imageNumbersFemale.forEach((imageNumber) => {
  imageFilesFemaleHappy.push(`images/female_happy/${imageNumber}_y_f_h_a.jpg`);
});
// console.log(imageFilesFemaleHappy);
const imagesFemaleHappy = shuffle(loadImages(imageFilesFemaleHappy));

// prettier-ignore
const imageNumbersMale = ["008", "013", "016", "025", "031", "037",
    "041", "049", "057", "062", "066", "072", "081", "089", "099",
    "105", "109", "114", "119", "123", "127", "135", "144", "147",
    "153", "160", "167", "170", "175"];

var imageFilesMaleDisgust = [];
imageNumbersMale.forEach((imageNumber) => {
  imageFilesMaleDisgust.push(`images/male_disgust/${imageNumber}_y_m_d_a.jpg`);
});
// console.log(imageFilesMaleDisgust);
const imagesMaleDisgust = shuffle(loadImages(imageFilesMaleDisgust));

var imageFilesMaleHappy = [];
imageNumbersMale.forEach((imageNumber) => {
  imageFilesMaleHappy.push(`images/male_happy/${imageNumber}_y_m_h_a.jpg`);
});
// console.log(imageFilesMaleHappy);
const imagesMaleHappy = shuffle(loadImages(imageFilesMaleHappy));

////////////////////////////////////////////////////////////////////////
//                         Sentence Materials                         //
////////////////////////////////////////////////////////////////////////
let practiceItems = shuffle([0, 1, 2, 3]);

// console.log(materials);
let compItems = shuffle(range(0, 160, 2)).slice(0, 40);
// console.log(compItems);

let incompItems = [];
range(1, 160, 2).forEach(function (item) {
  if (!compItems.includes(item - 1)) {
    incompItems.push(item);
  }
});
incompItems = shuffle(incompItems);
// console.log(cond2items);

fillerItems = shuffle(range(0, 40));
// console.log(fillerItems);

////////////////////////////////////////////////////////////////////////
//                  Common Stimuli/Functions                          //
////////////////////////////////////////////////////////////////////////
function draw_fixation_cross() {
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fix_linewidth;
  ctx.moveTo(-prms.fix_size, 0);
  ctx.lineTo(prms.fix_size, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fix_size);
  ctx.lineTo(0, prms.fix_size);
  ctx.stroke();
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fix_duration,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_fixation_cross,
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const image_target_interval = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.image_target_interval,
  response_ends_trial: false,
  func: function () {},
};

const context = {
  type: 'html-keyboard-response-canvas-min-duration',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  minimum_trial_duration: prms.minContextDur,
  choices: [' '],
  data: {
    stim_type: 'emomor_context',
    cond: jsPsych.timelineVariable('cond'),
    face: jsPsych.timelineVariable('face'),
  },
  on_start: function (trial) {
    if (trial.data.cond === 'AKZEPTABEL') {
      trial.stimulus = generate_formatted_html({
        text: materials[compItems[counters.AKZEPTABEL]].context,
        align: 'left',
        lineheight: 1.5,
        fontsize: 24,
      });
      trial.data.itemNum = materials[compItems[counters.AKZEPTABEL]].itemNum;
    } else if (trial.data.cond === 'INAKZEPTABEL') {
      trial.stimulus = generate_formatted_html({
        text: materials[incompItems[counters.INAKZEPTABEL]].context,
        align: 'left',
        lineheight: 1.5,
        fontsize: 24,
      });
      trial.data.itemNum = materials[incompItems[counters.INAKZEPTABEL]].itemNum;
    } else if (trial.data.cond === 'FILLER') {
      trial.stimulus = generate_formatted_html({
        text: fillers[fillerItems[counters.FILLER]].context,
        align: 'left',
        lineheight: 1.5,
        fontsize: 24,
      });
      trial.data.itemNum = fillers[fillerItems[counters.FILLER]].itemNum;
    } else if (trial.data.cond === 'PRACTICE') {
      trial.stimulus = generate_formatted_html({
        text: practice[practiceItems[counters.PRACTICE]].context,
        align: 'left',
        lineheight: 1.5,
        fontsize: 24,
      });
    }
  },
};

const image = {
  type: 'image-keyboard-response',
  stimulus: '',
  trial_duration: prms.imageDur,
  choices: jsPsych.NO_KEYS,
  prompt: '',
  stimulus_width: 500,
  maintain_aspect_ratio: true,
  render_on_canvas: true,
  data: {
    stim_type: 'emomor_image',
    cond: jsPsych.timelineVariable('cond'),
    face: jsPsych.timelineVariable('face'),
  },
  on_start: function (trial) {
    if (trial.data.face === 'male_disgust') {
      trial.stimulus = imagesMaleDisgust[counters.male_disgust].src;
      counters.male_disgust += 1;
    } else if (trial.data.face === 'male_happy') {
      trial.stimulus = imagesMaleHappy[counters.male_happy].src;
      counters.male_happy += 1;
    } else if (trial.data.face === 'female_disgust') {
      trial.stimulus = imagesFemaleDisgust[counters.female_disgust].src;
      counters.female_disgust += 1;
    } else if (trial.data.face === 'female_happy') {
      trial.stimulus = imagesFemaleHappy[counters.female_happy].src;
      counters.female_happy += 1;
    }
    trial.data.imageName = trial.stimulus.split(/[\\/]/).pop().slice(0, -4);
  },
};

const target = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: null,
  choices: prms.resp_keys,
  response_ends_trial: true,
  data: {
    stim_type: 'emomor',
    cond: jsPsych.timelineVariable('cond'),
    face: jsPsych.timelineVariable('face'),
  },
  on_start: function (trial) {
    if (trial.data.cond === 'AKZEPTABEL') {
      trial.stimulus =
        generate_formatted_html({
          text: materials[compItems[counters.AKZEPTABEL]].target,
          align: 'center',
          lineheight: 1.5,
          fontsize: 24,
          xypos: [0, 35],
        }) + respTextMoral;
      trial.data.itemNum = materials[compItems[counters.AKZEPTABEL]].itemNum;
      trial.data.answer = 'na';
      counters.AKZEPTABEL += 1;
    } else if (trial.data.cond === 'INAKZEPTABEL') {
      trial.stimulus =
        generate_formatted_html({
          text: materials[incompItems[counters.INAKZEPTABEL]].target,
          align: 'center',
          lineheight: 1.5,
          fontsize: 24,
          xypos: [0, 35],
        }) + respTextMoral;
      trial.data.itemNum = materials[incompItems[counters.INAKZEPTABEL]].itemNum;
      trial.data.answer = 'na';
      counters.INAKZEPTABEL += 1;
    } else if (trial.data.cond === 'FILLER') {
      trial.stimulus =
        generate_formatted_html({
          text: fillers[fillerItems[counters.FILLER]].question,
          align: 'center',
          lineheight: 1.5,
          fontsize: 24,
          xypos: [0, 35],
        }) + respTextFiller;
      trial.data.answer = fillers[fillerItems[counters.FILLER]].answer;
      trial.data.itemNum = fillers[fillerItems[counters.FILLER]].itemNum;
      counters.FILLER += 1;
    } else if (trial.data.cond === 'PRACTICE') {
      let itemNum = practice[practiceItems[counters.PRACTICE]].itemNum;
      let respText = itemNum < 3 ? respTextMoral : respTextFiller;
      trial.stimulus =
        generate_formatted_html({
          text: practice[practiceItems[counters.PRACTICE]].question,
          align: 'center',
          lineheight: 1.5,
          fontsize: 24,
          xypos: [0, 35],
        }) + respText;
      trial.data.answer = practice[practiceItems[counters.PRACTICE]].answer;
      trial.data.itemNum = practice[practiceItems[counters.PRACTICE]].itemNum;
      counters.PRACTICE += 1;
    }
  },
  on_finish: function () {
    let dat_context = jsPsych.data.get().last(5).values()[0];
    let dat_image = jsPsych.data.get().last(3).values()[0];
    let dat_target = jsPsych.data.get().last(1).values()[0];
    let target_response;
    if ((dat_target.cond === 'AKZEPTABEL') | (dat_target.cond === 'INAKZEPTABEL')) {
      target_response = dat_target.response === 's' ? keyMappingMoral[0] : keyMappingMoral[1];
    } else if (dat_target.cond === 'FILLER') {
      target_response = dat_target.response === 's' ? keyMappingFiller[0] : keyMappingFiller[1];
    } else if (dat_target.cond === 'PRACTICE') {
      let keyMapping = dat_target.itemNum < 3 ? keyMappingMoral : keyMappingFiller;
      target_response = dat_target.response === 's' ? keyMapping[0] : keyMapping[1];
    }
    jsPsych.data.addDataToLastTrial({
      date: Date(),
      blockNum: counters.blk,
      trialNum: counters.trl,
      imageName: dat_image.imageName,
      target_response: target_response,
      rt_context: dat_context.rt,
      rt_target: dat_target.rt,
    });
    counters.trl += 1;
  },
};

// prettier-ignore
const stimuli_practice = [
    { cond: 'PRACTICE', face: 'female_disgust'},
    { cond: 'PRACTICE', face: 'female_happy'},
    { cond: 'PRACTICE', face: 'male_disgust'},
    { cond: 'PRACTICE', face: 'male_happy'},
];

const trial_timeline_practice = {
  timeline: [context, fixation_cross, image, image_target_interval, target, iti],
  timeline_variables: stimuli_practice,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

// prettier-ignore
const stimuli = [
    { cond: 'AKZEPTABEL',   face: 'female_disgust'},
    { cond: 'AKZEPTABEL',   face: 'female_happy'},
    { cond: 'AKZEPTABEL',   face: 'male_disgust'},
    { cond: 'AKZEPTABEL',   face: 'male_happy'},
    { cond: 'AKZEPTABEL',   face: 'female_disgust'},
    { cond: 'AKZEPTABEL',   face: 'female_happy'},
    { cond: 'AKZEPTABEL',   face: 'male_disgust'},
    { cond: 'AKZEPTABEL',   face: 'male_happy'},
    { cond: 'INAKZEPTABEL', face: 'female_disgust'},
    { cond: 'INAKZEPTABEL', face: 'female_happy'},
    { cond: 'INAKZEPTABEL', face: 'male_disgust'},
    { cond: 'INAKZEPTABEL', face: 'male_happy'},
    { cond: 'INAKZEPTABEL', face: 'female_disgust'},
    { cond: 'INAKZEPTABEL', face: 'female_happy'},
    { cond: 'INAKZEPTABEL', face: 'male_disgust'},
    { cond: 'INAKZEPTABEL', face: 'male_happy'},
    { cond: 'FILLER',       face: 'female_disgust'},
    { cond: 'FILLER',       face: 'female_happy'},
    { cond: 'FILLER',       face: 'male_disgust'},
    { cond: 'FILLER',       face: 'male_happy'},
];

const trial_timeline = {
  timeline: [context, fixation_cross, image, image_target_interval, target, iti],
  timeline_variables: stimuli,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

////////////////////////////////////////////////////////////////////////
//                           Questionnaire                            //
////////////////////////////////////////////////////////////////////////
const scale = ['nie', 'so gut wie nie', 'manchmal', 'häufig', 'fast die ganze Zeit'];

// prettier-ignore
const questions = [
    { prompt: 'Ich fühlte mich danach, Leute zu schlagen',                                                                      name:  'q1', labels: scale, required: true },
    { prompt: 'Ich bin in einen Laden, ein Einkaufszentrum oder ein Lagerhaus eingebrochen ',                                   name:  'q2', labels: scale, required: true },
    { prompt: 'Ich habe andere beschuldigt',                                                                                    name:  'q3', labels: scale, required: true },
    { prompt: 'Ich habe zurückgeschlagen, wenn ich von anderen geschlagen wurde',                                               name:  'q4', labels: scale, required: true },
    { prompt: 'Ich habe die Fenster eines leeren Gebäudes kaputt gemacht',                                                      name:  'q5', labels: scale, required: true },
    { prompt: 'Ich habe versucht, die Gefühle von jemandem zu verletzen',                                                       name:  'q6', labels: scale, required: true },
    { prompt: 'Ich wurde schnell wütend',                                                                                       name:  'q7', labels: scale, required: true },
    { prompt: 'Ich habe Dinge gestohlen',                                                                                       name:  'q8', labels: scale, required: true },
    { prompt: 'Ich habe mich hinter dem Rücken von jemandem über ihn/sie lustig gemacht',                                       name:  'q9', labels: scale, required: true },
    { prompt: 'Ich habe andere bedroht',                                                                                        name: 'q10', labels: scale, required: true },
    { prompt: 'Ich habe öffentliche Bereiche verschmutzt, indem ich Flaschen zerschlagen habe, Mülleimer umgeworfen habe usw.', name: 'q11', labels: scale, required: true },
    { prompt: 'Ich habe jemanden von Gruppenaktivitäten ausgeschlossen, wenn ich wütend auf ihn/sie war',                       name: 'q12', labels: scale, required: true },
    { prompt: 'Ich habe Probleme, mein Temperament zu kontrollieren',                                                           name: 'q13', labels: scale, required: true },
    { prompt: 'Ich habe ein Fahrrad gestohlen',                                                                                 name: 'q14', labels: scale, required: true },
    { prompt: 'Ich habe jemanden mit Schweigen bestraft, wenn ich wütend auf ihn/sie war',                                      name: 'q15', labels: scale, required: true },
    { prompt: 'Ich habe andere geschlagen, wenn ich provoziert wurde',                                                          name: 'q16', labels: scale, required: true },
    { prompt: 'Ich habe Eigentum aus der Schule oder von der Arbeit gestohlen',                                                 name: 'q17', labels: scale, required: true },
    { prompt: 'Ich habe jemandes Geheimnisse verraten, wenn ich wütend auf ihn/sie war',                                        name: 'q18', labels: scale, required: true },
    { prompt: 'Ich bin öfters in Auseinandersetzungen geraten als der Durchschnitt',                                            name: 'q19', labels: scale, required: true },
    { prompt: 'Ich habe für längere Zeit das Haus verlassen, ohne meine Familie/Freunde zu informieren',                        name: 'q20', labels: scale, required: true },
    { prompt: 'Ich habe absichtlich den Ruf von jemandem beschädigt',                                                           name: 'q21', labels: scale, required: true },
    { prompt: 'Ich habe andere beschimpft oder angeschrien',                                                                    name: 'q22', labels: scale, required: true },
    { prompt: 'Ich habe Drogen verkauft, einschließlich Marihuana',                                                             name: 'q23', labels: scale, required: true },
    { prompt: 'Ich habe versucht, andere gegen jemanden aufzubringen, wenn ich wütend auf ihn/sie war',                         name: 'q24', labels: scale, required: true },
    { prompt: 'Ich bin in körperliche Auseinandersetzungen geraten',                                                            name: 'q25', labels: scale, required: true },
    { prompt: 'Ich wurde von der Schule oder Arbeit suspendiert, verwiesen oder gefeuert',                                      name: 'q26', labels: scale, required: true },
    { prompt: 'Ich habe jemanden hinter seinem/ihrem Rücken beschimpft',                                                        name: 'q27', labels: scale, required: true },
    { prompt: 'Ich habe mich besser gefühlt, nachdem ich jemanden geschlagen habe',                                             name: 'q28', labels: scale, required: true },
    { prompt: 'Ich konnte Schulden nicht bezahlen',                                                                             name: 'q29', labels: scale, required: true },
    { prompt: 'Ich war unhöflich zu anderen',                                                                                   name: 'q30', labels: scale, required: true },
    { prompt: 'Ich habe Probleme, einen Job zu behalten',                                                                       name: 'q31', labels: scale, required: true },
    { prompt: 'Ich habe negative Kommentare über das Aussehen anderer gemacht',                                                 name: 'q32', labels: scale, required: true }
];

let questionnaire = [];
while (questions.length > 0) {
  questionnaire.push({
    type: 'survey-likert',
    questions: questions.splice(0, 5),
    scale_width: 600,
    button_label: 'Weiter',
    post_trial_gap: prms.post_trial_gap,
    on_finish: function () {
      let dat = jsPsych.data.get().last(1).values()[0];
      for (const [key, val] of Object.entries(dat.response)) {
        jsPsych.data.addProperties({ [key]: val + 1 });
      }
    },
  });
}

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('em1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      per Email an:<br><br>`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Code: ${randomString}<br>`,
      fontsize: 26,
      align: 'left',
    }) +
    generate_formatted_html({
      text: `Drücke die LEERTASTE, um fortzufahren!`,
      fontsize: 26,
      align: 'left',
    }),
  post_trial_gap: prms.post_trial_gap,
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/version' + version + '/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'emomor' });
  },
  post_trial_gap: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
  },
  post_trial_gap: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  post_trial_gap: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on_de);
  exp.push(check_screen);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);

  // instructions
  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);
  exp.push(task_instructions5);
  exp.push(task_instructions6);

  // practice block
  exp.push(task_instructions_practice);
  exp.push(task_instructions_practice_start);
  exp.push(trial_timeline_practice);
  exp.push(task_instructions_exp_start);

  // experiment blocks
  for (let blk = 0; blk < 1; blk++) {
    exp.push(trial_timeline);
    if (blk < 4) {
      exp.push(task_instructions_pause);
    }
  }

  // questionnaire
  exp.push(task_instructions_questionnaire1);
  exp.push(task_instructions_questionnaire2);
  exp.push(showMouseCursor);
  questionnaire.forEach(function (item) {
    exp.push(item);
  });

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(alpha_num);
  exp.push(debrief_de);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  on_interaction_data_update: function (data) {
    update_user_interaction_data(data);
  },
});
