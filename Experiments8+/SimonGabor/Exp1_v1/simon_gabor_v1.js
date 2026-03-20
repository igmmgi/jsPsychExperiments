// Simon task with Gabor patch embeded on background noise
const jsPsych = initJsPsych({
    // on_finish: function () {
    //     if (PRMS.cblk >= 9) {
    //         window.location.assign(
    //             "https://uni-tuebingen.sona-systems.com/webstudy_credit.aspx?experiment_id=699&credit_token=2769d6a2f059477eb4d4d8724ec02ce9&survey_code=" +
    //             jsPsych.data.urlVariables().sona_id,
    //         );
    //     }
    // },
});

const pixi_flag = true; //jsPsych.data.getURLVariable("pixi_flag") === "1" ? true : false;

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const CANVAS_COLOUR = "rgba(128, 128, 128, 1)";
//const CANVAS_SIZE = [960, 1280]; // height, width
const CANVAS_SIZE = [720, 960]; //changed NEWIAN
const CANVAS_BORDER = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const PRMS = {
    ntrls: 72,
    nblks: 9,
    fix_size: 30, // size of the fixation cross
    fix_width: 5, // width of fixation cross
    fix_color: "black", // colour of the fixation cross
    fix_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    initial_background_duration: 0,
    fixation_duration: 0,
    too_slow: 2500, // subtract background duration + fixation duration for true too slow (3000 = 1500)
    feedback_duration: [0, 1500, 1500],
    iti: 1000,
    stim_size: "40px monospace",
    simon_pos: 300,
    feedback_size: "24px monospace",
    feedback_text_size_block: 20,
    feedback_text: ["", "Falsch", "Zu langsam!"],
    feedback_colour: "rgba(0, 0, 0, 1)", // colour of the fixation cross
    resp_keys: ["Q", "P"], // left/right
    ctrl: 1, // count trials
    cblk: 1, // count blocks
    // Background noise parameters
    noise_low: 0.1, // RMS amplitude for low noise background
    noise_high: 0.8, // RMS amplitude for high noise background
    noise_freq_low: [2.0, 20.0], // Two bandpass center frequencies for LOW noise (cycles per 256px)
    noise_freq_high: [2.0, 20.0], // Two bandpass center frequencies for HIGH noise (cycles per 256px)
    noise_bandwidth_low: 0.2, // Fractional bandwidth for LOW noise (sigma = mu * bandwidth)
    noise_bandwidth_high: 0.2, // Fractional bandwidth for HIGH noise (sigma = mu * bandwidth)
    // Gabor patch parameters
    gabor_size: 156, //256,                 // Gabor diameter in pixels
    gabor_sf: [0.03, 0.06], // Spatial frequency (cycles per pixel)
    gabor_phase: 0, // Phase offset (0-360 degrees)
    gabor_tilt: 0, // Tilt/rotation in degrees (0 = horizontal, 90 = vertical)
    gabor_contrast: 100, // Contrast multiplier (100 = full contrast, can exceed 100)
    gabor_sigma: 50, // Gaussian envelope standard deviation (pixels)
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////

// response key mapping for baseline simon
const RESP_TEXT =
    generate_formatted_html({
        //       text: "Low" + "&emsp;".repeat(8) + "High" + "&emsp;".repeat(8),
        text: "Weit" + "&emsp;".repeat(8) + "Eng" + "&emsp;".repeat(8),
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
                  In diesem Experiment musst du entscheiden, ob der Abstand zwischen Linien in einem Kreis eher eng oder eher weit ist.<br><br>
                  Der Kreis erscheint entweder links oder rechts auf dem Bildschirm.<br><br>
                  Ignoriere die Position des Kreises und reagiere so schnell und genau wie möglich auf den Abstand der Linien wie folgt:<br><br>
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
        //let row1 = ` Low               High`;
        let row1 = ` Weit               Eng`;
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
            filter_options: { stim: "sg", block_num: PRMS.cblk },
        });
        let text = block_feedback_text(PRMS.cblk, PRMS.nblks, block_dvs.mean_rt, block_dvs.error_rate);
        trial.stimulus = `<div style="font-size:${PRMS.feedback_text_size_block}px;">${text}</div>`;
    },
    on_finish: function () {
        PRMS.ctrl = 1;
        PRMS.cblk += 1;
    },
};

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
    // Show first few rows of all data to see what keys exist
    const allData = jsPsych.data.get().values();
    jsPsych.data.addProperties({ vpNum: VP_NUM });

    const data_fn = `${DIR_NAME}data/${EXP_NAME}_${VP_NUM}`;
    // save_data_server("/Common8+/write_data.php", data_fn, { stim: "sg" }, "csv",
    //     ["stimulus", "stimuli", "trial_type", "internal_node_id", "trial_index", "time_elapsed"]);
    // save_data_local(data_fn, { stim: "sg" }, "csv",
    //     ["stimulus", "stimuli", "trial_type", "internal_node_id", "trial_index", "time_elapsed"]);
    //save_data_local(data_fn, { stim: "sg" }, "csv",
    //    ["stimulus", "stimuli", "trial_type", "internal_node_id", "trial_index", "time_elapsed"]);
    save_data_local(data_fn);
}

