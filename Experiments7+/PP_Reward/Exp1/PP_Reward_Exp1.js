// PP Paradigm with reward

const jsPsych = initJsPsych({
    on_finish: function () {
        window.location.assign(
            "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=173&credit_token=0406c21548db4389af1362d556cdff8f&survey_code=" +
                jsPsych.data.urlVariables().sona_id,
        );
    },
});

const CANVAS_COLOUR = "rgba(190, 190, 190, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

// Letter task = primary
// Colour task = background

const LETTERS = shuffle(["K", "G", "T"]);
const COLOURS = shuffle(["red", "blue", "green"]);

const EN_DE = { red: "rot", blue: "blau", green: "grün" };

const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nTrls: 72, // number of trials per block
    nBlks: 10, // number of blocks
    fbDur: [1000, 2000, 2000, 2000], // feedback duration for correct and incorrect trials, respectively
    tooSlow: 2000,
    tooSlowP: 3000,
    tooFast: 150,
    rsi: 500,
    fbText: ["Correct", "Falsch!", "Zu langsam!", "Zu schnell!"],
    fixSize: 10, // size of fixation cross
    fixWidth: 4, // size of fixation cross
    fixDur: 500, // duration of fixation cross
    fbFont: "bold 50px Arial",
    stimFont: "bold 70px Arial",
    lineWidth: 12,
    colours1: [COLOURS[0], COLOURS[1]],
    letters1: [LETTERS[0], LETTERS[1]],
    respKeys: ["Q", "P"],
    cBlk: 1,
    cTrl: 1,
    points: 0,
};

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// 2 counter-balanced versions
// Version 1: 1st half primary/high and background/low; 2nd half primary/low and background/high
// Version 2: 1st half primary/low and background/high; 2nd half primary/high and background/low

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Während des Experiments ist es möglich Punkte zu sammeln. Die 10% Versuchspersonen mit
           den meisten Punkten bekommen einen 10 € Gutschein. Dieser kann nach Wahl
           entweder von Amazon, Osiander oder der Deutschen Bahn sein.<br><br>
           Bei Fragen oder Problemen wende dich bitte an:<br>
           roy.chandrakant-mehta@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const VP_CODE_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    roy.chandrakant-mehta@student.uni-tuebingen.de<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment gibt es insgesamt zwei verschiedene Aufgaben.
           Du musst auf die Farben eines Quadrates (= Farbaufgabe), oder Buchstaben (=
           Buchstabenaufgabe) reagieren. <br><br> 
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken
           Zeigefinger und die P-Taste mit dem rechten Zeigefinger.<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_MANIPULATION1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Nach korrekten Durchgängen kannst du +2 Punkte oder +10 Punkte erhalten.<br><br>
           Wenn die Farbaufgabe korrekt war: +10 mit 50% Wahrscheinlichkeit + 2 mit 50% Wahrscheinlichkeit.<br><br>
           Wenn die Buchstabenaufgabe korrekt war: +10 mit 50% Wahrscheinlichkeit + 2 mit 50% Wahrscheinlichkeit.<br><br>
           Versuche soviele Punkte wie möglich zu sammeln!<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_MANIPULATION2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `****DIE HÄLFTE IST GESCHAFFT****<br><br>
           Es gilt weiterhin: Wenn die Farbaufgabe korrekt war: +10 mit 50% Wahrscheinlichkeit + 2 mit 50% Wahrscheinlichkeit<br>
           Wenn die Buchstabenaufgabe korrekt war: +10 mit 50% Wahrscheinlichkeit + 2 mit 50% Wahrscheinlichkeit<br>
           Versuche soviele Punkte wie möglich zu sammeln!<br><br>
           Drücke eine beliebige Taste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const REWARD_IMAGES = [`images/HighReward_grey.png`, `images/LowReward_grey.png`];

const PRELOAD = {
    type: jsPsychPreload,
    images: REWARD_IMAGES,
};

const RESP_TEXT = `1. Priorität: Farbaufgabe<br><span style="color: ${COLOURS[0]}">${
    EN_DE[COLOURS[0]]
}</span> &emsp;&emsp; <span style="color: ${COLOURS[1]}">${
    EN_DE[COLOURS[1]]
}</span><br> (Q-Taste) &emsp;&emsp; (P-Taste) <br><br> Wenn Farbe <span style="color: ${COLOURS[2]}">${
    EN_DE[COLOURS[2]]
}, </span>dann<br><br> 2. Priorität: Buchstabenaufgabe<br> ${
    LETTERS[0]
} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${
    LETTERS[1]
}<br> (Q-Taste)&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (P-Taste)<br><br> 
           Drücke eine beliebige Taste, um fortzufahren!`;

const RESP_TEXT_TRIAL = `<span style="color: ${COLOURS[0]}">${
    EN_DE[COLOURS[0]]
}</span> &emsp;&emsp; <span style="color: ${COLOURS[1]}">${
    EN_DE[COLOURS[1]]
}</span><br> (Q-Taste) &emsp;&emsp; (P-Taste) <br><br>Wenn Farbe <span style="color: ${COLOURS[2]}">${
    EN_DE[COLOURS[2]]
}, </span>dann<br><br>${LETTERS[0]} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ${
    LETTERS[1]
}<br> (Q-Taste)&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; (P-Taste)<br><br>`;

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: RESP_TEXT,
        align: "center",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

function drawFixation() {
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
    func: drawFixation,
};

const TASK_INSTRUCTIONS_BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}`,
                fontsize: 30,
                align: "left",
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            }) +
            generate_formatted_html({
                text: RESP_TEXT,
                align: "center",
                fontsize: 30,
                width: "1200px",
                bold: true,
                lineheight: 1.5,
            });
    },
};

