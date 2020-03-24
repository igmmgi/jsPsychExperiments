jsPsych.plugins['static-canvas-keyboard-response'] = (function(){

    var plugin = {};

    plugin.info = {
        name: 'static-canvas-keyboard-response',
        description: '',
        parameters: {
            func: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                array: true,
                pretty_name: 'Function',
                default: undefined,
                description: 'Function to call'
            },
            canvas_size:{
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'Size',
                default: [640, 480],
                description: 'Canvas size.'
            },
            canvas_border:{
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Border',
                default: "0px solid black",
                description: 'Border style'
            },
            translate_origin:{
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Translate',
                default: false,
                description: 'Translate origin to center'
            },
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                array: true,
                pretty_name: 'Choices',
                default: jsPsych.ALL_KEYS,
                description: 'The keys the subject is allowed to press to respond to the stimulus.'
            },
            stimulus_onset: {
                type: jsPsych.plugins.parameterType.INT,
                array: true,
                pretty_name: 'StimulusOnset',
                default: [0],
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'StimulusDuration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'TrialDuration',
                default: null,
                description: 'How long to show trial before it ends.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'ResponseEndsTrial',
                default: true,
                description: 'If true, then trial will end when user responds.'
            },
        }
    }

    plugin.trial = function(display_element, trial){

        // setup canvas
        display_element.innerHTML = "<canvas id='canvas'></canvas>";
        canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto;";
        canvas.width  = trial.canvas_size[0]; 
        canvas.height = trial.canvas_size[1];
        canvas.style.border = trial.canvas_border;
       
        if (typeof trial.func === "function") {
            trial.func = [trial.func];
        }
        if (typeof trial.stimulus_onset === "number") {
            trial.stimulus_onset = [trial.stimulus_onset];
        }
        // if (trial.func.length !== trial.stimulus_onset.length) {
        // }
        
        if (trial.translate_origin) {
            let ctx = document.getElementById('canvas').getContext('2d');
            ctx.translate(canvas.width/2, canvas.height/2);  // make center (0, 0)
        }
        
        // store response
        var response = {
            rt: null,
            key: null
        };

        // function to end trial when it is time
        var end_trial = function() {
            
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // gather the data to store for the trial
            var trial_data = {
                "rt": response.rt,
                "stimulus": trial.stimulus,
                "key_press": response.key
            };

            // clear the display 
            display_element.innerHTML = "<canvas id='canvas'></canvas>";

            // move on to the next trial
            jsPsych.finishTrial(trial_data);

        };

        // function to handle responses by the subject
        var after_response = function(info) {
            if (response.key == null) { 
                response = info;
            }
            if (trial.response_ends_trial) {
                end_trial();
            }
        };

        // start the response listener
        if (trial.choices != jsPsych.NO_KEYS) {
            var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: trial.choices,
                rt_method: 'performance',
                persist: false,
                allow_held_key: false
            });
        }

        // hide stimulus if stimulus_duration is set
        if (trial.stimulus_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                display_element.innerHTML = "<canvas id='canvas'></canvas>";
            }, trial.stimulus_duration);
        }

        // end trial if trial_duration is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        }

        // draw stimulus/stimuli
        for (let i in trial.func) {
            jsPsych.pluginAPI.setTimeout(function() {
                trial.func[i]();
            }, trial.stimulus_onset[i]);
        }

    };

    return plugin;

})();
