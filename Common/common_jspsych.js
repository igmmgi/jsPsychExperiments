function recordScreenSize() {
    jsPsych.data.addProperties({
        screenHeight: screen.height,
        screenWidth: screen.width,
    });
}

const screenInfo = {
  type: 'call-function',
  func: recordScreenSize,
  timing_post_trial: 50,
};


function filterDataPavlovia(
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  if (filetype === 'csv') {
    return jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
  } else if (filetype === 'json') {
    return jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
  }
}

function saveData(
  url,
  filename,
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  let dat;
  if (filetype === 'csv') {
    dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
  } else if (filetype === 'json') {
    dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}

function saveDataLocal(
  filename,
  rows = {},
  filetype = 'csv',
  colsToIgnore = ['stimulus', 'trial_type', 'internal_node_id', 'trial_index', 'time_elapsed'],
) {
  jsPsych.data
    .get()
    .filter(rows)
    .ignore(colsToIgnore)
    .localSave(filetype, filename + '.' + filetype);
}

const user_interaction_data = {
  event: null,
  trial: null,
  time: null,
};

function update_user_interaction_data(data) {
  'use strict';
  user_interaction_data.event = data.event;
  user_interaction_data.trial = data.trial;
  user_interaction_data.time = data.time;
}


function saveInteractionData(url, filename) {
  let dat = jsPsych.data.getInteractionData().csv();
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}



////////////////////////////////////////////////////////////////////////
//                          Common Variables                          //
////////////////////////////////////////////////////////////////////////
function welcome_message({language="de_du", text=""} = {}) {
    const message = {
        type: 'html-keyboard-response',
        response_ends_trial: true,
    };
    if (text !== "") {
        message.stimulus = text;
    } else if (language === "en") {
        message.stimulus = '<h2>Welcome. Press any key to continue.</h2>';
    } else if (language === "de_sie") {
        message.stimulus = '<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>';
    } else if (language === "de_du") {
        message.stimulus = '<h2>Willkommen. Bitte drücke eine beliebige Taste, um fortzufahren!</h2>';
    }
    return message;
}

function end_message({language="de_du", text=""} = {}) {
    const message = {
        type: 'html-keyboard-response',
        response_ends_trial: true
    };
    if (text !== "") {
        message.stimulus = text;
    } else if (language === "en") {
        message.stimulus = '<h2>The experiment is finished.</h2>' + '<h2>Press any key to end the experiment!</h2>';
    } else if (language === "de_sie") {
        message.stimulus = '<h2>Das Experiment ist beendet.</h2>' + '<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>';
        message.stimulus = '<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>';
    } else if (language === "de_du") {
        message.stimulus = '<h2>Das Experiment ist beendet.</h2>' + '<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>';
    }
    return message;
}


function resize_browser({language="de_du", message=""} = {}) {
    const resize = {
        type: 'resize',
        item_width: 3 + 3 / 8,
        item_height: 2 + 1 / 8,
        pixels_per_unit: 100,
    };
    if (message !== "") {
        welcome.stimulus = message;
    } else if (language === "en") {
        resize.stimulus = '<p>Resize the rectangle (click and drag bottom right corner) until it is the same size as a standard bankcard.</p>';
    } else if (language === "de_sie") {
        resize.stimulus = '<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>';
    } else if (language === "de_du") {
        resize.stimulus = '<p>Klicke und ziehe die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder dein Universitätsausweis hat.</p>';
    }
    return resize;
}

function fullscreen({on, language='de'} = {}) {
    if (language === "de"){
        return {
            type: 'fullscreen',
            fullscreen_mode: on,
            message: '<p>Das Experiment wechselt in den Vollbildmodus, sobald du die Taste ‚Weiter‘ drückst</p>',
            button_label: 'Weiter'
        };
    } else if (language === "en"){
        return {
            type: 'fullscreen',
            fullscreen_mode: on,
        };
    }
}

function mouseCursor(show) {
    return {
        type: 'call-function',
        func: function () {
            $('body').css('cursor', show ? 'default' : 'none');
        },
    };
}

function checkVpInfoForm({alert_language="en", alert_message=""} = {}) {
  // get age, gender, handedness and VPs consent
  if (alert_message === "") {
	  if (alert_language==="en") {
		alert_message = 'Please answer all questions and click the consent box to continue!';
	  } else if (alert_language === "de") {
	        alert_message = 'Bitte beantworten alle Fragen!';
	  }
  } 

  let age = document.getElementById('age').value;

  let gender = '';
  if ($('#male').is(':checked')) {
    gender = 'male';
  } else if ($('#female').is(':checked')) {
    gender = 'female';
  } else if ($('#divers').is(':checked')) {
    gender = 'na';
  }

  let hand = '';
  if ($('#left').is(':checked')) {
    hand = 'left';
  } else if ($('#right').is(':checked')) {
    hand = 'right';
  }

  let consent = false;
  if ($('#consent_checkbox').is(':checked')) {
    consent = true;
  }

  if (consent && age !== '' && gender !== '' && hand !== '') {
    return { age: age, gender: gender, handedness: hand };
  } else {
    window.alert(alert_message);
    return false;
  }
}

function vpInfoForm({form='/Common/vpInfoForm_en.html', alert_language="en", alert_message=""}={}) {
    return {
        type: 'external-html',
        url: form,
        cont_btn: 'start',
        check_fn: function() {
            const vpInfo = checkVpInfoForm({alert_language: alert_language, alert_message: alert_message});
            if (vpInfo !== false) {
                jsPsych.data.addProperties(vpInfo);
                return true;
            } else {
                return false;
            }
        }
    };
}

