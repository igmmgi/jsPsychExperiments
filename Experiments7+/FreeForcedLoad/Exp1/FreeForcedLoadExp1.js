// Free-Forced Load
// Participants perform two tasks: Colour task (more blue/red) vs. letter task (more X's O's)
// Overall three "task-type":
// 1) Free-Choice i.e., both tasks available
// 2) Forced-Letter i.e., only letter task available
// 3) Forced-Colour i.e., only colour task available
//
// Responses for each task made with index/middle fingers of left/right
// hands (Q, W, O, P keys) with task-to-hand mapping randomly selected per participant
//
// Free-Choice and Forced-Choice trials were presented in different blocks (20 blocks of 40 trials)
// Alternating: Free-Forced-Free-Forced and so on (always starting with free)
//
// Trial sequence (Free-Block):
// Fixation cross for 500 ms
// SOA determined by repeat (+X ms) vs switch (-X ms) free choice trials
// Blocks 1 and 2- Trial feedback for 2000 ms (correct vs. incorrect)
// Blank inter-trial-interval for 500 ms
//
// In Forced-Blocks, the trial sequence the same temporal sequence from the previous block was used.
//
// Load Manipulation:
// Participants are required to count high versus low tones (counting condition) and blocks
// in which tones are presented but completely irrelevant (passive listening condition).

const jsPsych = initJsPsych({});

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
    n_blocks: 30, // 14,
    n_blocks_practice: 2, // 14,
    n_trials: 4, // 48, // multiple of 4
    fixation_size: 15, // length of the fixation cross
    fixation_width: 5, // line thickness of fixation cross
    fixation_duration: 400, // duration of the fixation cross
    feedback_duration_practice: [0, 2000, 2000], // duration of the feedback practice
    feedback_duration_experiment: [0, 1500, 1500], // duration of the feedback experiment
    feedback_text: ["Richtig!", "Falsch!", "Falsch!"], // feedback text
    iti: 0,
    grid_size: [1, 6], // rows, cols (1 row but with two tasks)
    grid_gaps: [0, 26], // rows, cols
    task_side: shuffle(["Colour", "Letter"]),
    relevant_tone: ["high", "low"], // which tone should the participant count (1st position)
    task_position: shuffle(["Colour", "Letter"]),
    colour_task_colours: shuffle(["blue", "red"]),
    colour_task_nogo: ["grey"], // now actually equal blue/red
    colour_task_ratio: [15, 85], // should sum to 100! will give 2/4
    colour_task_offset: null,
    colour_task_dot_size: 12,
    colour_task_dot_size_nogo: 12,
    letter_task_letters: shuffle(["X", "O"]),
    letter_task_nogo: ["#"], // now actually equal X/O
    letter_task_ratio: [15, 85], // should sum to 100! will give 2/4
    letter_task_font: "bold 34px Monospace",
    letter_task_font_nogo: "bold 34px Monospace",
    letter_task_colour: "Black",
    letter_task_offset: null,
    soa_step: 100,
    response_keys_lh: ["A", "S"],
    response_keys_rh: ["J", "K"],
    response_keys: ["A", "S", "J", "K"],
    response_keys_colour: null,
    response_keys_letter: null,
    key_mapping: {},
    count_block: 1,
    count_trial: 1,
    slider_prompt: null,
    slider_width: 500,
};

PRMS.slider_prompt = `How many ${PRMS.relevant_tone[0]} tones did you count?`;

const COLOUR_VALUES = { blue: "rgb(0, 0, 130)", red: "rgb(130, 0, 0)", grey: "rgb(120, 120, 120)" };

if (PRMS.task_side[0] === "Colour") {
    PRMS.response_keys_colour = PRMS.response_keys_lh;
    PRMS.response_keys_letter = PRMS.response_keys_rh;
    PRMS.response_stimuli = PRMS.colour_task_colours.concat(PRMS.letter_task_letters);
    PRMS.key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_lh[0];
    PRMS.key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_lh[1];
    PRMS.key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_rh[0];
    PRMS.key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_rh[1];
} else if (PRMS.task_side[0] === "Letter") {
    PRMS.response_keys_letter = PRMS.response_keys_lh;
    PRMS.response_keys_colour = PRMS.response_keys_rh;
    PRMS.response_stimuli = PRMS.letter_task_letters.concat(PRMS.colour_task_colours);
    PRMS.key_mapping[PRMS.letter_task_letters[0]] = PRMS.response_keys_lh[0];
    PRMS.key_mapping[PRMS.letter_task_letters[1]] = PRMS.response_keys_lh[1];
    PRMS.key_mapping[PRMS.colour_task_colours[0]] = PRMS.response_keys_rh[0];
    PRMS.key_mapping[PRMS.colour_task_colours[1]] = PRMS.response_keys_rh[1];
}
PRMS.response_keys = PRMS.response_keys_lh.concat(PRMS.response_keys_rh);

if (PRMS.task_position[0] === "Colour") {
    PRMS.colour_task_offset = -15;
    PRMS.letter_task_offset = 2;
} else if (PRMS.task_position[1] === "Colour") {
    PRMS.colour_task_offset = 15;
    PRMS.letter_task_offset = -28;
}

jsPsych.data.addProperties({ task_left_hand: PRMS.task_side[0], task_top_position: PRMS.task_position[0] });

