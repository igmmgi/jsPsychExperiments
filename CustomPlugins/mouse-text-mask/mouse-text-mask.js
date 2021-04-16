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
      sentence_border_line_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sentence border line width',
        default: 1,
        description: 'Senteence border line width',
      },
      sentence_border_line_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Sentence border line colour',
        default: 'black',
        description: 'Senteence border line colour',
      },
      font: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font',
        default: '80px monospace',
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

    let trial_started = false;
    let mpos;
    let x_coords = [];
    let y_coords = [];
    let time = [];
    let text_bounds = [];
    let start_box;

    // deal with potential multi-line sentences with user defined splits
    trial.sentence_split = trial.sentence.split('\n').map((s) => s.trim());
    if (trial.sentence_split.length > 1 && trial.y_align === 'center') {
      trial.xy_position[1] -= trial.sentence_split.length * 0.5 * trial.line_height;
    }

    // canvas mouse events
    canvas.addEventListener('mousemove', mousePosition);
    canvas.addEventListener('mousedown', mouseResponse);

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

    function mouseResponse(e) {
      if (e.buttons === 1) {
        response.rt = performance.now() - start_time;
        end_trial();
      }
    }

    // store response
    let response = {
      rt: null,
      button: null,
    };

    // initial draw
    let start_time = performance.now();
    draw_start();

    function draw_start() {
      'use strict';

      // canvas
      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(canvas_rect[0], canvas_rect[1], canvas_rect[2], canvas_rect[3]);

      // fake draw to get text position and calculate bounding box once
      ctx.textAlign = trial.x_align;
      ctx.textBaseline = 'Middle';
      ctx.font = trial.font;

      trial.sentence_split.forEach((text, nline) => {
        ctx.fillText(text, trial.xy_position[0], trial.xy_position[1] + nline * trial.line_height);
        let box = ctx.measureText(text);
        let text_bound = [
          trial.xy_position[0],
          trial.xy_position[1] + nline * trial.line_height - box.actualBoundingBoxAscent,
          box.actualBoundingBoxLeft + box.actualBoundingBoxRight,
          box.actualBoundingBoxAscent + box.actualBoundingBoxDescent,
        ];
        text_bounds.push(text_bound);
      });

      // draw start box and text bounding boxes
      draw_start_box(text_bounds[0]);
      if (trial.sentence_border) {
        draw_text_box(text_bounds);
      }
    }

    function draw_start_box(text_bounds) {
      'use strict';
      ctx.lineWidth = trial.sentence_border_line_width;
      ctx.strokeStyle = trial.sentence_border_line_colour;
      ctx.beginPath();
      ctx.rect(text_bounds[0] - 50, text_bounds[1], 20, text_bounds[3]);
      ctx.stroke();
      start_box = { x: text_bounds[0] - 50, y: text_bounds[1], w: 20, h: text_bounds[3] };
    }

    function draw_text_box(text_bounds) {
      'use strict';
      ctx.lineWidth = trial.sentence_border_line_width;
      ctx.strokeStyle = trial.sentence_border_line_colour;
      text_bounds.forEach((text_bound) => {
        ctx.beginPath();
        ctx.rect(text_bound[0], text_bound[1], text_bound[2], text_bound[3]);
        ctx.stroke();
      });
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
        draw_text_box(text_bounds);
      }
    }

    // test if x, y is inside the bounding box
    function in_box(x, y, box) {
      return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
    }

    // function to end trial when it is time
    function end_trial() {
      'use strict';

      // gather the data to store for the trial
      let trial_data = {
        end_rt: response.rt,
        end_x: Math.round(x_coords[x_coords.length - 1]),
        end_y: Math.round(y_coords[y_coords.length - 1]),
        x_coords: roundArray(x_coords),
        y_coords: roundArray(y_coords),
        time: time,
        text_bounds: text_bounds,
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