const SAVE_DATA = {
    type: jsPsychCallFunction,
    func: save,
    post_trial_gap: 1000,
};

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
        return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    },
    magnitude: function (c) {
        return Math.sqrt(c[0] * c[0] + c[1] * c[1]);
    },
};

// FFT
const fftUtil = {
    exponent: function (k, N) {
        const x = -2 * Math.PI * (k / N);
        return [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]
    },
};

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

function fft2d(data, width, height) {
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

        return result;
    } catch (error) {
        console.error("Error in FFT2D:", error);
        throw error;
    }
}

function ifft2d(data, width, height) {
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

        return result;
    } catch (error) {
        console.error("Error in IFFT2D:", error);
        throw error;
    }
}

// Background noise generation functions using proper FFT bandpass filtering
function fftBandpassTwoBandsCppRect(width, height, muCpp, sigmaCpp) {
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
    const whiteVariance = sumSquares / count - whiteMean * whiteMean;
    const whiteStd = Math.sqrt(whiteVariance);

    // Step 2: Apply PROPER FFT-based bandpass filtering (not simpleBandpassFilter!)
    const filtered = workingBandpassFilter(white, width, height, muCpp, sigmaCpp);

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

// Working bandpass filter that properly implements Python algorithm
function workingBandpassFilter(white, width, height, muCpp, sigmaCpp) {
    const mu1 = muCpp[0];
    const mu2 = muCpp[1];
    const s1 = sigmaCpp[0];
    const s2 = sigmaCpp[1];

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
        if (j < width / 2) {
            fx_cpp[j] = j / width;
        } else {
            fx_cpp[j] = (j - width) / width;
        }
    }

    for (let i = 0; i < height; i++) {
        if (i < height / 2) {
            fy_cpp[i] = i / height;
        } else {
            fy_cpp[i] = (i - height) / height;
        }
    }

    // Create meshgrid with indexing="xy" (matches Python's np.meshgrid(fx_cpp, fy_cpp, indexing="xy"))
    // In xy-indexing: FX[i, j] = fx_cpp[j], FY[i, j] = fy_cpp[i]
    const FX = new Array(height);
    const FY = new Array(height);
    for (let i = 0; i < height; i++) {
        FX[i] = new Array(width);
        FY[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            FX[i][j] = fx_cpp[j]; // X varies along columns (j index)
            FY[i][j] = fy_cpp[i]; // Y varies along rows (i index)
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
    const filteredFreq = [];
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const idx = i * width + j;
            filteredFreq.push([
                F[idx][0] * H[i][j], // real part
                F[idx][1] * H[i][j], // imaginary part
            ]);
        }
    }

    // Apply inverse FFT
    const filteredComplex = ifft2d(filteredFreq, width, height);
    const filtered = new Array(height);
    for (let i = 0; i < height; i++) {
        filtered[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            const idx = i * width + j;
            filtered[i][j] = filteredComplex[idx][0]; // real part only
        }
    }

    return filtered;
}

