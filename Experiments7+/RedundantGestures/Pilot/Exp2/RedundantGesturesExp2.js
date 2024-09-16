// RedundantGestures
// VPs respond to the auditory/visual presentation of the following stimuli:

var _0x2479 = [
    "\x63\x42\x6C\x6B",
    "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x75\x6E\x69\x2D\x74\x75\x65\x62\x69\x6E\x67\x65\x6E\x2E\x73\x6F\x6E\x61\x2D\x73\x79\x73\x74\x65\x6D\x73\x2E\x63\x6F\x6D\x2F\x77\x65\x62\x73\x74\x75\x64\x79\x5F\x63\x72\x65\x64\x69\x74\x2E\x61\x73\x70\x78\x3F\x65\x78\x70\x65\x72\x69\x6D\x65\x6E\x74\x5F\x69\x64\x3D\x31\x36\x39\x26\x63\x72\x65\x64\x69\x74\x5F\x74\x6F\x6B\x65\x6E\x3D\x32\x32\x39\x66\x64\x34\x30\x31\x39\x39\x39\x63\x34\x36\x30\x36\x39\x63\x65\x34\x34\x30\x33\x66\x62\x39\x62\x38\x32\x63\x38\x39\x26\x73\x75\x72\x76\x65\x79\x5F\x63\x6F\x64\x65\x3D",
    "\x73\x6F\x6E\x61\x5F\x69\x64",
    "\x75\x72\x6C\x56\x61\x72\x69\x61\x62\x6C\x65\x73",
    "\x64\x61\x74\x61",
    "\x61\x73\x73\x69\x67\x6E",
    "\x6C\x6F\x63\x61\x74\x69\x6F\x6E",
];

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS[_0x2479[0]] > 1) {
            window[_0x2479[6]][_0x2479[5]](_0x2479[1] + jsPsych[_0x2479[4]][_0x2479[3]]()[_0x2479[2]]);
        }
    },
});

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid Black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 6, // number of blocks
    nTrlsP: 8, // number of blocks
    nTrlsE: 48, // number of blocks
    fixDur: 1000, //1000, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [1000, 1000], // duration of feedback for each type
    fbTxt: ["Richtig!", "Falsch!"],
    iti: 1000, // duration of inter-trial-interval
    respKeys: ["F", "J"],
    box_position: [100, 150],
    box_size: 100,
    box_frame: 5,
    question_duration: 2500,
    question_font: "bold 40px Arial",
    question_colour: "Black",
    question_position: [0, -160],
    answer_text: "",
    answer_font: "bold 40px Arial",
    answer_position: [0, -160],
    video_width: 500,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const CONSENT_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Einwilligungserklärung:<br><br>
               Herzlich willkommen bei unserer Studie "Wo ist der Ball?"! Wir danken Ihnen für Ihr Interesse an dieser Studie.<br><br>
               Wir untersuchen mit dieser Studie, wie Menschen Sprache verstehen und verarbeiten.
               Ablauf der Studie: Das folgende Experiment besteht aus sechs Blöcken, dazwischen kann man selbst entscheiden, wie lange man Pause machen möchte. Insgesamt dauert das Experiment ca. 0.5 Stunden. 
               Ihre Aufgabe ist es in jedem Durchgang zu entscheiden, ob sich ein Ball in einer linken oder rechten Box befindet. Dazu lesen Sie zuerst eine Frage, dann sehen Sie einen kurzen Video-Ausschnitt, der diese Frage beantwortet, und danach drücken Sie eine Taste. 
               Wir erheben von Ihnen Angaben zu Alter, Geschlecht, Händigkeit und ob Deutsch Ihre Muttersprache ist.
               Sollten Sie noch Fragen haben oder sich technische Probleme ergeben, wenden Sie sich damit bitte per mail an den Versuchsleiter/ die Versuchsleiterin.<br><br>
               Freiwilligkeit und Anonymität: Die Teilnahme an der Studie ist freiwillig. Sie können jederzeit und ohne Angabe von Gründen die Teilnahme an dieser Studie beenden. Wird die Studie vor Beendigung abgebrochen, werden die bis dahin erhobenen Daten nicht gespeichert. 
               Die im Rahmen dieser Studie erhobenen, oben beschriebenen Daten und persönlichen Mitteilungen werden vertraulich behandelt. So unterliegen diejenigen Projektmitarbeiter, die über personenbezogene Daten verfügen, der Schweigepflicht bzw. dem Datengeheimnis. Des Weiteren wird die Veröffentlichung der Ergebnisse der Studie in anonymisierter Form erfolgen, d. h. ohne dass Ihre Daten Ihrer Person zugeordnet werden können.<br><br>
               Datenschutz: Die Erhebung und Verarbeitung Ihrer oben beschriebenen persönlichen Daten erfolgt anonym unter Verwendung einer zufällig zugewiesenen Nummer und ohne Angabe Ihres Namens in der Abteilung Sprache & Kognition des Psychologischen Instituts der Universität Tübingen. IP-Adressen und/oder IDs der Erhebungsplattform werden nicht mit den Daten gespeichert. Damit ist es niemandem möglich, die erhobenen Daten mit Ihrem Namen in Verbindung zu bringen. Eine Löschung der Daten nach Abschluss des Experiments ist somit nicht möglich.	 Daten in digitaler Form werden auf dem passwortgeschützten Laufwerk der Arbeitsgruppe von Prof. Dr. Barbara Kaup an der Universität Tübingen gelagert. Sollten ausnahmsweise Daten in digitaler Form auf privaten PCs, zu denen sonst niemand anders Zugang hat, gespeichert werden, werden diese nach Beenden der Datenanalysen von den privaten PCs wieder gelöscht. Die anonymen Daten dieser Studie werden als offene Daten im Internet zugänglich gemacht. Damit folgt diese Studie den Empfehlungen der Deutschen Forschungsgemeinschaft (DFG) und der Deutschen Gesellschaft für Psychologie (DGPs) zur Qualitätssicherung in der Forschung.<br><br>
               Vergütung: Für die Teilnahme erhalten Sie 0.5 Versuchspersonenstunden gutgeschrieben, die geschieht über das SONA System. 
               Sollte das Experiment während der Bearbeitung abbrechen, wenden Sie sich bitte mit der ungefähren Bearbeitungsdauer an den/die verantwortliche/n Ansprechpartner/in.<br><br>
               Verantwortlicher Ansprechpartner während der Studie: Lisa Fischer lisa2.fischer@student.uni-tuebingen.de<br><br>
               Ich bestätige die Teilnehmerinformationen gelesen zu haben und bin mit der Teilnahme einverstanden.
               Meine Teilnahme erfolgt freiwillig. Ich weiß, dass ich die Möglichkeit habe, meine Teilnahme an dieser Studie jederzeit und ohne Angabe von Gründen abzubrechen, ohne dass mir daraus Nachteile entstehen. 
               Ich erkläre, dass ich mit der im Rahmen der Studie erfolgenden Aufzeichnung von Studiendaten und ihrer Verwendung in anonymisierter Form einverstanden bin.<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 18,
        width: "1250px",
    }),
};

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
               um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 30 Minuten konzentriert zu arbeiten.<br><br>
               Du erhältst die Versuchspersonenstunden automatisch am Ende des Experiments.
               Bei Fragen oder Problemen wende dich bitte an:<br><br>
               lisa2.fischer@student.uni-tuebingen.de<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang siehst du eine Frage bezüglich der Position eines
               Balls (z.B., „Ist der Ball in der blauen Box?“), danach siehst du
               einen kurzen Video-Clip und zwei farbige Boxen auf dem Bildschirm.<br><br>
               Deine Aufgabe ist es, die Position des Balls durch einen Tastendruck
               [Taste „F“ (linke Box) oder Taste „J“ (rechte Box)] richtig zu
               markieren.<br><br>
               Der Ablauf ist folgender:<br><br>
               Frage: „Ist der Ball in der blauen Box?“<br>
               Video: bejahende („ja“) oder verneinende („nein“) <br>
               Antwort -> dies kann durch Geste (Mimik), verbal oder durch beides ausgedrückt werden.<br>
               Reaktion: Jetzt drückst du die Taste „F“ oder die Taste „J“.<br><br>
               Drücke eine beliebige Taste, für ein paar Beispiele.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Hier ein paar Beispiele:<br><br>
               Frage: „Ist der Ball in der blauen Box?“<br><br>
               * Die blaue Box ist auf der linken Seite und im Video war eine 
               bejahende Antwort zu sehen -> du drückst die Taste „F“ (links)<br><br>
               * Die blaue Box ist auf der linken Seite und im Video war eine 
               verneinde Antwort zu sehen -> du drückst die Taste „J“ (rechts)<br><br>
               * Die blaue Box ist auf der rechten Seite und im Video war eine 
               bejahende Antwort zu sehen -> du drückst die Taste „J“ (rechts)<br><br>
               * Die blaue Box ist auf der rechten Seite und im Video war eine 
               verneinende Antwort zu sehen -> du drückst die Taste „F“ (links)<br><br><br>
               Die Aufgabe wird nach ein paar Übungsdurchgängen sicher nochmals verständlich.<br><br>
               Drücke eine beliebige Taste, um fortzufahren`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `ACHTUNG-Soundkalibierung:<br><br>
              Im Folgenden werden dir Video Ausschnitte präsentiert.
              Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du 
              deutlich die Tönen hören kannst.
              Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken!).<br><br>
        Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS_BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}.<br><br>
            Wenn du wieder bereit bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 28,
            bold: false,
            lineheight: 1.5,
        });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const VIDEOS = [
    "../videos/exp2_f_head_ja.mp4",
    "../videos/exp2_f_head_no.mp4",
    "../videos/exp2_f_head_verbal_ja.mp4",
    "../videos/exp2_f_head_verbal_no.mp4",
    "../videos/exp2_f_verbal_ja.mp4",
    "../videos/exp2_f_verbal_no.mp4",
    "../videos/exp2_m_head_ja.mp4",
    "../videos/exp2_m_head_no.mp4",
    "../videos/exp2_m_head_verbal_ja.mp4",
    "../videos/exp2_m_head_verbal_no.mp4",
    "../videos/exp2_m_verbal_ja.mp4",
    "../videos/exp2_m_verbal_no.mp4",
];

