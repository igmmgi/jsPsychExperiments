// Random utility functions

// Directories/files
function getDirName() {
    let name = document.currentScript.src;
    let server = location.protocol + "//" + document.location.host;
    name = name.slice(server.length, name.length);
    return name.substring(0, name.lastIndexOf("/") + 1);
}

function getFileName() {
    let name = document.currentScript.src;
    return name.substring(name.lastIndexOf("/") + 1, name.lastIndexOf("."));
}

function baseFileName(file) {
    return file.replace(/^.*[\\\/]/, "");
}

function pathJoin(parts, sep) {
    let separator = sep || "/";
    let replace = new RegExp(separator + "{1,}", "g");
    return parts.join(separator).replace(replace, separator);
}

function getNumberOfFiles(url, datDir) {
    let numDataFiles = 0;
    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: { dir: datDir },
    }).done(function (data) {
        numDataFiles = data;
    });
    return numDataFiles;
}

function getTime() {
    let num = new Date();
    return num.getTime();
}

function getPassword(url, password) {
    let correct = false;
    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: {
            password: password,
        },
    }).done(function (data) {
        correct = data;
    });
    return correct;
}

// Generate a random string with optional pre-fix
function generateRandomString(length, prefix = "") {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomString = "";
    for (let i = length; i > 0; --i) {
        randomString += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return prefix + randomString;
}

// Returns a random number between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns a random int number between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Round an array
// Adapted from: https://stackoverflow.com/questions/9671203/how-to-round-all-the-values-in-an-array-to-2-decimal-points
function roundArray(array) {
    let len = array.length;
    while (len--) {
        array[len] = Math.round(array[len]);
    }
    return array;
}

// Shuffle an array
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Python-like range function
// https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
function range(start, stop, step = 1) {
    return Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);
}

// Repeat array (a) a number (n) times
function repeatArray(a, n) {
    return new Array(n).fill(a).flat();
}

// Array mean
function mean(array) {
    return array.reduce((acc, cur) => acc + cur) / array.length;
}

// Random selection of n items from x
function randomSelection(x, n) {
    out = [];
    let idx;
    for (let i = 0; i < n; i++) {
        idx = Math.floor(Math.random() * x.length);
        out.push(x.splice(idx, 1)[0]);
    }
    return out;
}

// Deep copy of an object
// https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
const deepCopy = (inObject) => {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
        value = inObject[key];
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopy(value);
    }

    return outObject;
};

// Generate some formatted html with formatting options
// Adapted from https://github.com/hauselin/lab_exp/blob/master/libraries/utils.js
function generate_formatted_html({
    text = "Hello, world!",
    width = "900px",
    color = "black",
    align = "center",
    fontsize = 20,
    xypos = [0, 0],
    lineheight = 1,
    bold = false,
    italics = false,
    underline = false,
    position = "relative",
    preformatted = false,
} = {}) {
    let div =
        '<p style="width:' +
        width +
        "; position:" +
        position +
        "; font-size:" +
        fontsize +
        "px; text-align:" +
        align +
        "; line-height:" +
        lineheight +
        ";color:" +
        color +
        ";transform: translate(" +
        xypos[0] +
        "px," +
        xypos[1] +
        'px)" >' +
        text +
        "</p>";
    if (bold) div = "<b>" + div + "</b>";
    if (italics) div = "<i>" + div + "</i>";
    if (underline) div = "<u>" + div + "</u>";
    if (preformatted) div = "<pre>" + div + "</pre>";

    return div;
}
