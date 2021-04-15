/**
 * check-screen-resolution
 **/

jsPsych.plugins['check-screen-resolution'] = (function () {
  let plugin = {};
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
    // window.devicePixelRatio on safari?
    let isSafari = navigator.vendor === 'Apple Computer, Inc.';
    let zoom_level = window.devicePixelRatio;
    let screen_width = window.screen.width * zoom_level;
    let screen_height = window.screen.height * zoom_level;
    let current_width = window.innerWidth;
    let current_height = window.innerHeight;
    let msg, zoom_msg;

    let check_size = window.setInterval(function () {
      if (current_width < trial.width || current_height < trial.height) {
        current_width = window.innerWidth;
        current_height = window.innerHeight;
        zoom_level = window.devicePixelRatio;
        zoom_msg = isSafari ? '' : 'Your current zoom level is ' + Math.round(zoom_level * 100) + ' %';
        msg =
          `<h3>Your screen resolution too small to complete this experiment. Try and adjust zoom level to 100%!<br><br>
                    The minimum width is ` +
          trial.width +
          'px. Your current width is ' +
          current_width +
          'px.<br>' +
          'The minimum height is ' +
          trial.height +
          'px. Your current height is ' +
          current_height +
          'px.<br>' +
          zoom_msg +
          '<br><br>If your browser window is already at 100%, you will not be able to complete this experiment.</h3>';
        display_element.innerHTML = msg;
      } else {
        clearInterval(check_size);
        end_trial();
      }
    }, 100);

    // function to end trial
    function end_trial() {
      let trial_data = {
        native_screen_width: screen_width,
        native_screen_height: screen_height,
        screen_width: current_width,
        screen_height: current_height,
        isSafari: isSafari,
        zoom_level: zoom_level,
      };
      // clear the screen
      display_element.innerHTML = '';
      // finishes trial
      jsPsych.data.addProperties(trial_data);
      jsPsych.finishTrial(trial_data);
    }
  };
  return plugin;
})();
