// Voluntary Task Switching paradigm with two tasks
// Task 1: Letter task (flanker): Respond to the central letter (H vs. S)
// Task 2: Colour task (stroop): Respond to font colour (green vs. blue)
//
// At the start of each trial participants can either choose freely which
// task to perform (free choice), or are forced to select either the letter
// or the colour task (forced choice). 50/50 proportions of free vs. forced choice.
// Task choice is always made with the left hand using the "Q"/"W" keys (left hand) with
// side (letter left/colour right vs. colour left/letter right) randomly assigned per
// participant. Task response (H vs. S or green vs. blue) are made
// with the "O"/"P" keys (right hand). The specific S-R mappings (e.g., H -> left, S -> right)
// were randonly assigned on a per participant basis.
//
// Block structure:
// 8 blocks of 96 trials
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
//
// Trial structure:
// Task choice screen with two tasks (free choice) or a single task (forced choice) displayed
// Following task selection, a surrounding rectangle indicated task choice (250 ms)
// Respective task shown (no deadline)
// Feedback screen (750ms) with the following options:
// In correct trials -> blank ITI
// In error trials -> 1.5 second screen showing the correct mapping followed by blank ITI


const jsPsych = initJsPsych({
  on_finish: function() {
    if (PRMS.block >= 8) {
      window.location.assign(
        "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=290&credit_token=1dc5aa076e294e90af2378b1cff7bd8f&survey_code=" +
        jsPsych.data.urlVariables().sona_id
      );
    }
  },
});


////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  screen_res: [960, 720], // minimum screen resolution requested
  n_blocks: 8, // number of blocks
  n_trials: 96, // number of trials per block
  fixSize: 15, // duration of the fixation cross
  fixWidth: 5, // size of fixation cross
  task_selection_duration: 500, // duration of the task selection screen
  feedback_text: ["Falsch!", ""],
  iti: 500, // duration of the inter-trial-interval
  feedback_duration: [1500, 0],
  stimulus_font: "60px Monospace",
  feedback_font: "40px Monospace",
  task_side: shuffle(["Letter", "Colour"]),
  Colour_task: shuffle(["GRÜN", "BLAU"]),
  Letter_task: shuffle(["H", "S"]),
  colours: ["rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)"],
  response_keys_lh: ["Q", "W"],
  response_keys_rh: ["O", "P"],
  task_choice_pos_x: 75,
  block: 1,
  trial: 1,
};


const DE_EN = { "GRÜN": "green", "BLAU": "blue", "Colour": "Farbe", "Letter": "Buchstabe" };

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
               Die Teilnahme ist freiwillig und Du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass Du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 45 Minuten konzentriert zu arbeiten.<br><br>
               Bei Fragen oder Problemen wende dich bitte an:<br><br> 
               noah.scheurer@student.uni-tuebingen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
    align: "left",
    fontsize: 30,
    width: "1200px",
    lineheight: 1.5,
  }),
};

const TASK_INSTRUCTIONS1 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `In diesem Experiment gibt es zwei Aufgaben. Mit der linken Hand wird zunächst die Aufgabe ausgewählt und mit der rechten Hand wird die Aufgabe bearbeitet.<br><br>
              Auswahl der Aufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf den Tasten "${PRMS.response_keys_lh[0]}" und "${PRMS.response_keys_lh[1]}".<br><br> 
              Bearbeitung der Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf den Tasten "${PRMS.response_keys_rh[0]}" und "${PRMS.response_keys_rh[1]}".<br><br><br>
              Drücke die "G"-Taste, um fortzufahren!`,
    align: "left",
    fontsize: 30,
    width: "1200px",
    lineheight: 1.5,
  }),
  choices: ["G"],
};

