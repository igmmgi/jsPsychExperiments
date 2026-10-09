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
  let male_el = document.getElementById('male');
  let female_el = document.getElementById('female');
  let divers_el = document.getElementById('divers');
  if (male_el && male_el.checked) {
    gender = 'male';
  } else if (female_el && female_el.checked) {
    gender = 'female';
  } else if (divers_el && divers_el.checked) {
    gender = 'na';
  }

  let hand = '';
  let left_el = document.getElementById('left');
  let right_el = document.getElementById('right');
  if (left_el && left_el.checked) {
    hand = 'left';
  } else if (right_el && right_el.checked) {
    hand = 'right';
  }

  let consent_el = document.getElementById('consent_checkbox');
  let consent = consent_el ? consent_el.checked : false;

  // Development & Lab Setup options
  let version_el = document.getElementById('version');
  let version = version_el ? parseInt(version_el.value, 10) : 1;
  let mode_el = document.getElementById('mode');
  let mode = mode_el ? mode_el.value : 'standard';
  let is_debug = mode === 'debug';
  let fullscreen_el = document.getElementById('fullscreen');
  let fullscreen_enabled = fullscreen_el ? fullscreen_el.checked : true;

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
