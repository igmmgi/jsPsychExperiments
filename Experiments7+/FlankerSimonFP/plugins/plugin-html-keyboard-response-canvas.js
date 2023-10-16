var jsPsychHtmlKeyboardResponseCanvas = (function(jspsych) {
  'use strict';

  const info = {
    name: 'html-keyboard-response-canvas',
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed',
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        array: true,
        pretty_name: 'Choices',
        default: 'ALL_KEYS',
        description: 'The keys the subject is allowed to press to respond to the stimulus.',
      },
      canvas_colour: {
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'rgba(100, 100, 100, 0.5)',
        description: 'Canvas colour.',
      },
      canvas_size: {
        type: jspsych.ParameterType.Array,
        pretty_name: 'Size',
        default: [1280, 960],
        description: 'Canvas size.',
      },
      canvas_border: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Border',
        default: '10px solid black',
        description: 'Border style',
      },
      translate_origin: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Translate',
        default: false,
        description: 'Translate origin to center',
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.',
      },
    },
  };

  class HtmlKeyboardResponseCanvasPlugin {
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
        trial.stimulus +
        '</div>';

      display_element.innerHTML = new_html;

      let canvas = document.querySelector('canvas');
      let ctx = canvas.getContext('2d');

      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        // only record the first response
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
          display_element.querySelector('#stimulus').style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }

      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
      }
    }
  }

  HtmlKeyboardResponseCanvasPlugin.info = info;
  return HtmlKeyboardResponseCanvasPlugin;
})(jsPsychModule);