// TO DO: move to separate CSS file?
const RESPONSE_MAPPING = `<html>
<head>
   <style>
      .container {
	background-color: ${CANVAS_COLOUR};
	width: 1000px;
	margin: 10px auto;
	display: grid;
	grid-template-rows: 50px 100px 20px 80px;
	grid-template-columns: 220px 220px 80px 220px 220px;
}
.header1{
  grid-column: 1/3;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.header2{
  grid-column: 4/6;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.itemL {
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
.itemR {
  grid-column: 4/6;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
</style>
</head>
<body>
<div class="container">
	<div class="header1 header--1">Auswahl der Aufgabe = Linke Hand</div>
	<div class="header2 header--2">Bearbeitung der Aufgabe = Rechte Hand</div>
	<div class="itemL item--3">Linke Aufgabe<br>(${DE_EN[PRMS.task_side[0]]})<br>${PRMS.response_keys_lh[0]}-Taste</div>
	<div class="itemL item--4">Rechte Aufgabe<br>(${DE_EN[PRMS.task_side[1]]})<br>${PRMS.response_keys_lh[1]}-Taste</div>
	<div class="itemR item--6">${DE_EN[PRMS.task_side[0]]}-Aufgabe:<br>${PRMS[PRMS.task_side[0] + "_task"][0]} ${"&emsp;".repeat(
  2,
)}${PRMS[PRMS.task_side[0] + "_task"][1]}<br>${PRMS.response_keys_rh[0]}-Taste ${"&emsp;".repeat(1)}${PRMS.response_keys_rh[1]}-Taste<br></div>
<div class="itemR item--11">${DE_EN[PRMS.task_side[1]]}-Aufgabe:<br>${PRMS[PRMS.task_side[1] + "_task"][0]} ${"&emsp;".repeat(
  2,
)}${PRMS[PRMS.task_side[1] + "_task"][1]}<br>${PRMS.response_keys_rh[0]}-Taste ${"&emsp;".repeat(1)} ${PRMS.response_keys_rh[1]}-Taste<br></div>
	</div>
</body>
</html>`;


// TO DO: move to separate CSS file?
const RESPONSE_MAPPING_TASK = `<html>
<head>
   <style>
      .container {
	background-color: ${CANVAS_COLOUR};
	width: 1000px;
	margin: 10px auto;
	display: grid;
	grid-template-rows: 150px;
	grid-template-columns: 0;
}
.item {
  grid-column: 2;
	font-size: 22px;
	font-weight: bold;
	color: black;
  text-align: center;
}
</style>
</head>
<body>
<div class="container">
	<div class="item item--1">${PRMS.feedback_text[1]}<br><br>${DE_EN[PRMS.task_side[0]]}-Aufgabe:<br>${PRMS[PRMS.task_side[0] + "_task"][0]} ${"&emsp;".repeat(2,
)}${PRMS[PRMS.task_side[0] + "_task"][1]}<br>${PRMS.response_keys_rh[0]}-Taste ${"&emsp;".repeat(1)}${PRMS.response_keys_rh[1]}-Taste<br><br><br><br></div>
<div class="item item--11">${DE_EN[PRMS.task_side[1]]}-Aufgabe:<br>${PRMS[PRMS.task_side[1] + "_task"][0]} ${"&emsp;".repeat(2,
)}${PRMS[PRMS.task_side[1] + "_task"][1]}<br>${PRMS.response_keys_rh[0]}-Taste ${"&emsp;".repeat(1)} ${PRMS.response_keys_rh[1]}-Taste<br></div>
	</div>
</body>
</html>`;


const TASK_INSTRUCTIONS2 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus:
    generate_formatted_html({
      text: `Für die Buchstabenaufgabe musst Du entscheiden, ob der Buchstabe in der Mitte ein H oder S ist (ignoriere die umliegenden Buchstaben).<br><br>
             Für die Farbaufgabe musst Du entscheiden, ob das Wort in blauer oder grüner Schriftfarbe ist (ignoriere die Wortbedeutung).`,
      align: "left",
      fontsize: 30,
      width: "1200px",
      lineheight: 1.5,
    }) +
    RESPONSE_MAPPING +
    generate_formatted_html({
      text: `Drücke die "X"- Taste, um fortzufahren.`,
      align: "center",
      fontsize: 30,
      width: "1200px",
      lineheight: 1.5,
    }),
  choices: ["X"],
};

