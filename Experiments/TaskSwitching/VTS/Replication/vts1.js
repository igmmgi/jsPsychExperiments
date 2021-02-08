// Online version of a voluntary self-organised multitasking experiment
// Starting Point: Mittelstädt, Schaffernak, Miller, & Kiesel (2020). Balancing
// cognitive and environmental constraints when deciding to switch tasks:
// Exploring self-reported task-selection strategies in self-organised
// multitasking. QJEP, 1-12.
//
// Method Section
// Stimuli:
//  Presented on black background
//  Number task (odd vs. even) were the digits 2-9
//  Letter task (vowel vs. consonant) were the letters A,E,G,I,K,M,R, and U (uppercase)
//  Presented one above the other (number vs. letter constant within, counter-balanced across)
//
// Responses:
//  Left/right index finger responses with the "y", "x", ",", "." keys (NB. changed to "A", "S", "K", and "L")
//  Task to hand mapping counter-balanced across participants
//  Finger response mapping randomly selected for each participants
//
// Block Structure:
// 15 blocks in total (1st block = practice)
// First 4 blocks (no explicit instructions regarding the switch SOA manipulation)
// 2 blocks (potential repetition stimulus delayed by 50 ms * number of repeats)
// 2 blocks (potential repetition stimulus delayed by constant 50 ms)
// Above block order counder-balanced across participants
// Subsequent blocks (Participants informed about the manipulation)
// Had to perform 50 trials of each task with the potential repeat stimulus being
// delayed by 50 ms * number of repeats. Following 50 tasks of the same type, the
// stimulus was replaced by a placeholder (#) and key-presses for this task were no
// longer recognized
// Self-paced breaks between blocks with total duration + number of errors displayed
// If more than 10 errors, an additional screen was displayed for 60 s indicating the
// response mapping
//
// Trial Feedback:
// Correct trials = low tone + black RSI screen for 150 ms
// Incorrect trials = high tone + black RSI screen for 650 ms

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [1280, 720];
const canvas_border = '5px solid black';

const check_screen = {
    type: 'check-screen-resolution',
    width: canvas_size[0],
    height: canvas_size[1],
    timing_post_trial: 0,
    on_finish: function () {
        reload_if_not_fullscreen();
    },
};

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const pcInfo = getComputerInfo();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrls: 10, // number of trials within a block
    nBlks: 15, // number of blocks
    fixDur: 500, // fixation cross duration
    fbDur: [150, 650], // feedback duration for correct and incorrect trials, respectively
    fbText: ['Correct', 'Error'], // feedback text
    waitDur: 1000,
    iti: 500, // inter-trial-interval
    stimFont: '50px Arial',
    stimPos: 40,
    soaStep: 50,
    fbTxt: ['Richtig', 'Falsch'],
    fbFont: '28px Arial',
    numbers: [2, 3, 4, 5, 6, 7, 8, 9],
    numbersEven: [2, 4, 6, 8],
    numbersOdd: [3, 5, 7, 9],
    letters: ['A', 'E', 'G', 'I', 'K', 'M', 'R', 'U'],
    lettersVowel: ['A', 'E', 'I', 'U'],
    lettersConsonant: ['G', 'K', 'M', 'R'],
    numberLocation: null,
    letterLocation: null,
    contKey: ['space'],
    respKeysNames: ['A', 'S', 'K', 'L'],
    respKeysNamesNumber: null,
    respKeysNamesLetter: null,
    respKeysNumbers: [
        jsPsych.pluginAPI.convertKeyCharacterToKeyCode('A'),
        jsPsych.pluginAPI.convertKeyCharacterToKeyCode('S'),
        jsPsych.pluginAPI.convertKeyCharacterToKeyCode('K'),
        jsPsych.pluginAPI.convertKeyCharacterToKeyCode('L'),
    ],
};

const vts_data = {
    cTrl: 1,
    cBlk: 1,
    nLetter: 0,
    nNumber: 0,
    previousTask: 'na',
    soa: 0,
    delay: null
};