const PRELOAD = {
    type: jsPsychPreload,
    video: VIDEOS,
};

const QUESTIONS = ["Ist der Ball in der grünen Box?", "Ist der Ball in der blauen Box?"];

const COLOURS = ["Green", "Blue"];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

const TRIALS_CALIBRATION = [
    { video: VIDEOS[2] },
    { video: VIDEOS[3] },
    { video: VIDEOS[4] },
    { video: VIDEOS[5] },
    { video: VIDEOS[8] },
    { video: VIDEOS[9] },
    { video: VIDEOS[10] },
    { video: VIDEOS[11] },
];

const VIDEO_TRIAL_CALIBRATION = {
    type: jsPsychVideoKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: [jsPsych.timelineVariable("video")],
    width: PRMS.video_width,
    choices: PRMS.respKeys,
    trial_ends_after_video: true,
    translate_origin: true,
    response_ends_trial: false,
    box_colour_left: CANVAS_COLOUR,
    box_colour_right: CANVAS_COLOUR,
    answer_text: "",
    answer_font: "",
    answer_position: PRMS.answer_position,
    box_position: PRMS.box_position,
    box_size: 0,
    box_frame: 0,
};

const FIXATION_CROSS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: `<div style="font-size:${PRMS.fixSize}px;">+</div>`,
    response_ends_trial: false,
    trial_duration: PRMS.fixDur,
};

