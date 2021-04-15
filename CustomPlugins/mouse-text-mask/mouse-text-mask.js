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
      translate_origin: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Translate',
        default: false,
        description: 'Translate origin to center',
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
      line_height: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font',
        default: 50,
        description: 'Font',
      },
      font_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font Colour',
        default: 'black',
        description: 'Font Colour',
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
      xy_position: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'position',
        default: [640, 480],
        description: 'Text Position',
      },
      x_align: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'align',
        default: 'left',
        description: 'Text Alignment',
      },
      y_align: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Y align multi-line',
        default: 'top',
        description: 'Y align multi-line text in the centre',
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

    let canvas_rect;
    if (trial.translate_origin) {
      ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
      canvas_rect = [-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height];
    } else {
      canvas_rect = [0, 0, canvas.width, canvas.height];
    }
    ctx.fillStyle = trial.canvas_colour;
    ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);
    //let rect = canvas.getBoundingClientRect();

    let trial_started = false;
    let end_rt;
    let mpos;
    let x_coords = [];
    let y_coords = [];
    let time = [];

    // deal with potential multi-line sentences with user defined splits
    trial.sentence_split = trial.sentence.split('\n').map((s) => s.trim());
    if (trial.sentence_split.length > 1 && trial.y_align === 'center') {
      trial.xy_position[1] -= trial.sentence_split.length * 0.5 * trial.line_height;
    }

    // canvas mouse events
    canvas.addEventListener('mousemove', mousePosition);
    canvas.addEventListener('mousedown', mouseResponse);

    // initial draw
    let start_time = performance.now();
    let [start_box, textMetrics] = draw_start();

    function mousePosition(e) {
      mpos = {
        x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
      };
      if (trial.translate_origin) {
        mpos.x = mpos.x - canvas.width / 2;
        mpos.y = mpos.y - canvas.height / 2;
      }
      if (trial_started) {
        x_coords.push(mpos.x);
        y_coords.push(mpos.y);
        time.push(performance.now() - start_time);
      }
      draw();
    }

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
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      // TO DO: Why is this needed again?
      if (trial.translate_origin) {
        ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
      }

      // text
      ctx.textAlign = trial.x_align;
      ctx.textBaseline = 'Middle';
      ctx.font = trial.font;
      ctx.fillStyle = trial.font_colour;
      trial.sentence_split.forEach((text, nline) => {
        ctx.fillText(text, trial.xy_position[0], trial.xy_position[1] + nline * trial.line_height);
      });

      // mask
      ctx.save();
      ctx.scale(trial.mask_scale[0], trial.mask_scale[1]);
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

      if (trial.sentence_border) {
        draw_bounding_box(textMetrics);
      }
    }

    function draw_start() {
      'use strict';

      // canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // fake draw to get text position and calculate bounding box once
      ctx.textAlign = trial.x_align;
      ctx.textBaseline = 'Middle';
      ctx.font = trial.font;
      let textMetrics = [];

      trial.sentence_split.forEach((text, nline) => {
        ctx.fillText(text, trial.xy_position[0], trial.xy_position[1] + nline * trial.line_height);
        textMetrics.push(ctx.measureText(text));
      });

      // draw start box and bounding boxes
      let start_box = draw_start_box(textMetrics[0]);
      if (trial.sentence_border) {
        draw_bounding_box(textMetrics);
      }

      return [start_box, textMetrics];
    }

    function draw_start_box(textMetrics) {
      'use strict';
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      let start_box = {
        x: trial.xy_position[0] - textMetrics.actualBoundingBoxLeft - 50,
        y: trial.xy_position[1] - textMetrics.actualBoundingBoxAscent,
        h: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent * 1.05,
        w: 20,
      };
      ctx.rect(start_box.x, start_box.y, start_box.w, start_box.h);
      ctx.stroke();
      ctx.restore();
      return start_box;
    }

    function draw_bounding_box(textMetrics) {
      'use strict';
      ctx.save();
      textMetrics.forEach((box, i) => {
        ctx.beginPath();
        ctx.moveTo(
          trial.xy_position[0] - box.actualBoundingBoxLeft * 1.05,
          trial.xy_position[1] + i * trial.line_height - box.actualBoundingBoxAscent * 1.05,
        );
        ctx.lineTo(
          trial.xy_position[0] + box.actualBoundingBoxRight * 1.05,
          trial.xy_position[1] + i * trial.line_height - box.actualBoundingBoxAscent * 1.05,
        );
        ctx.lineTo(
          trial.xy_position[0] + box.actualBoundingBoxRight * 1.05,
          trial.xy_position[1] + i * trial.line_height + box.actualBoundingBoxDescent * 1.05,
        );
        ctx.lineTo(
          trial.xy_position[0] - box.actualBoundingBoxLeft * 1.05,
          trial.xy_position[1] + i * trial.line_height + box.actualBoundingBoxDescent * 1.05,
        );
        ctx.closePath();
        ctx.stroke();
      });
      ctx.restore();
    }

    // test if x, y is inside the bounding box
    function in_box(x, y, box) {
      return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
    }

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

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
