// VTS Modal/Amodal Exp1
// B.Sc. Project: Pui Leng Choon WS2023/2024
//
// Participants presented with an auditory stimulus (1,2,3,4,6,7,8,9) spoken
// in either German (L1) or English (L2), in a male or female voice (between participants).
//
// Two tasks with two trial types: free choice vs. forced choice
// Task 1: odd/even
// Task 2: smaller/larger 5
// Task was cued by a visual target (e.g. colour1 = Task 1, colour2 = Task 2, white = free choice)
// Task was mapped to hand (random assignment) with responses within hand being
//  constant (e.g. "left finger" = odd/<5; "right finger" = even/>5)
//
// Block structure:
// Two blocks (120 trials with 60 forced trials in each task)
//    50% participants: German voice = high switch probability (75%)
//    50% participants: English voice = high switch probability (75%)
//  1 hybrid free-forced block of 80 trials
//  6 hybrid free-forced block of 160 trials
//    50% participants: German voice = high switch probability (75%)
//    50% participants: English voice = high switch probability (75%)
//
// Trial structure:
// Grey screen with central fixation cross for 500ms
// Auditory (en vs. de) number + central coloured square (white, red, blue) until response
// Correct responses -> blank inter-trial-interval for 500 ms
// Incorrect responses -> feedback "incorrect" + correct S-R mapping reminder for 2000 ms before ITI

const jsPsych = initJsPsych({});

const CANVAS_COLOUR = "rgba(150, 150, 150, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid black";

const AUDITORY_STIMULI = [
    "./tones/DE_F_1.mp3",
    "./tones/DE_F_2.mp3",
    "./tones/DE_F_3.mp3",
    "./tones/DE_F_4.mp3",
    "./tones/DE_F_6.mp3",
    "./tones/DE_F_7.mp3",
    "./tones/DE_F_8.mp3",
    "./tones/DE_F_9.mp3",
    "./tones/DE_M_1.mp3",
    "./tones/DE_M_2.mp3",
    "./tones/DE_M_3.mp3",
    "./tones/DE_M_4.mp3",
    "./tones/DE_M_6.mp3",
    "./tones/DE_M_7.mp3",
    "./tones/DE_M_8.mp3",
    "./tones/DE_M_9.mp3",
    "./tones/EN_F_1.mp3",
    "./tones/EN_F_2.mp3",
    "./tones/EN_F_3.mp3",
    "./tones/EN_F_4.mp3",
    "./tones/EN_F_6.mp3",
    "./tones/EN_F_7.mp3",
    "./tones/EN_F_8.mp3",
    "./tones/EN_F_9.mp3",
    "./tones/EN_M_1.mp3",
    "./tones/EN_M_2.mp3",
    "./tones/EN_M_3.mp3",
    "./tones/EN_M_4.mp3",
    "./tones/EN_M_6.mp3",
    "./tones/EN_M_7.mp3",
    "./tones/EN_M_8.mp3",
    "./tones/EN_M_9.mp3",
];

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    waitBlankDur: 500, // interval between screens (e.g. instructions)
    iti: 500, // interval between screens (e.g. instructions)
    contextDur: 1000,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS_1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment.<br><br>
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen. Bitte stelle sicher, 
dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast, um das Experiment durchzuführen. 
Wir bitten dich die nächsten ca. 45 Minuten
konzentriert zu arbeiten. Du wirst am Ende des Experimentes zu SONA zurückgeleitet und erhälst
somit automatisch deine VP-Stunde. Bei Fragen oder Probleme wende dich bitte an:<br><br>
pui-leng.choon@student.uni-tuebingen.de<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `ACHTUNG! Soundkalibierung:<br><br>
    Im Folgenden werden dir auditiv Tone präsentiert.
    Bitte stelle in dieser Zeit die Lautstärke deines Soundsystems so ein, dass du deutlich den Tönen horen kannst.<br><br>
    Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drücken!).<br><br>
    Bereit? Drücke eine beliebige Taste, um die Töne abzuspielen!`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_2_v1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
