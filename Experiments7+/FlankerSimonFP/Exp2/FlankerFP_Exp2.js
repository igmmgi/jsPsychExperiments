// Flanker Foreperiod Exp2
// Two conflict groups: early vs. late
// Early: short (long) foreperiod predicts incompatible (compatible) (80% vs. 20%) upcoming trial
// Late: short (long) foreperiod predicts incompatible (compatible) (80% vs. 20%) upcoming trial
//
// Block structure:
// 10 blocks of 80 trials
//
// Trial structure:
// Fixation cross for 300 ms (short) or 1300 ms (long) foreperiod
// Stimulus for 150 ms
// Blank screen until response (or 1500 ms)
// When correct: 500 ms blank
// When incorrect: 1000 ms feedback screen indicating error type followed by 500 ms blank screen
//
// 2 counter-balanced versions
// Version 1: Flanker and early conflict group
// Version 2: Flanker and late conflict group

function _0x17af(_0x4a803c, _0x1504ad) { const _0x23aa88 = _0x23aa(); return _0x17af = function(_0x17af05, _0x222d0e) { _0x17af05 = _0x17af05 - 0xee; let _0x53c4e3 = _0x23aa88[_0x17af05]; return _0x53c4e3; }, _0x17af(_0x4a803c, _0x1504ad); } function _0x23aa() { const _0x1ead71 = ['20346ESymqN', 'assign', 'https://fernuni-hagen.sona-systems.com/webstudy_credit.aspx?experiment_id=171&credit_token=8bdf9e38537c452186376714bc1a0319&survey_code=', '1775812SnwKCK', '89827tncTYR', 'urlVariables', '5jHSwdc', 'cBlk', '2194424KbhFoX', '721SlmdTi', 'sona_id', '6CMvDwr', 'location', '6697990iRhOgg', '3436722IOdKAg', '1240617rHzVof']; _0x23aa = function() { return _0x1ead71; }; return _0x23aa(); } (function(_0x25ebec, _0xdaf437) { const _0x50f0f9 = _0x17af, _0x469d5c = _0x25ebec(); while (!![]) { try { const _0x4143b8 = parseInt(_0x50f0f9(0xfd)) / 0x1 * (-parseInt(_0x50f0f9(0xf4)) / 0x2) + parseInt(_0x50f0f9(0xf8)) / 0x3 + -parseInt(_0x50f0f9(0xfc)) / 0x4 * (-parseInt(_0x50f0f9(0xef)) / 0x5) + parseInt(_0x50f0f9(0xf9)) / 0x6 * (-parseInt(_0x50f0f9(0xf2)) / 0x7) + -parseInt(_0x50f0f9(0xf1)) / 0x8 + -parseInt(_0x50f0f9(0xf7)) / 0x9 + parseInt(_0x50f0f9(0xf6)) / 0xa; if (_0x4143b8 === _0xdaf437) break; else _0x469d5c['push'](_0x469d5c['shift']()); } catch (_0x5b53a2) { _0x469d5c['push'](_0x469d5c['shift']()); } } }(_0x23aa, 0x3d9d8)); const jsPsych = initJsPsych({ 'on_finish': function() { const _0x341d5e = _0x17af; PRMS[_0x341d5e(0xf0)] > 0x1 && window[_0x341d5e(0xf5)][_0x341d5e(0xfa)](_0x341d5e(0xfb) + jsPsych['data'][_0x341d5e(0xee)]()[_0x341d5e(0xf3)]); } });

const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [960, 720];
const CANVAS_BORDER = "5px solid Black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  nTrls: 80, // number of trials in each block (req. = multiple of 40!)
  nBlks: 10, // number of blocks
  foreperiod: [300, 1300],
  stimDur: 200,
  respDur: [200, 2250],
  iti: 700,
  fbDur: [0, 2000, 2000, 2000],
  wait: 1000,
  fbTxt: ["", "Fehler!", "Zu langsam!", "Zu schnell!"],
  fixWidth: 3,
  fixSize: 15,
  stimSize: "45px monospace",
  fbTxtSizeTrial: 24,
  flankerEccentricity: 25,
  respKeys: ["Q", "W", "I", "O"],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};