const TASK_INSTRUCTIONS3 = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: generate_formatted_html({
    text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br><br>
               Wenn nur eine Aufgabe präsentiert wird, wähle diese bitte mit der linken Hand aus und bearbeite sie.<br><br>
               Wenn beide Aufgaben präsentiert werden, kannst Du dir frei aussuchen, welche Du bearbeitest.<br><br>
               Drücke die "T"- Taste, um fortzufahren.`,
    align: "left",
    fontsize: 30,
    width: "1200px",
    lineheight: 1.5,
  }),
  choices: ["T"],
};


const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus =
      generate_formatted_html({
        text: `Start Block ${PRMS.block} von ${PRMS.n_blocks}<br><br>
                       Wähle selbst, welche Aufgabe du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Wähle und bearbeite sonst die Aufgabe, die präsentiert ist.<br><br>`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
      }) +
      RESPONSE_MAPPING +
      generate_formatted_html({
        text: `Um den Block zu starten, drücke eine beliebige Taste.`,
        align: "center",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
      });
  },
};

const BLOCK_END = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  on_start: function(trial) {
    trial.stimulus = generate_formatted_html({
      text: `Ende Block ${PRMS.block} von ${PRMS.n_blocks}<br><br>
             Kurze Pause.<br><br>
             Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
      align: "left",
      fontsize: 30,
      width: "1200px",
      lineheight: 1.5,
    });
  },
  on_finish: function() {
    PRMS.block += 1;
    PRMS.trial = 1;
  },
};


function draw_task_choice(args) {
  let ctx = document.getElementById("canvas").getContext("2d");
  let dat = jsPsych.data.get().last(1).values()[0];

  // draw fixation cross
  ctx.lineWidth = PRMS.fixWidth;
  ctx.moveTo(-PRMS.fixSize, 0);
  ctx.lineTo(PRMS.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fixSize);
  ctx.lineTo(0, PRMS.fixSize);
  ctx.stroke();

  // draw text
  ctx.font = PRMS.feedback_font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.font = "50px Arial";

  let draw_text = [false, false];

  if (args.free_forced === "free") {
    draw_text = [1, 1];
  } else if (args.free_forced === "forced") {
    draw_text[PRMS.task_side.indexOf(args.forced_task)] = true;
  }

  // text
  let text_left;
  let text_right;
  if (draw_text[0]) {
    ctx.textAlign = "right";
    ctx.fillText(DE_EN[PRMS.task_side[0]], -PRMS.task_choice_pos_x, 0);
    text_left = ctx.measureText(DE_EN[PRMS.task_side[0]]);
  }
  if (draw_text[1]) {
    ctx.textAlign = "left";
    ctx.fillText(DE_EN[PRMS.task_side[1]], PRMS.task_choice_pos_x, 0);
    text_right = ctx.measureText(DE_EN[PRMS.task_side[1]]);
  }

  // rectangle
  if (args.draw_rectangle) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    if (dat.key_press === PRMS.response_keys_lh[0].toLowerCase()) {
      ctx.rect(0 - PRMS.task_choice_pos_x - text_left.width, -25, text_left.width, 50);
    } else if (dat.key_press === PRMS.response_keys_lh[1].toLowerCase()) {
      ctx.rect(PRMS.task_choice_pos_x, -25, text_right.width, 50);
    }
    ctx.stroke();
  }


}

const TASK_CHOICE_SELECTION = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: null,
  trial_duration: PRMS.tooSlow,
  func: draw_task_choice,
  func_args: null,
  data: {
    stim_type: "vts",
    free_forced: jsPsych.timelineVariable("free_forced"),
    forced_task: jsPsych.timelineVariable("forced_task"),
  },
  on_start: function(trial) {
    "use strict";

    if (trial.data.free_forced === "free") {
      trial.choices = PRMS.response_keys_lh;
    } else if (trial.data.free_forced === "forced") {
      trial.choices = [PRMS.response_keys_lh[PRMS.task_side.indexOf(trial.data.forced_task)]];
    }

    trial.func_args = [
      {
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
        draw_rectangle: false,
      },
    ];
  },
};

