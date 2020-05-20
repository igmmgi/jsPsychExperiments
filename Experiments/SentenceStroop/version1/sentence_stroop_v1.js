// JavaScript (jsPsych) version of Exp1 from Kan et al. (2013)
// To adapt or not to adapt: The question of domain-general cognitive 
// control, Cognition, 129, 637-651
//
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

//////////////////////////////////////////////////////////////////////////
////                         Canvas Properties                          //
//////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(200, 200, 200, 1)";
const canvas_size   = [960, 720];
const canvas_border = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum   = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP_stroop: 10,  // number of practice stoop trials in isolation
    nTrlsB_stroop: 145, // number of baseline stoop trials in isolation
    nTrlsP_sentence: 1, // number of sentence trials in isolation
    nTrlsP_comb: 20,    // number of intermixed stroop/sentence practice trials
    nTrlsE: 162,        // number of intermixed stroop/sentence experiment trials
    fixSize: 20,
    fixWidth: 3,
    fixDur: 500,
    fbDur: 750,
    iti: 1000,
    iti_filler: 1500,
    tooSlow: 1000,
    respKeysSentence: ["Space"],
    respKeysStroop: shuffle(["G", "H", "J"]),
    respKeysQuestion: ["T", "F"],
    fbTxt: ["Correct", "Error"],  
    font_sentence: "30px monospace",
    line_height: 40,
    sentence_width: 800,
    font_question: "30px monospace",
    font_stroop: "40px monospace",
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
};

////////////////////////////////////////////////////////////////////////
//                            Instructions                            //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h2 align='center'>Welcome to our Experiment:</h2><br>" +
              "<h2 align='center'>Press any key to continue!</h2>"
};

const cols = ["blue", "green", "yellow"]

task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align: center;'>Part 1:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font with your dominant hand</H2><br>" +
    "<H2 style='text-align: center;'>G key = " + cols[prms.respKeysStroop.indexOf("G")] + "&emsp; H key = " + cols[prms.respKeysStroop.indexOf("H")] + "&emsp; J key = " + cols[prms.respKeysStroop.indexOf("J")] + "</H2><br>" +
    "<h2 align='center'>Press any key to continue!</h2>"
};

task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align: center;'>Part 2:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font with your dominant hand</H2><br>" +
    "<H2 style='text-align: center;'>G key = " + cols[prms.respKeysStroop.indexOf("G")] + "&emsp; H key = " + cols[prms.respKeysStroop.indexOf("H")] + "&emsp; J key = " + cols[prms.respKeysStroop.indexOf("J")] + "</H2><br>" +
    "<h2 align='center'>Press any key to continue!</h2>"
};


task_instructions4 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align: center;'>Part 3:</H1><br>" +
    "<H2 style='text-align: center;'>Press the spacebar with your non-dominant hand to reveal the sentence word-by-word.</H2><br>" +
    "<h2 align='center'>Press any key to continue!</h2>"
};


task_instructions5 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align: center;'>Part 4:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font </H2><br>" +
    "<H2 style='text-align: center;'>G key = " + cols[prms.respKeysStroop.indexOf("G")] + "&emsp; H key = " + cols[prms.respKeysStroop.indexOf("H")] + "&emsp; J key = " + cols[prms.respKeysStroop.indexOf("J")] + "</H2><br>" +
    "<H2 style='text-align: center;'>Press the spacebar to reveal the sentence word-by-word.</H2><br>" +
    "<h2 align='center'>Press any key to continue!</h2>"
};