// Convert noise array to image
function noiseToImage(noise, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    // Add noise to gray background (128) - this preserves RMS differences
    const grayLevel = 128;
    const scaleFactor = 255; // Scale noise to pixel range

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width + j) * 4;

            // Add scaled noise to gray background
            let value = grayLevel + noise[i][j] * scaleFactor;

            // Clip to valid 8-bit range
            value = Math.max(0, Math.min(255, Math.round(value)));

            imageData.data[pixelIndex] = value; // R
            imageData.data[pixelIndex + 1] = value; // G
            imageData.data[pixelIndex + 2] = value; // B
            imageData.data[pixelIndex + 3] = 255; // A
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

// Helper function to generate noise for one level
function generateNoiseLevel(width, height, freqArray, bandwidth, rmsLevel) {
    // To ensure isotropic (circular) noise patterns, generate square noise
    // then center-crop to the rectangular dimensions
    const maxDim = Math.max(width, height);

    // Round up to nearest power of 2 for efficient FFT
    const squareSize = Math.pow(2, Math.ceil(Math.log2(maxDim)));

    // freqArray is in "cycles per 256px" - convert to cycles per pixel for the square
    const muCpp = freqArray.map((mu) => mu / 256);
    const sigmaCpp = muCpp.map((mu) => mu * bandwidth);

    // // Simple white Gaussian noise instead
    // const squareNoise = new Array(squareSize);
    // for (let i = 0; i < squareSize; i++) {
    //     squareNoise[i] = new Array(squareSize);
    //     for (let j = 0; j < squareSize; j++) {
    //         // Box-Muller transform for Gaussian noise
    //         const u1 = Math.random();
    //         const u2 = Math.random();
    //         const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    //         squareNoise[i][j] = z0;
    //     }
    // }
    // const scaledSquareNoise = scaleToRms(squareNoise, rmsLevel);

    // Generate square noise
    const squareNoise = fftBandpassTwoBandsCppRect(squareSize, squareSize, muCpp, sigmaCpp);
    const scaledSquareNoise = scaleToRms(squareNoise, rmsLevel);

    // Center-crop to target dimensions
    const croppedNoise = new Array(height);
    const startY = Math.floor((squareSize - height) / 2);
    const startX = Math.floor((squareSize - width) / 2);

    for (let i = 0; i < height; i++) {
        croppedNoise[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            croppedNoise[i][j] = scaledSquareNoise[startY + i][startX + j];
        }
    }

    return noiseToImage(croppedNoise, width, height);
}

// Generate background images
function generateBackgroundImages() {
    const width = CANVAS_SIZE[1];
    const height = CANVAS_SIZE[0];

    const lowImage = generateNoiseLevel(width, height, PRMS.noise_freq_low, PRMS.noise_bandwidth_low, PRMS.noise_low);
    const highImage = generateNoiseLevel(
        width,
        height,
        PRMS.noise_freq_high,
        PRMS.noise_bandwidth_high,
        PRMS.noise_high,
    );

    return { low: lowImage, high: highImage };
}

const FIX1 = {
    obj_type: "line",
    origin_center: true,
    startX: 0, // location in the canvas
    startY: 0,
    angle: 0,
    line_length: PRMS.fix_size,
    line_width: PRMS.fix_width,
    line_color: PRMS.fix_color,
    show_start_time: PRMS.initial_background_duration,
};

const FIX2 = {
    obj_type: "line",
    origin_center: true,
    startX: 0, // location in the canvas
    startY: 0,
    angle: 90,
    line_length: PRMS.fix_size,
    line_width: PRMS.fix_width,
    line_color: PRMS.fix_color,
    show_start_time: PRMS.initial_background_duration,
};

// Generate background images
const backgroundImages = generateBackgroundImages();

// Background stimuli using generated images
const BACKGROUND_LOW = {
    obj_type: "image",
    file: backgroundImages.low,
    x: 0,
    y: 0,
    scale: 1.0,
    show_start_time: 0,
};

const BACKGROUND_HIGH = {
    obj_type: "image",
    file: backgroundImages.high,
    x: 0,
    y: 0,
    scale: 1.0,
    show_start_time: 0,
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_LOW_SF_LEFT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: -PRMS.simon_pos,
    startY: 0,
    endX: -PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[0],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration,
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_LOW_SF_RIGHT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: PRMS.simon_pos,
    startY: 0,
    endX: PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[0],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration,
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_HIGH_SF_LEFT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: -PRMS.simon_pos,
    startY: 0,
    endX: -PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[1],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration,
};

