// Stroop-like task with VPs required to drag words up/down according to colour

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 16,  // number of trials in first block (practice)
    nTrlsE: 64,  // number of trials in subsequent blocks 
    nBlks: 4,
    fixDur: 750,
    fbDur: 750,
    waitDur: 1000,
    iti: 1000,
    tooFast: 150,
    tooSlow: 5000,
    fbTxt: ["Correct", "Error", "Too Slow", "Too Fast"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
};

const words_upper_de = shuffle([ 
    "Alpen", "Ballon", "Vogel", "Burg", "Decke", "Wolke",
    "Komet", "Krone", "Adler", "Giebel", "Empore",
    "Falke", "Höhe", "Hochland"," Berg"," Drachen",
    "Höhepunkt", "Mond", "Gebirge", "Nest", "Flugzeug",
    "Planet", "Dach", "Satellit", "Himmel", "Hochhaus",
    "Gipfel", "Stern", "Sonne", "Spitze", "Turm", "Weltall"
]);

const words_upper_en = shuffle([ 
    "alps", "balloon", "bird", "castle", "ceiling", "cloud",
    "comet", "crown", "eagle", "gable", "gallery",
    "hawk", "height", "highlands", "hill", "kite",
    "maximum", "moon", "mountains", "nest", "plane",
    "planet", "roof", "satellite", "sky", "skyscraper",
    "summit", "star", "sun", "top", "tower", "universe"
]);

const words_lower_de = shuffle([
    "Abgrund", "Schlucht", "Teppich", "Keller", "Klee",
    "Tiefe", "Graben", "Taucher", "Erdreich", "Fußboden", "Fuß",
    "Gras", "Grab", "Boden", "Hölle", "Maulwurf", "Maus",
    "Schienen", "Fluss", "Wurzel", "Gehweg", "Erde", "Sohle",
    "Stein", "Straße", "Untergrund", "U-Boot", "U-Bahn",
    "Sumpf", "Tunnel", "Unterwelt", "Wurm"
]);

const words_lower_en = shuffle([ 
    "abyss" , "canyon" , "carpet" ," cellar" ," clover" ,
    "depth", "ditch"," diver" , "earth", "floor", "foot" ,
    "grass", "grave"," ground" , "hell", "mole", "mouse" ,
    "rails", "river"," root", "sidewalk", "soil"," sole" ,
    "stone", "street"," subfont", "submarine", "subway" ,
    "swamp", "tunnel"," underworld", "worm" 
]);

const resp_mapping_location = ["top", "top", "bottom", "bottom"];
const resp_mapping_color    = shuffle(["red", "blue", "green", "orange"]);
const colours = ["red", "blue", "green", "orange"];

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
    type: "html-keyboard-response",
    stimulus: "<H1 style='text-align: center;'>Welcome:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font </H2><br>" +
    "<H2 style='text-align: center;'>" + resp_mapping_color[0] + "/" + resp_mapping_color[1] + " = 'UP'</H2><br>" +
    "<H2 style='text-align: center;'>" + resp_mapping_color[2] + "/" + resp_mapping_color[3] + " = 'DOWN'</H2><br>", 
    post_trial_gap: prms.waitDur
};

function create_timeline(cpos) {
    t = [];
    for (word in words_upper_de) {
        t.push({
            "word": words_upper_de[word], 
            "colour": colours[cpos], 
            "word_loc": "up",
            "resp_loc": resp_mapping_location[resp_mapping_color.findIndex(x => x === colours[cpos])]})
        cpos = (cpos + 1) % 4;
    }
    for (word in words_lower_de) {
        t.push({
            "word": words_lower_de[word], 
            "colour": colours[cpos], 
            "word_loc": "down", 
            "resp_loc": resp_mapping_location[resp_mapping_color.findIndex(x => x === colours[cpos])]})
        cpos = (cpos + 1) % 4;
    }
    return t;
}

function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 5;
    ctx.moveTo(-25, 0);
    ctx.lineTo( 25, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -25);
    ctx.lineTo(0,  25);
    ctx.stroke(); 
}

function drawFeedback() {
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(prms.fbTxt[dat.corrCode], dat.end_x, dat.end_y); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: drawFixation
};

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    if (dat.resp_loc !== dat.end_loc) {
        corrCode = 1;  // choice error
    } 
    jsPsych.data.addDataToLastTrial({date: Date(), corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

const trial_stimulus = {
    type: 'mouse-drag-response',
    canvas_border: "4px solid black",
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'), 
    data: {
        stim: "stroop",
        word: jsPsych.timelineVariable('word'), 
        colour: jsPsych.timelineVariable('colour'), 
        word_loc: jsPsych.timelineVariable('word_loc'),
        resp_loc: jsPsych.timelineVariable('resp_loc') 
    },
    on_finish: function() { codeTrial(); }
};

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: false,
    canvas_border: "4px solid black",
    func: drawFeedback
};

function blockFeedbackTxt(filter_options) {
    "use strict";
    let dat = jsPsych.data.get().filter({...filter_options, blockNum: prms.cBlk});
    let nTotal = dat.count();
    let nError = dat.select("corrCode").values.filter(function (x) { return x !== 0; }).length;
    dat = jsPsych.data.get().filter({...filter_options, corrCode: 1});
    let blockFbTxt = "<H1>Block: " + prms.cBlk + " of " + prms.nBlks + "</H1>" +
        "<H1>Mean RT: " + Math.round(dat.select("end_rt").mean()) + " ms </H1>" +
        "<H1>Error Rate: " + Math.round((nError / nTotal) * 100) + " %</H1>" +
        "<H2>Press any key to continue the experiment!</H2>";
    prms.cBlk += 1;
    return blockFbTxt;
}

const block_feedback = {
    type: 'html-keyboard-response',
    stimulus: '',
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt({stim: "stroop"});
    },
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        trial_stimulus,
        trial_feedback,
    ],
    randomize_order:true,
    repetitions: 1 
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(welcome_en);
    // exp.push(vpInfoForm);
    exp.push(task_instructions);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.timeline_variables = create_timeline(blk);
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_en);
    exp.push(fullscreen_on);
    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen_mode: true,
    show_progress_bar: false,
});