task_instructions6 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align: center;'>Part 5:</H1><br>" +
    "<H2 style='text-align: center;'>Respond to the colour of the font </H2><br>" +
    "<H2 style='text-align: center;'>G key = " + cols[prms.respKeysStroop.indexOf("G")] + "&emsp; H key = " + cols[prms.respKeysStroop.indexOf("H")] + "&emsp; J key = " + cols[prms.respKeysStroop.indexOf("J")] + "</H2><br>" +
    "<H2 style='text-align: center;'>Press the spacebar to reveal the sentence word-by-word.</H2><br>" +
    "<H2 style='text-align: center;'>Answer and questions with the T (TRUE) and F (FALSE) keys.</H2><br>" +
    "<h2 align='center'>Press any key to continue!</h2>"
};


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
// Stroop Stimuli consist of the words blue, green, yellow, brown, orange and red
//  paired with the colours blue, green, yellow to create compatible and incomaptibel trials
//  NB: as indicated in the Kan paper, this is conflict at the stimulus level (i.e., the
//  irrelevant dimension does not indicate an alternative response)
const stroops = [
    {type: "stroop", word: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0]},
    {type: "stroop", word: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1]},
    {type: "stroop", word: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2]},
    {type: "stroop", word: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0]},
    {type: "stroop", word: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1]},
    {type: "stroop", word: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2]},
    {type: "stroop", word: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0]},
    {type: "stroop", word: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1]},
    {type: "stroop", word: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2]},
    {type: "stroop", word: "brown",  colour: "blue",   cong: "incong", key:prms.respKeysStroop[0]},
    {type: "stroop", word: "orange", colour: "green",  cong: "incong", key:prms.respKeysStroop[1]},
    {type: "stroop", word: "red",    colour: "yellow", cong: "incong", key:prms.respKeysStroop[2]},
    {type: "stroop", word: "brown",  colour: "yellow", cong: "incong", key:prms.respKeysStroop[2]},
    {type: "stroop", word: "orange", colour: "blue",   cong: "incong", key:prms.respKeysStroop[0]},
    {type: "stroop", word: "red",    colour: "green",  cong: "incong", key:prms.respKeysStroop[1]},
    {type: "stroop", word: "brown",  colour: "green",  cong: "incong", key:prms.respKeysStroop[1]},
    {type: "stroop", word: "orange", colour: "yellow", cong: "incong", key:prms.respKeysStroop[2]},
    {type: "stroop", word: "red",    colour: "blue",   cong: "incong", key:prms.respKeysStroop[0]}
]

// 11 practice sentences
// Select 1 random sentence as the training phase for the moving-window procedure
const prac_sentences = [
    {num:  1, type: "prac", cong: "cong", sent: "The Governor’s daughter felt that he was being too hard on juvenile criminals.",           question: ""},
    {num:  2, type: "prac", cong: "cong", sent: "The careless shipper never looked for the best bargain and would buy things on impulse.",  question: ""},
    {num:  3, type: "prac", cong: "cong", sent: "The clumsy postal worker damaged the package full of priceless antique china.",            question: ""},
    {num:  4, type: "prac", cong: "cong", sent: "The family’s new home had a gaping hole in the wall and leaks in the cracked ceilings.",   question: ""},
    {num:  5, type: "prac", cong: "cong", sent: "The good dog fetched the stick for his owner.",                                            question: ""},
    {num:  6, type: "prac", cong: "cong", sent: "The local supermarket closed early every night and never had what you needed.",            question: ""},
    {num:  7, type: "prac", cong: "cong", sent: "The old banker was extremely rich and donated millions of dollars to area charities.",     question: ""},
    {num:  8, type: "prac", cong: "cong", sent: "The pizza deliveryman always made his delivery on time and earned large tips.",            question: ""},
    {num:  9, type: "prac", cong: "cong", sent: "The racecar driver slowed down too much at the last turn and almost didn’t win the race.", question: ""},
    {num: 10, type: "prac", cong: "cong", sent: "The subway car went around a turn too fast and came dangerously close to derailing.",      question: ""},
    {num: 11, type: "prac", cong: "cong", sent: "The thick haze remained over the large city for an entire week in July.",                  question: ""}
]

