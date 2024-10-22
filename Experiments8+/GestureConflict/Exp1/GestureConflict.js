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
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid Black";

// Experiment Parameters
const PRMS = {
    ntrls: 64, // number of trials per block (multiple of 8)
    nblks: 12, // number of blocks
    fix_size: 10, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_duration: 500, // duration of the fixation cross
    feedback_duration: [0, 1500, 1500, 1500], // feedback duration for response type (correct, incorrect, too slow, too fast)
    too_slow: 2000, // feedback duration for correct and incorrect trials, respectively
    too_fast: 0, // feedback duration for correct and incorrect trials, respectively
    feedback_text: ["", "Falsch!", "Zu langsam!", "Zu schnell!"],
    iti: 500, // duration of the inter-trial-interval
    feedback_font: "50px Arial",
    resp_keys: ["S", "H"],
    ctrl: 1,
    cblk: 1,
};

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

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Willkommen zum Experiment!<br><br>
Bitte bearbeiten Sie das nachfolgende Experiment ernsthaft und konzentriert. Stellen Sie außerdem sicher, 
dass Sie sich in einer ruhigen Umgebung befinden und über ausreichend Zeit verfügen.<br><br>
Bei Fragen oder Problemen lassen Sie uns bitte eine Nachricht via Prolific zukommen.<br><br> 
Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const VIDEOS = [
    "../videos/JaDaumenhoch_f.mp4",
    "../videos/NeinDaumenhoch_f.mp4",
    "../videos/JaDaumenhoch_m.mp4",
    "../videos/NeinDaumenhoch_m.mp4",
    "../videos/JaDaumenrunter_f.mp4",
    "../videos/NeinDaumenrunter_f.mp4",
    "../videos/JaDaumenrunter_m.mp4",
    "../videos/NeinDaumenrunter_m.mp4",
    "../videos/JaKopfJa_f.mp4",
    "../videos/NeinKopfJa_f.mp4",
    "../videos/JaKopfJa_m.mp4",
    "../videos/NeinKopfJa_m.mp4",
    "../videos/JaKopfNein_f.mp4",
    "../videos/NeinKopfNein_f.mp4",
    "../videos/JaKopfNein_m.mp4",
    "../videos/NeinKopfNein_m.mp4",
];

const PRELOAD_VIDEOS = {
    type: jsPsychPreload,
    video: VIDEOS,
};

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
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

// const TRIAL_FEEDBACK = {
//     type: jsPsychHtmlKeyboardResponseCanvas,
//     canvas_colour: CANVAS_COLOUR,
//     canvas_size: CANVAS_SIZE,
//     canvas_border: CANVAS_BORDER,
//     stimulus: "",
//     response_ends_trial: false,
//     trial_duration: 0,
//     on_start: function (trial) {
//         let dat = jsPsych.data.get().last(1).values()[0];
//         trial.trial_duration = PRMS.fbDur[dat.error];
//         trial.stimulus = generate_formatted_html({
//             text: `${PRMS.fbTxt[dat.error]}`,
//             align: "center",
//             fontsize: 30,
//         });
//     },
// };

// const BLOCK_FEEDBACK = {
//     type: jsPsychHtmlKeyboardResponseCanvas,
//     canvas_colour: CANVAS_COLOUR,
//     canvas_size: CANVAS_SIZE,
//     canvas_border: CANVAS_BORDER,
//     response_ends_trial: true,
//     stimulus: "",
//     choices: [" "],
//     on_start: function (trial) {
//         let block_dvs = calculateBlockPerformance({
//             filter_options: { stim: "gc", blockNum: PRMS.cblk },
//             corrColumn: "error",
//             corrValue: 0,
//         });
//         trial.stimulus = generate_formatted_html({
//             text: `Ende Block ${PRMS.cblk} von ${PRMS.nblks}<br><br>
//             Mittlere Reaktionzeit: ${block_dvs.meanRt} ms<br>
//             Fehlerrate: ${block_dvs.errorRate}%<br><br>
//             Drücken Sie die Leertaste, um fortzufahren.`,
//             align: "center",
//             fontsize: 30,
//         });
//     },
//     on_finish: function () {
//         PRMS.ctrl = 1;
//         PRMS.cblk += 1;
//     },
// };

const TRIAL_TIMELINE = {
    timeline: [FIXATION_CROSS, ITI],
    timeline_variables: TRIAL_TABLE,
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
    save_data_server("/Common8+/write_data.php", data_fn, { stim_type: "gc" });
    // save_data_local(data_fn, { stim_type: "gc" });  // saves to download folder
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
        color: PRMS.colours.mid,
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
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    // exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(TASK_INSTRUCTIONS);

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

// jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
jsPsych.run(EXP);
