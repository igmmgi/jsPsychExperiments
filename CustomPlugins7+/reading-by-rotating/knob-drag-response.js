var jsPsychKnobDragResponse = (function (jspsych) {
  'use strict';

  const info = {
    name: "knob-drag-response",
    description: "",
    parameters: {
      canvas_colour: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Colour",
        default: "white",
        description: "Canvas colour.",
      },
      canvas_size: {
        type: jspsych.ParameterType.INT,
        array: true,
        pretty_name: "Size",
        default: [1280, 960],
        description: "Canvas size.",
      },
      canvas_border: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Border",
        default: "0px solid black",
        description: "Border style",
      },
      text: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Text",
        default: "Hello, world!",
        description: "StimulusText",
      },
      rotation_direction: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "RotationDirection",
        default: "clockwise",
        description: "Direction of rotation to move to the next segment",
      },
      colour: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Colour",
        default: "black",
        description: "StimulusColour",
      },
      font: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "Colour",
        default: "30px arial",
        description: "Font",
      },
    },
  };

  class KnobDragResponse {
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
      canvas.addEventListener('mouseup', handleMouseUp);

      let selectedTriangle = false;
      let movement_initiated = false;
      let start_rt;
      let end_rt;
      let n_presses = 0;
      let mpos;
      let start_angle = 0;
      let mangle = 0;
      let mrotation = 0;
      let p0_angle = 0;
      let n_p0_coords = 0;
      let n_p1_coords = 0;
      let n_p2_coords = 0;
      let n_marker_coords = 0;
      let current_rotation_direction = "";

      let angles = [];
      let x_coords = [];
      let y_coords = [];
      let time = [];

      // cirlce object (knob)
      let circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: 50,
      };

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
      function handleMouseUp() {
        selectedTriangle = false;
        resetKnob();
      }

      function handleMouseDown(e) {
        n_presses++;
        mousePosition(e);
        mouseAngle();
        start_angle = mangle;
        selectedTriangle = triangleHittest(mpos.x, mpos.y);
      }

      function handleMouseMove(e) {
        if (selectedTriangle === false) {
          return;
        }

        mousePosition(e);
        mouseAngle();

        // store coordinates and time array
        x_coords.push(mpos.x);
        y_coords.push(mpos.y);
        time.push(performance.now() - start_time);


        // the points should rotate by the same angle as the mouse
        mrotation = mangle - start_angle;
        start_angle = mangle;

        // set new triangle position
        n_p0_coords = rotate(circle.x, circle.y, triangle.p0.x, triangle.p0.y, mrotation);
        triangle.p0.x = n_p0_coords[0];
        triangle.p0.y = n_p0_coords[1];
        n_p1_coords = rotate(circle.x, circle.y, triangle.p1.x, triangle.p1.y, mrotation);
        triangle.p1.x = n_p1_coords[0];
        triangle.p1.y = n_p1_coords[1];
        n_p2_coords = rotate(circle.x, circle.y, triangle.p2.x, triangle.p2.y, mrotation);
        triangle.p2.x = n_p2_coords[0];
        triangle.p2.y = n_p2_coords[1];

        // set new marker position
        n_marker_coords = rotate(circle.x, circle.y, marker.x, marker.y, mrotation);
        marker.x = n_marker_coords[0];
        marker.y = n_marker_coords[1];

        // determine direction of rotation of the mouse
        mrotation > 0 ? current_rotation_direction = "clockwise" : current_rotation_direction = "counterclockwise";

        // store current mouse angle
        p0_angle = findAngleBetween(circle.x, circle.y, triangle.p0.x, triangle.p0.y);
        angles.push(p0_angle);

        // monitor if rotation reached the target angle
        if (rotationComplete()) {
          end_trial();
        } else if (Math.abs(p0_angle) > 120) {
          resetKnob();
          selectedTriangle = false;
        } else {
          draw();
        }

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

      function mouseAngle() {
        mangle = findAngleBetween(circle.x, circle.y, mpos.x, mpos.y);      
      }

      // clear the canvas and draw text
      function draw() {

        ctx.fillStyle = trial.canvas_colour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#c9c9c9";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(marker.x, marker.y, marker.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#7d7a79";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(triangle.p0.x, triangle.p0.y);
        ctx.lineTo(triangle.p1.x, triangle.p1.y);
        ctx.lineTo(triangle.p2.x, triangle.p2.y);
        ctx.fillStyle = "red";
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = trial.colour;
        ctx.fillText(text.text, text.x, text.y);
      }

      // function to end trial when it is time
      let end_trial = function () {
        end_rt = performance.now() - start_time;

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
          angles: roundArray(angles)
        };

        // remove event listeners
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseMove);

        // clear the display and move on to the next trial
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      };

      // rotation functions
      function rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
            ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
        return [nx, ny];
      }

      function findAngleBetween(cx, cy, px, py) {
        // Calculate the angle in radians using Math.atan2
        let radians = Math.atan2(px - cx, py - cy);

        // Convert radians to degrees
        let degrees = radians * (180 / Math.PI);

        // Adjust the range to be between -180 and 180
        if (degrees > 180) {
          degrees -= 360;
        } else if (degrees < -180) {
          degrees += 360;
        }

        // Reverse the angle to be measured from the y-axis (0,1)
        degrees = 180 - degrees;

        // Adjust the range again to be between -180 and 180
        if (degrees > 180) {
          degrees -= 360;
        } else if (degrees < -180) {
          degrees += 360;
        }

        return degrees;
      }

      function rotationComplete() {
        // mouse is currently rotating in the correct direction and reached the target rotation angle
        return current_rotation_direction == trial.rotation_direction &&  180 > Math.abs(p0_angle) && Math.abs(p0_angle) >= 120;
      }

      function resetKnob() {
        marker = {
          x: circle.x,
          y: circle.y - 30,
          r: 10,
        };
        triangle = {
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
        draw();
      }

      // other functions 
      // test if x, y is inside the triangle
      function triangleHittest(x, y) {
        return (
          ctx.isPointInPath(x, y)
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

  KnobDragResponse.info = info;
  return KnobDragResponse;
})(jsPsychModule);