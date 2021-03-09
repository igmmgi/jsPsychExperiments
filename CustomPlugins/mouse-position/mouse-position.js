// Custom plugin adapted from html-keyboard-response

jsPsych.plugins['html-mouse-position-canvas'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'html-mouse-position-canvas',
    description: '',
    parameters: {
      canvas_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'rgba(200, 200, 200, 1)',
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
    // setup canvas
    var new_html =
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

    display_element.innerHTML = new_html;
    let canvas = document.getElementById('canvas');
    let ctx = document.getElementById('canvas').getContext('2d');
    let rect = canvas.getBoundingClientRect();

    ctx.fillStyle = trial.canvas_colour;
    let canvas_rect;
    if (trial.translate_origin) {
      ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
      canvas_rect = [-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height];
    } else {
      canvas_rect = [0, 0, canvas.width, canvas.height];
    }
    ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

    canvas.addEventListener('mousedown', (e) => {
      if (e.which === 1) {
        handleMouseDown(e);
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      handleMouseMove(e);
    });

    // text to display coordinates
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // data
    let start_time = performance.now();
    let x_coords = [];
    let y_coords = [];
    let time = [];
    let mpos = { x: 0, y: 0 };

    draw();
    // trial is initiated by pressing the mouse button inside the start box
    function handleMouseDown(e) {
      end_trial();
    }

    function mousePosition(e) {
      mpos = {
        x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
      if (trial.translate_origin) {
        mpos.x = mpos.x - canvas.width / 2;
        mpos.y = mpos.y - canvas.height / 2;
      }
    }

    function handleMouseMove(e) {
      mousePosition(e);
      // store coordinates and time array
      x_coords.push(mpos.x);
      y_coords.push(mpos.y);
      time.push(performance.now() - start_time);
      draw();
    }

    function draw() {
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      ctx.fillStyle = 'black';
      let xtxt = `xpos: ${Math.round(mpos.x)} px`;
      let ytxt = `ypos: ${Math.round(mpos.y)} px`;
      if (trial.translate_origin) {
        ctx.fillText('Origin: Center', 0, -75);
        ctx.fillText(xtxt, 0, -25);
        ctx.fillText(ytxt, 0, 25);
        ctx.beginPath();
        ctx.moveTo(-canvas.width, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();
      } else {
        ctx.fillText('Origin: Top Left', canvas.width / 2, canvas.height / 2 - 75);
        ctx.fillText(xtxt, canvas.width / 2, canvas.height / 2 - 25);
        ctx.fillText(ytxt, canvas.width / 2, canvas.height / 2 + 25);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
      }
    }

    // function to end trial when it is time
    let end_trial = function () {
      // gather the data to store for the trial
      let trial_data = {
        x_coords: x_coords,
        y_coords: y_coords,
        time: time,
      };

      // move on to the next trial
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    };

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
