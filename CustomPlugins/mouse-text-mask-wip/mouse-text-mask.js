// custom jspsych mouse text mask

jsPsych.plugins['mouse-text-mask'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'mouse-text-mask',
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
      sentence_border: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Sentence Border',
        default: false,
        description: 'Stimulus Border',
      },
      font: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font',
        default: '80px arial',
        description: 'Font',
      },
      font_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font Colour',
        default: 'black',
        description: 'Font Colour',
      },
      mask_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Mask Colour',
        default: 'blue',
        description: 'Mask Colour',
      },
      mask_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Mask Size',
        default: [30, 100],
        description: 'Mask Size',
      },
      mask_offset: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Mask Offset',
        default: [0, -30],
        description: 'Mask Offset',
      },
      filter: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Filter',
        default: null,
        description: 'Mask filter',
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

    let trial_started = false;
    let end_rt;
    let mpos;

    let x_coords = [];
    let y_coords = [];
    let time = [];

    // canvas mouse events
    canvas.addEventListener('mousemove', mousePosition);
    canvas.addEventListener('mousedown', handleMouseDown);

    // initial draw
    let start_time = performance.now();
    let [start_box, textMetrics] = draw_start();

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
      canvas.removeEventListener('mousedown', handleMouseDown);

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

     let img = new Image();
     img.src = 'http://placekitten.com/500/500';

    function handleMouseDown() {
      end_trial();
    }

    // clear the canvas and draw text
    function draw() {
      if (!trial_started) {
        if (in_box(mpos.x, mpos.y, start_box)) {
          trial_started = true;
          start_time = performance.now();
        } else {
          return;
        }
      }

      canvas.width = canvas.width;

      // canvas
       ctx.fillStyle = trial.canvas_colour;
       ctx.fillRect(0, 0, canvas.width, canvas.height);

      // text
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.font = trial.font;
       ctx.fillStyle = trial.font_colour;
       ctx.fillText(trial.sentence, canvas.width / 2, canvas.height / 2);

       // ctx.fillStyle = trial.canvas_colour;
       // ctx.fillRect(0, 0, canvas.width, canvas.height);

       ctx.drawImage(img, 0, 0);

      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(200, 200, 200, 0.1)";
      // ctx.fill();

       //ctx.save();
      // ctx.scale(2, 1);
      //ctx.beginPath();
       ctx.arc(mpos.x + trial.mask_offset[0], mpos.y + trial.mask_offset[1], 50, 0, Math.PI*2, true);
      // ctx.closePath();
      //ctx.fillStyle = "rgba(0,255,255,0.5)";
      //ctx.fill();
      //ctx.restore();

      //ctx.beginPath();
      //ctx.save();
      //ctx.rect(200, 200, canvas.width, canvas.height);
      //ctx.arc(mpos.x + trial.mask_offset[0], mpos.y + trial.mask_offset[1], 50, 0, Math.PI*2, true);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.beginPath();
         //ctx.lineWidth = 10;
         //ctx.fillStyle = "blue";
         // ctx.stroke();
      //ctx.fill();
      // ctx.restore();

      ctx.clip();
       ctx.restore();

       ctx.fillStyle = trial.canvas_colour;
       ctx.fillRect(0,0,canvas.width, canvas.height);
       //ctx.closePath();


      //ctx.drawImage(img, 0, 0);
      //// mask
      //if (trial.filter !== null)
      //ctx.beginPath();
      //ctx.ellipse(
      //  mpos.x + trial.mask_offset[0],
      //  mpos.y + trial.mask_offset[1],
      //  trial.mask_size[0],
      //  trial.mask_size[1],
      //  Math.PI / 2,
      //  true,
      //  2 * Math.PI,
      //);
      //ctx.clip();

      // ctx.fillStyle = trial.mask_colour;
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // canvas
      //ctx.fillStyle = trial.canvas_colour;
      //ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ctx.restore();


      // ctx.save();
      // canvas.width = canvas.width;

      // // canvas
      // ctx.fillStyle = trial.canvas_colour;
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // // mask
      // if (trial.filter !== null) ctx.filter = 'blur(2px)';
      ctx.ellipse(
        mpos.x + trial.mask_offset[0],
        mpos.y + trial.mask_offset[1],
        trial.mask_size[0],
        trial.mask_size[1],
        Math.PI / 2,
        0,
        2 * Math.PI,
      );
      // ctx.clip();
      // ctx.fillStyle = trial.mask_colour;
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // // text
      // ctx.textAlign = 'center';
      // ctx.textBaseline = 'middle';
      // ctx.font = trial.font;
      // ctx.fillStyle = trial.font_colour;
      // ctx.fillText(trial.sentence, canvas.width / 2, canvas.height / 2);

      // ctx.restore();

      // draw text bounding box with a little bit of border
      //if (trial.sentence_border) {
      //  ctx.beginPath();
      //  ctx.moveTo(
      //    canvas.width / 2 - textMetrics.actualBoundingBoxLeft * 1.01,
      //    canvas.height / 2 - textMetrics.actualBoundingBoxAscent * 1.01,
      //  );
      //  ctx.lineTo(
      //    canvas.width / 2 + textMetrics.actualBoundingBoxRight * 1.01,
      //    canvas.height / 2 - textMetrics.actualBoundingBoxAscent * 1.01,
      //  );
      //  ctx.lineTo(
      //    canvas.width / 2 + textMetrics.actualBoundingBoxRight * 1.01,
      //    canvas.height / 2 + textMetrics.actualBoundingBoxDescent * 1.01,
      //  );
      //  ctx.lineTo(
      //    canvas.width / 2 - textMetrics.actualBoundingBoxLeft * 1.01,
      //    canvas.height / 2 + textMetrics.actualBoundingBoxDescent * 1.01,
      //  );
      //  ctx.closePath();
      //  ctx.stroke();
      //}
    }

    function draw_start() {
      'use strict';

      // canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // fake draw to get text position and calculate bounding box once
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = trial.font;
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillText(trial.sentence, canvas.width / 2, canvas.height / 2);

      let textMetrics = ctx.measureText(trial.sentence);

      // start box
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';

      let start_box = {
        x: canvas.width / 2 - textMetrics.actualBoundingBoxLeft - 30,
        y: canvas.height / 2 - textMetrics.actualBoundingBoxAscent + 20,
        h: 20,
        w: 20,
      };

      ctx.rect(start_box.x, start_box.y, start_box.w, start_box.h);
      ctx.stroke();

      return [start_box, textMetrics];
    }

    // test if x, y is inside the bounding box
    function in_box(x, y, box) {
      return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
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
