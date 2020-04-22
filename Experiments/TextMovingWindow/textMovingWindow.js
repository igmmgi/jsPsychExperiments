function drawFixation() {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 5;
    ctx.moveTo(-25, 0);
    ctx.lineTo( 25, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -25);
    ctx.lineTo(0,  25);
    ctx.stroke(); 
}

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    stimulus: "Fixation Cross",
    trial_duration: 1000,
    translate_origin: true,
    canvas_colour: "grey",
    canvas_border: "10px solid black",
    func: drawFixation
};

const text = {
    type: 'text-moving-window-keyboard-response',
    sentence: jsPsych.timelineVariable('sentence'),
    word_number: jsPsych.timelineVariable('word_num'),
    canvas_colour: "grey",
    canvas_border: "10px solid black",
};

const create_sentence = function(sentence) {
    const txt = sentence.split(' ');
    let t = [];
    for (var i = -1; i < txt.length; i++) {
        t.push({sentence: sentence, word_num: i});
    }
    return t;
}

const practise_sentences = shuffle([
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
])

const practice_items = []
for (let i = 0; i < practise_sentences.length; i++) {
    const tmp = {
        timeline: [text],
        timeline_variables: create_sentence(practise_sentences[i]),
        randomize_order:false
    }
    practice_items.push(fixation_cross);
    practice_items.push(tmp);
}

const practice_trials = {
    timeline: practice_items, 
}

const exp_sentences = shuffle([ 
    "The tourists understood the message would mean they couldn’t go.",
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
    "The science teacher verified the unexpected results because she found the implausible.",
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
])

const exp_items = []
for (let i = 0; i < exp_sentences.length; i++) {
    const tmp = {
        timeline: [text],
        timeline_variables: create_sentence(exp_sentences[i]),
        randomize_order:false
    }
    practice_items.push(fixation_cross);
    practice_items.push(tmp);
}

const exp_trials = {
    timeline: exp_items, 
}

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(practice_trials);
    exp.push(exp_trials);
    return exp;

}
EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
});

