// custom jspsych mouse drag response using code adapted from:
// https://stackoverflow.com/questions/21605942/drag-element-on-canvas

jsPsych.plugins['mouse-drag-response'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'mouse-drag-response',
    description: '',
    parameters: {
      func_args: {
        type: jsPsych.plugins.parameterType.OBJECT,
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
      response_border: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'ResponseBorder',
        default: 100,
        description: 'Response border n pixels',
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

  function roundArray(array) {
    let len = array.length;
    while (len--) {
      array[len] = Math.round(array[len]);
    }
    return array;
  }

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

    let canvas = document.getElementById('canvas');
    let ctx = document.getElementById('canvas').getContext('2d');
    let rect = canvas.getBoundingClientRect();

    // canvas mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    let response_border_top = trial.response_border;
    let response_border_bottom = trial.canvas_size[1] - trial.response_border * 2;
    let offsetX = null;
    let offsetY = null;
    let selectedText = false;
    let movement_initiated = false;
    let start_rt;
    let end_rt;
    let end_loc;
    let n_presses = 0;
    let mpos;

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
      end_loc = text.y < canvas.height / 2 ? 'up' : 'down';

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

      // remove event listeners
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseMove);

      // clear the display and move on to the next trial
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    };

    // mouse functions
    function handleMouseUp() {
      selectedText = false;
    }

    function handleMouseDown(e) {
      n_presses++;
      mousePosition(e);
      selectedText = textHittest(mpos.x, mpos.y);
    }

    function mousePosition(e) {
      mpos = {
        x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
    }

    function handleMouseMove(e) {
      if (selectedText === false) {
        offsetX = offsetY = null;
        return;
      }

      if (offsetX === null && offsetY === null) {
        offsetX = text.x - mpos.x;
        offsetY = text.y - mpos.y;
      }

      mousePosition(e);

      // store coordinates and time array
      x_coords.push(mpos.x);
      y_coords.push(mpos.y);
      time.push(performance.now() - start_time);

      // set new text position
      text.x = mpos.x + offsetX;
      text.y = mpos.y + offsetY;

      if (
        text.y < response_border_top - text.height / 2 ||
        text.y > response_border_bottom + trial.response_border + text.height / 2
      ) {
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
      ctx.rect(0, trial.response_border, canvas.width, trial.canvas_size[1] - trial.response_border * 2);
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