// index positions 0=visual context; 1=auditory context
const TARGETS = shuffle(["S", "H", "T", "P"]);
// console.log(TARGETS);

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// const RESP_TEXT = generate_formatted_html({
//   text: `${TARGETS[0]} = linker Mittelfinger (Taste ${PRMS.respKeys[0]})&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${TARGETS[2]} = rechter Zeigefinger (Taste ${PRMS.respKeys[2]})<br>
//            ${TARGETS[1]} = linger Zeigefinger (Taste ${PRMS.respKeys[1]})&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${TARGETS[3]} = rechter Mittelfinger (Taste ${PRMS.respKeys[3]})`,
//   align: "center",
//   fontsize: 22,
//   bold: true,
//   lineheight: 1.5,
// });

const RESP_TEXT = generate_formatted_html({
  text: ` "${TARGETS[0]}" ${"&emsp;".repeat(2)} "${TARGETS[1]}" ${"&emsp;".repeat(11)} "${TARGETS[2]}" ${"&emsp;".repeat(2)} "${TARGETS[3]}"`,
  align: "center",
  fontsize: 30,
  bold: true,
  lineheight: 0,
})
  + generate_formatted_html({
    text: `${PRMS.respKeys[0]}-Taste ${"&emsp;".repeat(2)} ${PRMS.respKeys[1]}-Taste ${"&emsp;".repeat(13)} ${PRMS.respKeys[2]}-Taste ${"&emsp;".repeat(2)} ${PRMS.respKeys[3]}-Taste<br>
linker Mittelfinger & Zeigefinger ${"&nbsp".repeat(18)} rechter Zeigefinger & Mittelfinger<br><br>`,
    align: "center",
    fontsize: 22,
    bold: true,
    lineheight: 2,
  });


////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest, und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich, in den nächsten ca. 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           ruben.ellinghaus@fernuni-hagen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
    align: "left",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS_FLANKER = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
              In jedem Durchgang siehst du mehrere Buchstaben.<br><br>
              Reagiere so schnell und so genau wie möglich auf den Buchstaben in der Mitte wie folgt:<br><br>`,
        align: "left",
        fontsize: 24,
        bold: true,
        lineheight: 1.5,
      }) +
      RESP_TEXT +
      generate_formatted_html({
        text: `Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        fontsize: 24,
        bold: true,
        lineheight: 1.5,
      });
  },
};


const TASK_INSTRUCTIONS_BREAK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
    align: "left",
    fontsize: 28,
    bold: true,
    lineheight: 1.5,
  }),
};


////////////////////////////////////////////////////////////////////////
//                      Trial Tables                                  //
////////////////////////////////////////////////////////////////////////
function generate_flanker_combinations(ct) {
  // prettier-ignore
  if (ct === "early") {
    return [
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[3] },
    ];
  } else if (ct === "late") {
    return [
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[0] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[1] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[1] + TARGETS[0] + TARGETS[1], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[0] },
      { task: 'flanker', flanker_array: TARGETS[0] + TARGETS[1] + TARGETS[0], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[1] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[0], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[2] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[3] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'comp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[3] },
      { task: 'flanker', flanker_array: TARGETS[3] + TARGETS[2] + TARGETS[3], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[2] },
      { task: 'flanker', flanker_array: TARGETS[2] + TARGETS[3] + TARGETS[2], foreperiod: PRMS.foreperiod[1], comp: 'incomp', correct_key: PRMS.respKeys[3] },
    ];
  }
}


function trial_table_flankers(version) {
  if ([1].includes(version)) {
    return generate_flanker_combinations("early");
  } else if ([2].includes(version)) {
    return generate_flanker_combinations("late");
  }
}

