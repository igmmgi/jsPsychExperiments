// ButtonNegation:

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [960, 720];
const canvas_border = '0px solid black';

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 8, // number of trials in first block (practice)
    nTrlsE: 50, // number of trials in subsequent blocks
    nBlks: 5,
    fixDur: 750,
    fbDur: 1000,
    iti: 500,
    tooFast: 150,
    tooSlow: 3000,
    fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
    cTrl: 1, // count trials
    cBlk: 1, // count blocks
    fixWidth: 3,
    fixSize: 15,
    wordSize: '30px monospace',
    fbSize: '30px monospace',
    respKeys: ['D', 'K'],
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
        "<h2 style='text-align:left;'>Liebe Teilnehmer/innen,</h2><br>" +
        "<h2 style='text-align:left;'>bitte nehmen Sie nur teil, wenn Sie mindestens 18 Jahre alt </h2>" +
        "<h2 style='text-align:left;'>sind und Deutsch auf Muttersprachenniveau beherrschen. </h2><br>" +
        "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus:
        "<h3 style='text-align: left;'> Liebe/r Teilnehmer/in, in unserer Studie sehen Sie in jedem Durchgang entweder</h3>" +
        "<h3 style='text-align: left;'> ein richtiges Wort, oder ein Wort, das es gar nicht gibt im Deutschen. Ihre</h3>" +
        "<h3 style='text-align: left;'> Aufgabe ist es zu entscheiden, ob es sich um ein richtiges Wort handelt oder</h3>" +
        "<h3 style='text-align: left;'> nicht indem Sie entweder die Taste D (linker Zeigefinger) oder die Taste K</h3>" +
        "<h3 style='text-align: left;'> (rechter Zeigefinger) drücken. Unter dem Wort sehen Sie immer zwei Kreise, die</h3>" +
        "<h3 style='text-align: left;'> zeigen, ob links oder rechts für die JA oder NEIN gedrückt werden muss. Bitte</h3>" +
        "<h3 style='text-align: left;'> reagieren Sie so schnell und korrekt wie möglich. Das Experiment beginnt mit</h3>" +
        "<h3 style='text-align: left;'> einem Übungsblock. Vielen Dank für's Mitmachen! Weiter geht es mit der</h3>" +
        "<h3 style='text-align: left;'> Leertaste.</h3>",
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// 4 image files
const imgFiles = [
    'images/1JA_left_green.png',
    'images/1JA_left_red.png',
    'images/1NEIN_left_green.png',
    'images/1NEIN_left_red.png',
];
const imgs = loadImages(imgFiles);

// practice items
// 8 real words and 8 nonwords
const imgNumWordsPractice = shuffle(new Array(2).fill([0, 1, 2, 3]).flat());
const imgNumNonWordsPractice = shuffle(new Array(2).fill([0, 1, 2, 3]).flat());

// prettier-ignore
const words_practice = [
    { id: 1, word: 'Optimismus', isWord: true, imgNum: imgNumWordsPractice[0] },
    { id: 2, word: 'Wurf', isWord: true, imgNum: imgNumWordsPractice[1] },
    { id: 3, word: 'Panama', isWord: true, imgNum: imgNumWordsPractice[2] },
    { id: 4, word: 'Milch', isWord: true, imgNum: imgNumWordsPractice[3] },
    { id: 5, word: 'Fisch', isWord: true, imgNum: imgNumWordsPractice[4] },
    { id: 6, word: 'Krippe', isWord: true, imgNum: imgNumWordsPractice[5] },
    { id: 7, word: 'Brett', isWord: true, imgNum: imgNumWordsPractice[6] },
    { id: 8, word: 'Ziegel', isWord: true, imgNum: imgNumWordsPractice[7] },
];

// prettier-ignore
const nonwords_practice = [
    { id: 9, word: 'Zonko', isWord: false, imgNum: imgNumWordsPractice[0] },
    { id: 10, word: 'Balpim', isWord: false, imgNum: imgNumWordsPractice[1] },
    { id: 11, word: 'Kobldar', isWord: false, imgNum: imgNumWordsPractice[2] },
    { id: 12, word: 'Fipusel', isWord: false, imgNum: imgNumWordsPractice[3] },
    { id: 13, word: 'Molaki', isWord: false, imgNum: imgNumWordsPractice[4] },
    { id: 14, word: 'Papusel', isWord: false, imgNum: imgNumWordsPractice[5] },
    { id: 15, word: 'Worip', isWord: false, imgNum: imgNumWordsPractice[6] },
    { id: 16, word: 'Oligappus', isWord: false, imgNum: imgNumWordsPractice[7] },
];

