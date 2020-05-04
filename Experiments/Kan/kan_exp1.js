// JavaScript (jsPsych) version of Exp1 from Kan et al. (2013)
// To adapt or not to adapt: The question of domain-general cognitive 
// control, Cognition, 129, 637-651

// Main finding: difficult to interpret sentences (i.e., high conflict) reduces
// the compatibility effect if a subsequent stroop trial.
//
// Experiment Overview:
// Stoop task with three ink colours (blue, green, yellow) with 6 words (blue, green,
// yellow, brown, orange, red). Colours mapped to three adjacent keys and responded to
// with the index, middle and ring fiingers of the dominant hand.
//
// Sentence task with materials adapted from Garnsey et al. (1997). Some items (21) 
// were difficult to process (ambiguous/incongurnet) whilst others (21) were easy
// to process (unambiguous/congruent). 
// Sentence Examples:
// (a) The basketball player accepted that the contract would have to be negotiated (unambiguous/congruent)
// (b) The basketball player accepted the contract would have to be negotiated (ambiguous/incongruent)
// The sentences are presented using the moving-window procedure 
// ___ __________ ______ ________ ____ ___ ________ _____ ____ __ __ __________ 
// The __________ ______ ________ ____ ___ ________ _____ ____ __ __ __________ 
// ___ basketball ______ ________ ____ ___ ________ _____ ____ __ __ __________ 
// ___ __________ player ________ ____ ___ ________ _____ ____ __ __ __________
// and so on ...
//
// Experiment Procedure:
// Practice/Training
// Phase 1) Training block with 10 stroop trials in isolation in order to learn response mapping
// Phase 2) Baseline stroop trials (N = 145?) with both congruent and incongruent trials 
// Phase 3) A single practice filler sentence to familiarize VPs with the moving-window procedure
// Phase 4) 20 intermixed stroop (10 trials) and sentences (10 fillers) 
// Experiment 
// Phase 1) 162 trials (120 stroop with 60 in each congruency), 21 congruent-type sentences, 
//  21 incongruent-type sentences, and 29 filler sentences. Comprehension questions followed
//  10 random filler sentences.
//
// Trial Procedure:
// 500 mx fixation cross
// Stroop/Sentence stimulus
// 1000 ms blank inter-trial-interval (ITI)
//
// Stroop stimuli remain on screen for 1000 ms
// Sentence stimuli begin with the full mask and remain until VPs have revealed 
//  each word by repeatedly pressing the spacebar with their non-dominant hand
//
// Comprehension questions following a selection of filler trials appear 1000 ms
//  following stimulus offset followed by a blank screen for 1500 ms

