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
    rfi: 300,   // response -> feedback interval
    iti: 500,
    cTrl: 1,    // count trials
    cBlk: 1,    // count blocks
    cPoints: 0, // count points
    fixWidth: 3,
    fixSize: 15,
    fbSize: '50px monospace',
    fbTxt: ['+0', '+1'],
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
    "<h3 style='text-align:left;'> In this experiment, you need to try to collect as many points as possible. You</h3>" +
    "<h3 style='text-align:left;'> will see in each trial, one picture on the left and one picture on the right side. If</h3>" +
    "<h3 style='text-align:left;'> If you select the picture with reward you will receive +1 point. If you select</h3>" +
    "<h3 style='text-align:left;'> the picture without reward you will receive 0 points. Make a choice in each</h3>" +
    "<h3 style='text-align:left;'> trial by pressing the corresponding key with your left and right index finger:</h3><br>" +
    "<h3 style='text-align:center;'> Left = Q-key &nbsp;&nbsp Right = P-key </h3><br><br>" +
    "<h3 style='text-align:center;'> Drücken Sie eine beliebige Taste, um fortzufahren!</h3>",
};

const block_start = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    on_start: function(trial) {
        trial.stimulus =  "<h2 style='text-align:left;'>Block Start </h2><br>" +
            "<h2 style='text-align:left;'>Total Points Accumulated: " + prms.cPoints + "</h2><br>" +
            "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
    },
    on_finish: function() {
        prms.cTrl = 1;
    },
};

const short_break = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
    "<h2 style='text-align:left;'>Break</h2><br>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    on_finish: function() {
        prms.cBlk += 1;
    },
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

const imagesDescription = readImages('DescriptionImages2/D_', 2);
const imagesExperience = shuffle(readImages('ExperienceImages/E_', 34)).splice(0, 2);

console.log("here")

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

    let imagesLeft = (imageTypeLeft === 'Description') ? imagesDescription : imagesExperience;
    let imagesRight = (imageTypeRight === 'Description') ? imagesDescription : imagesExperience;

    // draw left image
    ctx.drawImage(imagesLeft[numLeft], -imagesLeft[numLeft].width / 2 - 150, -imagesLeft[numLeft].height / 2);
    
    // draw right image
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


const rfi = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.rfi,
    response_ends_trial: false,
    func: function () {},
};

function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];

    let pressed_key = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(dat.key_press);
    let response_side = (pressed_key === prms.respKeys[0]) ? "left" : "right";
    let highProbSelected = (response_side === dat.highProbSide) ? true : false;

    let rewardCode;
    if (response_side === "left") {
        rewardCode = Math.random() < dat.imageProbLeft ? 1 : 0;
    } else if (response_side === "right") {
        rewardCode = Math.random() < dat.imageProbRight ? 1 : 0;
    }
    
    if (rewardCode === 1) {
        prms.cPoints += 1;
    }

    let chosenImageType = (response_side === "left") ? dat.imageTypeLeft : dat.imageTypeRight;

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        pressed_key: pressed_key,
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
        phase: jsPsych.timelineVariable('phase'),
        trialType: jsPsych.timelineVariable('trialType'),
        imageTypeLeft: jsPsych.timelineVariable('imageTypeLeft'),
        imageTypeRight: jsPsych.timelineVariable('imageTypeRight'),
        imageProbLeft: jsPsych.timelineVariable('imageProbLeft'),
        imageProbRight: jsPsych.timelineVariable('imageProbRight'),
        imageNumberLeft: jsPsych.timelineVariable('imageNumberLeft'),
        imageNumberRight: jsPsych.timelineVariable('imageNumberRight'),
        highProbSide: jsPsych.timelineVariable('highProbSide'),
    },
    on_finish: function() {
        codeTrial();
    },
};

let learning_block_description = [

    // Pure Description
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "learning", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},

];

let learning_block_experience = [

    // Pure Experience
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "learning", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},

];

