var jsPsychHtmlDualSliderResponse = (function (jspsych) {
  'use strict';

  const info = {
    name: "html-dual-slider-response",
    version: "1.0.0",
    description: "a jspsych plugin for dual slider response questions",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: ""
      },
      question1: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "Question 1"
      },
      question2: {
        type: jspsych.ParameterType.HTML_STRING,
        default: "Question 2"
      },
      min1: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      max1: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      slider_start1: {
        type: jspsych.ParameterType.INT,
        default: 50
      },
      step1: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      labels1: {
        type: jspsych.ParameterType.HTML_STRING,
        default: [],
        array: true
      },
      min2: {
        type: jspsych.ParameterType.INT,
        default: 0
      },
      max2: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      slider_start2: {
        type: jspsych.ParameterType.INT,
        default: 50
      },
      step2: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      labels2: {
        type: jspsych.ParameterType.HTML_STRING,
        default: [],
        array: true
      },
      slider_width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue",
        array: false
      },
      require_movement: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      require_both_movements: {
        type: jspsych.ParameterType.BOOL,
        default: true
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      stimulus_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      rt: {
        type: jspsych.ParameterType.INT
      },
      response1: {
        type: jspsych.ParameterType.INT
      },
      response2: {
        type: jspsych.ParameterType.INT
      },
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING
      },
      slider_start1: {
        type: jspsych.ParameterType.INT
      },
      slider_start2: {
        type: jspsych.ParameterType.INT
      }
    }
  };

  class HtmlDualSliderResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    
    trial(display_element, trial) {
      var half_thumb_width = 7.5;
      
      var html = '<div id="jspsych-html-dual-slider-response-wrapper" style="margin: 50px 0px;">';
      
      // Add stimulus if provided and not empty
      if (trial.stimulus && trial.stimulus.trim() !== "") {
        html += '<div id="jspsych-html-dual-slider-response-stimulus" style="margin-bottom: 30px; font-size: 24px; font-weight: bold;">' + trial.stimulus + "</div>";
      }
      
      // First slider
      html += '<div style="margin-bottom: 100px;">';
      html += '<div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">' + trial.question1 + '</div>';
      html += '<div class="jspsych-html-dual-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
      if (trial.slider_width !== null) {
        html += "width:" + trial.slider_width + "px;";
      } else {
        html += "width:auto;";
      }
      html += '">';
      html += '<input type="range" class="jspsych-slider" value="' + trial.slider_start1 + '" min="' + trial.min1 + '" max="' + trial.max1 + '" step="' + trial.step1 + '" id="jspsych-html-dual-slider-response-response1"></input>';
      html += "<div>";
      for (var j = 0; j < trial.labels1.length; j++) {
        var label_width_perc = 100 / (trial.labels1.length - 1);
        var percent_of_range = j * (100 / (trial.labels1.length - 1));
        var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
        var offset = percent_dist_from_center * half_thumb_width / 100;
        html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
        html += '<span style="text-align: center; font-size: 80%; font-weight: bold;">' + trial.labels1[j] + "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
      html += "</div>";
      
      // Second slider
      html += '<div style="margin-bottom: 40px;">';
      html += '<div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">' + trial.question2 + '</div>';
      html += '<div class="jspsych-html-dual-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
      if (trial.slider_width !== null) {
        html += "width:" + trial.slider_width + "px;";
      } else {
        html += "width:auto;";
      }
      html += '">';
      html += '<input type="range" class="jspsych-slider" value="' + trial.slider_start2 + '" min="' + trial.min2 + '" max="' + trial.max2 + '" step="' + trial.step2 + '" id="jspsych-html-dual-slider-response-response2"></input>';
      html += "<div>";
      for (var j = 0; j < trial.labels2.length; j++) {
        var label_width_perc = 100 / (trial.labels2.length - 1);
        var percent_of_range = j * (100 / (trial.labels2.length - 1));
        var percent_dist_from_center = (percent_of_range - 50) / 50 * 100;
        var offset = percent_dist_from_center * half_thumb_width / 100;
        html += '<div style="border: 1px solid transparent; display: inline-block; position: absolute; left:calc(' + percent_of_range + "% - (" + label_width_perc + "% / 2) - " + offset + "px); text-align: center; width: " + label_width_perc + '%;">';
        html += '<span style="text-align: center; font-size: 80%; font-weight: bold;">' + trial.labels2[j] + "</span>";
        html += "</div>";
      }
      html += "</div>";
      html += "</div>";
      html += "</div>";
      
      html += "</div>";
      
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      
      html += '<button id="jspsych-html-dual-slider-response-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + ">" + trial.button_label + "</button>";
      
      display_element.innerHTML = html;
      
      var response = {
        rt: null,
        response1: null,
        response2: null
      };
      
      var slider1_moved = false;
      var slider2_moved = false;
      
      if (trial.require_movement) {
        const enable_button = () => {
          if (!trial.require_both_movements || (slider1_moved && slider2_moved)) {
            display_element.querySelector("#jspsych-html-dual-slider-response-next").disabled = false;
          }
        };
        
        const slider1_events = ["mousedown", "touchstart", "change"];
        const slider2_events = ["mousedown", "touchstart", "change"];
        
        slider1_events.forEach(event => {
          display_element.querySelector("#jspsych-html-dual-slider-response-response1").addEventListener(event, () => {
            slider1_moved = true;
            enable_button();
          });
        });
        
        slider2_events.forEach(event => {
          display_element.querySelector("#jspsych-html-dual-slider-response-response2").addEventListener(event, () => {
            slider2_moved = true;
            enable_button();
          });
        });
      }
      
      const end_trial = () => {
        var trialdata = {
          rt: response.rt,
          stimulus: trial.stimulus,
          slider_start1: trial.slider_start1,
          slider_start2: trial.slider_start2,
          response1: response.response1,
          response2: response.response2
        };
        this.jsPsych.finishTrial(trialdata);
      };
      
      display_element.querySelector("#jspsych-html-dual-slider-response-next").addEventListener("click", () => {
        var endTime = performance.now();
        response.rt = Math.round(endTime - startTime);
        response.response1 = display_element.querySelector("#jspsych-html-dual-slider-response-response1").valueAsNumber;
        response.response2 = display_element.querySelector("#jspsych-html-dual-slider-response-response2").valueAsNumber;
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector("#jspsych-html-dual-slider-response-next").disabled = true;
        }
      });
      
      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          const stimulus_element = display_element.querySelector("#jspsych-html-dual-slider-response-stimulus");
          if (stimulus_element) {
            stimulus_element.style.visibility = "hidden";
          }
        }, trial.stimulus_duration);
      }
      
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
      }
      
      var startTime = performance.now();
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
      const default_data = {
        stimulus: trial.stimulus,
        slider_start1: trial.slider_start1,
        slider_start2: trial.slider_start2,
        response1: this.jsPsych.randomization.randomInt(trial.min1, trial.max1),
        response2: this.jsPsych.randomization.randomInt(trial.min2, trial.max2),
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true)
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
      if (data.rt !== null) {
        const el1 = display_element.querySelector("#jspsych-html-dual-slider-response-response1");
        const el2 = display_element.querySelector("#jspsych-html-dual-slider-response-response2");
        setTimeout(() => {
          this.jsPsych.pluginAPI.clickTarget(el1);
          el1.valueAsNumber = data.response1;
          this.jsPsych.pluginAPI.clickTarget(el2);
          el2.valueAsNumber = data.response2;
        }, data.rt / 2);
        this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
      }
    }
  }

  return HtmlDualSliderResponsePlugin;

})(jsPsychModule); 