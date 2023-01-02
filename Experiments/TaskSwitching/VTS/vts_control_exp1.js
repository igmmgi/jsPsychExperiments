// Voluntary Task Switching paradigm with two tasks
// Task 1: Surrounding colour grid (task: more red vs. more blue?)
// Task 2: Central pictorial stroop task (task: gender)
//
// Block structure:
// 50% of trials are free choice with both task stimuli presented
// 50% of trials are forced choice (single stimulus) with 50% colour, 50% letter
//
// Trial structure:
// Fixation cross for 500 ms
// Stimulus (until response or ?)
// Feedback screen (if error for 1500 ms)
// ITI of 1000 ms

var _0x1db1=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x75\x6E\x69\x2D\x74\x75\x65\x62\x69\x6E\x67\x65\x6E\x2E\x73\x6F\x6E\x61\x2D\x73\x79\x73\x74\x65\x6D\x73\x2E\x63\x6F\x6D\x2F\x77\x65\x62\x73\x74\x75\x64\x79\x5F\x63\x72\x65\x64\x69\x74\x2E\x61\x73\x70\x78\x3F\x65\x78\x70\x65\x72\x69\x6D\x65\x6E\x74\x5F\x69\x64\x3D\x31\x34\x39\x26\x63\x72\x65\x64\x69\x74\x5F\x74\x6F\x6B\x65\x6E\x3D\x32\x62\x33\x65\x36\x32\x38\x61\x33\x62\x39\x37\x34\x65\x31\x63\x39\x37\x39\x34\x63\x63\x35\x31\x36\x38\x61\x63\x36\x36\x62\x38\x26\x73\x75\x72\x76\x65\x79\x5F\x63\x6F\x64\x65\x3D","\x73\x6F\x6E\x61\x5F\x69\x64","\x75\x72\x6C\x56\x61\x72\x69\x61\x62\x6C\x65\x73","\x64\x61\x74\x61","\x61\x73\x73\x69\x67\x6E","\x6C\x6F\x63\x61\x74\x69\x6F\x6E"];const jsPsych=initJsPsych({on_finish:function(){window[_0x1db1[5]][_0x1db1[4]](_0x1db1[0]+ jsPsych[_0x1db1[3]][_0x1db1[2]]()[_0x1db1[1]])}})

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
    screenRes: [960, 720], // minimum screen resolution requested
    nTrls: 100, // number of trials per block
    nBlks: 8, // number of blocks
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fixDur: 500, // duration of the fixation cross
    fbText: ["", "Falsch!"],
    iti: 1000, // duration of the inter-trial-interval
    feedbackDur: [0, 1500], // feedback duration
    fbFont: "30px Arial",
    colourTask: shuffle(["mehr Blau", "mehr Grün"]),
    genderTask: shuffle(["MANN", "FRAU"]),
    colours: ["rgba(0, 0, 255, 0.9)", "rgba(0, 200, 0, 0.9)"],
    colourTaskKeys: null, // randomly assigned below
    genderTaskKeys: null, // randomly assigned below
    ratioNormal: 63,
    respKeysLH: ["Q", "W"],
    respKeysRH: ["O", "P"],
    deactivateKeys: false, // should keys be deactivated when task not available?
    dotRadius: 1.5,
    dotEccentricity: 150,
    dotGaps: 4,
    dotBlank: 22,
    picSize: 5, // bigger number = smaller picture
    textFont: "bold 28px Arial",
    textColor: "White",
    cBlk: 1,
    cTrl: 1,
};

// 2 counter balanced versions
const VERSION = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

// Version 1: Colour task = left hand,  Gender task = right hand
// Version 2: Colour task = right hand, Gender task = left hand
if (VERSION === 1) {
    PRMS.colourTaskKeys = PRMS.respKeysLH; // e.g., more red vs. more blue
    PRMS.genderTaskKeys = PRMS.respKeysRH; // e.g., vowel vs. consonant
} else if (VERSION === 2) {
    PRMS.colourTaskKeys = PRMS.respKeysRH; // e.g., more red vs. more blue
    PRMS.genderTaskKeys = PRMS.respKeysLH; // e.g., vowel vs. consonant
}

