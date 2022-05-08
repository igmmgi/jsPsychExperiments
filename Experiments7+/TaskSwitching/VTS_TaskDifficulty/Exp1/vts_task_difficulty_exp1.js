// Voluntary Task Switching

const jsPsych = initJsPsych({});

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = 'rgba(200, 200, 200, 1)';
const CANVAS_SIZE = [1280, 720];
const CANVAS_BORDER = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////

const PRMS = {
    screenRes: [960, 720], // minimum screen resolution requested
    nTrls: 10, // 100, // number of trials within a block
    nBlks: 4, // 14, // number of blocks
    fbDur: [400, 500], // feedback duration for correct and incorrect trials, respectively
    fbText: ['Richtig', 'Falsch!'],
    rsi: 400,
    waitDur: 5000, // wait time at end of block if too many errors!
    stimFont: '50px Arial',
    fbFont: '28px Arial',
    deactivateKeys: true, // should keys be deactivate when task not available?
};

const VTS_DATA = {
    cTrl: 1,
    cBlk: 1,
    half: 1,
    nLetter: 0,
    nColour: 0,
    previousTask: 'na',
    soa: 0,
    repCounter: 0,
    poorPerformance: false,
};


////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const WELCOME_INSTRUCTIONS = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Willkommen zu unserem Experiment:<br><br>
           Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
           Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und genügend Zeit hast,
           um das Experiment durchzuführen. Wir bitten dich die ca. nächsten 35 Minuten konzentriert zu arbeiten.<br><br>
           Du erhältst den Code für Versuchspersonenstunden und weitere Anweisungen am Ende des Experiments.
           Bei Fragen oder Problemen wende dich bitte an:<br><br>
           hiwipibio@gmail.com <br><br>
           Drücke eine beliebige Taste, um fortzufahren`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const VP_CODE_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Du erhaelst den Code für die Versuchspersonenstunden und weitere Anweisungen
    am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:<br><br>
    hiwipibio@gmail.com<br><br>
    Drücke eine beliebige Taste, um fortzufahren!`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `Du siehst in jedem Durchgang einen Buchstaben und eine Farbiges Rechteck, aber eine Aufgabe erscheint später als die andere Aufgabe.<br><br>
           Du darfst frei entscheiden, ob du die zuerst erscheinende Aufgabe bearbeiten willst oder auf die andere Aufgabe wartest, aber versuche so schnell und so genau wie möglich zu sein!<br><br>
           Die Reaktionszeitmessung in jedem Durchgang beginnt, sobald die erste Aufgabe erscheint und endet sobald du eine der beiden Aufgaben bearbeitet hast!<br><br>
           Drücke eine beliebige Taste um fortzufahren.`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};

const TASK_INSTRUCTIONS_HALF = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    stimulus: generate_formatted_html({
        text: `***** ACHTUNG *****<br><br>
          Aufgaben zum Tasten Wechseln!<br><br>
          Drücke eine beliebige Taste, um fortzufahren.`,
        fontsize: 38,
        lineheight: 1.5,
        align: 'center',
        bold: true,
    }),
};

function drawStimulus(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = PRMS.stimFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    // draw surrounding rectangle
    if (args.draw_colour === 1) {
        ctx.strokeStyle = args.colour;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(-40, -50, 80, 100);
        ctx.stroke();
    }

    // letter task
    if (args.draw_letter === 1) {
        ctx.fillText(args.letter, 0, 0);
    }
}

function draw_rsi() {
    'use strict';
}

const RSI = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    trial_duration: PRMS.rsi,
    response_ends_trial: false,
    func: draw_rsi,
};


const VTS = {
    type: jsPsychStaticCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_size: CANVAS_SIZE,
    canvas_border: CANVAS_BORDER,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.respKeys,
    trial_duration: PRMS.tooSlow,
    func: drawStimulus,
    stimulus_onset: null,
    letter: null,
    colour: null,
    func_args: null,
    data: {},
    on_start: function(trial) {
        'use strict';
        console.log(trial)
    },
    on_finish: function() {
        codeTrial();
    },
};


////////////////////////////////////////////////////////////////////////
//                              VP Stunden                            //
////////////////////////////////////////////////////////////////////////
const RANDOM_STRING = generateRandomString(16, 'vtstd1_');

const VP_CODE_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponseCanvas,
    response_ends_trial: true,
    choices: [' '],
    stimulus: generate_formatted_html({
        text:
            `Vielen Dank für Ihre Teilnahme.<br><br>
       Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden
       zufällig generierten Code und senden Sie diesen zusammen mit Ihrer
       Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
       an:<br><br>
       hiwipibio@gmail.com <br><br>
       Code: ` +
            RANDOM_STRING +
            `<br><br>Drücken Sie die Leertaste, um fortzufahren!`,
        align: 'left',
        fontsize: 30,
        width: '1200px',
        bold: true,
        lineheight: 1.5,
    }),
};
////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = getDirName();
const EXP_NAME = getFileName();

function save() {
    const vpNum = getTime();
    jsPsych.data.addProperties({ vpNum: vpNum });

    const data_fn = `${DIR_NAME}data/version${VERSION}/${EXP_NAME}_${vpNum}`;
    saveData('/Common/write_data.php', data_fn, { stim: 'vts' });
    // saveDataLocal(data_fn, { stim: 'vts' });

    const code_fn = `${DIR_NAME}code/${EXP_NAME}`;
    saveRandomCode('/Common/write_code.php', code_fn, RANDOM_STRING);
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    'use strict';

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(PRMS.screenRes));
    exp.push(resize_browser());
    exp.push(welcome_message());
    // exp.push(vpInfoForm('/Common7+/vpInfoForm_de.html'));
    exp.push(mouseCursor(false));

    exp.push(WELCOME_INSTRUCTIONS);
    // exp.push(VP_CODE_INSTRUCTIONS1);
    // exp.push(TASK_INSTRUCTIONS1);
    // exp.push(TASK_INSTRUCTIONS2);

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouseCursor(true));
    exp.push(VP_CODE_INSTRUCTIONS2);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.run(EXP);
