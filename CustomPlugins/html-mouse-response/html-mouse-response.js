/**
 * jspsych-html-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['html-mouse-response'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'html-mouse-response',
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
        default: [true, true, true],
        description:
          'The mouse buttons (left/middle/right) the subject is allowed to press to respond to the stimulus.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.',
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
    var new_html = '<div id="html-mouse-response-stimulus">' + trial.stimulus + '</div>';

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

    // add prompt
    if (trial.prompt !== null) {
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // start time
    let start_time = performance.now();

    // canvas mouse events
    $('#html-mouse-response-stimulus').mousedown(function (e) {
      mouseResponse(e);
    });

    function mouseResponse(e) {
      if ((e.which === 1) & trial.choices[0]) {
        response.button = 1;
      } else if ((e.which === 2) & trial.choices[1]) {
        response.button = 2;
      } else if ((e.which === 3) & trial.choices[2]) {
        response.button = 3;
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
      button: null,
    };

    // function to end trial when it is time
    let end_trial = function () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      let trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        button_press: response.button,
      };

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
