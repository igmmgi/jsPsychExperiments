// Bimodal match or mismatch of gesture and speech
// Participants respond to gesture or speech

////////////////////////////////////////////////////////////////////////
//         Initialize JsPsych and Define Canvas Properties            //
////////////////////////////////////////////////////////////////////////

const jsPsych = initJsPsych();

const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = "5px solid Black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 6, // number of experimental blocks
    nTrlsP: 10, // number of practice trials
    // nTrlsP: 2,
    nTrlsE: 64, // number of experimental trials
    // nTrlsE: 4,
    fixDur: 1000, // duration of fixation cross
    fixSize: 50, // size of fixation cross
    fbDur: [1000, 1000], // duration of feedback for each type
    fbTxt: ["Richtig!", "Falsch!"],
    iti: 1000, // duration of inter-trial interval
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
        text: `Allgemeine Teilnahmeinformationen:<br><br>
               Herzlich willkommen bei unserer Studie zur Verarbeitung von verbaler und gestischer Affirmation und Negation!<br><br>
               Ablauf der Studie: Das folgende Experiment besteht aus sechs Experimentalblöcken, zwischen denen Sie die Möglichkeit haben, eine Pause zu machen. Insgesamt dauert das Experiment 60 bis 70 Minuten. 
               Ihre Aufgabe ist es, in jedem Durchgang zu entscheiden, ob sich ein Ball in einer linken oder rechten Box befindet. Dazu lesen Sie zuerst eine Frage, dann sehen Sie einen kurzen Video-Ausschnitt, der diese Frage beantwortet, und danach drücken Sie eine Taste. 
               Wir erheben von Ihnen außerdem Angaben zu Alter, Geschlecht und Händigkeit.
               Sollten Sie noch Fragen haben oder sich technische Probleme ergeben, schreiben Sie uns bitte via Prolific eine Nachricht.<br><br>
               Freiwilligkeit und Anonymität: Die Teilnahme an der Studie ist freiwillig. Sie können jederzeit und ohne Angabe von Gründen die Teilnahme an dieser Studie beenden. Wird die Studie vor Beendigung abgebrochen, werden die bis dahin erhobenen Daten nicht gespeichert. 
               Die im Rahmen dieser Studie erhobenen, oben beschriebenen Daten und persönlichen Mitteilungen werden vertraulich behandelt. So unterliegen diejenigen Projektmitarbeiter, die über personenbezogene Daten verfügen, der Schweigepflicht bzw. dem Datengeheimnis. Des Weiteren wird die Veröffentlichung der Ergebnisse der Studie in anonymisierter Form erfolgen, d. h. ohne dass Ihre Daten Ihrer Person zugeordnet werden können.<br><br>
               Datenschutz: Die Erhebung und Verarbeitung Ihrer oben beschriebenen persönlichen Daten erfolgt anonym unter Verwendung einer zufällig zugewiesenen Nummer und ohne Angabe Ihres Namens in der Abteilung Sprache & Kognition des Psychologischen Instituts der Universität Tübingen. IP-Adressen und/oder IDs der Erhebungsplattform werden nicht mit den Daten gespeichert. Damit ist es niemandem möglich, die erhobenen Daten mit Ihrem Namen in Verbindung zu bringen. Eine Löschung der Daten nach Abschluss des Experiments ist somit nicht möglich. Daten in digitaler Form werden auf dem passwortgeschützten Laufwerk der Arbeitsgruppe von Prof. Dr. Barbara Kaup an der Universität Tübingen gelagert. Sollten ausnahmsweise Daten in digitaler Form auf privaten PCs, zu denen sonst niemand anders Zugang hat, gespeichert werden, werden diese nach Beenden der Datenanalysen von den privaten PCs wieder gelöscht. Die anonymen Daten dieser Studie werden als offene Daten im Internet zugänglich gemacht. Damit folgt diese Studie den Empfehlungen der Deutschen Forschungsgemeinschaft (DFG) und der Deutschen Gesellschaft für Psychologie (DGPs) zur Qualitätssicherung in der Forschung.<br><br>
               Vergütung: Für die Teilnahme am Experiment erhalten Sie 9.00 GBP. Die Auszahlung des Betrags erfolgt ausschließlich über Prolific. 
               Sollte das Experiment während der Bearbeitung abbrechen, senden Sie bitte via Prolific eine Nachricht mit der ungefähren Bearbeitungsdauer an uns.<br><br>
               Drücken Sie nun eine beliebige Taste, um fortzufahren.`,
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

