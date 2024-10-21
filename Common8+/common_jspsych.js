function filter_data_pavlovia(
    rows = {},
    filetype = "csv",
    colsToIgnore = ["stimulus", "trial_type", "internal_node_id", "trial_index", "time_elapsed"],
) {
    if (filetype === "csv") {
        return jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
    } else if (filetype === "json") {
        return jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
    }
}

function password(psw) {
    let correct = false;
    $.ajax({
        url: "/Common7+/password.php",
        type: "POST",
        async: false,
        data: { password: psw },
    }).done(function (data) {
        correct = data;
    });
    return correct;
}

function save_data_server(
    url,
    filename,
    rows = {},
    filetype = "csv",
    colsToIgnore = ["stimulus", "trial_type", "internal_node_id", "trial_index", "time_elapsed"],
) {
    let dat;
    if (filetype === "csv") {
        dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).csv();
    } else if (filetype === "json") {
        dat = jsPsych.data.get().filter(rows).ignore(colsToIgnore).json(true); // true to avoid single line
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}

function save_data_local(
    filename,
    rows = {},
    filetype = "csv",
    columns_to_ignore = ["stimulus", "trial_type", "internal_node_id", "trial_index", "time_elapsed"],
) {
    jsPsych.data
        .get()
        .filter(rows)
        .ignore(columns_to_ignore)
        .localSave(filetype, filename + "." + filetype);
}

function save_random_code(url, filename, code) {
    $.ajax({
        type: "post",
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
    "use strict";
    user_interaction_data.event = data.event;
    user_interaction_data.trial = data.trial;
    user_interaction_data.time = data.time;
}

function save_interaction_data(url, filename) {
    let dat = jsPsych.data.getInteractionData().csv();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ filename: filename, filedata: dat }));
}

////////////////////////////////////////////////////////////////////////
//                          Common Variables                          //
////////////////////////////////////////////////////////////////////////
function browser_check(screen_res = [960, 1280]) {
    return {
        type: jsPsychBrowserCheck,
        minimum_width: screen_res[1],
        minimum_height: screen_res[0],
        features: ["width", "height", "browser", "vsync_rate", "os"],
        on_finish: function () {
            let dat = jsPsych.data.get().last(1).values()[0];
            jsPsych.data.addProperties(dat);
        },
    };
}

function welcome_message(language = "de_du", text = "") {
    const message = {
        type: jsPsychHtmlKeyboardResponse,
        response_ends_trial: true,
        stimulus: "",
    };
    if (text !== "") {
        message.stimulus = text;
    } else if (language === "en") {
        message.stimulus = "<h2>Welcome. Press any key to continue.</h2>";
    } else if (language === "de_sie") {
        message.stimulus = "<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
    } else if (language === "de_du") {
        message.stimulus = "<h2>Willkommen. Bitte drücke eine beliebige Taste, um fortzufahren!</h2>";
    }
    return message;
}

function end_message(language = "de_du", text = "") {
    const message = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "",
    };
    if (text !== "") {
        message.stimulus = text;
    } else if (language === "en") {
        message.stimulus = "<h2>The experiment is finished.</h2>" + "<h2>Press any key to end the experiment!</h2>";
    } else if (language === "de_sie") {
        message.stimulus =
            "<h2>Das Experiment ist beendet.</h2>" +
            "<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>";
        message.stimulus = "<h2>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
    } else if (language === "de_du") {
        message.stimulus =
            "<h2>Das Experiment ist beendet.</h2>" +
            "<h2>Drücke eine beliebige Taste, um das Experiment zu beenden!</h2>";
    }
    return message;
}

function resize_browser(language = "de_du", message = "") {
    const resize = {
        type: jsPsychResize,
        stimulus: "",
        button_label: "",
        item_width: 3 + 3 / 8,
        item_height: 2 + 1 / 8,
        pixels_per_unit: 125,
        prompt: "",
    };
    if (message !== "") {
        resize.prompt = message;
    } else if (language === "en") {
        resize.prompt =
            "<p>Resize the rectangle (click and drag bottom right corner) until it is the same size as a standard bankcard.</p>";
        resize.button_label = "Continue";
    } else if (language === "de_sie") {
        resize.prompt =
            "<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>";
        resize.button_label = "Weiter";
    } else if (language === "de_du") {
        resize.prompt =
            "<p>Klicke und ziehe die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder dein Universitätsausweis hat.</p>";
        resize.button_label = "Weiter";
    }
    return resize;
}

