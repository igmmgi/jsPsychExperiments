// B.Sc. Project: Affective Cross-Modal Priming (Ronja)
//
// Emotional auditory prime (positive vs. negative environmental sound, 1000 ms + central fixation '+')
// followed by a visual target (150 ms) and visual asterisk mask (up to 1850 ms; 2000 ms total window).
// Target type is manipulated blockwise:
// - Face blocks: Happy vs. Sad facial expressions from the MPI FACES database (4-row asterisk mask)
// - Word blocks: Positive vs. Negative German words (single-row '********' mask)
//
// Catch trials (5% of trials): No auditory prime is presented during the 1000 ms fixation cross;
// participants must withhold their response to the subsequent visual target.

const jsPsych = initJsPsych({
    on_finish: function () {
        if (PRMS.cblk > PRMS.nblks_total && jsPsych.data.urlVariables().sona_id) {
            // TODO: Insert SONA experiment_id and credit_token when active
            // window.location.assign(
            //     "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=XXXX&credit_token=XXXX&survey_code=" +
            //         jsPsych.data.urlVariables().sona_id,
            // );
        }
    },
});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(255, 255, 255, 1)";
const CANVAS_SIZE = [720, 1024]; // [height, width]

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();
const SIMULATION_MODE = jsPsych.data.urlVariables().simulate || null;

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls_prac: 20, // trials per practice block (includes 5% = 1 catch trial + 19 go trials)
    ntrls_exp: 80, // trials per experimental block (includes 5% = 4 catch trials + 76 go trials)
    nblks_prac: 1, // practice blocks per target type (2 total)
    nblks_exp: 3, // experimental blocks per target type (6 total = 480 exp trials)
    nblks_total: 8, // 2 practice + 6 experimental blocks
    catch_prop: 0.05, // 5% catch trials (no auditory prime -> withhold response)
    catch_min_gap: 1, // minimum number of go trials between catch trials (1 = never back-to-back; also never Trial 1)
    prime_dur: 1000, // simultaneous fixation cross + auditory prime duration in ms
    target_dur: 150, // visual target duration in ms before mask onset
    too_fast: 150, // anticipatory cutoff in ms from target onset
    too_slow: 2000, // maximum response window in ms from target onset (150 ms target + 1850 ms mask)
    fb_dur: [0, 1500, 1500, 1500, 1500], // [correct, choice error, too slow, too fast, catch false alarm]
    fb_txt: [
        "Richtig!",
        "Falsch!",
        "Zu langsam!",
        "Zu schnell!",
        "Falsch! Kein Sound – bitte nicht reagieren!",
    ],
    iti: 500, // blank white inter-trial interval in ms
    sound_check_gap: 500, // gap between sounds during sound check in ms
    wait_duration: 1000, // post-trial gap after block feedback / instructions in ms
    fix_size: 15, // half-length of central '+' fixation cross arms in px
    fix_width: 4, // line width of central '+' fixation cross in px
    fix_colour: "black",
    word_font: "bold 44px monospace",
    word_mask: "********",
    face_size: [250, 363], // [width, height] of MPI face PNGs in px
    face_mask_rows: ["********", "********", "********", "********"],
    face_mask_font: "bold 56px monospace",
    face_mask_line_spacing: 85, // vertical spacing between the 4 asterisk rows in px
    fb_font: "bold 30px monospace",
    instruction_fontsize: 24,
    key_pair: ["f", "j"], // [left index finger, right index finger]
    resp_keys: {},
    target_type_order: [],
    ctrl: 1, // trial counter within block
    cblk: 1, // overall block counter (1..8)
    cexp_blk: 1, // experimental block counter (1..6)
};

////////////////////////////////////////////////////////////////////////
//              Counterbalancing (Block Order & Keys)                 //
////////////////////////////////////////////////////////////////////////
// Version 1: Faces -> Words | F = Positiv, J = Negativ
// Version 2: Faces -> Words | F = Negativ, J = Positiv
// Version 3: Words -> Faces | F = Positiv, J = Negativ
// Version 4: Words -> Faces | F = Negativ, J = Positiv
const VERSION = Number(jsPsych.data.urlVariables().version) || get_random_int(1, 4);

if (VERSION === 1) {
    PRMS.target_type_order = ["face", "word"];
    PRMS.resp_keys = { positive: PRMS.key_pair[0], negative: PRMS.key_pair[1] };
} else if (VERSION === 2) {
    PRMS.target_type_order = ["face", "word"];
    PRMS.resp_keys = { positive: PRMS.key_pair[1], negative: PRMS.key_pair[0] };
} else if (VERSION === 3) {
    PRMS.target_type_order = ["word", "face"];
    PRMS.resp_keys = { positive: PRMS.key_pair[0], negative: PRMS.key_pair[1] };
} else if (VERSION === 4) {
    PRMS.target_type_order = ["word", "face"];
    PRMS.resp_keys = { positive: PRMS.key_pair[1], negative: PRMS.key_pair[0] };
}

