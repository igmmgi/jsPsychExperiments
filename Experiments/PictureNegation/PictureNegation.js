// PictureNegation:

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(200, 200, 200, 1)';
const canvas_size = [960, 720];
const canvas_border = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 32, // number of trials in first block (practice)
  nTrlsE: 96, // number of trials in subsequent blocks
  nBlks: 4,
  fixDur: 750,
  picDur: 500,
  fbDur: 1000,
  iti: 500,
  tooFast: 150,
  tooSlow: 5000,
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 3,
  fixSize: 15,
  sentenceSize: '20px monospace',
  fbSize: '20px monospace',
  respKeys: [],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });
let respText;
if (nVersion === 1) {
  prms.respKeys = ['D', 'K'];
  respText =
    "<h2 style='text-align:center;'><b>Sinnvoll = Taste 'D'</b> (linker Zeigefinger).</h2>" +
    "<h2 style='text-align:center;'><b>Sinnlos = Taste 'K'</b> (rechter Zeigefinger).</h2><br>";
} else {
  prms.respKeys = ['K', 'D'];
  respText =
    "<h2 style='text-align:center;'><b>Sinnlos = Taste 'D'</b> (linker Zeigefinger).</h2>" +
    "<h2 style='text-align:center;'><b>Sinnvoll = Taste 'K'</b> (rechter Zeigefinger).</h2><br>";
}

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
    "<h2 style='text-align:left;'>vielen Dank, dass Sie sich die Zeit zur</h2>" +
    "<h2 style='text-align:left;'>Teilnahme an unserer B.Sc. Arbeit nehmen.</h2><br>" +
    "<h2 style='text-align:left;'>Bitte nehmen Sie nur teil, wenn Sie mindestens 18 Jahre alt </h2>" +
    "<h2 style='text-align:left;'>sind und Deutsch auf Muttersprachenniveau beherrschen. </h2><br>" +
    "<h2 style='text-align:left;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus:
    "<h3 style='text-align:left;'>In der Studie sehen Sie in jedem Durchgang ein Bild gefolgt</h3>" +
    "<h3 style='text-align:left;'>von einem Satz. Ihre Aufgabe ist es nach jedem Satz zu entscheiden,</h3>" +
    "<h3 style='text-align:left;'>ob dieser Satz sinnvoll ist (z.B. 'Sie essen heute viel Kuchen.')</h3>" +
    "<h3 style='text-align:left;'>oder nicht (z.B. 'Sie humpeln einen Schlauch.').</h3><br>" +
    respText +
    "<h3 style='text-align:center;'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h3><br>" +
    "<h2 style='text-align:center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
};

const task_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: "<h3 style='text-align:center;'>Erinnerung:</h3>" + respText,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

// 60 image files
const imageFiles = [
  'images/Aff_A1.png',
  'images/Aff_A2.png',
  'images/Aff_A3.png',
  'images/Aff_A4.png',
  'images/Aff_A5.png',
  'images/Aff_A6.png',
  'images/Aff_A7.png',
  'images/Aff_A8.png',
  'images/Aff_A9.png',
  'images/Aff_A10.png',
  'images/Aff_F1.png',
  'images/Aff_F2.png',
  'images/Aff_F3.png',
  'images/Aff_F4.png',
  'images/Aff_F5.png',
  'images/Aff_F6.png',
  'images/Aff_F7.png',
  'images/Aff_F8.png',
  'images/Aff_F9.png',
  'images/Aff_F10.png',
  'images/Aff_G1.png',
  'images/Aff_G2.png',
  'images/Aff_G3.png',
  'images/Aff_G4.png',
  'images/Aff_G5.png',
  'images/Aff_G6.png',
  'images/Aff_G7.png',
  'images/Aff_G8.png',
  'images/Aff_G9.png',
  'images/Aff_G10.png',
  'images/Neg_A1.png',
  'images/Neg_A2.png',
  'images/Neg_A3.png',
  'images/Neg_A4.png',
  'images/Neg_A5.png',
  'images/Neg_A6.png',
  'images/Neg_A7.png',
  'images/Neg_A8.png',
  'images/Neg_A9.png',
  'images/Neg_A10.png',
  'images/Neg_F1.png',
  'images/Neg_F2.png',
  'images/Neg_F3.png',
  'images/Neg_F4.png',
  'images/Neg_F5.png',
  'images/Neg_F6.png',
  'images/Neg_F7.png',
  'images/Neg_F8.png',
  'images/Neg_F9.png',
  'images/Neg_F10.png',
  'images/Neg_G1.png',
  'images/Neg_G2.png',
  'images/Neg_G3.png',
  'images/Neg_G4.png',
  'images/Neg_G5.png',
  'images/Neg_G6.png',
  'images/Neg_G7.png',
  'images/Neg_G8.png',
  'images/Neg_G9.png',
  'images/Neg_G10.png',
];

const images = loadImages(imageFiles);

