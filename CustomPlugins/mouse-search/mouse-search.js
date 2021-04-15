// custom jspsych mouse text mask

jsPsych.plugins['mouse-search'] = (function () {
  let plugin = {};
  plugin.info = {
    name: 'mouse-search',
    description: '',
    parameters: {
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
      images: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Images',
        default: ['http://placekitten.com/500/500'],
        description: 'Images ',
      },
      image_position: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Image Positions',
        // default: [[50, 50, 100, 100], [1180, 100, 200, 200], [1130, 810, 300, 300], [200, 760, 400, 400]],
        default: [[640, 480, 500, 500]],
        description: 'Image Positions',
      },
      filter: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Filter',
        default: 'none',
        description: 'Filter',
      },
      mask_radius: {
        type: jsPsych.plugins.parameterType.INT,
        array: false,
        pretty_name: 'Mask Size',
        default: 50,
        description: 'Mask Size',
      },
      mask_offset: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Mask Offset',
        default: [0, -30],
        description: 'Mask Offset',
      },
      mask_scale: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Mask Scale',
        default: [1, 1],
        description: 'Mask Scale',
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
    display_element.innerHTML =
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
        if (response.button !== null) {
          document.removeEventListener('contextmenu', cm, false);
        }
      },
      false,
    );

    let canvas = document.getElementById('canvas');
    let ctx = document.getElementById('canvas').getContext('2d');
    let rect = canvas.getBoundingClientRect();

    // data
    let end_rt;
    let mpos;
    let x_coords = [];
    let y_coords = [];
    let time = [];

    // canvas mouse events
    canvas.addEventListener('mousemove', mousePosition);
    canvas.addEventListener('mousedown', mouseResponse);

    // initial draw
    let start_time = performance.now();

    // function to end trial when it is time
    function end_trial() {
      'use strict';
      end_rt = performance.now() - start_time;

      // gather the data to store for the trial
      let trial_data = {
        end_rt: end_rt,
        end_x: Math.round(x_coords[x_coords.length - 1]),
        end_y: Math.round(y_coords[y_coords.length - 1]),
        x_coords: roundArray(x_coords),
        y_coords: roundArray(y_coords),
        time: time,
      };

      // remove canvas mouse events
      canvas.removeEventListener('mousemove', mousePosition);
      canvas.removeEventListener('mousedown', mouseResponse);

      // clear the display and move on the the next trial
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }

    function mousePosition(e) {
      mpos = {
        x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
      x_coords.push(mpos.x);
      y_coords.push(mpos.y);
      time.push(performance.now() - start_time);
      draw();
    }

    let img = [];
    trial.images.forEach((image, idx) => {
      img.push(new Image());
      img[idx].src = image;
    });

    // store response
    let response = {
      rt: null,
      button: null,
    };

    function mouseResponse(e) {
      if (e.buttons === 1) {
        response.rt = performance.now() - start_time;
        response.button = 1;
        end_trial();
      }
    }

    function draw() {
      canvas.width = canvas.width;

      // canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      trial.image_position.forEach((pos) => {
        ctx.drawImage(img[0], pos[0] - pos[2] / 2, pos[1] - pos[3] / 2, pos[2], pos[3]);
      });

      // mask
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.filter = trial.filter;
      ctx.arc(
        mpos.x / trial.mask_scale[0] + trial.mask_offset[0],
        mpos.y / trial.mask_scale[1] + trial.mask_offset[1],
        trial.mask_radius,
        0,
        Math.PI * 2,
        true,
      );
      ctx.fill();
      ctx.restore();
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
