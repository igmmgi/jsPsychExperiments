var jsPsychSurveyText = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-survey-text",
    version: "2.0.0",
    description: "a jspsych plugin for free response survey questions",
    type: "module",
    main: "dist/index.cjs",
    exports: {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    typings: "dist/index.d.ts",
    unpkg: "dist/index.browser.min.js",
    files: [
      "src",
      "dist"
    ],
    source: "src/index.ts",
    scripts: {
      test: "jest",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-survey-text"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/survey-text",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "survey-text",
    version: _package.version,
    parameters: {
      questions: {
        type: jspsych.ParameterType.COMPLEX,
        array: true,
        default: void 0,
        nested: {
          prompt: {
            type: jspsych.ParameterType.HTML_STRING,
            default: void 0
          },
          placeholder: {
            type: jspsych.ParameterType.STRING,
            default: ""
          },
          rows: {
            type: jspsych.ParameterType.INT,
            default: 1
          },
          columns: {
            type: jspsych.ParameterType.INT,
            default: 20
          },
          required: {
            type: jspsych.ParameterType.BOOL,
            default: false
          },
          name: {
            type: jspsych.ParameterType.STRING,
            default: ""
          }
        }
      },
      randomize_question_order: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      preamble: {
        type: jspsych.ParameterType.ARRAY | jspsych.ParameterType.HTML_STRING,
        default: null
      },
      arrow_number: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Weiter"
      },
      autocomplete: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      response: {
        type: jspsych.ParameterType.COMPLEX,
        nested: {
          identifier: {
            type: jspsych.ParameterType.STRING
          },
          response: {
            type: jspsych.ParameterType.STRING | jspsych.ParameterType.INT | jspsych.ParameterType.FLOAT | jspsych.ParameterType.BOOL | jspsych.ParameterType.OBJECT
          }
        }
      },
      rt: {
        type: jspsych.ParameterType.INT
      },
      question_order: {
        type: jspsych.ParameterType.INT,
        array: true
      }
    }
  };
  class SurveyTextPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      for (var i = 0; i < trial.questions.length; i++) {
        if (typeof trial.questions[i].rows == "undefined") {
          trial.questions[i].rows = 1;
        }
      }
      for (var i = 0; i < trial.questions.length; i++) {
        if (typeof trial.questions[i].columns == "undefined") {
          trial.questions[i].columns = 40;
        }
      }
      for (var i = 0; i < trial.questions.length; i++) {
        if (typeof trial.questions[i].value == "undefined") {
          trial.questions[i].value = "";
        }
      }
      var html = "";
      if (trial.preamble !== null && trial.preamble !== undefined) {
        html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble" style="margin-bottom: 10em;">';
        if (Array.isArray(trial.preamble)) {
          html += '<div style="display: flex; gap: 200px; position: relative;">';
          trial.preamble.forEach((img, index) => {
            html += `<div style="flex: 1; overflow: visible; position: relative;">
              ${index === trial.arrow_number ? '<div style="position: absolute; bottom: -110%; left: 50%; transform: translateX(-50%); font-size: 140px; z-index: 1; color: black;">⬆</div>' : ''}
              <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>`;
          });
          html += '</div>';
        } else {
          html += trial.preamble;
        }
        html += "</div>";
      }
      if (trial.autocomplete) {
        html += '<form id="jspsych-survey-text-form">';
      } else {
        html += '<form id="jspsych-survey-text-form" autocomplete="off">';
      }
      var question_order = [];
      for (var i = 0; i < trial.questions.length; i++) {
        question_order.push(i);
      }
      if (trial.randomize_question_order) {
        question_order = this.jsPsych.randomization.shuffle(question_order);
      }
      for (var i = 0; i < trial.questions.length; i++) {
        var question = trial.questions[question_order[i]];
        var question_index = question_order[i];
        html += '<div id="jspsych-survey-text-' + question_index + '" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
        html += '<p class="jspsych-survey-text">' + question.prompt + "</p>";
        var autofocus = i == 0 ? "autofocus" : "";
        var req = question.required ? "required" : "";
        if (question.rows == 1) {
          html += '<input type="text" id="input-' + question_index + '"  name="#jspsych-survey-text-response-' + question_index + '" data-name="' + question.name + '" size="' + (question.columns || 80) + '" ' + autofocus + " " + req + ' placeholder="' + question.placeholder + '" value="' + (question.value || '') + '" style="font-size: 2em; width: 80%;" spellcheck="false"></input>';
        } else {
          html += '<textarea id="input-' + question_index + '" name="#jspsych-survey-text-response-' + question_index + '" data-name="' + question.name + '" cols="' + (question.columns || 80) + '" rows="' + question.rows + '" ' + autofocus + " " + req + ' placeholder="' + question.placeholder + '" style="font-size: 2em; width: 80%;" spellcheck="false">' + (question.value || '') + '</textarea>';
        }
        html += "</div>";
      }
      html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="' + trial.button_label + '" style="font-size: 1.5em; padding: 15px 30px; margin-top: 20px;" disabled></input>';
      html += "</form>";
      display_element.innerHTML = html;
      
      // Set height based on first image
      if (Array.isArray(trial.preamble)) {
        const firstImg = display_element.querySelector('#jspsych-survey-text-preamble img');
        firstImg.onload = () => {
          const height = firstImg.naturalHeight;
          const containers = display_element.querySelectorAll('#jspsych-survey-text-preamble div > div');
          containers.forEach(container => {
            container.style.height = `${height}px`;
          });
        };
      }
      
      display_element.querySelector("#input-" + question_order[0]).focus();
      display_element.querySelector("#jspsych-survey-text-form").addEventListener("submit", (e) => {
        e.preventDefault();
        var endTime = performance.now();
        var response_time = Math.round(endTime - startTime);
        var question_data = {};
        for (var index = 0; index < trial.questions.length; index++) {
          var id = "Q" + index;
          var q_element = document.querySelector("#jspsych-survey-text-" + index).querySelector("textarea, input");
          var val = q_element.value;
          var name = q_element.attributes["data-name"].value;
          if (name == "") {
            name = id;
          }
          var obje = {};
          obje[name] = val;
          Object.assign(question_data, obje);
        }
        var trialdata = {
          rt: response_time,
          response: question_data
        };
        this.jsPsych.finishTrial(trialdata);
      });
      var startTime = performance.now();

      // Enable button when text is entered
      const inputFields = display_element.querySelectorAll('input[type="text"], textarea');
      const continueButton = display_element.querySelector('#jspsych-survey-text-next');
      
      function checkInput() {
        const hasText = Array.from(inputFields).some(input => input.value.trim() !== '');
        continueButton.disabled = !hasText;
      }

      // Check initial values
      checkInput();

      inputFields.forEach(input => {
        input.addEventListener('input', checkInput);
      });
    }
    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (simulation_mode == "data-only") {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
      }
      if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
      }
    }
    create_simulation_data(trial, simulation_options) {
      const question_data = {};
      let rt = 1e3;
      for (const q of trial.questions) {
        const name = q.name ? q.name : `Q${trial.questions.indexOf(q)}`;
        const ans_words = q.rows == 1 ? this.jsPsych.randomization.sampleExponential(0.25) : this.jsPsych.randomization.randomInt(1, 10) * q.rows;
        question_data[name] = this.jsPsych.randomization.randomWords({
          exactly: ans_words,
          join: " "
        });
        rt += this.jsPsych.randomization.sampleExGaussian(2e3, 400, 4e-3, true);
      }
      const default_data = {
        response: question_data,
        rt
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const data = this.create_simulation_data(trial, simulation_options);
      const display_element = this.jsPsych.getDisplayElement();
      this.trial(display_element, trial);
      load_callback();
      const answers = Object.entries(data.response).map((x) => {
        return x[1];
      });
      for (let i = 0; i < answers.length; i++) {
        this.jsPsych.pluginAPI.fillTextInput(
          display_element.querySelector(`#input-${i}`),
          answers[i],
          (data.rt - 1e3) / answers.length * (i + 1)
        );
      }
      this.jsPsych.pluginAPI.clickTarget(
        display_element.querySelector("#jspsych-survey-text-next"),
        data.rt
      );
    }
  }

  return SurveyTextPlugin;

})(jsPsychModule);
