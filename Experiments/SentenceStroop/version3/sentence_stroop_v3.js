// Conceptual replication of Exp1 from Kan et al. (2013)
// To adapt or not to adapt: The question of domain-general cognitive 
// control, Cognition, 129, 637-651
//
// Main finding: difficult to interpret sentences (i.e., high conflict) reduces
// the compatibility effect if a subsequent stroop trial.
//
// Experiment Overview:
// Stroop task with three ink colors (blue, green, yellow) with 6 words (blue, green,
// yellow, brown, orange, red). Colors mapped to three adjacent keys and responded to
// with the index, middle and ring fingers of the dominant hand.
//
// Short sentences that are either sensible (easy to process/understand) or 
// non-sensible (difficult to process/understand). 
// Sentence Examples:
// (a) Eagles can fly.
// (b) Erasers are bloody. 
//
// Experiment Procedure:
// Practice/Training
// Phase 1) 1 practice block of 12 stroop trials + 12 sentences
// Phase 2) 3 experimental blocks of 60 stroop trials + 60 sentences
//
// Trial Procedure:
// 500 ms fixation cross
// Stroop/Sentence stimulus
// 1000 ms blank inter-trial-interval (ITI)
//
// Stimuli remain on screen for 1000 ms. VPs respond with their right-hand to the
// Stroop stimuli using the keys H,J,k and to the sentence materials with their
// left hand (sensible vs. non-sensible judgement) using the keys A, S.

//////////////////////////////////////////////////////////////////////////
////                         Canvas Properties                          //
//////////////////////////////////////////////////////////////////////////
const canvas_colour = "rgba(200, 200, 200, 1)";
const canvas_size   = [1280, 720];
const canvas_border = "0px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum   = genVpNum();
const nFiles  = getNumberOfFiles("/Common/num_files.php", dirName + "data/");

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nBlks: 6,
    fixSize: 10,
    fixWidth: 2,
    fixDur: 500,
    fbDur: 750,
    iti: 1000,
    tooSlow: 3000,
    respKeysSentence: shuffle(["A", "S"]),
    respKeysStroop: shuffle(["J", "K", "L"]),
    respKeys: ["A", "S", "J", "K", "L"],
    fbTxt: ["Correct", "Error"],  
    font_stimulus: "28px monospace",
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
    stimulus: "<h2 style='text-align:center;'>Welcome: Press any key to continue!</h2><br>",
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const cols = ["blue", "green", "yellow"];
const sens = ["sensible", "non-sensible"];

task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Part 1: Practice Color Task</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your dominant hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2><br>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>"
};

task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Part 2: Color Task</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your dominant hand</H2><br>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2><br>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>"
};


task_instructions4 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Part 3: Practice Block</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your right hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond to the sentence (sensible/non-sensible) with your left hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index and middle fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'A' key = " + sens[prms.respKeysSentence.indexOf("A")] + "&emsp; 'S' key = " + sens[prms.respKeysSentence.indexOf("S")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>",
};


task_instructions5 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Part 4: Real Block</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your right hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond to the sentence (sensible/non-sensible) with your left hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index and middle fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'A' key = " + sens[prms.respKeysSentence.indexOf("A")] + "&emsp; 'S' key = " + sens[prms.respKeysSentence.indexOf("S")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>",
};

task_reminder = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Task Reminder</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your right hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond to the sentence (sensible/non-sensible) with your left hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index and middle fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'A' key = " + sens[prms.respKeysSentence.indexOf("A")] + "&emsp; 'S' key = " + sens[prms.respKeysSentence.indexOf("S")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>",
};


////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
// Stroop Stimuli consist of the words blue, green, yellow, brown, orange and red
//  paired with the colours blue, green, yellow to create compatible and incomaptibel trials
//  NB: as indicated in the Kan paper, this is conflict at the stimulus level (i.e., the
//  irrelevant dimension does not indicate an alternative response)
const stroops = [
    { type: "stroop", text: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0] },
    { type: "stroop", text: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1] },
    { type: "stroop", text: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2] },
    { type: "stroop", text: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0] },
    { type: "stroop", text: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1] },
    { type: "stroop", text: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2] },
    { type: "stroop", text: "blue",   colour: "green",  cong: "incong", key:prms.respKeysStroop[1] },
    { type: "stroop", text: "green",  colour: "yellow", cong: "incong", key:prms.respKeysStroop[2] },
    { type: "stroop", text: "yellow", colour: "blue",   cong: "incong", key:prms.respKeysStroop[0] },
    { type: "stroop", text: "blue",   colour: "yellow", cong: "incong", key:prms.respKeysStroop[2] },
    { type: "stroop", text: "green",  colour: "blue",   cong: "incong", key:prms.respKeysStroop[0] },
    { type: "stroop", text: "yellow", colour: "green",  cong: "incong", key:prms.respKeysStroop[1] },
]