// 42 experimental items (21/21 congruent ingongruent)
// list refers to the original item list number used in Kan et al. (2013)
const exp_sentences = [
    {num:  1, list: 2, type: "exp", cong: "cong",   sent: "The CIA director confirmed that the rumor should have been stopped sooner.",             question: ""},
    {num:  1, list: 1, type: "exp", cong: "incong", sent: "The CIA director confirmed the rumor should have been stopped sooner.",                  question: ""},
    {num:  2, list: 1, type: "exp", cong: "cong",   sent: "The French explorers discovered that the treasure had caused a vicious battle.",         question: ""},
    {num:  2, list: 2, type: "exp", cong: "incong", sent: "The French explorers discovered the treasure had caused a vicious battle.",              question: ""},
    {num:  3, list: 2, type: "exp", cong: "cong",   sent: "The French teacher repeated that the poem should be finished by Friday.",                question: ""},
    {num:  3, list: 1, type: "exp", cong: "incong", sent: "The French teacher repeated the poem should be finished by Friday.",                     question: ""},
    {num:  4, list: 1, type: "exp", cong: "cong",   sent: "The amateur musician learned that the song couldn’t be recorded for hours.",             question: ""},
    {num:  4, list: 2, type: "exp", cong: "incong", sent: "The amateur musician learned the song couldn’t be recorded for hours.",                  question: ""},
    {num:  5, list: 1, type: "exp", cong: "cong",   sent: "The angry father emphasized that the problems were continuing to get worse.",            question: ""},
    {num:  5, list: 2, type: "exp", cong: "incong", sent: "The angry father emphasized the problems were continuing to get worse.",                 question: ""},
    {num:  6, list: 2, type: "exp", cong: "cong",   sent: "The angry residents warned that the kids had disturbed every single weekend.",           question: ""},
    {num:  6, list: 1, type: "exp", cong: "incong", sent: "The angry residents warned the kids had disturbed every single weekend.",                question: ""},
    {num:  7, list: 1, type: "exp", cong: "cong",   sent: "The army sergeant proposed that the strategy could start the next day.",                 question: ""},
    {num:  7, list: 2, type: "exp", cong: "incong", sent: "The army sergeant proposed the strategy could start the next day.",                      question: ""},
    {num:  8, list: 2, type: "exp", cong: "cong",   sent: "The art critic wrote that the interview had not been well received.",                    question: ""},
    {num:  8, list: 1, type: "exp", cong: "incong", sent: "The art critic wrote the interview had not been well received.",                         question: ""},
    {num:  9, list: 2, type: "exp", cong: "cong",   sent: "The basketball star accepted that the contract would have to be negotiated.",            question: ""},
    {num:  9, list: 1, type: "exp", cong: "incong", sent: "The basketball star accepted the contract would have to be negotiated.",                 question: ""},
    {num: 10, list: 2, type: "exp", cong: "cong",   sent: "The chemistry student learned that the equations could make measurement more precise.",  question: ""},
    {num: 10, list: 1, type: "exp", cong: "incong", sent: "The chemistry student learned the equations could make measurement more precise.",       question: ""},
    {num: 11, list: 1, type: "exp", cong: "cong",   sent: "The coast guard confirmed that the downing could not have been avoided.",                question: ""},
    {num: 11, list: 2, type: "exp", cong: "incong", sent: "The coast guard confirmed the downing could not have been avoided.",                     question: ""},
    {num: 12, list: 2, type: "exp", cong: "cong",   sent: "The concerned priest asserted that the belief would be hard to explain.",                question: ""},
    {num: 12, list: 1, type: "exp", cong: "incong", sent: "The concerned priest asserted the belief would be hard to explain.",                     question: ""},
    {num: 13, list: 2, type: "exp", cong: "cong",   sent: "The confident engineer maintained that the machinery would be hard to destroy.",         question: ""},
    {num: 13, list: 1, type: "exp", cong: "incong", sent: "The confident engineer maintained the machinery would be hard to destroy.",              question: ""},
    {num: 14, list: 2, type: "exp", cong: "cong",   sent: "The curious driver found that the statues were hidden behind the hedges.",               question: ""},
    {num: 14, list: 1, type: "exp", cong: "incong", sent: "The curious driver found the statues were hidden behind the hedges.",                    question: ""},
    {num: 15, list: 1, type: "exp", cong: "cong",   sent: "The devastated caretaker maintained that the garden was causing his chronic allergies.", question: ""},
    {num: 15, list: 2, type: "exp", cong: "incong", sent: "The devastated caretaker maintained the garden was causing his chronic allergies.",      question: ""},
    {num: 16, list: 2, type: "exp", cong: "cong",   sent: "The distracted businessman forgot that the address was written in the e-mail.",          question: ""},
    {num: 16, list: 1, type: "exp", cong: "incong", sent: "The distracted businessman forgot the address was written in the e-mail.",               question: ""},
    {num: 17, list: 1, type: "exp", cong: "cong",   sent: "The esteemed professor taught that the class had needed hands-on experience.",           question: ""},
    {num: 17, list: 2, type: "exp", cong: "incong", sent: "The esteemed professor taught the class had needed hands-on experience.",                question: ""},
    {num: 18, list: 1, type: "exp", cong: "cong",   sent: "The experienced boss emphasized that the objective should not be abandoned yet.",        question: ""},
    {num: 18, list: 2, type: "exp", cong: "incong", sent: "The experienced boss emphasized the objective should not be abandoned yet.",             question: ""},
    {num: 19, list: 1, type: "exp", cong: "cong",   sent: "The foreign visitor found that the entrance had been confusing to her.",                 question: ""},
    {num: 19, list: 2, type: "exp", cong: "incong", sent: "The foreign visitor found the entrance had been confusing to her.",                      question: ""},
    {num: 20, list: 2, type: "exp", cong: "cong",   sent: "The frustrated tourists understood that the message would mean they couldn’t go.",       question: ""},
    {num: 20, list: 1, type: "exp", cong: "incong", sent: "The frustrated tourists understood the message would mean they couldn’t go.",            question: ""},
    {num: 21, list: 1, type: "exp", cong: "cong",   sent: "The gossipy neighbor heard that the story had never actually been true." ,               question: ""},
    {num: 21, list: 2, type: "exp", cong: "incong", sent: "The gossipy neighbor heard the story had never actually been true.",                     question: ""},
    {num: 22, list: 1, type: "exp", cong: "cong",   sent: "The journal editor printed that the article had been slanderous to him.",                question: ""},
    {num: 22, list: 2, type: "exp", cong: "incong", sent: "The journal editor printed the article had been slanderous to him.",                     question: ""},
    {num: 23, list: 2, type: "exp", cong: "cong",   sent: "The lab technician proposed that the idea might be worth another try.",                  question: ""},
    {num: 23, list: 1, type: "exp", cong: "incong", sent: "The lab technician proposed the idea might be worth another try.",                       question: ""},
    {num: 24, list: 2, type: "exp", cong: "cong",   sent: "The local publisher printed that the quote hand not been accurately reported.",          question: ""},
    {num: 24, list: 1, type: "exp", cong: "incong", sent: "The local publisher printed the quote hand not been accurately reported.",               question: ""},
    {num: 25, list: 1, type: "exp", cong: "cong",   sent: "The new house-sitter forgot that the key would be under the doormat.",                   question: ""},
    {num: 25, list: 2, type: "exp", cong: "incong", sent: "The new house-sitter forgot the key would be under the doormat.",                        question: ""},
    {num: 26, list: 2, type: "exp", cong: "cong",   sent: "The new mayor advocated that the strategy could be implemented next year.",              question: ""},
    {num: 26, list: 1, type: "exp", cong: "incong", sent: "The new mayor advocated the strategy could be implemented next year.",                   question: ""},
    {num: 27, list: 2, type: "exp", cong: "cong",   sent: "The new owners insured that the vehicle was sound before buying it.",                    question: ""},
    {num: 27, list: 1, type: "exp", cong: "incong", sent: "The new owners insured the vehicle was sound before buying it.",                         question: ""},
    {num: 28, list: 1, type: "exp", cong: "cong",   sent: "The newspaper editor advocated that the truth needed to be made public.",                question: ""},
    {num: 28, list: 2, type: "exp", cong: "incong", sent: "The newspaper editor advocated the truth needed to be made public.",                     question: ""},
    {num: 29, list: 1, type: "exp", cong: "cong",   sent: "The old tenants insured that the house would never get flooded again.",                  question: ""},
    {num: 29, list: 2, type: "exp", cong: "incong", sent: "The old tenants insured the house would never get flooded again.",                       question: ""},
    {num: 30, list: 2, type: "exp", cong: "cong",   sent: "The political group protested that the treaty had been broken many times.",              question: ""},
    {num: 30, list: 1, type: "exp", cong: "incong", sent: "The political group protested the treaty had been broken many times.",                   question: ""},
    {num: 31, list: 1, type: "exp", cong: "cong",   sent: "The popular novelist wrote that the essay would change the voters minds.",               question: ""},
    {num: 31, list: 2, type: "exp", cong: "incong", sent: "The popular novelist wrote the essay would change the voters minds.",                    question: ""},
    {num: 32, list: 2, type: "exp", cong: "cong",   sent: "The primary suspect established that the alibi had been a total lie.",                   question: ""},
    {num: 32, list: 1, type: "exp", cong: "incong", sent: "The primary suspect established the alibi had been a total lie.",                        question: ""},
    {num: 33, list: 2, type: "exp", cong: "cong",   sent: "The school counsellor advised that the student take time off before college.",           question: ""},
    {num: 33, list: 1, type: "exp", cong: "incong", sent: "The school counsellor advised the student take time off before college.",                question: ""},
    {num: 34, list: 1, type: "exp", cong: "cong",   sent: "The scuba diver discovered that the wreck was caused by a collusion.",                   question: ""},
    {num: 34, list: 2, type: "exp", cong: "incong", sent: "The scuba diver discovered the wreck was caused by a collusion.",                        question: ""},
    {num: 35, list: 1, type: "exp", cong: "cong",   sent: "The store manager established that the policy had been a blatant fraud.",                question: ""},
    {num: 35, list: 2, type: "exp", cong: "incong", sent: "The store manager established the policy had been a blatant fraud.",                     question: ""},
    {num: 36, list: 1, type: "exp", cong: "cong",   sent: "The stuttering child repeated that the threat was highly unnecessary and hurtful.",      question: ""},
    {num: 36, list: 2, type: "exp", cong: "incong", sent: "The stuttering child repeated the threat was highly unnecessary and hurtful.",           question: ""},
    {num: 37, list: 1, type: "exp", cong: "cong",   sent: "The surgical nurses protested that the policies were unfair to the patients.",           question: ""},
    {num: 37, list: 2, type: "exp", cong: "incong", sent: "The surgical nurses protested the policies were unfair to the patients.",                question: ""},
    {num: 38, list: 1, type: "exp", cong: "cong",   sent: "The talented photographer accepted that the money could not be spent yet.",              question: ""},
    {num: 38, list: 2, type: "exp", cong: "incong", sent: "The talented photographer accepted the money could not be spent yet.",                   question: ""},
    {num: 39, list: 1, type: "exp", cong: "cong",   sent: "The trained referees warned that the spectators would probably get too rowdy.",          question: ""},
    {num: 39, list: 2, type: "exp", cong: "incong", sent: "The trained referees warned the spectators would probably get too rowdy.",               question: ""},
    {num: 40, list: 2, type: "exp", cong: "cong",   sent: "The two hunters heard that the birds had begun migrating in October.",                   question: ""},
    {num: 40, list: 1, type: "exp", cong: "incong", sent: "The two hunters heard the birds had begun migrating in October.",                        question: ""},
    {num: 41, list: 1, type: "exp", cong: "cong",   sent: "The upset customer asserted that the complaint should be taken very seriously.",         question: ""},
    {num: 41, list: 2, type: "exp", cong: "incong", sent: "The upset customer asserted the complaint should be taken very seriously.",              question: ""},
    {num: 42, list: 1, type: "exp", cong: "cong",   sent: "The wise consumer understood that the label was a very misleading one.",                 question: ""},
    {num: 42, list: 2, type: "exp", cong: "incong", sent: "The wise consumer understood the label was a very misleading one.",                      question: ""}
]