const TASK_INSTRUCTIONS_HALF = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***** ACHTUNG *****<br><br>
          Half experiment completed!
          Drücke eine beliebige Taste, um fortzufahren.`,
        fontsize: 38,
        lineheight: 1.5,
        align: "center",
        bold: true,
    }),
};

// prettier-ignore
const TRIALS_HIPRI_LOWBACK = [
    { blk_type: "HiPri_LowBack", response_task: "primary",    colour: COLOURS[0], letter: LETTERS[0], compatibility: "comp",   key: PRMS.respKeys[0]},
    { blk_type: "HiPri_LowBack", response_task: "primary",    colour: COLOURS[0], letter: LETTERS[1], compatibility: "incomp", key: PRMS.respKeys[0]},
    { blk_type: "HiPri_LowBack", response_task: "primary",    colour: COLOURS[1], letter: LETTERS[1], compatibility: "comp",   key: PRMS.respKeys[1]},
    { blk_type: "HiPri_LowBack", response_task: "primary",    colour: COLOURS[1], letter: LETTERS[0], compatibility: "incomp", key: PRMS.respKeys[1]},
    { blk_type: "HiPri_LowBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[0], compatibility: "na",     key: PRMS.respKeys[0]},
    { blk_type: "HiPri_LowBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[1], compatibility: "na",     key: PRMS.respKeys[1]},
    { blk_type: "HiPri_LowBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[0], compatibility: "na",     key: PRMS.respKeys[0]},
    { blk_type: "HiPri_LowBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[1], compatibility: "na",     key: PRMS.respKeys[1]},
];

// prettier-ignore
const TRIALS_LOWPRI_HIGHBACK = [
    { blk_type: "LowPri_HighBack", response_task: "primary",    colour: COLOURS[0], letter: LETTERS[0], compatibility: "comp",   key: PRMS.respKeys[0]},
    { blk_type: "LowPri_HighBack", response_task: "primary",    colour: COLOURS[0], letter: LETTERS[1], compatibility: "incomp", key: PRMS.respKeys[0]},
    { blk_type: "LowPri_HighBack", response_task: "primary",    colour: COLOURS[1], letter: LETTERS[1], compatibility: "comp",   key: PRMS.respKeys[1]},
    { blk_type: "LowPri_HighBack", response_task: "primary",    colour: COLOURS[1], letter: LETTERS[0], compatibility: "incomp", key: PRMS.respKeys[1]},
    { blk_type: "LowPri_HighBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[0], compatibility: "na",     key: PRMS.respKeys[0]},
    { blk_type: "LowPri_HighBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[1], compatibility: "na",     key: PRMS.respKeys[1]},
    { blk_type: "LowPri_HighBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[0], compatibility: "na",     key: PRMS.respKeys[0]},
    { blk_type: "LowPri_HighBack", response_task: "background", colour: COLOURS[2], letter: LETTERS[1], compatibility: "na",     key: PRMS.respKeys[1]},
];

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.font = PRMS.stimFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    // draw surrounding rectangle
    ctx.strokeStyle = args.colour;
    ctx.lineWidth = PRMS.lineWidth;
    ctx.beginPath();
    ctx.rect(-40, -50, 80, 100);
    ctx.stroke();

    // letter task
    ctx.fillText(args.letter, 0, 5);
}

function draw_rsi() {
    "use strict";
}

const RSI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.rsi,
    response_ends_trial: false,
    func: draw_rsi,
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : PRMS.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.correct_key);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }

    // reward
    let reward;
    if (corrCode === 1) {
        if (dat.blk_type === "HiPri_LowBack" && dat.response_task === "primary") {
            reward = Math.random() < 0.8 ? 10 : 2;
        }
        if (dat.blk_type === "HiPri_LowBack" && dat.response_task === "background") {
            reward = Math.random() < 0.2 ? 10 : 2;
        }
        if (dat.blk_type === "LowPri_HighBack" && dat.response_task === "primary") {
            reward = Math.random() < 0.2 ? 10 : 2;
        }
        if (dat.blk_type === "LowPri_HighBack" && dat.response_task === "background") {
            reward = Math.random() < 0.8 ? 10 : 2;
        }
    } else {
        reward = 0;
    }
    PRMS.points += reward;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
        reward: reward,
        points: PRMS.points,
    });
}

const PP_TRIAL = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: null,
    func: drawStimulus,
    letter: null,
    colour: null,
    func_args: [{ colour: jsPsych.timelineVariable("colour"), letter: jsPsych.timelineVariable("letter") }],
    data: {
        stim: "ppr1",
        blk_type: jsPsych.timelineVariable("blk_type"),
        response_task: jsPsych.timelineVariable("response_task"),
        colour: jsPsych.timelineVariable("colour"),
        letter: jsPsych.timelineVariable("letter"),
        compatibility: jsPsych.timelineVariable("compatibility"),
        correct_key: jsPsych.timelineVariable("key"),
    },
    on_start: function (trial) {
        if ((PRMS.cBlk === 1) | (PRMS.cBlk === PRMS.nBlks / 2 + 1)) {
            trial.trial_duration === PRMS.tooSlowP;
        } else {
            trial.trial_duration === PRMS.tooSlow;
        }
    },
    on_finish: function () {
        codeTrial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK_ERROR = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    trial_duration: null,
    response_ends_trial: false,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.stimulus =
            generate_formatted_html({
                text: `Falsch---keine Punkte!<br>`,
                align: "center",
                fontsize: 36,
                width: "1200px",
                bold: true,
            }) +
            generate_formatted_html({
                text: RESP_TEXT_TRIAL,
                align: "center",
                fontsize: 36,
                width: "1200px",
                bold: true,
            });
    },
};

function drawReward(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    if (args.corrCode != 1) {
        // draw text
        ctx.font = PRMS.fbFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(PRMS.fbText[args.corrCode - 1], 0, 0);
    } else if (args.corrCode === 1) {
        // draw image
        let img = new Image();

        if (args.reward === 10) {
            img.src = REWARD_IMAGES[0]; // high reward
        } else if (args.reward === 2) {
            img.src = REWARD_IMAGES[1]; // low reward
        }

        // draw image
        const size = 8;
        const width = img.width;
        const height = img.height;
        ctx.drawImage(img, -width / size / 2, -height / size / 2 + 35, width / size, height / size);
    }
}

const TRIAL_FEEDBACK_CORRECT = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: null,
    func: drawReward,
    func_args: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.func_args = [{ corrCode: dat.corrCode, reward: dat.reward }];
    },
};

const IF_TRIAL_CORRECT = {
    timeline: [TRIAL_FEEDBACK_CORRECT],
    conditional_function: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        return dat.corrCode === 1;
    },
};

const IF_TRIAL_ERROR = {
    timeline: [TRIAL_FEEDBACK_ERROR],
    conditional_function: function () {
        let dat = jsPsych.data.get().last(2).values()[0];
        return dat.corrCode !== 1;
    },
};

function blockFeedbackTxt() {
    "use strict";

    let blockFbTxt =
        generate_formatted_html({
            text: `Kurze Pause.`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            bold: true,
            lineheight: 1.5,
        }) +
        generate_formatted_html({
            text: `Punkte: ${PRMS.points}<br><br> 
        Drücke eine beliebige Taste um fortzufahren.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            bold: true,
            lineheight: 1.5,
        });

    return blockFbTxt;
}

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: true,
    on_start: function (trial) {
        trial.stimulus = blockFeedbackTxt();
    },
    on_finish: function () {
        PRMS.cBlk += 1;
        PRMS.cTrl = 1;
    },
};

