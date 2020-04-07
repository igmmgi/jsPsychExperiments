// 1st attempt at drag-drop type response//
// addapted from jspsych-free-sort

jsPsych.plugins['mouse-drag-response'] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('free-sort', 'stimuli', 'image');

    plugin.info = {
        name: 'mouse-drag-response',
        description: '',
        parameters: {
            stimuli: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Stimuli',
                default: undefined,
                array: false,
                description: 'Image to be displayed.'
            },
            stim_height: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus height',
                default: 100,
                description: 'Height of images in pixels.'
            },
            stim_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus width',
                default: 100,
                description: 'Width of images in pixels'
            },
            sort_area_height: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Sort area height',
                default: 800,
                description: 'The height of the container that subjects can move the stimuli in.'
            },
            sort_area_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Sort area width',
                default: 800,
                description: 'The width of the container that subjects can move the stimuli in.'
            },
            y_resp_limits: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Response area top/bottom',
                default: [20, 860],
                description: 'The width of the container that subjects can move the stimuli in.'
            },
        }
    }

    plugin.trial = function(display_element, trial) {

        var start_time = performance.now();

        var html = '<div '+
            'id="jspsych-free-sort-arena" '+
            'class="jspsych-free-sort-arena" '+
            'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:4px solid;"'+
            '></div>';

        display_element.innerHTML = html;
      
        // show response region
        var canvas = document.createElement('canvas'),
        div = document.getElementById('jspsych-free-sort-arena');
        canvas.id    = "canvas";
        canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto;";
        canvas.width  = 1280;
        canvas.height = 760;
        canvas.style.border   = "1px dashed";
        div.appendChild(canvas);

        var coords = {
            x: (trial.sort_area_width/2) - (trial.stim_width/2),
            y: (trial.sort_area_height/2) - (trial.stim_height/2)
        };

        display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<img '+
            'src="'+trial.stimuli+'" '+
            'data-src="'+trial.stimuli+'" '+
            'class="jspsych-free-sort-draggable" '+
            'draggable="false" '+
            'style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
            '</img>';

        var draggable = display_element.querySelectorAll('.jspsych-free-sort-draggable');

        draggable[0].addEventListener('mousedown', function(event){

            var elem = event.currentTarget;
            var x = event.pageX - event.currentTarget.offsetLeft;
            var y = event.pageY - event.currentTarget.offsetTop - window.scrollY;

            var mouseup = function(e) {
                var xpos = parseInt(elem.style.top)
                if (xpos < trial.y_resp_limits[0] || xpos > trial.y_resp_limits[1]) {
                    let loc = xpos < trial.y_resp_limits[0] ? 'top' : 'bottom';
                    end_trial(loc);
                }
            }
            document.addEventListener('mouseup', mouseup);

            var mousemoveevent = function(e){
                elem.style.top =  Math.min(trial.sort_area_height - trial.stim_height, Math.max(0,(e.clientY - y))) + 'px';
                elem.style.left = Math.min(trial.sort_area_width  - trial.stim_width,  Math.max(0,(e.clientX - x))) + 'px';
            }
            document.addEventListener('mousemove', mousemoveevent);

        });

        var end_trial = function(loc){
           
            var end_time = performance.now();
            var rt = end_time - start_time;

            var trial_data = {
                "rt": rt,
                "location": loc
            };

            // advance to next part
            display_element.innerHTML = html; //"<canvas id='canvas'></canvas>";
            jsPsych.finishTrial(trial_data);

        }

    };

    return plugin;
})();
