// Volitional Control Experiment modelled after Luo et al. (2024)
// Volition motivates cognitive performance at the response-execution level by attenuating task-irrelevant motor activations

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(180, 180, 180, 1)";
const CANVAS_SIZE = [720, 1280]; // height,width

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
  ntrlsp: 8, // number of trials in first block (practice)
  ntrlse: 40, // number of trials in subsequent blocks
  nblks: 8,
  fix_size: 20, // size of the fixation cross
  fix_width: 5, // width of fixation cross
  fix_duration: [800, 500], // duration of the fixation cross
  fix_colour: "Black", // colour of the fixation cross
  cue_duration: 1000, // duration of the cue
  cue_size: 100, // size of the cue
  cue_colours: shuffle(["Cyan", "Yellow"]),
  choice_feedback_duration: 1000,
  image_eccentricity: 200,
  feedback_duration: 1000,
  frame_size: [220, 220],
  frame_width: 10,
  frame_colour: "White",
  wait_duration: 1000,
  iti: 1000,
  choice_selection_keys: ["E", "P"],
  task_keys: ["E", "P"],
  task_shapes: shuffle(["circle", "diamond"]),
  task_colour: "White",
  task_size: 100,
  task_eccentricity: 200,
  task_duration: 300,
  too_fast: 0,
  too_slow: 1000,
  feedback_font: "50px Arial",
  feedback_text: ["Richtig!", "Falsch!", "Zu langsam!", "Zu schnell!"],
  feedback_duration: [1000, 1000, 1000, 1000], // feedback duration for response type (correct, incorrect, too slow, too fast)
  ctrl: 1, // count trials
  cblk: 1, // count blocks
};

// 2 counter balanced versions
const VERSION = 1; //Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });


////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  stimulus: generate_formatted_html({
    text: `Willkommen zu unserem Experiment:<br><br>
Die Teilnahme ist freiwillig und Du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass Du Dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
um das Experiment durchzuführen. Wir bitten Dich, die nächsten ca. 30-35 Minuten konzentriert zu arbeiten.<br><br>
Informationen zur Versuchspersonenstunde erhälst Du nach dem Experiment.
Bei Fragen oder Problemen wende Dich bitte an:<br><br>
XXX.XXX<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
    align: "left",
    color: "Black",
    fontsize: 30,
    bold: false,
  }),
  post_trial_gap: 1000,
};


const TASK_INSTRUCTIONS = {
  type: jsPsychHtmlKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  stimulus: "",
  post_trial_gap: 1000,
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Instructions ... <br>
Drücke eine beliebige Taste, um fortzufahren`,
      align: "left",
      color: "Black",
      fontsize: 30,
      bold: false,
    });
  },
};


