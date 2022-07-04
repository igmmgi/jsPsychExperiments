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

function password(psw) {
    let correct = false;
    $.ajax({
        url: '/Common7+/password.php',
        type: 'POST',
        async: false,
        data: { password: psw },
    }).done(function(data) {
        correct = data;
    });
    return correct;
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

function saveRandomCode(url, filename, code) {
    $.ajax({
        type: 'post',
        cache: false,
        url: url,
        data: { filename: filename, filedata: code },
    });
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
function browser_check(screenRes = [1280, 960]) {
    return {
        type: jsPsychBrowserCheck,
        minimum_width: screenRes[0],
        minimum_height: screenRes[1],
        features: ['width', 'height', 'browser', 'vsync_rate', 'os'],
        on_finish: function() {
            let dat = jsPsych.data.get().last(1).values()[0];
            jsPsych.data.addProperties(dat);
        },
    };
}

function welcome_message(language = 'de_du', text = '') {
    const message = {
        type: jsPsychHtmlKeyboardResponse,
        response_ends_trial: true,
        stimulus: '',
    };
    if (text !== '') {
        message.stimulus = text;
    } else if (language === 'en') {
        message.stimulus = '<h2>Welcome. Press any key to continue.</h2>';
    } else if (language === 'de_sie') {
        message.stimulus = '<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>';
    } else if (language === 'de_du') {
        message.stimulus = '<h2>Willkommen. Bitte drücke eine beliebige Taste, um fortzufahren!</h2>';
    }
    return message;
}

function end_message(language = 'de_du', text = '') {
    const message = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
    };
    if (text !== '') {
        message.stimulus = text;
    } else if (language === 'en') {
        message.stimulus = '<h2>The experiment is finished.</h2>' + '<h2>Press any key to end the experiment!</h2>';
    } else if (language === 'de_sie') {
        message.stimulus =
            '<h2>Das Experiment ist beendet.</h2>' +
            '<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>';
        message.stimulus = '<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>';
    } else if (language === 'de_du') {
        message.stimulus =
            '<h2>Das Experiment ist beendet.</h2>' +
            '<h2>Drücke eine beliebige Taste, um das Experiment zu beenden!</h2>';
    }
    return message;
}

function resize_browser(language = 'de_du', message = '') {
    const resize = {
        type: jsPsychResize,
        stimulus: '',
        button_label: '',
        item_width: 3 + 3 / 8,
        item_height: 2 + 1 / 8,
        pixels_per_unit: 100,
        prompt: '',
    };
    if (message !== '') {
        resize.prompt = message;
    } else if (language === 'en') {
        resize.prompt =
            '<p>Resize the rectangle (click and drag bottom right corner) until it is the same size as a standard bankcard.</p>';
        resize.button_label = 'Continue';
    } else if (language === 'de_sie') {
        resize.prompt =
            '<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>';
        resize.button_label = 'Weiter';
    } else if (language === 'de_du') {
        resize.prompt =
            '<p>Klicke und ziehe die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder dein Universitätsausweis hat.</p>';
        resize.button_label = 'Weiter';
    }
    return resize;
}

function fullscreen(on, language = 'de') {
    if (language === 'de') {
        return {
            type: jsPsychFullscreen,
            fullscreen_mode: on,
            message: '<p>Das Experiment wechselt in den Vollbildmodus, sobald du die Taste ‚Weiter‘ drückst</p>',
            button_label: 'Weiter',
        };
    } else if (language === 'en') {
        return {
            type: jsPsychFullscreen,
            fullscreen_mode: on,
            button_label: 'Continue',
        };
    }
}

function mouseCursor(show) {
    return {
        type: jsPsychCallFunction,
        func: function() {
            $('body').css('cursor', show ? 'default' : 'none');
        },
    };
}

function checkVpInfoForm(alert_language = 'en', alert_message = '') {
    // get age, gender, handedness and VPs consent
    if (alert_message === '') {
        if (alert_language === 'en') {
            alert_message = 'Please answer all questions and click the consent box to continue!';
        } else if (alert_language === 'de') {
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

function vpInfoForm(form = '/Common7+/vpInfoForm_de.html', alert_language = 'de', alert_message = '') {
    return {
        type: jsPsychExternalHtml,
        url: form,
        cont_btn: 'start',
        check_fn: function() {
            const vpInfo = checkVpInfoForm({ alert_language: alert_language, alert_message: alert_message });
            if (vpInfo !== false) {
                jsPsych.data.addProperties(vpInfo);
                return true;
            } else {
                return false;
            }
        },
    };
}

function calculateBlockPerformance({ filter_options = {}, rtColumn = 'rt', corrColumn = 'corrCode', corrValue = 1 } = {}) {
    let dat = jsPsych.data.get().filter(filter_options);

    let nTotal = dat.count();
    let nError = dat.select(corrColumn).values.filter(function(x) {
        return x !== corrValue;
    }).length;
    let meanRt = Math.round(dat.select(rtColumn).mean());
    let errorRate = Math.round((nError / nTotal) * 100);

    return { meanRt: meanRt, errorRate: errorRate };
}

function blockFeedbackText(cBlk, nBlks, meanRt, errorRate, language = 'de') {
    let blockFbTxt;
    if (language === 'de') {
        blockFbTxt = blockFbTxt =
            '<h2>Block: ' +
            cBlk +
            ' von ' +
            nBlks +
            '</h2><br>' +
            '<h2>Mittlere Reaktionszeit: ' +
            meanRt +
            ' ms </h2>' +
            '<h2>Fehlerrate: ' +
            errorRate +
            ' %</h2><br>' +
            '<h2>Drücke eine beliebige Taste, um fortzufahren!</h2>';
    } else if (language === 'en') {
        blockFbTxt =
            '<h2>Block: ' +
            cBlk +
            ' of ' +
            nBlks +
            '</h2><br>' +
            '<h2>Mean RT: ' +
            meanRt +
            ' ms </h2>' +
            '<h2>Error Rate: ' +
            errorRate +
            ' %</h2><br>' +
            '<h2>Press any key to continue the experiment!</h2>';
    }
    return blockFbTxt;
}