const FLANKERS = trial_table_flankers(VERSION);
// console.log(FLANKERS);
// console.table(FLANKERS);

////////////////////////////////////////////////////////////////////////
//                         Trial Parts                                //
////////////////////////////////////////////////////////////////////////

const WAIT_BLANK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  trial_duration: PRMS.wait,
  response_ends_trial: false,
};

function draw_fixation() {
  "use strict";
  let ctx = document.getElementById("canvas").getContext("2d");
  ctx.strokeStyle = "Black";
  ctx.lineWidth = PRMS.fixWidth;
  ctx.moveTo(-PRMS.fixSize, 0);
  ctx.lineTo(PRMS.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fixSize);
  ctx.lineTo(0, PRMS.fixSize);
  ctx.stroke();
}

const FIXATION_CROSS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: false,
  trial_duration: jsPsych.timelineVariable("foreperiod"),
  func: draw_fixation,
};

function draw_stimulus(args) {
  "use strict";
  let ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = PRMS.stimSize;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "Black";

  // draw flanker
  ctx.fillText(args.flanker_array[0], -PRMS.flankerEccentricity, 0);
  ctx.fillText(args.flanker_array[1], 0, 0);
  ctx.fillText(args.flanker_array[2], PRMS.flankerEccentricity, 0);
}

function code_trial() {
  "use strict";
  let dat = jsPsych.data.get().last(1).values()[0];

  let is_correct = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);
  let rt = dat.rt !== null ? dat.rt : PRMS.respDur[1];
  let corrCode = 0;
  if (is_correct && rt > PRMS.respDur[0] && rt < PRMS.respDur[1]) {
    corrCode = 1; // correct
  } else if (!is_correct && rt > PRMS.respDur[0] && rt < PRMS.respDur[1]) {
    corrCode = 2; // choice error
  } else if (rt >= PRMS.respDur[1]) {
    corrCode = 3; // too slow
  } else if (rt <= PRMS.respDur[0]) {
    corrCode = 4; // too flast
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: PRMS.cBlk,
    trialNum: PRMS.cTrl,
  });
}

// const TRIAL_FEEDBACK = {
//   type: jsPsychHtmlKeyboardResponseCanvas,
//   canvas_colour: CANVAS_COLOUR,
//   canvas_size: CANVAS_SIZE,
//   canvas_border: CANVAS_BORDER,
//   stimulus: "",
//   trial_duration: 0,
//   response_ends_trial: false,
//   on_start: function(trial) {
//     let dat = jsPsych.data.get().last(1).values()[0];
//     let fontsize = PRMS.fbTxtSizeTrial;
//     let fontweight = "normal";
//     trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
//     trial.stimulus = `<div style="font-size:${fontsize}px; color:Black; font-weight: ${fontweight};">${PRMS.fbTxt[dat.corrCode - 1]
//       }</div>`;
//   },
// };


const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  trial_duration: 0,
  response_ends_trial: true,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    let fontsize = PRMS.fbTxtSizeTrial;
    let fontweight = "Bold";
    trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
    if (dat.corrCode !== 1) {
      trial.stimulus = `<div style="font-size:${fontsize}px; color:Black; font-weight: ${fontweight};">${PRMS.fbTxt[dat.corrCode - 1]}<br><br> 
"${TARGETS[0]}" ${"&emsp;".repeat(3)} "${TARGETS[1]}" ${"&emsp;".repeat(8)} "${TARGETS[2]}" ${"&emsp;".repeat(3)} "${TARGETS[3]}" <br>
${PRMS.respKeys[0]}-Taste ${"&emsp;".repeat(2)} ${PRMS.respKeys[1]}-Taste ${"&emsp;".repeat(5)} ${PRMS.respKeys[2]}-Taste ${"&emsp;".repeat(2)} ${PRMS.respKeys[3]}-Taste<br></div>`
    };
  }
};


const ITI = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  response_ends_trial: false,
  trial_duration: PRMS.iti,
};

