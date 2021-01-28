/**
 * jspsych-resize
 * Steve Chao
 *
 * plugin for controlling the real world size of the display
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['check-screen-resolution'] = (function () {
  var plugin = {};

  plugin.info = {
    name: 'check-screen-resolution',
    description: 'Check screen resolution',
    parameters: {
      width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Minimum screen width',
        default: null,
        description: 'The minimum screen resolution (width).',
      },
      height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Minimum screen height',
        default: null,
        description: 'The minimum screen resolution (height).',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // MINIMUM SIZE

    console.log('here');
    document.body.style.zoom = '100%';

    var pixel_ratio = window.devicePixelRatio;
    var screen_width = window.screen.width * pixel_ratio;
    var screen_height = window.screen.height * pixel_ratio;

    if (screen_width < trial.width || screen_height < trial.height) {
      var msg =
        '<p>Your screen resolution too small to complete this experiment. ' +
        'You will not be able to complete this experiment.</p>' +
        '<p>The minimum required resolution is ' +
        trial.width +
        ' x ' +
        trial.height +
        ' px.</p>' +
        '<p>Your calculated screen resolution is ' +
        screen_width +
        ' x ' +
        screen_height +
        ' px.</p>';
      display_element.innerHTML = msg;
    } else {
      end_trial();
    }

    // function to end trial
    function end_trial() {
      // clear the screen
      display_element.innerHTML = '';

      // finishes trial
      jsPsych.finishTrial();
    }
  };

  return plugin;
})();
