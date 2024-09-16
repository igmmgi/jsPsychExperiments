var jsPsychImageKeyboardResponse = (function (jspsych) {
  'use strict';

  const info = {
    name: 'image-keyboard-response',
    parameters: {
      /** The image to be displayed */
      stimulus: {
        type: jspsych.ParameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
      },
      /** Set the image height in pixels */
      stimulus_height: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Image height',
        default: null,
      },
      /** Set the image width in pixels */
      stimulus_width: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Image width',
        default: null,
      },
      stimulus_spacing: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Spacing between images',
        default: null,
      },
      /** Maintain the aspect ratio after setting width or height */
      maintain_aspect_ratio: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
      },
      /** Array containing the key(s) the subject is allowed to press to respond to the stimulus. */
      choices: {
        type: jspsych.ParameterType.KEYS,
        pretty_name: 'Choices',
        default: 'ALL_KEYS',
      },
      /** Any content here will be displayed below the stimulus. */
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Prompt',
        default: null,
      },
      /** How long to show the stimulus. */
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
      },
      /** How long to show trial before it ends */
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
      },
      /** If true, trial will end when subject makes a response. */
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
      },
    },
  };
  /**
   * **image-keyboard-response**
   *
   * jsPsych plugin for displaying an image stimulus and getting a keyboard response
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-image-keyboard-response/ image-keyboard-response plugin documentation on jspsych.org}
   */
  class ImageKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      var height, width;
      // display stimulus as an image element
      var html =
        '<img src="' +
        trial.stimulus[0] +
        '" id="jspsych-image-keyboard-response-stimulus0">' +
        '&nbsp'.repeat(trial.stimulus_spacing) +
        '<img src="' +
        trial.stimulus[1] +
        '" id="jspsych-image-keyboard-response-stimulus1">' +
        '&nbsp'.repeat(trial.stimulus_spacing) +
        '<img src="' +
        trial.stimulus[2] +
        '" id="jspsych-image-keyboard-response-stimulus2">';

      // add prompt
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      // update the page content
      display_element.innerHTML = html;

      let img;
      for (let i = 0; i < 3; i++) {
        // set image dimensions after image has loaded (so that we have access to naturalHeight/naturalWidth)
        img = display_element.querySelector(`#jspsych-image-keyboard-response-stimulus${i}`);
        if (trial.stimulus_height !== null) {
          height = trial.stimulus_height;
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
          }
        } else {
          height = img.naturalHeight;
        }
        if (trial.stimulus_width !== null) {
          width = trial.stimulus_width;
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
          }
        } else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
          // if stimulus width is null, only use the image's natural width if the width value wasn't set
          // in the if statement above, based on a specified height and maintain_aspect_ratio = true
          width = img.naturalWidth;
        }
        img.style.height = height.toString() + 'px';
        img.style.width = width.toString() + 'px';
      }

      // store response
      var response = {
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
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.key,
        };

        display_element.innerHTML = '';

        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
      };
      // function to handle responses by the subject
      var after_response = (info) => {
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        // display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';
        // only record the first response
        if (response.key == null) {
          response = info;
        }
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
      // start the response listener
      if (trial.choices != 'NO_KEYS') {
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
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      } else if (trial.response_ends_trial === false) {
        console.warn(
          'The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.',
        );
      }
    }
    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (simulation_mode == 'data-only') {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
      }
      if (simulation_mode == 'visual') {
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
      if (data.rt !== null) {
        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
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
  ImageKeyboardResponsePlugin.info = info;

  return ImageKeyboardResponsePlugin;
})(jsPsychModule);