// on_start: function() {$('body').css('cursor', 'none')},
// on_finish: function() {$('body').css('cursor', 'default')}

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP_stroop: 10,  // number of practice stoop trials in isolation
    nTrlsB_stroop: 145, // number of baseline stoop trials in isolation
    nTrlsP_sentence: 1, // number of sentence trials in isolation
    nTrlsP_comb: 20,    // number of intermixed stroop/sentence practice trials
    nTrlsE: 162,        // number of intermixed stroop/sentence experiment trials
    fixDur: 500,
    fbDur: 750,
    iti: 1000,
    blankDur: 1500,
    tooSlow: 1000,
    respKeysSentence: ["Space", 27],
    respKeysStroop: ["G", "H", "J", 27],
    respKeysQuestion: ["T", "F", 27],
    fbTxt: ["Correct", "Error", "Too Slow", "Too Fast"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    mapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
// Stroop Stimuli consist of the words blue, green, yellow, brown, orange and red
//  paired with the colours blue, green, yellow to create compatible and incomaptibel trials
//  NB: as indicated in the Kan paper, this is conflict at the stimulus level (i.e., the
//  irrelevant dimension does not indicate an alternative response)
const stroops = [{word: "blue",   colour: "blue",   comp: "comp",   key:prms.respKeysStroop[0]},
                 {word: "green",  colour: "green",  comp: "comp",   key:prms.respKeysStroop[1]},
                 {word: "yellow", colour: "yellow", comp: "comp",   key:prms.respKeysStroop[2]},
                 {word: "brown",  colour: "blue",   comp: "incomp", key:prms.respKeysStroop[0]},
                 {word: "orange", colour: "green",  comp: "incomp", key:prms.respKeysStroop[1]},
                 {word: "red",    colour: "yellow", comp: "incomp", key:prms.respKeysStroop[2]}]

// 11 practice sentences
// Select 1 random sentence as the training phase for the moving-window procedure
const prac_sentences = [
    "The good dog fetched the stick for his owner.",
    "The thick haze remained over the large city for an entire week in July.",
    "The local supermarket closed early every night and never had what you needed.",
    "The Governor’s daughter felt that he was being too hard on juvenile criminals.",
    "The family’s new home had a gaping hole in the wall and leaks in the cracked ceilings.",
    "The subway car went around a turn too fast and came dangerously close to derailing.",
    "The clumsy postal worker damaged the package full of priceless antique china.",
    "The racecar driver slowed down too much at the last turn and almost didn’t win the race.",
    "The careless shipper never looked for the best bargain and would buy things on impulse.",
    "The pizza deliveryman always made his delivery on time and earned large tips.",
    "The old banker was extremely rich and donated millions of dollars to area charities."
]

// 21 Congruent, 21 incongruent, and 29 "filler" items
const exp_sentences = [ 
    "The frustrated tourists understood the message would mean they couldn’t go.",
    "The gossipy neighbor heard that the story had never actually been true.",
    "The scuba diver discovered that the wreck was caused by a collision.",
    "The clerk at the records office clarified the confusing statement on the application.",
    "The handsome prince offered but his bride’s family declined the fortune.",
    "The angry father emphasized the problems were continuing to get worse.",
    "The art critic wrote the interview had not been well received.",
    "The two friends wagered their allowance on who would get the highest test score.",
    "The journal editor printed that the article had been slanderous to him.",
    "The radio newscaster verified the short and exciting report before the broadcast.",
    "The bargain shopper saw the beautiful and expensive raincoat after the sale was over.",
    "The exuberant team planned a huge and extravagant party for after the game.",
    "The CIA director confirmed the rumor should have been stopped sooner.",
    "The surgical nurses protested that the policies were unfair to the patients.",
    "The new house sitter forgot that the key would be under the doormat.",
    "The chemistry student learned the equations could make measurement more precise.",
    "The talented photographer accepted that the money could not be spent yet.",
    "The concerned priest asserted the belief would be hard to explain.",
    "The confident engineer maintained the machinery would be hard to destroy.",
    "The mysterious woman divulged her deepest and darkest secrets to the bus driver.",
    "The science teacher verified the unexpected results because she found them implausible.",
    "The temporary assistant saw the memo while rummaging through the files.",
    "The french teacher repeated the poem should be finished by Friday.",
    "The newspaper editor advocated that the truth needed to be made public.",
    "The injured man imagined the attack while in the emergency room.",
    "The primary suspect established the alibi had been a total lie.",
    "The trained referees warned that the spectators would probably get too rowdy.",
    "The lab technician proposed the idea might be worth another try.",
    "The worried mother determined the explanation for why her son had been avoiding her.",
    "The flight attendant clarified the instructions when the passengers asked questions.",
    "The church workers offered the kids a free bible and some coloring books.",
    "The old tenants insured that the house would never get flooded again.",
    "The foreign visitor found that the entrance had been confusing to her.",
    "The basketball star accepted the contract would have to be negotiated.",
    "The curious girl comprehended the answer but asked the question again.",
    "The office staff raced but there was no clear winner.",
    "The popular novelist wrote that the essay would change the voters’ minds.",
    "The distracted businessman forgot the address was written in the e-mail.",
    "The experienced boss emphasized that the objective should not be abandoned yet.",
    "The angry residents warned the kids had disturbed every single weekend.",
    "The teacher’s assistant divulged the purpose of her colleague’s absence.",
    "Many of the cheerleaders recalled the strenuous routine from last year’s game.",
    "The local publisher printed the quote had not been accurately reported.",
    "The wise consumer understood that the label was a very misleading one.",
    "The amateur musician learned that the song couldn’t be recorded for hours.",
    "The attorneys for the family disputed the authorities’ version of what transpired.",
    "The wealthy investor regretted the decision once he realized the consequences.",
    "The models in the fashion show revealed their stylish tank tops.",
    "The french explorers discovered the treasure had caused a vicious battle.",
    "The two hunters heard the birds had behun migrating in October.",
    "The new mayor advocated the strategy could be implemented next year.",
    "The political group protested the treaty had been broken many times.",
    "The upset customer asserted that the complaint should be taken very seriously.",
    "The I.R.S. agent demanded the full amount the week following the audit.",
    "The poodle recognized his owner’s scent on the clothing that was discovered.",
    "The waitress promised her regulars a free cup of coffee.",
    "The stuttering child repeated that the threat was highly unnecessary and hurtful.",
    "The coast guard confirmed that the drowning could not have been avoided.",
    "The new owners insured the vehicle was sound before buying it.",
    "The devoted caretaker maintained that the garden was causing his chronic allergies.",
    "The foreign students sat down but couldn’t understand the lecture.",
    "The angry mob announced their demands but still refused to negotiate.",
    "The nervous teenager lied to the judge to avoid incriminating his friend.",
    "The store manager established that the policy had been a blatant fraud.",
    "The bored librarian painted her fingernails after shelving several books.",
    "The interior decorator hammered away and hung the paintings on the wall.",
    "The curious drifter found the statues were hidden behind the hedges.",
    "The sergeant proposed that the strategy could start the next day.",
    "The esteemed professor taught that the class had needed hands-on experience.",
    "The school counsellor advised the student take time off before college.",
    "The new salesman insulted the stranger and she left the store.",
]

const filler_questions = [
    "Question 1?",
    "Question 2?",
    "Question 3?",
    "Question 4?",
    "Question 5?",
    "Question 6?",
    "Question 7?",
    "Question 8?",
    "Question 9?",
    "Question 10?",
    "Question 11?",
    "Question 12?",
    "Question 13?",
    "Question 14?",
    "Question 15?",
    "Question 16?",
    "Question 17?",
    "Question 18?",
    "Question 19?",
    "Question 20?",
    "Question 21?",
]

////////////////////////////////////////////////////////////////////////
//                        jsPsych type stimuli                        //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    stimulus: "Fixation Cross",
    trial_duration: 1000,
    translate_origin: true,
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
    func: drawFixation,
};