function drawQuestion(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // question
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = PRMS.question_font;
    ctx.fillStyle = PRMS.question_colour;
    ctx.fillText(args.question, PRMS.question_position[0], PRMS.question_position[1]);

    // boxes colour
    ctx.fillStyle = args.box_colour_left;
    ctx.fillRect(-PRMS.box_position[0] * 2, PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.fillStyle = args.box_colour_right;
    ctx.fillRect(PRMS.box_position[0], PRMS.box_position[1], PRMS.box_size, PRMS.box_size);

    // boxes border
    ctx.beginPath();
    ctx.lineWidth = PRMS.box_frame;
    ctx.strokeStyle = "Black";
    ctx.rect(-PRMS.box_position[0] * 2, PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.stroke();

    // boxes border
    ctx.beginPath();
    ctx.lineWidth = PRMS.box_frame;
    ctx.strokeStyle = "Black";
    ctx.rect(PRMS.box_position[0], PRMS.box_position[1], PRMS.box_size, PRMS.box_size);
    ctx.stroke();
}

const QUESTION = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.question_duration,
    func: drawQuestion,
    on_start: function (trial) {
        trial.func_args = [
            {
                question: jsPsych.timelineVariable("question"),
                box_colour_left: jsPsych.timelineVariable("box_colour_left"),
                box_colour_right: jsPsych.timelineVariable("box_colour_right"),
            },
        ];
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

function code_trial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];

    let is_correct = jsPsych.pluginAPI.compareKeys(dat.response, dat.correct_key);
    let error = is_correct ? 0 : 1;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        error: error,
    });
}