// 29 filler sentences, 10 have questions
const filler_sentences = [
    {num:  1, type: "filler", cong: "cong", sent: "Many of the cheerleaders recalled the strenuous routine from last year’s game.",          question: ""},
    {num:  2, type: "filler", cong: "cong", sent: "The I.R.S. agent demanded the full amount the week following the audit.",                 question: "Did the agent ask for the total payment? "},
    {num:  3, type: "filler", cong: "cong", sent: "The angry mob announced their demands but still refused to negotiate.",                   question: ""},
    {num:  4, type: "filler", cong: "cong", sent: "The attorney for the family disputed the authorities version of what transpired.",        question: ""},
    {num:  5, type: "filler", cong: "cong", sent: "The bargain shopper saw the beautiful and expensive raincoat after the sale was over.",   question: "Was the shopper careless with cash?"},
    {num:  6, type: "filler", cong: "cong", sent: "The bored librarian painted her fingernails after shelving several books.",               question: "Was the librarian very busy?"},
    {num:  7, type: "filler", cong: "cong", sent: "The church workers offered the kids a free bible and some coloring books.",               question: "Did the workers offer them food?" },
    {num:  8, type: "filler", cong: "cong", sent: "The clerk at the records office clarified the confusing statement on the application.",  question: ""},
    {num:  9, type: "filler", cong: "cong", sent: "The curious girl comprehended the answer but asked the question again.",                  question: "Did the girl understand the first time?"},
    {num: 10, type: "filler", cong: "cong", sent: "The exuberant team planned a huge and extravagant party for after the game.",             question: ""},
    {num: 11, type: "filler", cong: "cong", sent: "The flight attendent clarified the instructions when the passengers asked questions.",    question: ""},
    {num: 12, type: "filler", cong: "cong", sent: "The foreign students sat down but couldn’t understand the lecture.",                      question: ""},
    {num: 13, type: "filler", cong: "cong", sent: "The handsome prince offered but his bride’s family declined the fortune.",                question: ""},
    {num: 14, type: "filler", cong: "cong", sent: "The injured man imagined the attack while in the emergency room.",                        question: ""},
    {num: 15, type: "filler", cong: "cong", sent: "The interior decorator hammered away and hung the painting on the wall.",                 question: ""},
    {num: 16, type: "filler", cong: "cong", sent: "The models in the fashion show revealed their stylish tank tops.",                        question: ""},
    {num: 17, type: "filler", cong: "cong", sent: "The mysterious woman divulged her deepest and darkest secrets to the bus driver.",        question: "Did the woman keep quiet during the ride?"},
    {num: 18, type: "filler", cong: "cong", sent: "The nervous teenager lied to the judge to avoid incriminating his friend.",               question: ""},
    {num: 19, type: "filler", cong: "cong", sent: "The new salesman insulted the stranger and she left the store.",                          question: "Was the salesman rude?"},
    {num: 20, type: "filler", cong: "cong", sent: "The office staff raced but there was no clear winner.",                                   question: ""},
    {num: 21, type: "filler", cong: "cong", sent: "The poodle recognized his owner’s scent on the clothing that was discovered.",            question: ""},
    {num: 22, type: "filler", cong: "cong", sent: "The radio newscaster verified the short and exciting report before the broadcast.",       question: "Was the report true?"},
    {num: 23, type: "filler", cong: "cong", sent: "The science teacher verified the unexpected results because she found them implausible.", question: ""},
    {num: 24, type: "filler", cong: "cong", sent: "The teachers assistant divulged the purpose of her colleagues’s absence.",                question: ""},
    {num: 25, type: "filler", cong: "cong", sent: "The temporary assistant saw the memo while rummaging through the files.",                 question: ""},
    {num: 26, type: "filler", cong: "cong", sent: "The tow friend wagered their allowance on who would get the highest test score.",         question: "Did the friends bet on a baseball game?"},
    {num: 27, type: "filler", cong: "cong", sent: "The waitress promised her regulars a free cup of coffee.",                                question: ""},
    {num: 28, type: "filler", cong: "cong", sent: "The wealthy investor regretted the decision once he realized the consequences.",          question: "Was the investor rich?"},
    {num: 29, type: "filler", cong: "cong", sent: "The worried mother determined the explanation for why her son had been avoiding her.",    question: ""}
]


