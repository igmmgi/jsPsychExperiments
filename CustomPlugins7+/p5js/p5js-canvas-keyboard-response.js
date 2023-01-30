var jsPsychP5JSKeyboardResponse = (function (jspsych) {
    "use strict";

    const info = {
        name: "p5js-keyboard-response",
        parameters: {
            draw: {
                type: jspsych.ParameterType.FUNCTION,
                array: false,
                pretty_name: "Draw Function",
                default: null,
                description: "The p5js draw function.",
            },
            canvas_size: {
                type: jspsych.ParameterType.INT,
                array: true,
                pretty_name: "Size",
                default: [1280, 960],
                description: "Canvas size.",
            },
            canvas_border: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Border",
                default: "10px solid black",
                description: "Border style",
            },
            canvas_background: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Background colour",
                default: 255,
                description: "Background Colour",
            },
            choices: {
                type: jspsych.ParameterType.KEYCODE,
                array: true,
                pretty_name: "Choices",
                default: "ALL_KEYS",
                description: "The keys the subject is allowed to press to respond to the stimulus.",
            },
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: null,
                description: "How long to hide the stimulus.",
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
                description: "How long to show trial before it ends.",
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "ResponseEndsTrial",
                default: true,
                description: "If true, then trial will end when user responds.",
            },
        },
    };

    class P5JSKeyboardResponse {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {
            // setup canvas
            display_element.innerHTML = "<div id='p5js_container''></div>";
            let p5js_canvas;
            p5js_canvas = p5js.createCanvas(trial.canvas_size[0], trial.canvas_size[1]);
            p5js_canvas.canvas.style.border = trial.canvas_border;
            p5js_canvas.parent(p5js_container);
            p5js.background(trial.canvas_background);
            p5js.draw = trial.draw();

            // store response
            let response = {
                rt: null,
                key: null,
            };

            // function to end trial when it is time
            const end_trial = () => {
                // kill any remaining setTimeout handlers
                // this.jsPsych.pluginAPI.clearAllTimeouts();
                // // kill keyboard listeners
                // if (typeof keyboardListener !== "undefined") {
                //     this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                // }
                // // gather the data to store for the trial
                let trial_data = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    key_press: response.key,
                };
                // // clear the display
                display_element.innerHTML = "";
                p5js.removeElements();
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

            // // start the response listener
            // if (trial.choices !== "NO_KEYS") {
            //     var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
            //         callback_function: after_response,
            //         valid_responses: trial.choices,
            //         rt_method: "performance",
            //         persist: false,
            //         allow_held_key: false,
            //     });
            // }

            // // hide stimulus if stimulus_duration is set
            // if (trial.stimulus_duration !== null) {
            //     this.jsPsych.pluginAPI.setTimeout(function () {
            //         display_element.querySelector("#stimulus").style.visibility = "hidden";
            //     }, trial.stimulus_duration);
            // }

            // // end trial if trial_duration is set
            // if (trial.trial_duration !== null) {
            //     this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            // }
        }
    }

    P5JSKeyboardResponse.info = info;
    return P5JSKeyboardResponse;
})(jsPsychModule);
