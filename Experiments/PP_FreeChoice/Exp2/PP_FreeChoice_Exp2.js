// PP_FreeChoice_Exp2

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
    on_finish: function() {
        reload_if_not_fullscreen();
    },
};

// 2 counter-balanced order versions
const version = Number(jsPsych.data.urlVariables().version);
jsPsych.data.addProperties({ version: version });

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
    nTrls: 96, // number of trials within a block
    nBlks: 8, // number of blocks
    fixDur: 500,
    waitDur: 1000,
    tooSlow: 4000,
    iti: [500, 500],
    stimFont: '50px Arial',
    stimPos: [-30, 30],
    numberNoGo: [4, 5, 6],
    numbersLeft: [1, 2, 3],
    numbersRight: [7, 8, 9],
    letterNoGo: ['L', 'M', 'N'],
    lettersLeft: ['A', 'B', 'C'],
    lettersRight: ['X', 'Y', 'Z'],
    soas: [50, 300, Infinity],
    respKeys: ['q', 'w', 'o', 'p'],
    taskMapping: version === 1 ? ['number', 'letter'] : ['letter', 'number'],
    taskInstructions:
        version === 1 ? ['1, 2, 3', '7, 8, 9', 'A, B, C', 'X, Y, Z'] : ['A, B, C', 'X, Y, Z', '1, 2, 3', '7, 8, 9'],

    // Fixation Cross
    fix_duration: 500,
    fix_size: 15,
    fix_linewidth: 4,

    // Feedback
    fbFont: '28px Arial',
    fbText: ['Falsch!', '', 'Zu langsam!'],
    fbDur: [3000, 0, 3000],
    fbDurPrac: [4000, 0, 4000],

    // trial/block count
    cBlk: 1,
    cTrl: 1,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br>
    Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit
    abbrechen. Bitte stelle sicher, dass du dich in einer ruhigen Umgebung
    befindest und genügend Zeit hast, um das Experiment durchzuführen. Wir
    bitten dich für die Dauer des Experiments (ca. 35 Minuten) konzentriert zu
    arbeiten.<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
        fontsize: 26,
        align: 'left',
        lineheight: 1.5,
        bold: true,
    }),
};

let task_instructions2;
if (version === 1) {
    task_instructions2 = {
        type: 'html-keyboard-response-canvas',
        canvas_colour: canvas_colour,
        canvas_size: canvas_size,
        canvas_border: canvas_border,
        stimulus:
            "<h2 style='text-align: center;'>Experiment:</h2>" +
            "<h3 style='text-align: left;'>In diesem Experiment gibt es zwei Aufgaben. Jede Aufgabe wird mit einer Hand bearbeitet.</h3><br>" +
            "<h3 style='text-align: left;'>Buchstaben Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
            "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +
            "<h3 style='text-align: left;'>Zahlen Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
            "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +
            "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
    };
} else if (version === 2) {
    task_instructions2 = {
        type: 'html-keyboard-response-canvas',
        canvas_colour: canvas_colour,
        canvas_size: canvas_size,
        canvas_border: canvas_border,
        stimulus:
            "<h2 style='text-align: center;'>Experiment:</h2>" +
            "<h3 style='text-align: left;'>In diesem Experiment gibt es zwei Aufgaben.</h3>" +
            "<h3 style='text-align: left;'>Jede Aufgabe wird mit einer Hand bearbeitet. </h3><br>" +
            "<h3 style='text-align: left;'>Buchstaben Aufgabe = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
            "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +
            "<h3 style='text-align: left;'>Zahlen Aufgabe = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
            "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +
            "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
    };
}