// assign correct responses
for (let i = 0; i < words_practice.length; i++) {
    if (words_practice[i].imgNum === 0) {
        words_practice[i].imgName = imgFiles[0].slice(7, -4);
        words_practice[i].corrResp = prms.respKeys[0];
        words_practice[i].respSide = 'left';
        words_practice[i].respColour = 'green';
    } else if (words_practice[i].imgNum === 1) {
        words_practice[i].imgName = imgFiles[1].slice(7, -4);
        words_practice[i].corrResp = prms.respKeys[0];
        words_practice[i].respSide = 'left';
        words_practice[i].respColour = 'red';
    } else if (words_practice[i].imgNum === 2) {
        words_practice[i].imgName = imgFiles[2].slice(7, -4);
        words_practice[i].corrResp = prms.respKeys[1];
        words_practice[i].respSide = 'right';
        words_practice[i].respColour = 'red';
    } else if (words_practice[i].imgNum === 3) {
        words_practice[i].imgName = imgFiles[3].slice(7, -4);
        words_practice[i].corrResp = prms.respKeys[1];
        words_practice[i].respSide = 'right';
        words_practice[i].respColour = 'green';
    }
}

for (let i = 0; i < nonwords_practice.length; i++) {
    if (nonwords_practice[i].imgNum === 0) {
        nonwords_practice[i].imgName = imgFiles[0].slice(7, -4);
        nonwords_practice[i].corrResp = prms.respKeys[1];
        nonwords_practice[i].respSide = 'right';
        nonwords_practice[i].respColour = 'red';
    } else if (nonwords_practice[i].imgNum === 1) {
        nonwords_practice[i].imgName = imgFiles[1].slice(7, -4);
        nonwords_practice[i].corrResp = prms.respKeys[1];
        nonwords_practice[i].respSide = 'right';
        nonwords_practice[i].respColour = 'green';
    } else if (nonwords_practice[i].imgNum === 2) {
        nonwords_practice[i].imgName = imgFiles[2].slice(7, -4);
        nonwords_practice[i].corrResp = prms.respKeys[0];
        nonwords_practice[i].respSide = 'left';
        nonwords_practice[i].respColour = 'green';
    } else if (nonwords_practice[i].imgNum === 3) {
        nonwords_practice[i].imgName = imgFiles[3].slice(7, -4);
        nonwords_practice[i].corrResp = prms.respKeys[0];
        nonwords_practice[i].respSide = 'left';
        nonwords_practice[i].respColour = 'red';
    }
}

let materials_practice = shuffle(words_practice.concat(nonwords_practice));

// experimental items
// 100 real words and 100 nonwords
const imgNumWords = shuffle(new Array(25).fill([0, 1, 2, 3]).flat());
const imgNumNonWords = shuffle(new Array(25).fill([0, 1, 2, 3]).flat());

