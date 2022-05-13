function checkVpInfoFormClinic(alert_language = 'de', alert_message = '') {
    // get age, gender, handedness and VPs consent
    if (alert_message === '') {
        if (alert_language === 'en') {
            alert_message = 'Please answer all questions and click the consent box to continue!';
        } else if (alert_language === 'de') {
            alert_message = 'Bitte beantworten alle Fragen!';
        }
    }

    let code = document.getElementById('code').value;
    let age_years = document.getElementById('age_years').value;
    let age_months = document.getElementById('age_months').value;

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

    if (consent && code !== '' && age_years !== '' && age_months !== '' && gender !== '' && hand !== '') {
        return { code: code, age_years: age_years, age_months: age_months, gender: gender, handedness: hand };
    } else {
        window.alert(alert_message);
        return false;
    }
}

function vpInfoFormClinic(form = '/Common7+/vpInfoFormClinic_de.html', alert_language = 'de', alert_message = '') {
    return {
        type: jsPsychExternalHtml,
        url: form,
        cont_btn: 'start',
        check_fn: function() {
            const vpInfo = checkVpInfoFormClinic(alert_language = alert_language, alert_message = alert_message);
            if (vpInfo !== false) {
                jsPsych.data.addProperties(vpInfo);
                return true;
            } else {
                return false;
            }
        },
    };
}

