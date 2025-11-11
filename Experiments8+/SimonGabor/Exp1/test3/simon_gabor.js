// Intermixed Simon and Flanker Task
// Standard visual Simon with left/right lateralized stimuli
// Standard visual flanker task with flankers presented before the target (150 ms SOA)
// Unpredictable task sequence but response effector (middle vs. index fingers) alternates

const jsPsych = initJsPsych({});

const pixi_flag = true; //jsPsych.data.getURLVariable("pixi_flag") === "1" ? true : false;

// Configuration for background generation method
const USE_SHADER_BACKGROUND = false; // Set to true to use shader-based backgrounds (not supported by current plugin)

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(128, 128, 128, 1)";
const CANVAS_SIZE = [1080, 1920];
// const CANVAS_SIZE = [960, 1280];
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls: 80,
    nblks: 9,
    fix_size: 40, // size of the fixation cross
    fix_width: 4, // width of fixation cross
    fix_duration: 1000, // duration of the fixation cross
    fix_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    feedback_duration: [0, 1500, 1500],
    iti: 1000,
    too_slow: 2000,
    stim_size: "40px monospace",
    simon_pos: 300,
    feedback_size: "24px monospace",
    feedback_text_size_block: 20,
    feedback_text: ["", "Falsch", "Zu langsam!"],
    feedback_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    resp_keys: ["Q", "P"], // left/right
    ctrl: 1, // count trials
    cblk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const RESP_TEXT =
    generate_formatted_html({
        text: "Low" + "&emsp;".repeat(8) + "High" + "&emsp;".repeat(8),
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text: `${PRMS.resp_keys[0]}-Taste` + "&emsp;".repeat(8) + `${PRMS.resp_keys[1]}-Taste` + "&emsp;".repeat(8),
        bold: true,
        fontsize: 26,
        lineheight: 0.5,
    }) +
    generate_formatted_html({
        text: `linker Zeigefinger` + "&emsp;".repeat(7) + `rechte Zeigefinger` + "&emsp;".repeat(7),
        bold: true,
        fontsize: 20,
        lineheight: 0.5,
    });

const PRESS_TO_CONTINUE = generate_formatted_html({
    text: `Drücke eine beliebige Taste, um fortzufahren!`,
    bold: true,
    fontsize: 26,
    align: "center",
});

const TASK_INSTRUCTIONS1 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: generate_formatted_html({
        text: `Willkommen bei unserem Experiment:<br><br>
               Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.
               Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und
               genügend Zeit hast, um das Experiment durchzuführen.
               Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.<br><br>
               Drücke eine beliebige Taste, um fortzufahren!`,
        bold: true,
        fontsize: 26,
        align: "left",
        lineheight: 1.5,
    }),
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS2 = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus:
        generate_formatted_html({
            text: `Aufgabe:<br><br>
                   In diesem Experiment musst du XXX so schnell und so genau wie möglich reagieren.<br><br>
Es gilt die folgende Zuordnung:<br><br>`,
            bold: true,
            fontsize: 26,
            align: "left",
            lineheight: 1.5,
        }) +
        RESP_TEXT +
        "<br>" +
        PRESS_TO_CONTINUE,
    post_trial_gap: 1000,
};

const TASK_INSTRUCTIONS_BLOCK = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: "",
    on_start: function (trial) {
        trial.stimulus =
            generate_formatted_html({
                text: `Block ${PRMS.cblk} von ${PRMS.nblks}<br><br>
Versuche immer möglichst schnell und genau zu antworten. Es gilt:<br><br>`,
                bold: true,
                fontsize: 26,
                align: "left",
                lineheight: 1.5,
            }) +
            RESP_TEXT +
            "<br>" +
            PRESS_TO_CONTINUE;
    },
    post_trial_gap: 1000,
};

function canvas_style(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2); // make center (0, 0) for easier positioning!
    return ctx;
}

function clear_canvas(ctx) {
    ctx.fillStyle = CANVAS_COLOUR;
    ctx.fillRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
    return ctx;
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

function code_trial() {
    "use strict";

    let dat = jsPsych.data.get().last(1).values()[0];

    let corr_code = 0;
    let rt = dat.rt === null ? PRMS.too_slow : dat.rt;

    let comp =
        (["Q"].includes(dat.corr_resp) && dat.position < 0) || (["P"].includes(dat.corr_resp) && dat.position > 0)
            ? "comp"
            : "incomp";

    let correctKey;
    if (dat.response !== null) {
        correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corr_resp);
    }

    if (correctKey && rt < PRMS.too_slow) {
        corr_code = 1; // correct
    } else if (!correctKey && rt < PRMS.too_slow) {
        corr_code = 2; // choice error
    } else if (rt >= PRMS.too_slow) {
        corr_code = 3; // too slow
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        keyPress: dat.key_press,
        comp: comp,
        rt: rt,
        corr_code: corr_code,
        block_num: PRMS.cblk,
        trial_num: PRMS.ctrl,
    });
}