// Gabor stimulus definition (references PRMS for easy testing)
const GABOR_STIMULUS_HIGH_SF_RIGHT_POS = {
    obj_type: "gabor",
    origin_center: true,
    startX: PRMS.simon_pos,
    startY: 0,
    endX: PRMS.simon_pos,
    endY: 0,
    motion_end_time: PRMS.initial_background_duration + PRMS.fixation_duration,
    width: PRMS.gabor_size,
    sf: PRMS.gabor_sf[1],
    phase: PRMS.gabor_phase,
    tilt: PRMS.gabor_tilt,
    contrast: PRMS.gabor_contrast,
    sc: PRMS.gabor_sigma,
    bg_color: "transparent",
    show_start_time: PRMS.initial_background_duration + PRMS.fixation_duration,
};

// Trial definitions - one per condition to avoid on_start issues
const TRIAL_LOW_NOISE_LOW_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "low",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[0],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_LOW_NOISE_LOW_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "low",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[0],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_LOW_NOISE_HIGH_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "high",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[1],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_LOW_NOISE_HIGH_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_LOW, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "low",
        noise: "high",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[1],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_HIGH_NOISE_LOW_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "low",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[0],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_HIGH_NOISE_LOW_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_LOW_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "low",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[0],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_HIGH_NOISE_HIGH_SF_LEFT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_LEFT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "high",
        position: -PRMS.simon_pos,
        comp: "comp",
        corr_resp: PRMS.resp_keys[1],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

const TRIAL_HIGH_NOISE_HIGH_SF_RIGHT = {
    type: jsPsychPsychophysics,
    pixi: pixi_flag,
    canvas: { background_color: "transparent" },
    stimuli: [BACKGROUND_HIGH, FIX1, FIX2, GABOR_STIMULUS_HIGH_SF_RIGHT_POS],
    response_type: "key",
    choices: PRMS.resp_keys,
    response_ends_trial: true,
    trial_duration: PRMS.too_slow,
    data: {
        stim: "sg",
        freq: "high",
        noise: "high",
        position: PRMS.simon_pos,
        comp: "incomp",
        corr_resp: PRMS.resp_keys[1],
    },
    on_finish: function () {
        code_trial();
        PRMS.ctrl += 1;
    },
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen(true));
    exp.push(browser_check(CANVAS_SIZE));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vp_info_form("/Common8+/vpInfoForm_de.html"));
    exp.push(mouse_cursor(false));
    exp.push(TASK_INSTRUCTIONS1);
    exp.push(TASK_INSTRUCTIONS2);

    // Create nblks blocks, each with a different shuffle order
    for (let blk = 0; blk < PRMS.nblks; blk++) {
        // Create shuffled trial array for this block
        const trialArray = jsPsych.randomization.repeat(
            [
                TRIAL_LOW_NOISE_LOW_SF_LEFT,
                TRIAL_HIGH_NOISE_LOW_SF_LEFT,
                TRIAL_LOW_NOISE_LOW_SF_RIGHT,
                TRIAL_HIGH_NOISE_LOW_SF_RIGHT,
                TRIAL_LOW_NOISE_HIGH_SF_LEFT,
                TRIAL_HIGH_NOISE_HIGH_SF_LEFT,
                TRIAL_LOW_NOISE_HIGH_SF_RIGHT,
                TRIAL_HIGH_NOISE_HIGH_SF_RIGHT,
            ],
            PRMS.ntrls / 8,
        );

        // Interleave with ITI
        const timelineWithITI = [];
        for (let trial of trialArray) {
            timelineWithITI.push(trial);
            timelineWithITI.push(TRIAL_FEEDBACK);
            timelineWithITI.push(ITI);
        }

        exp.push({ timeline: timelineWithITI });
        exp.push(BLOCK_FEEDBACK); // show previous block performance
    }

    // save data
    exp.push(SAVE_DATA);

    // debrief
    exp.push(mouse_cursor(true));
    exp.push(END_SCREEN);
    exp.push(end_message());
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.simulate(EXP, "data-only");
// jsPsych.simulate(EXP, "visual");
// jsPsych.run(EXP);