const words = [
    { id: 1, word: 'Besteck', isWord: true, imgNum: imgNumWords[0] },
    { id: 2, word: 'Ballon', isWord: true, imgNum: imgNumWords[1] },
    { id: 3, word: 'Haselnuss', isWord: true, imgNum: imgNumWords[2] },
    { id: 4, word: 'Erfolg', isWord: true, imgNum: imgNumWords[3] },
    { id: 5, word: 'Macht', isWord: true, imgNum: imgNumWords[4] },
    { id: 6, word: 'Weihnachten', isWord: true, imgNum: imgNumWords[5] },
    { id: 7, word: 'Jahreszeit', isWord: true, imgNum: imgNumWords[6] },
    { id: 8, word: 'Ziege', isWord: true, imgNum: imgNumWords[7] },
    { id: 9, word: 'Datum', isWord: true, imgNum: imgNumWords[8] },
    { id: 10, word: 'Poesie', isWord: true, imgNum: imgNumWords[9] },
    { id: 11, word: 'Mandel', isWord: true, imgNum: imgNumWords[10] },
    { id: 12, word: 'Nase', isWord: true, imgNum: imgNumWords[11] },
    { id: 13, word: 'Praktikant', isWord: true, imgNum: imgNumWords[12] },
    { id: 14, word: 'Pause', isWord: true, imgNum: imgNumWords[13] },
    { id: 15, word: 'Propaganda', isWord: true, imgNum: imgNumWords[14] },
    { id: 16, word: 'Gramm', isWord: true, imgNum: imgNumWords[15] },
    { id: 17, word: 'Verwaltung', isWord: true, imgNum: imgNumWords[16] },
    { id: 18, word: 'Rachen', isWord: true, imgNum: imgNumWords[17] },
    { id: 19, word: 'Streik', isWord: true, imgNum: imgNumWords[18] },
    { id: 20, word: 'Leder', isWord: true, imgNum: imgNumWords[19] },
    { id: 21, word: 'Leuchtturm', isWord: true, imgNum: imgNumWords[20] },
    { id: 22, word: 'Rakete', isWord: true, imgNum: imgNumWords[21] },
    { id: 23, word: 'Telefon', isWord: true, imgNum: imgNumWords[22] },
    { id: 24, word: 'Transport', isWord: true, imgNum: imgNumWords[23] },
    { id: 25, word: 'Abstimmung', isWord: true, imgNum: imgNumWords[24] },
    { id: 26, word: 'Operation', isWord: true, imgNum: imgNumWords[25] },
    { id: 27, word: 'Gitarre', isWord: true, imgNum: imgNumWords[26] },
    { id: 28, word: 'Apfel', isWord: true, imgNum: imgNumWords[27] },
    { id: 29, word: 'Predigt', isWord: true, imgNum: imgNumWords[28] },
    { id: 30, word: 'Analyse', isWord: true, imgNum: imgNumWords[29] },
    { id: 31, word: 'Direktor', isWord: true, imgNum: imgNumWords[30] },
    { id: 32, word: 'Mittag', isWord: true, imgNum: imgNumWords[31] },
    { id: 33, word: 'Problem', isWord: true, imgNum: imgNumWords[32] },
    { id: 34, word: 'Loyalität', isWord: true, imgNum: imgNumWords[33] },
    { id: 35, word: 'Sport', isWord: true, imgNum: imgNumWords[34] },
    { id: 36, word: 'Wohnung', isWord: true, imgNum: imgNumWords[35] },
    { id: 37, word: 'Hochzeit', isWord: true, imgNum: imgNumWords[36] },
    { id: 38, word: 'Polizei', isWord: true, imgNum: imgNumWords[37] },
    { id: 39, word: 'Zeitung', isWord: true, imgNum: imgNumWords[38] },
    { id: 40, word: 'Handlung', isWord: true, imgNum: imgNumWords[39] },
    { id: 41, word: 'Schmuck', isWord: true, imgNum: imgNumWords[40] },
    { id: 42, word: 'Amerika', isWord: true, imgNum: imgNumWords[41] },
    { id: 43, word: 'Verteidigung', isWord: true, imgNum: imgNumWords[42] },
    { id: 44, word: 'Kopf', isWord: true, imgNum: imgNumWords[43] },
    { id: 45, word: 'Finnland', isWord: true, imgNum: imgNumWords[44] },
    { id: 46, word: 'Freundschaft', isWord: true, imgNum: imgNumWords[45] },
    { id: 47, word: 'Himmel', isWord: true, imgNum: imgNumWords[46] },
    { id: 48, word: 'Nuss', isWord: true, imgNum: imgNumWords[47] },
    { id: 49, word: 'Sessel', isWord: true, imgNum: imgNumWords[48] },
    { id: 50, word: 'Falle', isWord: true, imgNum: imgNumWords[49] },
    { id: 51, word: 'Wanderung', isWord: true, imgNum: imgNumWords[50] },
    { id: 52, word: 'Museum', isWord: true, imgNum: imgNumWords[51] },
    { id: 53, word: 'Oktober', isWord: true, imgNum: imgNumWords[52] },
    { id: 54, word: 'Hose', isWord: true, imgNum: imgNumWords[53] },
    { id: 55, word: 'Planet', isWord: true, imgNum: imgNumWords[54] },
    { id: 56, word: 'Schwimmbad', isWord: true, imgNum: imgNumWords[55] },
    { id: 57, word: 'Sommer', isWord: true, imgNum: imgNumWords[56] },
    { id: 58, word: 'Floh', isWord: true, imgNum: imgNumWords[57] },
    { id: 59, word: 'Stadt', isWord: true, imgNum: imgNumWords[58] },
    { id: 60, word: 'Kerze', isWord: true, imgNum: imgNumWords[59] },
    { id: 61, word: 'Anfang', isWord: true, imgNum: imgNumWords[60] },
    { id: 62, word: 'Insel', isWord: true, imgNum: imgNumWords[61] },
    { id: 63, word: 'Bein', isWord: true, imgNum: imgNumWords[62] },
    { id: 64, word: 'Batterie', isWord: true, imgNum: imgNumWords[63] },
    { id: 65, word: 'Haus', isWord: true, imgNum: imgNumWords[64] },
    { id: 66, word: 'Stuhl', isWord: true, imgNum: imgNumWords[65] },
    { id: 67, word: 'Brief', isWord: true, imgNum: imgNumWords[66] },
    { id: 68, word: 'Turm', isWord: true, imgNum: imgNumWords[67] },
    { id: 69, word: 'Nonne', isWord: true, imgNum: imgNumWords[68] },
    { id: 70, word: 'Ausflug', isWord: true, imgNum: imgNumWords[69] },
    { id: 71, word: 'Volumen', isWord: true, imgNum: imgNumWords[70] },
    { id: 72, word: 'Kran', isWord: true, imgNum: imgNumWords[71] },
    { id: 73, word: 'Hahn', isWord: true, imgNum: imgNumWords[72] },
    { id: 74, word: 'Papier', isWord: true, imgNum: imgNumWords[73] },
    { id: 75, word: 'Kreis', isWord: true, imgNum: imgNumWords[74] },
    { id: 76, word: 'Bedeutung', isWord: true, imgNum: imgNumWords[75] },
    { id: 77, word: 'Kinder', isWord: true, imgNum: imgNumWords[76] },
    { id: 78, word: 'Schublade', isWord: true, imgNum: imgNumWords[77] },
    { id: 79, word: 'Nerven', isWord: true, imgNum: imgNumWords[78] },
    { id: 80, word: 'Pirat', isWord: true, imgNum: imgNumWords[79] },
    { id: 81, word: 'Beifall', isWord: true, imgNum: imgNumWords[80] },
    { id: 82, word: 'Glas', isWord: true, imgNum: imgNumWords[81] },
    { id: 83, word: 'Heizung', isWord: true, imgNum: imgNumWords[82] },
    { id: 84, word: 'Temperatur', isWord: true, imgNum: imgNumWords[83] },
    { id: 85, word: 'Tabelle', isWord: true, imgNum: imgNumWords[84] },
    { id: 86, word: 'Kaktus', isWord: true, imgNum: imgNumWords[85] },
    { id: 87, word: 'Narbe', isWord: true, imgNum: imgNumWords[86] },
    { id: 88, word: 'Blume', isWord: true, imgNum: imgNumWords[87] },
    { id: 89, word: 'Abdeckung', isWord: true, imgNum: imgNumWords[88] },
    { id: 90, word: 'Garage', isWord: true, imgNum: imgNumWords[89] },
    { id: 91, word: 'Monster', isWord: true, imgNum: imgNumWords[90] },
    { id: 92, word: 'Supermarkt', isWord: true, imgNum: imgNumWords[91] },
    { id: 93, word: 'Familie', isWord: true, imgNum: imgNumWords[92] },
    { id: 94, word: 'Projekt', isWord: true, imgNum: imgNumWords[93] },
    { id: 95, word: 'Baby', isWord: true, imgNum: imgNumWords[94] },
    { id: 96, word: 'Bildung', isWord: true, imgNum: imgNumWords[95] },
    { id: 97, word: 'Mikrowelle', isWord: true, imgNum: imgNumWords[96] },
    { id: 98, word: 'Sieb', isWord: true, imgNum: imgNumWords[97] },
    { id: 99, word: 'Lied', isWord: true, imgNum: imgNumWords[98] },
    { id: 100, word: 'Reise', isWord: true, imgNum: imgNumWords[99] },
];

