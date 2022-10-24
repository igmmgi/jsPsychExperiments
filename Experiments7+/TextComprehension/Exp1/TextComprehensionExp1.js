// Text Comprehension

const jsPsych = initJsPsych({});

// 4 counter balanced versions
// Version 1: Text 1H -> Text 2C
// Version 2: Text 2C -> Text 1H
// Version 3: Text 1C -> Text 2H
// Version 4: Text 2H -> Text 1C
// Version 5: Text 1H -> Text 2H
// Version 6: Text 2H -> Text 1H
// Version 7: Text 1C -> Text 2C
// Version 8: Text 2C -> Text 1C

const VP_NUM = getTime();
jsPsych.data.addProperties({ vpNum: VP_NUM });

// randomly assign versions 1 to 8
const VERSION = (VP_NUM % 8) + 1;
jsPsych.data.addProperties({ version: VERSION });

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  screenRes: [960, 720],
  postTrialGap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 2-3 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           xxx@xxx<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: 'left',
    colour: 'black',
    fontsize: 30,
  }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
TEXT_1_HUMAN_QUESTION = generate_formatted_html({
  text: `Thermometer lügen nicht. Der globale Temperaturdurchschnitt ist
        im 20. Jahrhundert von -0,5 °C auf + 0,7 °C gestiegen. Insbesondere in den letzten
        50 Jahren hat sich die Temperatur enorm erhöht. Ein Temperatur-Rekord jagt den
        nächsten. Das ist weltweit inzwischen zu spüren. Hitzewellen und Trockenheit sind
        die Folge.<br><br>
        <span style="font-weight:bold;"> Rettet die Menschen!</span><br><br>
        Wieviel Prozent der politischen Kapazitäten sollten für dieses Problem aufgewendet werden?`,
  align: 'left',
  fontsize: 30,
  xypos: [0, 0],
  lineheight: 1.5,
  bold: false,
});

TEXT_1_CLIMATE_QUESTION = generate_formatted_html({
  text: `Thermometer lügen nicht. Der globale Temperaturdurchschnitt ist
        im 20. Jahrhundert von -0,5 °C auf + 0,7 °C gestiegen. Insbesondere in den letzten
        50 Jahren hat sich die Temperatur enorm erhöht. Ein Temperatur-Rekord jagt den
        nächsten. Das ist weltweit inzwischen zu spüren. Hitzewellen und Trockenheit sind
        die Folge.<br><br>
        <span style="font-weight:bold;"> Rettet das Klima!</span><br><br>
        Wieviel Prozent der politischen Kapazitäten sollten für dieses Problem aufgewendet werden?`,
  align: 'left',
  fontsize: 30,
  xypos: [0, 0],
  lineheight: 1.5,
  bold: false,
});

TEXT_2_HUMAN_QUESTION = generate_formatted_html({
  text: `Die Erderwärmung verursacht nicht per se Unwetter, aber sie macht sie
        wahrscheinlicher. Statistiken belegen, während Umweltkatastrophen wie Erdbeben,
        Tsunamis und Vulkanaktivitäten konstant geblieben sind, hat sich die Zahl der
        Stürme, Überschwemmungen, Erdrutsche, Dürren, Hitzewellen und Waldbrände seit 1980
        mehr als verdreifacht.<br><br>
        <span style="font-weight:bold;"> Rettet die Menschen!</span><br><br>
        Wieviel Prozent der politischen Kapazitäten sollten für dieses Problem aufgewendet werden?`,
  align: 'left',
  fontsize: 30,
  xypos: [0, 0],
  lineheight: 1.5,
  bold: false,
});

TEXT_2_CLIMATE_QUESTION = generate_formatted_html({
  text: `Die Erderwärmung verursacht nicht per se Unwetter, aber sie macht sie
        wahrscheinlicher. Statistiken belegen, während Umweltkatastrophen wie Erdbeben,
        Tsunamis und Vulkanaktivitäten konstant geblieben sind, hat sich die Zahl der
        Stürme, Überschwemmungen, Erdrutsche, Dürren, Hitzewellen und Waldbrände seit 1980
        mehr als verdreifacht.<br><br>
        <span style="font-weight:bold;"> Rettet das Klima!</span><br><br>
        Wieviel Prozent der politischen Kapazitäten sollten für dieses Problem aufgewendet werden?`,
  align: 'left',
  fontsize: 30,
  xypos: [0, 0],
  lineheight: 1.5,
  bold: false,
});

const TEXT_1_HUMAN = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_1_HUMAN_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
};

const TEXT_1_CLIMATE = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_1_CLIMATE_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
};

const TEXT_2_HUMAN = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_2_HUMAN_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
};

const TEXT_2_CLIMATE = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_2_CLIMATE_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const dirName = getDirName();
const expName = getFileName();

function save() {
  const fn = `${dirName}data/${expName}_${VP_NUM}`;
  saveData('/Common/write_data.php', fn, { stim: 'tc' });
  // saveDataLocal(fn, { stim: 'tc' });
}

const save_data = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: PRMS.postTrialGap,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(browser_check(PRMS.screenRes));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm());
  exp.push(TASK_INSTRUCTIONS1);

  // Version 1: Text 1H -> Text 2C
  // Version 2: Text 2C -> Text 1H
  // Version 3: Text 1C -> Text 2H
  // Version 4: Text 2H -> Text 1C
  // Version 5: Text 1H -> Text 2H
  // Version 6: Text 2H -> Text 1H
  // Version 7: Text 1C -> Text 2C
  // Version 8: Text 2C -> Text 1C
  if (VERSION === 1) {
    exp.push(TEXT_1_HUMAN);
    exp.push(TEXT_2_CLIMATE);
  } else if (VERSION === 2) {
    exp.push(TEXT_2_CLIMATE);
    exp.push(TEXT_1_HUMAN);
  } else if (VERSION === 3) {
    exp.push(TEXT_1_CLIMATE);
    exp.push(TEXT_2_HUMAN);
  } else if (VERSION === 4) {
    exp.push(TEXT_2_HUMAN);
    exp.push(TEXT_1_CLIMATE);
  } else if (VERSION === 5) {
    exp.push(TEXT_1_HUMAN);
    exp.push(TEXT_2_HUMAN);
  } else if (VERSION === 6) {
    exp.push(TEXT_2_HUMAN);
    exp.push(TEXT_1_HUMAN);
  } else if (VERSION === 7) {
    exp.push(TEXT_1_CLIMATE);
    exp.push(TEXT_2_CLIMATE);
  } else if (VERSION === 8) {
    exp.push(TEXT_2_CLIMATE);
    exp.push(TEXT_1_CLIMATE);
  }


  exp.push(save_data);

  // debrief
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
