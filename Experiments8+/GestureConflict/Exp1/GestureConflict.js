// Gesture Conflict Exp 1
//
// Participants respond to either verbal (Yes/No) or gestural (Head: nod/shake or Thumbs: up/down) information
// Response modality (verbal/gestural) is manipulated blockwise, whilst gesture type is separated across versions
//
// Version 1: verbal -> head -> verbal -> head
// Version 2: head -> verbal -> head -> verbal
// Version 3: verbal -> thumbs -> verbal -> thumbs
// Version 4: thumbs -> verbal -> thumbs -> verbal
//
// Reponse keys are randomly assigned per participant

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych({
    // can set it to return to SONA
    on_finish: function () {
        // if (PRMS.cblk >= XXX) {
        //     window.location.assign(
        //         "XXX" +
        //             jsPsych.data.urlVariables().sona_id,
        //     );
        // }
    },
});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [720, 1280];

// Experiment Parameters
const PRMS = {
    ntrls: 8, // number of trials per block (multiple of 8)
    nblks: 2, // number of blocks
    fix_size: 10, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 1000, // duration of the fixation cross
    feedback_duration: [1000, 1000, 1000, 1000], // feedback duration for response type (correct, incorrect, too slow, too fast)
    too_slow: 5000, // feedback duration for correct and incorrect trials, respectively
    too_fast: 0, // feedback duration for correct and incorrect trials, respectively
    feedback_text: ["Richtig!", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    feedback_font: "50px Arial",
    resp_keys: ["Q", "P"],
    resp_mapping: shuffle(["Nein", "Ja"]), // no/yes randomly assigned to left right/keys
    ctrl: 1,
    cblk: 1,
};

// 4 versions
// const VERSION = Number(jsPsych.data.urlVariables().version); // version is provided in the url
// jsPsych.data.addProperties({ version: VERSION });

// or set explicitly if testing
const VERSION = 1;

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
xxx@xxx<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: false,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Do something ...<br><br>
${PRMS.resp_keys[0]}-Taste = ${PRMS.resp_mapping[0]} &ensp;&ensp;&ensp;&ensp; ${PRMS.resp_keys[1]}-Taste = ${PRMS.resp_mapping[1]}<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        color: "black",
        fontsize: 30,
        bold: false,
    }),
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

function assign_video_files() {
    "use strict";
    let videos_head = [
        "../Exp1/videos/JaKopfJa_f.mp4",
        "../Exp1/videos/NeinKopfJa_f.mp4",
        "../Exp1/videos/JaKopfJa_m.mp4",
        "../Exp1/videos/NeinKopfJa_m.mp4",
        "../Exp1/videos/JaKopfNein_f.mp4",
        "../Exp1/videos/NeinKopfNein_f.mp4",
        "../Exp1/videos/JaKopfNein_m.mp4",
        "../Exp1/videos/NeinKopfNein_m.mp4",
    ];
    let videos_thumb = [
        "../Exp1/videos/JaDaumenhoch_f.mp4",
        "../Exp1/videos/NeinDaumenhoch_f.mp4",
        "../Exp1/videos/JaDaumenhoch_m.mp4",
        "../Exp1/videos/NeinDaumenhoch_m.mp4",
        "../Exp1/videos/JaDaumenrunter_f.mp4",
        "../Exp1/videos/NeinDaumenrunter_f.mp4",
        "../Exp1/videos/JaDaumenrunter_m.mp4",
        "../Exp1/videos/NeinDaumenrunter_m.mp4",
    ];
    if ([1, 2].includes(VERSION)) {
        return videos_head;
    } else if ([3, 4].includes(VERSION)) {
        return videos_thumb;
    }
}

const VIDEOS = assign_video_files();
// console.log(VIDEOS);

const PRELOAD_VIDEOS = {
    type: jsPsychPreload,
    video: VIDEOS,
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
    return ctx;
}

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

const FIXATION_CROSS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: draw_fixation,
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: PRMS.fix_duration,
};