function fullscreen(on, language = "de") {
    if (language === "de") {
        return {
            type: jsPsychFullscreen,
            fullscreen_mode: on,
            message: "<p>Das Experiment wechselt in den Vollbildmodus, sobald du die Taste ‚Weiter‘ drückst</p>",
            button_label: "Weiter",
        };
    } else if (language === "en") {
        return {
            type: jsPsychFullscreen,
            fullscreen_mode: on,
            button_label: "Continue",
        };
    }
}

function mouse_cursor(show) {
    return {
        type: jsPsychCallFunction,
        func: function () {
            $("body").css("cursor", show ? "default" : "none");
        },
    };
}

function check_vp_info_form(alert_language = "en", alert_message = "") {
    // get age, gender, handedness and VPs consent
    if (alert_message === "") {
        if (alert_language === "en") {
            alert_message = "Please answer all questions and click the consent box to continue!";
        } else if (alert_language === "de") {
            alert_message = "Bitte beantworten alle Fragen!";
        }
    }

    let age = document.getElementById("age").value;

    let gender = "";
    if ($("#male").is(":checked")) {
        gender = "male";
    } else if ($("#female").is(":checked")) {
        gender = "female";
    } else if ($("#divers").is(":checked")) {
        gender = "na";
    }

    let hand = "";
    if ($("#left").is(":checked")) {
        hand = "left";
    } else if ($("#right").is(":checked")) {
        hand = "right";
    }

    let consent = false;
    if ($("#consent_checkbox").is(":checked")) {
        consent = true;
    }

    if (consent && age !== "" && gender !== "" && hand !== "") {
        return { age: age, gender: gender, handedness: hand };
    } else {
        window.alert(alert_message);
        return false;
    }
}

function vp_info_form(form = "/Common7+/vpInfoForm_de.html", alert_language = "de", alert_message = "") {
    return {
        type: jsPsychExternalHtml,
        url: form,
        cont_btn: "start",
        check_fn: function () {
            const vp_info = check_vp_info_form({ alert_language: alert_language, alert_message: alert_message });
            if (vp_info !== false) {
                jsPsych.data.addProperties(vp_info);
                return true;
            } else {
                return false;
            }
        },
    };
}

function calculate_block_performance({
    filter_options = {},
    rt_column = "rt",
    corr_column = "corr_code",
    corr_value = 1,
} = {}) {
    let dat = jsPsych.data.get().filter(filter_options);

    let ntotal = dat.count();
    let nerror = dat.select(corr_column).values.filter(function (x) {
        return x !== corr_value;
    }).length;
    let mean_rt = Math.round(dat.select(rt_column).mean());
    let error_rate = Math.round((nerror / ntotal) * 100);

    return { mean_rt: mean_rt, error_rate: error_rate };
}

function block_feedback_text(cblk, nblks, mean_rt, error_rate, language = "de") {
    let block_txt;
    if (language === "de") {
        block_txt = block_txt =
            "<h2>Block: " +
            cblk +
            " von " +
            nblks +
            "</h2><br>" +
            "<h2>Mittlere Reaktionszeit: " +
            mean_rt +
            " ms </h2>" +
            "<h2>Fehlerrate: " +
            error_rate +
            " %</h2><br>" +
            "<h2>Drücke eine beliebige Taste, um fortzufahren!</h2>";
    } else if (language === "en") {
        block_txt =
            "<h2>Block: " +
            cblk +
            " of " +
            nblks +
            "</h2><br>" +
            "<h2>Mean RT: " +
            mean_rt +
            " ms </h2>" +
            "<h2>Error Rate: " +
            error_rate +
            " %</h2><br>" +
            "<h2>Press any key to continue the experiment!</h2>";
    }
    return block_txt;
}
