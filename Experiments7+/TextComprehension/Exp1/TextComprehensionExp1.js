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
const CONSENT_SCREEN = {
  type: jsPsychHtmlKeyboardResponse,
    stimulus: generate_formatted_html({
        text: `Einwilligungserklärung:<br><br>
               Herzlich willkommen bei unserer Studie "Text Verstehen"! Wir danken Ihnen für Ihr Interesse an dieser Studie.<br><br>
               Wir untersuchen mit dieser Studie, wie Menschen Sprache verstehen und verarbeiten.
               Ablauf der Studie: Das folgende Experiment besteht aus zwei kurzen Texten. Nach jedem Text, bitten wir Sie um eine Einschätzung auf einer Skala von 0 bis 100 %. Insgesamt dauert das Experiment ca. 2 Minuten. 
               Wir erheben von Ihnen Angaben zu Alter, Geschlecht, und und Händigkeit.
               Sollten Sie noch Fragen haben oder sich technische Probleme ergeben, wenden Sie sich damit bitte per mail an den Versuchsleiter/ die Versuchsleiterin.<br><br>
               Freiwilligkeit und Anonymität: Die Teilnahme an der Studie ist freiwillig. Sie können jederzeit und ohne Angabe von Gründen die Teilnahme an dieser Studie beenden. Wird die Studie vor Beendigung abgebrochen, werden die bis dahin erhobenen Daten nicht gespeichert. 
               Die im Rahmen dieser Studie erhobenen, oben beschriebenen Daten und persönlichen Mitteilungen werden vertraulich behandelt. So unterliegen diejenigen Projektmitarbeiter, die über personenbezogene Daten verfügen, der Schweigepflicht bzw. dem Datengeheimnis. Des Weiteren wird die Veröffentlichung der Ergebnisse der Studie in anonymisierter Form erfolgen, d. h. ohne dass Ihre Daten Ihrer Person zugeordnet werden können.<br><br>
               Datenschutz: Die Erhebung und Verarbeitung Ihrer oben beschriebenen persönlichen Daten erfolgt anonym unter Verwendung einer zufällig zugewiesenen Nummer und ohne Angabe Ihres Namens in der Abteilung Sprache & Kognition des Psychologischen Instituts der Universität Tübingen. IP-Adressen und/oder IDs der Erhebungsplattform werden nicht mit den Daten gespeichert. Damit ist es niemandem möglich, die erhobenen Daten mit Ihrem Namen in Verbindung zu bringen. Eine Löschung der Daten nach Abschluss des Experiments ist somit nicht möglich.	 Daten in digitaler Form werden auf dem passwortgeschützten Laufwerk der Arbeitsgruppe von Prof. Dr. Barbara Kaup an der Universität Tübingen gelagert. Sollten ausnahmsweise Daten in digitaler Form auf privaten PCs, zu denen sonst niemand anders Zugang hat, gespeichert werden, werden diese nach Beenden der Datenanalysen von den privaten PCs wieder gelöscht. Die anonymen Daten dieser Studie werden als offene Daten im Internet zugänglich gemacht. Damit folgt diese Studie den Empfehlungen der Deutschen Forschungsgemeinschaft (DFG) und der Deutschen Gesellschaft für Psychologie (DGPs) zur Qualitätssicherung in der Forschung.<br><br>
               Vergütung: Keine Vergütung<br><br>
               Verantwortlicher Ansprechpartner während der Studie: Lara Buchthal lara.buchthal@student.uni-tuebingen.de<br><br>
               Ich bestätige die Teilnehmerinformationen gelesen zu haben und bin mit der Teilnahme einverstanden.
               Meine Teilnahme erfolgt freiwillig. Ich weiß, dass ich die Möglichkeit habe, meine Teilnahme an dieser Studie jederzeit und ohne Angabe von Gründen abzubrechen, ohne dass mir daraus Nachteile entstehen. 
               Ich erkläre, dass ich mit der im Rahmen der Studie erfolgenden Aufzeichnung von Studiendaten und ihrer Verwendung in anonymisierter Form einverstanden bin.<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 18,
        width:'1250px'
    }),
};

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die nächsten ca. 2-3 Minuten konzentriert zu arbeiten.<br><br>
           Wir interessieren und dafür wie Menschen Sprache und Texte
           verstehen. Deine Aufgabe ist es zwei kurze Texte zu lesen und
           danach eine kurze Einschätzung auf einer Skala von 0-100%
           abzugeben. <br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           lara.buchthal@student.uni-tuebingen.de<br><br>
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
  require_movement: true,
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
  data: {
    stim: 'tc',
  },
};

const TEXT_1_CLIMATE = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_1_CLIMATE_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  require_movement: true,
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
  data: {
    stim: 'tc',
  },
};

const TEXT_2_HUMAN = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_2_HUMAN_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  require_movement: true,
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
  data: {
    stim: 'tc',
  },
};

const TEXT_2_CLIMATE = {
  type: jsPsychHtmlSliderResponse,
  stimulus: TEXT_2_CLIMATE_QUESTION,
  labels: ['0%', '25%', '50%', '75%', '100%'],
  require_movement: true,
  button_label: 'Weiter',
  post_trial_gap: PRMS.postTrialGap,
  data: {
    stim: 'tc',
  },
};

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
  exp.push(CONSENT_SCREEN);
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
