var jsPsychStaticCanvasKeyboardResponse = (function(jspsych) {
    'use strict';

    const info = {
        name: 'static-canvas-keyboard-response',
        parameters: {
            func_args: {
                type: jspsych.ParameterType.DICT,
                pretty_name: 'Args',
                default: {},
                description: 'Function arguments',
            },
            func: {
                type: jspsych.ParameterType.FUNCTION,
                array: true,
                pretty_name: 'Function',
                default: {},
                description: 'Function to call',
            },
            clear_screen: {
                type: jspsych.ParameterType.BOOL,
                array: true,
                pretty_name: 'Clear',
                default: [false],
                description: 'Clear the screen',
            },
            canvas_colour: {
                type: jspsych.ParameterType.STRING,
                array: false,
                pretty_name: 'Colour',
                default: 'white',
                description: 'Canvas colour.',
            },
            canvas_size: {
                type: jspsych.ParameterType.INT,
                array: true,
                pretty_name: 'Size',
                default: [1280, 960],
                description: 'Canvas size.',
            },
            canvas_border: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Border',
                default: '0px solid black',
                description: 'Border style',
            },
            translate_origin: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: 'Translate',
                default: false,
                description: 'Translate origin to center',
            },
            choices: {
                type: jspsych.ParameterType.KEYS,
                array: true,
                pretty_name: 'Choices',
                default: 'ALL_KEYS',
                description: 'The keys the subject is allowed to press to respond to the stimulus.',
            },
            stimulus_onset: {
                type: jspsych.ParameterType.INT,
                array: true,
                pretty_name: 'StimulusOnset',
                default: [0],
            },
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'StimulusDuration',
                default: null,
                description: 'How long to hide the stimulus.',
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'TrialDuration',
                default: null,
                description: 'How long to show trial before it ends.',
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: 'ResponseEndsTrial',
                default: true,
                description: 'If true, then trial will end when user responds.',
            },
        },
    };

    class StaticCanvasKeyboardResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // setup canvas
            let new_html =
                '<div style="position:relative;">' +
                '<canvas id="canvas" width="' +
                trial.canvas_size[0] +
                '" height="' +
                trial.canvas_size[1] +
                '" style="border: ' +
                trial.canvas_border +
                '; position: absolute; z-index: -1; top: 50%; left: 50%; transform: translate(-50%, -50%);"></canvas>' +
                '' +
                '</div>';

            // trial(display_element, trial) {
            //   // setup canvas
            //   let new_html =
            //     '<div style="position:relative;">' +
            //     '<canvas id="canvas" width="' +
            //     trial.canvas_size[0] +
            //     '" height="' +
            //     trial.canvas_size[1] +
            //     '" style="border: ' +
            //     trial.canvas_border +
            //     ';"></canvas>' +
            //     '</div>';

            display_element.innerHTML = new_html;

            let canvas = document.querySelector('canvas');
            let ctx = canvas.getContext('2d');

            ctx.fillStyle = trial.canvas_colour;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (typeof trial.func === 'function') {
                trial.func = [trial.func];
            }
            if (typeof trial.stimulus_onset === 'boolean') {
                trial.clear_screen = [trial.clear_screen];
            }
            if (typeof trial.stimulus_onset === 'number') {
                trial.stimulus_onset = [trial.stimulus_onset];
            }

            if (trial.translate_origin) {
                ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
            }

            // store response
            let response = {
                rt: null,
                key: null,
            };

            // function to end trial when it is time
            const end_trial = () => {
                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }

                // gather the data to store for the trial
                let trial_data = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    key_press: response.key,
                };

                // clear the display
                display_element.innerHTML = '';

                // move on to the next trial
                this.jsPsych.finishTrial(trial_data);
            };

            // function to handle responses by the subject
            let after_response = (info) => {
                if (response.key == null) {
                    response = info;
                }
                if (trial.response_ends_trial) {
                    end_trial();
                }
            };

            // start the response listener
            if (trial.choices !== 'NO_KEYS') {
                var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    rt_method: 'performance',
                    persist: false,
                    allow_held_key: false,
                });
            }

            // hide stimulus if stimulus_duration is set
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(function() {
                    // reset canvas
                    display_element.innerHTML = new_html;
                    let canvas = document.getElementById('canvas');
                    let ctx = document.getElementById('canvas').getContext('2d');
                    ctx.fillStyle = trial.canvas_colour;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }, trial.stimulus_duration);
            }

            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(function() {
                    end_trial();
                }, trial.trial_duration);
            }

            // draw stimulus/stimuli
            for (let i = 0; i < trial.func.length; i++) {
                this.jsPsych.pluginAPI.setTimeout(function() {
                    if (trial.clear_screen[i]) {
                        if (trial.translate_origin) {
                            ctx.fillStyle = trial.canvas_colour;
                            ctx.fillRect(-canvas.width / 2, -canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
                        } else {
                            ctx.fillStyle = trial.canvas_colour;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                    }
                    trial.func[i](trial.func_args[i]);
                }, trial.stimulus_onset[i]);
            }
        }
    }
    StaticCanvasKeyboardResponsePlugin.info = info;
    return StaticCanvasKeyboardResponsePlugin;
})(jsPsychModule);
