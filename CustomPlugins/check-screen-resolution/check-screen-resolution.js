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

    var pixel_ratio = window.devicePixelRatio;
    var screen_width = window.screen.width * pixel_ratio;
    var screen_height = window.screen.height * pixel_ratio;

    if (screen_width < trial.width || screen_height < trial.height) {
      var interval = setInterval(function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var pixel_ratio = window.devicePixelRatio;
        if (w < trial.width || h < trial.height) {
          var msg =
            `<h3>Your screen resolution too small to complete this experiment. Try and  
            adjust zoom level to 100%!<br><br>
            The minimum width is ` +
            trial.width +
            `px. Your current width is ` +
            w +
            `px.<br> The minimum height is ` +
            trial.height +
            `px. Your current height is ` +
            h +
            `px.<br> Your current zoom level is ` +
            Math.round(pixel_ratio * 100) +
            ' %</p>' +
            '<br><br>If your browser window is already at 100%, you will not be able to complete this experiment.</p>';
          display_element.innerHTML = msg;
        } else {
          clearInterval(interval);
          end_trial();
        }
      }, 100);
      return; // prevents checking other exclusions while this is being fixed
    }
    end_trial();

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
