var jsPsychCanvasSliderResponse = (function (jspsych) {
    "use strict";

    var _package = {
        name: "@jspsych/plugin-canvas-slider-response",
        version: "2.0.0",
        description: "jsPsych plugin for displaying a canvas stimulus and getting a slider response",
        type: "module",
        main: "dist/index.cjs",
        exports: {
            import: "./dist/index.js",
            require: "./dist/index.cjs",
        },
        typings: "dist/index.d.ts",
        unpkg: "dist/index.browser.min.js",
        files: ["src", "dist"],
        source: "src/index.ts",
        scripts: {
            test: "jest  --passWithNoTests",
            "test:watch": "npm test -- --watch",
            tsc: "tsc",
            build: "rollup --config",
            "build:watch": "npm run build -- --watch",
        },
        repository: {
            type: "git",
            url: "git+https://github.com/jspsych/jsPsych.git",
            directory: "packages/plugin-canvas-slider-response",
        },
        author: "Chris Jungerius, Josh de Leeuw",
        license: "MIT",
        bugs: {
            url: "https://github.com/jspsych/jsPsych/issues",
        },
        homepage: "https://www.jspsych.org/latest/plugins/canvas-slider-response",
        peerDependencies: {
            jspsych: ">=7.1.0",
        },
        devDependencies: {
            "@jspsych/config": "^3.0.0",
            "@jspsych/test-utils": "^1.2.0",
        },
    };

    const info = {
        name: "canvas-slider-response",
        version: _package.version,
        parameters: {
            stimulus: {
                type: jspsych.ParameterType.FUNCTION,
                default: void 0,
            },
            min: {
                type: jspsych.ParameterType.INT,
                default: 0,
                array: true,
            },
            max: {
                type: jspsych.ParameterType.INT,
                default: 100,
                array: true,
            },
            slider_start: {
                type: jspsych.ParameterType.INT,
                default: 50,
                array: true,
            },
            step: {
                type: jspsych.ParameterType.INT,
                default: 1,
                array: true,
            },
            labels: {
                type: jspsych.ParameterType.HTML_STRING,
                default: [],
                array: true,
            },
            slider_width: {
                type: jspsych.ParameterType.INT,
                default: null,
            },
            button_label: {
                type: jspsych.ParameterType.STRING,
                default: "Continue",
                array: false,
            },
            require_movement: {
                type: jspsych.ParameterType.BOOL,
                default: false,
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                default: null,
            },
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                default: null,
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                default: null,
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                default: true,
            },
            canvas_size: {
                type: jspsych.ParameterType.INT,
                array: true,
                default: [500, 500],
            },
            slider_spacing: {
                type: jspsych.ParameterType.INT,
                default: 200,
                array: false,
            },
        },
        data: {
            rt: {
                type: jspsych.ParameterType.INT,
            },
            response: {
                type: jspsych.ParameterType.STRING,
                array: true,
            },
        },
    };
    class CanvasSliderResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        static info = info;
        trial(display_element, trial) {
            var html = '<div id="jspsych-canvas-slider-response-wrapper" style="margin: 100px 0px;">';
            html +=
                '<div id="jspsych-canvas-slider-response-stimulus"><canvas id="jspsych-canvas-stimulus" height="' +
                trial.canvas_size[0] +
                '" width="' +
                trial.canvas_size[1] +
                '"></canvas></div>';

            // Add container for horizontal layout
            html +=
                '<div style="display: flex; justify-content: center; gap: ' +
                trial.slider_spacing +
                'px; width: 100%;">';

            // Create two slider containers
            for (let i = 0; i < 2; i++) {
                html += '<div class="jspsych-canvas-slider-response-container" style="position:relative; width:';

                if (trial.slider_width !== null) {
                    html += trial.slider_width + "px;";
                } else {
                    html += Math.floor(trial.canvas_size[1] / 2) + "px;";
                }
                html += '">';
                html +=
                    '<input type="range" class="jspsych-slider" value="' +
                    trial.slider_start[i] +
                    '" min="' +
                    trial.min[i] +
                    '" max="' +
                    trial.max[i] +
                    '" step="' +
                    trial.step[i] +
                    '" style="width: 100%;" id="jspsych-canvas-slider-response-response-' +
                    i +
                    '"></input>';

                // Add tick marks
                html += '<div style="position: relative; width: 100%; height: 10px; margin-top: 5px;">';
                const range = trial.max[i] - trial.min[i];
                const tickCount = range / 10;
                for (let j = 0; j <= tickCount; j++) {
                    const position = (j / tickCount) * 100;
                    html +=
                        '<div style="position: absolute; left: ' +
                        position +
                        '%; width: 1px; height: 10px; background: black;"></div>';
                }
                html += "</div>";

                // Add value display
                html +=
                    '<div style="text-align: center; margin-top: 0.5em; font-size: 1.2em;" id="jspsych-canvas-slider-response-value-' +
                    i +
                    '">' +
                    trial.slider_start[i] +
                    "</div>";

                // Add word above initial slider position
                if (trial.slider_labels && trial.slider_labels[i]) {
                    const initialPosition =
                        ((trial.slider_start[i] - trial.min[i]) / (trial.max[i] - trial.min[i])) * 100;
                    html +=
                        '<div style="position: absolute; left: ' +
                        initialPosition +
                        '%; transform: translateX(-50%); bottom: 100%; font-weight: bold;">' +
                        trial.slider_labels[i] +
                        "</div>";
                }

                html += "<div>";
                for (var j = 0; j < trial.labels.length; j++) {
                    var width = 100 / (trial.labels.length - 1);
                    var left_offset = j * (100 / (trial.labels.length - 1)) - width / 2;
                    html +=
                        '<div style="display: inline-block; position: absolute; left:' +
                        left_offset +
                        "%; text-align: center; width: " +
                        width +
                        '%;">';
                    html += '<span style="text-align: center; font-size: 120%;">' + trial.labels[j] + "</span>";
                    html += "</div>";
                }
                html += "</div>";
                html += "</div>";
            }

            html += "</div>"; // Close the horizontal container
            html += "</div>";

            // Move prompt above sliders
            if (trial.prompt !== null) {
                html =
                    '<div style="text-align: left; margin-bottom: -25em; font-size: 150%; font-weight: bold;">' +
                    trial.prompt +
                    "</div>" +
                    html;
            }

            html +=
                '<button id="jspsych-canvas-slider-response-next" class="jspsych-btn" ' +
                (trial.require_movement ? "disabled" : "") +
                ">" +
                trial.button_label +
                "</button>";
            display_element.innerHTML = html;
            let c = document.getElementById("jspsych-canvas-stimulus");
            c.style.display = "block";
            trial.stimulus(c);
            var response = {
                rt: null,
                response: [null, null],
            };
            const end_trial = () => {
                var trialdata = {
                    rt: response.rt,
                    response: response.response,
                    slider_labels: trial.slider_labels,
                };
                this.jsPsych.finishTrial(trialdata);
            };
            if (trial.require_movement) {
                const sliders = [
                    display_element.querySelector("#jspsych-canvas-slider-response-response-0"),
                    display_element.querySelector("#jspsych-canvas-slider-response-response-1"),
                ];

                const check_sliders = () => {
                    // Enable button only if both sliders have been moved
                    if (sliders[0].value != trial.slider_start[0] && sliders[1].value != trial.slider_start[1]) {
                        display_element.querySelector("#jspsych-canvas-slider-response-next").disabled = false;
                    }
                };

                // Add event listeners to both sliders
                sliders.forEach((slider) => {
                    slider.addEventListener("mousedown", check_sliders);
                    slider.addEventListener("touchstart", check_sliders);
                    slider.addEventListener("change", check_sliders);
                });
            }
            display_element.querySelector("#jspsych-canvas-slider-response-next").addEventListener("click", () => {
                var endTime = performance.now();
                response.rt = Math.round(endTime - startTime);
                response.response = [
                    display_element.querySelector("#jspsych-canvas-slider-response-response-0").valueAsNumber,
                    display_element.querySelector("#jspsych-canvas-slider-response-response-1").valueAsNumber,
                ];
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
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            }
            var startTime = performance.now();

            // Add event listeners to update value displays
            for (let i = 0; i < 2; i++) {
                const slider = display_element.querySelector("#jspsych-canvas-slider-response-response-" + i);
                const valueDisplay = display_element.querySelector("#jspsych-canvas-slider-response-value-" + i);

                slider.addEventListener("input", () => {
                    valueDisplay.textContent = slider.value;
                });
            }
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

    return CanvasSliderResponsePlugin;
})(jsPsychModule);
