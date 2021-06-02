// Moral Decision Task with a task-irrelevant face prime showing
// happy/disgust presented between the context sentence and the
// target sentence. The participants task is to make a speeded
// "Morally Acceptable" vs. "Morally Unacceptable" response using
// the keys "S" and "K"
//
// The moral materials have been take from:
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
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

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
  fix_size: 15,
  fix_linewidth: 4,

  iti: 1000,

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
  text: `${keyMapping[0]} = linker Zeigefinger (Taste 'S')<br>
             ${keyMapping[1]} = rechter Zeigefinger (Taste 'K')<br>`,
  fontsize: 22,
  lineheight: 1.5,
  bold: true,
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

  exp.push(task_instructions1);
  exp.push(task_instructions2);
  exp.push(task_instructions3);
  exp.push(task_instructions4);
  exp.push(task_instructions5);

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
});
