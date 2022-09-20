var jsPsychStaticCanvasSoundKeyboardResponse = (function (jspsych) {
  'use strict';

  const info = {
    name: 'static-canvas-sound-keyboard-response',
    parameters: {
      sound: {
        type: jspsych.ParameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: undefined,
      },
      func_args: {
        type: jspsych.ParameterType.DICT,
        pretty_name: 'Args',
        default: {},
        description: 'Function arguments',
      },
      func: {
        type: jspsych.ParameterType.FUNCTION,
        array: true,
        pretty_name: 'Function',
        default: {},
        description: 'Function to call',
      },
      clear_screen: {
        type: jspsych.ParameterType.BOOL,
        array: true,
        pretty_name: 'Clear',
        default: [false],
        description: 'Clear the screen',
      },
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
      translate_origin: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Translate',
        default: true,
        description: 'Translate origin to center',
      },
      stimulus_onset: {
        type: jspsych.ParameterType.INT,
        array: true,
        pretty_name: 'StimulusOnset',
        default: [0],
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'StimulusDuration',
        default: null,
        description: 'How long to hide the stimulus.',
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'TrialDuration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
    },
  };

  class StaticCanvasSoundKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial, on_load) {
      // setup canvas
      let new_html =
        '<div style="position:relative;">' +
        '<canvas id="canvas" width="' +
        trial.canvas_size[0] +
        '" height="' +
        trial.canvas_size[1] +
        '" style="border: ' +
        trial.canvas_border +
        '; position: absolute; z-index: -1; top: 50%; left: 50%; transform: translate(-50%, -50%);"></canvas>' +
        '' +
        '</div>';

      display_element.innerHTML = new_html;

      let canvas = document.querySelector('canvas');
      let ctx = canvas.getContext('2d');
      let audio_ctx = this.jsPsych.pluginAPI.audioContext();

      ctx.fillStyle = trial.canvas_colour;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (typeof trial.func === 'function') {
        trial.func = [trial.func];
      }
      if (typeof trial.stimulus_onset === 'boolean') {
        trial.clear_screen = [trial.clear_screen];
      }
      if (typeof trial.stimulus_onset === 'number') {
        trial.stimulus_onset = [trial.stimulus_onset];
      }
      if (trial.translate_origin) {
        ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)
      }

      let trial_complete;

      // record webaudio context start time
      let startTime;
      // load audio file
      this.jsPsych.pluginAPI
        .getAudioBuffer(trial.sound)
        .then((buffer) => {
          if (audio_ctx !== null) {
            this.audio = audio_ctx.createBufferSource();
            this.audio.buffer = buffer;
            this.audio.connect(audio_ctx.destination);
          } else {
            this.audio = buffer;
            this.audio.currentTime = 0;
          }
          setupTrial();
        })
        .catch((err) => {
          console.error(
            `Failed to load audio file "${trial.sound}". Try checking the file path. We recommend using the preload plugin to load audio files.`,
          );
          console.error(err);
        });

      const setupTrial = () => {
        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
          this.audio.addEventListener('ended', end_trial);
        }
        // start audio
        if (audio_ctx !== null) {
          startTime = audio_ctx.currentTime;
          this.audio.start(startTime);
        } else {
          this.audio.play();
        }
        // end trial if time limit is set
        if (trial.trial_duration !== null) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            end_trial();
          }, trial.trial_duration);
        }

        // draw stimulus/stimuli
        for (let i = 0; i < trial.func.length; i++) {
          this.jsPsych.pluginAPI.setTimeout(() => {
            trial.func[0](trial.func_args[0]);
          }, trial.stimulus_onset[0]);
        }

        on_load();
      };

      // function to end trial when it is time
      const end_trial = () => {
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();

        // clear the display
        display_element.innerHTML = '';

        // move on to the next trial
        this.jsPsych.finishTrial();
      };

      // return new Promise((resolve) => {
      //   trial_complete = resolve;
      // });
    }
  }
  StaticCanvasSoundKeyboardResponsePlugin.info = info;
  return StaticCanvasSoundKeyboardResponsePlugin;
})(jsPsychModule);