const nVersion = getVersionNumber(nFiles, 8);
jsPsych.data.addProperties({ version: nVersion });
let handMapping, handMappingInstructions;
let fingerMapping;
if ([1, 2, 3, 4].includes(nVersion)) {
    handMapping = ['number', 'letter'];
    handMappingInstructions = ['odd vs. even', 'vowel vs. consonant'];
    prms.respKeysNamesNumber = [prms.respKeysNames[0], prms.respKeysNames[1]];
    prms.respKeysNamesLetter = [prms.respKeysNames[2], prms.respKeysNames[3]];
    fingerMapping = shuffle(['odd', 'even']).concat(shuffle(['vowel', 'consonant']));
} else {
    handMapping = ['letter', 'number'];
    handMappingInstructions = ['vowel/consonant', 'odd/even'];
    prms.respKeysNamesLetter = [prms.respKeysNames[0], prms.respKeysNames[1]];
    prms.respKeysNamesNumber = [prms.respKeysNames[2], prms.respKeysNames[3]];
    fingerMapping = shuffle(['vowel', 'consonant']).concat(shuffle(['odd', 'even']));
}

let respText = generate_formatted_html({
    text: `Left hand = ${handMappingInstructions[0]} &ensp;&ensp;&ensp; Right hand = ${handMappingInstructions[1]}<br><br>
    ${prms.respKeysNames[0]} = ${fingerMapping[0]} / ${prms.respKeysNames[1]} = ${fingerMapping[1]} &ensp;&ensp;&ensp; 
    ${prms.respKeysNames[2]} = ${fingerMapping[2]} / ${prms.respKeysNames[3]} = ${fingerMapping[3]}`,
});

if ([1, 2, 5, 6].includes(nVersion)) {
    prms.numberLocation = 'top';
    prms.letterLocation = 'bottom';
} else {
    prms.numberLocation = 'bottom';
    prms.letterLocation = 'top';
}
// console.log(prms);

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

const task_instructions1 = {
    type: 'html-keyboard-response',
    stimulus:
    generate_formatted_html({
        text: `Aufgabe: <br><br>`,
        align: 'left',
        fontsize: 26,
        lineheight: 1.5,
    }) + respText,
    choices: prms.contKey,
    post_trial_gap: prms.waitDur,
};

function drawStimulus(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = prms.stimFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // draw square
    ctx.fillStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(-50, -75, 100, 150);
    ctx.stroke();

    // letter task
    if (args.draw_letter === 1) {
        if (prms.letterLocation === 'top') {
            ctx.fillText(args.letter, 0, prms.stimPos);
        } else {
            ctx.fillText(args.letter, 0, -prms.stimPos);
        }
    }

    // number task
    if (args.draw_number === 1) {
        if (prms.numberLocation === 'top') {
            ctx.fillText(args.number, 0, prms.stimPos);
        } else {
            ctx.fillText(args.number, 0, -prms.stimPos);
        }
    }
}

