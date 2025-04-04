// custom jspsych mouse drag response using code adapted from:
// https://stackoverflow.com/questions/21605942/drag-element-on-canvas
var jsPsychKnobStaticResponse = (function (jspsych) {
  'use strict';

  const info = {
    name: 'mouse-static-response',
    description: '',
    parameters: {
      canvas_colour: {
        type: jspsych.ParameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'white',
        description: 'Canvas colour.',
      },
      canvas_size: {
        type: jspsych.ParameterType.INT,
        array: true,
        pretty_name: 'Size',
        default: [1280, 960],
        description: 'Canvas size.',
      },
      canvas_border: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Border',
        default: '0px solid black',
        description: 'Border style',
      },
      text: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Text',
        default: 'Hello, world!',
        description: 'StimulusText',
      },
      colour: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Colour',
        default: 'black',
        description: 'StimulusColour',
      },
      font: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Colour',
        default: '30px arial',
        description: 'Font',
      },
    },
  };

  class KnobStaticResponse {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
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

      let selectedCircle = false;
      let movement_initiated = false;
      let start_rt;
      let end_rt;
      let n_presses = 0;
      let mpos;

      let x_coords = [];
      let y_coords = [];
      let time = [];

      // cirlce object (knob)
      let circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: 50,
      };
      let circle_path = new Path2D();

      // marker object
      let marker = {
        x: circle.x,
        y: circle.y - 30,
        r: 10,
      };

      // triangle object (lever)
      let triangle = {
        p0: {
          x: canvas.width / 2,
          y: canvas.height / 2 - 50,
        },
        p1: {
          x: canvas.width / 2 + 25,
          y: canvas.height / 2 - 75,
        },
        p2: {
          x: canvas.width / 2 - 25,
          y: canvas.height / 2 - 75,
        },
      };

      // text object
      let text = {
        text: trial.text,
        x: canvas.width / 2,
        y: canvas.height - 300,
        font: trial.font,
      };

      ctx.font = text.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // initial draw
      let start_time = performance.now();
      draw();

      // mouse functions
      function handleMouseDown(e) {
        n_presses++;
        mousePosition(e);
        selectedCircle = circleHittest(circle_path, mpos.x, mpos.y);
        if (selectedCircle === true) {
          end_trial()
        };
        selectedCircle = false;
      }

      function handleMouseMove(e) {

        mousePosition(e);

        // store coordinates and time array
        x_coords.push(mpos.x);
        y_coords.push(mpos.y);
        time.push(performance.now() - start_time);

        if (!movement_initiated) {
            start_rt = performance.now() - start_time;
            movement_initiated = true;
          }
      }

      function mousePosition(e) {
        mpos = {
          x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
          y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
        };
      }

      // clear the canvas and draw text
      function draw() {
        ctx.fillStyle = trial.canvas_colour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(triangle.p0.x, triangle.p0.y);
        ctx.lineTo(triangle.p1.x, triangle.p1.y);
        ctx.lineTo(triangle.p2.x, triangle.p2.y);
        ctx.fillStyle = "red";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        circle_path.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#c9c9c9";
        ctx.stroke(circle_path);
        ctx.fill(circle_path);

        ctx.beginPath();
        ctx.arc(marker.x, marker.y, marker.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#7d7a79";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = trial.colour;
        ctx.fillText(text.text, text.x, text.y);
      }

      // function to end trial when it is time
      let end_trial = function () {
        end_rt = performance.now() - start_time;

        // store coordinates and time array
        x_coords.push(mpos.x);
        y_coords.push(mpos.y);
        time.push(end_rt);

        // gather the data to store for the trial
        let trial_data = {
          start_rt: start_rt,
          start_x: Math.round(x_coords[0]),
          start_y: Math.round(y_coords[0]),
          end_rt: end_rt,
          end_x: Math.round(x_coords[x_coords.length - 1]),
          end_y: Math.round(y_coords[y_coords.length - 1]),
          n_presses: n_presses,
          x_coords: roundArray(x_coords),
          y_coords: roundArray(y_coords),
          time: time,
        };

        // remove event listeners
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);

        // clear the display and move on to the next trial
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      };

      // other functions 
      // test if x, y is inside the triangle
      function circleHittest(path, x, y) {
        return (
          ctx.isPointInPath(path, x, y)
          );
      }

      // round array to integers
      function roundArray(array) {
        let len = array.length;
        while (len--) {
          array[len] = Math.round(array[len]);
        }
        return array;
      }
    }
  }

  KnobStaticResponse.info = info;
  return KnobStaticResponse;
})(jsPsychModule);