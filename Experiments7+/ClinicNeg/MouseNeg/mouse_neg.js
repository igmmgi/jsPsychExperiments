// Negation Task:
// Participants respond to the meaning using mouse response:
// Language (Now animal/not animal)
// Symbolic (Tick Mark Toy / Cross Mark Toy)

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
    nTrlsP: 2, //8, // number of trials in practice blocks
    nTrlsE: 48, // number of trials in subsequent blocks
    nBlks: 2, //6,
    fbDur: [500, 500, 3000], // feedback duration for correct and incorrect trials, respectively
    waitDur: 1000,
    iti: 1000,
    fixPos: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.75], // x,y position of stimulus
    fixDur: 500,
    stimPos: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.75], // x,y position of stimulus
    startBox: [CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] * 0.9, 50, 50], // xpos, ypos, xsize, ysize
    leftBox: [150, 150, 250, 250], // xpos, ypos, xsize, ysize
    rightBox: [1130, 150, 250, 250], // xpos, ypos, xsize, ysize
    leftImageAnchor: [150, 150],
    rightImageAnchor: [1130, 150],
    keepFixation: false, // is fixation cross kept on screen with stimulus
    drawStartBox: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
    drawResponseBoxes: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
    drawResponseBoxesImage: [false, false, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
    boxLineWidth: 5, // linewidth of the start/target boxes
    requireMousePressStart: true, // is mouse button press inside start box required to initiate trial?
    requireMousePressFinish: false, // is mouse button press inside response box required to end trial?
    stimFont: '50px arial',
    stimSize: 50,
    fbTxt: ['Richtig', 'Falsch'],
    fbFont: '40px monospace',
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
};

// symbol characters
const TICK_MARK = "\u{2714}";
const CROSS_MARK = "\u{2718}";