const RESPONSE_CHOICES = SIMULATION_MODE
    ? [PRMS.resp_keys.positive, PRMS.resp_keys.negative]
    : [PRMS.resp_keys.positive, PRMS.resp_keys.negative, "escape"];

jsPsych.data.addProperties({
    version: VERSION,
    target_type_order: PRMS.target_type_order.join(","),
    key_positive: PRMS.resp_keys.positive,
    key_negative: PRMS.resp_keys.negative,
});

////////////////////////////////////////////////////////////////////////
//                           Stimulus Sets                            //
////////////////////////////////////////////////////////////////////////
// Auditory primes (Environmental Sounds: 8 positive, 8 negative)
// Replace placeholder .wav files in sounds/positive/ and sounds/negative/ when final files arrive
const SOUNDS = {
    positive: [
        { name: "laughter", file: "sounds/positive/laughter.wav" },
        { name: "guitar", file: "sounds/positive/guitar.wav" },
        { name: "drum", file: "sounds/positive/drum.wav" },
        { name: "human_whistle", file: "sounds/positive/human_whistle.wav" },
        { name: "river", file: "sounds/positive/river.wav" },
        { name: "rain", file: "sounds/positive/rain.wav" },
        { name: "canary", file: "sounds/positive/canary.wav" },
        { name: "piano", file: "sounds/positive/piano.wav" },
    ],
    negative: [
        { name: "machine_gun", file: "sounds/negative/machine_gun.wav" },
        { name: "mosquito", file: "sounds/negative/mosquito.wav" },
        { name: "baby", file: "sounds/negative/baby.wav" },
        { name: "snoring", file: "sounds/negative/snoring.wav" },
        { name: "fire_truck", file: "sounds/negative/fire_truck.wav" },
        { name: "throat_clearing", file: "sounds/negative/throat_clearing.wav" },
        { name: "car", file: "sounds/negative/car.wav" },
        { name: "cannon", file: "sounds/negative/cannon.wav" },
    ],
};

// Visual word targets (8 positive, 8 negative German words)
const WORDS = {
    positive: ["Freude", "Lachen", "sonnig", "Euphorie", "ehrlich", "genießen", "Juwel", "Glück"],
    negative: ["Henker", "verletzt", "Fieber", "grausam", "Mord", "Elend", "Qual", "töten"],
};

// Visual face targets (MPI FACES database: 8 happy [4f, 4m], 8 sad [4f, 4m])
const FACES = {
    positive: [
        { name: "031_y_m_h_a.png", file: "faces/happy/031_y_m_h_a.png" },
        { name: "034_y_f_h_a.png", file: "faces/happy/034_y_f_h_a.png" },
        { name: "037_y_m_h_a.png", file: "faces/happy/037_y_m_h_a.png" },
        { name: "040_y_f_h_a.png", file: "faces/happy/040_y_f_h_a.png" },
        { name: "041_y_m_h_a.png", file: "faces/happy/041_y_m_h_a.png" },
        { name: "048_y_f_h_a.png", file: "faces/happy/048_y_f_h_a.png" },
        { name: "049_y_m_h_a.png", file: "faces/happy/049_y_m_h_a.png" },
        { name: "054_y_f_h_a.png", file: "faces/happy/054_y_f_h_a.png" },
    ],
    negative: [
        { name: "008_y_m_s_a.png", file: "faces/sad/008_y_m_s_a.png" },
        { name: "010_y_f_s_a.png", file: "faces/sad/010_y_f_s_a.png" },
        { name: "013_y_m_s_a.png", file: "faces/sad/013_y_m_s_a.png" },
        { name: "016_y_m_s_a.png", file: "faces/sad/016_y_m_s_a.png" },
        { name: "020_y_f_s_a.png", file: "faces/sad/020_y_f_s_a.png" },
        { name: "022_y_f_s_a.png", file: "faces/sad/022_y_f_s_a.png" },
        { name: "025_y_m_s_a.png", file: "faces/sad/025_y_m_s_a.png" },
        { name: "028_y_f_s_a.png", file: "faces/sad/028_y_f_s_a.png" },
    ],
};

const ALL_SOUND_FILES = [...SOUNDS.positive, ...SOUNDS.negative].map((s) => s.file);
const ALL_FACE_FILES = [...FACES.positive, ...FACES.negative].map((f) => f.file);

// Pre-decoded HTMLImageElement cache for synchronous zero-flicker canvas drawing
const FACE_IMAGES = {};
for (const filepath of ALL_FACE_FILES) {
    const img = new Image();
    img.src = filepath;
    FACE_IMAGES[filepath] = img;
}

const PRELOAD = {
    type: jsPsychPreload,
    images: ALL_FACE_FILES,
    audio: ALL_SOUND_FILES,
};

