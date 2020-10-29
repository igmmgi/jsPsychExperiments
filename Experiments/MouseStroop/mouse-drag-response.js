// cusotm jspsych mouse drag response using code adapted from:
// https://stackoverflow.com/questions/21605942/drag-element-on-canvas

jsPsych.plugins['mouse-drag-response'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'mouse-drag-response',
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
        default: [100, 860],
        description: 'Border style',
      },
      word: {
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

    // canvas mouse events
    $('#canvas').mousedown(function (e) {
      handleMouseDown(e);
    });
    $('#canvas').mousemove(function (e) {
      handleMouseMove(e);
    });
    $('#canvas').mouseup(function (e) {
      handleMouseUp(e);
    });

    let canvasOffset = $(canvas).offset();
    let offsetX = canvasOffset.left;

    let offsetY = canvasOffset.top;
    let selectedText = false;
    let startX;
    let startY;
    let movement_initiated = false;
    let start_rt;
    let end_rt;
    let end_loc;
    let n_presses = 0;

    let x_coords = [];
    let y_coords = [];
    let time = [];

    // some text objects
    let text = {
      text: trial.word,
      x: canvas.width / 2,
      y: canvas.height / 2,
      font: trial.font,
    };

    ctx.font = text.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // calculate width of each text for hit-testing purposes
    text.width = ctx.measureText(text.text).width;
    text.height = parseInt(text.font);

    // initial draw
    let start_time = performance.now();
    draw();

    // function to end trial when it is time
    let end_trial = function () {
      end_rt = performance.now() - start_time;
      end_loc = text.y < canvas.height / 2 ? 'top' : 'bottom';

      // gather the data to store for the trial
      let trial_data = {
        start_rt: start_rt,
        start_x: Math.round(x_coords[0]),
        start_y: Math.round(y_coords[0]),
        end_rt: end_rt,
        end_x: Math.round(x_coords[x_coords.length - 1]),
        end_y: Math.round(y_coords[y_coords.length - 1]),
        end_loc: end_loc,
        n_presses: n_presses,
        x_coords: roundArray(x_coords),
        y_coords: roundArray(y_coords),
        time: time,
      };

      // clear the display
      display_element.innerHTML = "<canvas id='canvas'></canvas>";

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // dragging
    function handleMouseUp(e) {
      e.preventDefault();
      selectedText = false;
    }
    function handleMouseOut(e) {
      e.preventDefault();
      selectedText = false;
    }

    function handleMouseDown(e) {
      n_presses++;
      e.preventDefault();
      X = (parseInt(e.clientX) - offsetX) / trial.scale_factor;
      Y = (parseInt(e.clientY) - offsetY) / trial.scale_factor;
      if (textHittest(X, Y)) {
        selectedText = true;
      }
    }

    function handleMouseMove(e) {
      if (selectedText === false) {
        return;
      }

      e.preventDefault();
      let X = (parseInt(e.clientX) - offsetX) / trial.scale_factor;
      let Y = (parseInt(e.clientY) - offsetY) / trial.scale_factor;

      // store coordinates and time array
      x_coords.push(X);
      y_coords.push(Y);
      time.push(performance.now() - start_time);

      // set new text position
      text.x = X;
      text.y = Y;

      if (text.y < trial.response_border[0] - text.height / 2 || text.y > trial.response_border[1] + text.height / 2) {
        end_trial();
      } else {
        draw();
      }

      if (!movement_initiated) {
        start_rt = performance.now() - start_time;
        movement_initiated = true;
      }
    }

    // clear the canvas and draw text
    function draw() {
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.rect(0, trial.response_border[0], canvas.width, trial.response_border[1] - trial.response_border[0]);
      ctx.stroke();

      ctx.fillStyle = trial.colour;
      ctx.fillText(text.text, text.x, text.y);
    }

    // test if x, y is inside the bounding box of the text
    function textHittest(x, y) {
      return (
        x >= text.x - text.width / 2 &&
        x <= text.x + text.width / 2 &&
        y >= text.y - text.height / 2 &&
        y <= text.y + text.height / 2
      );
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
