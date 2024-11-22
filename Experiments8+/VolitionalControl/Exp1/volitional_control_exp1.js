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
  ntrlsp: 4, // number of trials in first block (practice)
  ntrlse: 4, // number of trials in subsequent blocks
  nblks: 1,
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
  wait_duration: 1000,
  iti: 1000,
  too_fast: 150,
  too_slow: 2000,
  resp_keys: ["D", "J"],
  feedback_text: ["Correct", "Error", "Too Slow", "Too Fast"],
  ctrl: 1, // count trials
  cblk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
    return ctx;
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// const IMAGE_NUMBERS = shuffle(range(1, 251)).slice(0, );

function image_names() {
  let images = [];
  for (let i = 1; i <= 250; i++) {
    images.push(`../images/house${i}.jpg`);
  }
  return images;
}

const IMAGES = shuffle(image_names());
//console.log(IMAGES);

const PRELOAD = {
    type: jsPsychPreload,
    images: IMAGES
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

function draw_images(c) {
  "use strict";
  let ctx = c.getContext("2d");
  ctx = canvas_style(ctx);

  // image
  const img_left = new Image();
  img_left.src = IMAGES[0];
  const img_right = new Image();
  img_right.src = IMAGES[1];

  ctx.drawImage(img_left, -PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2);
  ctx.drawImage(img_right, PRMS.image_eccentricity - img_left.width / 2, -img_left.height / 2);

}

const CHOICE_IMAGE_SELECTION_SCREEN = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: true,
  trial_duration: null,
  on_start: function (trial) {
    "use strict";
    trial.stimulus = function (c) {
      draw_images(c, { });
    };
  },
};

const CHOICE_IMAGE_FEEDBACK_SCREEN = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus: null,
  canvas_size: CANVAS_SIZE,
  response_ends_trial: false,
  trial_duration: PRMS.choice_feedback_duration,
  on_start: function (trial) {
    "use strict";
    trial.stimulus = function (c) {
      draw_images(c, { });
    };
  },
};





function code_trial() {
    "use strict";
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
        corr_code: corr_code,
    });
}


// prettier-ignore
const TRIAL_TABLE_IMAGE = [
  { block: "image", cue: PRMS.cue_colours[0], choice_type: "free"},
  { block: "image", cue: PRMS.cue_colours[1], choice_type: "forced"},
];

const TRIAL_TIMELINE_IMAGE = {
    //timeline: [FIXATION_CROSS_800, COLOUR_CUE, FIXATION_CROSS_500, CHOICE_IMAGE],
    timeline: [CHOICE_IMAGE_SELECTION_SCREEN],
    timeline_variables: TRIAL_TABLE_IMAGE,
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
    // save_data('/Common/write_data.php', fn, { stim: 'flanker' });
    // save_data_local(fn, { stim: "flanker" });
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
    // exp.push(TASK_INSTRUCTIONS);

    exp.push(PRELOAD);
    exp.push(TRIAL_TIMELINE_IMAGE);

    // exp.push(save_data);
    // exp.push(end_message());
    // exp.push(mouse_cursor(true));
    // exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

jsPsych.run(EXP);