Gerade/Ungerade Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "C" und "D".<br><br>
Kleiner/Größer Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "M" und "K".<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_2_v2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
Kleiner/Größer Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die
Tasten "C" und "D".<br><br>
Gerade/Ungerade Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf
die Tasten "M" und "K".<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang hörst du eine Zahl in Deutsch oder Englisch.<br><br>
Für die Größer/Kleiner Aufgabe musst du entscheiden, ob die Zahl größer oder kleiner als 5 ist.<br><br>
Für die Gerade/Ungerade Aufgabe musst du entscheiden, ob die Zahl eine gerade oder ungerade Zahl
ist. Es gilt:<br><br>
[RESPONSE MAPPING]<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_4_v1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur EINE Aufgabe bearbeitet werden.<br>
Die Farbe eines Quadrates in der Mitte des Bildschirms zeigt dir an welche Aufgabe bearbeitet werden muss:<br><br>
<span style="color:blue">Blaues</span> Quadrat → Gerade/Ungerade Aufgabe<br>
<span style="color:red">Rotes</span> Quadrat → Kleiner/Größer Aufgabe<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_4_v2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.<br>
Die Farbe eines Quadrates in der Mitte des Bildschirms zeigt dir an welche Aufgabe bearbeitet werden muss:<br><br>
<span style="color:red">Rotes</span> Quadrat → Gerade/Ungerade Aufgabe<br>
<span style="color:blue">Blaues</span> Quadrat → Kleiner/Größer Aufgabe<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_5_v1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In manchen Durchgängen ist das Quadrat in der Mitte des Bildschirms <span style="color:white">weiß</span>. In dem Fall kannst du
frei entscheiden welche Aufgabe (Größer/Kleiner oder Gerade/Ungerade) du bearbeiten willst.
Verwende hierfür einfach die jeweilige Taste:<br><br>
[RESPONSE MAPPING]<br><br>
Wenn ein rotes oder blaues Quadrat erscheint gilt weiterhin:<br>
<span style="color:blue">Blaues</span> Quadrat → Gerade/Ungerade Aufgabe<br>
<span style="color:red">Rotes</span> Quadrat → Kleiner/Größer Aufgabe<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_5_v2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In manchen Durchgängen ist das Quadrat in der Mitte des Bildschirms <span style="color:white">weiß</span>. In dem Fall kannst du
frei entscheiden welche Aufgabe (Größer/Kleiner oder Gerade/Ungerade) du bearbeiten willst.
Verwende hierfür einfach die jeweilige Taste:<br><br>
[RESPONSE MAPPING]<br><br>
Wenn ein rotes oder blaues Quadrat erscheint gilt weiterhin:<br>
<span style="color:red">Rotes</span> Quadrat → Gerade/Ungerade Aufgabe<br>
<span style="color:blue">Blaues</span> Quadrat → Kleiner/Größer Aufgabe<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        color: "Black",
        fontsize: 28,
        bold: true,
        lineheight: 1.5,
    }),
};

const PRELOAD = {
    type: jsPsychPreload,
    audio: AUDITORY_STIMULI,
};

function create_trial_table_auditory_calibrartion() {
    auditory_files = [];
    for (let i = 0; i < AUDITORY_STIMULI.length; i++) {
        auditory_files.push({ audio: AUDITORY_STIMULI[i] });
    }
    return auditory_files;
}

const TRIALS_CALIBRATION = create_trial_table_auditory_calibrartion();

function draw_note() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.textBaseline = "middle";
    ctx.font = "100px monospace";
    ctx.strokeText("\u{1F3A7}", -50, 0); // unicode symbol for headphones + sound
}

const AUDIO_CALIBRATION = {
    type: jsPsychStaticCanvasSoundKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    sound: jsPsych.timelineVariable("audio"),
    trial_duration: PRMS.contextDur,
    func: draw_note, // some visual feedback
};

const WAIT_BLANK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
};

const TRIAL_TIMELINE_CALIBRATION = {
    timeline: [AUDIO_CALIBRATION, WAIT_BLANK],
    timeline_variables: TRIALS_CALIBRATION,
    sample: {
        type: "fixed-repetitions",
        size: 1,
    },
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    // exp.push(browser_check(PRMS.screenRes));
    exp.push(PRELOAD);
    // exp.push(resize_browser());
    // exp.push(welcome_message());
    // exp.push(vpInfoForm("/Common7+/vpInfoForm_de.html"));
    // exp.push(mouseCursor(false));

    // exp.push(TASK_INSTRUCTIONS_1);

    // audio calibration
    exp.push(TASK_INSTRUCTIONS_CALIBRATION);
    exp.push(TRIAL_TIMELINE_CALIBRATION);

    // exp.push(TASK_INSTRUCTIONS_2_v1);
    // exp.push(TASK_INSTRUCTIONS_2_v2);
    // exp.push(TASK_INSTRUCTIONS_3);
    // exp.push(TASK_INSTRUCTIONS_4_v1);
    // exp.push(TASK_INSTRUCTIONS_4_v2);
    // exp.push(TASK_INSTRUCTIONS_5_v1);
    // exp.push(TASK_INSTRUCTIONS_5_v2);

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