const iti = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 1000,
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
    func: function() {}
};

const iti_filler = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 1500,
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
    func: function() {}
};

const stroop_stimulus = {
    type: 'static-canvas-keyboard-response',
    trial_duration: 1000,
    translate_origin: true,
    choices: prms["respKeysStroop"],
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'),
    func: drawStroop,
    func_args: [
        {
            word: jsPsych.timelineVariable('word'), 
            colour: jsPsych.timelineVariable('colour')
        }
    ]
};


const question_stimulus = {
    type: 'static-canvas-keyboard-response',
    translate_origin: true,
    choices: prms["respKeysQuestion"],
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'),
    func: drawQuestion,
    func_args: [
        {
            question: jsPsych.timelineVariable('question'), 
        }
    ]
};

const moving_window_text = {
    type: 'text-moving-window-keyboard-response',
    sentence: jsPsych.timelineVariable('sentence'),
    word_number: jsPsych.timelineVariable('word_num'),
    choices: prms["respKeysSentence"],
    canvas_colour: "lightgrey",
    canvas_border: "10px solid black",
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false
}


////////////////////////////////////////////////////////////////////////
//                     Create timeline variables                      //
////////////////////////////////////////////////////////////////////////
function create_sentence_sequence(sentence) {
    const txt = sentence.split(' ');
    let seq = [];
    for (let i = -1; i < txt.length; i++) {
        seq.push({sentence: sentence, word_num: i, length: txt.length});
    }
    return seq;
}