const TASK_CHOICE_FEEDBACK = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: false,
  choices: null,
  trial_duration: PRMS.task_selection_duration,
  func: draw_task_choice,
  func_args: null,
  data: {
    stim_type: "vts_tcr",
    free_forced: jsPsych.timelineVariable("free_forced"),
    forced_task: jsPsych.timelineVariable("forced_task"),
  },
  on_start: function(trial) {
    "use strict";
    trial.func_args = [
      {
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
        draw_rectangle: true,
      },
    ];
  },
  on_finish: function() {
    code_trial_task_selection();
  },
};

function code_trial_task_selection() {
  "use strict";

  let dat = jsPsych.data.get().last(2).values()[0];

  // Which task did they choose?
  let selected_task;
  if (dat.key_press === PRMS.response_keys_lh[0].toLowerCase()) {
    selected_task = PRMS.task_side[0];
  } else if (dat.key_press === PRMS.response_keys_lh[1].toLowerCase()) {
    selected_task = PRMS.task_side[1];
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    selected_task: selected_task,
    rt: dat.rt,
    key_press: dat.key_press,
    correct: 1,
    trial_phase: "task_selection",
    block_num: PRMS.block,
    trial_num: PRMS.trial,
    distractor: "na",
    target: "na",
    compatibility: "na",
    correct_key: "na",
  });
}

function draw_stimulus(args) {
  "use strict";
  let ctx = document.getElementById("canvas").getContext("2d");

  ctx.font = PRMS.stimulus_font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";

  // stimulus
  ctx.fillStyle = args.colour;
  ctx.fillText(args.stim, 0, 0);

}

const VTS = {
  type: jsPsychStaticCanvasKeyboardResponse,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  translate_origin: true,
  response_ends_trial: true,
  choices: PRMS.response_keys_rh,
  trial_duration: null,
  func: draw_stimulus,
  func_args: null,
  data: {
    stim_type: "vts_tcr",
    free_forced: jsPsych.timelineVariable("free_forced"),
    forced_task: jsPsych.timelineVariable("forced_task"),
    target: jsPsych.timelineVariable("target"),
    distractor: jsPsych.timelineVariable("distractor"),
    compatibility: jsPsych.timelineVariable("compatibility"),
    correct_key: jsPsych.timelineVariable("correct_key"),
  },
  on_start: function(trial) {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let stim;
    let colour;
    if (dat.selected_task === "Letter") {
      stim = PRMS.Letter_task[jsPsych.timelineVariable("distractor")] + PRMS.Letter_task[jsPsych.timelineVariable("target")] + PRMS.Letter_task[jsPsych.timelineVariable("distractor")];
      colour = "Black"
    } else if (dat.selected_task === "Colour") {
      stim = PRMS.Colour_task[jsPsych.timelineVariable("distractor")];
      colour = DE_EN[PRMS.Colour_task[jsPsych.timelineVariable("target")]];
    }

    trial.func_args = [{ stim: stim, colour: colour }];
  },
  on_finish: function() {
    code_trial_task_execution();
  },
};

function code_trial_task_execution() {
  "use strict";

  // get selected task
  let dat = jsPsych.data.get().last(2).values()[0];
  let selected_task = dat.selected_task;

  // get current task
  dat = jsPsych.data.get().last(1).values()[0];
  let target;
  let distractor;
  if (selected_task === "Colour") {
    target = PRMS.Colour_task[dat.target];
    distractor = PRMS.Colour_task[dat.distractor];
  } else if (selected_task === "Letter") {
    target = PRMS.Letter_task[dat.target];
    distractor = PRMS.Letter_task[dat.distractor];
  }

  let correct = jsPsych.pluginAPI.compareKeys(dat.correct_key, dat.key_press) ? 1 : 0;

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    selected_task: selected_task,
    correct: correct,
    trial_phase: "task_execution",
    block_num: PRMS.block,
    trial_num: PRMS.trial,
    distractor: distractor,
    target: target,
  });

  PRMS.trial += 1;
}