const AUDIO_1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Das Experiment enthält Videos mit Audio-Inhalten. Bitte stellen Sie daher jetzt Ihre Lautsprecher an 
		      oder setzen Sie Ihre Kopfhörer auf. Es ist entscheidend, dass die Lautsprecher bzw. Kopfhörer während 
              des gesamten Experiments angestellt sind. Wir bitten Sie, dies unbedingt zu beachten!<br><br>			  
              Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const AUDIO_2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Lautsprecher bzw. Kopfhörer aktiviert?<br><br>
              Dann drücken Sie die Leertaste, um fortzufahren!`,
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
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Während des Experiments wird Ihre Aufgabe darin bestehen, mit Hilfe des Inhalts von Videos die Frage zu beantworten, 
		      ob sich ein Ball in einer blauen bzw. grünen Box befindet. <br><br>
			  In jedem Durchgang wird auf dem Bildschirm eine Frage präsentiert: Entweder „Ist der Ball in der blauen Box?“ oder „Ist der 
			  Ball in der grünen Box?“. Weiter unten auf dem Bildschirm erscheinen zudem nebeneinander eine blaue und eine grüne Box. <br><br>
              Abschließend sehen Sie ein Video, das eine verbale Antwort (das Wort JA oder NEIN) und eine gestische Antwort (Kopfnicken oder
			  Kopfschütteln; Daumen hoch oder Daumen herunter) auf die Frage liefert. Verbale und gestische Antwort können übereinstimmen 
			  oder einander widersprechen. <br><br>
			  Drücke Sie die Leertaste, um fortzufahren.`,

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
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Wichtig: In der nachfolgenden ersten Hälfte des Experiments sollen Sie nur auf die VERBALE Antwort im Video reagieren! Um die linke 
			  Box auszuwählen, drücken Sie Taste „F“. Um die rechte Box auszuwählen, drücken Sie Taste „J“. <br><br>
              Beispiel 1: Die linke Box ist grün und die rechte Box ist blau. Die Frage lautet „Ist der Ball in der grünen Box?“. Im Video wird JA gesagt. 
			  Sie wählen die linke (d.h. die grüne) Box aus, indem Sie Taste „F“ drücken. <br><br> 
			  Beispiel 2: Die linke Box ist blau und die rechte Box ist grün. Die Frage lautet „Ist der Ball in der blauen Box?“. Im Video wird NEIN gesagt. 
			  Sie wählen die rechte (d.h. die grüne) Box aus, indem Sie Taste „J“ drücken. <br><br>
			  Bitte reagieren Sie immer so schnell und so korrekt wie möglich.<br><br>
			  Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS4 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Jetzt folgt zunächst ein kurzer Übungsblock, damit Sie sich mit der Aufgabe vertraut machen können. <br><br>
		      Falls noch nicht geschehen, stellen Sie nun UNBEDINGT Ihre Lautsprecher ein oder setzen Sie Kopfhörer auf. 
			  Nutzen Sie den Übungblocks dazu, die Lautstärke so zu regulieren, dass Sie die verbalen Antworten in den Videos 
			  mühelos verstehen können.<br><br>
			  Reagieren Sie nur auf die VERBALEN Antworten in den Videos!<br><br>
              Drücken Sie die bitte Leertaste, um den Übungsblock zu starten!`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS5 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Ende des Übungsblocks! Das Experiment besteht aus ingesamt sechs Blöcken. Nach jedem Block haben Sie die Möglichkeit,
              eine Pause zu machen. Wenn Sie die Hälfte der Blöcke absolviert haben, werden Sie neue Instruktionen erhalten. 
			  Denken Sie bis dahin bitte daran, ausschließlich auf die VERBALEN Antworten im Video zu reagieren! <br><br>
              Drücken Sie die Leertaste, um das Experiment zu starten!`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS6 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Die erste Hälfte des Experiments ist geschafft.<br>
		      WICHTIG: Nun ändert sich Ihre Aufgabe!<br><br>
		      In der nachfolgenden zweiten Hälfte des Experiments reagieren Sie bitte nur auf die GESTISCHE Antwort im Video. <br><br>  
			  Beispiel 1: Die linke Box ist grün und die rechte Box ist blau. Die Frage lautet „Ist der Ball in der grünen Box?“. 
			  Im Video wird mit dem Kopf genickt. Sie wählen die linke (d.h. die grüne) Box aus, indem Sie Taste „F“ drücken. <br><br> 
			  Beispiel 2: Die linke Box ist blau und die rechte Box ist grün. Die Frage lautet „Ist der Ball in der blauen Box?“. 
			  Im Video wird der Daumen nach unten gehalten. Sie wählen die rechte (d.h. die grüne) Box aus, indem Sie Taste „J“ drücken. <br><br>
			  Bitte reagieren Sie immer so schnell und so korrekt wie möglich.<br><br>
			  Drücken Sie die Leertaste, um fortzufahren.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS7 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Es folgt wieder ein kurzer Übungsblock. Bitte denken Sie daran:<br>
		      Reagieren Sie ab jetzt auf die GESTISCHE Antwort im Video!<br><br>
              Drücken Sie die Leertaste, um den Übungsblock zu starten!`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

const TASK_INSTRUCTIONS8 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Ende des Übungsblocks! Bitte denken Sie daran:<br>
		      Reagieren Sie auf die GESTISCHE Antwort im Video!<br><br>
		      Mit der Leertaste starten Sie die zweite Hälfte des Experiments.`,
        align: "left",
        colour: "Black",
        fontsize: 28,
    }),
};

