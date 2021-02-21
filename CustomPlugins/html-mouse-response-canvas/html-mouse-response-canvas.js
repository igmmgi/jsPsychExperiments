// Custom plugin adapted from html-keyboard-response

jsPsych.plugins['html-mouse-response-canvas'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'html-mouse-response-canvas',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed',
      },
      choices: {
        type: jsPsych.plugins.parameterType.BOOL,
        array: true,
        pretty_name: 'Choices',
        default: [true, true],
        description: 'The mouse buttons (left/right) the subject is allowed to press to respond to the stimulus.',
      },
      canvas_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'rgba(100, 100, 100, 0.5)',
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
        default: '10px solid black',
        description: 'Border style',
      },
      translate_origin: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Translate',
        default: false,
        description: 'Translate origin to center',
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // deactivate contextmenu of right mouse button until response
    document.addEventListener(
      'contextmenu',
      function cm(e) {
        e.preventDefault();
        if (response.button !== null) {
          document.removeEventListener('contextmenu', cm, false);
        }
      },
      false,
    );
    document.addEventListener('mousedown', mouseResponse);

    // setup canvas
    var new_html =
      '<div style="position:relative;">' +
      '<canvas id="canvas" width="' +
      trial.canvas_size[0] +
      '" height="' +
      trial.canvas_size[1] +
      '" style="border: ' +
      trial.canvas_border +
      '; position: fixed; z-index: -1; top: 50%; left: 50%; transform: translate(-50%, -50%);"></canvas>' +
      '<div>' +
      trial.stimulus +
      '</div>' +
      '</div>';

    display_element.innerHTML = new_html;

    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = trial.canvas_colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (trial.translate_origin) {
      ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
    }

    // start time
    let start_time = performance.now();

    function mouseResponse(e) {
      if ((e.buttons === 1) & trial.choices[0]) {
        response.button = 1;
      } else if ((e.buttons === 2) & trial.choices[1]) {
        response.button = 2;
      }
      if (response.button !== null) {
        response.rt = performance.now() - start_time;
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
    }

    // store response
    let response = {
      rt: null,
      key: null,
    };

    // function to end trial when it is time
    let end_trial = function () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      let trial_data = {
        rt: response.rt,
        button_press: response.button,
      };
      document.removeEventListener('mousedown', mouseResponse);

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#html-mouse-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
