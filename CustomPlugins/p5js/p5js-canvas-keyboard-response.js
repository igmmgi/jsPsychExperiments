jsPsych.plugins['p5js-canvas-keyboard-response'] = (function () {
    let plugin = {};

    plugin.info = {
        name: 'p5js-canvas-keyboard-response',
        description: '',
        parameters: {
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                array: true,
                pretty_name: 'Choices',
                default: jsPsych.ALL_KEYS,
                description: 'The keys the subject is allowed to press to respond to the stimulus.',
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'ResponseEndsTrial',
                default: true,
                description: 'If true, then trial will end when user responds.',
            },
        },
    };

    plugin.trial = function (display_element, trial) {
        // setup canvas
        var new_html = "<div id='p5js_container'></div>" ;
        display_element.innerHTML = new_html;

        const p5js_canvas = p5js.createCanvas(800, 800);
        p5js_canvas.parent(p5js_container)

        // store response
        let response = {
            rt: null,
            key: null,
        };

        // function to end trial when it is time
        let end_trial = function () {
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
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
            jsPsych.finishTrial(trial_data);
        };

        // function to handle responses by the subject
        let after_response = function (info) {
            if (response.key == null) {
                response = info;
            }
            if (trial.response_ends_trial) {
                end_trial();
            }
        };

        // start the response listener
        if (trial.choices !== jsPsych.NO_KEYS) {
            var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.choices,
                rt_method: 'performance',
                persist: false,
                allow_held_key: false,
            });
        }
    }

    return plugin;
})();