// const TASK_INSTRUCTIONS_BLOCK_START = {
// type: jsPsychHtmlKeyboardResponseCanvas,
// canvas_colour: CANVAS_COLOUR,
// canvas_size: CANVAS_SIZE,
// canvas_border: CANVAS_BORDER,
// stimulus: "",
// choices: [" "],
// on_start: function (trial) {
// trial.stimulus = generate_formatted_html({
// text: `Start Block ${PRMS.cBlk} von ${PRMS.nBlks}.<br><br>
// Wenn Sie wieder bereit sind, drücken Sie bitte die Leertaste.`,
// align: "left",
// fontsize: 28,
// bold: false,
// lineheight: 1.5,
// });
// },
// };

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

const VIDEOS_A = [
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

const VIDEOS_B = [
    "../videos/JaDaumenhoch_f.mp4",
    "../videos/JaDaumenrunter_f.mp4",
    "../videos/JaDaumenhoch_m.mp4",
    "../videos/JaDaumenrunter_m.mp4",

    "../videos/NeinDaumenhoch_f.mp4",
    "../videos/NeinDaumenrunter_f.mp4",
    "../videos/NeinDaumenhoch_m.mp4",
    "../videos/NeinDaumenrunter_m.mp4",

    "../videos/JaKopfJa_f.mp4",
    "../videos/JaKopfNein_f.mp4",
    "../videos/JaKopfJa_m.mp4",
    "../videos/JaKopfNein_m.mp4",

    "../videos/NeinKopfJa_f.mp4",
    "../videos/NeinKopfNein_f.mp4",
    "../videos/NeinKopfJa_m.mp4",
    "../videos/NeinKopfNein_m.mp4",
];

const PRELOAD_A = {
    type: jsPsychPreload,
    video: VIDEOS_A,
};

const PRELOAD_B = {
    type: jsPsychPreload,
    video: VIDEOS_B,
};

const QUESTIONS = ["Ist der Ball in der grünen Box?", "Ist der Ball in der blauen Box?"];

const COLOURS = ["Green", "Blue"];

////////////////////////////////////////////////////////////////////////
//                       Additional Trial Data                        //
////////////////////////////////////////////////////////////////////////

const POLARITY = [
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
    "affirmation",
    "negation",
];

const MATCHING = [
    "match",
    "mismatch",
    "match",
    "mismatch",
    "mismatch",
    "match",
    "mismatch",
    "match",
    "match",
    "mismatch",
    "match",
    "mismatch",
    "mismatch",
    "match",
    "mismatch",
    "match",
];

const MODALITY_A = [
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
    "speech",
];

const MODALITY_B = [
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
    "gesture",
];

const VERBAL_A = [
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
    "yes",
    "no",
];

const VERBAL_B = [
    "yes",
    "yes",
    "yes",
    "yes",
    "no",
    "no",
    "no",
    "no",
    "yes",
    "yes",
    "yes",
    "yes",
    "no",
    "no",
    "no",
    "no",
];

const GESTURE_A = [
    "ThumbUp",
    "ThumbUp",
    "ThumbUp",
    "ThumbUp",
    "ThumbDown",
    "ThumbDown",
    "ThumbDown",
    "ThumbDown",
    "HeadNod",
    "HeadNod",
    "HeadNod",
    "HeadNod",
    "HeadShake",
    "HeadShake",
    "HeadShake",
    "HeadShake",
];

const GESTURE_B = [
    "ThumbUp",
    "ThumbDown",
    "ThumbUp",
    "ThumbDown",
    "ThumbUp",
    "ThumbDown",
    "ThumbUp",
    "ThumbDown",
    "HeadNod",
    "HeadShake",
    "HeadNod",
    "HeadShake",
    "HeadNod",
    "HeadShake",
    "HeadNod",
    "HeadShake",
];

const SPEAKER = [
    "female",
    "female",
    "male",
    "male",
    "female",
    "female",
    "male",
    "male",
    "female",
    "female",
    "male",
    "male",
    "female",
    "female",
    "male",
    "male",
];

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

// const TRIALS_CALIBRATION = [
// { video: VIDEOS[0] }, { video: VIDEOS[1] }, { video: VIDEOS[2] }, { video: VIDEOS[3] },
// { video: VIDEOS[4] }, { video: VIDEOS[5] }, { video: VIDEOS[6] }, { video: VIDEOS[7] },
// { video: VIDEOS[8] }, { video: VIDEOS[9] }, { video: VIDEOS[10] }, { video: VIDEOS[11] },
// { video: VIDEOS[12] }, { video: VIDEOS[13] }, { video: VIDEOS[14] }, { video: VIDEOS[15] }

// ];

// const VIDEO_TRIAL_CALIBRATION = {
// type: jsPsychVideoKeyboardResponse,
// canvas_colour: CANVAS_COLOUR,
// canvas_size: CANVAS_SIZE,
// canvas_border: CANVAS_BORDER,
// stimulus: [jsPsych.timelineVariable("video")],
// width: PRMS.video_width,
// choices: PRMS.respKeys,
// trial_ends_after_video: true,
// translate_origin: true,
// response_ends_trial: false,
// box_colour_left: CANVAS_COLOUR,
// box_colour_right: CANVAS_COLOUR,
// answer_text: "",
// answer_font: "",
// answer_position: PRMS.answer_position,
// box_position: PRMS.box_position,
// box_size: 0,
// box_frame: 0,
// };

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
        stim: "SpeechGestureMatch",
        video: jsPsych.timelineVariable("video"),
        question: jsPsych.timelineVariable("question"),
        box_colour_left: jsPsych.timelineVariable("box_colour_left"),
        box_colour_right: jsPsych.timelineVariable("box_colour_right"),
        correct_key: jsPsych.timelineVariable("correct_key"),
        polarity: jsPsych.timelineVariable("polarity"),
        matching: jsPsych.timelineVariable("matching"),
        modality: jsPsych.timelineVariable("modality"),
        verbal: jsPsych.timelineVariable("verbal"),
        gesture: jsPsych.timelineVariable("gesture"),
        speaker: jsPsych.timelineVariable("speaker"),
    },
    on_finish: function () {
        code_trial();
        PRMS.cTrl += 1;
    },
};