function create_sentence_items(sentences) {
    let items = [];
    for (let i = 0; i < sentences.length; i++) {
        const tmp = {
            timeline: [moving_window_text],
            timeline_variables: create_sentence_sequence(sentences[i]),
        }
        items.push(tmp);
    }
    return shuffle(items);
}


function create_question_items(questions) {
    let items = [];
    for (let i = 0; i < sentences.length; i++) {
        const tmp = {
            timeline: [moving_window_text],
            timeline_variables: create_sentence_sequence(sentences[i]),
        }
        items.push(tmp);
    }
    return shuffle(items);
}


function create_stroop_items(nreps) {
    let items = [];
    for (let i = 0; i < nreps; i++) {
        for (let j = 0; j < 6; j++) {
            let tmp = {
                timeline: [stroop_stimulus],
                timeline_variables: [stroops[j]],
            }
            items.push(tmp);
        }
    }		
    return shuffle(items);
}

function add_fix_iti(items) {
    let seq = []
    for (let i = 0; i < items.length; i++) {
        seq.push(fixation_cross)
        seq.push(items[i])
        seq.push(iti)
    }
    return seq
}
    
////////////////////////////////////////////////////////////////////////
//                      Canvas Drawing Functions                      //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 3;
    ctx.moveTo(-20, 0);
    ctx.lineTo( 20, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -20);
    ctx.lineTo(0,  20);
    ctx.stroke(); 
}

function drawStroop(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font         = "50px monospaced";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = args["colour"];
    ctx.fillText(args["word"], 0, 0); 
}

function drawQuestion(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font         = "50px monospaced";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "black";
    ctx.fillText(args["question"], 0, 0); 
}

////////////////////////////////////////////////////////////////////////
//                     Create required timelines                      //
////////////////////////////////////////////////////////////////////////
// Create items needed for each phase of the experiment
// The timeline of items are shuffled with the addition of a fixation 
const prac_items_stroop = add_fix_iti(create_stroop_items(2))
const base_items_stroop = add_fix_iti(create_stroop_items(25))

// just take the first item as the item form the moving window familiarisation routine
const prac_items_sentences  = create_sentence_items(prac_sentences)
const prac_items_sentences1 = add_fix_iti(prac_items_sentences.slice(0, 1))
const prac_items_sentences2 = prac_items_sentences.slice(1)
const prac_items_combined   = add_fix_iti(shuffle(prac_items_sentences2.concat(create_stroop_items(3))))

const exp_items_sentences = create_sentence_items(exp_sentences)
const exp_items_stroop    = create_stroop_items(20)
const exp_items_combined  = add_fix_iti(shuffle(exp_items_sentences.concat(exp_items_stroop)))


const prac_trials_stroop = {
    timeline: prac_items_stroop
}
const base_trials_stroop = {
    timeline: base_items_stroop
}
const prac_trial_sentence = {
    timeline: prac_items_sentences1
}
const prac_trial_combined = {
    timeline: prac_items_combined
}

const exp_trial_combined = {
    timeline: exp_items_combined
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    //exp.push(fullscreen_on);
   
    // Practice/training phase of experiment
    // exp.push(prac_trials_stroop);
    // exp.push(base_trials_stroop);
    // exp.push(prac_trial_sentence);
    // exp.push(prac_trial_combined);

    // Experiment
    exp.push(exp_trial_combined);
    
    return exp;

}
EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
});

