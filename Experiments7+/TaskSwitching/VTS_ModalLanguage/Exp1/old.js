// function create_trial_table_forced_block() {
//     trials = [];
//     let task = ["parity", "magnitude"];
//     let task_cue = ["Blue", "Red"];
//     let stimuli = [1, 2, 3, 4, 6, 7, 8, 9];
//     for (let i = 0; i < stimuli.length; i++) {
//         for (let j = 0; j < task.length; j++) {
//             trials.push({
//                 number: stimuli[i],
//                 task_type: "forced",
//                 task: task[j],
//                 task_cue: task_cue[j],
//             });
//         }
//     }
//     trials = repeatArray(trials, 8);
//
//     let rep_count, switch_count;
//     let shuffled = false;
//     while (!shuffled) {
//         rep_count = 0;
//         switch_count = 0;
//         trials_shuffled = deepCopy(shuffle(trials));
//         trials_shuffled.push(trials[getRandomInt(0, trials.length)]);
//         for (let trial = 0; trial < trials_shuffled.length; trial++) {
//             if (trial === 0) {
//                 trials_shuffled[0].repetition_switch = "na";
//                 continue;
//             }
//             if (trials_shuffled[trial - 1].task === trials_shuffled[trial].task) {
//                 trials_shuffled[trial].repetition_switch = "repetition";
//                 rep_count += 1;
//                 if (rep_count > PRMS.ntrls_forced / 2) break;
//             } else if (trials_shuffled[trial - 1].task !== trials_shuffled[trial].task) {
//                 trials_shuffled[trial].repetition_switch = "switch";
//                 switch_count += 1;
//                 if (switch_count > PRMS.ntrls_forced / 2) break;
//             }
//         }
//         if (rep_count === PRMS.ntrls_forced / 2 && switch_count === PRMS.ntrls_forced / 2) {
//             shuffled = true;
//         }
//     }
//
//     // 75% repeats for german, 25% switches for english
//     let repeats, switches;
//     if (VERSION == 1) {
//         repeats = shuffle(
//             repeatArray(["EN"], (trials.length / 2) * 0.75).concat(repeatArray(["DE"], (trials.length / 2) * 0.25)),
//         );
//         switches = shuffle(
//             repeatArray(["EN"], (trials.length / 2) * 0.25).concat(repeatArray(["DE"], (trials.length / 2) * 0.75)),
//         );
//     } else if (VERSION === 2) {
//         repeats = shuffle(
//             repeatArray(["EN"], (trials.length / 2) * 0.25).concat(repeatArray(["DE"], (trials.length / 2) * 0.75)),
//         );
//         switches = shuffle(
//             repeatArray(["EN"], (trials.length / 2) * 0.75).concat(repeatArray(["DE"], (trials.length / 2) * 0.25)),
//         );
//     }
//
//     // code file type (en vs. de) for the switch vs. repetition
//     rep_count = 0;
//     switch_count = 0;
//     for (let trial = 0; trial < trials_shuffled.length; trial++) {
//         if (trials_shuffled[trial].repetition_switch === "repetition") {
//             trials_shuffled[trial].language = repeats[rep_count];
//             rep_count += 1;
//         } else if (trials_shuffled[trial].repetition_switch === "switch") {
//             trials_shuffled[trial].language = switches[switch_count];
//             switch_count += 1;
//         } else {
//             trials_shuffled[trial].language = shuffle(["DE", "EN"])[0];
//         }
//         trials_shuffled[
//             trial
//         ].sound_file = `./tones/${trials_shuffled[trial].language}_${VOICE_GENDER}_${trials_shuffled[trial].number}.mp3`;
//     }
//
//     return trials_shuffled;
// }
// const TRIAL_TABLE = create_trial_table_forced_block();
// console.table(TRIAL_TABLE);
