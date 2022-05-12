// Mouse start box and end boxes whilst recording x,y mouse posiiton
//   LeftPic                   RightPic
//
//              +
//
//              SB

var jsPsychMouseImageResponse = (function(jspsych) {
    'use strict';

    const info = {
        name: 'mouse-image-response',
        parameters: {
            func_args: {
                type: jspsych.ParameterType.OBJECT,
                array: true,
                pretty_name: 'Args',
                default: {},
                description: 'Function arguments',
            },
            canvas_colour: {
                type: jspsych.ParameterType.STRING,
                array: false,
                pretty_name: 'Canvas Colour',
                default: 'white',
                description: 'Canvas Colour.',
            },
            canvas_size: {
                type: jspsych.ParameterType.INT,
                array: true,
                pretty_name: 'Canvas Size',
                default: [1280, 960],
                description: 'Canvas Size.',
            },
            canvas_border: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Border Style',
                default: '0px solid black',
                description: 'Border Style',
            },
            fixation_position: {
                type: jspsych.ParameterType.INT,
                array: true,
                pretty_name: 'Fixation Position',
                default: [0, 0],
                description: 'Fixation Position',
            },
            fixation_duration: {
                type: jspsych.ParameterType.INT,
                array: false,
                pretty_name: 'Fixation Duration',
                default: 500,
                description: 'Fixation Duration',
            },
            stimulus: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Stimulus',
                default: 'Hello, world!',
                description: 'Stimulus',
            },
            stimulus_type: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Stimulus_type',
                default: 'Language',
                description: 'Stimulus type',
            },

            stimulus_position: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Stimulus Position',
                default: [0, 0],
                description: 'Stimulus Position',
            },
            stimulus_colour: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Stimulus Colour',
                default: 'black',
                description: 'Stimulus Colour',
            },
            stimulus_font: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Stimulus Font',
                default: '50px monospace',
                description: 'Stimulus Font',
            },
            start_box: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Start Box',
                default: [0, 0, 100, 100],
                description: 'Start Box',
            },
            start_box_colour: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Start Box Colour',
                default: 'black',
                description: 'Start Box Colour',
            },
            left_box: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Left Box',
                default: [0, 0, 100, 100],
                description: 'Left Box',
            },
            right_box: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Right Box',
                default: [0, 0, 100, 100],
                description: 'Right Box',
            },
            left_box_colour: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Left Box Colour',
                default: 'black',
                description: 'Left Box Colour',
            },
            right_box_colour: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Right Box Colour',
                default: 'black',
                description: 'Right Box Colour',
            },
            left_image: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Left Image',
                default: null,
                description: 'Left Image',
            },
            left_image_anchor: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Left Image Anchor',
                default: [100, 200],
                description: 'Left Image Anchor',
            },
            right_image: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Right Image',
                default: null,
                description: 'Right Image',
            },
            right_image_anchor: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Right Image Anchor',
                default: [1080, 200, 100, 100],
                description: 'Right Image Anchor',
            },
            box_linewidth: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Line width of box',
                default: 2,
                description: 'Linewidth of box',
            },
            keep_fixation: {
                type: jspsych.ParameterType.BOOL,
                array: true,
                pretty_name: 'Keep Fxation Cross',
                default: true,
                description: 'Keep Fixation Cross with Stimulus Presentation',
            },
            draw_start_box: {
                type: jspsych.ParameterType.BOOL,
                array: true,
                pretty_name: 'Args',
                default: [true, true, true],
                description: 'Draw Response Boxes',
            },
            draw_response_boxes: {
                type: jspsych.ParameterType.BOOL,
                array: true,
                pretty_name: 'Draw Response Boxes',
                default: [false, false, true],
                description: 'Draw Response Boxes',
            },
            draw_response_boxes_image: {
                type: jspsych.ParameterType.BOOL,
                array: true,
                pretty_name: 'Draw Response Boxes Image',
                default: [false, true, true],
                description: 'Draw Response Boxes Image',
            },
            require_mouse_press_finish: {
                type: jspsych.ParameterType.BOOL,
                array: false,
                pretty_name: 'Require Mouse Press Response',
                default: false,
                description: 'Require Mouse Press Response',
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Trial Duration',
                default: null,
                description: 'How long to show trial before it ends.',
            },
        },
    };

    class MouseImageResponse {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // setup canvas
            let new_html =
                '<div>' +
                '<div style="position:relative;">' +
                '<canvas id="canvas" width="' +
                trial.canvas_size[0] +
                '" height="' +
                trial.canvas_size[1] +
                '" style="border: ' +
                trial.canvas_border +
                ';"></canvas>' +
                '</div>';

            // deactivate contextmenu of right mouse button until response
            document.addEventListener(
                'contextmenu',
                function cm(e) {
                    e.preventDefault();
                    if (e.button !== null) {
                        document.removeEventListener('contextmenu', cm, false);
                    }
                },
                false,
            );

            display_element.innerHTML = new_html;
            let canvas = document.getElementById('canvas');
            let ctx = document.getElementById('canvas').getContext('2d');
            let rect = canvas.getBoundingClientRect();

            // canvas mouse events
            canvas.addEventListener('mousedown', (e) => {
                if (e.buttons === 1) {
                    handleMouseDown(e);
                }
            });
            canvas.addEventListener('mousemove', (e) => {
                handleMouseMove(e);
            });

            // stimulus font properties
            ctx.font = trial.stimulus_font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // data
            let x_coords = [];
            let y_coords = [];
            let time = [];
            let start_time = null;
            let start_rt = null;
            let end_rt = null;
            let end_loc = null;
            let mpos;
            let nclicks = 0;
            let x_click_pos = [];
            let y_click_pos = [];

            let left_img = null;
            if (trial.left_image !== null) {
                left_img = new Image();
                left_img.src = trial.left_image;
            }

            let right_img = null;
            if (trial.right_image !== null) {
                right_img = new Image();
                right_img.src = trial.right_image;
            }

            // flags for drawing
            let trial_initiated = false;
            let movement_initiated = false;
            let draw_start_box = trial.draw_start_box[0];
            let draw_fixation = false;
            let draw_response_boxes = trial.draw_response_boxes[0];
            let draw_response_image = trial.draw_response_boxes_image[0];
            let draw_stimulus = false;

            // start/response boxes
            let start_box = {
                x: trial.start_box[0] - trial.start_box[2] / 2,
                y: trial.start_box[1] - trial.start_box[3] / 2,
                w: trial.start_box[2],
                h: trial.start_box[3],
            };

            let left_responsebox = {
                x: trial.left_box[0] - trial.left_box[2] / 2,
                y: trial.left_box[1] - trial.left_box[3] / 2,
                w: trial.left_box[2],
                h: trial.left_box[3],
            };

            let right_responsebox = {
                x: trial.right_box[0] - trial.right_box[2] / 2,
                y: trial.right_box[1] - trial.right_box[3] / 2,
                w: trial.right_box[2],
                h: trial.right_box[3],
            };

            // functions
            // clear the canvas and draw text
            const draw = () => {
                'use strict';
                // canvas
                ctx.fillStyle = trial.canvas_colour;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // start box
                if (draw_start_box) {
                    ctx.beginPath();
                    ctx.lineWidth = trial.box_linewidth;
                    ctx.strokeStyle = trial.start_box_colour;
                    ctx.rect(start_box.x, start_box.y, start_box.w, start_box.h);
                    ctx.stroke();
                }

                // image targets
                if (draw_response_image) {
                    if (left_img !== null) {
                        ctx.drawImage(
                            left_img,
                            trial.left_image_anchor[0] - left_img.width / 2,
                            trial.left_image_anchor[1] - left_img.height / 2,
                        );
                    }
                    if (right_img !== null) {
                        ctx.drawImage(
                            right_img,
                            trial.right_image_anchor[0] - right_img.width / 2,
                            trial.right_image_anchor[1] - right_img.height / 2,
                        );
                    }
                }

                // fixation cross
                if (draw_fixation) {
                    ctx.fillStyle = 'black'; // trial.stimulus_colour;
                    ctx.fillText('+', trial.fixation_position[0], trial.fixation_position[1]);
                    this.jsPsych.pluginAPI.setTimeout(function() {
                        draw_fixation = trial.keep_fixation;
                        draw_stimulus = true;
                        draw_start_box = trial.draw_start_box[2];
                        draw_response_image = trial.draw_response_boxes_image[2];
                        draw_response_boxes = trial.draw_response_boxes[2];
                        draw();
                    }, trial.fixation_duration);
                }

                if (draw_response_boxes) {
                    // response box left
                    ctx.beginPath();
                    ctx.lineWidth = trial.box_linewidth;
                    ctx.strokeStyle = trial.left_box_colour;
                    ctx.rect(left_responsebox.x, left_responsebox.y, left_responsebox.w, left_responsebox.h);
                    ctx.stroke();
                    // response box right
                    ctx.beginPath();
                    ctx.lineWidth = trial.box_linewidth;
                    ctx.strokeStyle = trial.right_box_colour;
                    ctx.rect(right_responsebox.x, right_responsebox.y, right_responsebox.w, right_responsebox.h);
                    ctx.stroke();
                }

                if (draw_stimulus) {
                    ctx.fillStyle = 'black';
                    ctx.font = trial.stimulus_font;
                    ctx.fillText(trial.stimulus, trial.stimulus_position[0], trial.stimulus_position[1]);
                }

            };

            // initial draw
            draw();

            // trial is initiated by pressing the mouse button inside the start box
            function handleMouseDown(e) {
                'use strict';
                nclicks++;
                mousePosition(e);
                x_click_pos.push(mpos.x);
                y_click_pos.push(mpos.y);
                if (!trial_initiated) {
                    if (in_box(mpos.x, mpos.y, start_box)) {
                        start_trial();
                    }
                } else {
                    if (in_box(mpos.x, mpos.y, left_responsebox) || in_box(mpos.x, mpos.y, right_responsebox)) {
                        end_trial();
                    }
                }
            }

            function mousePosition(e) {
                mpos = {
                    x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
                    y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
                };
            }

            function handleMouseMove(e) {
                mousePosition(e);

                if (!trial_initiated && !trial.require_mouse_press_start) {
                    if (in_box(mpos.x, mpos.y, start_box)) {
                        start_trial();
                    }
                }

                if (trial_initiated === false) {
                    return;
                }

                // response movement started?
                if (!movement_initiated && !in_box(mpos.x, mpos.y, start_box)) {
                    start_rt = performance.now() - start_time;
                    movement_initiated = true;
                }

                // store coordinates and time array
                x_coords.push(mpos.x);
                y_coords.push(mpos.y);
                time.push(performance.now() - start_time);

                // response movement finished just by entering response box
                if (!trial.require_mouse_press_finish) {
                    if (in_box(mpos.x, mpos.y, left_responsebox) || in_box(mpos.x, mpos.y, right_responsebox)) {
                        end_trial();
                    }
                }
            }

            // test if x, y is inside the bounding box
            function in_box(x, y, box) {
                return (
                    x >= box.x - trial.box_linewidth &&
                    x <= box.x + box.w + trial.box_linewidth * 2 &&
                    y >= box.y - trial.box_linewidth &&
                    y <= box.y + box.h + trial.box_linewidth * 2
                );
            }

            // function to start trial when it is time
            let start_trial = function() {
                'use strict';
                trial_initiated = true;
                start_time = performance.now();
                draw_fixation = true;
                draw_start_box = trial.draw_start_box[1];
                draw_response_image = trial.draw_response_boxes_image[1];
                draw_response_boxes = trial.draw_response_boxes[1];
                draw();
            };

            // function to end trial when it is time
            let end_trial = () => {
                'use strict';
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
                    nclicks: nclicks,
                    x_click_pos: x_click_pos,
                    y_click_pos: y_click_pos,
                };

                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mousedown', handleMouseMove);

                // cleat the display and move on to the next trial
                display_element.innerHTML = '';
                this.jsPsych.finishTrial(trial_data);
            };

            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            }
        }
    }

    MouseImageResponse.info = info;
    return MouseImageResponse;
})(jsPsychModule);