const TRIAL_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponseCanvas,
  canvas_colour: CANVAS_COLOUR,
  canvas_size: CANVAS_SIZE,
  canvas_border: CANVAS_BORDER,
  stimulus: "",
  response_ends_trial: false,
  trial_duration: 0,
  on_start: function(trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    if (dat.correct === 0) {
      trial.trial_duration = PRMS.feedback_duration[dat.correct];
      trial.stimulus = RESPONSE_MAPPING_TASK;
    }
  },
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

// prettier-ignore
const TRIAL_TABLE = [
  { free_forced: 'free', forced_task: 'na', target: 0, distractor: 0, compatibility: "comp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'free', forced_task: 'na', target: 1, distractor: 1, compatibility: "comp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'free', forced_task: 'na', target: 0, distractor: 1, compatibility: "incomp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'free', forced_task: 'na', target: 1, distractor: 0, compatibility: "incomp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'free', forced_task: 'na', target: 0, distractor: 0, compatibility: "comp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'free', forced_task: 'na', target: 1, distractor: 1, compatibility: "comp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'free', forced_task: 'na', target: 0, distractor: 1, compatibility: "incomp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'free', forced_task: 'na', target: 1, distractor: 0, compatibility: "incomp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'forced', forced_task: 'Letter', target: 0, distractor: 0, compatibility: "comp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'forced', forced_task: 'Letter', target: 1, distractor: 1, compatibility: "comp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'forced', forced_task: 'Letter', target: 0, distractor: 1, compatibility: "incomp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'forced', forced_task: 'Letter', target: 1, distractor: 0, compatibility: "incomp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'forced', forced_task: 'Colour', target: 0, distractor: 0, compatibility: "comp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'forced', forced_task: 'Colour', target: 1, distractor: 1, compatibility: "comp", correct_key: PRMS.response_keys_rh[1] },
  { free_forced: 'forced', forced_task: 'Colour', target: 0, distractor: 1, compatibility: "incomp", correct_key: PRMS.response_keys_rh[0] },
  { free_forced: 'forced', forced_task: 'Colour', target: 1, distractor: 0, compatibility: "incomp", correct_key: PRMS.response_keys_rh[1] },
];

const TRIAL_TIMELINE = {
  timeline: [TASK_CHOICE_SELECTION, TASK_CHOICE_FEEDBACK, VTS, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE,
};


////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
  jsPsych.data.addProperties({ vp_num: VP_NUM });
  saveData("/Common/write_data.php", `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vts_tcr" });
  // saveDataLocal(`${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vts_tcr" });
}

const SAVE_DATA = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 3000,
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function gen_exp_seq() {
  "use strict";

  let exp = [];

  // setup
  exp.push(fullscreen(true));
  exp.push(browser_check(PRMS.screen_res));
  exp.push(resize_browser());
  exp.push(welcome_message());
  exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
  exp.push(mouseCursor(false));

  // instructions
  exp.push(WELCOME_INSTRUCTIONS);
  exp.push(TASK_INSTRUCTIONS1);
  exp.push(TASK_INSTRUCTIONS2);
  exp.push(TASK_INSTRUCTIONS3);

  for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
    exp.push(BLOCK_START);
    let blk_timeline;
    blk_timeline = { ...TRIAL_TIMELINE };
    blk_timeline.sample = {
      type: "fixed-repetitions",
      size: PRMS.n_trials / TRIAL_TABLE.length,
    };
    exp.push(blk_timeline); // trials within a block
    if (blk < PRMS.n_blocks - 1) {
      exp.push(BLOCK_END);
    }
  }

  // debrief
  exp.push(mouseCursor(true));

  // save data
  exp.push(SAVE_DATA);

  exp.push(end_message());
  exp.push(fullscreen(false));

  return exp;
}
const EXP = gen_exp_seq();

jsPsych.run(EXP);