const nonwords = [
    { id: 101, word: 'Westeff', isWord: false, imgNum: imgNumNonWords[0] },
    { id: 102, word: 'Tallan', isWord: false, imgNum: imgNumNonWords[1] },
    { id: 103, word: 'Laderoppe', isWord: false, imgNum: imgNumNonWords[2] },
    { id: 104, word: 'Arfomb', isWord: false, imgNum: imgNumNonWords[3] },
    { id: 105, word: 'Kacht', isWord: false, imgNum: imgNumNonWords[4] },
    { id: 106, word: 'Alfodrunnte', isWord: false, imgNum: imgNumNonWords[5] },
    { id: 107, word: 'Cehresweit', isWord: false, imgNum: imgNumNonWords[6] },
    { id: 108, word: 'Nauge', isWord: false, imgNum: imgNumNonWords[7] },
    { id: 109, word: 'Naglu', isWord: false, imgNum: imgNumNonWords[8] },
    { id: 110, word: 'Noelee', isWord: false, imgNum: imgNumNonWords[9] },
    { id: 111, word: 'Landem', isWord: false, imgNum: imgNumNonWords[10] },
    { id: 112, word: 'Gade', isWord: false, imgNum: imgNumNonWords[11] },
    { id: 113, word: 'Krektikats', isWord: false, imgNum: imgNumNonWords[12] },
    { id: 114, word: 'Piege', isWord: false, imgNum: imgNumNonWords[13] },
    { id: 115, word: 'Trokogando', isWord: false, imgNum: imgNumNonWords[14] },
    { id: 116, word: 'Grank', isWord: false, imgNum: imgNumNonWords[15] },
    { id: 117, word: 'Vertarbung', isWord: false, imgNum: imgNumNonWords[16] },
    { id: 118, word: 'Lichen', isWord: false, imgNum: imgNumNonWords[17] },
    { id: 119, word: 'Streiz', isWord: false, imgNum: imgNumNonWords[18] },
    { id: 120, word: 'Keser', isWord: false, imgNum: imgNumNonWords[19] },
    { id: 121, word: 'Lechtstuns', isWord: false, imgNum: imgNumNonWords[20] },
    { id: 122, word: 'Nixete', isWord: false, imgNum: imgNumNonWords[21] },
    { id: 123, word: 'Helehin', isWord: false, imgNum: imgNumNonWords[22] },
    { id: 124, word: 'Trantmort', isWord: false, imgNum: imgNumNonWords[23] },
    { id: 125, word: 'Anstirsuch', isWord: false, imgNum: imgNumNonWords[24] },
    { id: 126, word: 'Ahelotian', isWord: false, imgNum: imgNumNonWords[25] },
    { id: 127, word: 'Nirorre', isWord: false, imgNum: imgNumNonWords[26] },
    { id: 128, word: 'Ulmel', isWord: false, imgNum: imgNumNonWords[27] },
    { id: 129, word: 'Fledilt', isWord: false, imgNum: imgNumNonWords[28] },
    { id: 130, word: 'Uharyne', isWord: false, imgNum: imgNumNonWords[29] },
    { id: 131, word: 'Dilastor', isWord: false, imgNum: imgNumNonWords[30] },
    { id: 132, word: 'Wittam', isWord: false, imgNum: imgNumNonWords[31] },
    { id: 133, word: 'Flodrem', isWord: false, imgNum: imgNumNonWords[32] },
    { id: 134, word: 'Zygalitat', isWord: false, imgNum: imgNumNonWords[33] },
    { id: 135, word: 'Grort', isWord: false, imgNum: imgNumNonWords[34] },
    { id: 136, word: 'Wompuns', isWord: false, imgNum: imgNumNonWords[35] },
    { id: 137, word: 'Tochfeit', isWord: false, imgNum: imgNumNonWords[36] },
    { id: 138, word: 'Folipie', isWord: false, imgNum: imgNumNonWords[37] },
    { id: 139, word: 'Veidung', isWord: false, imgNum: imgNumNonWords[38] },
    { id: 140, word: 'Mandzugs', isWord: false, imgNum: imgNumNonWords[39] },
    { id: 141, word: 'Schalpi', isWord: false, imgNum: imgNumNonWords[40] },
    { id: 142, word: 'Uneripi', isWord: false, imgNum: imgNumNonWords[41] },
    { id: 143, word: 'Bermeisiskus', isWord: false, imgNum: imgNumNonWords[42] },
    { id: 144, word: 'Koxt', isWord: false, imgNum: imgNumNonWords[43] },
    { id: 145, word: 'Fildfand', isWord: false, imgNum: imgNumNonWords[44] },
    { id: 146, word: 'Zweundschang', isWord: false, imgNum: imgNumNonWords[45] },
    { id: 147, word: 'Zommel', isWord: false, imgNum: imgNumNonWords[46] },
    { id: 148, word: 'Kiro', isWord: false, imgNum: imgNumNonWords[47] },
    { id: 149, word: 'Zassel', isWord: false, imgNum: imgNumNonWords[48] },
    { id: 150, word: 'Lelle', isWord: false, imgNum: imgNumNonWords[49] },
    { id: 151, word: 'Nanlesums', isWord: false, imgNum: imgNumNonWords[50] },
    { id: 152, word: 'Wubedu', isWord: false, imgNum: imgNumNonWords[51] },
    { id: 153, word: 'Wudofer', isWord: false, imgNum: imgNumNonWords[52] },
    { id: 154, word: 'Moge', isWord: false, imgNum: imgNumNonWords[53] },
    { id: 155, word: 'Knamet', isWord: false, imgNum: imgNumNonWords[54] },
    { id: 156, word: 'Schwillmad', isWord: false, imgNum: imgNumNonWords[55] },
    { id: 157, word: 'Hemmer', isWord: false, imgNum: imgNumNonWords[56] },
    { id: 158, word: 'Flod', isWord: false, imgNum: imgNumNonWords[57] },
    { id: 159, word: 'Stalg', isWord: false, imgNum: imgNumNonWords[58] },
    { id: 160, word: 'Terne', isWord: false, imgNum: imgNumNonWords[59] },
    { id: 161, word: 'Abfats', isWord: false, imgNum: imgNumNonWords[60] },
    { id: 162, word: 'Afgel', isWord: false, imgNum: imgNumNonWords[61] },
    { id: 163, word: 'Been', isWord: false, imgNum: imgNumNonWords[62] },
    { id: 164, word: 'Tirterie', isWord: false, imgNum: imgNumNonWords[63] },
    { id: 165, word: 'Hees', isWord: false, imgNum: imgNumNonWords[64] },
    { id: 166, word: 'Blopi', isWord: false, imgNum: imgNumNonWords[65] },
    { id: 167, word: 'Brauf', isWord: false, imgNum: imgNumNonWords[66] },
    { id: 168, word: 'Mura', isWord: false, imgNum: imgNumNonWords[67] },
    { id: 169, word: 'Ponze', isWord: false, imgNum: imgNumNonWords[68] },
    { id: 170, word: 'Aufnums', isWord: false, imgNum: imgNumNonWords[69] },
    { id: 171, word: 'Niluken', isWord: false, imgNum: imgNumNonWords[70] },
    { id: 172, word: 'Bran', isWord: false, imgNum: imgNumNonWords[71] },
    { id: 173, word: 'Hato', isWord: false, imgNum: imgNumNonWords[72] },
    { id: 174, word: 'Gapoor', isWord: false, imgNum: imgNumNonWords[73] },
    { id: 175, word: 'Kreit', isWord: false, imgNum: imgNumNonWords[74] },
    { id: 176, word: 'Sedehmung', isWord: false, imgNum: imgNumNonWords[75] },
    { id: 177, word: 'Minger', isWord: false, imgNum: imgNumNonWords[76] },
    { id: 178, word: 'Krummdase', isWord: false, imgNum: imgNumNonWords[77] },
    { id: 179, word: 'Verxen', isWord: false, imgNum: imgNumNonWords[78] },
    { id: 180, word: 'Pidat', isWord: false, imgNum: imgNumNonWords[79] },
    { id: 181, word: 'Meifags', isWord: false, imgNum: imgNumNonWords[80] },
    { id: 182, word: 'Chas', isWord: false, imgNum: imgNumNonWords[81] },
    { id: 183, word: 'Meiguln', isWord: false, imgNum: imgNumNonWords[82] },
    { id: 184, word: 'Vopperatum', isWord: false, imgNum: imgNumNonWords[83] },
    { id: 185, word: 'Babende', isWord: false, imgNum: imgNumNonWords[84] },
    { id: 186, word: 'Kambur', isWord: false, imgNum: imgNumNonWords[85] },
    { id: 187, word: 'Parme', isWord: false, imgNum: imgNumNonWords[86] },
    { id: 188, word: 'Junne', isWord: false, imgNum: imgNumNonWords[87] },
    { id: 189, word: 'Andeufung', isWord: false, imgNum: imgNumNonWords[88] },
    { id: 190, word: 'Nasige', isWord: false, imgNum: imgNumNonWords[89] },
    { id: 191, word: 'Mafster', isWord: false, imgNum: imgNumNonWords[90] },
    { id: 192, word: 'Lopdoromer', isWord: false, imgNum: imgNumNonWords[91] },
    { id: 193, word: 'Hoxitie', isWord: false, imgNum: imgNumNonWords[92] },
    { id: 194, word: 'Projold', isWord: false, imgNum: imgNumNonWords[93] },
    { id: 195, word: 'Wady', isWord: false, imgNum: imgNumNonWords[94] },
    { id: 196, word: 'Bollung', isWord: false, imgNum: imgNumNonWords[95] },
    { id: 197, word: 'Wigrafelle', isWord: false, imgNum: imgNumNonWords[96] },
    { id: 198, word: 'Bieb', isWord: false, imgNum: imgNumNonWords[97] },
    { id: 199, word: 'Pied', isWord: false, imgNum: imgNumNonWords[98] },
    { id: 200, word: 'Seige', isWord: false, imgNum: imgNumNonWords[99] },
];