// 2 counter balanced versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

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
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 15 Minuten konzentriert zu arbeiten.<br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const MOUSE_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `BITTE NUR TEILNEHMEN, WENN EINE COMPUTERMAUS ZUR VERFÜGUNG STEHT! <br><br>
    In diesem Experiment siehst Du in jedem Durchgang drei Quadrate und zwei Bilder. 
    Um den Durchgang zu starten, klicke auf das Quadrat unten in der Mitte. 
    Danach erscheint ein Wort auf dem Bildschirm.<br><br>
    Deine Aufgabe ist es, das Bild auszuwählen, das am besten passt, und den 
    Mauszeiger in das zugehörige Quadrat zu bewegen.  
    Bitte reagiere so schnell und korrekt wie möglich.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_LANGUAGE = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Reagiere entsprechend der Bedeutung!<br><br>
"jetzt Spielzeug" &emsp;oder&emsp; "nicht Tier" &emsp;&emsp; "jetzt Tier" &emsp;oder&emsp; "nicht Spielzeug"<br><br>
Drücke eine beliebige Taste, um fortzufahren`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_SYMBOLIC = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Reagiere entsprechend der Bedeutung!<br><br>
"${TICK_MARK} Spielzeug" &emsp;oder&emsp; "${CROSS_MARK} Tier" &emsp;&emsp;&emsp; "${TICK_MARK} Tier" &emsp;oder&emsp; ${CROSS_MARK} Spielzeug"<br><br>
Drück eine beliebige Taste, um fortzufahren`,
        align: 'center',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

////////////////////////////////////////////////////////////////////////
//                     Experiment Utilities                           //
////////////////////////////////////////////////////////////////////////
function drawFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    let xpos;
    let ypos;
    if (dat.end_loc === 'left') {
        xpos = PRMS.leftBox[0] + 25;
        ypos = PRMS.leftBox[1];
    } else if (dat.end_loc === 'right') {
        xpos = PRMS.rightBox[0] - 25;
        ypos = PRMS.rightBox[1];
    } else {
        // Fallback to mouse coords
        xpos = dat.end_x;
        ypos = dat.end_y;
    }
    if (dat.errorCode === 2) {
        ctx.fillText('Warte in dem Quadrat bis das Wort kommt!', CANVAS_SIZE[0] / 2, CANVAS_SIZE[1] / 2);
    } else {
        ctx.fillText(PRMS.fbTxt[dat.errorCode], xpos, ypos);
    }
}

function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];
    let idx = dat.y_coords.findIndex(function(pos) {
        return pos < 615;
    });
    let errorCode;
    errorCode = dat.correct_side !== dat.end_loc ? 1 : 0;
    errorCode = dat.time[idx] < PRMS.fixDur ? 2 : errorCode;
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        errorCode: errorCode,
        blockNum: PRMS.cBlk,
        trialNum: PRMS.cTrl,
    });
    PRMS.cTrl += 1;
}

////////////////////////////////////////////////////////////////////////
//               Stimuli/Timelines                                    //
////////////////////////////////////////////////////////////////////////

function stimuli_factory(items_toys, items_animals, type, n) {
    shuffle(items_toys.images);
    shuffle(items_animals.images);
    let stimuli = [];
    for (let i = 0; i < 48; i++) {
        let stimulus = {};
        stimulus.probe_type = type;
        if (i < 6) {
            // toy left, animal right, now toy
            stimulus.left = items_toys.images[i];
            stimulus.right = items_animals.images[i];
            stimulus.probe = type == 'Language' ? 'jetzt Spielzeug' : `${TICK_MARK} Spielzeug`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'left';
            stimulus.affneg = 'aff';
        } else if (i < 12) {
            // toy left, animal right, now animal
            stimulus.left = items_toys.images[i];
            stimulus.right = items_animals.images[i];
            stimulus.probe = type == 'Language' ? 'jetzt Tier' : `${TICK_MARK} Tier`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'right';
            stimulus.affneg = 'aff';
        } else if (i < 18) {
            // toy left, animal right, not toy
            stimulus.left = items_toys.images[i];
            stimulus.right = items_animals.images[i];
            stimulus.probe = type == 'Language' ? 'nicht Spielzeug' : `${CROSS_MARK} Spielzeug`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'right';
            stimulus.affneg = 'neg';
        } else if (i < 24) {
            // toy left, animal right, not animal
            stimulus.left = items_toys.images[i];
            stimulus.right = items_animals.images[i];
            stimulus.probe = type == 'Language' ? 'nicht Tier' : `${CROSS_MARK} Tier`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'left';
            stimulus.affneg = 'neg';
        } else if (i < 30) {
            // animal left, toy right, now toy
            stimulus.left = items_animals.images[i];
            stimulus.right = items_toys.images[i];
            stimulus.probe = type == 'Language' ? 'jetzt Spielzeug' : `${TICK_MARK} Spielzeug`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'right';
            stimulus.affneg = 'aff';
        } else if (i < 36) {
            // animal left, toy right, now animal
            stimulus.left = items_animals.images[i];
            stimulus.right = items_toys.images[i];
            stimulus.probe = type == 'Language' ? 'jetzt Tier' : `${TICK_MARK} Tier`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'left';
            stimulus.affneg = 'aff';
        } else if (i < 42) {
            // animal left, toy right, not toy
            stimulus.left = items_animals.images[i];
            stimulus.right = items_toys.images[i];
            stimulus.probe = type == 'Language' ? 'nicht Spielzeug' : `${CROSS_MARK} Spielzeug`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'left';
            stimulus.affneg = 'neg';
        } else if (i < 48) {
            // animal left, toy right, not animal
            stimulus.left = items_animals.images[i];
            stimulus.right = items_toys.images[i];
            stimulus.probe = type == 'Language' ? 'nicht Tier' : `${CROSS_MARK} Tier`;
            stimulus.probe_colour = 'black';
            stimulus.correct_side = 'right';
            stimulus.affneg = 'neg';
        }
        stimuli.push(stimulus);
    }

    return shuffle(stimuli).slice(0, n);
}

// images
function image_array(x) {
    'use strict';
    let images = [];
    for (let i = 0; i < x.length; i++) {
        images.push(x[i].image_path);
    }
    return images;
}

const TOY_IMAGES = {
    type: jsPsychPreload,
    auto_preload: true,
    images: image_array(TOY_IMAGE_LIST),
};


const ANIMAL_IMAGES = {
    type: jsPsychPreload,
    auto_preload: true,
    images: image_array(ANIMAL_IMAGE_LIST),
};

const TRIAL_STIMULUS = {
    type: jsPsychMouseImageResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    fixation_duration: PRMS.fixDur,
    fixation_position: PRMS.fixPos,
    stimulus: jsPsych.timelineVariable('probe'),
    stimulus_type: jsPsych.timelineVariable('probe_type'),
    stimulus_position: PRMS.stimPos,
    stimulus_colour: jsPsych.timelineVariable('probe_colour'),
    stimulus_font: PRMS.stimFont,
    start_box: PRMS.startBox,
    left_box: PRMS.leftBox,
    right_box: PRMS.rightBox,
    left_box_colour: 'gray',
    right_box_colour: 'gray',
    left_image: jsPsych.timelineVariable('left'),
    right_image: jsPsych.timelineVariable('right'),
    left_image_anchor: PRMS.leftImageAnchor,
    right_image_anchor: PRMS.rightImageAnchor,
    keep_fixation: PRMS.keepFixation,
    draw_start_box: PRMS.drawStartBox,
    draw_response_boxes: PRMS.drawResponseBoxes,
    draw_response_boxes_image: PRMS.drawResponseBoxesImage,
    box_linewidth: PRMS.boxLineWidth,
    require_mouse_press_start: PRMS.requireMousePressStart,
    require_mouse_press_finish: PRMS.requireMousePressFinish,
    data: {
        stim_type: 'affneg',
        probe: jsPsych.timelineVariable('probe'),
        probe_type: jsPsych.timelineVariable('probe_type'),
        left: jsPsych.timelineVariable('left'),
        right: jsPsych.timelineVariable('right'),
        correct_side: jsPsych.timelineVariable('correct_side'),
    },
    on_finish: function() {
        codeTrial();
    },
};

const TRIAL_FEEDBACK = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    trial_duration: null,
    translate_origin: false,
    func: drawFeedback,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.fbDur[dat.errorCode];
    },
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: true,
    on_start: function(trial) {
        let block_dvs = calculateBlockPerformance({
            filter_options: { stim_type: 'affneg', blockNum: PRMS.cBlk },
            rtColumn: 'end_rt',
            corrColumn: 'errorCode',
            corrValue: 0,
        });
        let text = blockFeedbackText(PRMS.cBlk, PRMS.nBlks, block_dvs.meanRt, block_dvs.errorRate, (language = 'de'));
        trial.stimulus = `<div style="font-size:${PRMS.fbTxtSizeBlock}px;">${text}</div>`;
    },
    on_finish: function() {
        PRMS.cTrl = 1;
        PRMS.cBlk += 1;
    },
};

const WAIT = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: false,
    trial_duration: PRMS.waitDur,
};

const ITI = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: '',
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const TRIAL_TIMELINE = {
    timeline: [TRIAL_STIMULUS, TRIAL_FEEDBACK, ITI],
    randomize_order: true,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/version${version}/${EXP_NAME}_${vpNum}`;
    // saveData('/Common/write_data_json.php', data_fn, { stim_type: 'affneg' }, 'json');
    saveDataLocal(data_fn, { stim_type: 'affneg' }, 'json');
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

    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(TOY_IMAGES);
    exp.push(ANIMAL_IMAGES);
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoFormClinic('/Common7+/vpInfoFormClinic_de.html'));
    exp.push(WELCOME_INSTRUCTIONS);
    exp.push(WAIT);
    exp.push(MOUSE_INSTRUCTIONS);
    exp.push(WAIT);

    let blk_type;
    if (version === 1) {
        blk_type = repeatArray(['Language'], PRMS.nBlks / 2).concat(repeatArray(['Symbolic'], PRMS.nBlks / 2));
    } else if (version === 2) {
        blk_type = repeatArray(['Symbolic'], PRMS.nBlks / 2).concat(repeatArray(['Language'], PRMS.nBlks / 2));
    }

    for (let blk = 0; blk < PRMS.nBlks; blk += 1) {
        let blk_timeline;
        if (blk_type[blk] === 'Language') {
            exp.push(TASK_INSTRUCTIONS_LANGUAGE);
            exp.push(WAIT);

            blk_timeline = { ...TRIAL_TIMELINE };
            blk_timeline.sample = {
                type: 'fixed-repetitions',
                size: 1,
            };
            let n = [0, PRMS.nBlks / 2].includes(blk) ? PRMS.nTrlsP : PRMS.nTrlsE;
            blk_timeline.timeline_variables = stimuli_factory(TOY_IMAGES, ANIMAL_IMAGES, 'Language', n);
        } else if (blk_type[blk] === 'Symbolic') {
            exp.push(TASK_INSTRUCTIONS_SYMBOLIC);
            exp.push(WAIT);

            blk_timeline = { ...TRIAL_TIMELINE };
            blk_timeline.sample = {
                type: 'fixed-repetitions',
                size: 1,
            };
            let n = [0, PRMS.nBlks / 2].includes(blk) ? PRMS.nTrlsP : PRMS.nTrlsE;
            blk_timeline.timeline_variables = stimuli_factory(TOY_IMAGES, ANIMAL_IMAGES, 'Symbolic', n);
        }
        exp.push(blk_timeline); // trials within a block
        exp.push(BLOCK_FEEDBACK); // show previous block performance
        exp.push(WAIT);
    }

    exp.push(SAVE_DATA);

    // debrief
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
