// DescriptionExperience
// PictureNegation:

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

const version = getVersionNumber(nFiles, 2);

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    fixDur: 500,
    fbDur: 750,
    responseFeedbackInterval: 300,
    iti: 500,
    cTrl: 1,    // count trials
    cBlk: 1,    // count blocks
    cPoints: 0, // count points
    fixWidth: 3,
    fixSize: 15,
    fbSize: '50px monospace',
    fbTxt: ['-----', '$$$$$'],
    respKeys: ['q', 'p', 27],
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
    "<h2 style='text-align:left;'>Liebe Teilnehmer/innen,</h2><br>" +
    "<h2 style='text-align:left;'>vielen Dank, dass Sie sich die Zeit zur</h2>" +
    "<h2 style='text-align:left;'>Teilnahme an unserer Arbeit nehmen.</h2><br>" +
    "<h2 style='text-align:left;'>Bitte nehmen Sie nur teil, wenn Sie mindestens 18 Jahre alt sind.</h2>" + 
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
    "<h3 style='text-align:left;'> In this experiment, you need to try to collect as many Points as possible.</h3><br>" +
    "<h3 style='text-align:left;'> You will see in each trial, one Picture on the left and one Picture on .</h3>" +
    "<h3 style='text-align:left;'> the Right side. If you select the Picture with reward you will receive  </h3><br>" +
    "<h3 style='text-align:left;'> +1 point ('$$$$'), if you select the Picture without reward you will receive 0 Points ('----').</h3>" +
    "<h3 style='text-align:left;'> Make a choice in each trial by Pressing the corresponding key with your left </h3>" +
    "<h3 style='text-align:left;'> and right index finger: Left = Q-key Right = P-key </h3><br>" +
    "<h3 style='text-align:left;'> Drücken Sie eine beliebige Taste, um fortzufahren!</h3>",
};

const block_start = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
    "<h2 style='text-align:left;'>Block Start </h2><br>" +
    "<h2 style='text-align:left;'>Total Points Accumulated: " + prms.cPoints + "</h2><br>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const short_break = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
    "<h2 style='text-align:left;'>Break</h2><br>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};




////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function readImages(dir, n) {
    let images = [];
    for (let i = 1; i <= n; i++) {
        images.push(dir + i + '.png');
    }
    return loadImages(images);
}

const imagesDescription = readImages('DescriptionImages/D_',   4);
let imagesExperienceN = readImages('ExperienceImages/EN_', 116);
let imagesExperienceO = readImages('ExperienceImages/EO_', 165);

var tmp = shuffle(imagesExperienceN.concat(imagesExperienceO));
const imagesExperience = tmp.splice(0, 4);


////////////////////////////////////////////////////////////////////////
//                             Functions                              //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo(prms.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0, prms.fixSize);
    ctx.stroke();
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation,
};

function showPicture(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let numLeft = args.imageNumberLeft;
    let numRight = args.imageNumberRight;
    let imageTypeLeft = args.imageTypeLeft;
    let imageTypeRight = args.imageTypeRight;

    let imagesLeft;
    if (imageTypeLeft === 'Description') {
        imagesLeft = imagesDescription;
    } else if (imageTypeLeft === 'Experience') {
        imagesLeft = imagesExperience;
    }

    let imagesRight;
    if (imageTypeRight === 'Description') {
        imagesRight = imagesDescription;
    } else if (imageTypeRight === 'Experience') {
        imagesRight = imagesExperience;
    }

    ctx.drawImage(imagesLeft[numLeft], -imagesLeft[numLeft].width / 2 - 150, -imagesLeft[numLeft].height / 2);
    ctx.drawImage(imagesRight[numRight], -imagesRight[numRight].width / 2 + 150, -imagesRight[numRight].height / 2);

}


const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    trial_duration: prms.fbDur,
    response_ends_trial: false,
    func: drawFeedback,
};

function drawFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(2).values()[0];

    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.rewardCode], 0, 0);
    // ctx.font = '30px monospace'; 
    // let txt = "Total Points: " + prms.cPoints;
    // ctx.fillText(txt, 0, -75);
}

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function () {},
};


const response_feedback_interval = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.responseFeedbackInterval,
    response_ends_trial: false,
    func: function () {},
};

function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];
    let rewardCode;
    let pressed_key = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(dat.key_press);

    let response_side;
    if (pressed_key === prms.respKeys[0]) {
        response_side = "left";
    } else if (pressed_key === prms.respKeys[1]) {
        response_side = "right";
    }

    if (response_side === dat.rewardSide) {
        rewardCode = 1;
        prms.cPoints += 1;
    } else {
        rewardCode = 0;
    }

    let highProbSelected = (response_side === dat.highProbSide) ? true : false;

    let chosenImageType;
    if (response_side === "left") {
        chosenImageType = dat.imageTypeLeft;
    } else if (response_side === "right") {
        chosenImageType = dat.imageTypeRight;
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        response_side: response_side,
        rt: dat.rt,
        rewardCode: rewardCode,
        highProbSelected: highProbSelected,
        chosenImageType: chosenImageType, 
        blockNum: prms.cBlk,
        trialNum: prms.cTrl,
    });

    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }

}