const TRIAL_TIMELINE_HIGHPRI_LOWBACK = {
    timeline: [FIXATION_CROSS, PP_TRIAL, IF_TRIAL_CORRECT, IF_TRIAL_ERROR],
    timeline_variables: TRIALS_HIPRI_LOWBACK,
};

const TRIAL_TIMELINE_LOWPRI_HIGHBACK = {
    timeline: [FIXATION_CROSS, PP_TRIAL, IF_TRIAL_CORRECT, IF_TRIAL_ERROR],
    timeline_variables: TRIALS_LOWPRI_HIGHBACK,
};

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, "ppr1_");

const VP_CODE_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text:
            `Vielen Dank für Ihre Teilnahme.<br><br>
       Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
       zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       roy.chandrakant-mehta@student.uni-tuebingen.de<br><br>
       Code: ` +
            RANDOM_STRING +
            `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        bold: true,
        lineheight: 1.5,
    }),
};

const EMAIL_OPTION_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Das Experiment ist jetzt beendet.<br><br>
      Vielen Dank für Deine Teilnahme!<br><br>
      Im nächsten Fenster wirst Du aufgefordert Deine E-Mail-Adresse für die Gutscheinvergabe anzugeben.
      Wenn Du das nicht möchtest, lasse das Feld einfach leer.<br><br>
      Falls Du Fragen zu unserem Experiment hast, kannst Du uns gerne unter folgender E-Mail-Adresse kontaktieren:<br><br>
      roy.chandrakant-mehta@student.uni-tuebingen.de<br><br>
      Drücke die Leertaste, um fortzufahren!`,
        fontsize: 26,
        align: "left",
    }),
};