////////////////////////////////////////////////////////////////////////
//                        jsPsych type stimuli                        //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    stimulus: "Fixation Cross",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    trial_duration: prms.fixDur,
    response_ends_trial: false,
    func: drawFixation,
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() {}
};

const iti_filler = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.iti_filler,
    response_ends_trial: false,
    func: function() {}
};

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    let corrCode = dat.key_press === corrKeyNum ? 1 : 2;
    jsPsych.data.addDataToLastTrial({date: Date(), corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}

function drawStroopFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.font_stroop;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}

const stroop_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    choices: prms["respKeysStroop"],
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'),
    trial_duration: prms.tooSlow,
    func: drawStroop,
    func_args: [
        { 
            word: jsPsych.timelineVariable('word'), 
            colour: jsPsych.timelineVariable('colour')
        }
    ],
    data: {
        stim: "SentenceStroop", 
        word: jsPsych.timelineVariable('word'), 
        color: jsPsych.timelineVariable('colour'), 
        comp: jsPsych.timelineVariable('comp'), 
        corrResp: jsPsych.timelineVariable('key')
    },
    on_finish: function() { codeTrial(); }
};

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.fbDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawStroopFeedback
};

const question_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    choices: prms["respKeysQuestion"],
    func: drawQuestion,
    func_args: [ { question: jsPsych.timelineVariable('question'), } ],
    data: {
        stim: "SentenceStroop"
    },
};