// assign correct responses
for (let i = 0; i < words.length; i++) {
    if (words[i].imgNum === 0) {
        words[i].imgName = imgFiles[0].slice(7, -4);
        words[i].corrResp = prms.respKeys[0];
        words[i].respSide = 'left';
        words[i].respColour = 'green';
    } else if (words[i].imgNum === 1) {
        words[i].imgName = imgFiles[1].slice(7, -4);
        words[i].corrResp = prms.respKeys[0];
        words[i].respSide = 'left';
        words[i].respColour = 'red';
    } else if (words[i].imgNum === 2) {
        words[i].imgName = imgFiles[2].slice(7, -4);
        words[i].corrResp = prms.respKeys[1];
        words[i].respSide = 'right';
        words[i].respColour = 'red';
    } else if (words[i].imgNum === 3) {
        words[i].imgName = imgFiles[3].slice(7, -4);
        words[i].corrResp = prms.respKeys[1];
        words[i].respSide = 'right';
        words[i].respColour = 'green';
    }
}

for (let i = 0; i < nonwords.length; i++) {
    if (nonwords[i].imgNum === 0) {
        nonwords[i].imgName = imgFiles[0].slice(7, -4);
        nonwords[i].corrResp = prms.respKeys[1];
        nonwords[i].respSide = 'right';
        nonwords[i].respColour = 'red';
    } else if (nonwords[i].imgNum === 1) {
        nonwords[i].imgName = imgFiles[1].slice(7, -4);
        nonwords[i].corrResp = prms.respKeys[1];
        nonwords[i].respSide = 'right';
        nonwords[i].respColour = 'green';
    } else if (nonwords[i].imgNum === 2) {
        nonwords[i].imgName = imgFiles[2].slice(7, -4);
        nonwords[i].corrResp = prms.respKeys[0];
        nonwords[i].respSide = 'left';
        nonwords[i].respColour = 'green';
    } else if (nonwords[i].imgNum === 3) {
        nonwords[i].imgName = imgFiles[3].slice(7, -4);
        nonwords[i].corrResp = prms.respKeys[0];
        nonwords[i].respSide = 'left';
        nonwords[i].respColour = 'red';
    }
}