// 2 counter balanced versions?
// Version 1: 1st half listening/2nd counting
// Version 2: 1st half counting/2nd half listening
// const VERSION = 1;
const VERSION = 1; // Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: VERSION });

const EN_DE = {
    blue: "Blau",
    red: "Rot",
    grey: "Grau",
    X: "X",
    O: "O",
    Letter: "Buchstabenaufgabe",
    Colour: "Farbaufgabe",
};

const PERFORMANCE = {
    n_repetitions: 0,
    n_switches: 0,
    soa: 0,
    previous_task: null,
    block_tones: [],
    n_target: 0,
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
Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast.
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        colour: "black",
        fontsize: 30,
    }),
};

function pad_me(str, npad) {
    let len = Math.floor((npad - str.length) / 2);
    str = " ".repeat(len) + str + " ".repeat(len);
    return str
        .split("")
        .map(function (c) {
            return c === " " ? "&nbsp;" : c;
        })
        .join("");
}

const TASK_INSTRUCTIONS_TEXT = generate_formatted_html({
    text: `In diesem Experiment gibt es <span style="font-weight: bold;">zwei</span> Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.<br><br>
<span style="font-weight: bold;">${EN_DE[PRMS.task_side[0]]}</span> = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten <span style="font-weight: bold;">"${PRMS.response_keys_lh[0]}"</span> und <span style="font-weight:bold;">"${PRMS.response_keys_lh[1]}"</span>.<br><br>
<span style="font-weight: bold;">${EN_DE[PRMS.task_side[1]]}</span> = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger auf die Tasten <span style="font-weight: bold;">"${PRMS.response_keys_rh[0]}"</span> und <span style="font-weight:bold;">"${PRMS.response_keys_rh[1]}"</span>.<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
    align: "left",
    fontsize: 30,
    width: "1200px",
    lineheight: 1.5,
});

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: TASK_INSTRUCTIONS_TEXT,
};

const RESPONSE_MAPPING = generate_formatted_html({
    text: `${EN_DE[PRMS.task_side[0]]} = Linke Hand ${"&emsp;".repeat(6)} ${EN_DE[PRMS.task_side[1]]} = Rechte Hand<br>
${EN_DE[PRMS.response_stimuli[0]]} ${pad_me("vs.", 28)} ${EN_DE[PRMS.response_stimuli[1]]}${"&emsp;".repeat(12)}${EN_DE[PRMS.response_stimuli[2]]} ${pad_me("vs.", 25)} ${EN_DE[PRMS.response_stimuli[3]]}<br>
(${PRMS.response_keys[0]}-Taste) ${"&emsp;".repeat(3)}(${PRMS.response_keys[1]}-Taste)${"&emsp;".repeat(11)}(${PRMS.response_keys[2]}-Taste)${"&emsp;".repeat(3)}(${PRMS.response_keys[3]}-Taste)`,
    align: "center",
    fontsize: 30,
    width: "1200px",
    bold: true,
    lineheight: 1.5,
});

const RESPONSE_MAPPING_VAS = generate_formatted_html({
    text: `${EN_DE[PRMS.task_side[0]]} = Linke Hand ${"&emsp;".repeat(6)} ${EN_DE[PRMS.task_side[1]]} = Rechte Hand<br>
${EN_DE[PRMS.response_stimuli[0]]} ${pad_me("vs.", 28)} ${EN_DE[PRMS.response_stimuli[1]]}${"&emsp;".repeat(12)}${EN_DE[PRMS.response_stimuli[2]]} ${pad_me("vs.", 25)} ${EN_DE[PRMS.response_stimuli[3]]}<br>
(${PRMS.response_keys[0]}-Taste) ${"&emsp;".repeat(3)}(${PRMS.response_keys[1]}-Taste)${"&emsp;".repeat(11)}(${PRMS.response_keys[2]}-Taste)${"&emsp;".repeat(3)}(${PRMS.response_keys[3]}-Taste)`,
    align: "center",
    fontsize: 18,
    width: "1200px",
    bold: true,
    lineheight: 1.25,
});

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus:
        generate_formatted_html({
            text: `Für die Buchstabenaufgabe musst Du entscheiden, ob die Mehrheit der Buchstabe "${PRMS.letter_task_letters[0]}" oder "${PRMS.letter_task_letters[1]}" ist.<br><br>
Für die Farbaufgabe musst Du entscheiden, ob die Mehrheit der Punkte ${EN_DE[PRMS.colour_task_colours[0]]} oder ${EN_DE[PRMS.colour_task_colours[1]]} ist. Es gilt: `,
            align: "left",
            fontsize: 26,
            width: "1200px",
            lineheight: 1.25,
        }) +
        RESPONSE_MAPPING +
        generate_formatted_html({
            text: `Diese Zuordnung wird dir vor jedem Experimentalblock sowie nach Fehlern nochmals zur Erinnerung angezeigt.<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
            align: "left",
            fontsize: 26,
            width: "1200px",
            lineheight: 1.25,
        }),
};