function calculateNumberOfDots() {
    // Required for ratio manipulation in VTS
    PRMS.nDots = 0;
    for (let rows = -PRMS.dotEccentricity; rows <= PRMS.dotEccentricity; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
            if (
                (rows > -PRMS.dotGaps * PRMS.dotBlank) &
                (rows < PRMS.dotGaps * PRMS.dotBlank) &
                (cols > -PRMS.dotGaps * PRMS.dotBlank) &
                (cols < PRMS.dotGaps * PRMS.dotBlank)
            ) {
                continue;
            }
            PRMS.nDots += 1;
        }
    }
}

const COUNT_DOTS = {
    type: jsPsychCallFunction,
    func: calculateNumberOfDots,
};

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
           Bitte stelle sicher, dass Du Dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten Dich die ca. nächsten 40 Minuten konzentriert zu arbeiten.<br><br>
           Bei Fragen oder Problemen wende Dich bitte an:<br><br> 
           tina.lorenz@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
};

function task_instructions1() {
    if (VERSION === 1) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Farbaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
             Geschlechteraufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke die „G“-Taste, um fortzufahren.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    } else if (VERSION === 2) {
        return generate_formatted_html({
            text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
             Geschlechertaufgabe = Linke Hand: Bitte platziere hierzu den Mittelfinger und Zeigefinger auf die Tasten „Q“ und „W“.<br><br>
             Farbaufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten „O“ und „P“.<br><br>
             Drücke die „G“-Taste, um fortzufahren.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    }
}

const TASK_INSTRUCTIONS_TEXT = task_instructions1();

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: TASK_INSTRUCTIONS_TEXT,
    choices: ["G"],
};

