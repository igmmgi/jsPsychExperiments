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
const canvas_size   = [960, 720];
const canvas_border = "5px solid black";

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
    nBlks: 4,
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
    font_stimulus: "30px monospace",
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
    stimulus: "<H1 style='text-align:center;'>Part 1: Practice Block</H1><br>" +
              "<H2 style='text-align:center;'>Respond to the color of the font with your right hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index, middle, and ring-fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'J' key = " + cols[prms.respKeysStroop.indexOf("J")] + "&emsp; 'K' key = " + cols[prms.respKeysStroop.indexOf("K")] + "&emsp; 'L' key = " + cols[prms.respKeysStroop.indexOf("L")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond to the sentence (sensible/non-sensible) with your left hand.</H2>" +
              "<H2 style='text-align:center;'>Use your index and middle fingers (one per key).</H2><br>" +
              "<H2 style='text-align:center;'>'A' key = " + sens[prms.respKeysSentence.indexOf("A")] + "&emsp; 'S' key = " + sens[prms.respKeysSentence.indexOf("S")] + "</H2><br>" +
              "<H2 style='text-align:center;'>Respond as quickly and accurately as possible!</H2>" +
              "<h2 style='text-align:center;'>Press any key to continue!</h2>",
};


task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<H1 style='text-align:center;'>Part 2: Real Block</H1><br>" +
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
    { type: "stroop", word: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0] },
    { type: "stroop", word: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1] },
    { type: "stroop", word: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2] },
    { type: "stroop", word: "blue",   colour: "blue",   cong: "cong",   key:prms.respKeysStroop[0] },
    { type: "stroop", word: "green",  colour: "green",  cong: "cong",   key:prms.respKeysStroop[1] },
    { type: "stroop", word: "yellow", colour: "yellow", cong: "cong",   key:prms.respKeysStroop[2] },
    { type: "stroop", word: "blue",   colour: "green",  cong: "incong", key:prms.respKeysStroop[1] },
    { type: "stroop", word: "green",  colour: "yellow", cong: "incong", key:prms.respKeysStroop[2] },
    { type: "stroop", word: "yellow", colour: "blue",   cong: "incong", key:prms.respKeysStroop[0] },
    { type: "stroop", word: "blue",   colour: "yellow", cong: "incong", key:prms.respKeysStroop[2] },
    { type: "stroop", word: "green",  colour: "blue",   cong: "incong", key:prms.respKeysStroop[0] },
    { type: "stroop", word: "yellow", colour: "green",  cong: "incong", key:prms.respKeysStroop[1] },
]