const VP_INFO_FORM = {
    type: jsPsychExternalHtml,
    url: "../../Common8+/vpInfoForm_de_copyright.html",
    cont_btn: "start",
    check_fn: function () {
        const vp_info = check_vp_info_form("de");
        if (vp_info !== false) {
            jsPsych.data.addProperties(vp_info);
            return true;
        }
        return false;
    },
};

////////////////////////////////////////////////////////////////////////
//                      Instruction Helpers                           //
////////////////////////////////////////////////////////////////////////
function get_mapping_html(target_type = null) {
    let pos_label = "Positiv";
    let neg_label = "Negativ";
    if (target_type === "face") {
        pos_label = "Positiv (fröhliches Gesicht)";
        neg_label = "Negativ (trauriges Gesicht)";
    } else if (target_type === "word") {
        pos_label = "Positiv (positives Wort)";
        neg_label = "Negativ (negatives Wort)";
    }

    const left_key = PRMS.key_pair[0].toUpperCase();
    const right_key = PRMS.key_pair[1].toUpperCase();
    let html = "";
    if (PRMS.resp_keys.positive === PRMS.key_pair[0]) {
        html += `<b>${pos_label}</b> &rarr; Taste <b>„${left_key}“</b> (linker Zeigefinger)<br>`;
        html += `<b>${neg_label}</b> &rarr; Taste <b>„${right_key}“</b> (rechter Zeigefinger)<br>`;
    } else {
        html += `<b>${neg_label}</b> &rarr; Taste <b>„${left_key}“</b> (linker Zeigefinger)<br>`;
        html += `<b>${pos_label}</b> &rarr; Taste <b>„${right_key}“</b> (rechter Zeigefinger)<br>`;
    }
    return html;
}

////////////////////////////////////////////////////////////////////////
//                           Sound Check                              //
////////////////////////////////////////////////////////////////////////
const SOUND_CHECK_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
        html += "<h2>Soundcheck</h2>";
        html += "Bevor das Experiment beginnt, führen wir einen kurzen Soundcheck durch.<br><br>";
        html += "Bitte setze deine <b>Kopfhörer</b> auf oder schalte deine <b>Lautsprecher</b> ein ";
        html += "und stelle eine angenehme, gut hörbare Lautstärke ein.<br><br>";
        html += "Im Folgenden werden dir alle Geräusche, die im Experiment vorkommen, einmal in voller Länge vorgespielt. ";
        html += "Gleichzeitig siehst du auf dem Bildschirm, ob es sich um einen <b>„Positiven Sound“</b> oder einen <b>„Negativen Sound“</b> handelt.<br><br>";
        html += "Die Wiedergabe läuft automatisch ab – du musst währenddessen keine Taste drücken.<br><br>";
        html += "<b>Drücke eine beliebige Taste, um den Soundcheck zu starten.</b>";
        html += "</div>";
        return html;
    },
    post_trial_gap: PRMS.wait_duration,
};

function generate_sound_check_timeline() {
    const sound_check_items = [];
    for (const s of SOUNDS.positive) {
        sound_check_items.push({
            sound_name: s.name,
            sound_file: s.file,
            sound_valence: "positive",
            label: "Positiver Sound",
        });
    }
    for (const s of SOUNDS.negative) {
        sound_check_items.push({
            sound_name: s.name,
            sound_file: s.file,
            sound_valence: "negative",
            label: "Negativer Sound",
        });
    }

    return {
        timeline: [
            {
                type: jsPsychAudioKeyboardResponse,
                stimulus: jsPsych.timelineVariable("sound_file"),
                choices: "NO_KEYS",
                response_ends_trial: false,
                trial_ends_after_audio: true,
                post_trial_gap: PRMS.sound_check_gap,
                prompt: function () {
                    const label = jsPsych.evaluateTimelineVariable("label");
                    return `<div style="text-align:center; font-size:40px; font-weight:bold; font-family:monospace;">${label}</div>`;
                },
                data: {
                    stim: "SoundCheck",
                    sound_name: jsPsych.timelineVariable("sound_name"),
                    sound_valence: jsPsych.timelineVariable("sound_valence"),
                },
            },
        ],
        timeline_variables: shuffle(sound_check_items),
    };
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
        html += "<h2>Aufgabenbeschreibung</h2>";
        html += "Soundcheck abgeschlossen! Nun folgen die Instruktionen für das Experiment.<br><br>";
        html += "In jedem Durchgang siehst du zunächst ein Fixationskreuz (<b>+</b>) in der Mitte des Bildschirms ";
        html += "und hörst gleichzeitig ein kurzes Geräusch (positiv oder negativ).<br><br>";
        html += "Direkt danach erscheint kurz ein visueller Zielreiz (in einer Hälfte des Experiments <b>Gesichter</b>, ";
        html += "in der anderen Hälfte <b>Wörter</b>), gefolgt von einer Maske aus Sternchen (<b>********</b>).<br><br>";
        html += "Deine Aufgabe ist es, die emotionale Valenz (<b>Positiv</b> vs. <b>Negativ</b>) des <b>visuellen Zielreizes</b> ";
        html += "so schnell und so genau wie möglich zu klassifizieren – unabhängig davon, welches Geräusch zuvor zu hören war.<br><br>";
        html += "<b>Drücke eine beliebige Taste, um fortzufahren.</b>";
        html += "</div>";
        return html;
    },
    post_trial_gap: 500,
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
        html += "<h2>Wichtiger Hinweis &amp; Tastenzuordnung</h2>";
        html += "<b>ACHTUNG – Durchgänge ohne Sound:</b><br>";
        html += "In einigen wenigen Durchgängen wird während des Fixationskreuzes <b>kein Geräusch</b> abgespielt!<br>";
        html += "Immer dann, wenn du <b>keinen Sound</b> gehört hast, darfst du auf den nachfolgenden visuellen Zielreiz ";
        html += "<b>NICHT reagieren</b> (drücke keine Taste und warte kurz, bis der nächste Durchgang startet).<br><br>";
        html += "Wenn du ein Geräusch gehört hast, antworte so schnell und genau wie möglich mit folgenden Tasten:<br><br>";
        const left_key = PRMS.key_pair[0].toUpperCase();
        const right_key = PRMS.key_pair[1].toUpperCase();
        html += get_mapping_html(null);
        html += `<br>Lege deinen linken Zeigefinger auf <b>„${left_key}“</b> und deinen rechten Zeigefinger auf <b>„${right_key}“</b>.<br><br>`;
        html += "<b>Drücke eine beliebige Taste, um zu beginnen.</b>";
        html += "</div>";
        return html;
    },
    post_trial_gap: PRMS.wait_duration,
};

