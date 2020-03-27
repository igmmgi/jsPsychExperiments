// Test data saving 
// Version is determined by VP number
// Experiment is removed after X VPs (set in php file)

const expName = getFileName();
const dirName = getDirName();
const numDataFiles = getNumberOfFiles("/Common/num_files.php", dirName + "data/");
const versionNumber = getVersionNumber(numDataFiles, 4);

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrls: 1,  // number of trials in subsequent blocks 
    nBlks: 1,
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
    type: "html-keyboard-response",
    stimulus: "<H1 style='text:align=center;'>Welcome To Experiment: Version " + versionNumber + "</H1>" 
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(welcome_en);
    exp.push(task_instructions);

    return exp;

}
const EXP = genExpSeq();
const datname = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
    on_finish: function(){ 
        saveData("/Common/write_data.php", datname); 
    }
});