// 120 sentences per category
// 4 categories:
// 1: sensible-affirmative
// 2: not sensible-affirmative
// 3: sensible-negated
// 4: not sensible-negated
// prettier-ignore
const materials_ja_aff = [
  { sentNum: 1, sentence: 'Sie trinken ein Glas Saft.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 2, sentence: 'Sie werfen einen Ball.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 3, sentence: 'Sie essen eine Banane.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 4, sentence: 'Sie laufen jetzt zum See.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 5, sentence: 'Sie fahren immer zur Oma.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 6, sentence: 'Sie gehen bald ins Kino.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 7, sentence: 'Sie braten oft Fleisch.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 8, sentence: 'Sie kochen eine Suppe.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 9, sentence: 'Sie läuten eine Glocke.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 10, sentence: 'Sie schlafen immer im Bett.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 11, sentence: 'Sie malen ein Bild.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 12, sentence: 'Sie spielen jetzt Gitarre.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 13, sentence: 'Sie springen jetzt in die Luft.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 14, sentence: 'Sie singen ein Lied.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 15, sentence: 'Sie basteln einen Flieger.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 16, sentence: 'Sie machen eine Pause.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 17, sentence: 'Sie bearbeiten eine Aufgabe.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 18, sentence: 'Sie lösen ein Rätsel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 19, sentence: 'Sie skizzieren ein Tier.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 20, sentence: 'Sie zeichnen ein Bild.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 21, sentence: 'Sie hüpfen jetzt über den Stein.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 22, sentence: 'Sie feiern heute das Jubiläum.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 23, sentence: 'Sie packen einen Koffer.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 24, sentence: 'Sie putzen heute das Bad.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 25, sentence: 'Sie schreiben einen Aufsatz.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 26, sentence: 'Sie gehen heute in die Kirche.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 27, sentence: 'Sie essen eine Pizza.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 28, sentence: 'Sie pflücken eine Erdbeere.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 29, sentence: 'Sie biegen einen Draht.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 30, sentence: 'Sie fahren heute nach Paris.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 31, sentence: 'Sie bitten jetzt um Hilfe.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 32, sentence: 'Sie verbrennen ein Papier.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 33, sentence: 'Sie empfehlen ein Restaurant.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 34, sentence: 'Sie empfangen einen Gast.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 35, sentence: 'Sie finden einen Ring.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 36, sentence: 'Sie fliehen jetzt vor dem Gewitter.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 37, sentence: 'Sie machen jetzt den Abwasch.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 38, sentence: 'Sie geraten schnell in Stress.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 39, sentence: 'Sie gewinnen ein Spiel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 40, sentence: 'Sie gießen jetzt die Blumen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 41, sentence: 'Sie sitzen heute auf dem Balkon.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 42, sentence: 'Sie streicheln eine Katze.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 43, sentence: 'Sie schauen immer aus dem Fenster.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 44, sentence: 'Sie falten eine Serviette.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 45, sentence: 'Sie unternehmen eine Wanderung.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 46, sentence: 'Sie schneiden eine Zwiebel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 47, sentence: 'Sie reiten jetzt über den Strand.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 48, sentence: 'Sie vergraben einen Schatz.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 49, sentence: 'Sie brauchen eine Dusche.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 50, sentence: 'Sie vergessen einen Termin.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 51, sentence: 'Sie träumen heute vom Sommer.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 52, sentence: 'Sie wischen heute den Boden.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 53, sentence: 'Sie arbeiten jetzt beim Bäcker.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 54, sentence: 'Sie überfallen eine Bank.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 55, sentence: 'Sie gründen einen Verein.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 56, sentence: 'Sie planen einen Urlaub.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 57, sentence: 'Sie treffen heute ihre Tante.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 58, sentence: 'Sie leiden an einer Krankheit.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 59, sentence: 'Sie klauen jetzt das Geld.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 60, sentence: 'Sie vermieten eine Wohnung.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 61, sentence: 'Sie verabreden sich heute mit der Familie.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 62, sentence: 'Sie gehen heute zur Verwandtschaft.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 63, sentence: 'Sie benutzen eine Fernbedienung.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 64, sentence: 'Sie entwerfen eine Strategie.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 65, sentence: 'Sie bestimmen heute die Richtung.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 66, sentence: 'Sie flechten einen Zopf.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 67, sentence: 'Sie finden einen Stein.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 68, sentence: 'Sie schieben jetzt den Wagen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 69, sentence: 'Sie mögen einen Kuchen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 70, sentence: 'Sie liegen heute auf der Wiese.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 71, sentence: 'Sie beladen jetzt das Auto.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 72, sentence: 'Sie meiden heute den Kontakt.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 73, sentence: 'Sie trinken einen Kaffee.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 74, sentence: 'Sie essen heute die Lasagne.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 75, sentence: 'Sie fliegen ein Flugzeug.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 76, sentence: 'Sie probieren heute die Frucht.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 77, sentence: 'Sie halten eine Rede.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 78, sentence: 'Sie stehen heute in der Schlange.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 79, sentence: 'Sie knuddeln jetzt den Hund.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 80, sentence: 'Sie besuchen eine Frau.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 81, sentence: 'Sie rudern jetzt zum Ufer.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 82, sentence: 'Sie fällen einen Baum.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 83, sentence: 'Sie trinken einen Wein.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 84, sentence: 'Sie beginnen heute mit dem Text.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 85, sentence: 'Sie denken gerade an ihre Mutter.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 86, sentence: 'Sie mögen sehr spezielles Bier.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 87, sentence: 'Sie sehen eine Eule.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 88, sentence: 'Sie küssen eine Schauspielerin.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 89, sentence: 'Sie wollen eine Lösung.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 90, sentence: 'Sie überreden heute den Chef.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 91, sentence: 'Sie fliegen heute in die USA.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 92, sentence: 'Sie bestellen ein Sofa.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 93, sentence: 'Sie schälen eine Kartoffel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 94, sentence: 'Sie hämmern heute gegen die Wand.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 95, sentence: 'Sie ziehen einen Zahn.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 96, sentence: 'Sie klopfen heute gegen das Tor.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 97, sentence: 'Sie zählen heute die Schafe.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 98, sentence: 'Sie baden immer in der Badewanne.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 99, sentence: 'Sie bewundern nun das Gemälde.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 100, sentence: 'Sie zimmern eine Kommode.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 101, sentence: 'Sie streicheln eine Katze.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 102, sentence: 'Sie sprinten jetzt zur Halle.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 103, sentence: 'Sie errichten ein Gebäude.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 104, sentence: 'Sie kaufen eine Trompete.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 105, sentence: 'Sie pflanzen heute die Tomaten.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 106, sentence: 'Sie sähen heute die Samen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 107, sentence: 'Sie schmelzen heute die Butter.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 108, sentence: 'Sie fahren heute Schlitten.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 109, sentence: 'Sie reisen jetzt um die Welt.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 110, sentence: 'Sie speisen heute im Restaurant.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 111, sentence: 'Sie suchen nach einem Schlüssel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 112, sentence: 'Sie ändern heute ihr Aussehen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 113, sentence: 'Sie überzeugen heute den Mann.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 114, sentence: 'Sie dichten einen Reim.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 115, sentence: 'Sie knabbern an einer Karotte.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 116, sentence: 'Sie übernachten heute bei dem Vater.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 117, sentence: 'Sie brechen eine Regel.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 118, sentence: 'Sie recherchieren jetzt nach Sängern.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 119, sentence: 'Sie wollen ein Auto.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
  { sentNum: 120, sentence: 'Sie füttern ein Kaninchen.', sinn: 'ja', pol: 'aff', corrResp: prms.respKeys[0] },
];

// prettier-ignore
const materials_nein_aff = [
  { sentNum: 121, sentence: 'Sie reiten ein Buch.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 122, sentence: 'Sie heißen eine Rose.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 123, sentence: 'Sie leihen einen Wurf.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 124, sentence: 'Sie liegen einen Weg.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 125, sentence: 'Sie pfeifen ein Rohr.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 126, sentence: 'Sie fangen eine Abscheu.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 127, sentence: 'Sie reiben eine Schaukel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 128, sentence: 'Sie reißen immer den Computer.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 129, sentence: 'Sie rufen ein Blech.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 130, sentence: 'Sie saufen heute den Fleck.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 131, sentence: 'Sie schaffen gerne das Gummi.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 132, sentence: 'Sie scheren immer den Sitz.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 133, sentence: 'Sie schieben einen Raum.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 134, sentence: 'Sie fahren heute das Müsli.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 135, sentence: 'Sie schießen gerne das Meer.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 136, sentence: 'Sie schleichen nun den Kuchen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 137, sentence: 'Sie schmeißen eine Strecke.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 138, sentence: 'Sie schreiten gerne das Gestell.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 139, sentence: 'Sie schweigen eine Kanone.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 140, sentence: 'Sie schwimmen einen Docht.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 141, sentence: 'Sie schwingen ein Loch.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 142, sentence: 'Sie schwören einen Gärtner.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 143, sentence: 'Sie spinnen einen Hocker.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 144, sentence: 'Sie sterben jetzt den Henkel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 145, sentence: 'Sie stehlen ein Erdbeben.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 146, sentence: 'Sie treiben einen Besen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 147, sentence: 'Sie wachsen eine Iris.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 148, sentence: 'Sie waschen einen Gesang.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 149, sentence: 'Sie wissen eine Birne.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 150, sentence: 'Sie bleiben heute das Gefühl.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 151, sentence: 'Sie gedeihen eine Braut.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 152, sentence: 'Sie fließen gerne das Gedicht.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 153, sentence: 'Sie frieren eine Leiter.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 154, sentence: 'Sie gelten einen Hahn.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 155, sentence: 'Sie genesen heute den Wurm.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 156, sentence: 'Sie singen einen Hund.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 157, sentence: 'Sie geschehen einen Rat.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 158, sentence: 'Sie klingen eine Ente.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 159, sentence: 'Sie können eine Unterkunft.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 160, sentence: 'Sie laden eine Wimper.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 161, sentence: 'Sie lügen ein Bein.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 162, sentence: 'Sie quellen heute das Format.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 163, sentence: 'Sie ringen eine Post.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 164, sentence: 'Sie schleifen jetzt das Programm.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 165, sentence: 'Sie schlingen heute den Ausflug.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 166, sentence: 'Sie schwellen nun das Gestein.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 167, sentence: 'Sie stechen ein Ruder.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 168, sentence: 'Sie stinken einen Friseur.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 169, sentence: 'Sie trügen einen Deckel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 170, sentence: 'Sie weben heute den Kanon.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 171, sentence: 'Sie winden ein Klavier.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 172, sentence: 'Sie zwingen heute den Ring.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 173, sentence: 'Sie lesen einen Elefanten.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 174, sentence: 'Sie bauen ein Wasser.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 175, sentence: 'Sie rühren heute die Lampe.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 176, sentence: 'Sie verbringen heute das Kamel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 177, sentence: 'Sie weisen immer die Jacke.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 178, sentence: 'Sie kauen einen Sinn.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 179, sentence: 'Sie tippen ein Hochhaus.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 180, sentence: 'Sie jonglieren heute mit Steckdosen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 181, sentence: 'Sie ernten jetzt das Telefon.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 182, sentence: 'Sie heiraten ein Öl.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 183, sentence: 'Sie lächeln einen Rollstuhl.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 184, sentence: 'Sie reden jetzt den Stift.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 185, sentence: 'Sie tauchen heute im Papagei.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 186, sentence: 'Sie erfahren eine Maus.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 187, sentence: 'Sie rasieren heute die Mauer.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 188, sentence: 'Sie kitzeln einen Prozess.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 189, sentence: 'Sie verschlucken heute den Fleiß.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 190, sentence: 'Sie rollen heute die Ehre.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 191, sentence: 'Sie benehmen eine Fantasie.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 192, sentence: 'Sie riechen ein Gedächtnis.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 193, sentence: 'Sie verblüffen heute den Verlust.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 194, sentence: 'Sie bremsen einen Teich.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 195, sentence: 'Sie bluten einen Planeten.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 196, sentence: 'Sie heilen eine Leistung.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 197, sentence: 'Sie hoffen einen Teig.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 198, sentence: 'Sie erschießen eine Schere.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 199, sentence: 'Sie entführen immer den Durst.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 200, sentence: 'Sie nähen einen Feiertag.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 201, sentence: 'Sie parken heute den Mond.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 202, sentence: 'Sie reinigen heute die Melodie.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 203, sentence: 'Sie knacken einen Tropfen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 204, sentence: 'Sie nehmen einen Himmel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 205, sentence: 'Sie sprechen heute die Hose.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 206, sentence: 'Sie tun eine Wolke.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 207, sentence: 'Sie galoppieren einen Eimer.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 208, sentence: 'Sie graben eine Dose.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 209, sentence: 'Sie greifen einen Zoo.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 210, sentence: 'Sie schwitzen einen Kocher.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 211, sentence: 'Sie strecken heute den Fluss.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 212, sentence: 'Sie begeben eine Lippe.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 213, sentence: 'Sie joggen auf einer Tulpe.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 214, sentence: 'Sie wandern einen Topf.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 215, sentence: 'Sie aktivieren immer den Rasen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 216, sentence: 'Sie atmen einen Käfig.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 217, sentence: 'Sie raten einen Brenner.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 218, sentence: 'Sie renovieren jetzt die Hymne.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 219, sentence: 'Sie decken eine Linse.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 220, sentence: 'Sie hobeln einen Truthahn.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 221, sentence: 'Sie sägen eine Hängematte.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 222, sentence: 'Sie steigen jetzt in die Nadel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 223, sentence: 'Sie gären heute das Netz.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 224, sentence: 'Sie wickeln einen Korken.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 225, sentence: 'Sie dürfen eine Binden.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 226, sentence: 'Sie mähen immer den Atem.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 227, sentence: 'Sie leuchten heute den Schuh.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 228, sentence: 'Sie blamieren eine Taste.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 229, sentence: 'Sie säubern einen Sturm.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 230, sentence: 'Sie beenden eine Ziege.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 231, sentence: 'Sie kaschieren eine Torte.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 232, sentence: 'Sie vegetieren einen Lauf.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 233, sentence: 'Sie schrauben ein Kissen.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 234, sentence: 'Sie flöten eine Pfanne.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 235, sentence: 'Sie fauchen heute den Ast.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 236, sentence: 'Sie massieren ein Wohnmobil.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 237, sentence: 'Sie kneten nun ein Geräusch.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 238, sentence: 'Sie kratzen heute den Ekel.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 239, sentence: 'Sie wühlen eine Ananas.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
  { sentNum: 240, sentence: 'Sie klammern eine Bohne.', sinn: 'nein', pol: 'aff', corrResp: prms.respKeys[1] },
];

// prettier-ignore
const materials_ja_neg = [
  { sentNum: 1, sentence: 'Sie trinken kein Glas Saft.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 2, sentence: 'Sie werfen keinen Ball.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 3, sentence: 'Sie essen keine Banane.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 4, sentence: 'Sie laufen nicht zum See.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 5, sentence: 'Sie fahren nicht zur Oma.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 6, sentence: 'Sie gehen nicht ins Kino.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 7, sentence: 'Sie braten nicht Fleisch.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 8, sentence: 'Sie kochen keine Suppe.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 9, sentence: 'Sie läuten keine Glocke.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 10, sentence: 'Sie schlafen nicht im Bett.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 11, sentence: 'Sie malen kein Bild.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 12, sentence: 'Sie spielen nicht Gitarre.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 13, sentence: 'Sie springen nicht in die Luft.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 14, sentence: 'Sie singen kein Lied.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 15, sentence: 'Sie basteln keinen Flieger.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 16, sentence: 'Sie machen keine Pause.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 17, sentence: 'Sie bearbeiten keine Aufgabe.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 18, sentence: 'Sie lösen kein Rätsel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 19, sentence: 'Sie skizzieren kein Tier.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 20, sentence: 'Sie zeichnen kein Bild.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 21, sentence: 'Sie hüpfen nicht über den Stein.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 22, sentence: 'Sie feiern heute nicht das Jubiläum.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 23, sentence: 'Sie packen keinen Koffer.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 24, sentence: 'Sie putzen nicht das Bad.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 25, sentence: 'Sie schreiben keinen Aufsatz.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 26, sentence: 'Sie gehen nicht in die Kirche.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 27, sentence: 'Sie essen keine Pizza.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 28, sentence: 'Sie pflücken keine Erdbeere.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 29, sentence: 'Sie biegen keinen Draht.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 30, sentence: 'Sie fahren nicht nach Paris.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 31, sentence: 'Sie bitten nicht um Hilfe.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 32, sentence: 'Sie verbrennen kein Papier.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 33, sentence: 'Sie empfehlen kein Restaurant.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 34, sentence: 'Sie empfangen keinen Gast.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 35, sentence: 'Sie finden keinen Ring.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 36, sentence: 'Sie fliehen nicht vor dem Gewitter.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 37, sentence: 'Sie machen nicht den Abwasch.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 38, sentence: 'Sie geraten nicht in Stress.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 39, sentence: 'Sie gewinnen kein Spiel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 40, sentence: 'Sie gießen nicht die Blumen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 41, sentence: 'Sie sitzen nicht auf dem Balkon.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 42, sentence: 'Sie streicheln keine Katze.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 43, sentence: 'Sie schauen nicht aus dem Fenster.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 44, sentence: 'Sie falten keine Serviette.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 45, sentence: 'Sie unternehmen keine Wanderung.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 46, sentence: 'Sie schneiden keine Zwiebel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 47, sentence: 'Sie reiten nicht über den Strand.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 48, sentence: 'Sie vergraben keinen Schatz.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 49, sentence: 'Sie brauchen keine Dusche.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 50, sentence: 'Sie vergessen keinen Termin.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 51, sentence: 'Sie träumen nicht vom Sommer.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 52, sentence: 'Sie wischen nicht den Boden.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 53, sentence: 'Sie arbeiten nicht beim Bäcker.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 54, sentence: 'Sie überfallen keine Bank.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 55, sentence: 'Sie gründen keinen Verein.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 56, sentence: 'Sie planen keinen Urlaub.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 57, sentence: 'Sie treffen nicht ihre Tante.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 58, sentence: 'Sie leiden an keiner Krankheit.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 59, sentence: 'Sie klauen nicht das Geld.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 60, sentence: 'Sie vermieten keine Wohnung.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 61, sentence: 'Sie verabreden sich nicht mit der Familie.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0], },
  { sentNum: 62, sentence: 'Sie gehen nicht zur Verwandtschaft.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 63, sentence: 'Sie benutzen keine Fernbedienung.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 64, sentence: 'Sie entwerfen keine Strategie.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 65, sentence: 'Sie bestimmen nicht die Richtung.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 66, sentence: 'Sie flechten keinen Zopf.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 67, sentence: 'Sie finden keinen Stein.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 68, sentence: 'Sie schieben nicht den Wagen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 69, sentence: 'Sie mögen keinen Kuchen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 70, sentence: 'Sie liegen nicht auf der Wiese.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 71, sentence: 'Sie beladen nicht das Auto.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 72, sentence: 'Sie meiden nicht den Kontakt.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 73, sentence: 'Sie trinken keinen Kaffee.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 74, sentence: 'Sie essen nicht die Lasagne.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 75, sentence: 'Sie fliegen kein Flugzeug.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 76, sentence: 'Sie probieren nicht die Frucht.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 77, sentence: 'Sie halten keine Rede.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 78, sentence: 'Sie stehen nicht in der Schlange.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 79, sentence: 'Sie knuddeln nicht den Hund.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 80, sentence: 'Sie besuchen keine Frau.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 81, sentence: 'Sie rudern nicht zum Ufer.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 82, sentence: 'Sie fällen keinen Baum.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 83, sentence: 'Sie trinken keinen Wein.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 84, sentence: 'Sie beginnen nicht mit dem Text.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 85, sentence: 'Sie denken nicht an ihre Mutter.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 86, sentence: 'Sie mögen nicht spezielles Bier.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 87, sentence: 'Sie sehen keine Eule.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 88, sentence: 'Sie küssen keine Schauspielerin.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 89, sentence: 'Sie wollen keine Lösung.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 90, sentence: 'Sie überreden nicht den Chef.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 91, sentence: 'Sie fliegen nicht in die USA.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 92, sentence: 'Sie bestellen kein Sofa.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 93, sentence: 'Sie schälen keine Kartoffel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 94, sentence: 'Sie hämmern nicht gegen die Wand.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 95, sentence: 'Sie ziehen keinen Zahn.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 96, sentence: 'Sie klopfen nicht gegen das Tor.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 97, sentence: 'Sie zählen nicht die Schafe.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 98, sentence: 'Sie baden nicht in der Badewanne.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 99, sentence: 'Sie bewundern nicht das Gemälde.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 100, sentence: 'Sie zimmern keine Kommode.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 101, sentence: 'Sie streicheln keine Katze.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 102, sentence: 'Sie sprinten nicht zur Halle.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 103, sentence: 'Sie errichten kein Gebäude.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 104, sentence: 'Sie kaufen keine Trompete.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 105, sentence: 'Sie pflanzen nicht die Tomaten.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 106, sentence: 'Sie sähen nicht die Samen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 107, sentence: 'Sie schmelzen nicht die Butter.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 108, sentence: 'Sie fahren nicht Schlitten.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 109, sentence: 'Sie reisen nicht um die Welt.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 110, sentence: 'Sie speisen nicht im Restaurant.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 111, sentence: 'Sie suchen nach keinem Schlüssel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 112, sentence: 'Sie ändern nicht ihr Aussehen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 113, sentence: 'Sie überzeugen nicht den Mann.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 114, sentence: 'Sie dichten keinen Reim.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 115, sentence: 'Sie knabbern an keiner Karotte.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 116, sentence: 'Sie übernachten nicht bei dem Vater.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0], },
  { sentNum: 117, sentence: 'Sie brechen keine Regel.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 118, sentence: 'Sie recherchieren nicht nach Sängern.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0], },
  { sentNum: 119, sentence: 'Sie wollen kein Auto.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
  { sentNum: 120, sentence: 'Sie füttern kein Kaninchen.', sinn: 'ja', pol: 'neg', corrResp: prms.respKeys[0] },
];

// prettier-ignore
const materials_nein_neg = [
  { sentNum: 121, sentence: 'Sie reiten kein Buch.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 122, sentence: 'Sie heißen keine Rose.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 123, sentence: 'Sie leihen keinen Wurf.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 124, sentence: 'Sie liegen keinen Weg.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 125, sentence: 'Sie pfeifen kein Rohr.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 126, sentence: 'Sie fangen keine Abscheu.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 127, sentence: 'Sie reiben keine Schaukel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 128, sentence: 'Sie reißen nicht den Computer.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 129, sentence: 'Sie rufen kein Blech.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 130, sentence: 'Sie saufen nicht den Fleck.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 131, sentence: 'Sie schaffen nicht das Gummi.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 132, sentence: 'Sie scheren nicht den Sitz.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 133, sentence: 'Sie schieben keinen Raum.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 134, sentence: 'Sie fahren nicht das Müsli.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 135, sentence: 'Sie schießen nicht das Meer.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 136, sentence: 'Sie schleichen nicht den Kuchen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 137, sentence: 'Sie schmeißen keine Strecke.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 138, sentence: 'Sie schreiten nicht das Gestell.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 139, sentence: 'Sie schweigen keine Kanone.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 140, sentence: 'Sie schwimmen keinen Docht.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 141, sentence: 'Sie schwingen kein Loch.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 142, sentence: 'Sie schwören keinen Gärtner.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 143, sentence: 'Sie spinnen keinen Hocker.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 144, sentence: 'Sie sterben nicht den Henkel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 145, sentence: 'Sie stehlen kein Erdbeben.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 146, sentence: 'Sie treiben keinen Besen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 147, sentence: 'Sie wachsen keine Iris.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 148, sentence: 'Sie waschen keinen Gesang.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 149, sentence: 'Sie wissen keine Birne.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 150, sentence: 'Sie bleiben nicht das Gefühl.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 151, sentence: 'Sie gedeihen keine Braut.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 152, sentence: 'Sie fließen nicht das Gedicht.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 153, sentence: 'Sie frieren keine Leiter.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 154, sentence: 'Sie gelten keinen Hahn.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 155, sentence: 'Sie genesen nicht den Wurm.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 156, sentence: 'Sie singen keinen Hund.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 157, sentence: 'Sie geschehen keinen Rat.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 158, sentence: 'Sie klingen keine Ente.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 159, sentence: 'Sie können keine Unterkunft.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 160, sentence: 'Sie laden keine Wimper.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 161, sentence: 'Sie lügen kein Bein.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 162, sentence: 'Sie quellen nicht das Format.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 163, sentence: 'Sie ringen keine Post.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 164, sentence: 'Sie schleifen nicht das Programm.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 165, sentence: 'Sie schlingen nicht den Ausflug.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 166, sentence: 'Sie schwellen nicht das Gestein.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 167, sentence: 'Sie stechen kein Ruder.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 168, sentence: 'Sie stinken keinen Friseur.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 169, sentence: 'Sie trügen keinen Deckel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 170, sentence: 'Sie weben nicht den Kanon.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 171, sentence: 'Sie winden kein Klavier.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 172, sentence: 'Sie zwingen nicht den Ring.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 173, sentence: 'Sie lesen keinen Elefanten.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 174, sentence: 'Sie bauen kein Wasser.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 175, sentence: 'Sie rühren nicht die Lampe.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 176, sentence: 'Sie verbringen nicht das Kamel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 177, sentence: 'Sie weisen nicht die Jacke.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 178, sentence: 'Sie kauen keinen Sinn.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 179, sentence: 'Sie tippen kein Hochhaus.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 180, sentence: 'Sie jonglieren nicht mit Steckdosen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1], },
  { sentNum: 181, sentence: 'Sie ernten nicht das Telefon.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 182, sentence: 'Sie heiraten kein Öl.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 183, sentence: 'Sie lächeln keinen Rollstuhl.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 184, sentence: 'Sie reden nicht den Stift.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 185, sentence: 'Sie tauchen nicht im Papagei.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 186, sentence: 'Sie erfahren keine Maus.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 187, sentence: 'Sie rasieren nicht die Mauer.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 188, sentence: 'Sie kitzeln keinen Prozess.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 189, sentence: 'Sie verschlucken nicht den Fleiß.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 190, sentence: 'Sie rollen nicht die Ehre.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 191, sentence: 'Sie benehmen keine Fantasie.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 192, sentence: 'Sie riechen kein Gedächtnis.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 193, sentence: 'Sie verblüffen nicht den Verlust.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 194, sentence: 'Sie bremsen keinen Teich.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 195, sentence: 'Sie bluten keinen Planeten.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 196, sentence: 'Sie heilen keine Leistung.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 197, sentence: 'Sie hoffen keinen Teig.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 198, sentence: 'Sie erschießen keine Schere.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 199, sentence: 'Sie entführen nicht den Durst.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 200, sentence: 'Sie nähen keinen Feiertag.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 201, sentence: 'Sie parken nicht den Mond.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 202, sentence: 'Sie reinigen nicht die Melodie.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 203, sentence: 'Sie knacken keinen Tropfen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 204, sentence: 'Sie nehmen keinen Himmel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 205, sentence: 'Sie sprechen nicht die Hose.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 206, sentence: 'Sie tun keine Wolke.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 207, sentence: 'Sie galoppieren keinen Eimer.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 208, sentence: 'Sie graben keine Dose.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 209, sentence: 'Sie greifen keinen Zoo.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 210, sentence: 'Sie schwitzen keinen Kocher.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 211, sentence: 'Sie strecken nicht den Fluss.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 212, sentence: 'Sie begeben keine Lippe.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 213, sentence: 'Sie joggen auf keiner Tulpe.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 214, sentence: 'Sie wandern keinen Topf.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 215, sentence: 'Sie aktivieren nicht den Rasen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 216, sentence: 'Sie atmen keinen Käfig.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 217, sentence: 'Sie raten keinen Brenner.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 218, sentence: 'Sie renovieren nicht die Hymne.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 219, sentence: 'Sie decken keine Linse.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 220, sentence: 'Sie hobeln keinen Truthahn.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 221, sentence: 'Sie sägen keine Hängematte.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 222, sentence: 'Sie steigen nicht in die Nadel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 223, sentence: 'Sie gären nicht das Netz.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 224, sentence: 'Sie wickeln keinen Korken.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 225, sentence: 'Sie dürfen keine Binde.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 226, sentence: 'Sie mähen nicht den Atem.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 227, sentence: 'Sie leuchten nicht den Schuh.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 228, sentence: 'Sie blamieren keine Taste.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 229, sentence: 'Sie säubern keinen Sturm.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 230, sentence: 'Sie beenden keine Ziege.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 231, sentence: 'Sie kaschieren keine Torte.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 232, sentence: 'Sie vegetieren keinen Lauf.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 233, sentence: 'Sie schrauben kein Kissen.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 234, sentence: 'Sie flöten keine Pfanne.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 235, sentence: 'Sie fauchen nicht den Ast.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 236, sentence: 'Sie massieren kein Wohnmobil.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 237, sentence: 'Sie kneten kein Geräusch.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 238, sentence: 'Sie kratzen nicht den Ekel.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 239, sentence: 'Sie wühlen keine Ananas.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
  { sentNum: 240, sentence: 'Sie klammern keine Bohne.', sinn: 'nein', pol: 'neg', corrResp: prms.respKeys[1] },
];

// randomly select 60 ja_aff and nein_aff items
// the items for the ja_neg and the nein_neg are the items not selected above
let materials_ja_aff_selected = shuffle(materials_ja_aff);
materials_ja_aff_selected = materials_ja_aff_selected.splice(0, 60);

let materials_nein_aff_selected = shuffle(materials_nein_aff);
materials_nein_aff_selected = materials_nein_aff_selected.splice(0, 60);

let selected_ja_aff = materials_ja_aff_selected.map((o) => o.sentNum);
let materials_ja_neg_selected = [];
for (let i = 0; i < materials_ja_neg.length; i++) {
  if (selected_ja_aff.includes(materials_ja_neg[i].sentNum) === false) {
    materials_ja_neg_selected.push(materials_ja_neg[i]);
  }
}

let selected_nein_aff = materials_nein_aff_selected.map((o) => o.sentNum);
let materials_nein_neg_selected = [];
for (let i = 0; i < materials_nein_neg.length; i++) {
  if (selected_nein_aff.includes(materials_nein_neg[i].sentNum) === false) {
    materials_nein_neg_selected.push(materials_nein_neg[i]);
  }
}

// add the 60 pictures to each of the 4 sentence types
function combinePictures(materials) {
  let imageNumber = [];
  for (let i = 0; i < 60; i++) {
    imageNumber.push(i);
  }
  imageNumber = shuffle(imageNumber);
  for (let i = 0; i < materials.length; i++) {
    materials[i].imageNumber = imageNumber[i] + 1;
    materials[i].imageName = imageFiles[imageNumber[i]].slice(7, -4);
  }
  return materials;
}

materials_ja_aff_selected = combinePictures(materials_ja_aff_selected);
materials_nein_aff_selected = combinePictures(materials_nein_aff_selected);
materials_ja_neg_selected = combinePictures(materials_ja_neg_selected);
materials_nein_neg_selected = combinePictures(materials_nein_neg_selected);

let materials = materials_ja_aff_selected.concat(
  materials_nein_aff_selected,
  materials_ja_neg_selected,
  materials_nein_neg_selected,
);
materials = shuffle(materials);

// split materials into 4 blocks of 60 trials
let materials1 = materials.splice(0, 60);
let materials2 = materials.splice(0, 60);
let materials3 = materials.splice(0, 60);
let materials4 = materials.splice(0, 60);

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

function showPicture(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let num = args['imageNumber'];
  ctx.drawImage(images[num], -images[num].width / 2, -images[num].height / 2);
}

function showSentence(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');

  // draw sentence
  ctx.font = prms.sentenceSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(args['sentence'], 0, 0);
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
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'PictureNegation' });
  },
};

const pic_stim = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  stimulus_onset: 0,
  response_ends_trial: false,
  choices: [],
  trial_duration: prms.picDur,
  func: showPicture,
  func_args: [{ imageNumber: jsPsych.timelineVariable('imageNumber') }],
};

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let correctKey;
  if (dat.response !== null) {
    correctKey = jsPsych.pluginAPI.compareKeys(dat.key_press, dat.corrResp);
  }

  if (correctKey && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (!correctKey && rt > prms.tooFast && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

const sent_stim = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: showSentence,
  func_args: [{ sentence: jsPsych.timelineVariable('sentence') }],
  data: {
    stim: 'PictureNegation',
    imageNumber: jsPsych.timelineVariable('imageNumber'),
    imageName: jsPsych.timelineVariable('imageName'),
    sentNum: jsPsych.timelineVariable('sentNum'),
    sentence: jsPsych.timelineVariable('sentence'),
    sinn: jsPsych.timelineVariable('sinn'),
    pol: jsPsych.timelineVariable('pol'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_timeline1 = {
  timeline: [fixation_cross, pic_stim, sent_stim, trial_feedback, iti],
  timeline_variables: materials1,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

const trial_timeline2 = {
  timeline: [fixation_cross, pic_stim, sent_stim, trial_feedback, iti],
  timeline_variables: materials2,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

const trial_timeline3 = {
  timeline: [fixation_cross, pic_stim, sent_stim, trial_feedback, iti],
  timeline_variables: materials3,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

const trial_timeline4 = {
  timeline: [fixation_cross, pic_stim, sent_stim, trial_feedback, iti],
  timeline_variables: materials4,
  sample: {
    type: 'fixed-repetitions',
    size: 1,
  },
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align:left;'>Vielen Dank für Ihre Teilnahme.</h3>" +
    "<h3 style='text-align:left;'>In unserer Studie untersuchen wir den Einfluss von Bildern auf </h3>" +
    "<h3 style='text-align:left;'>die Verarbeitung von negierten Sätzen. Wenn Sie </h3>" +
    "<h3 style='text-align:left;'>Versuchspersonenstunden (0,5) benötigen, kopieren Sie den folgenden </h3>" +
    "<h3 style='text-align:left;'>zufällig generierten Code und senden Sie diesen zusammen mit Ihrer </h3>" +
    "<h3 style='text-align:left;'>Matrikelnummer per Email an:</h3><br>" +
    '<h2>sarah.ritter@student.uni-tuebingen.de oder </h2>' +
    '<h2>rebekka.hemmrich@student.uni-tuebingen.de </h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(welcome_de);
  exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  exp.push(trial_timeline1);
  exp.push(block_feedback); // show previous block performance
  exp.push(task_reminder); // show response mapping
  exp.push(trial_timeline2);
  exp.push(block_feedback); // show previous block performance
  exp.push(task_reminder); // show response mapping
  exp.push(trial_timeline3);
  exp.push(block_feedback); // show previous block performance
  exp.push(task_reminder); // show response mapping
  exp.push(trial_timeline4);

  exp.push(debrief_de);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + 'data/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
  timeline: EXP,
  show_progress_bar: false,
  exclusions: {
    min_width: canvas_size[0],
    min_height: canvas_size[1],
  },
  on_finish: function () {
    saveData('/Common/write_data.php', data_filename, { stim: 'PictureNegation' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
