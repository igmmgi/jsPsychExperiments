// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with flankers presented before the target (150 ms SOA)
// Unpredictable task sequence but response effector (middle vs. index fingers) alternates

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.count_block >= 9) {
            window.location.assign(
                "https://fernuni-hagen.sona-systems.com/webstudy_credit.aspx?experiment_id=447&credit_token=90d8bbd505414b2c8fe4b4dc24313119&survey_code=" +
                    jsPsych.data.urlVariables().sona_id,
            );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [720, 960];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls: 80,
    nblks: 9,
    fix_size: 10, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    flanker_duration: 100, // duration of the initial "flanker" array
    blank_duration: 150, // duration of the blank screen between flanker and target array
    flanker_target_interval: 200, // total duration between onset of flanker array and target array (flanker duration + blank duration)
    fix_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    feedback_duration: [0, 1500, 1500],
    iti: 500,
    too_slow: 2500,
    stim_size: "40px monospace",
    simon_pos: 100,
    feedback_size: "24px monospace",
    feedback_text_size_block: 20,
    feedback_text: ["", "Falsch", "Zu langsam!"],
    feedback_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    resp_task: shuffle(["flanker", "simon"]),
    resp_letters: ["W", "E", "O", "P"],
    ctrl: 1, // count trials
    cblk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const RESP_TEXT =
    generate_formatted_html({
        text:
            PRMS.resp_letters[0] +
            "&emsp;".repeat(8) +
            PRMS.resp_letters[1] +
            "&emsp;".repeat(8) +
            PRMS.resp_letters[2] +
            "&emsp;".repeat(8) +
            PRMS.resp_letters[3],
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text:
            `${PRMS.resp_letters[0]}-Taste` +
            "&emsp;".repeat(5) +
            `${PRMS.resp_letters[1]}-Taste` +
            "&emsp;".repeat(6) +
            `${PRMS.resp_letters[2]}-Taste` +
            "&emsp;".repeat(5) +
            `${PRMS.resp_letters[3]}-Taste`,
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text:
            `linker Mittelfinger` +
            "&emsp;".repeat(3) +
            `linker Zeigefinger` +
            "&emsp;".repeat(3) +
            `rechte Zeigefinger` +
            "&emsp;".repeat(2) +
            `rechte Mittelfinger`,
        bold: true,
        fontsize: 20,
        lineheight: 0.5,
    });

const PRESS_TO_CONTINUE = generate_formatted_html({
    text: `Drücke eine beliebige Taste, um fortzufahren!`,
    bold: true,
    fontsize: 26,
    align: "center",
});

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
               genügend Zeit hast, um das Experiment durchzuführen.
               Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus:
        generate_formatted_html({
            text: `Aufgabe:<br><br>
                   In diesem Experiment musst du auf verschiedene Buchstaben
                   so schnell und so genau wie möglich reagieren. Der Ziel-Buchstabe
                   erscheint in manchen Durchgängen in der Mitte des Bildschirms (und ist
                   von irrelevanten Buchstaben umgeben) und in anderen Durchgängen links oder
                   rechts auf dem Bildschirm. Es gilt die folgende Zuordnung:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        RESP_TEXT +
        "<br>" +
        PRESS_TO_CONTINUE,
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Reagiere immer nur auf den Ziel-Buchstaben. Das heißt:<br><br>
               Wenn der Ziel-Buchstabe in der Mitte erscheint, dann ignoriere die umliegenden Buchstaben.<br><br>
               Wenn nur ein Ziel-Buchstabe links oder rechts auf dem Bildschirm präsentiert wird,
               dann ignoriere die links/rechts Position auf dem Bildschirm.<br><br>
               Reagiere so schnell und so genau wie möglich!<br><br>
               Drücke eine beliebige Taste, um fortzufahren.`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS_BLOCK = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cblk} von ${PRMS.nblks}<br><br>
Der Zielbuchstabe wird abwechselnd in der Mitte des Bildschirms und links/rechts auf dem Bildschirm erscheinen.<br><br>
Versuche dich in jedem Durchgang so gut wie möglich vorzubereiten, um immer möglichst schnell und genau zu antworten. Es gilt:<br><br>`,
                bold: true,
                fontsize: 26,
                align: "left",
                lineheight: 1.5,
            }) +
            RESP_TEXT +
            "<br>" +
            PRESS_TO_CONTINUE;
    },
    post_trial_gap: 1000,
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

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corr_code = 0;
    let rt = dat.rt;
    if (dat.stim_type === "flanker_ir1" || dat.stim_type === "flanker_ir2") {
        // target second
        rt = rt === null ? PRMS.too_slow : rt - dat.delay;
    } else {
        // target first or simon
        rt = rt === null ? PRMS.too_slow : rt;
    }

    let comp;
    if (dat.stim_type === "simon1" || dat.stim_type === "simon2") {
        comp =
            (["W", "E"].includes(dat.corr_resp) && dat.position < 0) ||
            (["O", "P"].includes(dat.corr_resp) && dat.position > 0)
                ? "comp"
                : "incomp";
    } else {
        comp = dat.stim1.includes(dat.stim2) || dat.stim2.includes(dat.stim1) ? "comp" : "incomp";
    }

    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corr_resp);
    }

    if (correctKey && rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correctKey && rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
        comp: comp,
        rt: rt,
        corr_code: corr_code,
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
    });
}

function draw_trial_feedback(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = PRMS.feedback_colour;
    ctx.fillText(PRMS.feedback_text[args.corr_code - 1], 0, 0);
    if (args.corr_code !== 1) {
        let row1 = ` ${PRMS.resp_letters[0]}               ${PRMS.resp_letters[1]}               ${PRMS.resp_letters[2]}               ${PRMS.resp_letters[3]}`;
        let row2 = `${PRMS.resp_letters[0]}-Taste         ${PRMS.resp_letters[1]}-Taste         ${PRMS.resp_letters[2]}-Taste         ${PRMS.resp_letters[3]}-Taste`;
        let row3 = `linker Mittelfinger   linker Zeigefinger  rechte Zeigefinger   rechte Mittelfinger`;
        ctx.fillText(row1, 0, 60);
        ctx.fillText(row2, 0, 90);
        ctx.font = "18px monospace";
        ctx.fillText(row3, 0, 120);
    }
}

const TRIAL_FEEDBACK = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: function () {},
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
        if (dat.corrCode !== 1) {
            trial.stimulus = function (c) {
                draw_trial_feedback(c, { corr_code: dat.corr_code });
            };
        }
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

function draw_stimulus(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    if (args.set_canvas) {
        ctx = canvas_style(ctx);
    } else {
        ctx = clear_canvas(ctx);
    }

    ctx.font = PRMS.stim_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw
    ctx.fillStyle = "black";
    ctx.fillText(args.stim, args.position, 0);
}

const STIMULUS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: null,
    canvas_size: CANVAS_SIZE,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.resp_letters,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "cse_sf",
        stim_type: jsPsych.timelineVariable("stim_type"),
        target: jsPsych.timelineVariable("target"),
        stim1: jsPsych.timelineVariable("stim1"),
        stim2: jsPsych.timelineVariable("stim2"),
        delay: jsPsych.timelineVariable("delay"),
        position: jsPsych.timelineVariable("position"),
        corr_resp: jsPsych.timelineVariable("corr_resp"),
    },
    on_start: function (trial) {
        trial.stimulus = function (c) {
            if (
                jsPsych.evaluateTimelineVariable("stim_type") === "simon1" ||
                jsPsych.evaluateTimelineVariable("stim_type") === "simon2"
            ) {
                trial.trial_duration = PRMS.too_slow;
                draw_stimulus(c, {
                    stim: jsPsych.evaluateTimelineVariable("stim1"),
                    position: jsPsych.evaluateTimelineVariable("position"),
                    set_canvas: true,
                });
            } else if (
                jsPsych.evaluateTimelineVariable("stim_type") === "flanker_ir1" ||
                jsPsych.evaluateTimelineVariable("stim_type") === "flanker_ir2"
            ) {
                trial.trial_duration = PRMS.too_slow + jsPsych.evaluateTimelineVariable("delay");
                // initial flanker array
                draw_stimulus(c, {
                    stim: jsPsych.evaluateTimelineVariable("stim1"),
                    position: jsPsych.evaluateTimelineVariable("position"),
                    set_canvas: true,
                });
                // blank
                jsPsych.pluginAPI.setTimeout(() => {
                    draw_stimulus(c, {
                        stim: "",
                        position: jsPsych.evaluateTimelineVariable("position"),
                        set_canvas: false,
                    });
                }, PRMS.flanker_duration);
                // target array
                jsPsych.pluginAPI.setTimeout(() => {
                    draw_stimulus(c, {
                        stim: jsPsych.evaluateTimelineVariable("stim2"),
                        position: jsPsych.evaluateTimelineVariable("position"),
                        set_canvas: false,
                    });
                }, PRMS.blank_duration);
            }
        };
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

function flanker_array(letter) {
    return letter + letter + " " + letter + letter;
}

function target_array(letter) {
    return letter + letter + letter + letter + letter;
}

// prettier-ignore
function trial_table() {
  let trial_table;
  if (PRMS.resp_task[0] === "flanker") {
    trial_table = [
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[0], stim1: flanker_array(PRMS.resp_letters[0]), stim2: target_array(PRMS.resp_letters[0]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[0] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[3], stim1: flanker_array(PRMS.resp_letters[3]), stim2: target_array(PRMS.resp_letters[3]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[3] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[0], stim1: flanker_array(PRMS.resp_letters[3]), stim2: target_array(PRMS.resp_letters[0]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[0] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[3], stim1: flanker_array(PRMS.resp_letters[0]), stim2: target_array(PRMS.resp_letters[3]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[3] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[1], stim1: flanker_array(PRMS.resp_letters[1]), stim2: target_array(PRMS.resp_letters[1]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[1] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[2], stim1: flanker_array(PRMS.resp_letters[2]), stim2: target_array(PRMS.resp_letters[2]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[2] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[1], stim1: flanker_array(PRMS.resp_letters[2]), stim2: target_array(PRMS.resp_letters[1]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[1] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[2], stim1: flanker_array(PRMS.resp_letters[1]), stim2: target_array(PRMS.resp_letters[2]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[2] },
      { stim_type: "simon2",      target: PRMS.resp_letters[1], stim1: PRMS.resp_letters[1],                stim2: PRMS.resp_letters[1],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[1] },
      { stim_type: "simon2",      target: PRMS.resp_letters[2], stim1: PRMS.resp_letters[2],                stim2: PRMS.resp_letters[2],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[2] },
      { stim_type: "simon2",      target: PRMS.resp_letters[1], stim1: PRMS.resp_letters[1],                stim2: PRMS.resp_letters[1],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[1] },
      { stim_type: "simon2",      target: PRMS.resp_letters[2], stim1: PRMS.resp_letters[2],                stim2: PRMS.resp_letters[2],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[2] },
      { stim_type: "simon1",      target: PRMS.resp_letters[0], stim1: PRMS.resp_letters[0],                stim2: PRMS.resp_letters[0],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[0] },
      { stim_type: "simon1",      target: PRMS.resp_letters[3], stim1: PRMS.resp_letters[3],                stim2: PRMS.resp_letters[3],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[3] },
      { stim_type: "simon1",      target: PRMS.resp_letters[0], stim1: PRMS.resp_letters[0],                stim2: PRMS.resp_letters[0],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[0] },
      { stim_type: "simon1",      target: PRMS.resp_letters[3], stim1: PRMS.resp_letters[3],                stim2: PRMS.resp_letters[3],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[3] },
    ];
  } else if (PRMS.resp_task[0] === "simon") {
    trial_table = [
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[1], stim1: flanker_array(PRMS.resp_letters[1]), stim2: target_array(PRMS.resp_letters[1]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[1] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[2], stim1: flanker_array(PRMS.resp_letters[2]), stim2: target_array(PRMS.resp_letters[2]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[2] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[1], stim1: flanker_array(PRMS.resp_letters[2]), stim2: target_array(PRMS.resp_letters[1]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[1] },
      { stim_type: "flanker_ir1", target: PRMS.resp_letters[2], stim1: flanker_array(PRMS.resp_letters[1]), stim2: target_array(PRMS.resp_letters[2]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[2] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[0], stim1: flanker_array(PRMS.resp_letters[0]), stim2: target_array(PRMS.resp_letters[0]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[0] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[3], stim1: flanker_array(PRMS.resp_letters[3]), stim2: target_array(PRMS.resp_letters[3]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[3] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[0], stim1: flanker_array(PRMS.resp_letters[3]), stim2: target_array(PRMS.resp_letters[0]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[0] },
      { stim_type: "flanker_ir2", target: PRMS.resp_letters[3], stim1: flanker_array(PRMS.resp_letters[0]), stim2: target_array(PRMS.resp_letters[3]), delay: PRMS.flanker_duration + PRMS.blank_duration, position: 0,               corr_resp: PRMS.resp_letters[3] },
      { stim_type: "simon2",      target: PRMS.resp_letters[0], stim1: PRMS.resp_letters[0],                stim2: PRMS.resp_letters[0],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[0] },
      { stim_type: "simon2",      target: PRMS.resp_letters[3], stim1: PRMS.resp_letters[3],                stim2: PRMS.resp_letters[3],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[3] },
      { stim_type: "simon2",      target: PRMS.resp_letters[0], stim1: PRMS.resp_letters[0],                stim2: PRMS.resp_letters[0],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[0] },
      { stim_type: "simon2",      target: PRMS.resp_letters[3], stim1: PRMS.resp_letters[3],                stim2: PRMS.resp_letters[3],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[3] },
      { stim_type: "simon1",      target: PRMS.resp_letters[1], stim1: PRMS.resp_letters[1],                stim2: PRMS.resp_letters[1],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[1] },
      { stim_type: "simon1",      target: PRMS.resp_letters[2], stim1: PRMS.resp_letters[2],                stim2: PRMS.resp_letters[2],               delay: 0,                                           position: -PRMS.simon_pos, corr_resp: PRMS.resp_letters[2] },
      { stim_type: "simon1",      target: PRMS.resp_letters[1], stim1: PRMS.resp_letters[1],                stim2: PRMS.resp_letters[1],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[1] },
      { stim_type: "simon1",      target: PRMS.resp_letters[2], stim1: PRMS.resp_letters[2],                stim2: PRMS.resp_letters[2],               delay: 0,                                           position:  PRMS.simon_pos, corr_resp: PRMS.resp_letters[2] },
    ];
  }
  return trial_table;
}

const TRIAL_TABLE_irE_S = trial_table();

const TRIAL_TIMELINE_irE_S = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_irE_S,
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
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
        fontsize: 28,
        color: "Black",
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim: "cse_sf" });
    // save_data_local(data_fn, { stim: "cse_sf" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
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
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    for (let blk = 0; blk < PRMS.nblks; blk += 1) {
        exp.push(TASK_INSTRUCTIONS_BLOCK);
        let blk_timeline = TRIAL_TIMELINE_irE_S;
        blk_timeline.sample = {
            type: "alternate-groups",
            groups: [
                repeat_array([0, 1, 2, 3, 12, 13, 14, 15], PRMS.ntrls / 16),
                repeat_array([4, 5, 6, 7, 8, 9, 10, 11], PRMS.ntrls / 16),
            ],
            randomize_group_order: true,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));
    exp.push(end_message());

    return exp;
}
const EXP = genExpSeq();

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
