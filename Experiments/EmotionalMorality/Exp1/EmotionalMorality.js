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

  iti: 1000,
  imageDur: 250,
  minContextDur: 2000,

  // Response Keys
  resp_keys: ['s', 'k'],

  // Block/Trial Counters
  cTrl: 1,
  cBlk: 1,
};

// 2 counter-balanced order versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

const keyMapping = version === 1 ? ['Acceptable', 'Unacceptable'] : ['Unacceptable', 'Acceptable'];

const respText = generate_formatted_html({
  text: `${keyMapping[0]} &emsp;&emsp;&emsp;&emsp; ${keyMapping[1]}<br>
    (Taste 'S') &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (Taste 'K')`,
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
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
    fontsize: 26,
    align: 'left',
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
    }) +
    respText +
    generate_formatted_html({
      text: `Drücken Sie “LEERTASTE”, um fortzufahren.`,
      fontsize: 26,
      align: 'left',
    }),
  choices: [' '],
};

const task_instructions6 = {
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
  }),
  choices: [' '],
};

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
const imagesFemaleDisgust = loadImages(imageFilesFemaleDisgust);

var imageFilesFemaleHappy = [];
imageNumbersFemale.forEach((imageNumber) => {
  imageFilesFemaleHappy.push(`images/female_happy/${imageNumber}_y_f_h_a.jpg`);
});
// console.log(imageFilesFemaleHappy);
const imagesFemaleHappy = loadImages(imageFilesFemaleHappy);

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
const imagesMaleDisgust = loadImages(imageFilesMaleDisgust);

var imageFilesMaleHappy = [];
imageNumbersMale.forEach((imageNumber) => {
  imageFilesMaleHappy.push(`images/male_happy/${imageNumber}_y_m_h_a.jpg`);
});
// console.log(imageFilesMaleHappy);
const imagesMaleHappy = loadImages(imageFilesMaleHappy);

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
  stimulus: generate_formatted_html({
    text: `Herr Zinn ist Psychotherapeut und hat aktuell einen sehr schwierigen Fall. Er ist auf die Erfahrung und Hilfe seiner Kollegen angewiesen, um den Patienten angemessen zu therapieren.`,
    align: 'left',
    lineheight: 1.5,
    fontsize: 26,
  }),
  minimum_trial_duration: prms.minContextDur,
  choices: [' '],
};

const image = {
  type: 'image-keyboard-response',
  stimulus: imagesMaleHappy[0].src,
  trial_duration: prms.imageDur,
  choices: jsPsych.NO_KEYS,
  prompt: '',
  stimulus_width: 200,
  maintain_aspect_ratio: true,
  render_on_canvas: true,
};

const target = {
  type: 'html-keyboard-response',
  stimulus:
    generate_formatted_html({
      text: 'Herr Zinn beschließt seinen Kollegen von dem Problem zu berichten.',
      align: 'center',
      lineheight: 1.5,
      fontsize: 26,
    }) + respText,
  trial_duration: null,
  choices: prms.resp_keys,
  response_ends_trial: true,
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
    questions: questions.splice(0, 10),
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
const randomString = generateRandomStringWithExpName('md1', 16);

const alpha_num = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    generate_formatted_html({
      text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      per Email an:<br><br>
    hiwipibio@gmail.com<br>`,
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
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data.php', data_filename, { stim_type: 'md' });
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

  // exp.push(fullscreen_on);
  // exp.push(check_screen);
  // exp.push(welcome_de);
  // exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  // exp.push(hideMouseCursor);
  // exp.push(screenInfo);

  // exp.push(context);
  // exp.push(fixation_cross1);
  // exp.push(image);
  // exp.push(fixation_cross2);
  // exp.push(target);
  // exp.push(task_instructions1);
  // exp.push(task_instructions2);
  // exp.push(task_instructions3);
  // exp.push(task_instructions4);

  questionnaire.forEach(function (item) {
    exp.push(item);
  });

  // save data
  // exp.push(save_data);
  // exp.push(save_interaction_data);
  // exp.push(save_code);

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