// TO CHECK!!!
let experimental_block = [
    
    // Pure Description 2
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "experiment", trialType: "PureDescription", imageTypeLeft: 'Description', imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},

    // Pure Experience 2
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "experiment", trialType: "PureExperience", imageTypeLeft: 'Experience', imageTypeRight: 'Experience', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},

    // Description vs. Experimence Unequal 4 
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',  imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.2, imageProbRight: 0.8, imageNumberLeft: 0, imageNumberRight: 1, highProbSide: "right"},
    { phase: "experiment", trialType: "UnequalMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description', imageProbLeft: 0.8, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 0, highProbSide: "left"},

    // Description vs. Experiment Equal 4 * 3 
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Description', imageTypeRight: 'Experience',   imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 0, imageNumberRight: 0, highProbSide: "na"},
    { phase: "experiment", trialType: "EqualMixed", imageTypeLeft: 'Experience',  imageTypeRight: 'Description',  imageProbLeft: 0.2, imageProbRight: 0.2, imageNumberLeft: 1, imageNumberRight: 1, highProbSide: "na"},

];

const trial_timeline_description = {
    timeline: [fixation_cross, pic_stim, rfi, trial_feedback, iti],
    timeline_variables: learning_block_description,
    sample: {
        type: 'fixed-repetitions',
        size: 50,
    },
};

const trial_timeline_experience = {
    timeline: [fixation_cross, pic_stim, rfi, trial_feedback, iti],
    timeline_variables: learning_block_experience,
    sample: {
        type: 'fixed-repetitions',
        size: 50,
    },
};

const trial_timeline_experiment = {
    timeline: [fixation_cross, pic_stim, rfi, trial_feedback, iti],
    timeline_variables: experimental_block,
    sample: {
        type: 'fixed-repetitions',
        size: 5,
    },
};

function ratings(imgs, imgType) {
    let r = [];
    for (let i = 0; i < 2; i ++) {
        let tmp = {
            type: 'image-slider-response',
            stimulus: imgs[i].src,
            labels: ['0 (no chance)', '100 (guaranteed)'],
            slider_width: 500,
            require_movement: true,
            prompt: '<p>Indicate the percentage win rate of the dispalyed stimulus.</p>',
            on_finish: function () {
                let dat = jsPsych.data.get().last(1).values()[0];
                let key = imgType + (i+1);
                jsPsych.data.addProperties({ [key] : dat.response });
            },
        };
        r.push(tmp);
    }
    return r;
}

const ratingsDescription = ratings(imagesDescription, "D");
const ratingsExperience = ratings(imagesExperience, "E");
const ratingStimuli = ratingsDescription.concat(ratingsExperience);

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: "",
  response_ends_trial: true,
  choices: [32],
  on_start: function (trial) {
    trial.stimulus =
      "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3>" +
      "<h2 style='text-align:left;'>Total Points Accumulated: " +
      prms.cPoints +
      '</h2><br>' +
      "<h3 style='text-align:left;'>Wenn Sie einen Gutschein gewinnen möchten, kopieren Sie den folgenden </h3>" +
      "<h3 style='text-align:left;'>zufällig generierten Code und senden Sie diesen per Email. </h3>" +
      '<h2>xxx.xxx@student.uni-tuebingen.de oder </h2>' +
      '<h1>Code: ' +
      randomString +
      '</h1><br>' +
      "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>";
  },
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

        exp.push(vpInfoForm_de);
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

        // second phase: 4 experiment block of 100 trials
        for (let blk = 0; blk < 4; blk++) {
            exp.push(short_break);
            exp.push(block_start);
            exp.push(trial_timeline_experiment);
        }

        exp.push(showMouseCursor);
        exp.push(short_break);

        // end of experiment ratings
        for (let i = 0; i < ratingStimuli.length; i++) {
            exp.push(ratingStimuli[i]);
        }

        exp.push(debrief_de);
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