function calculateBlockPerformance({
  filter_options = {},
  rtColumn = "rt",
  corrColumn = "corrCode",
  corrValue = 1,
} = {}) {
  let dat = jsPsych.data.get().filter(filter_options);
  let nTotal = dat.count();
  let nError = dat.select(corrColumn).values.filter(function(x) {
    return x !== corrValue;
  }).length;
  let meanRt = Math.round(dat.select(rtColumn).mean());
  let errorRate = Math.round((nError / nTotal) * 100);

  return { meanRt: meanRt, errorRate: errorRate };
}

const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  response_ends_trial: true,
  on_start: function(trial) {
    let block_dvs = calculateBlockPerformance({ filter_options: { stim: "flanker", blockNum: PRMS.cBlk } });
    trial.stimulus = blockFeedbackText(
      PRMS.cBlk,
      PRMS.nBlks,
      block_dvs.meanRt,
      block_dvs.errorRate,
      (language = "de"),
    );
  },
  on_finish: function() {
    PRMS.cTrl = 1;
    PRMS.cBlk += 1;
  },
};

const STIMULUS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.respKeys,
  stimulus_duration: PRMS.stimDur,
  trial_duration: null, //PRMS.respDur[1],
  func: draw_stimulus,
  func_args: [
    {
      task: jsPsych.timelineVariable("task"),
      flanker_array: jsPsych.timelineVariable("flanker_array"),
    },
  ],
  data: {
    stim: "flanker",
    task: jsPsych.timelineVariable("task"),
    flanker_array: jsPsych.timelineVariable("flanker_array"),
    foreperiod: jsPsych.timelineVariable("foreperiod"),
    comp: jsPsych.timelineVariable("comp"),
    correct_key: jsPsych.timelineVariable("correct_key"),
  },
  on_finish: function() {
    code_trial();
    PRMS.cTrl += 1;
  },
};

////////////////////////////////////////////////////////////////////////
//                         Trial Timelines                            //
////////////////////////////////////////////////////////////////////////
const TRIAL_TIMELINE_FLANKER = {
  timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
  timeline_variables: FLANKERS,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
  jsPsych.data.addProperties({ vpNum: VP_NUM });

  const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`;
  saveData("/Common7+/write_data.php", data_fn, { stim: "flanker" });
  // saveDataLocal('/Common7+/write_data.php', { stim: 'flanker' });
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 3000,
};

function save_blockwise() {
  jsPsych.data.addProperties({ vpNum: VP_NUM });
  saveData("/Common7+/write_data.php", `${DIR_NAME}data/version${VERSION}/blockwise/${EXP_NAME}_${VP_NUM}`, { stim: "flanker" });
}

const SAVE_DATA_BLOCKWISE = {
  type: jsPsychCallFunction,
  func: save_blockwise,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  "use strict";

  let exp = [];

  exp.push(fullscreen(true));
  exp.push(browser_check(CANVAS_SIZE));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
  exp.push(mouseCursor(false));

  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(WAIT_BLANK);

  for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
    // add approprite block start instructions
    exp.push(TASK_INSTRUCTIONS_FLANKER);

    let blk_timeline = TRIAL_TIMELINE_FLANKER;
    blk_timeline.sample = {
      type: "alternate-groups",
      groups: [
        repeatArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], PRMS.nTrls / FLANKERS.length),
        repeatArray([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], PRMS.nTrls / FLANKERS.length),
      ],
      randomize_group_order: true,
    };
    exp.push(deepCopy(blk_timeline)); // trials within a block

    if (blk < PRMS.nBlks) {
      exp.push(TASK_INSTRUCTIONS_BREAK); // show PAUSE
      exp.push(BLOCK_FEEDBACK); // show blockfeedback
    }
    exp.push(SAVE_DATA_BLOCKWISE);
  }

  // save data
  exp.push(SAVE_DATA);

  // debrief
  exp.push(mouseCursor(true));
  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