const TASK_INSTRUCTIONS3 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***WICHTIG***: In manchen Blöcken darfst du in jedem Durchgang frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest, da beide Aufgaben (Buchstabe und Farbe) eine Antwort erfordern.<br><br>
In den anderen Blöcken musst du in jedem Durchgang die vorgegebene Aufgabe bearbeiten, da nur eine der beiden Aufgaben (Buchstabe und Farbe) eine Antwort erfordert:<br><br>
Wenn die Anzahl der Buchstaben (X und O) gleich ist, dann musst du die Farbaufgabe bearbeiten.<br><br>
Wenn die Anzahl der farbigen Kreise (blau und rot) gleich ist, dann musst du die Buchstabenaufgabe bearbeiten.<br><br>
Drücke eine beliebige Taste, um fortzufahren.`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.25,
    }),
};

const TASK_INSTRUCTIONS_PRE_SOUND_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***ÜBUNG BEENDET***<br><br>
        Es folgen neue Instruktionen.<br>
        Du wirst nun während der Bearbeitung der visuellen Aufgaben hohe oder tiefe Töne hören.<br><br>
        Vor jedem Block wird dir gesagt ob du Töne zählen musst oder diese ignorieren kannst.<br><br>
        Wir führen nun einen Soundcheck.<br><br>
        Drücke eine beliebige Taste!<br>`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.25,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS_SOUND_CALIBRATION = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***ACHTUNG-Soundkalibierung***<br><br>
        Im Folgenden werden dir eine Reihe von HOHEN und TIEFEN Tönen präsentiert.<br>
        Bitte stelle die Lautstärke deines Soundsystems so ein, dass du
        deutlich zwischen den zwei Tönen differenzieren kannst.<br><br>
        Anmerkung: Es geht immer automatisch weiter (d.h. du musst keine Taste drucken)!<br><br>
        Bereit?<br><br>
        Drücke eine beliebige Taste, um die Töne abzuspielen!<br>`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.25,
    }),
    post_trial_gap: 1000,
};

const AUDIO_CALIBRATION_LOW = {
    type: jsPsychAudioButtonResponse,
    stimulus: "tones/low.wav",
    choices: [],
    trial_duration: 500,
    response_ends_trial: false,
    prompt: "<H1>Tiefer Ton</H1>",
    post_trial_gap: 750,
};

const AUDIO_CALIBRATION_HIGH = {
    type: jsPsychAudioButtonResponse,
    stimulus: "tones/high.wav",
    choices: [],
    trial_duration: 500,
    response_ends_trial: false,
    prompt: "<H1>Hoher Ton</H1>",
    post_trial_gap: 750,
};

const AUDIO_CALIBRATION = shuffle(new Array(10).fill([AUDIO_CALIBRATION_LOW, AUDIO_CALIBRATION_HIGH]).flat());

let trial_info_yoked = [];

function set_block_tones() {
    if (PRMS.count_block <= PRMS.n_blocks_practice) {
        PERFORMANCE.block_tones = repeatArray("na", PRMS.n_trials);
    } else {
        let min_target = Math.min(5, Math.floor(PRMS.n_trials * 0.2));
        let max_target = Math.max(min_target, Math.floor(PRMS.n_trials * 0.8));
        let n_target = getRandomInt(min_target, max_target);
        PERFORMANCE.block_tones = shuffle(
            repeatArray(PRMS.relevant_tone[0], n_target).concat(
                repeatArray(PRMS.relevant_tone[1], PRMS.n_trials - n_target),
            ),
        );
    }
    PERFORMANCE.n_target = 0; // reset each block
}

const BLOCK_START_FREE = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
FREIE WAHL: In diesem Block darfst du entscheiden, welche der beiden visuellen Aufgaben du bearbeiten willst (in jedem Durchgang muss nur eine der beiden Aufgaben bearbeitet werden): <br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
    },
};

const BLOCK_START_FREE_LISTENING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
FREIE WAHL: In diesem Block darfst du entscheiden, welche der beiden visuellen Aufgaben du bearbeiten willst (in jedem Durchgang muss nur eine der beiden Aufgaben bearbeitet werden): <br><br>
***WICHTIG*** IGNORIERE TÖNE: Zusätzlich wirst du Töne hören, die du jedoch ignorieren kannst (die Lautsprecher/Kopfhörer müssen jedoch eingeschaltet bleiben, damit die Töne hörbar sind).<br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
    },
};

const BLOCK_START_FREE_COUNTING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
FREIE WAHL: In diesem Block darfst du entscheiden, welche der beiden visuellen Aufgaben du bearbeiten willst (in jedem Durchgang muss nur eine der beiden Aufgaben bearbeitet werden): <br><br>
***WICHTIG*** ZÄHLE ${PRMS.relevant_tone[0]} TÖNE: Zusätzlich wirst du Töne hören. Zähle die Anzahl ${PRMS.relevant_tone[0]} Töne.<br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
    },
};

const BLOCK_START_FORCED = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
KEINE WAHLMÖGLICHKEIT: In diesem Block musst du die vorgegebene visuelle Aufgabe bearbeiten (d.h., die visuelle Aufgabe welche in diesem
Durchgang eine Antwort erfordert) <br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
        generate_yoked_block_timeline();
    },
};

const BLOCK_START_FORCED_LISTENING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
KEINE WAHLMÖGLICHKEIT: In diesem Block musst du die vorgegebene visuelle Aufgabe bearbeiten (d.h., die visuelle Aufgabe welche in diesem
Durchgang eine Antwort erfordert) <br><br>
***WICHTIG*** IGNORIERE TÖNE: Zusätzlich wirst du Töne hören, die du jedoch ignorieren kannst (die Lautsprecher/Kopfhörer müssen jedoch eingeschaltet bleiben, damit die Töne hörbar sind).<br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
        generate_yoked_block_timeline();
    },
};

const BLOCK_START_FORCED_COUNTING = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        set_block_tones();
        trial.stimulus =
            generate_formatted_html({
                text: `Start Block ${PRMS.count_block} von ${PRMS.n_blocks}<br><br>
