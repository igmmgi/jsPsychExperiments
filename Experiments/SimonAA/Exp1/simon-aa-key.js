// Simon task with image presented to left/right screen location
// A circle moves in the direction of the respone key
jsPsych.plugins['simon-aa-key'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'simon-aa-key',
    description: '',
    parameters: {
      canvas_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Canvas Colour',
        default: 'white',
        description: 'Canvas Colour.',
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Canvas Size',
        default: [1280, 960],
        description: 'Canvas Size.',
      },
      canvas_border: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Border Style',
        default: '0px solid black',
        description: 'Border Style',
      },
      image: {
        pretty_name: 'Stimulus',
        default: 'Hello, world!',
        description: 'Stimulus',
      },
      image_position: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus Position',
        default: [0, 0],
        description: 'Stimulus Position',
      },
      image_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image Size',
        default: 1,
        description: 'Image Size',
      },
      circle_position: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle Position',
        default: 0,
        description: 'Circle Position',
      },
      circle_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Circle Colour',
        default: 'grey',
        description: 'Circle Colour',
      },
      circle_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle Size',
        default: 30,
        description: 'Circle Size',
      },
      circle_eccentricity: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle Eccentricity',
        default: 250,
        description: 'Circle Eccentricity',
      },
      circle_speed: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle Speed',
        default: 20,
        description: 'Circle Speed',
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // setup canvas

    const new_html =
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
    ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
    let canvas_rect = [-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height];
    ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

    // store response
    let response = {
      rt: null,
      key: null,
    };

    let moving_circle;
    let stopAnimation = false;

    // initial draw
    draw();

    // clear the canvas and draw text
    function draw() {
      'use strict';

      // clear canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      // draw image
      ctx.drawImage(
        trial.image,
        (-trial.image.width * trial.image_size) / 2 - trial.image_position,
        (-trial.image.height * trial.image_size) / 2,
        trial.image.width * trial.image_size,
        trial.image.height * trial.image_size,
      );

      // draw circle
      ctx.beginPath();
      ctx.arc(trial.circle_position, 0, trial.circle_size, 0, 2 * Math.PI, false);
      ctx.fillStyle = trial.circle_colour;
      ctx.fill();
    }

    function draw_moving_circle() {
      // clear canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      // draw image
      ctx.drawImage(
        trial.image,
        (-trial.image.width * trial.image_size) / 2 - trial.image_position,
        (-trial.image.height * trial.image_size) / 2,
        trial.image.width * trial.image_size,
        trial.image.height * trial.image_size,
      );

      // draw circle
      if (response.key === trial.choices[0]) {
        trial.circle_position -= trial.circle_speed;
      } else if (response.key === trial.choices[1]) {
        trial.circle_position += trial.circle_speed;
      }
      if (Math.abs(trial.circle_position) > trial.circle_eccentricity) {
        end_trial();
      }
      ctx.beginPath();
      ctx.arc(trial.circle_position, 0, trial.circle_size, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'grey';
      ctx.fill();

      if (!stopAnimation) {
        moving_circle = window.requestAnimationFrame(draw_moving_circle);
      }
    }

    // function to end trial when it is time
    let end_trial = function () {
      'use strict';

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      window.cancelAnimationFrame(moving_circle);
      stopAnimation = true;

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      let trial_data = {
        rt: response.rt,
        key_press: response.key,
      };

      // cleat the display and move on to the next trial
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    let after_response = function (info) {
      window.requestAnimationFrame(draw_moving_circle);
      if (response.key == null) {
        response = info;
      }
    };

    // start the response listener
    if (trial.choices !== jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false,
      });
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