// randomly select 25 words and 25 non-words in each block (4 exp blocks in total)
let words_mixed = shuffle(words);
let nonwords_mixed = shuffle(nonwords);

let materials1 = shuffle(words_mixed.splice(0, 25).concat(nonwords_mixed.splice(0, 25)));
let materials2 = shuffle(words_mixed.splice(0, 25).concat(nonwords_mixed.splice(0, 25)));
let materials3 = shuffle(words_mixed.splice(0, 25).concat(nonwords_mixed.splice(0, 25)));
let materials4 = shuffle(words_mixed.splice(0, 25).concat(nonwords_mixed.splice(0, 25)));

function drawFixation() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo(prms.fixSize, 0);
    ctx.stroke();
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0, prms.fixSize);
    ctx.stroke();
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation,
};

function showStim(args) {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');

    // draw response buttons
    let num = args.imgNum;
    let w = imgs[num].width;
    let h = imgs[num].height;
    let s = 6;
    ctx.drawImage(imgs[num], -w / s / 2, 50, w / s, h / s);

    // draw word in centre
    ctx.font = prms.wordSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(args.word, 0, 0);
}

function drawFeedback() {
    'use strict';
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(prms.fbTxt[dat.corrCode - 1], 0, 0);
}

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    trial_duration: prms.fbDur,
    response_ends_trial: false,
    func: drawFeedback,
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() { },
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: '',
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt_de_du({ stim: 'ButtonNegation' });
    },
};