function phase_intro_screen(target_type, phase_num) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            const title =
                target_type === "face"
                    ? `Teil ${phase_num} von 2: Gesichter`
                    : `Teil ${phase_num} von 2: Wörter`;
            const target_desc =
                target_type === "face"
                    ? "In den folgenden Blöcken sind die visuellen Zielreize <b>Gesichter</b> mit einem <b>fröhlichen</b> (positiv) oder <b>traurigen</b> (negativ) Gesichtsausdruck."
                    : "In den folgenden Blöcken sind die visuellen Zielreize deutsche <b>Wörter</b> mit <b>positiver</b> oder <b>negativer</b> Bedeutung.";

            let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
            html += `<h2>${title}</h2>`;
            html += `${target_desc}<br><br>`;
            html += `${get_mapping_html(target_type)}<br>`;
            html += "Denke daran: Wenn zuvor <b>kein Sound</b> zu hören war, <b>nicht reagieren</b>!<br><br>";
            html += `Es folgt zunächst ein kurzer Übungsblock mit <b>${PRMS.ntrls_prac} Durchgängen</b>.<br><br>`;
            html += "<b>Drücke eine beliebige Taste, um den Übungsblock zu starten.</b>";
            html += "</div>";
            return html;
        },
        post_trial_gap: PRMS.wait_duration,
    };
}

function practice_end_screen(target_type) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            const task_label = target_type === "face" ? "Gesichter" : "Wörter";
            let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
            html += "<h2>Übung beendet!</h2>";
            html += `Nun folgen <b>${PRMS.nblks_exp} Experimentalblöcke</b> (${task_label}) mit jeweils ${PRMS.ntrls_exp} Durchgängen.<br><br>`;
            html += `${get_mapping_html(target_type)}<br>`;
            html += "Denke daran: Wenn zuvor <b>kein Sound</b> zu hören war, <b>nicht reagieren</b>!<br><br>";
            html += "<b>Drücke eine beliebige Taste, um fortzufahren.</b>";
            html += "</div>";
            return html;
        },
        post_trial_gap: PRMS.wait_duration,
    };
}

const HALFWAY_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        const next_type = PRMS.target_type_order[1] === "face" ? "Gesichter" : "Wörter";
        let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
        html += "<h2>Hälfte geschafft!</h2>";
        html += "Du hast die erste Hälfte des Experiments abgeschlossen. Nimm dir gerne einen Moment für eine kurze Pause.<br><br>";
        html += `<b>ACHTUNG:</b> In der zweiten Hälfte wechseln die visuellen Zielreize auf <b>${next_type}</b>.<br>`;
        html += "Deine Tastenzuordnung für Positiv und Negativ bleibt genau gleich.<br><br>";
        html += "<b>Drücke eine beliebige Taste, um die Instruktionen für Teil 2 zu lesen.</b>";
        html += "</div>";
        return html;
    },
    post_trial_gap: PRMS.wait_duration,
};