// jsPsych video plugin
const PLAY_VIDEO = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: [],
    data: {
        stim_type: "gc",
        video: jsPsych.timelineVariable("video"),
        resp_modality: jsPsych.timelineVariable("resp_modality"),
        voice: jsPsych.timelineVariable("voice"),
        gesture: jsPsych.timelineVariable("gesture"),
        comp: jsPsych.timelineVariable("comp"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_start: function (trial) {
        "use strict";
        trial.stimulus = [jsPsych.evaluateTimelineVariable("video")];
    },
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_ends_after_video: false,
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
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
        corr_code = 4; // too fast
    }

    // console.log(`-------`);
    // console.log(`video: ${dat.video}`);
    // console.log(`resp_modality: ${dat.resp_modality}`);
    // console.log(`voice: ${dat.voice}`);
    // console.log(`gesture: ${dat.gesture}`);
    // console.log(`comp: ${dat.comp}`);
    // console.log(`correct_key: ${dat.correct_key}`);
    // console.log(`rt: ${dat.rt}`);
    // console.log(`corr_code: ${corr_code}`);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
        corr_code: corr_code,
    });
}

function draw_trial_feedback(c, args) {
    "use strict";
    console.log("here");
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_font;
    ctx.textAlign = "center";

    // draw target
    ctx.fillStyle = "black";
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

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim_type: "gc", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(
            PRMS.cblk,
            PRMS.nblks,
            block_dvs.mean_rt,
            block_dvs.error_rate,
            (language = "de"),
        );
        trial.stimulus = `<div style="color: black; font-size:30px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
    post_trial_gap: 1000,
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

// prettier-ignore
const TRIAL_TABLE_VOICE = [
  { video: VIDEOS[0], resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[1], resp_modality: "voice", voice: "no",  gesture: "yes", comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[2], resp_modality: "voice", voice: "yes", gesture: "yes", comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[3], resp_modality: "voice", voice: "no",  gesture: "yes", comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[4], resp_modality: "voice", voice: "yes", gesture: "no",  comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[5], resp_modality: "voice", voice: "no",  gesture: "no",  comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[6], resp_modality: "voice", voice: "yes", gesture: "no",  comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[7], resp_modality: "voice", voice: "no",  gesture: "no",  comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
];

// prettier-ignore
const TRIAL_TABLE_GESTURE = [
  { video: VIDEOS[0], resp_modality: "gesture", voice: "yes", gesture: "yes", comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[1], resp_modality: "gesture", voice: "no",  gesture: "yes", comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[2], resp_modality: "gesture", voice: "yes", gesture: "yes", comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[3], resp_modality: "gesture", voice: "no",  gesture: "yes", comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Ja")]},
  { video: VIDEOS[4], resp_modality: "gesture", voice: "yes", gesture: "no",  comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[5], resp_modality: "gesture", voice: "no",  gesture: "no",  comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[6], resp_modality: "gesture", voice: "yes", gesture: "no",  comp: "incomp", correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
  { video: VIDEOS[7], resp_modality: "gesture", voice: "no",  gesture: "no",  comp: "comp",   correct_key: PRMS.resp_keys[PRMS.resp_mapping.indexOf("Nein")]},
];

// useful debugging commands
// console.table(TRIAL_TABLE_VOICE);
// console.table(TRIAL_TABLE_GESTURE);

const TRIAL_TIMELINE_VOICE = {
    timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_VOICE,
};

const TRIAL_TIMELINE_GESTURE = {
    timeline: [FIXATION_CROSS, PLAY_VIDEO, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_GESTURE,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    // save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "gc" });
    save_data_local(data_fn, { stim_type: "gc" }); // saves to download folder
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
Nun folgen Informationen zur Versuchspersonenstunde auf SONA.
Drücken Sie nun eine beliebige Taste, um fortzufahren.`,
        fontsize: 28,
        color: "black",
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check([CANVAS_SIZE[1], CANVAS_SIZE[0]]));
    exp.push(resize_browser());
    exp.push(welcome_message());
    // exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

    // alternating block types with random assignment of starting order
    let blk_type;
    if ([1, 3].includes(VERSION)) {
        blk_type = repeat_array(["voice", "gesture"], PRMS.nblks / 2);
    } else if ([2, 4].includes(VERSION)) {
        blk_type = repeat_array(["gesture", "voice"], PRMS.nblks / 2);
    }

    for (let blk = 0; blk < PRMS.nblks; blk += 1) {
        let blk_timeline;
        if (blk_type[blk] === "voice") {
            blk_timeline = { ...TRIAL_TIMELINE_VOICE };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.ntrls / TRIAL_TABLE_VOICE.length,
            };
        } else if (blk_type[blk] === "gesture") {
            blk_timeline = { ...TRIAL_TIMELINE_GESTURE };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.ntrls / TRIAL_TABLE_GESTURE.length,
            };
        }
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = generate_exp();

// jsPsych.simulate(EXP, "data-only"); // generatees datafile after first click
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
