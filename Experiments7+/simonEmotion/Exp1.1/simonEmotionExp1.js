// Simon Task:
// VPs respond to the emotion (happy vs. sad) of a face presented to the left/right side of the screen.

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(255, 255, 255, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    screenRes: [960, 720],
    nBlks: 8, // number of blocks
    fixDur: 500, // duration of fixation cross
    fixSize: 15, // duration of the fixation cross
    fixWidth: 5, // size of fixation cross
    fbDur: [0, 1500, 1500, 1500], // duration of feedback for each type
    waitDur: 1000, // duration following ...
    iti: 500, // duration of inter-trial-interval
    tooFast: 150, // responses faster than x ms -> too fast!
    tooSlow: 1500, // response slower than x ms -> too slow!
    respKeys: ['Q', 'P'],
    target: shuffle(['trauriges', 'glückliches']),
    stimEccentricity: 250,
    fbTxt: ['', 'Falsch', 'Zu langsam', 'Zu schnell'],
    fbTxtSizeTrial: 30,
    fbTxtSizeBlock: 30,
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           charlotte.kost@student.uni-tuebingen.de<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
    }),
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `In diesem Experiment siehst du glückliche und traurige Gesichter.
           In jedem Durchgang siehst du ein Gesicht links oder rechts auf dem Bildschirm.
           Deine Aufgabe ist es zu entscheiden, ob das Gesicht eine glückliche oder traurige Emotion zeigt.<br><br>
           WICHTIG! Benutze hierfür die Q-Taste mit deinem linken Zeigefinger und die P-Taste mit deinem rechten Zeigefinger.<br><br>
           "Q" = ${PRMS.target[0]} Gesicht &emsp; "P" = ${PRMS.target[1]} Gesicht<br><br>
           Bitte antworte so schnell und so korrekt wie möglich!<br><br>
           Drücke eine beliebige Taste, um fortzufahren.`,
        align: 'left',
        colour: 'black',
        fontsize: 30,
    }),
};

const BLOCK_START = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    on_start: function(trial) {
        trial.stimulus = generate_formatted_html({
            text: `Block ${PRMS.cBlk} von ${PRMS.nBlks}<br><br>
             Reagiere auf die Emotion des Gesichtes wie folgt:<br><br>
             "Q" = ${PRMS.target[0]} Gesicht &emsp; "P" = ${PRMS.target[1]} Gesicht<br><br>
             Drücke eine beliebige Taste, um fortzufahren.`,
            align: 'left',
            colour: 'black',
            fontsize: 30,
        });
    },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// console.log(nimstim_sad);
// console.log(nimstim_happy);
// console.log(mpi_sad_old);
// console.log(mpi_sad_middle);
// console.log(mpi_sad_young);
// console.log(mpi_happy_old);
// console.log(mpi_happy_middle);
// console.log(mpi_happy_young);
// console.log(kdef_sad);
// console.log(kdef_happy);
// console.log(radboud_sad);
// console.log(radboud_happy);
// console.log(radiate_sad);
// console.log(radiate_happy);

const PRELOAD = {
    type: jsPsychPreload,
    images: [
        nimstim_sad,
        nimstim_happy,
        mpi_sad_old,
        mpi_happy_old,
        mpi_sad_middle,
        mpi_happy_middle,
        mpi_sad_young,
        mpi_happy_young,
        kdef_sad,
        kdef_happy,
        radboud_sad,
        radboud_happy,
        radiate_sad,
        radiate_happy,
    ],
};

const IMAGE_NUMBERS = {
    nimstim: randomSelection(range(0, nimstim_sad.length), 40),
    mpi_old: randomSelection(range(0, mpi_sad_old.length), 52),
    mpi_middle: randomSelection(range(0, mpi_sad_middle.length), 52),
    mpi_young: randomSelection(range(0, mpi_sad_young.length), 52),
    kdef: randomSelection(range(0, kdef_sad.length), 52),
    radboud: randomSelection(range(0, radboud_sad.length), 52),
    radiate1: randomSelection(range(0, radiate_sad.length), 52),
    radiate2: null,
};
IMAGE_NUMBERS.radiate2 = randomSelection(
    range(0, radiate_sad.length).filter((x) => !IMAGE_NUMBERS.radiate1.includes(x)),
    52,
);