function block_start_screen(target_type) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            const task_label = target_type === "face" ? "Gesichter" : "Wörter";
            let html = `<div style="max-width:900px; margin:auto; text-align:center; font-size:${PRMS.instruction_fontsize}px; line-height:1.7;">`;
            html += `<h2>Block ${PRMS.cexp_blk} von ${PRMS.nblks_exp * 2} (${task_label})</h2><br>`;
            html += `${get_mapping_html(target_type)}<br>`;
            html += "Kein Sound gehört &rarr; <b>Nicht reagieren!</b><br><br>";
            html += "Versuche weiterhin so schnell und so genau wie möglich zu reagieren.<br><br>";
            html += "<b>Drücke eine beliebige Taste, um den Block zu starten.</b>";
            html += "</div>";
            return html;
        },
        post_trial_gap: PRMS.wait_duration,
    };
}

////////////////////////////////////////////////////////////////////////
//                     Canvas Drawing & Stimuli                       //
////////////////////////////////////////////////////////////////////////
function canvas_style(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    return ctx;
}

function draw_fixation(c) {
    const ctx = canvas_style(c.getContext("2d"));
    ctx.lineWidth = PRMS.fix_width;
    ctx.strokeStyle = PRMS.fix_colour;
    ctx.beginPath();
    ctx.moveTo(-PRMS.fix_size, 0);
    ctx.lineTo(PRMS.fix_size, 0);
    ctx.moveTo(0, -PRMS.fix_size);
    ctx.lineTo(0, PRMS.fix_size);
    ctx.stroke();
}

function draw_target(c, target_type, target_stim, target_file) {
    const ctx = canvas_style(c.getContext("2d"));
    if (target_type === "word") {
        ctx.font = PRMS.word_font;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(target_stim, 0, 0);
    } else if (target_type === "face") {
        const img = FACE_IMAGES[target_file];
        const w = PRMS.face_size[0];
        const h = PRMS.face_size[1];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
            const fallback = new Image();
            fallback.onload = function () {
                ctx.drawImage(fallback, -w / 2, -h / 2, w, h);
            };
            fallback.src = target_file;
        }
    }
}

function draw_mask(c, target_type) {
    const ctx = canvas_style(c.getContext("2d"));
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (target_type === "word") {
        ctx.font = PRMS.word_font;
        ctx.fillText(PRMS.word_mask, 0, 0);
    } else if (target_type === "face") {
        ctx.font = PRMS.face_mask_font;
        const rows = PRMS.face_mask_rows;
        const offset_start = -((rows.length - 1) * PRMS.face_mask_line_spacing) / 2;
        for (let i = 0; i < rows.length; i++) {
            ctx.fillText(rows[i], 0, offset_start + i * PRMS.face_mask_line_spacing);
        }
    }
}

// Active audio & mask timer handles for clean teardown
let active_prime_player = null;
let prime_trial_active = false;
let mask_timeout_id = null;

// Stage 1: Simultaneous central '+' fixation cross and auditory prime for 1000 ms
// (On catch trials, only the central '+' fixation cross is presented in silence)
const PRIME_FIXATION = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    trial_duration: PRMS.prime_dur,
    response_ends_trial: false,
    choices: "NO_KEYS",
    stimulus: draw_fixation,
    on_load: function () {
        prime_trial_active = true;
        active_prime_player = null;
        const prime_file = jsPsych.evaluateTimelineVariable("prime_file");
        if (SIMULATION_MODE !== "data-only" && prime_file !== "none") {
            jsPsych.pluginAPI.audioContext();
            jsPsych.pluginAPI.getAudioPlayer(prime_file).then(function (player) {
                if (prime_trial_active) {
                    active_prime_player = player;
                    player.play();
                }
            });
        }
    },
    on_finish: function () {
        prime_trial_active = false;
        if (active_prime_player !== null) {
            try {
                active_prime_player.stop();
            } catch (e) {
                // ignore if audio buffer already stopped
            }
            active_prime_player = null;
        }
    },
};

function code_trial() {
    "use strict";
    const dat = jsPsych.data.get().last(1).values()[0];

    if (jsPsych.pluginAPI.compareKeys(dat.response, "escape")) {
        jsPsych.endExperiment();
        return;
    }

    let corr_code = 0;
    let rt = null;

    if (dat.trial_go_nogo === "catch") {
        // Catch trial (no sound): withholding response is correct
        if (dat.response === null) {
            corr_code = 1; // correctly withheld
            rt = null;
        } else {
            corr_code = 5; // false alarm on catch trial
            rt = Math.round(dat.rt);
        }
    } else {
        // Go trial: classify visual target valence
        rt = dat.rt !== null ? Math.round(dat.rt) : PRMS.too_slow;
        const correct_key = jsPsych.pluginAPI.compareKeys(dat.response, dat.corr_resp);

        if (dat.response !== null && correct_key && rt > PRMS.too_fast && rt < PRMS.too_slow) {
            corr_code = 1; // correct
        } else if (dat.response !== null && !correct_key && rt > PRMS.too_fast && rt < PRMS.too_slow) {
            corr_code = 2; // choice error
        } else if (dat.response === null || rt >= PRMS.too_slow) {
            corr_code = 3; // too slow
        } else if (dat.response !== null && rt <= PRMS.too_fast) {
            corr_code = 4; // too fast
        }
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        rt: rt,
        corr_code: corr_code,
        block_num: PRMS.cblk,
        exp_block_num: dat.block_category === "exp" ? PRMS.cexp_blk : 0,
        trial_num: PRMS.ctrl,
    });

    PRMS.ctrl += 1;
}