const task_instructions3 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
        "<h3 style='text-align: left;'>Für die Buchstabenaufgabe musst du entscheiden ob der Buchstabe vor L oder nach N im Alphabet kommt.</h3>" +
        "<h3 style='text-align: left;'>Für die Zahlenaufgabe musst du entscheiden ob die Zahl kleiner 4 oder grösser 6 ist.</h3>" +
        "<h3 style='text-align: center;'>Es gilt:</h3>" +
        "<h2 style='text-align: left;'>" +
        '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[0] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[1] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[2] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[3] +
        '</h2>' +
        "<h3 style='text-align: center;'>" +
        '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
        '</h3><br>' +
        "<h3 style='text-align: left;'>Du darfst frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest wenn beide</h3>" +
        "<h3 style='text-align: left;'>Aufgaben (Buchstabe und Zahl) eine Antwort erfordern.</h3>" +
        "<h3 style='text-align: left;'>Wenn der Buchstabe L, M oder N ist, dann musst du die Zahl bearbeiten.</h3>" +
        "<h3 style='text-align: left;'>Wenn die Zahl 4, 5, 6 ist, dann musst du den Buchstaben bearbeiten.</h3>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions4 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
        "<h3 style='text-align: left;'>In jedem Durchgang muss nur eine Aufgabe bearbeitet werden.</h3><br>" +
        "<h3 style='text-align: left;'>Du darfst frei entscheiden welche der beiden Aufgaben du bearbeiten möchtest, wenn beide</h3>" +
        "<h3 style='text-align: left;'>Aufgaben (Buchstabe und Zahl) eine Antwort erfordern.</h3><br>" +
        "<h3 style='text-align: left;'>Wenn jedoch nur ein Aufgabe eine Antwort erfordert,</h3>" +
        "<h3 style='text-align: left;'>dann musst du diese Aufgabe bearbeiten.</h3><br>" +
        "<h3 style='text-align: left;'>Die ersten zwei Blöcken hast du Gelegenheit zu üben.</h3><br>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

function blockStartText() {
    'use strict';
    let blockStartTxt =
        '<H1>Block: ' +
        prms.cBlk +
        ' von ' +
        prms.nBlks +
        '</H1><br>' +
        "<h3 style='text-align: left;'>Entscheide selbst welche Aufgabe du bearbeiten willst, wenn beide Aufgaben eine Antwort erfordern.</h3>" +
        "<h3 style='text-align: center;'>Es gilt:</h3>" +
        "<h2 style='text-align: left;'>" +
        '&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[0] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[1] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[2] +
        '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' +
        prms.taskInstructions[3] +
        '</h2>' +
        "<h3 style='text-align: center;'>" +
        '("Q-Taste") &emsp;&emsp;&emsp;&emsp; ("W-Taste") &emsp;&emsp;&emsp;&emsp;&emsp; ("O-Taste") &emsp;&emsp;&emsp;&emsp; ("P-Taste")' +
        '</h3><br>' +
        "<h3 style='text-align: left;'>Wenn der Buchstabe L, M, N ist oder die Zahl 4, 5, 6 ist, dann erfordert</h3>" +
        "<h3 style='text-align: left;'>die Aufgabe keine Antwort!</h3><br>" +
        "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>";
    return blockStartTxt;
}

const block_start = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: '',
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockStartText();
    },
};

function blockEndText() {
    'use strict';
    let blockEndTxt =
        '<H1>Pause</H1><br>' +
        '<H3>Bitte versuche weiterhin so schnell und so genau wie möglich zu sein! </H3><br>' +
        '<H2>Drücke eine beliebige Taste um fortzufahren!</H2>';
    prms.cBlk += 1;
    return blockEndTxt;
}

const block_end = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: '',
    response_ends_trial: true,
    on_start: function(trial) {
        prms.cTrl = 1;
        trial.stimulus = blockEndText();
    },
};

function draw_fixation_cross() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fix_linewidth;
    ctx.moveTo(-prms.fix_size, 0);
    ctx.lineTo(prms.fix_size, 0);
    ctx.stroke();
    ctx.moveTo(0, -prms.fix_size);
    ctx.lineTo(0, prms.fix_size);
    ctx.stroke();
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: null,
    translate_origin: true,
    response_ends_trial: false,
    func: draw_fixation_cross,
    on_start: function(trial) {
        trial.trial_duration = prms.fix_duration + getRandomInt(prms.iti[0], prms.iti[1]);
    },
};

function drawStimulus(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = prms.stimFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    // Stimulus 1
    ctx.fillText(args.S1, 0, args.S1_position);

    // Stimulus 2
    ctx.fillText(args.S2, 0, args.S2_position);
}

const stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    response_ends_trial: true,
    choices: prms.respKeys,
    trial_duration: null,
    stimulus_onset: [0, jsPsych.timelineVariable('SOA')],
    func: [drawStimulus, drawStimulus],
    func_args: null,
    data: {
        stim_type: 'ppfc2',
        TrialType: jsPsych.timelineVariable('TrialType'),
        FreeForced: jsPsych.timelineVariable('FreeForced'),
        Forced: jsPsych.timelineVariable('Forced'),
        StimOrder: jsPsych.timelineVariable('StimOrder'),
        S1: jsPsych.timelineVariable('S1'),
        S2: jsPsych.timelineVariable('S2'),
        GoNogoLetter: jsPsych.timelineVariable('LetterType'),
        GoNogoNumber: jsPsych.timelineVariable('NumberType'),
        SOA: jsPsych.timelineVariable('SOA'),
    },
    on_start: function(trial) {
        // define trial duration
        trial.trial_duration = prms.tooSlow;

        if (trial.data.SOA !== Infinity) {
            trial.trial_duration += trial.data.SOA;
        }

        // deal with potential stimulus repetitions
        let previous_letter;
        let previous_number;
        if (prms.cTrl > 1) {
            let dat = jsPsych.data.get().last(3).values()[0];
            if (dat.S1 === 'Number') {
                previous_number = dat.s1;
                previous_letter = dat.s2;
            } else if (dat.S1 === 'Letter') {
                previous_number = dat.s2;
                previous_letter = dat.s1;
            }
        }

        // Stimulus 1
        let s1;
        let corrKey1;
        // prettier-ignore
        if (trial.data.S1 === 'Letter') {
            if (trial.data.GoNogoLetter === 'Go') {
                if (Math.random() < 0.5) {
                    s1 = shuffle(prms.lettersLeft.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
                } else {
                    s1 = shuffle(prms.lettersRight.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
                }
            } else if (trial.data.GoNogoLetter === 'NoGo') {
                s1 = shuffle(prms.letterNoGo.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
            }
            // Assign correct key for S1
            if (prms.letterNoGo.includes(s1)) {
                corrKey1 = null;
            } else if (prms.taskMapping[0] === 'letter') {
                corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
            } else if (prms.taskMapping[1] === 'letter') {
                corrKey1 = prms.lettersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
            }
        } else if (trial.data.S1 === 'Number') {
            if (trial.data.GoNogoNumber === 'Go') {
                if (Math.random() < 0.5) {
                    s1 = shuffle(prms.numbersLeft.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
                } else {
                    s1 = shuffle(prms.numbersRight.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
                }
            } else if (trial.data.GoNogoNumber === 'NoGo') {
                s1 = shuffle(prms.numberNoGo.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
            }
            if (prms.numberNoGo.includes(s1)) {
                corrKey1 = null;
            } else if (prms.taskMapping[0] === 'number') {
                corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[0] : prms.respKeys[1];
            } else if (prms.taskMapping[1] === 'number') {
                corrKey1 = prms.numbersLeft.includes(s1) ? prms.respKeys[2] : prms.respKeys[3];
            }
        }

        trial.data.s1 = s1;

        // Stimulus 2
        // prettier-ignore
        if (trial.data.S2 === 'Letter') {
            if (trial.data.GoNogoLetter === 'Go') {
                if (Math.random() < 0.5) {
                    s2 = shuffle(prms.lettersLeft.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
                } else {
                    s2 = shuffle(prms.lettersRight.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
                }
            } else if (trial.data.GoNogoLetter === 'NoGo') {
                s2 = shuffle(prms.letterNoGo.filter(function(x) { return [previous_letter].indexOf(x) < 0; }),)[0];
            }
            // Assign correct key for S1
            if (prms.letterNoGo.includes(s2)) {
                corrKey2 = null;
            } else if (prms.taskMapping[0] === 'letter') {
                corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
            } else if (prms.taskMapping[1] === 'letter') {
                corrKey2 = prms.lettersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
            }
        } else if (trial.data.S2 === 'Number') {
            if (trial.data.GoNogoNumber === 'Go') {
                if (Math.random() < 0.5) {
                    s2 = shuffle(prms.numbersLeft.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
                } else {
                    s2 = shuffle(prms.numbersRight.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
                }
            } else if (trial.data.GoNogoNumber === 'NoGo') {
                s2 = shuffle(prms.numberNoGo.filter(function(x) { return [previous_number].indexOf(x) < 0; }),)[0];
            }
            if (prms.numberNoGo.includes(s2)) {
                corrKey2 = null;
            } else if (prms.taskMapping[0] === 'number') {
                corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[0] : prms.respKeys[1];
            } else if (prms.taskMapping[1] === 'number') {
                corrKey2 = prms.numbersLeft.includes(s2) ? prms.respKeys[2] : prms.respKeys[3];
            }
        }

        // deal with s2 = Infinity
        if (trial.data.SOA === Infinity) {
            s2 = '';
        }
        trial.data.s2 = s2;

        trial.data.corrKey1 = corrKey1;
        trial.data.corrKey2 = corrKey2;

        let pos;
        if (version === 1) {
            if (trial.data.S1 === 'Number') {
                pos = [prms.stimPos[0], prms.stimPos[1]];
            } else {
                pos = [prms.stimPos[1], prms.stimPos[0]];
            }
        } else if (version === 2) {
            if (trial.data.S1 === 'Number') {
                pos = [prms.stimPos[1], prms.stimPos[0]];
            } else {
                pos = [prms.stimPos[0], prms.stimPos[1]];
            }
        }

        // shuffle function changes order of stimPos as well!
        trial.func_args = [
            { S1: s1, S1_position: pos[0], S2: '', S2_position: pos[1] },
            { S1: s1, S1_position: pos[0], S2: s2, S2_position: pos[1] },
        ];
        trial.data.S1_position = pos[0];
        trial.data.S2_position = pos[1];
    },
    on_finish: function() {
        codeTrial();
    },
};

function drawFeedback() {
    'use strict';

    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];

    ctx.font = prms.stimFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'red';

    // Feedback Wrong!
    ctx.fillText(prms.fbText[dat.corrCode], 0, 0);

    if (dat.corrCode === 0 || dat.corrCode === 2) {
        ctx.font = 'bold 20px monospace';
        ctx.fillText(prms.taskInstructions[0], -350, 80);
        ctx.fillText(prms.taskInstructions[1], -150, 80);
        ctx.font = '20px monospace';
        ctx.fillText('("Q-Taste")', -370, 120);
        ctx.fillText('("W-Taste")', -130, 120);

        ctx.font = 'bold 20px monospace';
        ctx.fillText(prms.taskInstructions[2], 150, 80);
        ctx.fillText(prms.taskInstructions[3], 350, 80);
        ctx.font = '20px monospace';
        ctx.fillText('("O-Taste")', 130, 120);
        ctx.fillText('("P-Taste")', 370, 120);

        ctx.textAlign = 'center';
        ctx.fillText('Wenn der Buchstabe L, M, N ist oder die Zahl 4, 5, 6', 0, 220);
        ctx.fillText('ist, dann erfordert die Aufgabe keine Antwort!', 0, 250);
    }
}

function codeTrial() {
    'use strict';

    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;

    if ([dat.corrKey1, dat.corrKey2].includes(dat.key_press) & (dat.rt !== null)) {
        corrCode = 1;
    }

    // Too Slow!
    if (dat.rt === null) {
        corrCode = 2;
        dat.rt = prms.tooSlow;
    }

    // S1 vs S2 response?
    let responseTask;
    if (prms.taskMapping[0] === 'number') {
        responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Number' : 'Letter';
    } else if (prms.taskMapping[0] === 'letter') {
        responseTask = prms.respKeys.slice(0, 2).includes(dat.key_press) ? 'Letter' : 'Number';
    }

    // correct for SOA
    if ((responseTask !== dat.S1) & (dat.SOA !== Infinity)) {
        dat.rt = dat.rt - dat.SOA;
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        responseTask: responseTask,
        rt: dat.rt,
        corrCode: corrCode,
        blockNum: prms.cBlk,
        trialNum: prms.cTrl,
    });

    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

const feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.fbDur[1],
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        if (dat.blockNum === 1) {
            trial.trial_duration = prms.fbDurPrac[dat.corrCode];
        } else {
            trial.trial_duration = prms.fbDur[dat.corrCode];
        }
    },
};

const trial_table = [
    { "TrialType": 1, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 1, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 2, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[1] },
    { "TrialType": 2, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[1] },
    { "TrialType": 3, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 3, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 4, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[1] },
    { "TrialType": 4, "FreeForced": "Free", "Forced": "NA", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "Go", "SOA": prms.soas[1] },
    { "TrialType": 5, "FreeForced": "Forced", "Forced": "Letter", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "NoGo", "SOA": prms.soas[0] },
    { "TrialType": 6, "FreeForced": "Forced", "Forced": "Letter", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "Go", "NumberType": "NoGo", "SOA": prms.soas[1] },
    { "TrialType": 7, "FreeForced": "Forced", "Forced": "Number", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "NoGo", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 8, "FreeForced": "Forced", "Forced": "Number", "StimOrder": "Letter-Number", "S1": "Letter", "S2": "Number", "LetterType": "NoGo", "NumberType": "Go", "SOA": prms.soas[1] },
    { "TrialType": 9, "FreeForced": "Forced", "Forced": "Letter", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "NoGo", "SOA": prms.soas[0] },
    { "TrialType": 10, "FreeForced": "Forced", "Forced": "Letter", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "Go", "NumberType": "NoGo", "SOA": prms.soas[1] },
    { "TrialType": 11, "FreeForced": "Forced", "Forced": "Number", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "NoGo", "NumberType": "Go", "SOA": prms.soas[0] },
    { "TrialType": 12, "FreeForced": "Forced", "Forced": "Number", "StimOrder": "Number-Letter", "S1": "Number", "S2": "Letter", "LetterType": "NoGo", "NumberType": "Go", "SOA": prms.soas[1] },
];


const trial_timeline = {
    timeline: [fixation_cross, stimulus, feedback],
    timeline_variables: trial_table,
    sample: {
        type: 'fixed-repetitions',
        size: prms.nTrls / trial_table.length,
    },
};

////////////////////////////////////////////////////////////////////////
//                              De-brief                              //
////////////////////////////////////////////////////////////////////////
// For VP Stunden
const randomString = generateRandomStringWithExpName('ppfc2', 16);

const alpha_num = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
        generate_formatted_html({
            text: `Wenn du eine Versuchspersonenstunde benötigst, kopiere den folgenden
      zufällig generierten Code und sende diesen zusammen mit deiner Matrikelnummer
      und deiner Universität (Tübingen) per Email an:<br><br>
	hiwipibio@gmail.com<br>`,
            fontsize: 26,
            align: 'left',
        }) +
        generate_formatted_html({
            text: `Code: ${randomString}<br>`,
            fontsize: 26,
            align: 'left',
        }) +
        generate_formatted_html({
            text: `Drücke die Leertaste, um fortzufahren!`,
            fontsize: 26,
            align: 'left',
        }),
    choices: [' '],
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
    type: 'call-function',
    func: function() {
        let data_filename = dirName + 'data/version' + version + '/' + expName + '_' + vpNum;
        saveData('/Common/write_data.php', data_filename, { stim_type: 'ppfc2' });
    },
    timing_post_trial: 2000,
};

const save_interaction_data = {
    type: 'call-function',
    func: function() {
        let data_filename = dirName + 'interaction_data/' + expName + '_interaction_data_' + vpNum;
        saveInteractionData('/Common/write_data.php', data_filename);
    },
    timing_post_trial: 200,
};

const save_code = {
    type: 'call-function',
    func: function() {
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
    exp.push(vpInfoForm_de);
    exp.push(hideMouseCursor);

    exp.push(task_instructions1);
    exp.push(task_instructions2);
    exp.push(task_instructions3);
    exp.push(task_instructions4);
    exp.push(hideMouseCursor);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = { ...trial_timeline };
        blk_timeline.sample = {
            type: 'fixed-repetitions',
            size: blk === 0 ? prms.nTrls / 16 : prms.nTrls / 16,
        };
        exp.push(block_start);
        exp.push(blk_timeline); // trials within a block
        exp.push(block_end);
    }

    // save data
    exp.push(save_data);
    exp.push(save_interaction_data);
    exp.push(save_code);

    // debrief
    exp.push(showMouseCursor);
    exp.push(alpha_num);
    exp.push(debrief_de);
    exp.push(fullscreen_off);

    return exp;
}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    on_interaction_data_update: function(data) {
        update_user_interaction_data(data);
    },
});