function codeTrial() {
    'use strict';

    let dat = jsPsych.data.get().last(1).values()[0];

    // Which hand/task did they respond with/to?
    let respHand =
        (prms.respKeysNumbers[0] === dat.key_press) | (prms.respKeysNumbers[1] === dat.key_press) ? 'left' : 'right';
    let respTask = respHand === 'left' ? handMapping[0] : handMapping[1];

    // Was it a repeat or repetition of task?
    let transition = 'na';
    if (vts_data.previousTask !== 'na') {
        transition = respTask === vts_data.previousTask ? 'repeat' : 'switch';
    }

    // Was the response correct?
    // TO DO: simplify following!
    let error = 1;
    if (respTask === 'letter') {
        if (respHand === 'left') {
            if (prms.lettersVowel.includes(dat.letter)) {
                if (
                    (fingerMapping[0] === 'vowel' && dat.key_press === prms.respKeysNumbers[0]) |
                    (fingerMapping[1] === 'vowel' && dat.key_press === prms.respKeysNumbers[1])
                ) {
                    error = 0;
                }
            } else if (prms.lettersConsonant.includes(dat.letter)) {
                if (
                    (fingerMapping[0] === 'consonant' && dat.key_press === prms.respKeysNumbers[0]) |
                    (fingerMapping[1] === 'consonant' && dat.key_press === prms.respKeysNumbers[1])
                ) {
                    error = 0;
                }
            }
        } else if (respHand === 'right') {
            if (prms.lettersVowel.includes(dat.letter)) {
                if (
                    (fingerMapping[2] === 'vowel' && dat.key_press === prms.respKeysNumbers[2]) |
                    (fingerMapping[3] === 'vowel' && dat.key_press === prms.respKeysNumbers[3])
                ) {
                    error = 0;
                }
            } else if (prms.lettersConsonant.includes(dat.letter)) {
                if (
                    (fingerMapping[2] === 'consonant' && dat.key_press === prms.respKeysNumbers[2]) |
                    (fingerMapping[3] === 'consonant' && dat.key_press === prms.respKeysNumbers[3])
                ) {
                    error = 0;
                }
            }
        }
    } else if (respTask === 'number') {
        if (respHand === 'left') {
            if (prms.numbersOdd.includes(dat.number)) {
                if (
                    (fingerMapping[0] === 'odd' && dat.key_press === prms.respKeysNumbers[0]) |
                    (fingerMapping[1] === 'odd' && dat.key_press === prms.respKeysNumbers[1])
                ) {
                    error = 0;
                }
            } else if (prms.numbersEven.includes(dat.number)) {
                if (
                    (fingerMapping[0] === 'even' && dat.key_press === prms.respKeysNumbers[0]) |
                    (fingerMapping[1] === 'even' && dat.key_press === prms.respKeysNumbers[1])
                ) {
                    error = 0;
                }
            }
        } else if (respHand === 'right') {
            if (prms.numbersOdd.includes(dat.number)) {
                if (
                    (fingerMapping[2] === 'odd' && dat.key_press === prms.respKeysNumbers[2]) |
                    (fingerMapping[3] === 'odd' && dat.key_press === prms.respKeysNumbers[3])
                ) {
                    error = 0;
                }
            } else if (prms.numbersEven.includes(dat.number)) {
                if (
                    (fingerMapping[2] === 'even' && dat.key_press === prms.respKeysNumbers[2]) |
                    (fingerMapping[3] === 'even' && dat.key_press === prms.respKeysNumbers[3])
                ) {
                    error = 0;
                }
            }
        }
    }

    // Calculate RT: NB if responding to the repeat stimulus, subtract SOA
    let rt = transition !== 'repetition' ? dat.rt : dat.rt - vts_data.soa;

    // console.log('Resp hand: ', respHand);
    // console.log('Resp task: ', respTask);
    // console.log('Transitiion: ', transition);
    // console.log('delay: ', vts_data.delay);
    // console.log('soa: ', vts_data.soa);
    // console.log('Transitiion: ', transition);
    // console.log('RT: ', rt);
    // console.log('Error: ', error);

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        blockNum: vts_data.cBlk,
        trialNum: vts_data.cTrl,
        respHand: respHand,
        respTask: respTask,
        transition: transition,
        delay: vts_data.delay,
        soa: vts_data.soa,
        rt: rt,
        error: error,
    });

    // Update vts_data for next trial
    vts_data.cTrl++;
    vts_data.nNumber = respTask === 'number' ? vts_data.nNumber + 1 : vts_data.nNumber;
    vts_data.nLetter = respTask === 'letter' ? vts_data.nLetter + 1 : vts_data.nLetter;
    vts_data.previousTask = respTask;
    vts_data.soa = transition === 'repeat' ? vts_data.soa + prms.soaStep : 0;

    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

const vts_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    response_ends_trial: true,
    choices: [],
    trial_duration: prms.tooSlow,
    func: [drawStimulus, drawStimulus],
    stimulus_onset: null,
    letter: null,
    number: null,
    func_args: null,
    data: {},
    on_start: function (trial) {
        'use strict';
        // Which letter/number to show
        trial.letter = vts_data.nLetter < (prms.nTrls / 2) ? prms.letters[getRandomInt(0, 4)] : '#';
        trial.number = vts_data.nNumber < (prms.nTrls / 2) ? prms.numbers[getRandomInt(0, 4)] : '#';

        // activate only response keys for available task
        if (trial.letter !== '#') {
            trial.choices = trial.choices.concat(prms.respKeysNamesLetter);
        }
        if (trial.number !== '#') {
            trial.choices = trial.choices.concat(prms.respKeysNamesNumber);
        }

        // SOA interval
        trial.stimulus_onset = (vts_data.cTrl === 1) ? [0, 0] : [0, vts_data.soa];

        // repeat vs. switch task
        let draw_number, draw_letter;
        if (vts_data.previousTask === 'na') {
            draw_number = [1, 1];
            draw_letter = [1, 1];
        } else if (vts_data.previousTask === 'number') {
            draw_number = [0, 1];
            draw_letter = [1, 1];
        } else if (vts_data.previousTask === 'letter') {
            draw_number = [1, 1];
            draw_letter = [0, 1];
        }

        trial.func_args = [
            { letter: trial.letter, number: trial.number, draw_number: draw_number[0], draw_letter: draw_letter[0] },
            { letter: trial.letter, number: trial.number, draw_number: draw_number[1], draw_letter: draw_letter[1] },
        ];

        trial.data = { stim: 'vts', letter: trial.letter, number: trial.number };
    },
    on_finish: function () {
        codeTrial();
    },
};

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    response_ends_trial: false,
    func: drawTrialFeedback,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.error];
    },
};

function drawTrialFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    // draw square
    ctx.fillStyle = 'black';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(-50, -75, 100, 150);
    ctx.stroke();

    // draw text
    ctx.font = prms.fbFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.error], 0, 0);
}


function blockFeedbackTxt(filter_options) {
    'use strict';
    let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: vts_data.cBlk });
    let totalTime = Math.round(dat.select('rt').sum() / 1000);
    let nError = dat.select('error').values.filter(function (x) {
        return x === 1;
    }).length;
    let blockFbTxt = generate_formatted_html({text: `Block ${vts_data.cBlk} of ${prms.nBlks}<br> 
  Total Time: ${totalTime} seconds<br>
  Number of Errors: ${nError}<br><br>
  Drücke eine beliebige Taste, um fortzufahren!`
    }
    )

    // reset vts_data
    vts_data.cTrl = 1;
    vts_data.cBlk += 1;
    vts_data.nNumber = 0;
    vts_data.nLetter = 0;
    vts_data.previousTask = 'na';
    vts_data.soa = 0;
    vts_data.delay =  null;

    return blockFbTxt;
}

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    stimulus: '',
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    on_start: function (trial) {
        trial.stimulus = blockFeedbackTxt({ stim: 'vts' });
    },
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////

// For VP Stunden
const randomString = generateRandomStringWithExpName('mc1', 16);

const alphaNum = {
    type: 'html-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus: generate_formatted_html({
        text:
        `Vielen Dank für Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
        zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>hiwipibio@gmail.com<br> Code: ` +
        randomString +
        `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
        fontsize: 32,
        lineheight: 1.5,
        align: 'left',
    }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
    type: 'call-function',
    func: function () {
        let data_filename = dirName + 'data/' + expName + '_' + vpNum;
        saveData('/Common/write_data.php', data_filename, { stim_type: 'vts' });
    },
    timing_post_trial: 1000,
};

const save_interaction_data = {
    type: 'call-function',
    func: function () {
        let data_filename = dirName + 'interaction/' + expName + '_interaction_data_' + vpNum;
        saveInteractionData('/Common/write_data.php', data_filename);
    },
    timing_post_trial: 200,
};

const save_code = {
    type: 'call-function',
    func: function () {
        let code_filename = dirName + 'code/' + expName;
        saveRandomCode('/Common/write_code.php', code_filename, randomString);
    },
    timing_post_trial: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    'use strict';

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(check_screen);
    exp.push(welcome_de);
    exp.push(resize_de);
    // exp.push(vpInfoForm_de);
    exp.push(task_instructions1);

    for (let blk = 0; blk < prms.nBlks; blk++) {
        // type of delay for potential task repetition stimulus
        if ((nVersion % 2 === 1) && (blk < 4)) {
            vts_data.delay = (blk < 2) ? "constant" : "increasing";
        } else if ((nVersion % 2 === 0) && (blk < 4)) {
            vts_data.delay = (blk < 2) ? "increasing" : "constant";
        } else {
            vts_data.delay = "increasing";
        }
        // trials within block
        for (let trl = 0; trl < prms.nTrls; trl++) {
            exp.push(vts_stimulus);
            exp.push(trial_feedback);
        }
        // between block feedback
        exp.push(block_feedback)
    }

    // // save data
    // exp.push(save_data);
    // exp.push(save_interaction_data);
    // exp.push(save_code);

    // // debrief
    // exp.push(alphaNum);
    // exp.push(debrief_de);
    // exp.push(fullscreen_off);

    return exp;
}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    on_interaction_data_update: function (data) {
        update_user_interaction_data(data);
    },
});