const VIDEO_TRIAL = {
    type: jsPsychVideoKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: [jsPsych.timelineVariable("video")],
    width: PRMS.video_width,
    choices: PRMS.respKeys,
    trial_ends_after_video: false,
    translate_origin: true,
    response_ends_trial: true,
    box_colour_left: jsPsych.timelineVariable("box_colour_left"),
    box_colour_right: jsPsych.timelineVariable("box_colour_right"),
    answer_text: PRMS.answer_text,
    answer_font: PRMS.answer_font,
    answer_position: PRMS.answer_position,
    box_position: PRMS.box_position,
    box_size: PRMS.box_size,
    box_frame: PRMS.box_frame,
    data: {
        stim: "rg2",
        video: jsPsych.timelineVariable("video"),
        question: jsPsych.timelineVariable("question"),
        box_colour_left: jsPsych.timelineVariable("box_colour_left"),
        box_colour_right: jsPsych.timelineVariable("box_colour_right"),
        correct_key: jsPsych.timelineVariable("correct_key"),
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.error];
        trial.stimulus = generate_formatted_html({
            text: `${PRMS.fbTxt[dat.error]}`,
            align: "center",
            fontsize: 30,
        });
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    stimulus: "",
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "rg2", blockNum: PRMS.cBlk },
            corrColumn: "error",
            corrValue: 0,
        });
        trial.stimulus = generate_formatted_html({
            text: `Block: ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
            Mittlere Reaktionzeit: ${block_dvs.meanRt} ms<br>
            Fehlerrate: ${block_dvs.errorRate} %<br><br>
            Wenn du wieder bereit bist, dann drücke eine beliebige Taste.`,
            align: "center",
            fontsize: 30,
        });
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

function create_trial_table() {
    // prettier-ignore
    let trial_table = [];
    for (let i = 0; i < 12; i++) {
        if (i % 2 == 0) {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                },
            ]);
        } else {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                },
                {
                    video: VIDEOS[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                },
            ]);
        }
    }
    return trial_table;
}

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [FIXATION_CROSS, VIDEO_TRIAL_CALIBRATION, ITI],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "fixed-repetitions",
        size: 1,
    },
};

const TRIAL_TABLE_PRACTICE = shuffle(create_trial_table()).slice(0, PRMS.nTrlsP);
const TRIAL_TABLE_EXP = create_trial_table();

const TRIAL_TIMELINE_PRACTICE = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_PRACTICE,
};

const TRIAL_TIMELINE_EXP = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_EXP,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    saveData("/Common/write_data.php", data_fn, { stim: "rg2" });
    // saveDataLocal(data_fn, { stim: "rg1" });
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
    exp.push(PRELOAD);
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(CONSENT_SCREEN);
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(TASK_INSTRUCTIONS_BLOCK_START);
        let blk_timeline;
        if (blk === 0) {
            blk_timeline = { ...TRIAL_TIMELINE_PRACTICE };
        } else {
            blk_timeline = { ...TRIAL_TIMELINE_EXP };
        }
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK);
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
