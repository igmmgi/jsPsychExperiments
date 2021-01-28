/**
 * jspsych-resize
 * Steve Chao
 *
 * plugin for controlling the real world size of the display
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['checksize'] = (function () {
  var plugin = {};

  plugin.info = {
    name: 'checksize',
    description: '',
    parameters: {
      size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Item width',
        default: 1,
        description: 'The width of the item to be measured.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    var mw = trial.size[0];
    var mh = trial.size[1];

    // MINIMUM SIZE
    var pixel_ratio = window.devicePixelRatio;
    console.log('Pixel Ratio', pixel_ratio);
    var screen_width = window.screen.width * pixel_ratio;
    var screen_height = window.screen.height * pixel_ratio;
    console.log(screen_width);
    console.log(screen_height);

    if (screen_width < mw || screen_height < mh) {
      var msg =
        '<p>Your screen resolution too small to complete this experiment. ' +
        'You will not be able to complete this experiment.</p>' +
        '<p>The minimum width is ' +
        mw +
        'px. Your current width is ' +
        screen_width +
        'px.</p>' +
        '<p>The minimum height is ' +
        mh +
        'px. Your current height is ' +
        screen_height +
        'px.</p>';
      display_element.innerHTML = msg;
    } else {
      end_trial();
    }

    // function to end trial
    function end_trial() {
      // gather the data to store for the trial
      let trial_data = {
        screen_width: screen_width,
        screen_height: screen_height,
        pixel_ratio: pixel_ratio,
      };

      // clear the screen
      display_element.innerHTML = '';

      // finishes trial
      jsPsych.finishTrial(trial_data);
    }
  };

  return plugin;
})();
