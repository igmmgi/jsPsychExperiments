// 6.1.0 only?

jsPsych.plugins['static-canvas-keyboard-multiple-response-visual-sound'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'static-canvas-keyboard-multiple-response-visual-sound',
    description: '',
    parameters: {
      sound_stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'SoundStimulus',
        default: undefined,
        description: 'The audio to be played.',
      },
      sound_onset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'SoundOnset',
        default: undefined,
        description: 'Start time of audio.',
      },
      func_args: {
        type: jsPsych.plugins.parameterType.DICT,
        array: true,
        pretty_name: 'Args',
        default: {},
        description: 'Function arguments',
      },
      func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        array: true,
        pretty_name: 'Function',
        default: undefined,
        description: 'Function to call',
      },
      clear_screen: {
        type: jsPsych.plugins.parameterType.BOOL,
        array: true,
        pretty_name: 'Clear',
        default: [false],
        description: 'Clear the screen',
      },
      canvas_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'white',
        description: 'Canvas colour.',
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Size',
        default: [1280, 960],
        description: 'Canvas size.',
      },
      canvas_border: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Border',
        default: '0px solid black',
        description: 'Border style',
      },
      translate_origin: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Translate',
        default: false,
        description: 'Translate origin to center',
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.',
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
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'TrialDuration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'ResponseEndsTrial',
        default: true,
        description: 'If true, then trial will end when user responds.',
      },
      number_responses: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'NumberResponses',
        default: 2,
        description: 'Number of responses (1 vs. 2)',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // setup canvas

    let new_html =
      '<div>' +
      '<canvas id="canvas" width="' +
      trial.canvas_size[0] +
      '" height="' +
      trial.canvas_size[1] +
      '" style="border: ' +
      trial.canvas_border +
      ';"></canvas>' +
      '</div>';

    display_element.innerHTML = new_html;
    let canvas = document.getElementById('canvas');
    let ctx = document.getElementById('canvas').getContext('2d');

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

    // if (trial.func.length !== trial.stimulus_onset.length) {
    //   // TO DO
    // }

    if (trial.translate_origin) {
      ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
    }

    // store response
    let response1 = {
      rt: null,
      key: null,
    };

    // store response
    let response2 = {
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
        rt1: response1.rt,
        key_press1: response1.key,
        rt2: response2.rt,
        key_press2: response2.key,
        stimulus: trial.stimulus,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    let after_response = function (info) {
      if (response1.rt === null) {
        if (response1.key == null) {
          response1 = info;
        }
      } else {
        response2 = info;
      }
      // only end trial following 2nd response
      if (trial.number_responses === 2) {
        if (trial.response_ends_trial & (response2.rt !== null)) {
          end_trial();
        }
      } else if (trial.number_responses === 1) {
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
    };

    // start the response listener
    if (trial.choices !== jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: true,
        allow_held_key: false,
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
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
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }

    // draw stimulus/stimuli
    if (trial.stimulus_onset !== null) {
      for (let i = 0; i < trial.func.length; i++) {
        jsPsych.pluginAPI.setTimeout(function () {
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

    // audio
    // console.log(trial
    if (trial.sound_onset !== null) {
      let audio_context = jsPsych.pluginAPI.audioContext();
      let source = audio_context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.sound_stimulus);
      source.connect(audio_context.destination);

      // play audio
      let startTime = audio_context.currentTime;
      source.start(startTime + trial.sound_onset / 1000);
    }
  };

  return plugin;
})();