const EMAIL_OPTION = {
    type: jsPsychSurveyText,
    questions: [
        { prompt: "E-Mail-Addresse?", placeholder: "email@email", columns: 50, required: false, name: "email" },
    ],
    button_label: "Weiter",
    on_finish: function () {
        let dat = jsPsych.data.get().last(1).values()[0];
        jsPsych.data.addProperties({ email: dat.response.email });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, { stim: "ppr1" });
    // saveDataLocal(data_fn, { stim: 'vts' });

    const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
    saveRandomCode("/Common/write_code.php", code_fn, RANDOM_STRING);
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
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(PRELOAD);

    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(VP_CODE_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    let blk_type;
    if (VERSION === 1) {
        blk_type = repeatArray(["HiPri_LowBack"], PRMS.nBlks / 2).concat(
            repeatArray(["LowPri_HighBack"], PRMS.nBlks / 2),
        );
    } else if (VERSION === 2) {
        blk_type = repeatArray(["LowPri_HighBack"], PRMS.nBlks / 2).concat(
            repeatArray(["HiPri_LowBack"], PRMS.nBlks / 2),
        );
    }

    for (let blk = 0; blk < PRMS.nBlks; blk++) {
        // manipulation instructions at very start or half way
        if (blk === 0) {
            exp.push(TASK_INSTRUCTIONS_MANIPULATION1);
        } else if (blk === PRMS.cBlk / 2) {
            exp.push(TASK_INSTRUCTIONS_MANIPULATION2);
        }

        exp.push(TASK_INSTRUCTIONS_BLOCK_START);
        exp.push(RSI); // blank before 1st trial start

        let blk_timeline;
        if (blk_type[blk] === "HiPri_LowBack") {
            blk_timeline = { ...TRIAL_TIMELINE_HIGHPRI_LOWBACK };
        } else if (blk_type[blk] === "LowPri_HighBack") {
            blk_timeline = { ...TRIAL_TIMELINE_LOWPRI_HIGHBACK };
        }

        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.nTrls / TRIALS_HIPRI_LOWBACK.length,
        };
        exp.push(blk_timeline);

        // between block feedback
        exp.push(BLOCK_FEEDBACK);
    }

    // end of experiment stuff
    // email
    exp.push(mouseCursor(true));
    exp.push(EMAIL_OPTION_INSTRUCTIONS);
    exp.push(EMAIL_OPTION);

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(VP_CODE_INSTRUCTIONS2);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
