// Moral Decision Task with a task-irrelevant face prime showing
// happy/disgust presented between the context sentence and the
// target sentence. The participants task is to make a speeded
// "Morally Acceptable" vs. "Morally Unacceptable" response using
// the keys "S" and "K"
//
// The moral materials have been taken from:
// Leuthold, H., Kunkel, A., Mackenzie, I. G., & Filik, R. (2015). Online
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
  fix_duration1: 500,
  fix_duration2: 50,
  fix_size: 10,
  fix_linewidth: 2,

  iti: 2000,
  imageDur: 250,
  minContextDur: 0,

  // Response Keys
  resp_keys: ['s', 'k'],
};

const counters = {
  trl: 0,
  blk: 0,
  comp: 0,
  incomp: 0,
  filler: 0,
  male_disgust: 0,
  male_happy: 0,
  female_disgust: 0,
  female_happy: 0,
};

// 2 counter-balanced order versions
const version = 1; //Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

const keyMappingMoral = [1, 2].includes(version) ? ['Acceptable', 'Unacceptable'] : ['Unacceptable', 'Acceptable'];
const keyMappingFace = [1, 3].includes(version) ? ['Frau', 'Mann'] : ['Mann', 'Frau'];

const respTextMoral = generate_formatted_html({
  text: `${keyMappingMoral[0]} &emsp;&emsp;&emsp;&emsp; ${keyMappingMoral[1]}<br>
    (Taste 'S') &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (Taste 'K')`,
  fontsize: 22,
  lineheight: 1.5,
  bold: false,
  align: 'center',
});

const respTextFace = generate_formatted_html({
  text: `${keyMappingFace[0]} &emsp;&emsp;&emsp;&emsp; ${keyMappingFace[1]}<br>
    (Taste 'S') &emsp;&emsp;&emsp;&emsp;&emsp; (Taste 'K')`,
  fontsize: 22,
  lineheight: 1.5,
  bold: false,
  align: 'center',
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
    Wir bitten dich die ca. 35 Minuten konzentriert zu arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    emotion-und-moral@web.de<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
};

const task_instructions3 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Im folgenden werden wir Ihnen verschiedene Szenarien präsentieren,
        in denen sich Menschen moralisch AKZEPTABEL oder moralisch
        INAKZEPTABEL verhalten. Ihre Aufgabe ist es zu entscheiden, ob das
        beschriebene Verhalten moralisch AKZEPTABEL oder moralisch
        INAKZEPTABEL ist. <br><br>
      Drücken Sie “LEERTASTE”, um fortzufahren.`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
};

const task_instructions4 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Die Szenarien bestehen aus zwei Teilen. Wenn Sie den ersten Teil
        gelesen haben, drücken Sie “LEERTASTE”, um fortzufahren. Das Bild
        eines Gesichts wird erscheinen, welches für die Aufgabenbearbeitung
        nicht relevant ist. Anschließend wird automatisch der zweite Teil des
        Szenarios präsentiert. Hier müssen Sie entscheiden: Ist das
        beschriebene Verhalten moralisch AKZEPTABEL oder moralisch
        INAKZEPTABEL?<br><br>
      Drücken Sie “LEERTASTE”, um fortzufahren.`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
};

const task_instructions5 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Um zu Antworten, drücken Sie eine Taste auf Ihrer Tastatur. Legen Sie
        nun Ihren linken Finger auf den Buchstaben ‘S’ und Ihren rechten
        Finger auf den Buchstaben ‘K’.`,
      fontsize: 26,
      align: 'left',
      lineheight: 1.5,
    }) +
    respTextMoral +
    generate_formatted_html({
      text: `Drücken Sie “LEERTASTE”, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
      lineheight: 1.5,
    }),
  choices: [' '],
};

const task_instructions6 = {
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
        fontsize: 26,
        align: 'left',
        lineheight: 1.5,
      }) +
      respTextMoral +
      generate_formatted_html({
        text: `Drücken Sie “LEERTASTE”, um fortzufahren.`,
        fontsize: 26,
        align: 'left',
        lineheight: 1.5,
      });
  },
  choices: [' '],
  on_finish: function () {
    counters.trl = 0;
    counters.blk++;
  },
};

const task_instructions7 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: generate_formatted_html({
    text: `Das Experiment ist fast beendet. Nun möchten wir Sie bitten,
    folgenden Fragebogen zu beantworten. Bitte seien Sie ehrlich, es gibt
    keine richtigen oder falschen Antworten. Ihre Daten werden
    anonymisiert und nur im Rahmen unserer Bachelorarbeit verwendet.
    Falls Sie sich bei einer Frage unsicher sind, antworten Sie so, wie es
    sich für Sie richtig anfühlt. Denken Sie nicht zu lange bei der
    Beantwortung der Fragen nach.<br><br>
    Drücken Sie “LEERTASTE”, um fortzufahren.`,
    fontsize: 26,
    align: 'left',
    lineheight: 1.5,
  }),
  choices: [' '],
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