function draw_trial_feedback(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    ctx = canvas_style(ctx);

    ctx.font = PRMS.feedback_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = PRMS.feedback_colour;
    ctx.fillText(PRMS.feedback_text[args.corr_code - 1], 0, 0);
    if (args.corr_code !== 1) {
        let row1 = ` Low               High`;
        let row2 = `${PRMS.resp_keys[0]}-Taste         ${PRMS.resp_keys[1]}-Taste`;
        let row3 = `linker Zeigefinger  rechte Zeigefinger`;
        ctx.fillText(row1, 0, 60);
        ctx.fillText(row2, 0, 90);
        ctx.font = "18px monospace";
        ctx.fillText(row3, 0, 120);
    }
}

const TRIAL_FEEDBACK = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: function () {},
    canvas_size: CANVAS_SIZE,
    response_ends_trial: false,
    trial_duration: 0,
    on_start: function (trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = PRMS.feedback_duration[dat.corr_code - 1];
        if (dat.corrCode !== 1) {
            trial.stimulus = function (c) {
                draw_trial_feedback(c, { corr_code: dat.corr_code });
            };
        }
    },
};

function draw_iti(c) {
    "use strict";
    let ctx = c.getContext("2d");
    canvas_style(ctx);
}

const ITI = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_colour: CANVAS_COLOUR,
    canvas_border: CANVAS_BORDER,
    canvas_size: CANVAS_SIZE,
    stimulus: draw_iti,
    response_ends_trial: false,
    trial_duration: PRMS.iti,
};