// console.log(image_numbers);
function generateStimulusCombinations(dataset_sad, dataset_happy, dataset_name, image_numbers) {
    let simon_type = shuffle(
        repeatArray(['sad_left', 'sad_right', 'happy_left', 'happy_right'], image_numbers.length / 4),
    );
    let trials = [];
    for (let i = 0; i < simon_type.length; i++) {
        let tmp = {};
        tmp.database = dataset_name;
        if (simon_type[i] === 'sad_left') {
            tmp.target = dataset_sad[image_numbers[i]];
            tmp.target_type = 'sad';
            tmp.target_side = 'left';
            tmp.key = PRMS.respKeys[PRMS.target.indexOf('trauriges')];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? 'comp' : 'incomp';
        } else if (simon_type[i] === 'sad_right') {
            tmp.target = dataset_sad[image_numbers[i]];
            tmp.target_type = 'sad';
            tmp.target_side = 'right';
            tmp.key = PRMS.respKeys[PRMS.target.indexOf('trauriges')];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? 'comp' : 'incomp';
        } else if (simon_type[i] === 'happy_left') {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = 'happy';
            tmp.target_side = 'left';
            tmp.key = PRMS.respKeys[PRMS.target.indexOf('glückliches')];
            tmp.comp = tmp.key === PRMS.respKeys[0] ? 'comp' : 'incomp';
        } else if (simon_type[i] === 'happy_right') {
            tmp.target = dataset_happy[image_numbers[i]];
            tmp.target_type = 'happy';
            tmp.target_side = 'right';
            tmp.key = PRMS.respKeys[PRMS.target.indexOf('glückliches')];
            tmp.comp = tmp.key === PRMS.respKeys[1] ? 'comp' : 'incomp';
        }
        trials.push(tmp);
    }
    return trials;
}

// prettier-ignore
const TRIALS_NIMSTIM = generateStimulusCombinations(nimstim_sad, nimstim_happy, 'nimstim', IMAGE_NUMBERS.nimstim);
const TRIALS_MPI_YOUNG = generateStimulusCombinations(mpi_sad_young, mpi_happy_young, 'mpi_young', IMAGE_NUMBERS.mpi_young);
const TRIALS_MPI_MIDDLE = generateStimulusCombinations(mpi_sad_middle, mpi_happy_middle, 'mpi_middle', IMAGE_NUMBERS.mpi_middle);
const TRIALS_MPI_OLD = generateStimulusCombinations(mpi_sad_old, mpi_happy_old, 'mpi_old', IMAGE_NUMBERS.mpi_old);
const TRIALS_KDEF = generateStimulusCombinations(kdef_sad, kdef_happy, 'kdef', IMAGE_NUMBERS.kdef);
const TRIALS_RADBOUD = generateStimulusCombinations(radboud_sad, radboud_happy, 'radboud', IMAGE_NUMBERS.radboud);
const TRIALS_RADIATE1 = generateStimulusCombinations(radiate_sad, radiate_happy, 'radiate', IMAGE_NUMBERS.radiate1);
const TRIALS_RADIATE2 = generateStimulusCombinations(radiate_sad, radiate_happy, 'radiate', IMAGE_NUMBERS.radiate2);

// console.log(trials_nimstim);
// console.log(trials_mpi_young);
// console.log(trials_mpi_middle);
// console.log(trials_mpi_old);
// console.log(trials_kdef);
// console.log(trials_radboud);
// console.log(trials_radiate1);
// console.log(trials_radiate2);

////////////////////////////////////////////////////////////////////////
//                              Exp Parts                             //
////////////////////////////////////////////////////////////////////////

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const TRIAL_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: false,
    trial_duration: null,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.corrCode - 1];
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeTrial}px;">${PRMS.fbTxt[dat.corrCode - 1]}</div>`;
    },
};


function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt - PRMS.fixDur : PRMS.tooSlow;
    dat.target = baseFileName(dat.target);

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);

    if (correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > PRMS.tooFast && dat.rt < PRMS.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= PRMS.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= PRMS.tooFast) {
        corrCode = 4; // too fast
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
        corrCode: corrCode,
    });
}

function drawStimulus(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');

    // fixation cross
    if (args.draw_fixation) {
        ctx.lineWidth = PRMS.fixWidth;
        ctx.moveTo(-PRMS.fixSize, 0);
        ctx.lineTo(PRMS.fixSize, 0);
        ctx.stroke();
        ctx.moveTo(0, -PRMS.fixSize);
        ctx.lineTo(0, PRMS.fixSize);
        ctx.stroke();
    }

    // image
    if (args.draw_image) {
        const img = new Image();
        img.src = args.image;
        if (args.side === 'left') {
            ctx.drawImage(img, -PRMS.stimEccentricity - img.width / 2, -img.height / 2);
        } else if (args.side === 'right') {
            ctx.drawImage(img, PRMS.stimEccentricity - img.width / 2, -img.height / 2);
        }
    }
}