const sentence_materials_cong = shuffle([
    { type: "sentence", text: "Eagles can fly.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", text: "Monkeys can climb.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },   
    { type: "sentence", text: "Academics are educated.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Eyes can see.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Babies drink milk.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Bacteria are tiny.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Trees produce oxygen.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Trees have leaves.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Funerals are sad.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Mountains are high.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Libraries have books.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Bees can sting.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Blood is red.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", text: "Chilies are hot.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "China is big.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Christians are religious.",   colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Germans drink beer.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Diamonds are expensive.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Thieves are criminals.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Dictators are dangerous.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Dinosaurs are extinct.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Drugs are addictive.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Donkeys are gray.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Fire is hot.",                colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", text: "Fish can swim.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", text: "Flamingos are pink.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Freedom is important.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Poison can kill.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Grass is green.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Cucumbers are green.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Sharks are dangerous.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Rabbits run fast.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Wood is brown.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Dogs eat meat.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "I-Phones are expensive.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Starbucks sells coffee.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Cats eat mice.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Children are young.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Cherries are red.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Pillows are comfortable.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Comedians are funny.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Kings are noble.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Continents are big.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Cows produce milk.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Lambs are young.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Lavender smells good.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Lights are bright.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Lions are dangerous.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Limes are sour.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Corn is yellow.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Marmalade is sweet.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Measles are infectious.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Mice are gray.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Mercedes builds cars.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Milk is white.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Millionaires are rich.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Mozart was talented.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Mothers have children.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Netflix shows films.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Nuns are female.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Emergencies are urgent.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Obama was president.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Ears can hear.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Uncles are male.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Optimists are cheerful.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Juice is sweet.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Pandas eat bamboo.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Paper is white.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Pasta is Italian.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Picasso was creative.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Pilots control planes.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Policemen hunt criminals.",   colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Fries are fried.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Rain is wet.",                colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Cars are fast.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Giants are huge.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Singers can sing.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Ships can sink.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Athletes are fit.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Sprinters are fast.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Straw is dry.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Sushi is Japanese.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Trump is president.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Kennedy was president.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Accidents are dangerous.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Fathers have children.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Vivaldi was gifted.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Trust is important.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Viruses are dangerous.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Birds eat worms.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "VW builds cars.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Orphans are parentless.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Wasps can sting.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Deserts are dry.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Zebras are striped.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", text: "Sugar is sweet.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
])

const sentence_materials_incong = shuffle([
    { type: "sentence", text: "Erasers are bloody.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Crises are cheap.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Wine is serious.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Champagne is urgent.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cables are charming.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Newspapers are delicate.",    colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "People are manual.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Mallorca is energetic.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Spain is tricky.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Geese are grotty.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Storks are hysterical.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Treasures are impotent.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Romans are light.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Chaots are circular.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Stones are wooden.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Fleas are legible.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Wasps are correct.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Puppies are dishonest.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Sinners are short.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Grid is motherly.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Hills are naked.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Songs are elongated.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Venice is light.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Zeus is green.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Tigers are new.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Bags are newborn.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Tulips are nuclear.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Squirrels are online.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Gates are tired.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Women are blanket.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Men are operational.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Stinginess is precise.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Pepper is square.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Marzipan is religious.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cake is respectful.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cough is loyal.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Torches are shy.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Nuts are sour.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Bowls are proud.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Buckets are limp.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Pianists are moldy.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Funnels are civil.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] },
    { type: "sentence", text: "Plums are loyal.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Heaters are bad.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Noise is pregnant.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Pantsuits are tropical.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Babies are old.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Pain is great.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Ravens are colorful.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Skiers are fat.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Balls are angular.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Sand is sweet.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Deserts are wet.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Stones are fluffy.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cookies are liquid.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Eggs are frozen.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Bananas are straight.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Ladybirds are striped.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cigarettes are healthy.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Sweat is green.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Ice is hot.",                 colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Paprika is toxic.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Mothers are male.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Swans are red.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Dice are round.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Boxes are round.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Strawberries are salty.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Bananas are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cookies are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Strawberries are spicy.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Snails are fast.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Oranges are black.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Speakers are stupid.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Attendees are dead.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Newborns are married.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cardinals are female.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Marble is soft.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Olives are white.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Exams are relaxing.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Whales are wooly.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Chocolate is disgusting.",    colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Fleas are big.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Beggars are rich.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Stars are green.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Lambs are colorful.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Princesses are brutal.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Carrots are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Spoons are sharp.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Steam is dry.",               colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Elephants are tiny.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Fire is cold.",               colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Atheists are religious.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Computers are wet.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Vegetables are unhealthy.",   colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Cellars are bright.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", text: "Giraffes are small.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }
])

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

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "",
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt({stim: "SentenceStroop"});
    },
};

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
    let rt = (dat.rt !== null) ? dat.rt : prms.tooSlow 
    let corrCode = dat.key_press === corrKeyNum ? 1 : 2;

    jsPsych.data.addDataToLastTrial({date: Date(), rt: rt, corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }

}

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.font_stimulus;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}

const stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    choices: prms["respKeys"],
    trial_duration: prms.tooSlow,
    func: drawStimulus,
    func_args: [
        { 
            text: jsPsych.timelineVariable('text'), 
            colour: jsPsych.timelineVariable('colour')
        }
    ],
    data: {
        stim: "SentenceStroop", 
        type: jsPsych.timelineVariable("type"), 
        text: jsPsych.timelineVariable("text"), 
        color: jsPsych.timelineVariable('colour'), 
        cong: jsPsych.timelineVariable('cong'), 
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
    func: drawFeedback
};

////////////////////////////////////////////////////////////////////////
//                      Amazon Turk Random Code                       //
////////////////////////////////////////////////////////////////////////
const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus: "<h3 style='text-align: left;'>This is your participation code:</h3>" +
              randomString +
              "<h3 style='text-align: left;'>This is your participation code:</h3>" +
              "<h3 style='text-align: left;'>Please copy the code and return to the MTurk page.</h3>" +
              "<h3 style='text-align: left;'>Press the spacebar to end the experiment.</h3>" 
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

function drawStimulus(args) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.font         = prms.font_stimulus
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = args["colour"];
    ctx.fillText(args["text"], 0, 0); 
}

////////////////////////////////////////////////////////////////////////
//                     Create timeline variables                      //
////////////////////////////////////////////////////////////////////////

// 1st phase is a short Stroop practice followed by a longer Stroop baseline phase
const prac_trials_stroop_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: stroops,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const base_trials_stroop_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        iti
    ],
    timeline_variables: stroops,
    sample: {
        type: "fixed-repetitions",
        size: 12 
    }
};

// Combined sentence and stroop trials
// split materials into 1 practice block + 3 experimental blocks
// Combined practice block
const prac_comb = shuffle(stroops.concat(sentence_materials_cong.splice(0, 6).concat(sentence_materials_incong.splice(0, 6))))

// Three experimental blocks
const stroop_materials = stroops.concat(stroops, stroops, stroops, stroops)

const exp_block1 = shuffle(stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30))))
const exp_block2 = shuffle(stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30))))
const exp_block3 = shuffle(stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30))))

const prac_comb_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: prac_comb,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const exp_block1_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        iti
    ],
    timeline_variables: exp_block1,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const exp_block2_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        iti
    ],
    timeline_variables: exp_block2,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const exp_block3_timeline = {
    timeline: [
        fixation_cross,
        stimulus,
        iti
    ],
    timeline_variables: exp_block3,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen_on);
    exp.push(welcome_en);
    exp.push(resize_en);
    exp.push(vpInfoForm_en);
    exp.push(hideMouseCursor);
    exp.push(screenInfo);

    // start of experiment
    exp.push(task_instructions1);

    // practice stroop block
    exp.push(task_instructions2);
    exp.push(prac_trials_stroop_timeline)
    exp.push(block_feedback);  

    // baseline stroop block
    exp.push(task_instructions3);
    exp.push(base_trials_stroop_timeline)
    exp.push(block_feedback);  
   
    // practice block combined
    exp.push(task_instructions4);
    exp.push(prac_comb_timeline) 
    exp.push(block_feedback);  

    // 3 experimental blocks
    exp.push(task_instructions5);
    exp.push(exp_block1_timeline) 
    exp.push(block_feedback);  
    
    exp.push(exp_block2_timeline) 
    exp.push(block_feedback);  
    
    exp.push(exp_block3_timeline) 
    exp.push(block_feedback);  

    // end phase
    exp.push(debrief_en);
    exp.push(showMouseCursor);
    exp.push(alphaNum);
    exp.push(fullscreen_off);
    
    return exp;

}
EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + vpNum;
const code_filename = dirName + "code/" + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:canvas_size[0],
        min_height:canvas_size[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", data_filename, {stim: "SentenceStroop"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});