function codeTrial() {
    'use strict';
    let dat = jsPsych.data.get().last(1).values()[0];
    dat.rt = dat.rt !== null ? dat.rt : prms.tooSlow;

    let corrCode = 0;
    let correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);

    if (correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 1; // correct
    } else if (!correctKey && dat.rt > prms.tooFast && dat.rt < prms.tooSlow) {
        corrCode = 2; // choice error
    } else if (dat.rt >= prms.tooSlow) {
        corrCode = 3; // too slow
    } else if (dat.rt <= prms.tooFast) {
        corrCode = 4; // too false
    }
    jsPsych.data.addDataToLastTrial({
        date: Date(),
        corrCode: corrCode,
        blockNum: prms.cBlk,
        trialNum: prms.cTrl,
    });
    prms.cTrl += 1;
}

const stim = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    stimulus_onset: 0,
    response_ends_trial: true,
    choices: prms.respKeys,
    trial_duration: prms.tooSlow,
    func: showStim,
    func_args: [{ imgNum: jsPsych.timelineVariable('imgNum'), word: jsPsych.timelineVariable('word') }],
    data: {
        stim: 'ButtonNegation',
        imgNum: jsPsych.timelineVariable('imgNum'),
        imgName: jsPsych.timelineVariable('imgName'),
        word: jsPsych.timelineVariable('word'),
        id: jsPsych.timelineVariable('id'),
        respSide: jsPsych.timelineVariable('respSide'),
        respColour: jsPsych.timelineVariable('respColour'),
        corrResp: jsPsych.timelineVariable('corrResp'),
    },
    on_finish: function() {
        codeTrial();
    },
};