const BLOCK_FEEDBACK = {
    type: jsPsychHtmlKeyboardResponse,
    canvas_size: CANVAS_SIZE,
    stimulus: "",
    response_ends_trial: true,
    post_trial_gap: PRMS.waitDur,
    on_start: function (trial) {
        let block_dvs = calculate_block_performance({
            filter_options: { stim: "cse_sf", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(PRMS.cblk, PRMS.nblks, block_dvs.mean_rt, block_dvs.error_rate);
        trial.stimulus = `<div style="font-size:${PRMS.feedback_text_size_block}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};

function draw_stimulus(c, args) {
    "use strict";
    let ctx = c.getContext("2d");
    if (args.set_canvas) {
        ctx = canvas_style(ctx);
    } else {
        ctx = clear_canvas(ctx);
    }

    ctx.font = PRMS.stim_size;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // draw
    ctx.fillStyle = "black";
    ctx.fillText(args.stim, args.position, 0);
}

const STIMULUS = {
    type: jsPsychCanvasKeyboardResponse,
    stimulus: null,
    canvas_size: CANVAS_SIZE,
    translate_origin: true,
    response_ends_trial: true,
    choices: PRMS.resp_letters,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: jsPsych.timelineVariable("freq"),
        noise: jsPsych.timelineVariable("noise"),
        position: jsPsych.timelineVariable("position"),
        comp: jsPsych.timelineVariable("comp"),
        corr_resp: jsPsych.timelineVariable("corr_resp"),
    },
    on_start: function (trial) {
        trial.stimulus = function (c) {
            trial.trial_duration = PRMS.too_slow;
            draw_stimulus(c, {
                freq: jsPsych.evaluateTimelineVariable("freq"),
                noise: jsPsych.evaluateTimelineVariable("noise"),
                position: jsPsych.evaluateTimelineVariable("position"),
                set_canvas: true,
            });
        };
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

// prettier-ignore
const TRIAL_TABLE = [
      { freq: "low",  noise: "low",  position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "low",  noise: "high", position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "low",  noise: "low",  position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "low",  noise: "high", position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "high", noise: "low",  position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "high", noise: "high", position: -PRMS.simon_pos, comp: "comp",   corr_resp: PRMS.resp_keys[0] },
      { freq: "high", noise: "low",  position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
      { freq: "high", noise: "high", position:  PRMS.simon_pos, comp: "incomp", corr_resp: PRMS.resp_keys[1] },
    ];

////////////////////////////////////////////////////////////////////////
//                             VP Stunden                             //
////////////////////////////////////////////////////////////////////////
const END_SCREEN = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: true,
    choices: [" "],
    stimulus: generate_formatted_html({
        text: `Dieser Teil des Experiments ist jetzt beendet.<br><br>
             Nun folgen Informationen zur Versuchspersonenstunde auf Unipark.
             Drücke eine beliebige Taste, um die Weiterleitung zu Unipark zu starten.`,
        fontsize: 28,
        lineheight: 1.0,
        bold: false,
        align: "left",
    }),
    on_finish: function () {},
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                              Save                                  //
////////////////////////////////////////////////////////////////////////
const DIR_NAME = get_dir_name();
const EXP_NAME = get_file_name();
const VP_NUM = get_time();

function save() {
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    save_data_server("/Common8+/write_data.php", data_fn, { stim: "cse_sf" });
    // save_data_local(data_fn, { stim: "cse_sf" });
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

// const CENTER_X = canvas.width / 2 / window.devicePixelRatio;
// const CENTER_Y = canvas.height / 2 / window.devicePixelRatio;
// console.log(CENTER_X);
// console.log(CENTER_Y);

// Background noise generation parameters (exactly matching Python script)
const NOISE_PARAMS = {
    stimSizePx: 256,
    muCpsAperture: [16.0, 24.0], // EXACTLY like Python: cycles per stimulus aperture
    sigmaFraction: 0.1, // EXACTLY like Python: fractional bandwidth
    bgWidth: CANVAS_SIZE[1], // Use canvas width
    bgHeight: CANVAS_SIZE[0], // Use canvas height
    noiseLevels: { low: 0.03, high: 0.05 }, // EXACTLY like Python: RMS values
    nBgPerLevel: 1
};

// Calculate mu_cpp and sigma_cpp (cycles per pixel)
// Convert from cycles per stimulus aperture to cycles per pixel
const muCpp = NOISE_PARAMS.muCpsAperture.map(mu => mu / NOISE_PARAMS.stimSizePx);
const sigmaCpp = muCpp.map(mu => mu * NOISE_PARAMS.sigmaFraction);

console.log("Noise parameters:", NOISE_PARAMS);
console.log("Mu CPP (cycles per pixel):", muCpp);
console.log("Sigma CPP:", sigmaCpp);

// FFT implementation from node-fft source code
// Complex number operations
const complex = {
    add: function (a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    },
    subtract: function (a, b) {
        return [a[0] - b[0], a[1] - b[1]];
    },
    multiply: function (a, b) {
        return [(a[0] * b[0] - a[1] * b[1]), 
                (a[0] * b[1] + a[1] * b[0])];
    },
    magnitude: function (c) {
        return Math.sqrt(c[0]*c[0] + c[1]*c[1]);
    }
};

// FFT utility functions
const fftUtil = {
    exponent: function (k, N) {
        const x = -2 * Math.PI * (k / N);
        return [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]
    }
};

// Iterative FFT implementation to avoid recursion stack overflow
function fft(vector) {
    const N = vector.length;
    
    // Ensure power of 2 length
    const paddedLength = Math.pow(2, Math.ceil(Math.log2(N)));
    let data;
    
    if (paddedLength !== N) {
        data = new Array(paddedLength);
        for (let i = 0; i < paddedLength; i++) {
            data[i] = i < N ? vector[i] : 0;
        }
    } else {
        data = [...vector];
    }
    
    const n = data.length;
    
    // Convert to complex format first
    for (let i = 0; i < n; i++) {
        if (Array.isArray(data[i])) {
            data[i] = [data[i][0], data[i][1]];
        } else {
            data[i] = [data[i], 0];
        }
    }
    
    // Bit-reverse permutation
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        while (j & bit) {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if (i < j) {
            [data[i], data[j]] = [data[j], data[i]];
        }
    }
    
    // Iterative FFT
    for (let len = 2; len <= n; len <<= 1) {
        const wlen = fftUtil.exponent(1, len);
        for (let i = 0; i < n; i += len) {
            let w = [1, 0];
            for (let j = 0; j < len / 2; j++) {
                const u = data[i + j];
                const v = complex.multiply(data[i + j + len / 2], w);
                data[i + j] = complex.add(u, v);
                data[i + j + len / 2] = complex.subtract(u, v);
                w = complex.multiply(w, wlen);
            }
        }
    }
    
    return data.slice(0, N);
}

// IFFT function using iterative approach
function ifft(signal) {
    const N = signal.length;
    const paddedLength = Math.pow(2, Math.ceil(Math.log2(N)));
    
    let paddedSignal = signal;
    if (paddedLength !== N) {
        paddedSignal = new Array(paddedLength);
        for (let i = 0; i < paddedLength; i++) {
            if (i < N) {
                paddedSignal[i] = signal[i];
            } else {
                paddedSignal[i] = [0, 0]; // zero complex number
            }
        }
    }
    
    // Interchange real and imaginary parts
    const csignal = [];
    for (let i = 0; i < paddedSignal.length; i++) {
        csignal[i] = [paddedSignal[i][1], paddedSignal[i][0]];
    }

    // Apply FFT
    const ps = fft(csignal);
    
    // Interchange real and imaginary parts and normalize
    const res = [];
    for (let j = 0; j < ps.length; j++) {
        res[j] = [ps[j][1] / ps.length, ps[j][0] / ps.length];
    }
    
    // Return only the original length
    return res.slice(0, N);
}

console.log("Using node-fft source code implementation");

// Spatial bandpass filtering (replaces FFT approach)
function fftBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    // Just call the spatial filter function
    return spatialBandpassFilter(white, width, height, muCpp, sigmaCpp);
}

// 2D FFT using node-fft library
function fft2d(data, width, height) {
    console.log(`FFT2D: Processing ${width}x${height} data`);
    const result = new Array(data.length);
    
    try {
        // FFT each row
        for (let i = 0; i < height; i++) {
            const row = data.slice(i * width, (i + 1) * width);
            const fftRow = fft(row);
            for (let j = 0; j < width; j++) {
                result[i * width + j] = fftRow[j];
            }
        }
        
        // FFT each column
        for (let j = 0; j < width; j++) {
            const col = new Array(height);
            for (let i = 0; i < height; i++) {
                col[i] = result[i * width + j];
            }
            const fftCol = fft(col);
            for (let i = 0; i < height; i++) {
                result[i * width + j] = fftCol[i];
            }
        }
        
        console.log("FFT2D completed successfully");
        return result;
    } catch (error) {
        console.error("Error in FFT2D:", error);
        throw error;
    }
}

// 2D IFFT using node-fft library
function ifft2d(data, width, height) {
    console.log(`IFFT2D: Processing ${width}x${height} data`);
    const result = new Array(data.length);
    
    try {
        // IFFT each row
        for (let i = 0; i < height; i++) {
            const row = data.slice(i * width, (i + 1) * width);
            const ifftRow = ifft(row);
            for (let j = 0; j < width; j++) {
                result[i * width + j] = ifftRow[j];
            }
        }
        
        // IFFT each column
        for (let j = 0; j < width; j++) {
            const col = new Array(height);
            for (let i = 0; i < height; i++) {
                col[i] = result[i * width + j];
            }
            const ifftCol = ifft(col);
            for (let i = 0; i < height; i++) {
                result[i * width + j] = ifftCol[i];
            }
        }
        
        console.log("IFFT2D completed successfully");
        return result;
    } catch (error) {
        console.error("Error in IFFT2D:", error);
        throw error;
    }
}

// Background noise generation functions (simplified spatial approach)
function fftBandpassTwoBandsCppRect(width, height, muCpp, sigmaCpp) {
    console.log(`Generating noise: ${width}x${height}, muCpp=${muCpp}, sigmaCpp=${sigmaCpp}`);
    
    // Step 1: Generate Gaussian white noise - exactly like Python's rng.normal(0, 1, (height, width))
    const white = new Array(height);
    let sum = 0;
    let sumSquares = 0;
    let count = 0;
    
    for (let i = 0; i < height; i++) {
        white[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            // Box-Muller transform for Gaussian noise
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            white[i][j] = z0;
            
            sum += z0;
            sumSquares += z0 * z0;
            count++;
        }
    }
    
    // Debug: check if our noise has the right statistics
    const whiteMean = sum / count;
    const whiteVariance = (sumSquares / count) - (whiteMean * whiteMean);
    const whiteStd = Math.sqrt(whiteVariance);
    console.log(`White noise stats: mean=${whiteMean.toFixed(4)}, std=${whiteStd.toFixed(4)} (should be ~0, ~1)`);
    
    // Step 2: Apply simple bandpass filtering without radial patterns
    const filtered = simpleBandpassFilter(white, width, height, muCpp, sigmaCpp);
    
    // Step 3: Normalize - exactly like Python's x -= x.mean(); x /= max(np.sqrt(np.mean(x**2)), 1e-9)
    let normSum = 0;
    let normSumSquares = 0;
    let normCount = 0;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            normSum += filtered[i][j];
            normSumSquares += filtered[i][j] * filtered[i][j];
            normCount++;
        }
    }
    
    const mean = normSum / normCount;
    const rms = Math.sqrt(normSumSquares / normCount);
    const scaleFactor = 1.0 / Math.max(rms, 1e-9);
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filtered[i][j] = (filtered[i][j] - mean) * scaleFactor;
        }
    }
    
    return filtered;
}

// Spatial domain bandpass filtering (simpler alternative to FFT)
function spatialBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Spatial filtering: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Create frequency-based weights using spatial convolution
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = 0;
        }
    }
    
    // Apply multiple scales to approximate bandpass filtering
    const scales = [1, 2, 4, 8, 16];
    const weights = [0.1, 0.2, 0.3, 0.2, 0.1];
    
    for (let scaleIdx = 0; scaleIdx < scales.length; scaleIdx++) {
        const scale = scales[scaleIdx];
        const weight = weights[scaleIdx];
        
        // Calculate frequency for this scale
        const freq1 = mu1 * scale;
        const freq2 = mu2 * scale;
        
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                // Create sinusoidal patterns at different frequencies
                const x = (j - width/2) / width;
                const y = (i - height/2) / height;
                const r = Math.sqrt(x*x + y*y);
                
                // Apply Gaussian bandpass filter
                const h1 = Math.exp(-0.5 * Math.pow((r - freq1) / s1, 2));
                const h2 = Math.exp(-0.5 * Math.pow((r - freq2) / s2, 2));
                const filterValue = h1 + h2;
                
                filtered[i][j] += white[i][j] * filterValue * weight;
            }
        }
    }
    
    return filtered;
}

// Simple bandpass filter without concentric rings
function simpleBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Simple bandpass: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Create bandpass-filtered noise using multiple frequency components
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = 0;
        }
    }
    
    // Generate noise at different spatial frequencies
    const frequencies = [];
    for (let f = mu1; f <= mu2; f += (mu2 - mu1) / 10) {
        frequencies.push(f);
    }
    
    for (let freq of frequencies) {
        // Create sinusoidal patterns at this frequency
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const x = j / width;
                const y = i / height;
                
                // Create both horizontal and vertical patterns
                const pattern1 = Math.cos(2 * Math.PI * freq * x);
                const pattern2 = Math.cos(2 * Math.PI * freq * y);
                const pattern3 = Math.cos(2 * Math.PI * freq * (x + y));
                const pattern4 = Math.cos(2 * Math.PI * freq * (x - y));
                
                // Combine patterns and multiply by white noise
                const combinedPattern = (pattern1 + pattern2 + pattern3 + pattern4) / 4;
                filtered[i][j] += white[i][j] * combinedPattern;
            }
        }
    }
    
    // Normalize
    const numFreqs = frequencies.length;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filtered[i][j] /= numFreqs;
        }
    }
    
    return filtered;
}

// Working bandpass filter that properly implements Python algorithm
function workingBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Working bandpass: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Convert 2D to 1D for FFT
    const flatWhite = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            flatWhite.push(white[i][j]);
        }
    }
    
    // Apply 2D FFT
    const F = fft2d(flatWhite, width, height);
    
    // Create frequency grids exactly like Python
    const fx_cpp = new Array(width);
    const fy_cpp = new Array(height);
    
    for (let j = 0; j < width; j++) {
        if (j < width/2) {
            fx_cpp[j] = j / width;
        } else {
            fx_cpp[j] = (j - width) / width;
        }
    }
    
    for (let i = 0; i < height; i++) {
        if (i < height/2) {
            fy_cpp[i] = i / height;
        } else {
            fy_cpp[i] = (i - height) / height;
        }
    }
    
    // Create meshgrid
    const FX = new Array(height);
    const FY = new Array(height);
    for (let i = 0; i < height; i++) {
        FX[i] = new Array(width);
        FY[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            FX[i][j] = fx_cpp[j];
            FY[i][j] = fy_cpp[i];
        }
    }
    
    // Calculate radial frequency
    const R_cpp = new Array(height);
    for (let i = 0; i < height; i++) {
        R_cpp[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            R_cpp[i][j] = Math.sqrt(FX[i][j] * FX[i][j] + FY[i][j] * FY[i][j]);
        }
    }
    
    // Create bandpass filter
    const H = new Array(height);
    for (let i = 0; i < height; i++) {
        H[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            const r = R_cpp[i][j];
            const h1 = Math.exp(-0.5 * Math.pow((r - mu1) / s1, 2));
            const h2 = Math.exp(-0.5 * Math.pow((r - mu2) / s2, 2));
            H[i][j] = h1 + h2;
        }
    }
    
    // Apply filter in frequency domain
    const filteredFreq = new Array(height);
    for (let i = 0; i < height; i++) {
        filteredFreq[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            const idx = i * width + j;
            filteredFreq[i][j] = [
                F[idx][0] * H[i][j], // real part
                F[idx][1] * H[i][j]  // imaginary part
            ];
        }
    }
    
    // Apply inverse FFT
    const filteredComplex = ifft2d(filteredFreq, width, height);
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = filteredComplex[i][j][0]; // real part only
        }
    }
    
    console.log("Working bandpass filter completed");
    return filtered;
}

// Simple bandpass filter without radial patterns (avoids spider web effect)
function simpleBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Simple bandpass: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Convert cycles per pixel to spatial frequencies
    const freq1 = mu1 * width;  // cycles per image width
    const freq2 = mu2 * width;  // cycles per image width
    
    console.log(`Spatial frequencies: freq1=${freq1}, freq2=${freq2}`);
    
    // Create structured noise using linear frequency components (no radial patterns)
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = 0;
        }
    }
    
    // Generate noise at multiple frequencies within the band
    const numFreqs = 20;
    const orientations = 8;
    
    for (let freqIdx = 0; freqIdx < numFreqs; freqIdx++) {
        // Frequency within the band
        const freq = freq1 + (freq2 - freq1) * (freqIdx / (numFreqs - 1));
        
        for (let orientIdx = 0; orientIdx < orientations; orientIdx++) {
            // Orientation
            const orientation = (Math.PI * orientIdx) / orientations;
            
            // Create pattern
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const x = j / width;
                    const y = i / height;
                    
                    // Rotate coordinates
                    const xRot = x * Math.cos(orientation) + y * Math.sin(orientation);
                    
                    // Create sinusoidal pattern
                    const pattern = Math.cos(2 * Math.PI * freq * xRot);
                    
                    // Apply Gaussian envelope
                    const centerX = 0.5;
                    const centerY = 0.5;
                    const envelope = Math.exp(-((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY)) / 0.5);
                    
                    // Apply bandpass weighting
                    const centerFreq = (freq1 + freq2) / 2;
                    const freqWeight = Math.exp(-0.5 * Math.pow((freq - centerFreq) / ((freq2 - freq1)/4), 2));
                    
                    filtered[i][j] += white[i][j] * pattern * envelope * freqWeight;
                }
            }
        }
    }
    
    // Normalize
    const totalPatterns = numFreqs * orientations;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filtered[i][j] /= totalPatterns;
        }
    }
    
    // Debug: check filtered noise statistics
    let filteredSum = 0;
    let filteredSumSquares = 0;
    let filteredCount = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filteredSum += filtered[i][j];
            filteredSumSquares += filtered[i][j] * filtered[i][j];
            filteredCount++;
        }
    }
    const filteredMean = filteredSum / filteredCount;
    const filteredVariance = (filteredSumSquares / filteredCount) - (filteredMean * filteredMean);
    const filteredStd = Math.sqrt(filteredVariance);
    console.log(`Filtered noise stats: mean=${filteredMean.toFixed(4)}, std=${filteredStd.toFixed(4)}`);
    
    console.log("Simple bandpass filter completed");
    return filtered;
}

// Fast bandpass filter using structured noise approach
function fastBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Fast bandpass: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Convert cycles per pixel to spatial frequencies
    const freq1 = mu1 * width;  // cycles per image width
    const freq2 = mu2 * width;  // cycles per image width
    const sigma1 = s1 * width;  // spatial sigma
    const sigma2 = s2 * width;  // spatial sigma
    
    console.log(`Spatial frequencies: freq1=${freq1}, freq2=${freq2}, sigma1=${sigma1}, sigma2=${sigma2}`);
    
    // Create structured noise using multiple frequency components
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = 0;
        }
    }
    
    // Generate noise at multiple frequencies within the band
    const numFreqs = 15;
    const orientations = 6;
    
    for (let freqIdx = 0; freqIdx < numFreqs; freqIdx++) {
        // Frequency within the band
        const freq = freq1 + (freq2 - freq1) * (freqIdx / (numFreqs - 1));
        
        for (let orientIdx = 0; orientIdx < orientations; orientIdx++) {
            // Orientation
            const orientation = (Math.PI * orientIdx) / orientations;
            
            // Create pattern
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const x = j / width;
                    const y = i / height;
                    
                    // Rotate coordinates
                    const xRot = x * Math.cos(orientation) + y * Math.sin(orientation);
                    
                    // Create sinusoidal pattern
                    const pattern = Math.cos(2 * Math.PI * freq * xRot);
                    
                    // Apply Gaussian envelope
                    const centerX = 0.5;
                    const centerY = 0.5;
                    const envelope = Math.exp(-((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY)) / 0.3);
                    
                    // Weight by frequency (higher frequencies get less weight)
                    const freqWeight = Math.exp(-0.5 * Math.pow((freq - (freq1 + freq2)/2) / ((freq2 - freq1)/4), 2));
                    
                    filtered[i][j] += white[i][j] * pattern * envelope * freqWeight;
                }
            }
        }
    }
    
    // Normalize
    const totalPatterns = numFreqs * orientations;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filtered[i][j] /= totalPatterns;
        }
    }
    
    console.log("Fast bandpass filter completed");
    return filtered;
}

// Convolution-based bandpass filter using Gabor-like kernels
function convolutionBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];
    
    console.log(`Convolution bandpass: mu1=${mu1}, mu2=${mu2}, s1=${s1}, s2=${s2}`);
    
    // Convert cycles per pixel to spatial frequency
    const freq1 = mu1 * width;  // cycles per image width
    const freq2 = mu2 * width;  // cycles per image width
    const sigma1 = s1 * width;  // spatial sigma
    const sigma2 = s2 * width;  // spatial sigma
    
    console.log(`Spatial frequencies: freq1=${freq1}, freq2=${freq2}, sigma1=${sigma1}, sigma2=${sigma2}`);
    
    // Create Gabor-like bandpass kernels
    const kernelSize = Math.min(32, Math.floor(width / 8)); // Adaptive kernel size
    const center = Math.floor(kernelSize / 2);
    
    // Create multiple oriented kernels
    const orientations = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4];
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            filtered[i][j] = 0;
        }
    }
    
    for (let orient of orientations) {
        // Create kernel for frequency 1
        const kernel1 = createGaborKernel(kernelSize, freq1, sigma1, orient);
        const filtered1 = convolve2D(white, kernel1, width, height);
        
        // Create kernel for frequency 2
        const kernel2 = createGaborKernel(kernelSize, freq2, sigma2, orient);
        const filtered2 = convolve2D(white, kernel2, width, height);
        
        // Combine the two frequency bands
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                filtered[i][j] += (filtered1[i][j] + filtered2[i][j]) / orientations.length;
            }
        }
    }
    
    // Debug: check filtered noise statistics
    let filteredSum = 0;
    let filteredSumSquares = 0;
    let filteredCount = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            filteredSum += filtered[i][j];
            filteredSumSquares += filtered[i][j] * filtered[i][j];
            filteredCount++;
        }
    }
    const filteredMean = filteredSum / filteredCount;
    const filteredVariance = (filteredSumSquares / filteredCount) - (filteredMean * filteredMean);
    const filteredStd = Math.sqrt(filteredVariance);
    console.log(`Filtered noise stats: mean=${filteredMean.toFixed(4)}, std=${filteredStd.toFixed(4)}`);
    
    console.log("Convolution bandpass filter completed");
    return filtered;
}

// Create Gabor kernel for convolution
function createGaborKernel(size, frequency, sigma, orientation) {
    const kernel = new Array(size);
    const center = Math.floor(size / 2);
    
    for (let i = 0; i < size; i++) {
        kernel[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            const x = (j - center) / center;
            const y = (i - center) / center;
            
            // Rotate coordinates
            const xRot = x * Math.cos(orientation) + y * Math.sin(orientation);
            const yRot = -x * Math.sin(orientation) + y * Math.cos(orientation);
            
            // Gabor function
            const gaussian = Math.exp(-(x*x + y*y) / (2 * sigma * sigma));
            const sinusoid = Math.cos(2 * Math.PI * frequency * xRot);
            
            kernel[i][j] = gaussian * sinusoid;
        }
    }
    
    return kernel;
}

// 2D convolution
function convolve2D(image, kernel, width, height) {
    const kernelSize = kernel.length;
    const halfKernel = Math.floor(kernelSize / 2);
    const result = new Array(height);
    
    for (let i = 0; i < height; i++) {
        result[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            let convSum = 0;
            let weightSum = 0;
            
            for (let ki = 0; ki < kernelSize; ki++) {
                for (let kj = 0; kj < kernelSize; kj++) {
                    const imgI = i + ki - halfKernel;
                    const imgJ = j + kj - halfKernel;
                    
                    if (imgI >= 0 && imgI < height && imgJ >= 0 && imgJ < width) {
                        convSum += image[imgI][imgJ] * kernel[ki][kj];
                        weightSum += Math.abs(kernel[ki][kj]);
                    }
                }
            }
            
            result[i][j] = weightSum > 0 ? convSum / weightSum : 0;
        }
    }
    
    return result;
}

// Convert noise array to image data URL (exactly like Python's to_png function)
function noiseToImage(noise, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    
    // Calculate standard deviation (like Python's np.std)
    let imageSum = 0;
    let imageSumSquares = 0;
    let imageCount = 0;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            imageSum += noise[i][j];
            imageSumSquares += noise[i][j] * noise[i][j];
            imageCount++;
        }
    }
    
    const mean = imageSum / imageCount;
    const variance = (imageSumSquares / imageCount) - (mean * mean);
    const std = Math.sqrt(variance);
    
    // Apply tail clipping with ±3σ (exactly like Python)
    const lo = -3 * std;
    const hi = 3 * std;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width + j) * 4;
            
            // Clip to ±3σ range
            let y = Math.max(lo, Math.min(hi, noise[i][j]));
            
            // Normalize to 0-1 range
            y = (y - lo) / (hi - lo + 1e-9);
            
            // Convert to 8-bit
            const value = Math.round(y * 255.0);
            
            imageData.data[pixelIndex] = value;     // R
            imageData.data[pixelIndex + 1] = value; // G
            imageData.data[pixelIndex + 2] = value; // B
            imageData.data[pixelIndex + 3] = 255;   // A
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

// Scale noise to specific RMS value
function scaleToRms(noise, targetRms) {
    const height = noise.length;
    const width = noise[0].length;
    
    // Calculate current RMS
    let sumSquares = 0;
    let count = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            sumSquares += noise[i][j] * noise[i][j];
            count++;
        }
    }
    const currentRms = Math.sqrt(sumSquares / count);
    
    // Scale to target RMS
    const scaleFactor = targetRms / currentRms;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            noise[i][j] *= scaleFactor;
        }
    }
    
    return noise;
}

// Generate background images
function generateBackgroundImages() {
    console.log("Generating background images...");
    
    const width = NOISE_PARAMS.bgWidth;
    const height = NOISE_PARAMS.bgHeight;
    
    try {
        // Check if FFT library is available
        if (typeof fft === 'undefined' || typeof ifft === 'undefined') {
            console.warn("FFT library not available, falling back to simple noise");
            return generateSimpleNoiseImages(width, height);
        }
        
        // Generate low noise background
        console.log("Generating low noise...");
        const lowNoise = fftBandpassTwoBandsCppRect(width, height, muCpp, sigmaCpp);
        console.log("Low noise generated, scaling...");
        const scaledLowNoise = scaleToRms(lowNoise, NOISE_PARAMS.noiseLevels.low);
        console.log("Low noise scaled, converting to image...");
        const lowImage = noiseToImage(scaledLowNoise, width, height);
        
        // Generate high noise background
        console.log("Generating high noise...");
        const highNoise = fftBandpassTwoBandsCppRect(width, height, muCpp, sigmaCpp);
        console.log("High noise generated, scaling...");
        const scaledHighNoise = scaleToRms(highNoise, NOISE_PARAMS.noiseLevels.high);
        console.log("High noise scaled, converting to image...");
        const highImage = noiseToImage(scaledHighNoise, width, height);
        
        console.log("Background images generated successfully");
        return { low: lowImage, high: highImage };
    } catch (error) {
        console.error("Error generating background images:", error);
        console.log("Falling back to simple noise generation");
        return generateSimpleNoiseImages(width, height);
    }
}

// Fallback function for simple noise generation
function generateSimpleNoiseImages(width, height) {
    console.log("Generating simple noise images...");
    
    // Generate simple white noise
    const lowNoise = generateSimpleNoise(width, height);
    const highNoise = generateSimpleNoise(width, height);
    
    const scaledLowNoise = scaleToRms(lowNoise, NOISE_PARAMS.noiseLevels.low);
    const scaledHighNoise = scaleToRms(highNoise, NOISE_PARAMS.noiseLevels.high);
    
    const lowImage = noiseToImage(scaledLowNoise, width, height);
    const highImage = noiseToImage(scaledHighNoise, width, height);
    
    return { low: lowImage, high: highImage };
}

// Simple noise generation (fallback)
function generateSimpleNoise(width, height) {
    const noise = new Array(height);
    for (let i = 0; i < height; i++) {
        noise[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            noise[i][j] = Math.random() * 2 - 1;
        }
    }
    return noise;
}

// Create solid color image as fallback
function createSolidColorImage(width, height, grayValue) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
}

// Generate background images
const backgroundImages = generateBackgroundImages();

// Background stimuli using generated images
const BACKGROUND_LOW = {
    obj_type: "image",
    file: backgroundImages.low,
    x: 0,
    y: 0,
    scale: 1.0
};

const BACKGROUND_HIGH = {
    obj_type: "image",
    file: backgroundImages.high,
    x: 0,
    y: 0,
    scale: 1.0
};

// Gabor stimulus definition
const GABOR_STIMULUS = {
    obj_type: "gabor",
    x: 0,
    y: 0,
    width: 256,
    sf: 0.02, // spatial frequency
    phase: 0,
    contrast: 20,
    sc: 50, // standard deviation of gaussian
    bg_color: "transparent"
};

// Trial definitions with backgrounds
const TRIAL1 = {
    type: jsPsychPsychophysics,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_LOW, GABOR_STIMULUS],
    response_type: "keyboard",
    choices: PRMS.resp_keys,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "low",
        position: 0,
        comp: "comp",
        corr_resp: PRMS.resp_keys[0]
    },
    on_finish: function() {
        code_trial();
        PRMS.ctrl += 1;
    }
};

const TRIAL2 = {
    type: jsPsychPsychophysics,
    canvas: { background_color: 'transparent' },
    stimuli: [BACKGROUND_HIGH, GABOR_STIMULUS],
    response_type: "keyboard", 
    choices: PRMS.resp_keys,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "high", 
        position: 0,
        comp: "comp",
        corr_resp: PRMS.resp_keys[1]
    },
    on_finish: function() {
        code_trial();
        PRMS.ctrl += 1;
    }
};

// Timeline
const timeline = [
    //TASK_INSTRUCTIONS1,
    //TASK_INSTRUCTIONS2,
    {
        timeline: [TRIAL1, TRIAL2],
        //timeline: [TASK_INSTRUCTIONS_BLOCK, TRIAL1, TRIAL2],
        //loop_function: function() {
        //    return PRMS.cblk <= PRMS.nblks;
        //}
    },
    //BLOCK_FEEDBACK,
    //END_SCREEN,
    //SAVE_DATA
];

// Start experiment
jsPsych.run(timeline);