const BLOCK_START = {
  type: jsPsychHtmlKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  stimulus: "",
  post_trial_gap: 1000,
  on_start: function (trial) {
    trial.stimulus = generate_formatted_html({
      text: `Block Start: ${PRMS.cblk} von ${PRMS.nblks}<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
      align: "left",
      color: "Black",
      fontsize: 30,
      bold: false,
    });
  },
};


function canvas_style(ctx) {
  ctx.fillStyle = CANVAS_COLOUR;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
  return ctx;
}


function clear_canvas(ctx) {
  ctx.fillStyle = CANVAS_COLOUR;
  ctx.fillRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
  return ctx;
}


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

function image_names() {
  // 394 available images
  let images = [];
  for (let i = 1; i <= 394; i++) { 
    images.push(`../images/house${i}.jpg`);
  }
  return images;
}

const IMAGES = shuffle(image_names()).slice(0, 256); // we need at 256 images to only repeat across free/forced
const IMAGES_FREE = shuffle(structuredClone(IMAGES));
const IMAGES_FORCED = shuffle(structuredClone(IMAGES));


const PRELOAD = {
  type: jsPsychPreload,
  images: [IMAGES_FREE, IMAGES_FORCED]
};


function draw_fixation(c) {
  "use strict";
  let ctx = c.getContext("2d");
  ctx = canvas_style(ctx);

  ctx.lineWidth = PRMS.fix_width;
  ctx.strokeStyle = PRMS.fix_colour;
  ctx.moveTo(-PRMS.fix_size, 0);
  ctx.lineTo(PRMS.fix_size, 0);
  ctx.stroke();
  ctx.moveTo(0, -PRMS.fix_size);
  ctx.lineTo(0, PRMS.fix_size);
  ctx.stroke();
}


const FIXATION_CROSS_800 = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: draw_fixation,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  trial_duration: PRMS.fix_duration[0],
};


const FIXATION_CROSS_500 = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: draw_fixation,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  trial_duration: PRMS.fix_duration[1],
};


function draw_colour_cue(c, args) {
  "use strict";
  let ctx = c.getContext("2d");
  ctx = canvas_style(ctx);

  // draw circle cue
  ctx.beginPath();
  ctx.arc(0, 0, PRMS.cue_size, 0, 2 * Math.PI);
  ctx.fillStyle = args.colour;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = args.colour;
  ctx.stroke();
}


const COLOUR_CUE = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  trial_duration: PRMS.cue_duration,
  on_start: function (trial) {
    "use strict";
    trial.stimulus = function (c) {
      draw_colour_cue(c, {
        colour: jsPsych.evaluateTimelineVariable("cue"),
      });
    };
  },
};


function draw_images(c, args) {
  "use strict";
  let ctx = c.getContext("2d");
  ctx = canvas_style(ctx);

  // image
  const img_left = new Image();
  img_left.src = args.choice_type === "free" ? IMAGES_FREE[0] : IMAGES_FORCED[0];
  const img_right = new Image();
  img_right.src =  args.choice_type === "free" ? IMAGES_FREE[1] : IMAGES_FORCED[1];

  ctx.drawImage(img_left, -PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2);
  ctx.drawImage(img_right, PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2);

  // hack to hide images
  if (args.hide_image) {
    ctx.beginPath();
    ctx.fillStyle = "Black";
    ctx.rect(-PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2, img_left.width, img_left.height); // Add a rectangle to the current path
    ctx.rect( PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2, img_left.width, img_left.height); // Add a rectangle to the current path
    ctx.fill(); // Render the path
  }

  // draw selection feedback rectangle
  if (args.selection === "left") {
    ctx.beginPath();
    ctx.strokeStyle = PRMS.frame_colour;
    ctx.lineWidth = PRMS.frame_width * args.frame_size;
    ctx.rect(
      -(PRMS.frame_size[0] / 2) - PRMS.image_eccentricity,
      -PRMS.frame_size[1] / 2,
      PRMS.frame_size[0],
      PRMS.frame_size[1],
    );
    ctx.stroke();
  } else if (args.selection === "right") {
    ctx.beginPath();
    ctx.strokeStyle = PRMS.frame_colour;
    ctx.lineWidth = PRMS.frame_width * args.frame_size;
    ctx.rect(
      -(PRMS.frame_size[0] / 2) + PRMS.image_eccentricity,
      -PRMS.frame_size[1] / 2,
      PRMS.frame_size[0],
      PRMS.frame_size[1],
    );
    ctx.stroke();
  }

}


function code_selection_response() {
  "use strict";
  let dat = jsPsych.data.get().last(1).values()[0];
  let selection_side;
  if (dat.choice_type === "free") {
    selection_side = jsPsych.pluginAPI.compareKeys(dat.response, PRMS.choice_selection_keys[0]) ? "left" : "right";
  } else if (dat.choice_type === "forced") {
    selection_side = shuffle(["left", "right"])[0];
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    block_num: PRMS.cblk,
    trial_num: PRMS.ctrl,
    image_left: dat.choice_type === "free" ? IMAGES_FREE[0] : IMAGES_FORCED[0],
    image_right: dat.choice_type === "free" ? IMAGES_FREE[1] : IMAGES_FORCED[1],
    selection_side: selection_side,
    corr_code: 0,
  });
}


const CHOICE_IMAGE_SELECTION_SCREEN = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: null,
  trial_duration: null,
  choices: [], 
  data: {
    stim_type: "vci",
    block: jsPsych.timelineVariable("block"),
    cue: jsPsych.timelineVariable("cue"),
    choice_type: jsPsych.timelineVariable("choice_type"),
    task_shape: jsPsych.timelineVariable("task_shape"),
    task_position: jsPsych.timelineVariable("task_position"),
    correct_key: jsPsych.timelineVariable("correct_key")
  },
  on_start: function (trial) {
    "use strict";
    if (jsPsych.evaluateTimelineVariable("choice_type") === "free") {
      trial.choices = PRMS.choice_selection_keys;
      trial.response_ends_trial = true;
    } else if (jsPsych.evaluateTimelineVariable("choice_type") === "forced") {
      trial.trial_duration = 500; // Tinterval
      trial.response_ends_trial = false;
      trial.choices = [];
    }
    trial.stimulus = function (c) {
      draw_images(c, { 
        choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
        hide_image: jsPsych.evaluateTimelineVariable("block") === "blank", 
        selection: "na"});
    };
  },
  on_finish: function () {
    code_selection_response();
  },
};


const CHOICE_IMAGE_FEEDBACK_SCREEN1 = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: null,
  trial_duration: null,
  on_start: function (trial) {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    console.log(dat);
    if (jsPsych.evaluateTimelineVariable("choice_type") === "free") {
      trial.trial_duration = PRMS.choice_feedback_duration;
      trial.response_ends_trial = false;
      trial.choices = [];
      trial.stimulus = function (c) {
        draw_images(c, { 
          choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
          hide_image: false, 
          selection: 
          dat.selection_side, 
          frame_size: 1
        });
      };
    } else if (jsPsych.evaluateTimelineVariable("choice_type") === "forced") {
      trial.response_ends_trial = true;
      trial.choices = [dat.selection_side === "left" ? PRMS.choice_selection_keys[0]:PRMS.choice_selection_keys[1]];
      trial.stimulus = function (c) {
        draw_images(c, {
          choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
          hide_image: false, 
          selection: dat.selection_side, 
          frame_size: 0.5});
      };
    }
  },
};


const CHOICE_IMAGE_FEEDBACK_SCREEN2 = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: null,
  trial_duration: null,
  on_start: function (trial) {
    "use strict";
    let dat = jsPsych.data.get().last(2).values()[0];
    if (jsPsych.evaluateTimelineVariable("choice_type") === "free") {
      trial.trial_duration = 0;
      trial.response_ends_trial = false;
      trial.choices = [];
    } else if (jsPsych.evaluateTimelineVariable("choice_type") === "forced") {
      trial.response_ends_trial = false;
      trial.trial_duration = PRMS.choice_feedback_duration;
    }
    trial.stimulus = function (c) {
      draw_images(c, {
        choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
        hide_image: false, 
        selection: dat.selection_side, 
        frame_size: 1
      });
    };
  },
};


function draw_images_and_task(c, args) {
  "use strict";
  let ctx = c.getContext("2d");
  if (args.set_canvas) {
    ctx = canvas_style(ctx);
  } else {
    ctx = clear_canvas(ctx);
  }

  // image
  let image_number = args.selection === "left" ? 0 : 1;
  const img = new Image();
  img.src = args.choice_type === "free" ? IMAGES_FREE[image_number]: IMAGES_FORCED[image_number];
  ctx.drawImage(img, 0 - img.width / 2, -img.height / 2);

  // task shape
  if (args.draw_stimulus) {
    if (args.task_shape === "diamond") {

      let size = PRMS.task_size/2;
      let xpos = args.task_position === "left" ? -PRMS.task_eccentricity - PRMS.task_size/2 : PRMS.task_eccentricity + PRMS.task_size/2;

      ctx.fillStyle = PRMS.task_colour;
      ctx.strokeStyle = PRMS.task_colour;
      ctx.lineWidth = 1;
      ctx.moveTo (xpos + size * Math.cos(0), size *  Math.sin(0));          
      for (var i = 1; i <= 4; i += 1) {
        ctx.lineTo (xpos + size * Math.cos(i * 2 * Math.PI / 4), size * Math.sin(i * 2 * Math.PI / 4));
      }
      ctx.stroke();
      ctx.fill();

    } else if (args.task_shape === "circle") {

      let xpos = args.task_position === "left" ? -PRMS.task_eccentricity - PRMS.task_size/2 : PRMS.task_eccentricity + PRMS.task_size/2;
      ctx.fillStyle = PRMS.task_colour;
      ctx.strokeStyle = PRMS.task_colour;
      ctx.arc(xpos, 0, PRMS.task_size/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.stroke();

    }
  }

}


const TASK_SCREEN = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: true,
  trial_duration: PRMS.too_slow,
  choices: PRMS.task_keys,
  data: {
    stim_type: "vct",
    block: jsPsych.timelineVariable("block"),
    cue: jsPsych.timelineVariable("cue"),
    choice_type: jsPsych.timelineVariable("choice_type"),
    task_shape: jsPsych.timelineVariable("task_shape"),
    task_position: jsPsych.timelineVariable("task_position"),
    correct_key: jsPsych.timelineVariable("correct_key")
  },
  on_start: function (trial) {
    "use strict";
    trial.stimulus = function (c) {
      let dat = jsPsych.data.get().last(4).values()[0];
      console.log(dat.selection_side);
      draw_images_and_task(c, 
        { 
          choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
          selection: dat.selection_side, 
          task_shape: jsPsych.evaluateTimelineVariable("task_shape"),
          task_position: jsPsych.evaluateTimelineVariable("task_position"),
          draw_stimulus: true,
          set_canvas: true
        });
      jsPsych.pluginAPI.setTimeout(() => {
        draw_images_and_task(c, 
          { 
            choice_type: jsPsych.evaluateTimelineVariable("choice_type"), 
            selection: dat.selection_side, 
            task_shape: jsPsych.evaluateTimelineVariable("task_shape"),
            task_position: jsPsych.evaluateTimelineVariable("task_position"),
            draw_stimulus: false,
            set_canvas: false
          });
      }, PRMS.task_duration);
    };
  },
  on_finish: function () {
    code_task_response();
    PRMS.ctrl += 1;
  },
};


function code_task_response() {
  "use strict";

  // get some variables from previous trial
  let datp = jsPsych.data.get().last(5).values()[0];
  let dat = jsPsych.data.get().last(1).values()[0];
  dat.rt = dat.rt !== null ? dat.rt : PRMS.too_slow;

  let corr_code = 0;
  let correct_key = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);

  if (correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
    corr_code = 1; // correct
  } else if (!correct_key && dat.rt > PRMS.too_fast && dat.rt < PRMS.too_slow) {
    corr_code = 2; // choice error
  } else if (dat.rt >= PRMS.too_slow) {
    corr_code = 3; // too slow
  } else if (dat.rt <= PRMS.too_fast) {
    corr_code = 4; // too false
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    block_num: PRMS.cblk,
    trial_num: PRMS.ctrl,
    image_left: dat.choice_type === "free" ? IMAGES_FREE[0] : IMAGES_FORCED[0],
    image_right: dat.choice_type === "free" ? IMAGES_FREE[1] : IMAGES_FORCED[1],
    selection_side: datp.selection_side,
    selection_response: datp.response,
    selection_rt: datp.rt,
    corr_code: corr_code,
  });

  // remove used images
  if (dat.choice_type === "free") {
    IMAGES_FREE.splice(0, 2);
  } else if (dat.choice_type === "forced") {
    IMAGES_FORCED.splice(0, 2);
  }

}


function draw_trial_feedback(c, args) {
  "use strict";
  let ctx = c.getContext("2d");
  ctx = canvas_style(ctx);

  ctx.font = PRMS.feedback_font;
  ctx.textAlign = "center";

  // draw target
  ctx.fillStyle = "Black";
  ctx.fillText(`${args.feedback_text}`, 0, 15);
}


const TRIAL_FEEDBACK = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: draw_iti,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  trial_duration: 0,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
    trial.stimulus = function (c) {
      draw_trial_feedback(c, { feedback_text: PRMS.feedback_text[dat.corr_code - 1] });
    };
  },
};


function draw_iti(c) {
  "use strict";
  let ctx = c.getContext("2d");
  canvas_style(ctx);
}


const ITI = {
  type: jsPsychCanvasKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  stimulus: draw_iti,
  response_ends_trial: false,
  trial_duration: PRMS.iti,
};


const BLOCK_FEEDBACK = {
  type: jsPsychHtmlKeyboardResponse,
  canvas_size: CANVAS_SIZE,
  stimulus: "",
  response_ends_trial: true,
  post_trial_gap: PRMS.waitDur,
  on_start: function (trial) {
    let block_dvs = calculate_block_performance({
      filter_options: { stim: "cse_sf", block_num: PRMS.cblk },
    });
    let text = block_feedback_text(PRMS.cblk, PRMS.nblks, block_dvs.mean_rt, block_dvs.error_rate);
    trial.stimulus = `<div style="font-size:${PRMS.feedback_text_size_block}px;">${text}</div>`;
  },
  on_finish: function () {
    PRMS.ctrl = 1;
    PRMS.cblk += 1;
  },
};


// prettier-ignore
const TRIAL_TABLE_IMAGE = [
  { block: "image", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[0], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "image", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[1], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  { block: "image", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[0], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "image", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[1], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  // { block: "image", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[0], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  // { block: "image", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[1], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  // { block: "image", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[0], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  // { block: "image", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[1], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
];

// prettier-ignore
const TRIAL_TABLE_BLANK = [
  { block: "blank", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[0], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "blank", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[1], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  { block: "blank", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[0], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "blank", cue: PRMS.cue_colours[0], choice_type: "free",   task_shape: PRMS.task_shapes[1], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  { block: "blank", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[0], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "blank", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[1], task_position: "left",  correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
  { block: "blank", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[0], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[0])]},
  { block: "blank", cue: PRMS.cue_colours[1], choice_type: "forced", task_shape: PRMS.task_shapes[1], task_position: "right", correct_key: PRMS.task_keys[PRMS.task_shapes.indexOf(PRMS.task_shapes[1])]},
];


const TRIAL_TIMELINE_IMAGE = {
  timeline: [FIXATION_CROSS_800, COLOUR_CUE, FIXATION_CROSS_500, CHOICE_IMAGE_SELECTION_SCREEN, CHOICE_IMAGE_FEEDBACK_SCREEN1, CHOICE_IMAGE_FEEDBACK_SCREEN2, FIXATION_CROSS_500, TASK_SCREEN, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE_IMAGE,
};

const TRIAL_TIMELINE_BLANK = {
  timeline: [FIXATION_CROSS_800, COLOUR_CUE, FIXATION_CROSS_500, CHOICE_IMAGE_SELECTION_SCREEN, CHOICE_IMAGE_FEEDBACK_SCREEN1, CHOICE_IMAGE_FEEDBACK_SCREEN2, FIXATION_CROSS_500, TASK_SCREEN, TRIAL_FEEDBACK, ITI],
  timeline_variables: TRIAL_TABLE_BLANK,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
  jsPsych.data.addProperties({ vp_num: VP_NUM });

  const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
  // save_data('/Common/write_data.php', fn, { stim: 'vct' });
  save_data_local(fn, { stim_type: "vct" });
}

const save_data = {
  type: jsPsychCallFunction,
  func: save,
  post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
  "use strict";

  let exp = [];

  // exp.push(fullscreen(true));
  // exp.push(welcome_message());
  // exp.push(vp_info_form());
  // exp.push(mouse_cursor(false));
  exp.push(PRELOAD);
  // exp.push(WELCOME_INSTRUCTIONS);
  // exp.push(TASK_INSTRUCTICCS);


  // // block by block
  // let blk_type;
  // if (VERSION === 1) {
  //   blk_type = repeat_array(["image", "blank"], PRMS.nblks / 2);
  // } else if (VERSION === 2) {
  //   blk_type = repeat_array(["blank", "image"], PRMS.nblks / 2);
  // }

  // split half
  let blk_type;
  if (VERSION === 1) {
    blk_type = repeat_array(["image"], PRMS.nblks / 2).concat(repeat_array(["blank"], PRMS.nblks / 2));
  } else if (VERSION === 2) {
    blk_type = repeat_array(["blank"], PRMS.nblks / 2).concat(repeat_array(["image"], PRMS.nblks / 2));
  }
  // console.log(blk_type);

  let practice_blocks = [0, PRMS.nblks/2];
  for (let blk = 0; blk < PRMS.nblks; blk++) {
    exp.push(BLOCK_START);
    let blk_timeline;
    if (blk_type[blk] === "image") {
      blk_timeline = { ...TRIAL_TIMELINE_IMAGE };
      blk_timeline.sample = {
        type: "fixed-repetitions",
        size: practice_blocks.includes(blk) ? PRMS.ntrlsp / TRIAL_TABLE_IMAGE.length : PRMS.ntrlse / TRIAL_TABLE_IMAGE.length,
      };
    } else if (blk_type[blk] === "blank") {
      blk_timeline = { ...TRIAL_TIMELINE_BLANK };
      blk_timeline.sample = {
        type: "fixed-repetitions",
        size: practice_blocks.includes(blk) ? PRMS.ntrlsp / TRIAL_TABLE_BLANK.length : PRMS.ntrlse / TRIAL_TABLE_BLANK.length,
      };
    }
    exp.push(blk_timeline); // trials within a block
    exp.push(BLOCK_FEEDBACK); // show previous block performance
  }

  exp.push(save_data);
  exp.push(end_message());
  exp.push(mouse_cursor(true));
  exp.push(fullscreen(false));

  return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);