const pic_stim = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    stimulus_onset: 0,
    response_ends_trial: true,
    choices: prms.respKeys,
    func: showPicture,
    func_args: [
        {
            imageTypeLeft: jsPsych.timelineVariable('imageTypeLeft'),
            imageTypeRight: jsPsych.timelineVariable('imageTypeRight'),
            imageNumberLeft: jsPsych.timelineVariable('imageNumberLeft'),
            imageNumberRight: jsPsych.timelineVariable('imageNumberRight'),
            rewardSide: jsPsych.timelineVariable('rewardSide'),
        },
    ],
    data: {
        stim: 'DescriptionExperience',
        imageTypeLeft: jsPsych.timelineVariable('imageTypeLeft'),
        imageTypeRight: jsPsych.timelineVariable('imageTypeRight'),
        imageNumber: jsPsych.timelineVariable('imageNumber'),
        rewardSide: jsPsych.timelineVariable('rewardSide'),
    },
    on_finish: function() {
        codeTrial();
    },
};

let learning_block_description = [

    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",  highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "right", highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",  highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "right", highProbSide: "left"},

];

let learning_block_experience = [

    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",  highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "right", highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",  highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "right", highProbSide: "left"},

];


let experimental_block = [

    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",  highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "right", highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",  highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "right", highProbSide: "left"},

    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",  highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 0, rewardSide: "right", highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right", highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",  highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "left",  highProbSide: "left"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 3, imageNumberRight: 1, rewardSide: "right", highProbSide: "left"},


    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 2, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 80, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "right",  highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 20, imageNumberLeft: 1, imageNumberRight: 3, rewardSide: "left",   highProbSide: "left"},


    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",   highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "right",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',   imageTypeRight: 'Description', imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 20, imageProbRight: 20, imageNumberLeft: 0, imageNumberRight: 1, rewardSide: "left",  highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description',  imageTypeRight: 'Experience',  imageProbLeft: 80, imageProbRight: 80, imageNumberLeft: 2, imageNumberRight: 3, rewardSide: "left",  highProbSide: "na"},


];

const trial_timeline_description = {
    timeline: [fixation_cross, pic_stim, response_feedback_interval, trial_feedback, iti],
    timeline_variables: learning_block_description,
    sample: {
        type: 'fixed-repetitions',
        size: 5,
    },
};

const trial_timeline_experience = {
    timeline: [fixation_cross, pic_stim, response_feedback_interval, trial_feedback, iti],
    timeline_variables: learning_block_experience,
    sample: {
        type: 'fixed-repetitions',
        size: 5,
    },
};


const trial_timeline_experiment = {
    timeline: [fixation_cross, pic_stim, response_feedback_interval, trial_feedback, iti],
    timeline_variables: experimental_block,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};


const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus:
    "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3>" +
    "<h2 style='text-align:left;'>Total Points Accumulated: " + prms.cPoints + "</h2><br>" +
    "<h3 style='text-align:left;'>Wenn Sie einen Gutschein gewinnen möchten, kopieren Sie den folgenden </h3>" +
    "<h3 style='text-align:left;'>zufällig generierten Code und senden Sie diesen per Email. </h3>" +
    '<h2>xxx.xxx@student.uni-tuebingen.de oder </h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
    function genExpSeq() {
        'use strict';

        let exp = [];

        exp.push(fullscreen_on);
        exp.push(welcome_de);
        exp.push(resize_de);

        // exp.push(vpInfoForm_de);
        exp.push(hideMouseCursor);
        exp.push(screenInfo);
        exp.push(task_instructions1);
        exp.push(task_instructions2);
        
        // first phase: learning block (description vs. experience)
        if (version === 1) {
            exp.push(block_start);
            exp.push(trial_timeline_description);
            exp.push(short_break);
            exp.push(block_start);
            exp.push(trial_timeline_experience);
        } else if (version === 2) {
            exp.push(block_start);
            exp.push(trial_timeline_experience);
            exp.push(short_break);
            exp.push(block_start);
            exp.push(trial_timeline_description);
        }

        // second phase: 2 experiment block of 200 trials
        exp.push(short_break);
        exp.push(block_start);
        exp.push(trial_timeline_experiment);
        
        exp.push(short_break);
        exp.push(block_start);
        exp.push(trial_timeline_experiment);

        exp.push(debrief_de);
        exp.push(showMouseCursor);
        exp.push(alphaNum);
        exp.push(fullscreen_off);

        return exp;
    }
const EXP = genExpSeq();

const data_filename = dirName + 'data/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width: canvas_size[0],
        min_height: canvas_size[1],
    },
    on_finish: function () {
        saveData('/Common/write_data.php', data_filename, { stim: 'DescriptionExperience' });
        saveRandomCode('/Common/write_code.php', code_filename, randomString);
    },
});
