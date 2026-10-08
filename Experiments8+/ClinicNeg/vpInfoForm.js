function check_vp_info_form_clinic(alert_language = 'de', alert_message = '') {
  if (alert_message === '') {
    if (alert_language === 'en') {
      alert_message = 'Please answer all questions and click the consent box to continue!';
    } else if (alert_language === 'de') {
      alert_message = 'Bitte beantworten Sie alle Fragen und bestätigen Sie das Einverständnis!';
    }
  }

  let code_el = document.getElementById('code');
  let age_y_el = document.getElementById('age_years');
  let age_m_el = document.getElementById('age_months');

  let code = code_el ? code_el.value.trim() : '';
  let age_years = age_y_el ? age_y_el.value.trim() : '';
  let age_months = age_m_el ? age_m_el.value.trim() : '';

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

  let consent = $('#consent_checkbox').is(':checked');

  // Development & Lab Setup options
  let version = $('#version').length ? parseInt($('#version').val(), 10) : 1;
  let mode = $('#mode').length ? $('#mode').val() : 'standard';
  let is_debug = mode === 'debug';
  let fullscreen_enabled = $('#fullscreen').length ? $('#fullscreen').is(':checked') : true;

  if (consent && code !== '' && age_years !== '' && age_months !== '' && gender !== '' && hand !== '') {
    return {
      code: code,
      age_years: age_years,
      age_months: age_months,
      gender: gender,
      handedness: hand,
      version: version,
      mode: mode,
      is_debug: is_debug,
      fullscreen: fullscreen_enabled,
    };
  } else {
    window.alert(alert_message);
    return false;
  }
}
const checkVpInfoFormClinic = check_vp_info_form_clinic;

function vp_info_form_clinic(
  form = '../vpInfoFormClinic_de.html',
  alert_language = 'de',
  alert_message = '',
) {
  return {
    type: jsPsychExternalHtml,
    url: form,
    cont_btn: 'start',
    check_fn: function () {
      const vpInfo = check_vp_info_form_clinic(alert_language, alert_message);
      if (vpInfo !== false) {
        jsPsych.data.addProperties(vpInfo);
        return true;
      } else {
        return false;
      }
    },
  };
}
const vpInfoFormClinic = vp_info_form_clinic;