let RESPMAPPING;
// prettier-ignore
if (VERSION === 1) {
    // left hand = colour, right hand = letter
    RESPMAPPING = generate_formatted_html({
        text: `Farbaufgabe = Linke Hand ${'&emsp;'.repeat(6)} Geschlechteraufgabe = Rechte Hand<br>
           ${PRMS.colourTask[0]} vs. ${PRMS.colourTask[1]}${'&emsp;'.repeat(12)}${PRMS.genderTask[0]} vs. ${PRMS.genderTask[1]}<br>
           (${PRMS.colourTaskKeys[0]}-Taste) ${'&emsp;'.repeat(3)}(${PRMS.colourTaskKeys[1]}-Taste)${'&emsp;'.repeat(11)}(${PRMS.genderTaskKeys[0]}-Taste)${'&emsp;'.repeat(3)}(${PRMS.genderTaskKeys[1]}-Taste)`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    });
} else if (VERSION === 2) {
    // left hand = letter, right hand = colour
    RESPMAPPING = generate_formatted_html({
        text: `Geschlechteraufgabe = Linke Hand ${'&emsp;'.repeat(6)} Farbaufgabe = Rechte Hand<br>
           ${PRMS.genderTask[0]} vs. ${PRMS.genderTask[1]}${'&emsp;'.repeat(12)}${PRMS.colourTask[0]} vs. ${PRMS.colourTask[1]}<br>
           (${PRMS.genderTaskKeys[0]}-Taste) ${'&emsp;'.repeat(3)}(${PRMS.genderTaskKeys[1]}-Taste)${'&emsp;'.repeat(11)}(${PRMS.colourTaskKeys[0]}-Taste)${'&emsp;'.repeat(3)}(${PRMS.colourTaskKeys[1]}-Taste)`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    });
}

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Für die Geschlechteraufgabe musst Du entscheiden, ob die Person auf dem Foto ein Mann oder eine Frau ist.
            Auf jedem Foto ist zusätzlich entweder das Wort „MANN“ oder „FRAU“ abgebildet. Ignoriere das Wort für Deine Entscheidung.<br><br>
            Für die Farbaufgabe musst Du entscheiden, ob die Mehrheit der Punkte Blau oder Grün ist.<br><br>
            Es gilt:`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        }) +
        RESPMAPPING +
        generate_formatted_html({
            text: `Drücke die „X“- Taste, um fortzufahren.`,
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
           Wenn nur eine Aufgabe präsentiert wird, dann bearbeite bitte diese. <br><br>
           Wenn beide Aufgaben präsentiert werden, kannst Du Dir frei aussuchen, welche Du bearbeitest.<br><br>
           Drücke die „T“- Taste, um fortzufahren.`,
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
                text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
               Entscheide selbst, welche Aufgabe Du bearbeiten willst, wenn beide Aufgaben verfügbar sind. Bearbeite sonst die Aufgabe, die präsentiert ist. Es gilt:`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            }) +
            RESPMAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.5,
            });
    },
    on_finish: function() {
        FACE_IMAGES = shuffle_images(FACE_IMAGES_MALE, FACE_IMAGES_FEMALE);
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
            text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Kurze Pause.<br><br>
             Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function() {
        PRMS.cBlk += 1;
        PRMS.cTrl = 1;
    },
};

const TASK_INSTRUCTIONS_RESPMAPPING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: RESPMAPPING,
};

const FACE_IMAGES_MALE = [
    "../images/male/004_o_m_n_a.jpg",
    "../images/male/007_m_m_n_a.jpg",
    "../images/male/008_y_m_n_a.jpg",
    "../images/male/013_y_m_n_a.jpg",
    "../images/male/014_m_m_n_a.jpg",
    "../images/male/015_o_m_n_a.jpg",
    "../images/male/016_y_m_n_a.jpg",
    "../images/male/018_o_m_n_a.jpg",
    "../images/male/025_y_m_n_a.jpg",
    "../images/male/026_m_m_n_a.jpg",
    "../images/male/027_o_m_n_a.jpg",
    "../images/male/031_y_m_n_a.jpg",
    "../images/male/032_m_m_n_a.jpg",
    "../images/male/033_o_m_n_a.jpg",
    "../images/male/037_y_m_n_a.jpg",
    "../images/male/038_m_m_n_a.jpg",
    "../images/male/039_o_m_n_a.jpg",
    "../images/male/041_y_m_n_a.jpg",
    "../images/male/042_o_m_n_a.jpg",
    "../images/male/045_m_m_n_a.jpg",
    "../images/male/046_o_m_n_a.jpg",
    "../images/male/049_y_m_n_a.jpg",
    "../images/male/051_m_m_n_a.jpg",
    "../images/male/053_o_m_n_a.jpg",
    "../images/male/056_m_m_n_a.jpg",
    "../images/male/057_y_m_n_a.jpg",
    "../images/male/058_m_m_n_a.jpg",
    "../images/male/059_o_m_n_a.jpg",
    "../images/male/062_y_m_n_a.jpg",
    "../images/male/065_o_m_n_a.jpg",
    "../images/male/066_y_m_n_a.jpg",
    "../images/male/068_m_m_n_a.jpg",
    "../images/male/070_m_m_n_a.jpg",
    "../images/male/072_y_m_n_a.jpg",
    "../images/male/074_o_m_n_a.jpg",
    "../images/male/076_o_m_n_a.jpg",
    "../images/male/077_m_m_n_a.jpg",
    "../images/male/081_y_m_n_a.jpg",
    "../images/male/082_m_m_n_a.jpg",
    "../images/male/083_o_m_n_a.jpg",
    "../images/male/087_m_m_n_a.jpg",
    "../images/male/089_y_m_n_a.jpg",
    "../images/male/092_m_m_n_a.jpg",
    "../images/male/094_m_m_n_a.jpg",
    "../images/male/099_y_m_n_a.jpg",
    "../images/male/102_o_m_n_a.jpg",
    "../images/male/104_m_m_n_a.jpg",
    "../images/male/105_y_m_n_a.jpg",
    "../images/male/107_o_m_n_a.jpg",
    "../images/male/108_m_m_n_a.jpg",
    "../images/male/109_y_m_n_a.jpg",
    "../images/male/114_y_m_n_a.jpg",
    "../images/male/116_m_m_n_a.jpg",
    "../images/male/118_o_m_n_a.jpg",
    "../images/male/119_y_m_n_a.jpg",
    "../images/male/121_o_m_n_a.jpg",
    "../images/male/123_y_m_n_a.jpg",
    "../images/male/126_m_m_n_a.jpg",
    "../images/male/127_y_m_n_a.jpg",
    "../images/male/131_o_m_n_a.jpg",
    "../images/male/135_y_m_n_a.jpg",
    "../images/male/136_m_m_n_a.jpg",
    "../images/male/137_o_m_n_a.jpg",
    "../images/male/141_o_m_n_a.jpg",
    "../images/male/142_m_m_n_a.jpg",
    "../images/male/144_y_m_n_a.jpg",
    "../images/male/146_o_m_n_a.jpg",
    "../images/male/147_y_m_n_a.jpg",
    "../images/male/149_m_m_n_a.jpg",
    "../images/male/151_o_m_n_a.jpg",
    "../images/male/153_y_m_n_a.jpg",
    "../images/male/155_m_m_n_a.jpg",
    "../images/male/159_m_m_n_a.jpg",
    "../images/male/160_y_m_n_a.jpg",
    "../images/male/161_o_m_n_a.jpg",
    "../images/male/165_m_m_n_a.jpg",
    "../images/male/166_o_m_n_a.jpg",
    "../images/male/167_y_m_n_a.jpg",
    "../images/male/169_m_m_n_a.jpg",
    "../images/male/170_y_m_n_a.jpg",
    "../images/male/172_o_m_n_a.jpg",
    "../images/male/175_y_m_n_a.jpg",
    "../images/male/176_o_m_n_a.jpg",
    "../images/male/178_m_m_n_a.jpg",
    "../images/male/179_m_m_n_a.jpg",
];

const FACE_IMAGES_FEMALE = [
    "../images/female/005_o_f_n_a.jpg",
    "../images/female/006_m_f_n_a.jpg",
    "../images/female/010_y_f_n_a.jpg",
    "../images/female/011_m_f_n_a.jpg",
    "../images/female/012_o_f_n_a.jpg",
    "../images/female/019_m_f_n_a.jpg",
    "../images/female/020_y_f_n_a.jpg",
    "../images/female/021_o_f_n_a.jpg",
    "../images/female/022_y_f_n_a.jpg",
    "../images/female/024_o_f_n_a.jpg",
    "../images/female/028_y_f_n_a.jpg",
    "../images/female/029_m_f_n_a.jpg",
    "../images/female/030_o_f_n_a.jpg",
    "../images/female/034_y_f_n_a.jpg",
    "../images/female/035_m_f_n_a.jpg",
    "../images/female/036_o_f_n_a.jpg",
    "../images/female/040_y_f_n_a.jpg",
    "../images/female/043_m_f_n_a.jpg",
    "../images/female/044_o_f_n_a.jpg",
    "../images/female/047_o_f_n_a.jpg",
    "../images/female/048_y_f_n_a.jpg",
    "../images/female/050_m_f_n_a.jpg",
    "../images/female/052_m_f_n_a.jpg",
    "../images/female/054_y_f_n_a.jpg",
    "../images/female/055_o_f_n_a.jpg",
    "../images/female/060_o_f_n_a.jpg",
    "../images/female/061_m_f_n_a.jpg",
    "../images/female/063_y_f_n_a.jpg",
    "../images/female/064_m_f_n_a.jpg",
    "../images/female/067_o_f_n_a.jpg",
    "../images/female/069_y_f_n_a.jpg",
    "../images/female/071_y_f_n_a.jpg",
    "../images/female/073_m_f_n_a.jpg",
    "../images/female/075_o_f_n_a.jpg",
    "../images/female/079_o_f_n_a.jpg",
    "../images/female/080_m_f_n_a.jpg",
    "../images/female/084_m_f_n_a.jpg",
    "../images/female/085_y_f_n_a.jpg",
    "../images/female/086_o_f_n_a.jpg",
    "../images/female/088_o_f_n_a.jpg",
    "../images/female/090_y_f_n_a.jpg",
    "../images/female/093_m_f_n_a.jpg",
    "../images/female/096_o_f_n_a.jpg",
    "../images/female/097_m_f_n_a.jpg",
    "../images/female/098_y_f_n_a.jpg",
    "../images/female/100_o_f_n_a.jpg",
    "../images/female/101_y_f_n_a.jpg",
    "../images/female/103_m_f_n_a.jpg",
    "../images/female/106_y_f_n_a.jpg",
    "../images/female/110_o_f_n_a.jpg",
    "../images/female/111_m_f_n_a.jpg",
    "../images/female/112_o_f_n_a.jpg",
    "../images/female/113_m_f_n_a.jpg",
    "../images/female/115_y_f_n_a.jpg",
    "../images/female/117_m_f_n_a.jpg",
    "../images/female/120_o_f_n_a.jpg",
    "../images/female/122_m_f_n_a.jpg",
    "../images/female/124_o_f_n_a.jpg",
    "../images/female/125_y_f_n_a.jpg",
    "../images/female/128_m_f_n_a.jpg",
    "../images/female/130_o_f_n_a.jpg",
    "../images/female/132_y_f_n_a.jpg",
    "../images/female/133_o_f_n_a.jpg",
    "../images/female/134_y_f_n_a.jpg",
    "../images/female/138_m_f_n_a.jpg",
    "../images/female/139_m_f_n_a.jpg",
    "../images/female/140_y_f_n_a.jpg",
    "../images/female/143_o_f_n_a.jpg",
    "../images/female/148_o_f_n_a.jpg",
    "../images/female/150_y_f_n_a.jpg",
    "../images/female/152_y_f_n_a.jpg",
    "../images/female/154_o_f_n_a.jpg",
    "../images/female/156_m_f_n_a.jpg",
    "../images/female/157_m_f_n_a.jpg",
    "../images/female/158_o_f_n_a.jpg",
    "../images/female/162_y_f_n_a.jpg",
    "../images/female/163_y_f_n_a.jpg",
    "../images/female/164_o_f_n_a.jpg",
    "../images/female/168_m_f_n_a.jpg",
    "../images/female/171_y_f_n_a.jpg",
    "../images/female/173_y_f_n_a.jpg",
    "../images/female/174_o_f_n_a.jpg",
    "../images/female/177_y_f_n_a.jpg",
    "../images/female/180_m_f_n_a.jpg",
    "../images/female/182_y_f_n_a.jpg",
];

function shuffle_images(set1, set2) {
    return shuffle(set1.concat(set2));
}

let FACE_IMAGES = FACE_IMAGES_MALE.concat(FACE_IMAGES_FEMALE);

const PRELOAD = {
    type: jsPsychPreload,
    images: FACE_IMAGES,
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

function drawStimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    // draw colour dots
    let radius = PRMS.dotRadius;
    let idx = 0;
    for (let rows = -PRMS.dotEccentricity; rows <= PRMS.dotEccentricity; rows += PRMS.dotGaps) {
        for (let cols = -PRMS.dotEccentricity; cols <= PRMS.dotEccentricity; cols += PRMS.dotGaps) {
            if (
                (rows > -PRMS.dotGaps * PRMS.dotBlank) &
                (rows < PRMS.dotGaps * PRMS.dotBlank) &
                (cols > -PRMS.dotGaps * PRMS.dotBlank) &
                (cols < PRMS.dotGaps * PRMS.dotBlank)
            ) {
                continue;
            }
            let centerX = rows;
            let centerY = cols - 10;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = args.colours[idx];
            ctx.fill();
            idx += 1;
        }
    }

    // draw image
    let img = new Image();
    img.src = args.face;
    const width = img.width;
    const height = img.height;
    ctx.drawImage(
        img,
        -width / PRMS.picSize / 2,
        -height / PRMS.picSize / 2 - 10,
        width / PRMS.picSize,
        height / PRMS.picSize,
    );

    // draw text over face
    ctx.font = PRMS.textFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = PRMS.textColor;
    ctx.fillText(args.text, 0, 0);
}

const VTS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: null,
    trial_duration: PRMS.tooSlow,
    func: drawStimulus,
    func_args: null,
    data: {
        stim_type: "vtsr",
        trial_type: jsPsych.timelineVariable("trial_type"),
        free_forced: jsPsych.timelineVariable("free_forced"),
        forced_task: jsPsych.timelineVariable("forced_task"),
    },
    on_start: function(trial) {
        "use strict";

        // gender task
        trial.data.face = "";
        trial.data.text = "";
        trial.data.face_text_comp = "na";
        trial.data.corr_resp_gender = "na";

        if ((trial.data.forced_task === "na") | (trial.data.forced_task === "gender")) {
            trial.data.face = FACE_IMAGES.shift(); // randomly pick face image
            trial.data.text = shuffle([...PRMS.genderTask])[0];
            if (trial.data.face.includes("female")) {
                trial.data.corr_resp_gender = PRMS.genderTaskKeys[PRMS.genderTask.indexOf("FRAU")];
                trial.data.face_text_comp = trial.data.text === "FRAU" ? "comp" : "incomp";
            } else if (trial.data.face.includes("male")) {
                trial.data.corr_resp_gender = PRMS.genderTaskKeys[PRMS.genderTask.indexOf("MANN")];
                trial.data.face_text_comp = trial.data.text === "MANN" ? "comp" : "incomp";
            }
        }

        // colour task
        trial.data.colour_more = "";
        trial.data.corr_resp_colour = "na";
        let dot_colours = repeatArray(CANVAS_COLOUR, Math.round(PRMS.nDots));
        if ((trial.data.forced_task === "na") | (trial.data.forced_task === "colour")) {
            let ratio = PRMS.ratioNormal;
            trial.data.colour_more = shuffle(["mehr Blau", "mehr Grün"])[0];
            let colour_order;
            if (trial.data.colour_more === "mehr Blau") {
                colour_order = [0, 1];
            } else if (trial.data.colour_more === "mehr Grün") {
                colour_order = [1, 0];
            }

            dot_colours = shuffle(
                repeatArray(PRMS.colours[colour_order[0]], Math.round(PRMS.nDots * (ratio / 100))).concat(
                    repeatArray(PRMS.colours[colour_order[1]], Math.round((PRMS.nDots * (100 - ratio)) / 100)),
                ),
            );

            // code letter response
            trial.data.corr_resp_colour = PRMS.colourTaskKeys[PRMS.colourTask.indexOf(trial.data.colour_more)];
        }

        // activate response keys
        if (PRMS.deactivateKeys) {
            // only available task keys activated
            if ((trial.data.face !== "") & (trial.data.colour_more !== "na")) {
                trial.choices = PRMS.genderTaskKeys.concat(PRMS.colourTaskKeys);
            } else if ((trial.data.face !== "") & (trial.data.colour_more === "na")) {
                trial.choices = PRMS.genderTaskKeys;
            } else if ((trial.data.face === "") & (trial.data.colour_more !== "na")) {
                trial.choices = PRMS.colourTaskKeys;
            }
        } else {
            trial.choices = PRMS.genderTaskKeys.concat(PRMS.colourTaskKeys);
        }

        trial.func_args = [
            {
                trial_type: jsPsych.timelineVariable("trial_type"),
                face: trial.data.face,
                text: trial.data.text,
                colour_more: trial.data.colour_more,
                colours: dot_colours,
            },
        ];
    },
    on_finish: function() {
        codeTrial();
    },
};

function codeTrial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // which task did they perform?
    let respondedGender = PRMS.genderTaskKeys.includes(dat.key_press.toUpperCase());
    let respondedColour = PRMS.colourTaskKeys.includes(dat.key_press.toUpperCase());
    let responseTask = respondedGender ? "gender" : "colour";

    // 1 = correct
    // 2 = incorrect
    let corrCode = 1;
    if (respondedGender & (dat.key_press.toUpperCase() !== dat.corr_resp_gender)) {
        corrCode = 2;
    } else if (respondedColour & (dat.key_press.toUpperCase() !== dat.corr_resp_colour)) {
        corrCode = 2;
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        responseTask: responseTask,
        corrCode: corrCode,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });

    PRMS.cTrl += 1;
}

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: false,
    stimulus: "",
    trial_duration: 0,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.corrCode === 2) {
            trial.trial_duration = PRMS.feedbackDur[dat.corrCode - 1];
            trial.stimulus =
                generate_formatted_html({
                    text: PRMS.fbText[dat.corrCode - 1],
                    align: "center",
                    fontsize: 30,
                    width: "1200px",
                    lineheight: 1.5,
                    bold: true,
                }) + RESPMAPPING;
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
    { trial_type: 1, free_forced: 'free', forced_task: 'na' },
    { trial_type: 2, free_forced: 'free', forced_task: 'na' },
    { trial_type: 3, free_forced: 'forced', forced_task: 'gender' },
    { trial_type: 4, free_forced: 'forced', forced_task: 'colour' },
];

// prettier-ignore
const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, VTS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE
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
    saveData("/Common/write_data.php", data_fn, { stim_type: "vtsr" });
    // saveDataLocal(data_fn, { stim_type: "vtsr" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 3000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    // setup
    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));

    exp.push(COUNT_DOTS);
    exp.push(PRELOAD);

    // instructions
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline;
        blk_timeline = { ...TRIAL_TIMELINE };
        blk_timeline.sample = {
            type: "fixed-repetitions",
            size: PRMS.nTrls / TRIAL_TABLE.length,
        };
        exp.push(blk_timeline); // trials within a block
        if (blk < PRMS.nBlks - 1) {
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
const EXP = genExpSeq();

jsPsych.run(EXP);