const VIDEO_TRIAL_TRAINING = {
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
        stim: "Training",
        video: jsPsych.timelineVariable("video"),
        question: jsPsych.timelineVariable("question"),
        box_colour_left: jsPsych.timelineVariable("box_colour_left"),
        box_colour_right: jsPsych.timelineVariable("box_colour_right"),
        correct_key: jsPsych.timelineVariable("correct_key"),
        polarity: jsPsych.timelineVariable("polarity"),
        matching: jsPsych.timelineVariable("matching"),
        modality: jsPsych.timelineVariable("modality"),
        verbal: jsPsych.timelineVariable("verbal"),
        gesture: jsPsych.timelineVariable("gesture"),
        speaker: jsPsych.timelineVariable("speaker"),
    },
    on_finish: function () {
        code_trial();
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

const BLOCK_FEEDBACK_A = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    stimulus: "",
    choices: [" "],
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "SpeechGestureMatch", blockNum: PRMS.cBlk },
            corrColumn: "error",
            corrValue: 0,
        });
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
            Mittlere Reaktionzeit: ${block_dvs.meanRt} ms<br>
            Fehlerrate: ${block_dvs.errorRate}%<br><br>
			Zur Erinnerung:<br>
			Reagieren Sie so schnell und so korrekt wie möglich<br>
			auf die VERBALEN Antworten in den Videos.<br><br>
            Drücken Sie die Leertaste, um fortzufahren.`,
            align: "center",
            fontsize: 30,
        });
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

const BLOCK_FEEDBACK_B = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    response_ends_trial: true,
    stimulus: "",
    choices: [" "],
    on_start: function (trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim: "SpeechGestureMatch", blockNum: PRMS.cBlk },
            corrColumn: "error",
            corrValue: 0,
        });
        trial.stimulus = generate_formatted_html({
            text: `Ende Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
            Mittlere Reaktionzeit: ${block_dvs.meanRt} ms<br>
            Fehlerrate: ${block_dvs.errorRate}%<br><br>
			Zur Erinnerung:<br>
			Reagieren Sie so schnell und so korrekt wie möglich<br>
			auf die GESTISCHEN Antworten in den Videos.<br><br>
            Drücken Sie die Leertaste, um fortzufahren.`,
            align: "center",
            fontsize: 30,
        });
    },
    on_finish: function () {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

function create_trial_table_speech() {
    // prettier-ignore
    let trial_table = [];
    for (let i = 0; i < 16; i++) {
        if (i % 2 == 0) {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
            ]);
        } else {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_A[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_A[i],
                    verbal: VERBAL_A[i],
                    gesture: GESTURE_A[i],
                    speaker: SPEAKER[i],
                },
            ]);
        }
    }
    return trial_table;
}

function create_trial_table_gesture() {
    // prettier-ignore
    let trial_table = [];
    for (let i = 0; i < 16; i++) {
        if (i % 2 == 0) {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
            ]);
        } else {
            trial_table = trial_table.concat([
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[0],
                    box_colour_right: COLOURS[1],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[0],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[0],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
                {
                    video: VIDEOS_B[i],
                    question: QUESTIONS[1],
                    box_colour_left: COLOURS[1],
                    box_colour_right: COLOURS[0],
                    correct_key: PRMS.respKeys[1],
                    polarity: POLARITY[i],
                    matching: MATCHING[i],
                    modality: MODALITY_B[i],
                    verbal: VERBAL_B[i],
                    gesture: GESTURE_B[i],
                    speaker: SPEAKER[i],
                },
            ]);
        }
    }
    return trial_table;
}

// const TRIAL_TIMELINE_CALIBRATION = {
// timeline: [FIXATION_CROSS, VIDEO_TRIAL_CALIBRATION, ITI],
// timeline_variables: TRIALS_CALIBRATION,
// sample: {
// type: "fixed-repetitions",
// size: 1,
// },
// };

const TRIAL_TABLE_PRACTICE_SPEECH = shuffle(create_trial_table_speech()).slice(0, PRMS.nTrlsP);
const TRIAL_TABLE_PRACTICE_GESTURE = shuffle(create_trial_table_gesture()).slice(0, PRMS.nTrlsP);

const TRIAL_TABLE_EXP_SPEECH = create_trial_table_speech();
const TRIAL_TABLE_EXP_GESTURE = create_trial_table_gesture();
// const TRIAL_TABLE_EXP_SPEECH = shuffle(create_trial_table_speech()).slice(0, PRMS.nTrlsE);
// const TRIAL_TABLE_EXP_GESTURE = shuffle(create_trial_table_gesture()).slice(0, PRMS.nTrlsE);

const TRIAL_TIMELINE_PRACTICE_SPEECH = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL_TRAINING, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_PRACTICE_SPEECH,
};

const TRIAL_TIMELINE_PRACTICE_GESTURE = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL_TRAINING, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_PRACTICE_GESTURE,
};

const TRIAL_TIMELINE_EXP_SPEECH = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_EXP_SPEECH,
};

const TRIAL_TIMELINE_EXP_GESTURE = {
    timeline: [FIXATION_CROSS, QUESTION, VIDEO_TRIAL, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIAL_TABLE_EXP_GESTURE,
};

////////////////////////////////////////////////////////////////////////
//                  Add General Data Properties                       //
////////////////////////////////////////////////////////////////////////

var order = "speech-gesture";
jsPsych.data.addProperties({ order: order });
var code = Math.floor(Math.random() * 1000000);

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${vpNum}`;
    saveData("../Common7+/write_data.php", data_fn, { stim: "SpeechGestureMatch" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate End Message                            //
////////////////////////////////////////////////////////////////////////
const END_MESSAGE = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<p><strong>Experiment beendet! Vielen Dank für Ihre Teilnahme!</strong></p>" +
        "<p><strong>Mit der Leertaste oder über folgenden Link geht es zurück zu Prolific:</strong></p>" +
        "<p>https://app.prolific.co/submissions/complete?cc=6E303C0A</p>",
    response_ends_trial: true,
    choices: [" "],
    on_finish: function () {
        window.location.replace("https://app.prolific.co/submissions/complete?cc=6E303C0A");
    },
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(welcome_message());
    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(PRELOAD_A);
    exp.push(CONSENT_SCREEN);
    exp.push(vpInfoForm("../Common7+/vpInfoForm_de.html"));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(AUDIO_1);
    exp.push(AUDIO_2);
    exp.push(TASK_INSTRUCTIONS2);
    exp.push(TASK_INSTRUCTIONS3);
    exp.push(TASK_INSTRUCTIONS4);
    exp.push(TRIAL_TIMELINE_PRACTICE_SPEECH);
    exp.push(TASK_INSTRUCTIONS5);

    for (let blk_speech = 1; blk_speech < 4; blk_speech += 1) {
        let blk_speech_timeline = { ...TRIAL_TIMELINE_EXP_SPEECH };
        blk_speech_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_speech_timeline);
        exp.push(BLOCK_FEEDBACK_A);
    }

    exp.push(PRELOAD_B);
    exp.push(TASK_INSTRUCTIONS6);
    exp.push(TASK_INSTRUCTIONS7);
    exp.push(TRIAL_TIMELINE_PRACTICE_GESTURE);
    exp.push(TASK_INSTRUCTIONS8);

    for (let blk_gesture = 1; blk_gesture < 4; blk_gesture += 1) {
        let blk_gesture_timeline = { ...TRIAL_TIMELINE_EXP_GESTURE };
        blk_gesture_timeline.sample = {
            type: "fixed-repetitions",
            size: 1,
        };
        exp.push(blk_gesture_timeline);
        exp.push(BLOCK_FEEDBACK_B);
    }

    exp.push(SAVE_DATA);
    exp.push(fullscreen(false));
    exp.push(mouseCursor(true));
    exp.push(END_MESSAGE);
    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
