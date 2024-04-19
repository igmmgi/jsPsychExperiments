var jsPsychCanvasSliderResponse = (function (jspsych) {
    "use strict";

    const info = {
        name: "canvas-slider-response",
        parameters: {
            /** The drawing function to apply to the canvas. Should take the canvas object as argument. */
            stimulus: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Stimulus",
                default: undefined,
            },
            /** Sets the minimum value of the slider. */
            min: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Min slider",
                default: 0,
            },
            /** Sets the maximum value of the slider */
            max: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Max slider",
                default: 100,
            },
            /** Sets the starting value of the slider */
            slider_start: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Slider starting value",
                default: 50,
            },
            /** Sets the step of the slider */
            step: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Step",
                default: 1,
            },
            /** Width of the slider in pixels. */
            slider_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Slider width",
                default: null,
            },
            /** Label of the button to advance. */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Continue",
                array: false,
            },
            /** If true, the participant will have to move the slider before continuing. */
            require_movement: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Require movement",
                default: false,
            },
            /** How long to show the stimulus. */
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: null,
            },
            /** How long to show the trial. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            /** If true, trial will end when user makes a response. */
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
            canvas_colour: {
                type: jspsych.ParameterType.STRING,
                array: false,
                pretty_name: "Colour",
                default: "white",
                description: "Canvas colour.",
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
                default: "0px solid black",
                description: "Border style",
            },
            translate_origin: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Translate",
                default: false,
                description: "Translate origin to center",
            },
        },
    };
    /**
     * **canvas-slider-response**
     *
     * jsPsych plugin for displaying a canvas stimulus and getting a slider response
     *
     * @author Chris Jungerius (modified from Josh de Leeuw)
     * @see {@link https://www.jspsych.org/plugins/jspsych-canvas-slider-response/ canvas-slider-response plugin documentation on jspsych.org}
     */
    class CanvasSliderResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            var html = '<div id="jspsych-canvas-slider-response-wrapper" style="margin: 100px 0px;">';
            html +=
                '<canvas id="canvas" width="' +
                trial.canvas_size[0] +
                '" height="' +
                trial.canvas_size[1] +
                '" style="border: ' +
                trial.canvas_border +
                '; position: absolute; z-index: -1; top: 50%; left: 50%; transform: translate(-50%, -50%);"></canvas>';

            html +=
                '<input type="range" class="jspsych-slider" value="' +
                trial.slider_start +
                '" min="' +
                trial.min +
                '" max="' +
                trial.max +
                '" step="' +
                trial.step +
                `" style="width: ${trial.slider_width}px; cursor: none;" id="jspsych-canvas-slider-response-response"></input></div>`;

            // allow spacebar to activate click button
            window.onkeydown = function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                    document.querySelector("#jspsych-canvas-slider-response-next").click();
                }
            };

            // add submit button
            html +=
                '<button id="jspsych-canvas-slider-response-next" class="jspsych-btn" ' +
                (trial.require_movement ? "disabled" : "") +
                ">" +
                trial.button_label +
                "</button>";

            display_element.innerHTML = html;

            let canvas = document.querySelector("canvas");
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = trial.canvas_colour;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (trial.translate_origin) {
                ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
            }

            function onmousemove() {
                console.log("moving");
                $("body").css("cursor", true ? "pointer" : "none");
                document.getElementById("jspsych-canvas-slider-response-response").style.cursor = "pointer";
            }

            addEventListener("mousemove", onmousemove);
            // draw
            let c = document.getElementById("jspsych-canvas-stimulus");
            trial.stimulus(c);
            var response = {
                rt: null,
                response: null,
            };
            const end_trial = () => {
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // save data
                var trialdata = {
                    rt: response.rt,
                    response: response.response,
                    slider_start: trial.slider_start,
                };
                display_element.innerHTML = "";
                window.onkeydown = null;

                removeEventListener("mousemove", onmousemove);

                // next trial
                $("body").css("cursor", false ? "default" : "none");
                this.jsPsych.finishTrial(trialdata);
            };
            if (trial.require_movement) {
                const enable_button = () => {
                    display_element.querySelector("#jspsych-canvas-slider-response-next").disabled = false;
                };
                display_element
                    .querySelector("#jspsych-canvas-slider-response-response")
                    .addEventListener("mousedown", enable_button);
                display_element
                    .querySelector("#jspsych-canvas-slider-response-response")
                    .addEventListener("touchstart", enable_button);
                display_element
                    .querySelector("#jspsych-canvas-slider-response-response")
                    .addEventListener("change", enable_button);
            }
            display_element.querySelector("#jspsych-canvas-slider-response-next").addEventListener("click", () => {
                // measure response time
                var endTime = performance.now();
                response.rt = Math.round(endTime - startTime);
                response.response = display_element.querySelector(
                    "#jspsych-canvas-slider-response-response",
                ).valueAsNumber;
                if (trial.response_ends_trial) {
                    end_trial();
                } else {
                    display_element.querySelector("#jspsych-canvas-slider-response-next").disabled = true;
                }
            });
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    display_element.querySelector("#jspsych-canvas-slider-response-stimulus").style.visibility =
                        "hidden";
                }, trial.stimulus_duration);
            }
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            }
            var startTime = performance.now();
        }
        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode == "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            }
            if (simulation_mode == "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }
        create_simulation_data(trial, simulation_options) {
            const default_data = {
                response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
                rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial);
            load_callback();
            if (data.rt !== null) {
                const el = display_element.querySelector("input[type='range']");
                setTimeout(() => {
                    this.jsPsych.pluginAPI.clickTarget(el);
                    el.valueAsNumber = data.response;
                }, data.rt / 2);
                this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
            }
        }
    }
    CanvasSliderResponsePlugin.info = info;

    return CanvasSliderResponsePlugin;
})(jsPsychModule);
