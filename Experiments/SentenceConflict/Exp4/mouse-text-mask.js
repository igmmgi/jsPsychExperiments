// cusotm jspsych mouse drag response using code adapted from:
// https://stackoverflow.com/questions/21605942/drag-element-on-canvas

jsPsych.plugins['mouse-text-mask'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'mouse-text-mask',
    description: '',
    parameters: {
      func_args: {
        type: jsPsych.plugins.parameterType.DICT,
        array: true,
        pretty_name: 'Args',
        default: {},
        description: 'Function arguments',
      },
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
      scale_factor: {
        type: jsPsych.plugins.parameterType.FLOAT,
        array: false,
        pretty_name: 'Scale',
        default: 1,
        description: 'Scale Factor',
      },
      response_border: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'ResponseBorder',
        default: [100, 620],
        description: 'Border style',
      },
      sentence: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Word',
        default: 'Hello, world!',
        description: 'StimulusText',
      },
      colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Colour',
        default: 'black',
        description: 'StimulusColour',
      },
      font: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Colour',
        default: '80px arial',
        description: 'Font',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'TrialDuration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    // setup canvas
    display_element.innerHTML = "<canvas id='canvas'></canvas>";
    let canvas = document.getElementById('canvas');

    canvas.style = 'position: absolute; top: 0px; left: auto; right: auto; bottom: 0px; margin: auto;';
    canvas.width = trial.canvas_size[0];
    canvas.height = trial.canvas_size[1];
    canvas.style.border = trial.canvas_border;
    canvas.style.left = -trial.canvas_size[0] / 2 + 'px';

    let ctx = document.getElementById('canvas').getContext('2d');
    let canvasOffset = $(canvas).offset();
    let offsetX = canvasOffset.left;
    let offsetY = canvasOffset.top;
    let end_rt;
    let end_loc;

    let x_coords = [];
    let y_coords = [];
    let time = [];

    canvas.addEventListener(
      'mousemove',
      function (e) {
        var mouse = getMouse(e, canvas);
        draw(mouse);
      },
      false,
    );

    canvas.addEventListener(
      'mousedown',
      function (e) {
        handleMouseDown(e);
      },
      false,
    );

    // initial draw
    let start_time = performance.now();

    // function to end trial when it is time
    let end_trial = function () {
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

      canvas.width = canvas.width;

      // clear the display
      display_element.innerHTML = "<canvas id='canvas'></canvas>";

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    function getMouse(e) {
      e.preventDefault();
      let X = (parseInt(e.clientX) - offsetX) / trial.scale_factor;
      let Y = (parseInt(e.clientY) - offsetY) / trial.scale_factor;

      // store coordinates and time array
      x_coords.push(X);
      y_coords.push(Y);
      time.push(performance.now() - start_time);
      return {
        x: X,
        y: Y,
      };
    }

    function handleMouseDown(e) {
      end_trial();
    }

    // clear the canvas and draw text
    function draw(mouse) {
      canvas.width = canvas.width;

      // ctx.filter = 'blur(1px)';
      ctx.fillStyle = trial.mask_colour;
      ctx.ellipse(mouse.x, mouse.y, 40, 60, Math.PI / 2, 0, 2 * Math.PI);
      // ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2, true);
      ctx.clip();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = trial.font;

      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'black';
      ctx.fillText(trial.sentence, canvas.width / 2, canvas.height / 2);
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
