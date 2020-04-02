function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.moveTo(-50, 0);
    ctx.lineTo( 50, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -50);
    ctx.lineTo(0,  50);
    ctx.stroke(); 
}

function drawCircle() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.stroke(); 
    ctx.beginPath();
    ctx.arc(0, 200, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke(); 
    ctx.beginPath();
    ctx.arc(200, 0, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 5;
    ctx.stroke(); 
}

function drawText() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Hello World", 0, 0); 
}

var images = []
for (let i = 1; i <=2; i++){
    let image = '../../img/h' + i + '.bmp'; 
    images.push(image);
}

// Load images
function loadImages(imagefiles) {
    // Initialize variables
    loadcount = 0;
    loadtotal = imagefiles.length;
    preloaded = false;
 
    // Load the images
    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        // Create the image object
        var image = new Image();
 
        // Add onload event handler
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                // Done loading
                preloaded = true;
            }
        };
 
        // Set the source url of the image
        image.src = imagefiles[i];
 
        // Save to the image array
        loadedimages[i] = image;
    }
 
    // Return an array of images
    return loadedimages;
}
var images = loadImages(["../../img/h1.bmp", "../../img/h1.bmp"]);

// function drawImage(x=-200, y=-200, h=400, w=400) {
//     let ctx = document.getElementById('canvas').getContext('2d');
//     ctx.drawImage(images[0], x, y, h, w);
// }

function drawImage(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.drawImage(images[0], args["x"], args["y"], args["h"], args["w"]);
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "2px solid black",
    func: drawFixation
};

const circle = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "6px solid red",
    func: drawCircle
};

const text = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "8px solid green",
    func: drawText
};

const combined = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "10px solid blue",
    func: function() {
        drawFixation(); 
        drawCircle(); 
        drawText(); 
    }
}

const combined_sequential = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 5000,
    translate_origin: true,
    canvas_border: "10px solid blue",
    stimulus_onset: [0, 1500, 3000],
    func: [ drawFixation, drawCircle, drawText ]
}

const image_grid = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 5000,
    translate_origin: true,
    canvas_border: "10px solid blue",
    stimulus_onset: 0,
    func: [drawImage, drawImage, drawImage, drawImage],
    func_args: [{"x": -400, "y": -400, "h":200, "w":200},
                {"x":  200, "y": -400, "h":200, "w":200},
                {"x": -400, "y":  200, "h":200, "w":200},
                {"x":  200, "y":  200, "h":200, "w":200}]
}

const image_sequential = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 5000,
    translate_origin: true,
    canvas_border: "10px solid blue",
    stimulus_onset: [0, 500, 1000],
    func: [drawImage, drawImage, drawImage],
    func_args: [{"x": -100, "y": -100, "h":200, "w":200},
                {"x": -200, "y": -200, "h":400, "w":400},
                {"x": -300, "y": -300, "h":600, "w":600}]
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fixation_cross);
    exp.push(circle);
    exp.push(fixation_cross);
    exp.push(text);
    exp.push(fixation_cross);
    exp.push(combined);
    exp.push(combined_sequential);

    exp.push(fixation_cross);
    exp.push(image_grid);
    exp.push(fixation_cross);
    exp.push(image_sequential);

    return exp;

}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
});