const trial_timeline_practice = {
    timeline: [fixation_cross, stim, trial_feedback, iti],
    timeline_variables: materials_practice,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};

const trial_timeline1 = {
    timeline: [fixation_cross, stim, trial_feedback, iti],
    timeline_variables: materials1,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};

const trial_timeline2 = {
    timeline: [fixation_cross, stim, trial_feedback, iti],
    timeline_variables: materials2,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};
const trial_timeline3 = {
    timeline: [fixation_cross, stim, trial_feedback, iti],
    timeline_variables: materials3,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};

const trial_timeline4 = {
    timeline: [fixation_cross, stim, trial_feedback, iti],
    timeline_variables: materials4,
    sample: {
        type: 'fixed-repetitions',
        size: 1,
    },
};

// For VP Stunden
const randomString = generateRandomString({ length: 16, prefix: 'bn1_' });

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus:
        "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3><br>" +
        "<h3 style='text-align:left;'>Versuchpersonenstunde:</h3>" +
        "<h4 style='text-align:left;'>Wenn Sie Versuchspersonenstunden benötigen, kopieren Sie den folgenden zufällig generierten Code und</h4>" +
        "<h4 style='text-align:left;'>senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde' an: </h4>" +
        '<h2>sprachstudien@psycho.uni-tuebingen.de</h2><br>' +
        "<h3 style='text-align:left;'>Gewinnspiel:</h3>" +
        "<h4 style='text-align:left;'>Wenn Sie alternativ an der Verlosung der Gutscheine teilnehmen möchten, kopieren Sie den zufällig generierten</h4>" +
        "<h4 style='text-align:left;'>Code und senden sie diesen in einer E-Mail mit Betreff 'Gewinnspiel' an:</h4>" +
        '<h2>sprachstudien@psycho.uni-tuebingen.de</h2><br>' +
        '<h1>Code: ' +
        randomString +
        '</h1><br>' +
        "<h2 style='text-align:center;'>Drücken Sie die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////

const expName = getFileName();
const dirName = getDirName();

function save() {
    let vpNum = getTime();
    let pcInfo = getComputerInfo();

    jsPsych.data.addProperties({ vpNum: vpNum, pcInfo: pcInfo });

    let fn = `${dirName}data/${expName}_'${vpNum}`;
    saveData('/Common/write_data.php', fn, { stim: 'ButtonNegation' });

    fn = `${dirName}interaction/${expName}_'${vpNum}`;
    saveInteractionData('/Common/write_data.php', fn);

    fn = `${dirName}code/${expName}`;
    saveRandomCode('/Common/write_code.php', fn, randomString);
}

const save_data = {
    type: 'call-function',
    func: save,
    post_trial_gap: 1000,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    'use strict';

    let exp = [];

    exp.push(check_screen_size(canvas_size))
    exp.push(fullscreen(true));
    exp.push(resize_browser());
    exp.push(welcome_message());
    exp.push(vpInfoForm());
    exp.push(mouseCursor(false));
    exp.push(screenInfo);

    exp.push(task_instructions1);
    exp.push(task_instructions2);

    // practice block
    exp.push(trial_timeline_practice);
    exp.push(block_feedback); // show previous block performance

    // experimental blocks
    exp.push(trial_timeline1);
    exp.push(block_feedback); // show previous block performance
    exp.push(trial_timeline2);
    exp.push(block_feedback); // show previous block performance
    exp.push(trial_timeline3);
    exp.push(block_feedback); // show previous block performance
    exp.push(trial_timeline4);

    exp.push(save_data);
    exp.push(end_message());
    exp.push(mouseCursor(true));
    exp.push(alphaNum);
    exp.push(fullscreen(false));

    return exp;
}
const EXP = genExpSeq();

jsPsych.init({
    timeline: EXP,
    on_interaction_data_update: function(data) {
        update_user_interaction_data(data);
    },
});
