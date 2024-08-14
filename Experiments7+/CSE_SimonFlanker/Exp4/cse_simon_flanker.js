// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with flankers presented before the target (150 ms SOA)
// Predictable trial sequence e.g., Simon -> Flanker -> Simon -> Flanker

const jsPsych = initJsPsych({
    on_finish: function () {},
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(200, 200, 200, 1)";
const CANVAS_SIZE = [960, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    nTrls: 80,
    nBlks: 9,
    fixDur: 500,
    fbDur: [0, 1000, 1000],
    iti: 500,
    tooSlow: 2500,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 2,
    fixSize: 10,
    stimSize: "40px monospace",
    simonPos: 100,
    fbSize: "24px monospace",
    fbTxtSizeBlock: 20,
    fbTxt: ["", "Falsch", "Zu langsam!"],
    respTask: shuffle(["flanker", "simon"]),
    respLetters: ["W", "E", "O", "P"],
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const RESP_TEXT =
    generate_formatted_html({
        text:
            PRMS.respLetters[0] +
            "&emsp;".repeat(8) +
            PRMS.respLetters[1] +
            "&emsp;".repeat(8) +
            PRMS.respLetters[2] +
            "&emsp;".repeat(8) +
            PRMS.respLetters[3],
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text:
            `${PRMS.respLetters[0]}-Taste` +
            "&emsp;".repeat(5) +
            `${PRMS.respLetters[1]}-Taste` +
            "&emsp;".repeat(6) +
            `${PRMS.respLetters[2]}-Taste` +
            "&emsp;".repeat(5) +
            `${PRMS.respLetters[3]}-Taste`,
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
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
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
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
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
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
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
};

const TASK_INSTRUCTIONS_BLOCK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
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
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function draw_fixation() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
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
    trial_duration: PRMS.fixDur,
    func: draw_fixation,
};

function draw_feedback() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = PRMS.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(PRMS.fbTxt[dat.corrCode - 1], 0, 0);
    if (dat.corrCode !== 1) {
        let row1 = ` ${PRMS.respLetters[0]}               ${PRMS.respLetters[1]}               ${PRMS.respLetters[2]}               ${PRMS.respLetters[3]}`;
        let row2 = `${PRMS.respLetters[0]}-Taste         ${PRMS.respLetters[1]}-Taste         ${PRMS.respLetters[2]}-Taste         ${PRMS.respLetters[3]}-Taste`;
        let row3 = `linker Mittelfinger   linker Zeigefinger  rechte Zeigefinger   rechte Mittelfinger`;
        ctx.fillText(row1, 0, 60);
        ctx.fillText(row2, 0, 90);
        ctx.font = "18px monospace";
        ctx.fillText(row3, 0, 120);
    }
}

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corrCode = 0;
    let rt = dat.rt;
    if (dat.stim_type === "flanker_ir") {
        // target second
        rt = rt === null ? PRMS.tooSlow : rt - dat.delay;
    } else {
        // target first or simon
        rt = rt === null ? PRMS.tooSlow : rt;
    }

    let comp;
    if (dat.stim_type === "simon") {
        comp =
            (dat.corrResp === "Q" && dat.position < 0) || (dat.corrResp === "P" && dat.position > 0)
                ? "comp"
                : "incomp";
    } else {
        comp = dat.stim1.includes(dat.stim2) || dat.stim2.includes(dat.stim1) ? "comp" : "incomp";
    }

    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
    }

    if (correctKey && rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
        comp: comp,
        rt: rt,
        corrCode: corrCode,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });
}

const TRIAL_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    func: draw_feedback,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
    },
};

const ITI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
    func: function () {},
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "cse_sf", blockNum: PRMS.cBlk },
        });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate);
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = PRMS.stimSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw
    ctx.fillStyle = "black";
    ctx.fillText(args.stim1, args.position, 0);
    ctx.fillText(args.stim2, args.position, 0);
}

const STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respLetters,
    clear_screen: [1, 1],
    stimulus_onset: [0, jsPsych.timelineVariable("delay")],
    trial_duration: null,
    func: [draw_stimulus, draw_stimulus],
    func_args: [
        {
            stim1: jsPsych.timelineVariable("stim1"),
            stim2: "",
            position: jsPsych.timelineVariable("position"),
        },
        {
            stim1: jsPsych.timelineVariable("stim1"),
            stim2: jsPsych.timelineVariable("stim2"),
            position: jsPsych.timelineVariable("position"),
        },
    ],
    data: {
        stim: "cse_sf",
        stim_type: jsPsych.timelineVariable("stim_type"),
        target: jsPsych.timelineVariable("target"),
        stim1: jsPsych.timelineVariable("stim1"),
        stim2: jsPsych.timelineVariable("stim2"),
        delay: jsPsych.timelineVariable("delay"),
        position: jsPsych.timelineVariable("position"),
        corrResp: jsPsych.timelineVariable("corrResp"),
    },
    on_start: function (trial) {
        if (trial.data.stim_type === "flanker_t2") {
            trial.trial_duration = PRMS.tooSlow + trial.data.delay;
        } else {
            trial.trial_duration = PRMS.tooSlow;
        }
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

function flanker_array(letter) {
    return letter + letter + " " + letter + letter;
}

// prettier-ignore
function trial_table() {
  let trial_table;
  if (PRMS.respTask[0] === "flanker") {
    trial_table = [
      { stim_type: "flanker_ir", target: PRMS.respLetters[0], stim1: flanker_array(PRMS.respLetters[0]), stim2: PRMS.respLetters[0], delay: 150, position: 0,              corrResp: PRMS.respLetters[0] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[1], stim1: flanker_array(PRMS.respLetters[1]), stim2: PRMS.respLetters[1], delay: 150, position: 0,              corrResp: PRMS.respLetters[1] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[0], stim1: flanker_array(PRMS.respLetters[1]), stim2: PRMS.respLetters[0], delay: 150, position: 0,              corrResp: PRMS.respLetters[0] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[1], stim1: flanker_array(PRMS.respLetters[0]), stim2: PRMS.respLetters[1], delay: 150, position: 0,              corrResp: PRMS.respLetters[1] },
      { stim_type: "simon",      target: PRMS.respLetters[2], stim1: PRMS.respLetters[2],                stim2: PRMS.respLetters[2], delay:   0, position: -PRMS.simonPos, corrResp: PRMS.respLetters[2] },
      { stim_type: "simon",      target: PRMS.respLetters[3], stim1: PRMS.respLetters[3],                stim2: PRMS.respLetters[3], delay:   0, position: -PRMS.simonPos, corrResp: PRMS.respLetters[3] },
      { stim_type: "simon",      target: PRMS.respLetters[2], stim1: PRMS.respLetters[2],                stim2: PRMS.respLetters[2], delay:   0, position:  PRMS.simonPos, corrResp: PRMS.respLetters[2] },
      { stim_type: "simon",      target: PRMS.respLetters[3], stim1: PRMS.respLetters[3],                stim2: PRMS.respLetters[3], delay:   0, position:  PRMS.simonPos, corrResp: PRMS.respLetters[3] },
    ];
  } else if (PRMS.respTask[0] === "simon") {
    trial_table = [
      { stim_type: "flanker_ir", target: PRMS.respLetters[2], stim1: flanker_array(PRMS.respLetters[2]), stim2: PRMS.respLetters[2], delay: 150, position: 0,              corrResp: PRMS.respLetters[2] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[3], stim1: flanker_array(PRMS.respLetters[3]), stim2: PRMS.respLetters[3], delay: 150, position: 0,              corrResp: PRMS.respLetters[3] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[2], stim1: flanker_array(PRMS.respLetters[3]), stim2: PRMS.respLetters[2], delay: 150, position: 0,              corrResp: PRMS.respLetters[2] },
      { stim_type: "flanker_ir", target: PRMS.respLetters[3], stim1: flanker_array(PRMS.respLetters[2]), stim2: PRMS.respLetters[3], delay: 150, position: 0,              corrResp: PRMS.respLetters[3] },
      { stim_type: "simon",      target: PRMS.respLetters[0], stim1: PRMS.respLetters[0],                stim2: PRMS.respLetters[0], delay:   0, position: -PRMS.simonPos, corrResp: PRMS.respLetters[0] },
      { stim_type: "simon",      target: PRMS.respLetters[1], stim1: PRMS.respLetters[1],                stim2: PRMS.respLetters[1], delay:   0, position: -PRMS.simonPos, corrResp: PRMS.respLetters[1] },
      { stim_type: "simon",      target: PRMS.respLetters[0], stim1: PRMS.respLetters[0],                stim2: PRMS.respLetters[0], delay:   0, position:  PRMS.simonPos, corrResp: PRMS.respLetters[0] },
      { stim_type: "simon",      target: PRMS.respLetters[1], stim1: PRMS.respLetters[1],                stim2: PRMS.respLetters[1], delay:   0, position:  PRMS.simonPos, corrResp: PRMS.respLetters[1] },
    ];
  }
  return trial_table;
}

const TRIAL_TABLE_irE_S = trial_table();
console.log(TRIAL_TABLE_irE_S);

const TRIAL_TIMELINE_irE_S = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_irE_S,
};

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    saveData("/Common/write_data.php", data_fn, { stim: "cse_sf" });
    // saveDataLocal(data_fn, { stim_type: 'fd' });
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
    exp.push(vpInfoForm("vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(TASK_INSTRUCTIONS_BLOCK);
        let blk_timeline = TRIAL_TIMELINE_irE_S;
        blk_timeline.sample = {
            type: "alternate-groups",
            groups: [repeatArray([0, 1, 2, 3], PRMS.nTrls / 8), repeatArray([4, 5, 6, 7], PRMS.nTrls / 8)],
            randomize_group_order: true,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));
    exp.push(end_message());

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
