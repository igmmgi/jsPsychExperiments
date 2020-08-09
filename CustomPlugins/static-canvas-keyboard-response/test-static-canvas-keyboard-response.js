function drawFixation() {
  let ctx = document.getElementById('canvas').getContext('2d')
  ctx.lineWidth = 5
  ctx.moveTo(-25, 0)
  ctx.lineTo(25, 0)
  ctx.stroke()
  ctx.moveTo(0, -25)
  ctx.lineTo(0, 25)
  ctx.stroke()
}

function drawCircle() {
  let ctx = document.getElementById('canvas').getContext('2d')
  ctx.beginPath()
  ctx.arc(0, 0, 50, 0, 2 * Math.PI)
  ctx.strokeStyle = 'blue'
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 200, 50, 0, 2 * Math.PI)
  ctx.strokeStyle = 'red'
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(200, 0, 50, 0, 2 * Math.PI)
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 5
  ctx.stroke()
}

function drawText() {
  let ctx = document.getElementById('canvas').getContext('2d')
  ctx.font = '30px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Hello World', 0, 0)
}

function drawImage(args) {
  // args should be dict with imageNum, x, y, h and w fields
  let ctx = document.getElementById('canvas').getContext('2d')
  ctx.drawImage(images[args['imageNum']], args['x'], args['y'], args['h'], args['w'])
}

const fixation_cross = {
  type: 'static-canvas-keyboard-response',
  trial_duration: 500,
  translate_origin: true,
  canvas_border: '10px solid black',
  func: drawFixation,
}

const circle = {
  type: 'static-canvas-keyboard-response',
  trial_duration: 500,
  translate_origin: true,
  canvas_border: '6px solid red',
  func: drawCircle,
}

const text = {
  type: 'static-canvas-keyboard-response',
  trial_duration: 500,
  translate_origin: true,
  canvas_border: '8px solid green',
  func: drawText,
}

// const combined = {
//     type: 'static-canvas-keyboard-response',
//     trial_duration: 500,
//     translate_origin: true,
//     canvas_border: "10px solid blue",
//     func: function() {
//         drawFixation();
//         drawCircle();
//         drawText();
//     }
// }

// const combined_sequential = {
//     type: 'static-canvas-keyboard-response',
//     trial_duration: 5000,
//     translate_origin: true,
//     canvas_border: "10px solid blue",
//     stimulus_onset: [0, 1500, 3000],
//     func: [ drawFixation, drawCircle, drawText ]
// }

const images = loadImages(['../../img/h1.bmp', '../../img/h2.bmp'])

const image_grid = {
  type: 'static-canvas-keyboard-response',
  trial_duration: 5000,
  translate_origin: true,
  canvas_border: '10px solid blue',
  stimulus_onset: [0, 200, 400, 600],
  clear_screen: [0, 1, 0, 1],
  func: [drawImage, drawImage, drawImage, drawImage],
  func_args: [
    { imageNum: 0, x: -400, y: 200, h: 200, w: 200 },
    { imageNum: 0, x: -400, y: -400, h: 200, w: 200 },
    { imageNum: 1, x: 200, y: 200, h: 200, w: 200 },
    { imageNum: 1, x: 200, y: -400, h: 200, w: 200 },
  ],
}

// const image_sequential = {
//     type: 'static-canvas-keyboard-response',
//     trial_duration: 2000,
//     translate_origin: true,
//     canvas_border: "10px solid blue",
//     stimulus_onset: [0, 500, 1000],
//     func: [drawImage, drawImage, drawImage],
//     func_args: [
//         {"imageNum": 0, "x": -200, "y": -200, "h":400, "w":400},
//         {"imageNum": 1, "x": -200, "y": -200, "h":400, "w":400},
//         {"imageNum": 0, "x": -200, "y": -200, "h":400, "w":400}
//     ]
// }

// const image_timeline1 = {
//     timeline: [
//         image_grid,
//         image_sequential
//     ],
// };

//const image_variable = {
//    type: 'static-canvas-keyboard-response',
//    trial_duration: 250,
//    translate_origin: true,
//    canvas_border: "5px solid black",
//    stimulus_onset: 0,
//    func: drawImage,
//    func_args: [
//        {"imageNum": jsPsych.timelineVariable('imageNum'),
//            "x": jsPsych.timelineVariable('x'),
//            "y": jsPsych.timelineVariable('y'),
//            "h": 200,
//            "w": 200}
//    ]
//}

const randomTimeline = []
for (let i = 0; i < 100; i++) {
  randomTimeline.push({
    imageNum: getRandomInt(0, 2),
    x: getRandomInt(-400, 200),
    y: getRandomInt(-400, 200),
  })
}

//const image_timeline2 = {
//    timeline: [
//        image_variable
//    ],
//    timeline_variables: randomTimeline,
//    repetitions: 1
//};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict'

  let exp = []

  // just draw stuff
  //exp.push(fixation_cross);
  //exp.push(circle);
  //exp.push(fixation_cross);
  //exp.push(text);
  //exp.push(fixation_cross);
  //exp.push(combined);
  //exp.push(combined_sequential);
  //exp.push(fixation_cross);
  exp.push(image_grid)
  //exp.push(fixation_cross);
  //exp.push(image_sequential);
  //exp.push(image_timeline1);
  //exp.push(image_timeline2);

  return exp
}
const EXP = genExpSeq()

jsPsych.init({
  timeline: EXP,
  fullscreen: false,
  show_progress_bar: false,
})