// Stage 2 & 3: Visual target (150 ms) immediately followed by visual mask (up to 1850 ms; 2000 ms total window)
const TARGET_MASK = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    trial_duration: PRMS.too_slow,
    response_ends_trial: true,
    choices: RESPONSE_CHOICES,
    stimulus: function (c) {
        const target_type = jsPsych.evaluateTimelineVariable("target_type");
        const target_stim = jsPsych.evaluateTimelineVariable("target_stim");
        const target_file = jsPsych.evaluateTimelineVariable("target_file");

        draw_target(c, target_type, target_stim, target_file);

        if (mask_timeout_id !== null) {
            clearTimeout(mask_timeout_id);
        }
        mask_timeout_id = setTimeout(function () {
            mask_timeout_id = null;
            draw_mask(c, target_type);
        }, PRMS.target_dur);
    },
    data: {
        stim: "CrossModalPriming",
        phase: jsPsych.timelineVariable("phase"),
        block_category: jsPsych.timelineVariable("block_category"),
        target_type: jsPsych.timelineVariable("target_type"),
        trial_go_nogo: jsPsych.timelineVariable("trial_go_nogo"),
        prime_valence: jsPsych.timelineVariable("prime_valence"),
        prime_stim: jsPsych.timelineVariable("prime_stim"),
        target_valence: jsPsych.timelineVariable("target_valence"),
        target_stim: jsPsych.timelineVariable("target_stim"),
        congruency: jsPsych.timelineVariable("congruency"),
        corr_resp: jsPsych.timelineVariable("corr_resp"),
    },
    simulation_options: {
        data: {
            rt: function () {
                const go_nogo = jsPsych.evaluateTimelineVariable("trial_go_nogo");
                if (go_nogo === "catch") {
                    // 90% correctly withhold (rt > trial_duration -> jsPsych sets both rt and response to null)
                    return Math.random() < 0.9 ? PRMS.too_slow + 100 : get_random_int(350, 800);
                }
                const cong = jsPsych.evaluateTimelineVariable("congruency");
                const mean_rt = cong === "congruent" ? 540 : 580;
                const rt = jsPsych.randomization.sampleExGaussian(mean_rt, 60, 1 / 120, true);
                return Math.max(180, Math.min(1950, Math.round(rt)));
            },
            response: function () {
                const go_nogo = jsPsych.evaluateTimelineVariable("trial_go_nogo");
                if (go_nogo === "catch") {
                    return Math.random() < 0.5 ? PRMS.resp_keys.positive : PRMS.resp_keys.negative;
                }
                const corr_resp = jsPsych.evaluateTimelineVariable("corr_resp");
                const other_key =
                    corr_resp === PRMS.resp_keys.positive ? PRMS.resp_keys.negative : PRMS.resp_keys.positive;
                return Math.random() < 0.9 ? corr_resp : other_key;
            },
        },
    },
    on_finish: function () {
        if (mask_timeout_id !== null) {
            clearTimeout(mask_timeout_id);
            mask_timeout_id = null;
        }
        code_trial();
    },
};

const TRIAL_FEEDBACK = {
    timeline: [
        {
            type: jsPsychCanvasKeyboardResponse,
            canvas_size: CANVAS_SIZE,
            response_ends_trial: false,
            choices: "NO_KEYS",
            stimulus: function (c) {
                const ctx = canvas_style(c.getContext("2d"));
                const dat = jsPsych.data.get().filter({ stim: "CrossModalPriming" }).last(1).values()[0];
                if (dat && dat.corr_code && PRMS.fb_dur[dat.corr_code - 1] > 0) {
                    ctx.font = PRMS.fb_font;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black";
                    ctx.fillText(PRMS.fb_txt[dat.corr_code - 1], 0, 0);
                }
            },
            on_start: function (trial) {
                const dat = jsPsych.data.get().filter({ stim: "CrossModalPriming" }).last(1).values()[0];
                trial.trial_duration = dat && dat.corr_code ? PRMS.fb_dur[dat.corr_code - 1] : 0;
            },
        },
    ],
    conditional_function: function () {
        const dat = jsPsych.data.get().filter({ stim: "CrossModalPriming" }).last(1).values()[0];
        return Boolean(dat && dat.corr_code && PRMS.fb_dur[dat.corr_code - 1] > 0);
    },
};

const ITI = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    trial_duration: PRMS.iti,
    response_ends_trial: false,
    choices: "NO_KEYS",
    stimulus: function (c) {
        canvas_style(c.getContext("2d"));
    },
};