const moving_window_text = {
    type: 'text-moving-window-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    sentence: jsPsych.timelineVariable('sentence'),
    word_number: jsPsych.timelineVariable('word_num'),
    font: prms.font_sentence,
    max_width: prms.sentence_width,
    line_height: prms.line_height,
    choices: prms["respKeysSentence"],
    data: {
        stim: "SentenceStroop"
    },
};

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
    on_start: function() {
        $('body').css('cursor', 'default')
    }
}


////////////////////////////////////////////////////////////////////////
//                     Create timeline variables                      //
////////////////////////////////////////////////////////////////////////
function create_sentence_sequence(sentence) {
    const txt = sentence["sent"].split(' ');
    let seq = [];
    for (let i = -1; i < txt.length; i++) {
        seq.push({
            stimulus: "sentence", 
            num: sentence["num"], 
            type: sentence["type"], 
            sentence: sentence["sent"], 
            question: sentence["question"], 
            word_num: i, 
            length: txt.length
        });
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

function create_stroop_items_feedback(nreps) {
    let items = [];
    for (let i = 0; i < nreps; i++) {
        for (let j = 0; j < 18; j++) {
            let tmp = {
                timeline: [stroop_stimulus, trial_feedback],
                timeline_variables: [stroops[j]],
            }
            items.push(tmp);
        }
    }		
    return shuffle(items);
}

function create_stroop_items(nreps) {
    let items = [];
    for (let i = 0; i < nreps; i++) {
        for (let j = 0; j < 18; j++) {
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
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo( prms.fixSize, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0,  prms.fixSize);
    ctx.stroke(); 
}

function drawStroop(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font         = prms.font_stroop;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = args["colour"];
    ctx.fillText(args["word"], 0, 0); 
}

function drawQuestion(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font         = prms.font_question;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "black";
    ctx.fillText(args["question"], 0, 0); 
    ctx.fillText("TRUE (T)      FALSE (F)", 0, 100); 
}

// brute force shuffle and check seems quick enough?
function constrained_shuffle(items) {
    constraints_met = false;
    while (constraints_met == false) {
        console.log("here")
        items = shuffle(items)
        constraints_met = true;
        for (i in items) {
            if (i > 0) {
                if (items[i]["timeline_variables"] && items[i]["timeline_variables"][0]["type"] == "exp" && items[i-1]["timeline_variables"][0]["type"] == "exp") {
                    constraints_met = false;
                    break
                }
            }
        }
    }
    return(items)
}

// only somme of the filler items have questions
function add_filler_questions(items) {
    let final_items = []
    for (i in items) {
        final_items.push(items[i])
        if (items[i].timeline_variables === undefined) {
            continue
        }
        if (items[i]["timeline_variables"][0]["type"] === "filler" && items[i]["timeline_variables"][0]["question"] !== "") {
            const tmp = {
                timeline: [question_stimulus],
                timeline_variables: [
                    { question: items[i]["timeline_variables"][0]["question"] }
                ]
            }
            final_items.push(tmp)
        }
    }
    return final_items
}


////////////////////////////////////////////////////////////////////////
//                     Create required timelines                      //
////////////////////////////////////////////////////////////////////////
// Create items needed for each phase of the experiment

// 1st phase is a short Stroop practice followed by a longer Stroop baseline phase
// The timeline of items are shuffled with the addition of a fixation 
const prac_trials_stroop_timeline = { timeline: add_fix_iti(create_stroop_items_feedback(1)) }
const base_trials_stroop_timeline = { timeline: add_fix_iti(create_stroop_items(8)) }

// 2nd phase is a short practice with the moving window text alone (1 trial)
// just take the first item as the item for the moving window familiarisation routine
const prac_items_sentences         = create_sentence_items(prac_sentences)
const prac_items_sentences1        = add_fix_iti(prac_items_sentences.slice(0, 1))
const prac_trial_sentence_timeline = { timeline: prac_items_sentences1 }

// 3rd phase is short combined stroop + sentence combination
const prac_items_sentences2        = prac_items_sentences.slice(1)
const prac_items_combined          = add_fix_iti(shuffle(prac_items_sentences2.concat(create_stroop_items(1))))
const prac_trial_combined_timeline = { timeline: prac_items_combined }

// 4th phase: Experiment
// list 1 vs. list 2
const exp_sentences_filtered = exp_sentences.filter((obj) => obj.list == 1) 

const exp_items_sentences = create_sentence_items(exp_sentences_filtered)
const exp_items_stroop    = create_stroop_items(7)
const exp_items_fillers   = create_sentence_items(filler_sentences)
const exp_items_all       = add_fix_iti(constrained_shuffle(exp_items_sentences.concat(exp_items_stroop, exp_items_fillers)))
const exp_items           = add_filler_questions(exp_items_all)

const exp_timeline  = { timeline: exp_items }

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen_on);
    exp.push(welcome_en);
    exp.push(resize_de);
    // exp.push(vpInfoForm_en);
    exp.push(task_instructions1);

    // 1st phase (practice stroop + baseline stroop)
    exp.push(task_instructions2);
    exp.push(prac_trials_stroop_timeline)
    exp.push(task_instructions3);
    exp.push(base_trials_stroop_timeline)

    // 2nd phase (1 trial moving window)
    exp.push(task_instructions4);
    exp.push(prac_trial_sentence_timeline)

    // 3rd phase (combined stroop and sentence practice)
    exp.push(task_instructions5);
    exp.push(prac_trial_combined_timeline)

    // 4th phase (Experiment)
    exp.push(task_instructions6);
    exp.push(exp_timeline)

    // end phase
    exp.push(debrief_en);
    exp.push(fullscreen_off);
    
    return exp;

}
EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:canvas_size[0],
        min_height:canvas_size[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "SentenceStroop"}); 
    }
});