const fixation_cross1 = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fix_duration1,
  translate_origin: true,
  response_ends_trial: false,
  func: draw_fixation_cross,
};

const fixation_cross2 = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.fix_duration2,
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

const context = {
  type: 'html-keyboard-response-canvas-min-duration',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  minimum_trial_duration: prms.minContextDur,
  choices: [' '],
  data: {
    stim_type: 'emomor',
    cond: jsPsych.timelineVariable('cond'),
    face: jsPsych.timelineVariable('face'),
  },
  on_start: function (trial) {
    if (trial.data.cond === 'comp') {
      trial.stimulus = generate_formatted_html({
        text: materials[compItems[counters.comp]].context,
        align: 'center',
        lineheight: 1.5,
        fontsize: 26,
      });
    } else if (trial.data.cond === 'incomp') {
      trial.stimulus = generate_formatted_html({
        text: materials[incompItems[counters.incomp]].context,
        align: 'center',
        lineheight: 1.5,
        fontsize: 26,
      });
    } else if (trial.data.cond === 'filler') {
      trial.stimulus = generate_formatted_html({
        text: fillers[fillerItems[counters.filler]].context,
        align: 'center',
        lineheight: 1.5,
        fontsize: 26,
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
  stimulus_width: 400,
  maintain_aspect_ratio: true,
  render_on_canvas: true,
  data: {
    stim_type: 'emomor',
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
    if (trial.data.cond === 'comp') {
      trial.stimulus =
        generate_formatted_html({
          text: materials[compItems[counters.comp]].target,
          align: 'center',
          lineheight: 1.5,
          fontsize: 26,
        }) + respTextMoral;
    } else if (trial.data.cond === 'incomp') {
      trial.stimulus =
        generate_formatted_html({
          text: materials[incompItems[counters.incomp]].target,
          align: 'center',
          lineheight: 1.5,
          fontsize: 26,
        }) + respTextMoral;
    } else if (trial.data.cond === 'filler') {
      trial.stimulus =
        generate_formatted_html({
          text: 'Hast du eben dat Gesicht einer Frau oder eines Mannes gesehen?',
          align: 'center',
          lineheight: 1.5,
          fontsize: 26,
        }) + respTextFace;
    }
  },
  on_finish: function () {
    let dat = jsPsych.data.get().last(1).values()[0];
    let response_label;
    if (dat.cond !== 'filler') {
      response_label = dat.response == 's' ? respTextMoral[0] : respTextMoral[1];
    } else if (dat.cond === 'filler') {
      response_label = dat.response == 's' ? respTextFace[0] : respTextFace[1];
    }
    jsPsych.data.addDataToLastTrial({
      date: Date(),
      blockNum: counters.blk,
      trialNum: counters.trl,
      response_label: response_label,
    });
    counters.trl += 1;
  },
};

// prettier-ignore
const stimuli = [
    { cond: 'comp',   face: 'female_disgust'},
    { cond: 'comp',   face: 'female_happy'},
    { cond: 'comp',   face: 'male_disgust'},
    { cond: 'comp',   face: 'male_happy'},
    { cond: 'comp',   face: 'female_disgust'},
    { cond: 'comp',   face: 'female_happy'},
    { cond: 'comp',   face: 'male_disgust'},
    { cond: 'comp',   face: 'male_happy'},
    { cond: 'incomp', face: 'female_disgust'},
    { cond: 'incomp', face: 'female_happy'},
    { cond: 'incomp', face: 'male_disgust'},
    { cond: 'incomp', face: 'male_happy'},
    { cond: 'incomp', face: 'female_disgust'},
    { cond: 'incomp', face: 'female_happy'},
    { cond: 'incomp', face: 'male_disgust'},
    { cond: 'incomp', face: 'male_happy'},
    { cond: 'filler', face: 'female_disgust'},
    { cond: 'filler', face: 'female_happy'},
    { cond: 'filler', face: 'male_disgust'},
    { cond: 'filler', face: 'male_happy'},
];

const trial_timeline = {
  timeline: [context, fixation_cross1, image, fixation_cross2, target, iti],
  timeline_variables: stimuli,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

////////////////////////////////////////////////////////////////////////
//                           Questionnaire                            //
////////////////////////////////////////////////////////////////////////
const scale = ['nie', 'so gut wie nie', 'manchmal', 'häufug', 'fast die ganze Zeit'];

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
      text: `Drücke die Leertaste, um fortzufahren!`,
      fontsize: 26,
      align: 'left',
    }),
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
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
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
  exp.push(check_screen);
  exp.push(welcome_de);
  exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);

  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);

  for (let i = 0; i < 5; i++) {
    exp.push(iti);
    exp.push(trial_timeline);
    exp.push(task_instructions6);
  }

  exp.push(iti);
  exp.push(task_instructions7);
  questionnaire.forEach(function (item) {
    exp.push(item);
  });

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(showMouseCursor);
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
  on_finish: function () {
    jsPsych.data.displayData();
  },
});