KEINE WAHLMÖGLICHKEIT: In diesem Block musst du die vorgegebene Aufgabe bearbeiten (d.h., die Aufgabe welche in diesem
Durchgang eine Antwort erfordert) <br><br>
***WICHTIG*** ZÄHLE ${PRMS.relevant_tone[0]} TÖNE: Zusätzlich wirst du Töne hören. Zähle die Anzahl ${PRMS.relevant_tone[0]} Töne.<br><br>
Versuche so schnell wie möglich zu sein ohne zuviele Fehler zu machen!<br>`,
                align: "left",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            }) +
            RESPONSE_MAPPING +
            generate_formatted_html({
                text: `Um den Block zu starten, drücke eine beliebige Taste.`,
                align: "center",
                fontsize: 30,
                width: "1200px",
                lineheight: 1.25,
            });
        generate_yoked_block_timeline();
    },
};

const HALF_BREAK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***ACHTUNG: NEUE INSTRUKTIONEN***<br><br>
        Bitte beachte die neuen Instruktionen bezüglich den Tönen.<br><br>
        Drücke eine beliebige Taste!<br>`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.25,
    }),
    post_trial_gap: 1000,
};

const BLOCK_END = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.count_block} von ${PRMS.n_blocks}: Kurze Pause<br><br>
             Wenn Du bereit für den nächsten Block bist, dann drücke eine beliebige Taste.`,
            align: "left",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
        });
    },
    on_finish: function () {
        PRMS.count_block += 1;
        PRMS.count_trial = 1;
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: " ",
    response_ends_trial: false,
    trial_duration: null,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        // only direct trial feedback in practice blocks
        if (PRMS.count_block <= PRMS.n_blocks_practice) {
            trial.trial_duration = PRMS.feedback_duration_practice[dat.error];
        } else {
            trial.trial_duration = PRMS.feedback_duration_experiment[dat.error];
        }
        trial.stimulus = generate_formatted_html({
            text: `${PRMS.feedback_text[dat.error]}`,
            align: "center",
            fontsize: 30,
            width: "1200px",
            lineheight: 1.5,
            color: dat.error !== 0 ? "black" : "rgba(200, 200, 200, 1)",
        });
        if (dat.error !== 0) {
            trial.stimulus += RESPONSE_MAPPING;
        }
    },
};

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: " ",
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf SONA.
             Drücke eine beliebige Taste, um die Weiterleitung zu SONA zu starten.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function draw_fixation_cross() {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = PRMS.fixation_width;
    ctx.moveTo(-PRMS.fixation_size, 0);
    ctx.lineTo(PRMS.fixation_size, 0);
    ctx.moveTo(0, -PRMS.fixation_size);
    ctx.lineTo(0, PRMS.fixation_size);
    ctx.stroke();
}

const FIXATION_CROSS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: false,
    trial_duration: PRMS.fixation_duration,
    func: draw_fixation_cross,
};

function draw_stimulus(args) {
    "use strict";
    let ctx = document.getElementById("canvas").getContext("2d");

    let idx = 0;
    let centerX;
    let centerY = ((PRMS.grid_size[0] - 1) / 2) * PRMS.grid_gaps[0];
    let dot_size = args.free_forced === "forced_letter" ? PRMS.colour_task_dot_size_nogo : PRMS.colour_task_dot_size;

    // some canvas text properties
    ctx.font = args.free_forced === "forced_colour" ? PRMS.letter_task_font_nogo : PRMS.letter_task_font;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // play tone
    if (args.tone !== "na") {
        const audio = new Audio(`tones/${args.tone}.wav`);
        audio.play().catch((error) => {
            console.error("Error playing tone:", error);
        });
    }

    for (let rows = 0; rows < PRMS.grid_size[0]; rows += 1) {
        centerX = -(((PRMS.grid_size[1] - 1) / 2) * PRMS.grid_gaps[1]);
        for (let cols = 0; cols < PRMS.grid_size[1]; cols += 1) {
            // draw dots
            if (args.draw_dots) {
                ctx.beginPath();
                ctx.arc(centerX, centerY + PRMS.colour_task_offset, dot_size, 0, 2 * Math.PI, false);
                ctx.fillStyle = COLOUR_VALUES[args.dots[idx]];
                ctx.fill();
            }

            // draw letters
            if (args.draw_letters) {
                ctx.fillStyle = PRMS.letter_task_colour;
                ctx.fillText(args.letters[idx], centerX, centerY + PRMS.letter_task_offset);
            }

            idx += 1;
            centerX += PRMS.grid_gaps[1];
        }
        centerY -= PRMS.grid_gaps[0];
    }

    // // fixation cross for piloting positions
    // ctx.beginPath();
    // ctx.moveTo(-200, 0);
    // ctx.lineTo(200, 0);
    // ctx.stroke();
    // ctx.moveTo(0, -200);
    // ctx.lineTo(0, 200);
    // ctx.stroke();
}

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    // was it a target tone played?
    if (dat.trial_tone === PRMS.relevant_tone[0]) {
        PERFORMANCE.n_target += 1;
    }

    // which task did they perform?
    let responded_letter = PRMS.response_keys_letter.includes(dat.key_press.toUpperCase());
    let responded_colour = PRMS.response_keys_colour.includes(dat.key_press.toUpperCase());
    let response_task = responded_letter && !responded_colour ? "Letter" : "Colour";

    // adjust rt according to responded stimulus
    if (response_task === dat.s2) {
        dat.rt = dat.rt - PERFORMANCE.soa;
    }

    let error = 0;
    if (responded_letter && dat.key_press.toUpperCase() !== dat.letter_task_key) {
        error = 1;
    } else if (responded_colour && dat.key_press.toUpperCase() !== dat.colour_task_key) {
        error = 1;
    }

    if (dat.rt < 0) {
        error = 2; // too fast
    }

    let repetition_switch = "na";
    if (PERFORMANCE.previous_task !== null) {
        repetition_switch = response_task === PERFORMANCE.previous_task ? "repetition" : "switch";
    }

    // get current trial soa
    let soa = PERFORMANCE.soa;

    // if first trial first block, set SOA delay to 400 ms
    if (PRMS.count_block === 1 && PRMS.count_trial === 1) {
        PERFORMANCE.soa = 400;
    }

    // adjust soa for next trial
    if (repetition_switch === "repetition") {
        PERFORMANCE.n_repetitions += 1;
        PERFORMANCE.soa += dat.free_forced === "free" ? PRMS.soa_step : 0;
    } else if (repetition_switch === "switch") {
        PERFORMANCE.n_switches += 1;
        PERFORMANCE.soa -= dat.free_forced === "free" ? PRMS.soa_step : 0;
    }
    PERFORMANCE.previous_task = response_task;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        response_task: response_task,
        repetition_switch: repetition_switch,
        n_repetitions: PERFORMANCE.n_repetitions,
        n_switches: PERFORMANCE.n_switches,
        n_target: PERFORMANCE.n_target,
        soa: soa,
        error: error,
        block: PRMS.count_block,
        trial: PRMS.count_trial,
    });
}

const STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.response_keys,
    trial_duration: null,
    func: [draw_stimulus, draw_stimulus],
    func_args: null,
    stimulus_onset: null,
    clear_screen: [1, 1],
    data: {
        stim_type: "vts",
        free_forced: jsPsych.timelineVariable("free_forced"),
        load: jsPsych.timelineVariable("load"),
        colour_task_colour: jsPsych.timelineVariable("colour_task_colour"),
        colour_task_key: jsPsych.timelineVariable("colour_task_key"),
        letter_task_letter: jsPsych.timelineVariable("letter_task_letter"),
        letter_task_key: jsPsych.timelineVariable("letter_task_key"),
    },
    on_start: function (trial) {
        "use strict";

        // Need to reset trial table based on data from previous block
        // This seems very hacky! Must be better way!
        if (trial.data.free_forced !== "free") {
            let yoked_trial = trial_table_forced_yoked[PRMS.count_trial - 1];
            trial.data.free_forced = yoked_trial.free_forced;
            trial.data.load = yoked_trial.load;
            trial.data.colour_task_colour = yoked_trial.colour_task_colour;
            trial.data.colour_task_key = yoked_trial.colour_task_key;
            trial.data.letter_task_letter = yoked_trial.letter_task_letter;
            trial.data.letter_task_key = yoked_trial.letter_task_key;
            PERFORMANCE.soa = yoked_trial.soa;
        }

        let n_stimuli = PRMS.grid_size[0] * PRMS.grid_size[1];

        // colour task
        // let colours = repeatArray(PRMS.colour_task_nogo, Math.round(n_stimuli));
        // This is the nogo colour with 50/50
        let colours = shuffle(
            repeatArray(PRMS.colour_task_colours[0], Math.round(n_stimuli / 2)).concat(
                repeatArray(PRMS.colour_task_colours[1], Math.round(n_stimuli / 2)),
            ),
        );
        // These are the go
        if (trial.data.colour_task_colour === PRMS.colour_task_colours[0]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[0],
                    Math.round(n_stimuli * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.colour_task_colours[1], Math.round((n_stimuli * PRMS.colour_task_ratio[0]) / 100)),
                ),
            );
        } else if (trial.data.colour_task_colour === PRMS.colour_task_colours[1]) {
            colours = shuffle(
                repeatArray(
                    PRMS.colour_task_colours[1],
                    Math.round(n_stimuli * (PRMS.colour_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.colour_task_colours[0], Math.round((n_stimuli * PRMS.colour_task_ratio[0]) / 100)),
                ),
            );
        }

        // letter task
        // let letters = repeatArray(PRMS.letter_task_nogo, Math.round(n_stimuli));
        let letters = shuffle(
            repeatArray(PRMS.letter_task_letters[0], Math.round(n_stimuli / 2)).concat(
                repeatArray(PRMS.letter_task_letters[1], Math.round(n_stimuli / 2)),
            ),
        );
        if (trial.data.letter_task_letter === PRMS.letter_task_letters[0]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[0],
                    Math.round(n_stimuli * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.letter_task_letters[1], Math.round((n_stimuli * PRMS.letter_task_ratio[0]) / 100)),
                ),
            );
        } else if (trial.data.letter_task_letter === PRMS.letter_task_letters[1]) {
            letters = shuffle(
                repeatArray(
                    PRMS.letter_task_letters[1],
                    Math.round(n_stimuli * (PRMS.letter_task_ratio[1] / 100)),
                ).concat(
                    repeatArray(PRMS.letter_task_letters[0], Math.round((n_stimuli * PRMS.letter_task_ratio[0]) / 100)),
                ),
            );
        }

        // task order
        trial.stimulus_onset = [0, Math.abs(PERFORMANCE.soa)];

        // play tone to play
        let trial_tone = PERFORMANCE.block_tones.length > 0 ? PERFORMANCE.block_tones.shift() : "na";
        trial.data.trial_tone = trial_tone;

        if (PERFORMANCE.soa > 0 && PERFORMANCE.previous_task === "Letter") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: false,
                    letters: letters,
                    tone: trial_tone,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: "na",
                },
            ];
            trial.data.s1 = "Colour";
            trial.data.s2 = "Letter";
        } else if (PERFORMANCE.soa > 0 && PERFORMANCE.previous_task === "Colour") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: false,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: trial_tone,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: "na",
                },
            ];
            trial.data.s1 = "Letter";
            trial.data.s2 = "Colour";
        } else if (PERFORMANCE.soa < 0 && PERFORMANCE.previous_task === "Colour") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: false,
                    letters: letters,
                    tone: trial_tone,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: "na",
                },
            ];
            trial.data.s1 = "Colour";
            trial.data.s2 = "Letter";
        } else if (PERFORMANCE.soa < 0 && PERFORMANCE.previous_task === "Letter") {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: false,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: trial_tone,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: "na",
                },
            ];
            trial.data.s1 = "Letter";
            trial.data.s2 = "Colour";
        } else if (PERFORMANCE.soa === 0) {
            trial.func_args = [
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: trial_tone,
                },
                {
                    free_forced: trial.data.free_forced,
                    draw_dots: true,
                    dots: colours,
                    draw_letters: true,
                    letters: letters,
                    tone: "na",
                },
            ];
            trial.data.s1 = "Simultaneous";
            trial.data.s2 = "Simultaneous";
        }
    },
    on_finish: function () {
        code_trial();
        PRMS.count_trial += 1;
    },
};

function code_trial_vas() {
    "use strict";
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        block: PRMS.count_block - 1,
        trial: PRMS.count_trial, // the rating is for the previous letter/colour task
    });
}

const SLIDER_RESPONSE = {
    type: jsPsychCanvasSliderResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    stimulus: function () {},
    min: 0,
    max: PRMS.n_trials,
    slider_start: PRMS.n_trials / 2,
    slider_width: PRMS.slider_width,
    require_movement: true,
    prompt: PRMS.slider_prompt,
    min_label: 0,
    max_label: PRMS.n_trials,
    data: {
        stim_type: "vts",
    },
    button_label: null,
    on_start: function (trial) {
        trial.button_label = `<span style="font-size: 20px;font-weight:bold;">Drücke anschließend die Leertaste um fortzufahren!<br><br></span>`;
    },
    on_finish: function () {
        code_trial_vas();
    },
};

// prettier-ignore
const TRIAL_TABLE_FREE= [
    { free_forced: "free", load: "na", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "na", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "na", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "free", load: "na", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
];

// prettier-ignore
const TRIAL_TABLE_FREE_LISTENING = [
    { free_forced: "free", load: "listening", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "listening", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "listening", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "free", load: "listening", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
];

// prettier-ignore
const TRIAL_TABLE_FREE_COUNTING = [
    { free_forced: "free", load: "counting", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "counting", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "free", load: "counting", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "free", load: "counting", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
];

// Over-written on trial-by-trial basis based on previous block equivalent trial (Thus, essentially, just a place-holder)
// prettier-ignore
const TRIAL_TABLE_FORCED = [
    { free_forced: "forced_letter", load: "na", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "forced_letter", load: "na", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "forced_colour", load: "na", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: "na" },
    { free_forced: "forced_colour", load: "na", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: "na" },
];

// prettier-ignore
const TRIAL_TABLE_FORCED_LISTENING = [
    { free_forced: "forced_letter", load: "listening", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "forced_letter", load: "listening", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "forced_colour", load: "listening", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: "na" },
    { free_forced: "forced_colour", load: "listening", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: "na" },
];

// prettier-ignore
const TRIAL_TABLE_FORCED_COUNTING = [
    { free_forced: "forced_letter", load: "counting", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[0], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[0]] },
    { free_forced: "forced_letter", load: "counting", colour_task_colour: PRMS.colour_task_nogo[0],    letter_task_letter: PRMS.letter_task_letters[1], colour_task_key: "na",                                          letter_task_key: PRMS.key_mapping[PRMS.letter_task_letters[1]] },
    { free_forced: "forced_colour", load: "counting", colour_task_colour: PRMS.colour_task_colours[0], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[0]], letter_task_key: "na" },
    { free_forced: "forced_colour", load: "counting", colour_task_colour: PRMS.colour_task_colours[1], letter_task_letter: PRMS.letter_task_nogo[0],    colour_task_key: PRMS.key_mapping[PRMS.colour_task_colours[1]], letter_task_key: "na" },
];

// prettier-ignore
const TRIAL_TIMELINE_FREE = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FREE
};

let TRIAL_TIMELINE_FORCED = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FORCED,
};

const TRIAL_TIMELINE_FREE_LISTENING = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FREE_LISTENING,
};

let TRIAL_TIMELINE_FORCED_LISTENING = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FORCED_LISTENING,
};

const TRIAL_TIMELINE_FREE_COUNTING = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FREE_COUNTING,
};

let TRIAL_TIMELINE_FORCED_COUNTING = {
    timeline: [FIXATION_CROSS, STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_FORCED_COUNTING,
};

let trial_table_forced_yoked = [];

function generate_yoked_block_timeline() {
    let dat = jsPsych.data.get().filter({ stim_type: "vts", block: PRMS.count_block - 1 });
    trial_table_forced_yoked = [];
    for (let trial = 0; trial < dat.trials.length; trial++) {
        if (dat.trials[trial].response_task === "Letter") {
            trial_table_forced_yoked.push({
                free_forced: "forced_letter",
                load: dat.trials[trial].load,
                colour_task_colour: PRMS.colour_task_nogo[0],
                letter_task_letter: dat.trials[trial].letter_task_letter,
                colour_task_key: "na",
                letter_task_key: dat.trials[trial].letter_task_key,
                soa: dat.trials[trial].soa,
            });
        } else if (dat.trials[trial].response_task === "Colour") {
            trial_table_forced_yoked.push({
                free_forced: "forced_colour",
                load: dat.trials[trial].load,
                colour_task_colour: dat.trials[trial].colour_task_colour,
                letter_task_letter: PRMS.letter_task_nogo[0],
                colour_task_key: dat.trials[trial].colour_task_key,
                letter_task_key: "na",
                soa: dat.trials[trial].soa,
            });
        }
    }
}

////////////////////////////////////////////////////////////////////////
//                           Questionnaires                           //
////////////////////////////////////////////////////////////////////////
const QUESTIONNAIRE_SCALE = ["gar nicht", "", "", "", "", "", "", "", "", "sehr viel"];

function style_questionnaire() {
    // Wait for plugin to inject its CSS, then modify it
    setTimeout(() => {
        const pluginStyle = document.getElementById("jspsych-survey-likert-css");
        if (pluginStyle) {
            pluginStyle.textContent += `
                .jspsych-survey-likert-preamble {
                    font-size: 1.5em !important;
                    font-weight: bold !important;
                }
                .jspsych-survey-likert-statement {
                    font-size: 1.5em !important;
                }
                .jspsych-survey-likert-opts li:first-child .jspsych-survey-likert-opt-label,
                .jspsych-survey-likert-opts li:last-child .jspsych-survey-likert-opt-label {
                    font-size: 0.5em !important;
                }
            `;
        }
    }, 0);
}

function finish_questionnaire() {
    let dat = jsPsych.data.get().last(1).values()[0];
    for (const [key, val] of Object.entries(dat.response)) {
        jsPsych.data.addProperties({ [key]: val + 1 });
    }
}

// prettier-ignore
const QUESTIONS1 = [
  { prompt: 'Wie sehr waren Sie motiviert, die jeweilige Aufgaben auszuführen?',                                     name: 'q1.1', labels: QUESTIONNAIRE_SCALE, required: true },
  { prompt: 'Wie sehr haben Sie sich angestrengt?',                                                                  name: 'q1.2', labels: QUESTIONNAIRE_SCALE, required: true },
  { prompt: 'Wenn Sie zusätzlich die Töne zählen mussten, wie sehr haben Sie sich auf das Töne zählen konzertiert verglichen mit der visuellen Aufgabe?', name: 'q1.3', labels: QUESTIONNAIRE_SCALE, required: true }, 
];

const QUESTIONNAIRE1 = {
    type: jsPsychSurveyLikert,
    preamble:
        "Fragen zu den Blöcken wenn Sie die freie Wahl hatten welche visuelle Aufgabe (Buchstaben oder Farbe) Sie bearbeiten wollen:",
    questions: QUESTIONS1,
    scale_width: 400,
    button_label: "Weiter",
    post_trial_gap: 1000,
    on_start: style_questionnaire,
    on_finish: finish_questionnaire,
};

// prettier-ignore
const QUESTIONS2 = [
  { prompt: 'Wie sehr waren Sie motiviert, die jeweilige Aufgaben auszuführen?',                                     name: 'q2.1', labels: QUESTIONNAIRE_SCALE, required: true },
  { prompt: 'Wie sehr haben Sie sich angestrengt?',                                                                  name: 'q2.2', labels: QUESTIONNAIRE_SCALE, required: true },
  { prompt: 'Wenn Sie zusätzlich die Töne zählen mussten, wie sehr haben Sie sich auf das Töne zählen konzertiert verglichen mit der visuellen Aufgabe?', name: 'q2.3', labels: QUESTIONNAIRE_SCALE, required: true },
];

const QUESTIONNAIRE2 = {
    type: jsPsychSurveyLikert,
    preamble:
        "Fragen zu den Blöcken wenn Sie keine Wahl hatten welche visuelle Aufgabe (Buchstaben oder Farbe) Sie bearbeiten wollen:",
    questions: QUESTIONS2,
    scale_width: 400,
    button_label: "Weiter",
    post_trial_gap: 1000,
    on_start: style_questionnaire,
    on_finish: finish_questionnaire,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();
const VP_NUM = getTime();

function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });
    saveData("/Common/write_data.php", `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${VP_NUM}`, {
        stim_type: "vts",
    });
    // saveDataLocal(`${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`, { stim_type: "vts" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 2000,
};

const PROLIFIC = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Super, du bist am Ende des Experiments!
               Vielen Dank für deine Teilnahme :)<br><br>
               Über folgenden Link geht es zurück zu Prolific:<br><br>
               https://app.prolific.com/submissions/complete?cc=CLZQML0W<br><br>
               Drücke die Leertaste, um das Experiment abzuschließen!`,
        align: "left",
        fontsize: 30,
        width: "1200px",
        lineheight: 1.5,
    }),
    on_finish: function () {
        window.location.replace("https://app.prolific.com/submissions/complete?cc=CLZQML0W");
    },
};
////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
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

    let block_type = repeatArray(["free", "forced"], PRMS.n_blocks / 2);
    let load_type;
    let n_experimental_blocks = PRMS.n_blocks - PRMS.n_blocks_practice;
    if (VERSION === 1) {
        load_type = repeatArray(["na"], PRMS.n_blocks_practice)
            .concat(repeatArray(["listening"], n_experimental_blocks / 2))
            .concat(repeatArray(["counting"], n_experimental_blocks / 2));
    } else if (VERSION === 2) {
        load_type = repeatArray(["na"], PRMS.n_blocks_practice)
            .concat(repeatArray(["counting"], n_experimental_blocks / 2))
            .concat(repeatArray(["listening"], n_experimental_blocks / 2));
    }
    console.log(load_type);

    for (let blk = 0; blk < PRMS.n_blocks; blk += 1) {
        let blk_timeline;

        if (blk == PRMS.n_blocks_practice) {
            // Audio calibration routine
            exp.push(TASK_INSTRUCTIONS_PRE_SOUND_CALIBRATION);
            exp.push(TASK_INSTRUCTIONS_SOUND_CALIBRATION);
            for (let i = 0; i < AUDIO_CALIBRATION.length; i++) {
                exp.push(AUDIO_CALIBRATION[i]);
            }
        }

        if (blk === PRMS.n_blocks / 2) {
            exp.push(HALF_BREAK);
        }

        if (block_type[blk] === "free" && load_type[blk] === "na") {
            exp.push(BLOCK_START_FREE);
            blk_timeline = { ...TRIAL_TIMELINE_FREE };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FREE.length,
            };
            exp.push(blk_timeline); // trials within a block
        } else if (block_type[blk] === "forced" && load_type[blk] === "na") {
            exp.push(BLOCK_START_FORCED);
            blk_timeline = { ...TRIAL_TIMELINE_FORCED };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FORCED.length,
            };
            exp.push(blk_timeline); // trials within a block
        } else if (block_type[blk] === "free" && load_type[blk] === "listening") {
            exp.push(BLOCK_START_FREE_LISTENING);
            blk_timeline = { ...TRIAL_TIMELINE_FREE_LISTENING };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FREE_LISTENING.length,
            };
            exp.push(blk_timeline); // trials within a block
        } else if (block_type[blk] === "free" && load_type[blk] === "counting") {
            exp.push(BLOCK_START_FREE_COUNTING);
            blk_timeline = { ...TRIAL_TIMELINE_FREE_COUNTING };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FREE_COUNTING.length,
            };
            exp.push(blk_timeline); // trials within a block
            exp.push(SLIDER_RESPONSE);
        } else if (block_type[blk] === "forced" && load_type[blk] === "listening") {
            exp.push(BLOCK_START_FORCED_LISTENING);
            blk_timeline = { ...TRIAL_TIMELINE_FORCED_LISTENING };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FORCED_LISTENING.length,
            };
            exp.push(blk_timeline); // trials within a block
        } else if (block_type[blk] === "forced" && load_type[blk] === "counting") {
            exp.push(BLOCK_START_FORCED_COUNTING);
            blk_timeline = { ...TRIAL_TIMELINE_FORCED_COUNTING };
            blk_timeline.sample = {
                type: "fixed-repetitions",
                size: PRMS.n_trials / TRIAL_TABLE_FORCED_COUNTING.length,
            };
            exp.push(blk_timeline); // trials within a block
            exp.push(SLIDER_RESPONSE);
        }

        if (blk < PRMS.n_blocks - 1) {
            exp.push(BLOCK_END);
        }
    }

    // Questionnaires after all blocks
    exp.push(QUESTIONNAIRE1);
    exp.push(QUESTIONNAIRE2);

    // debrief
    exp.push(mouseCursor(true));

    // save data
    exp.push(SAVE_DATA);

    // end
    exp.push(END_SCREEN);
    exp.push(fullscreen(false));
    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