function create_block_feedback(block_category) {
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "",
        response_ends_trial: true,
        post_trial_gap: PRMS.wait_duration,
        on_start: function (trial) {
            const block_dvs = calculate_block_performance({
                filter_options: { stim: "CrossModalPriming", block_num: PRMS.cblk },
                corr_column: "corr_code",
                rt_column: "rt",
            });
            const mean_rt_txt = isNaN(block_dvs.mean_rt) ? "-" : block_dvs.mean_rt;
            let text = "";
            if (block_category === "practice") {
                text =
                    "<h2>Übungsblock abgeschlossen</h2><br>" +
                    `<h2>Mittlere Reaktionszeit: ${mean_rt_txt} ms</h2>` +
                    `<h2>Fehlerrate: ${block_dvs.error_rate} %</h2><br>` +
                    "<h2>Drücke eine beliebige Taste, um fortzufahren!</h2>";
            } else {
                text = block_feedback_text(
                    PRMS.cexp_blk,
                    PRMS.nblks_exp * 2,
                    mean_rt_txt,
                    block_dvs.error_rate,
                    "de",
                );
            }
            trial.stimulus = `<div style="max-width:960px; margin:auto;">${text}</div>`;
        },
        on_finish: function () {
            PRMS.ctrl = 1;
            PRMS.cblk += 1;
            if (block_category === "exp") {
                PRMS.cexp_blk += 1;
            }
        },
    };
}

////////////////////////////////////////////////////////////////////////
//                         Trial Generation                           //
////////////////////////////////////////////////////////////////////////
// Draws from an 8-item shuffled bag without replacement, refilling when empty,
// and ensures the drawn item never repeats the immediately preceding trial (t != t - 1).
function draw_from_bag(bag, full_pool, get_id, prev_id) {
    if (bag.length === 0) {
        bag.push(...shuffle([...full_pool]));
    }
    if (bag.length > 1 && get_id(bag[bag.length - 1]) === prev_id) {
        const swap_idx = get_random_int(0, bag.length - 2);
        const tmp = bag[bag.length - 1];
        bag[bag.length - 1] = bag[swap_idx];
        bag[swap_idx] = tmp;
    }
    return bag.pop();
}

// Uniformly samples n_catch 0-based indices in [1 .. ntrls - 1] (never index 0 / Trial 1)
// with at least min_go_gap Go trials between consecutive Catch trials.
function sample_catch_positions(ntrls, n_catch, min_go_gap) {
    if (n_catch <= 0) {
        return new Set();
    }
    const pool_size = ntrls - 1 - (n_catch - 1) * min_go_gap;
    const chosen = shuffle(range(0, pool_size))
        .slice(0, n_catch)
        .sort((a, b) => a - b);
    return new Set(chosen.map((u, idx) => u + 1 + idx * min_go_gap));
}

