// Mouse simon task (Circle follows mouse x position)
jsPsych.plugins['simon-aa-mouse'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'simon-aa-mouse',
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
      start_box: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Start Box',
        default: [0, 0, 100, 100],
        description: 'Start Box',
      },
      start_box_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Start Box Colour',
        default: 'black',
        description: 'Start Box Colour',
      },
      box_linewidth: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Line width of box',
        default: 2,
        description: 'Linewidth of box',
      },
      require_mouse_press_start: {
        type: jsPsych.plugins.parameterType.BOOL,
        array: false,
        pretty_name: 'Require Mouse Press Start',
        default: true,
        description: 'Require Mouse Press Start',
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Duration',
        default: 500,
        description: 'How long to show trial before it ends.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation Duration',
        default: null,
        description: 'How long to show fixation cross.',
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

    // deactivate contextmenu of right mouse button until response
    document.addEventListener(
      'contextmenu',
      function cm(e) {
        e.preventDefault();
        if (e.button !== null) {
          document.removeEventListener('contextmenu', cm, false);
        }
      },
      false,
    );

    display_element.innerHTML = new_html;
    let canvas = document.getElementById('canvas');
    let ctx = document.getElementById('canvas').getContext('2d');
    let rect = canvas.getBoundingClientRect();

    ctx.fillStyle = trial.canvas_colour;
    ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
    let canvas_rect = [-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height];
    ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

    // canvas mouse events
    canvas.addEventListener('mousedown', (e) => {
      if (e.buttons === 1) {
        handleMouseDown(e);
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      handleMouseMove(e);
    });

    // data
    let x_coords = [];
    let time = [];
    let start_time = null;
    let start_rt = null;
    let end_rt = null;
    let end_loc = null;
    let mpos;

    // flags for drawing
    let trial_initiated = false;
    let draw_fixation = false;
    let draw_image = false;
    let movement_initiated = false;

    let draw_start_box = true;
    let start_box = {
      x: trial.start_box[0] - trial.start_box[2] / 2,
      y: trial.start_box[1] - trial.start_box[3] / 2,
      w: trial.start_box[2],
      h: trial.start_box[3],
    };

    // initial draw
    draw();

    // trial is initiated by pressing the mouse button inside the start box
    function handleMouseDown(e) {
      'use strict';
      mousePosition(e);
      if (!trial_initiated) {
        if (in_box(mpos.x, mpos.y, start_box)) {
          start_trial();
        }
      }
    }

    function mousePosition(e) {
      mpos = {
        x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
      mpos.x = mpos.x - canvas.width / 2;
      mpos.y = mpos.y - canvas.height / 2;
    }

    function handleMouseMove(e) {
      mousePosition(e);
      if (!trial_initiated && !trial.require_mouse_press_start) {
        if (in_box(mpos.x, mpos.y, start_box)) {
          start_trial();
        }
      }

      if (trial_initiated === false) {
        return;
      }

      // response movement started?
      if (!movement_initiated && !in_box(mpos.x, mpos.y, start_box)) {
        start_rt = performance.now() - start_time;
        movement_initiated = true;
      }

      // store coordinates and time array
      x_coords.push(mpos.x);
      time.push(performance.now() - start_time);

      if (Math.abs(mpos.x) > trial.circle_eccentricity) {
        end_trial();
      }
      draw();
    }

    // clear the canvas and draw text
    function draw() {
      'use strict';
      // clear canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      // start box
      if (draw_start_box) {
        ctx.beginPath();
        ctx.lineWidth = trial.box_linewidth;
        ctx.strokeStyle = trial.start_box_colour;
        ctx.rect(start_box.x, start_box.y, start_box.w, start_box.h);
        ctx.stroke();
      }

      if (!trial_initiated) {
        return;
      }

      // fixation cross
      if (draw_fixation) {
        ctx.font = '50px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText('+', 0, 0);
        jsPsych.pluginAPI.setTimeout(function () {
          draw_fixation = false;
          draw_image = true;
          draw_start_box = false;
          draw();
        }, trial.fixation_duration);
      }

      if (draw_image) {
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
        ctx.arc(mpos.x, 0, trial.circle_size, 0, 2 * Math.PI, false);
        ctx.fillStyle = trial.circle_colour;
        ctx.fill();
      }
    }

    // test if x, y is inside the bounding box
    function in_box(x, y, box) {
      return (
        x >= box.x - trial.box_linewidth &&
        x <= box.x + box.w + trial.box_linewidth * 2 &&
        y >= box.y - trial.box_linewidth &&
        y <= box.y + box.h + trial.box_linewidth * 2
      );
    }

    // function to start trial when it is time
    let start_trial = function () {
      'use strict';
      trial_initiated = true;
      draw_fixation = true;
      start_time = performance.now();
      draw_start_box = false;

      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function () {
          end_trial();
        }, trial.trial_duration + trial.fixation_duration);
      }
      draw();
    };

    // function to end trial when it is time
    let end_trial = function () {
      'use strict';
      end_rt = performance.now() - start_time;
      end_loc = x_coords[x_coords.length - 1] < 0 ? 'left' : 'right';

      // gather the data to store for the trial
      let trial_data = {
        start_rt: start_rt,
        start_x: Math.round(x_coords[0]),
        end_rt: end_rt,
        end_x: Math.round(x_coords[x_coords.length - 1]),
        end_loc: end_loc,
        x_coords: roundArray(x_coords),
        time: time,
      };

      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseMove);

      // clear the display and move on to the next trial
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);

    };
  };

  return plugin;
})();
