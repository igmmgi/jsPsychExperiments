// Start box and end boxes whilst recording x,y mouse posiiton

jsPsych.plugins['mouse-response'] = (function () {
    let plugin = {};

    plugin.info = {
        name: 'mouse-response',
        description: '',
        parameters: {
            func_args: {
                type: jsPsych.plugins.parameterType.DICT,
                array: true,
                pretty_name: 'Args',
                default: {},
                description: 'Function arguments',
            },
            canvas_colour: {
                type: jsPsych.plugins.parameterType.STRING,
                array: false,
                pretty_name: 'Colour',
                default: 'white',
                description: 'Canvas colour.',
            },
            canvas_size: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Size',
                default: [1280, 960],
                description: 'Canvas size.',
            },
            canvas_border: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Border',
                default: '0px solid black',
                description: 'Border style',
            },
            scale_factor: {
                type: jsPsych.plugins.parameterType.FLOAT,
                array: false,
                pretty_name: 'Scale',
                default: 1,
                description: 'Scale Factor',
            },
            word: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Word',
                default: 'Hello, world!',
                description: 'StimulusText',
            },
            colour: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Colour',
                default: 'black',
                description: 'StimulusColour',
            },
            font: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Colour',
                default: '50px arial',
                description: 'Font',
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'TrialDuration',
                default: null,
                description: 'How long to show trial before it ends.',
            },
        },
    };

    plugin.trial = function (display_element, trial) {

        // setup canvas
        display_element.innerHTML = "<canvas id='canvas'></canvas>";
        let canvas = document.getElementById('canvas');

        canvas.style = 'position: absolute; top: 0px; left: auto; right: auto; bottom: 0px; margin: auto;';
        canvas.width = trial.canvas_size[0];
        canvas.height = trial.canvas_size[1];
        canvas.style.border = trial.canvas_border;
        canvas.style.left = -trial.canvas_size[0] / 2 + 'px';

        let ctx = document.getElementById('canvas').getContext('2d');

        // canvas mouse events
        $('#canvas').mousedown(function (e) {
            handleMouseDown(e);
        });
        $('#canvas').mousemove(function (e) {
            handleMouseMove(e);
        });

        let canvasOffset = $(canvas).offset();
        let offsetX = canvasOffset.left;
        let offsetY = canvasOffset.top;

        let start_X = null;
        let start_Y = null;
        let end_X = null;
        let end_Y = null;
        let trial_initiated = false;
        let start_time = null;
        let movement_initiated = false;
        let start_rt = null;
        let end_rt = null;
        let end_loc = null;

        let start_box = {
            "x": (canvas.width/2) - 25, 
            "y": canvas.height * 0.9, 
            "h": 50, 
            "w": 50
        }; 

        let left_responsebox = {
            "x": ((canvas.width/2) - 25) - 300, 
            "y": canvas.height * 0.1, 
            "h": 50, 
            "w": 50
        }; 

        let right_responsebox = {
            "x": ((canvas.width/2) - 25) + 300, 
            "y": canvas.height * 0.1, 
            "h": 50, 
            "w": 50
        }; 

        let x_coords = [];
        let y_coords = [];
        let time = [];

        ctx.font = trial.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // initial draw without word
        draw(false);


        // Trial is initiated by pressing the mouse button inside the start box
        function handleMouseDown(e) {
            e.preventDefault();
            if (!trial_initiated) {
                let X = (parseInt(e.clientX) - offsetX) / trial.scale_factor;
                let Y = (parseInt(e.clientY) - offsetY) / trial.scale_factor;
                if (in_box(X, Y, start_box)) {
                    start_X = X; 
                    start_Y = Y; 
                    trial_initiated = true;
                    start_time = performance.now();
                    draw(true);  // draw word
                }
            }
        }

        function handleMouseMove(e) {

            if (trial_initiated === false) {
                return;
            }

            e.preventDefault();
            let X = (parseInt(e.clientX) - offsetX) / trial.scale_factor;
            let Y = (parseInt(e.clientY) - offsetY) / trial.scale_factor;

            // response movement started?
            if (!movement_initiated) {
                start_rt = performance.now() - start_time;
                movement_initiated = true;
            }

            // store coordinates and time array
            x_coords.push(X);
            y_coords.push(Y);
            time.push(performance.now() - start_time);

            // response movement finished
            if (in_box(X, Y, left_responsebox)){
                end_trial();
            } else if (in_box(X, Y, right_responsebox)) {
                end_trial();
            }

        }

        // clear the canvas and draw text
        function draw(show_text) {

            // canvas
            ctx.fillStyle = trial.canvas_colour;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // start box 
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.rect(start_box.x, start_box.y, start_box.w, start_box.h);
            ctx.stroke();

            // response box left 
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.rect(left_responsebox.x, left_responsebox.y, left_responsebox.w, left_responsebox.h);
            ctx.stroke();

            // response box right 
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.rect(right_responsebox.x, right_responsebox.y, right_responsebox.w, left_responsebox.h);
            ctx.stroke();

            // text
            if (show_text) {
                ctx.fillStyle = trial.colour;
                ctx.fillText(trial.word, canvas.width / 2, canvas.height * 0.8);
            }

        }

        // test if x, y is inside the bounding box 
        function in_box(x, y, box) {
            return (
                x >= box.x  &&
                x <= box.x + box.w &&
                y >= box.y &&
                y <= box.y + box.h 
            );
        }

        // function to end trial when it is time
        let end_trial = function () {
            end_rt = performance.now() - start_time;
            end_loc = x_coords[x_coords.length - 1] < canvas.width / 2 ? 'left' : 'right';

            // gather the data to store for the trial
            let trial_data = {
                start_rt: start_rt,
                start_x: Math.round(x_coords[0]),
                start_y: Math.round(y_coords[0]),
                end_rt: end_rt,
                end_x: Math.round(x_coords[x_coords.length - 1]),
                end_y: Math.round(y_coords[y_coords.length - 1]),
                end_loc: end_loc,
                x_coords: roundArray(x_coords),
                y_coords: roundArray(y_coords),
                time: time,
            };

            // clear the display
            display_element.innerHTML = "<canvas id='canvas'></canvas>";

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // end trial if trial_duration is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                end_trial();
            }, trial.trial_duration);
        }
    };

    return plugin;
})();
