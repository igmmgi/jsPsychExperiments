var jsPsychVideoKeyboardResponse = (function (jspsych) {
    "use strict";

    var _package = {
        name: "@jspsych/plugin-video-keyboard-response",
        version: "2.0.0",
        description: "jsPsych plugin for playing a video file and getting a keyboard response",
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
            test: "jest --passWithNoTests",
            "test:watch": "npm test -- --watch",
            tsc: "tsc",
            build: "rollup --config",
            "build:watch": "npm run build -- --watch",
        },
        repository: {
            type: "git",
            url: "git+https://github.com/jspsych/jsPsych.git",
            directory: "packages/plugin-video-keyboard-response",
        },
        author: "Josh de Leeuw",
        license: "MIT",
        bugs: {
            url: "https://github.com/jspsych/jsPsych/issues",
        },
        homepage: "https://www.jspsych.org/latest/plugins/video-keyboard-response",
        peerDependencies: {
            jspsych: ">=7.1.0",
        },
        devDependencies: {
            "@jspsych/config": "^3.0.0",
            "@jspsych/test-utils": "^1.2.0",
        },
    };

    const info = {
        name: "video-keyboard-response",
        version: _package.version,
        parameters: {
            stimulus: {
                type: jspsych.ParameterType.VIDEO,
                pretty_name: "Video",
                default: void 0,
                array: true,
            },
            video_scale: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Video scale",
                default: 1.0,
                description: "Scale factor for the video (1.0 = original size)",
            },
            maintain_aspect_ratio: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Maintain aspect ratio",
                default: true,
            },
            choices: {
                type: jspsych.ParameterType.KEYS,
                pretty_name: "Choices",
                default: "ALL_KEYS",
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },
            prompt_font_size: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Prompt font size",
                default: "24px",
            },
            prompt_font_weight: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Prompt font weight",
                default: "normal",
            },
            prompt_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Prompt color",
                default: "black",
            },
            prompt_position: {
                type: jspsych.ParameterType.SELECT,
                pretty_name: "Prompt position",
                options: ["top", "bottom"],
                default: "top",
            },
            prompt_align: {
                type: jspsych.ParameterType.SELECT,
                pretty_name: "Prompt alignment",
                options: ["left", "center", "right"],
                default: "center",
            },
            prompt_margin: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Prompt margin",
                default: "10px",
            },
            prompt_offset: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Prompt vertical offset",
                default: 0,
            },
            show_squares: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Show squares",
                default: false,
            },
            square_size: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Square size",
                default: 50,
            },
            left_square_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Left square color",
                default: "red",
            },
            right_square_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Right square color",
                default: "blue",
            },
            square_offset: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Square vertical offset",
                default: 10,
            },
            square_x_offset: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Square horizontal offset",
                default: 10,
            },
            square_y_offset: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Square vertical offset",
                default: 10,
            },
            square_border_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Square border width",
                default: 0,
            },
            mask_video: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Mask video",
                default: false,
            },
            width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Width",
                default: "",
            },
            height: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Height",
                default: "",
            },
            autoplay: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Autoplay",
                default: true,
            },
            controls: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Controls",
                default: false,
            },
            start: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Start",
                default: null,
            },
            stop: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Stop",
                default: null,
            },
            rate: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Rate",
                default: 1,
            },
            trial_ends_after_video: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "End trial after video finishes",
                default: false,
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
            response_allowed_while_playing: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response allowed while playing",
                default: true,
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },
        },
        data: {
            response: {
                type: jspsych.ParameterType.STRING,
            },
            rt: {
                type: jspsych.ParameterType.INT,
            },
            stimulus: {
                type: jspsych.ParameterType.STRING,
                array: true,
            },
        },
    };
    class VideoKeyboardResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        static info = info;
        trial(display_element, trial) {
            if (trial.stimulus !== null && !Array.isArray(trial.stimulus)) {
                throw new Error(`
        The stimulus property for the video-keyboard-response plugin must be an array
        of files. See https://www.jspsych.org/latest/plugins/video-keyboard-response/#parameters
      `);
            }

            // Calculate dimensions upfront
            const base_width = 1920; // Base video width
            const base_height = 1080; // Base video height
            const video_width = Math.round(base_width * trial.video_scale);
            const video_height = Math.round(base_height * trial.video_scale);
            const prompt_height = trial.prompt !== null ? 120 : 0;
            const prompt_width = video_width * 1.5;
            const total_height = video_height + trial.square_y_offset + trial.square_size + prompt_height;

            // Create main container with fixed dimensions
            var container_style =
                "position: relative; width: " + prompt_width + "px; height: " + total_height + "px; margin: 0 auto;";
            var video_html = '<div style="' + container_style + '">';

            // Add prompt if present (now above video)
            if (trial.prompt !== null) {
                var prompt_style =
                    "position: absolute; top: " +
                    trial.prompt_offset +
                    "px; left: 0; width: 100%; " +
                    "font-size: " +
                    trial.prompt_font_size +
                    "; " +
                    "font-weight: " +
                    trial.prompt_font_weight +
                    "; " +
                    "color: " +
                    trial.prompt_color +
                    "; " +
                    "text-align: " +
                    trial.prompt_align +
                    "; " +
                    "margin: " +
                    trial.prompt_margin +
                    "; " +
                    "white-space: nowrap; " +
                    "overflow: hidden; " +
                    "text-overflow: ellipsis; " +
                    "padding: 40px 0; " +
                    "line-height: 1.4;";
                video_html += '<div style="' + prompt_style + '">' + trial.prompt + "</div>";
            }

            // Create video container with fixed position
            var video_container_style =
                "position: absolute; top: " +
                prompt_height +
                "px; left: " +
                (prompt_width - video_width) / 2 +
                "px; width: " +
                video_width +
                "px; height: " +
                video_height +
                "px;";
            video_html += '<div style="' + video_container_style + '">';

            if (trial.stimulus !== null) {
                var video_style = "width: 100%; height: 100%; opacity: 0; transition: opacity 0.1s;";
                if (trial.maintain_aspect_ratio) {
                    video_style += "object-fit: contain;"; // Maintain aspect ratio
                } else {
                    video_style += "object-fit: fill;"; // Fill container (may distort)
                }
                if (trial.start !== null || trial.mask_video) {
                    video_style += "visibility: hidden;";
                }
                video_html += '<video id="jspsych-video-keyboard-response-stimulus" style="' + video_style + '"';
                if (trial.autoplay && !trial.mask_video && trial.start === null) {
                    video_html += " autoplay";
                }
                if (trial.controls) {
                    video_html += " controls ";
                }
                video_html += ">";
                var video_preload_blob = this.jsPsych.pluginAPI.getVideoBuffer(trial.stimulus[0]);
                if (!video_preload_blob) {
                    for (var i = 0; i < trial.stimulus.length; i++) {
                        var file_name = trial.stimulus[i];
                        if (file_name.indexOf("?") > -1) {
                            file_name = file_name.substring(0, file_name.indexOf("?"));
                        }
                        var type = file_name.substr(file_name.lastIndexOf(".") + 1);
                        type = type.toLowerCase();
                        if (type == "mov") {
                            console.warn(
                                "Warning: video-keyboard-response plugin does not reliably support .mov files.",
                            );
                        }
                        //video_html += '<source src="' + file_name + '" type="video/' + type + '">';
                        video_html += '<source src="' + file_name + '#t=1" type="video/' + type + '">';
                    }
                }
                video_html += "</video>";
            } else {
                video_html += '<div style="width: 100%; height: 100%;"></div>';
            }
            video_html += "</div>"; // Close video container

            // Add squares if enabled
            if (trial.show_squares) {
                var square_style =
                    "width: " +
                    trial.square_size +
                    "px; " +
                    "height: " +
                    trial.square_size +
                    "px; " +
                    "display: inline-block; " +
                    "border: " +
                    trial.square_border_width +
                    "px solid black;";

                var squares_container_style =
                    "position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); " +
                    "display: flex; gap: " +
                    trial.square_x_offset +
                    "px;";

                video_html +=
                    '<div style="' +
                    squares_container_style +
                    '">' +
                    '<div style="' +
                    square_style +
                    " background-color: " +
                    trial.left_square_color +
                    ';"></div>' +
                    '<div style="' +
                    square_style +
                    " background-color: " +
                    trial.right_square_color +
                    ';"></div>' +
                    "</div>";
            }

            video_html += "</div>"; // Close main container
            display_element.innerHTML = video_html;

            var video_element = display_element.querySelector("#jspsych-video-keyboard-response-stimulus");
            if (video_preload_blob) {
                video_element.src = video_preload_blob;
            }

            // Ensure video plays when ready
            video_element.onloadedmetadata = () => {
                if (!trial.mask_video && trial.start === null) {
                    video_element.style.visibility = "visible";
                    video_element.style.opacity = "1";
                    if (trial.autoplay) {
                        video_element.play().catch(function (error) {
                            console.warn("Video autoplay failed:", error);
                        });
                    }
                }
            };

            video_element.onended = () => {
                if (trial.trial_ends_after_video) {
                    end_trial();
                }
                if (trial.response_allowed_while_playing == false && !trial.trial_ends_after_video) {
                    this.jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: "performance",
                        persist: false,
                        allow_held_key: false,
                    });
                }
            };

            video_element.playbackRate = trial.rate;

            if (trial.start !== null) {
                video_element.pause();
                video_element.onseeked = () => {
                    video_element.style.visibility = "visible";
                    video_element.style.opacity = "1";
                    video_element.muted = false;
                    if (trial.autoplay && !trial.mask_video) {
                        video_element.play().catch(function (error) {
                            console.warn("Video autoplay failed:", error);
                        });
                    } else {
                        video_element.pause();
                    }
                    video_element.onseeked = () => {};
                };
                video_element.onplaying = () => {
                    video_element.currentTime = trial.start;
                    video_element.onplaying = () => {};
                };
                video_element.muted = true;
                if (!trial.mask_video) {
                    video_element.play().catch(function (error) {
                        console.warn("Video autoplay failed:", error);
                    });
                }
            } else if (!trial.mask_video) {
                // Show video immediately if not masked and no start time
                video_element.style.visibility = "visible";
                video_element.style.opacity = "1";
                if (trial.autoplay) {
                    video_element.play().catch(function (error) {
                        console.warn("Video autoplay failed:", error);
                    });
                }
            }

            let stopped = false;
            if (trial.stop !== null) {
                video_element.addEventListener("timeupdate", (e) => {
                    var currenttime = video_element.currentTime;
                    if (currenttime >= trial.stop) {
                        if (!trial.response_allowed_while_playing) {
                            this.jsPsych.pluginAPI.getKeyboardResponse({
                                callback_function: after_response,
                                valid_responses: trial.choices,
                                rt_method: "performance",
                                persist: false,
                                allow_held_key: false,
                            });
                        }
                        video_element.pause();
                        if (trial.trial_ends_after_video && !stopped) {
                            stopped = true;
                            end_trial();
                        }
                    }
                });
            }
            var response = {
                rt: null,
                key: null,
            };
            const end_trial = () => {
                this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
                display_element.querySelector("#jspsych-video-keyboard-response-stimulus").pause();
                display_element.querySelector("#jspsych-video-keyboard-response-stimulus").onended = () => {};
                var trial_data = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    response: response.key,
                };
                this.jsPsych.finishTrial(trial_data);
            };
            var after_response = (info2) => {
                display_element.querySelector("#jspsych-video-keyboard-response-stimulus").className += " responded";
                if (response.key == null) {
                    response = info2;
                }
                if (trial.response_ends_trial) {
                    end_trial();
                }
            };
            if (trial.choices != "NO_KEYS" && trial.response_allowed_while_playing) {
                this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    rt_method: "performance",
                    persist: false,
                    allow_held_key: false,
                });
            }
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
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
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial);
            load_callback();
            const video_element = display_element.querySelector("#jspsych-video-button-response-stimulus");
            const respond = () => {
                if (data.rt !== null) {
                    this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
                }
            };
            if (!trial.response_allowed_while_playing) {
                video_element.addEventListener("ended", respond);
            } else {
                respond();
            }
        }
        create_simulation_data(trial, simulation_options) {
            const default_data = {
                stimulus: trial.stimulus,
                rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
                response: this.jsPsych.pluginAPI.getValidKey(trial.choices),
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
    }

    return VideoKeyboardResponsePlugin;
})(jsPsychModule);
