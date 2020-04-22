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

function drawText(args) {

    let ctx = document.getElementById('canvas').getContext('2d');

    // basic font style
    ctx.font         = "50px monospace";
    ctx.textAlign    = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "black";

    // text properties
    var maxWidth   = 1000;
    var lineHeight = 50;
    var xpos       = -(maxWidth/2);

    // get number of lines text is going to be split into
    var txtString = args["sentence"];
    var txtWidth  = ctx.measureText(txtString).width;
    var numLines  = Math.ceil(txtWidth / maxWidth);
    var words     = txtString.split(' ');
    
    var ypos = -(lineHeight * numLines)/2 + (lineHeight/2);

    // keep adding word until it is too long
    var line = '';
    for(var n = 0; n < words.length; n++) {
        var word = (n == args["word_num"]) ? words[n] : textMask(words[n]);
        var tmp = line + word + ' ';
        if (ctx.measureText(tmp).width > maxWidth && n > 0) {
            // draw line
            ctx.fillText(line, xpos, ypos);
            ctx.fillText(textMask(line), xpos, ypos);
            // reset and change y position
            line = word + ' ';
            ypos += lineHeight;
        }
        else {
            line = tmp;
        }
    }
    // final line
    ctx.fillText(line, xpos, ypos);
    ctx.fillText(textMask(line), xpos, ypos);

}

function textMask(txt) {
    return txt.replace(/[a-z.!?]/gi, '_')
}


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 1000,
    translate_origin: true,
    canvas_colour: "grey",
    canvas_border: "10px solid black",
    func: drawFixation
};

const text = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 5000,
    translate_origin: true,
    canvas_colour: "grey",
    canvas_border: "10px solid black",
    func: drawText,
    func_args:[
        {
        "sentence": jsPsych.timelineVariable('sentence'),
        "word_num": jsPsych.timelineVariable('word_num')
        }
    ]
};

const create_sentence = function(sentence) {
    var txt = sentence.split(' ');
    var t = [];
    for (var i = -1; i < txt.length; i++) {
        t.push({sentence: sentence, word_num: i});
    }
    console.log(t)
    return t;
}

const text_timeline = {
    timeline: [
        text
    ],
    timeline_variables: create_sentence("This is a sentence that is going to be presented word by word!"),
    randomize_order:false
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fixation_cross);
    exp.push(text_timeline);
    return exp;

}
EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
});