let sentence_materials_cong = [
    { type: "sentence", word: "Eagles can fly.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", word: "Monkeys can climb.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },   
    { type: "sentence", word: "Academics are educated.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Eyes can see.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Babies drink milk.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Bacteria are tiny.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Trees produce oxygen.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Trees have leaves.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Funerals are sad.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Mountains are high.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Libraries have books.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Bees can sting.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Blood is red.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", word: "Chilies are hot.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "China is big.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Christians are religious.",   colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Germans drink beer.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Diamonds are expensive.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Thieves are criminals.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Dictators are dangerous.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Dinosaurs are extinct.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Drugs are addictive.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Donkeys are gray.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Fire is hot.",                colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", word: "Fish can swim.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
    { type: "sentence", word: "Flamingos are pink.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Freedom is important.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Poison can kill.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Grass is green.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Cucumbers are green.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Sharks are dangerous.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Rabbits run fast.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Wood is brown.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Dogs eat meat.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "I-Phones are expensive.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Starbucks sells coffee.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Cats eat mice.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Children are young.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Cherries are red.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Pillows are comfortable.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Comedians are funny.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Kings are noble.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Continents are big.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Cows produce milk.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Lambs are young.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Lavender smells good.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Lights are bright.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Lions are dangerous.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Limes are sour.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Corn is yellow.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Marmalade is sweet.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Measles are infectious.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Mice are gray.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Mercedes builds cars.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Milk is white.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Millionaires are rich.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Mozart was talented.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Mothers have children.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Netflix shows films.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Nuns are female.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Emergencies are urgent.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Obama was president.",        colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Ears can hear.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Uncles are male.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Optimists are cheerful.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Juice is sweet.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Pandas eat bamboo.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Paper is white.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Pasta is Italian.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Picasso was creative.",       colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Pilots control planes.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Policemen hunt criminals.",   colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Fries are fried.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Rain is wet.",                colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Cars are fast.",              colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Giants are huge.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Singers can sing.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Ships can sink.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Athletes are fit.",           colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Sprinters are fast.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Straw is dry.",               colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Sushi is Japanese.",          colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Trump is president.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Kennedy was president.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Accidents are dangerous.",    colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Fathers have children.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Vivaldi was gifted.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Trust is important.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Viruses are dangerous.",      colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Birds eat worms.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "VW builds cars.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Orphans are parentless.",     colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Wasps can sting.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Deserts are dry.",            colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Zebras are striped.",         colour: "black", cong: "cong",   key: prms.respKeysSentence[0] }, 
    { type: "sentence", word: "Sugar is sweet.",             colour: "black", cong: "cong",   key: prms.respKeysSentence[0] },
]
sentence_materials_cong = shuffle(sentence_materials_cong)

let sentence_materials_incong = [
    { type: "sentence", word: "Erasers are bloody.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Crises are cheap.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Wine is serious.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Champagne is urgent.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cables are charming.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Newspapers are delicate.",    colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "People are manual.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Mallorca is energetic.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Spain is tricky.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Geese are grotty.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Storks are hysterical.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Treasures are impotent.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Romans are light.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Chaots are circular.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Stones are wooden.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Fleas are legible.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Wasps are correct.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Puppies are dishonest.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Sinners are short.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Grid is motherly.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Hills are naked.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Songs are elongated.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Venice is light.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Zeus is green.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Tigers are new.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Bags are newborn.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Tulips are nuclear.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Squirrels are online.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Gates are tired.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Women are blanket.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Men are operational.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Stinginess is precise.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Pepper is square.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Marzipan is religious.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cake is respectful.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cough is loyal.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Torches are shy.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Nuts are sour.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Bowls are proud.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Buckets are limp.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Pianists are moldy.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Funnels are civil.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] },
    { type: "sentence", word: "Plums are loyal.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Heaters are bad.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Noise is pregnant.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Pantsuits are tropical.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Babies are old.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Pain is great.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Ravens are colorful.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Skiers are fat.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Balls are angular.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Sand is sweet.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Deserts are wet.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Stones are fluffy.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cookies are liquid.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Eggs are frozen.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Bananas are straight.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Ladybirds are striped.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cigarettes are healthy.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Sweat is green.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Ice is hot.",                 colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Paprika is toxic.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Mothers are male.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Swans are red.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Dice are round.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Boxes are round.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Strawberries are salty.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Bananas are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cookies are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Strawberries are spicy.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Snails are fast.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Oranges are black.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Speakers are stupid.",        colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Attendees are dead.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Newborns are married.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cardinals are female.",       colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Marble is soft.",             colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Olives are white.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Exams are relaxing.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Whales are wooly.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Chocolate is disgusting.",    colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Fleas are big.",              colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Beggars are rich.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Stars are green.",            colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Lambs are colorful.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Princesses are brutal.",      colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Carrots are sour.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Spoons are sharp.",           colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Steam is dry.",               colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Elephants are tiny.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Fire is cold.",               colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Atheists are religious.",     colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Computers are wet.",          colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Vegetables are unhealthy.",   colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Cellars are bright.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }, 
    { type: "sentence", word: "Giraffes are small.",         colour: "black", cong: "incong", key: prms.respKeysSentence[1] }
]
sentence_materials_incong = shuffle(sentence_materials_incong)

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
    let corrCode = dat.key_press === corrKeyNum ? 1 : 2;
    jsPsych.data.addDataToLastTrial({date: Date(), corrCode: corrCode, trialNum: prms.cTrl});
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
    word: jsPsych.timelineVariable('word'), 
    colour: jsPsych.timelineVariable('colour'),
    trial_duration: prms.tooSlow,
    func: drawStimulus,
    func_args: [
        { 
            word: jsPsych.timelineVariable('word'), 
            colour: jsPsych.timelineVariable('colour')
        }
    ],
    data: {
        stim: "SentenceStroop", 
        type: jsPsych.timelineVariable("type"), 
        sentence: jsPsych.timelineVariable("word"), 
        word: jsPsych.timelineVariable('word'), 
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
    ctx.fillText(args["word"], 0, 0); 
}

////////////////////////////////////////////////////////////////////////
//                     Create timeline variables                      //
////////////////////////////////////////////////////////////////////////
// split materials into 1 practice block + 3 experimental blocks
let materials1 = stroops.concat(sentence_materials_cong.splice(0, 6).concat(sentence_materials_incong.splice(0, 6)))
materials1 = shuffle(materials1)

let stroop_materials = stroops.concat(stroops, stroops, stroops, stroops)
let materials2 = stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30)))
materials2 = shuffle(materials2)

let materials3 = stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30)))
materials3 = shuffle(materials3)

let materials4 = stroop_materials.concat(sentence_materials_cong.splice(0, 30).concat(sentence_materials_incong.splice(0, 30)))
materials4 = shuffle(materials4)

const trial_timeline1 = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: materials1,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const trial_timeline2 = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: materials2,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const trial_timeline3 = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: materials3,
    sample: {
        type: "fixed-repetitions",
        size: 1
    }
};

const trial_timeline4 = {
    timeline: [
        fixation_cross,
        stimulus,
        trial_feedback,
        iti
    ],
    timeline_variables: materials4,
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
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    exp.push(trial_timeline1);
    exp.push(block_feedback);  // show previous block performance 
    exp.push(task_reminder);   // show response mapping 
    exp.push(trial_timeline2);
    exp.push(block_feedback);  // show previous block performance 
    exp.push(task_reminder);   // show response mapping 
    exp.push(trial_timeline3);
    exp.push(block_feedback);  // show previous block performance 
    exp.push(task_reminder);   // show response mapping 
    exp.push(trial_timeline4);

    // end phase
    exp.push(debrief_en);
    exp.push(alphaNum);
    exp.push(showMouseCursor);
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