// prettier-ignore
const SIMON_STIMULUS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: PRMS.fixDur + PRMS.tooSlow,
    func: [drawStimulus, drawStimulus],
    clear_screen: [1, 1],
    stimulus_onset: [0, PRMS.fixDur],
    func_args: null,
    data: {
        stim: 'simon',
        target: jsPsych.timelineVariable('target'),
        target_type: jsPsych.timelineVariable('target_type'),
        target_side: jsPsych.timelineVariable('target_side'),
        compatibility: jsPsych.timelineVariable('comp'),
        database: jsPsych.timelineVariable('database'),
        corrResp: jsPsych.timelineVariable('key'),
    },
    on_start: function(trial) {
        trial.func_args = [
            { draw_fixation: true, draw_image: false, image: trial.data.target, side: trial.data.target_side },
            { draw_fixation: true, draw_image: true, image: trial.data.target, side: trial.data.target_side },
        ];
    },
    on_finish: function() {
        codeTrial();
        PRMS.cTrl += 1;
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function(trial) {
        let block_dvs = calculateBlockPerformance({ filter_options: { stim: 'simon', blockNum: PRMS.cBlk } });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function() {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

const TRIAL_TIMELINE_NIMSTIM = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_NIMSTIM,
};

const TRIAL_TIMELINE_KDEF = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_KDEF,
};

const TRIAL_TIMELINE_MPI_YOUNG = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_YOUNG,
};

const TRIAL_TIMELINE_MPI_MIDDLE = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_MIDDLE,
};

const TRIAL_TIMELINE_MPI_OLD = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_MPI_OLD,
};

const TRIAL_TIMELINE_RADBOUD = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADBOUD,
};

const TRIAL_TIMELINE_RADIATE1 = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE1,
};

const TRIAL_TIMELINE_RADIATE2 = {
    timeline: [SIMON_STIMULUS, TRIAL_FEEDBACK, ITI],
    timeline_variables: TRIALS_RADIATE2,
};

const TRIAL_TIMELINES = [TRIAL_TIMELINE_NIMSTIM].concat(
    shuffle([
        TRIAL_TIMELINE_KDEF,
        TRIAL_TIMELINE_MPI_YOUNG,
        TRIAL_TIMELINE_MPI_MIDDLE,
        TRIAL_TIMELINE_MPI_OLD,
        TRIAL_TIMELINE_RADBOUD,
        TRIAL_TIMELINE_RADIATE1,
        TRIAL_TIMELINE_RADIATE2,
    ]),
);
// console.log(trial_timelines);

////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_CODE = generateRandomString(16, 'se1_');

const VP_CODE_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [' '],
    stimulus: generate_formatted_html({
        text:
            `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>
        charlotte.kost@student.uni-tuebingen.de<br><br>
        Code: ` +
            RANDOM_CODE +
            `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
        fontsize: 28,
        lineheight: 1.0,
        bold: true,
        align: 'left',
    }),
};

////////////////////////////////////////////////////////////////////////
//                            password                                //
////////////////////////////////////////////////////////////////////////
const PASSWORD = {
    type: jsPsychExternalHtml,
    url: '/Common7+/password.html',
    cont_btn: 'start',
    check_fn: function() {
        let password = document.getElementById('pass').value;
        let correct = getPassword('/Common7+/password.php', password);
        if (correct !== '0') {
            alert('Falsch');
            return false;
        } else {
            return true;
        }
    },
    post_trial_gap: 1000,
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
    saveData('/Common/write_data.php', data_fn, { stim: 'simon' });
    // saveDataLocal(data_fn, { stim: 'simon' });

    const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
    saveRandomCode('/Common/write_code.php', code_fn, RANDOM_CODE);
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
    'use strict';

    let exp = [];

    exp.push(PASSWORD);

    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(PRELOAD);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm('/Common7+/vpInfoForm_de_copyright.html'));
    exp.push(mouseCursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    for (let blk = 0; blk < TRIAL_TIMELINES.length; blk += 1) {
        exp.push(BLOCK_START);
        let blk_timeline = TRIAL_TIMELINES[blk];
        blk_timeline.sample = {
            type: 'fixed-repetitions',
            size: 1,
        };
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(VP_CODE_INSTRUCTIONS);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