function generate_trial_table(ntrls, target_type, block_category, phase) {
    const n_catch = Math.round(ntrls * PRMS.catch_prop);
    const n_go = ntrls - n_catch;

    const go_skeletons = [];
    const catch_skeletons = [];

    // 1. Go trials balanced across 2 (prime_valence) x 2 (target_valence) cells
    const cells = [
        { prime_valence: "positive", target_valence: "positive" },
        { prime_valence: "positive", target_valence: "negative" },
        { prime_valence: "negative", target_valence: "positive" },
        { prime_valence: "negative", target_valence: "negative" },
    ];

    const base_per_cell = Math.floor(n_go / cells.length);
    const rem_go = n_go % cells.length;
    const extra_cells = shuffle([...cells]).slice(0, rem_go);

    for (const cell of cells) {
        const count =
            base_per_cell +
            (extra_cells.some(
                (c) => c.prime_valence === cell.prime_valence && c.target_valence === cell.target_valence,
            )
                ? 1
                : 0);

        const congruency = cell.prime_valence === cell.target_valence ? "congruent" : "incongruent";
        const corr_resp = PRMS.resp_keys[cell.target_valence];

        for (let i = 0; i < count; i++) {
            go_skeletons.push({
                phase: phase,
                block_category: block_category,
                target_type: target_type,
                trial_go_nogo: "go",
                prime_valence: cell.prime_valence,
                target_valence: cell.target_valence,
                congruency: congruency,
                corr_resp: corr_resp,
            });
        }
    }

    // 2. Catch trials (5%): no auditory prime, balanced across target valence
    const catch_valences = [];
    for (let i = 0; i < Math.floor(n_catch / 2); i++) {
        catch_valences.push("positive", "negative");
    }
    if (n_catch % 2 === 1) {
        catch_valences.push(Math.random() < 0.5 ? "positive" : "negative");
    }

    for (const t_val of catch_valences) {
        catch_skeletons.push({
            phase: phase,
            block_category: block_category,
            target_type: target_type,
            trial_go_nogo: "catch",
            prime_valence: "catch",
            target_valence: t_val,
            congruency: "catch",
            corr_resp: "none",
        });
    }

    // 3. Interleave shuffled Go and Catch skeletons with catch spacing constraints
    //    (never Trial 1, never back-to-back), then assign specific primes & targets
    //    from shuffled 8-item bags without replacement while enforcing t != t - 1
    const shuffled_go = shuffle(go_skeletons);
    const shuffled_catch = shuffle(catch_skeletons);
    const catch_pos_set = sample_catch_positions(ntrls, n_catch, PRMS.catch_min_gap);

    const ordered_trials = [];
    let go_idx = 0;
    let catch_idx = 0;
    for (let i = 0; i < ntrls; i++) {
        if (catch_pos_set.has(i)) {
            ordered_trials.push(shuffled_catch[catch_idx++]);
        } else {
            ordered_trials.push(shuffled_go[go_idx++]);
        }
    }

    const prime_bags = { positive: [], negative: [] };
    const target_bags = { positive: [], negative: [] };
    let prev_prime_stim = null;
    let prev_target_stim = null;

    for (const trial of ordered_trials) {
        if (trial.trial_go_nogo === "go") {
            const sound = draw_from_bag(
                prime_bags[trial.prime_valence],
                SOUNDS[trial.prime_valence],
                (s) => s.name,
                prev_prime_stim,
            );
            trial.prime_stim = sound.name;
            trial.prime_file = sound.file;
            prev_prime_stim = sound.name;
        } else {
            trial.prime_stim = "none";
            trial.prime_file = "none";
            prev_prime_stim = "none";
        }

        if (target_type === "word") {
            const word = draw_from_bag(
                target_bags[trial.target_valence],
                WORDS[trial.target_valence],
                (w) => w,
                prev_target_stim,
            );
            trial.target_stim = word;
            trial.target_file = "none";
            prev_target_stim = word;
        } else {
            const face = draw_from_bag(
                target_bags[trial.target_valence],
                FACES[trial.target_valence],
                (f) => f.name,
                prev_target_stim,
            );
            trial.target_stim = face.name;
            trial.target_file = face.file;
            prev_target_stim = face.name;
        }
    }

    return ordered_trials;
}

function trial_timeline(timeline_variables) {
    return {
        timeline: [PRIME_FIXATION, TARGET_MASK, TRIAL_FEEDBACK, ITI],
        timeline_variables: timeline_variables,
    };
}

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
function save() {
    jsPsych.data.addProperties({ vp_num: VP_NUM });
    const fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", fn, { stim: "CrossModalPriming" });
    if (SIMULATION_MODE) {
        save_data_local(fn, { stim: "CrossModalPriming" });
    }
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function generate_exp() {
    "use strict";

    const exp = [];

    if (!SIMULATION_MODE) {
        exp.push(fullscreen(true, "de"));
        exp.push(welcome_message("de_du"));
        exp.push(resize_browser("de_du"));
        exp.push(VP_INFO_FORM);
        exp.push(browser_check(CANVAS_SIZE));
        exp.push(PRELOAD);
        exp.push(mouse_cursor(false));

        // Sound check (all 16 primes presented in full length with valence label)
        exp.push(SOUND_CHECK_INSTRUCTIONS);
        exp.push(generate_sound_check_timeline());
    }

    // General task instructions
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    // Blockwise manipulation of target type (Faces vs. Words)
    for (let p = 0; p < PRMS.target_type_order.length; p++) {
        const phase_num = p + 1;
        const target_type = PRMS.target_type_order[p];

        if (phase_num === 2) {
            exp.push(HALFWAY_SCREEN);
        }

        exp.push(phase_intro_screen(target_type, phase_num));

        // Practice block(s) for this target type (20 trials, incl. 5% catch)
        for (let b = 0; b < PRMS.nblks_prac; b++) {
            exp.push(trial_timeline(generate_trial_table(PRMS.ntrls_prac, target_type, "practice", phase_num)));
            exp.push(create_block_feedback("practice"));
        }

        exp.push(practice_end_screen(target_type));

        // Experimental blocks for this target type (3 x 80 trials, incl. 5% catch)
        for (let b = 0; b < PRMS.nblks_exp; b++) {
            exp.push(block_start_screen(target_type));
            exp.push(trial_timeline(generate_trial_table(PRMS.ntrls_exp, target_type, "exp", phase_num)));
            exp.push(create_block_feedback("exp"));
        }
    }

    exp.push(SAVE_DATA);
    if (!SIMULATION_MODE) {
        exp.push(end_message("de_du"));
        exp.push(mouse_cursor(true));
        exp.push(fullscreen(false, "de"));
    }

    return exp;
}

const EXP = generate_exp();

if (SIMULATION_MODE) {
    jsPsych.simulate(EXP, SIMULATION_MODE);
} else {
    jsPsych.run(EXP);
}

