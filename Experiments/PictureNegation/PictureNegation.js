// PictureNegation:

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
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
    nTrlsP: 32,  // number of trials in first block (practice)
    nTrlsE: 96,  // number of trials in subsequent blocks 
    nBlks: 1,
    fixDur: 500,
    flankDur: 200,
    fbDur: [500, 1000, 1000, 1000],
    iti: 500,
    tooFast:  150,  
    tooSlow: 2000,  
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respKeys: [],
    fixWidth: 3,
    fixSize: 15,
    flankSize: "50px monospace",
    fbSize: "30px monospace"
};


////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: "<h2 style='text-align:center;'>Willkommen bei unserem Experiment:</h2><br>" 
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: 
    "<h2 style='text-align:center;'>Aufgabe:</h2><br>" 
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
// 120 sentences per category
const materials_ja_aff = [
    { num:   1, satz: "Sie trinken ein Glas Saft.",                      sinn: "ja",   pol: "aff" },
    { num:   2, satz: "Sie werfen einen Ball.",                          sinn: "ja",   pol: "aff" },
    { num:   3, satz: "Sie essen eine Banane.",                          sinn: "ja",   pol: "aff" },
    { num:   4, satz: "Sie laufen jetzt zum See.",                       sinn: "ja",   pol: "aff" },
    { num:   5, satz: "Sie fahren immer zur Oma.",                       sinn: "ja",   pol: "aff" },
    { num:   6, satz: "Sie gehen bald ins Kino.",                        sinn: "ja",   pol: "aff" },
    { num:   7, satz: "Sie braten oft Fleisch.",                         sinn: "ja",   pol: "aff" },
    { num:   8, satz: "Sie kochen eine Suppe.",                          sinn: "ja",   pol: "aff" },
    { num:   9, satz: "Sie läuten eine Glocke.",                         sinn: "ja",   pol: "aff" },
    { num:  10, satz: "Sie schlafen immer im Bett.",                     sinn: "ja",   pol: "aff" },
    { num:  11, satz: "Sie malen ein Bild.",                             sinn: "ja",   pol: "aff" },
    { num:  12, satz: "Sie spielen jetzt Gitarre.",                      sinn: "ja",   pol: "aff" },
    { num:  13, satz: "Sie springen jetzt in die Luft.",                 sinn: "ja",   pol: "aff" },
    { num:  14, satz: "Sie singen ein Lied.",                            sinn: "ja",   pol: "aff" },
    { num:  15, satz: "Sie basteln einen Flieger.",                      sinn: "ja",   pol: "aff" },
    { num:  16, satz: "Sie machen eine Pause.",                          sinn: "ja",   pol: "aff" },
    { num:  17, satz: "Sie bearbeiten eine Aufgabe.",                    sinn: "ja",   pol: "aff" },
    { num:  18, satz: "Sie finden ein Rätsel.",                          sinn: "ja",   pol: "aff" },
    { num:  19, satz: "Sie skizzieren ein Tier.",                        sinn: "ja",   pol: "aff" },
    { num:  20, satz: "Sie zeichnen ein Bild.",                          sinn: "ja",   pol: "aff" },
    { num:  21, satz: "Sie hüpfen jetzt über den Stein.",                sinn: "ja",   pol: "aff" },
    { num:  22, satz: "Sie feiern heute das Jubiläum.",                  sinn: "ja",   pol: "aff" },
    { num:  23, satz: "Sie bauen ein Haus.",                             sinn: "ja",   pol: "aff" },
    { num:  24, satz: "Sie putzen heute das Bad.",                       sinn: "ja",   pol: "aff" },
    { num:  25, satz: "Sie schreiben einen Aufsatz.",                    sinn: "ja",   pol: "aff" },
    { num:  26, satz: "Sie gehen heute in die Kirche.",                  sinn: "ja",   pol: "aff" },
    { num:  27, satz: "Sie essen heute Pizza.",                          sinn: "ja",   pol: "aff" },
    { num:  28, satz: "Sie pflücken viele Erdbeeren.",                   sinn: "ja",   pol: "aff" },
    { num:  29, satz: "Sie biegen einen Draht.",                         sinn: "ja",   pol: "aff" },
    { num:  30, satz: "Sie fahren heute nach Paris.",                    sinn: "ja",   pol: "aff" },
    { num:  31, satz: "Sie bitten jetzt um Hilfe.",                      sinn: "ja",   pol: "aff" },
    { num:  32, satz: "Sie verbrennen ein Papier.",                      sinn: "ja",   pol: "aff" },
    { num:  33, satz: "Sie empfehlen ein Restaurant.",                   sinn: "ja",   pol: "aff" },
    { num:  34, satz: "Sie empfangen einen Gast.",                       sinn: "ja",   pol: "aff" },
    { num:  35, satz: "Sie finden einen Ring.",                          sinn: "ja",   pol: "aff" },
    { num:  36, satz: "Sie fliehen jetzt vor dem Gewitter.",             sinn: "ja",   pol: "aff" },
    { num:  37, satz: "Sie machen jetzt den Abwasch.",                   sinn: "ja",   pol: "aff" },
    { num:  38, satz: "Sie geraten schnell in Stress.",                  sinn: "ja",   pol: "aff" },
    { num:  39, satz: "Sie gewinnen ein Spiel.",                         sinn: "ja",   pol: "aff" },
    { num:  40, satz: "Sie gießen jetzt die Blumen.",                    sinn: "ja",   pol: "aff" },
    { num:  41, satz: "Sie sitzen heute auf dem Balkon.",                sinn: "ja",   pol: "aff" },
    { num:  42, satz: "Sie streicheln eine Katze.",                      sinn: "ja",   pol: "aff" },
    { num:  43, satz: "Sie schauen immer aus dem Fenster.",              sinn: "ja",   pol: "aff" },
    { num:  44, satz: "Sie falten eine Serviette.",                      sinn: "ja",   pol: "aff" },
    { num:  45, satz: "Sie unternehmen eine Wanderung.",                 sinn: "ja",   pol: "aff" },
    { num:  46, satz: "Sie schneiden eine Zwiebel.",                     sinn: "ja",   pol: "aff" },
    { num:  47, satz: "Sie reiten jetzt über den Strand.",               sinn: "ja",   pol: "aff" },
    { num:  48, satz: "Sie pflücken einen Apfel.",                       sinn: "ja",   pol: "aff" },
    { num:  49, satz: "Sie brauchen eine Dusche.",                       sinn: "ja",   pol: "aff" },
    { num:  50, satz: "Sie vergessen einen Termin.",                     sinn: "ja",   pol: "aff" },
    { num:  51, satz: "Sie träumen heute vom Sommer.",                   sinn: "ja",   pol: "aff" },
    { num:  52, satz: "Sie wischen heute den Boden.",                    sinn: "ja",   pol: "aff" },
    { num:  53, satz: "Sie arbeiten jetzt beim Bäcker.",                 sinn: "ja",   pol: "aff" },
    { num:  54, satz: "Sie überfallen eine Bank.",                       sinn: "ja",   pol: "aff" },
    { num:  55, satz: "Sie gründen einen Verein.",                       sinn: "ja",   pol: "aff" },
    { num:  56, satz: "Sie planen einen Urlaub.",                        sinn: "ja",   pol: "aff" },
    { num:  57, satz: "Sie treffen heute ihre Tante.",                   sinn: "ja",   pol: "aff" },
    { num:  58, satz: "Sie leiden an einer Krankheit.",                  sinn: "ja",   pol: "aff" },
    { num:  59, satz: "Sie klauen jetzt das Geld.",                      sinn: "ja",   pol: "aff" },
    { num:  60, satz: "Sie vermieten eine Wohnung.",                     sinn: "ja",   pol: "aff" },
    { num:  61, satz: "Sie treffen heute ihre Familie.",                 sinn: "ja",   pol: "aff" },
    { num:  62, satz: "Sie gehen heute zur Oma.",                        sinn: "ja",   pol: "aff" },
    { num:  63, satz: "Sie benutzen eine Fernbedienung. ",               sinn: "ja",   pol: "aff" },
    { num:  64, satz: "Sie entwerfen eine Strategie." ,                  sinn: "ja",   pol: "aff" },
    { num:  65, satz: "Sie bestimmen heute die Richtung.",               sinn: "ja",   pol: "aff" },
    { num:  66, satz: "Sie flechten einen Zopf.",                        sinn: "ja",   pol: "aff" },
    { num:  67, satz: "Sie finden einen Stein.",                         sinn: "ja",   pol: "aff" },
    { num:  68, satz: "Sie schieben jetzt den Wagen.",                   sinn: "ja",   pol: "aff" },
    { num:  69, satz: "Sie mögen den Kuchen.",                           sinn: "ja",   pol: "aff" },
    { num:  70, satz: "Sie liegen heute auf der Wiese.",                 sinn: "ja",   pol: "aff" },
    { num:  71, satz: "Sie beladen jetzt das Auto.",                     sinn: "ja",   pol: "aff" },
    { num:  72, satz: "Sie meiden heute den Kontakt.",                   sinn: "ja",   pol: "aff" },
    { num:  73, satz: "Sie trinken einen Kaffee.",                       sinn: "ja",   pol: "aff" },
    { num:  74, satz: "Sie essen heute die Lasagne.",                    sinn: "ja",   pol: "aff" },
    { num:  75, satz: "Sie fliegen ein Flugzeug.",                       sinn: "ja",   pol: "aff" },
    { num:  76, satz: "Sie riechen jetzt an der Blume.",                 sinn: "ja",   pol: "aff" },
    { num:  77, satz: "Sie halten eine Rede.",                           sinn: "ja",   pol: "aff" },
    { num:  78, satz: "Sie stehen heute in der Schlange.",               sinn: "ja",   pol: "aff" },
    { num:  79, satz: "Sie knuddeln jetzt den Hund.",                    sinn: "ja",   pol: "aff" },
    { num:  80, satz: "Sie besuchen eine Frau.",                         sinn: "ja",   pol: "aff" },
    { num:  81, satz: "Sie rudern jetzt zum Ufer.",                      sinn: "ja",   pol: "aff" },
    { num:  82, satz: "Sie fällen einen Baum.",                          sinn: "ja",   pol: "aff" },
    { num:  83, satz: "Sie trinken immer Wein.",                         sinn: "ja",   pol: "aff" },
    { num:  84, satz: "Sie beginnen heute mit dem Text." ,               sinn: "ja",   pol: "aff" },
    { num:  85, satz: "Sie denken gerade an ihre Mutter.",               sinn: "ja",   pol: "aff" },
    { num:  86, satz: "Sie mögen sehr spezielles Bier.",                 sinn: "ja",   pol: "aff" },
    { num:  87, satz: "Sie sehen eine Eule.",                            sinn: "ja",   pol: "aff" },
    { num:  88, satz: "Sie küssen eine Schauspielerin.",                 sinn: "ja",   pol: "aff" },
    { num:  89, satz: "Sie wollen eine Lösung.",                         sinn: "ja",   pol: "aff" },
    { num:  90, satz: "Sie überreden heute den Chef.",                   sinn: "ja",   pol: "aff" },
    { num:  91, satz: "Sie fliegen heute in die USA.",                   sinn: "ja",   pol: "aff" },
    { num:  92, satz: "Sie bestellen ein Sofa.",                         sinn: "ja",   pol: "aff" },
    { num:  93, satz: "Sie schälen die Kartoffeln.",                     sinn: "ja",   pol: "aff" },
    { num:  94, satz: "Sie hämmern heute gegen die Wand.",               sinn: "ja",   pol: "aff" },
    { num:  95, satz: "Sie ziehen einen Zahn.",                          sinn: "ja",   pol: "aff" },
    { num:  96, satz: "Sie klopfen heute gegen das Tor.",                sinn: "ja",   pol: "aff" },
    { num:  97, satz: "Sie zählen heute die Schafe.",                    sinn: "ja",   pol: "aff" },
    { num:  98, satz: "Sie baden immer in der Badewanne.",               sinn: "ja",   pol: "aff" },
    { num:  99, satz: "Sie pflücken jetzt die Blumen.",                  sinn: "ja",   pol: "aff" },
    { num: 100, satz: "Sie zimmern eine Kommode.",                       sinn: "ja",   pol: "aff" },
    { num: 101, satz: "Sie streicheln eine Katze.",                      sinn: "ja",   pol: "aff" },
    { num: 102, satz: "Sie sprinten jetzt zur Halle. ",                  sinn: "ja",   pol: "aff" },
    { num: 103, satz: "Sie errichten ein Gebäude.",                      sinn: "ja",   pol: "aff" },
    { num: 104, satz: "Sie kaufen eine Trompete.",                       sinn: "ja",   pol: "aff" },
    { num: 105, satz: "Sie pflanzen heute die Tomaten.",                 sinn: "ja",   pol: "aff" },
    { num: 106, satz: "Sie sähen heute die Samen.",                      sinn: "ja",   pol: "aff" },
    { num: 107, satz: "Sie schmelzen heute die Butter.",                 sinn: "ja",   pol: "aff" },
    { num: 108, satz: "Sie fahren heute Schlitten.",                     sinn: "ja",   pol: "aff" },
    { num: 109, satz: "Sie reisen jetzt um die Welt.",                   sinn: "ja",   pol: "aff" },
    { num: 110, satz: "Sie speisen heute im Restaurant."                 sinn: "ja",   pol: "aff" },
    { num: 111, satz: "Sie suchen nach einem Schlüssel."                 sinn: "ja",   pol: "aff" },
    { num: 112, satz: "Sie ändern heute ihr Aussehen.",                  sinn: "ja",   pol: "aff" },
    { num: 113, satz: "Sie treffen heute viele Leute.",                  sinn: "ja",   pol: "aff" },
    { num: 114, satz: "Sie lesen viele Bücher.",                         sinn: "ja",   pol: "aff" },
    { num: 115, satz: "Sie knabbern an einer Karotte.",                  sinn: "ja",   pol: "aff" },
    { num: 116, satz: "Sie übernachten heute bei ihrem Vater.",          sinn: "ja",   pol: "aff" },
    { num: 117, satz: "Sie treffen heute ihre Schwester.",               sinn: "ja",   pol: "aff" },
    { num: 118, satz: "Sie recherchieren jetzt nach Sängern.",           sinn: "ja",   pol: "aff" },
    { num: 119, satz: "Sie wollen ein Auto.",                            sinn: "ja",   pol: "aff" },
    { num: 120, satz: "Sie füttern ein Kaninchen.",                      sinn: "ja",   pol: "aff" },
]

const materials_nein_aff = {
    { num: 121, satz: "Sie reiten ein Buch.",                            sinn: "nein", pol: "aff" },
    { num: 122, satz: "Sie heißen eine Rose.",                           sinn: "nein", pol: "aff" },
    { num: 123, satz: "Sie leihen einen Wurf.",                          sinn: "nein", pol: "aff" },
    { num: 124, satz: "Sie liegen einen Weg.",                           sinn: "nein", pol: "aff" },
    { num: 125, satz: "Sie pfeifen ein Rohr.",                           sinn: "nein", pol: "aff" },
    { num: 126, satz: "Sie fangen eine Abscheu.",                        sinn: "nein", pol: "aff" },
    { num: 127, satz: "Sie reiben eine Schaukel.",                       sinn: "nein", pol: "aff" },
    { num: 128, satz: "Sie reißen immer den Computer.",                  sinn: "nein", pol: "aff" },
    { num: 129, satz: "Sie rufen ein Blech.",                            sinn: "nein", pol: "aff" },
    { num: 130, satz: "Sie saufen heute den Fleck.",                     sinn: "nein", pol: "aff" },
    { num: 131, satz: "Sie schaff en gerne das Gummi.",                  sinn: "nein", pol: "aff" },
    { num: 132, satz: "Sie scheren immer den Sitz.",                     sinn: "nein", pol: "aff" },
    { num: 133, satz: "Sie schieben einen Raum.",                        sinn: "nein", pol: "aff" },
    { num: 134, satz: "Sie fahren heute das Müsli.",                     sinn: "nein", pol: "aff" },
    { num: 135, satz: "Sie schießen gerne das Meer.",                    sinn: "nein", pol: "aff" },
    { num: 136, satz: "Sie schleichen nun den Kuchen.",                  sinn: "nein", pol: "aff" },
    { num: 137, satz: "Sie schmeißen eine Strecke.",                     sinn: "nein", pol: "aff" },
    { num: 138, satz: "Sie schreiten gerne das Gestell.",                sinn: "nein", pol: "aff" },
    { num: 139, satz: "Sie schweigen eine Kanone.",                      sinn: "nein", pol: "aff" },
    { num: 140, satz: "Sie schwimmen einen Docht.",                      sinn: "nein", pol: "aff" },
    { num: 141, satz: "Sie schwingen ein Loch.",                         sinn: "nein", pol: "aff" },
    { num: 142, satz: "Sie schwören ein Gericht.",                       sinn: "nein", pol: "aff" },
    { num: 143, satz: "Sie spinnen einen Hocker.",                       sinn: "nein", pol: "aff" },
    { num: 144, satz: "Sie sterben jetzt den Henkel.",                   sinn: "nein", pol: "aff" },
    { num: 145, satz: "Sie stehlen ein Erdbeben.",                       sinn: "nein", pol: "aff" },
    { num: 146, satz: "Sie treiben einen Besen.",                        sinn: "nein", pol: "aff" },
    { num: 147, satz: "Sie wachsen ein Kabel.",                          sinn: "nein", pol: "aff" },
    { num: 148, satz: "Sie waschen einen Gesang.",                       sinn: "nein", pol: "aff" },
    { num: 149, satz: "Sie wissen eine Birne.",                          sinn: "nein", pol: "aff" },
    { num: 150, satz: "Sie bleiben heute das Gefühl.",                   sinn: "nein", pol: "aff" },
    { num: 151, satz: "Sie gedeihen eine Braut.",                        sinn: "nein", pol: "aff" },
    { num: 152, satz: "Sie fließen gerne das Gedicht.",                  sinn: "nein", pol: "aff" },
    { num: 153, satz: "Sie frieren eine Leiter.",                        sinn: "nein", pol: "aff" },
    { num: 154, satz: "Sie gelten einen Hahn.",                          sinn: "nein", pol: "aff" },
    { num: 155, satz: "Sie genesen heute den Wurm.",                     sinn: "nein", pol: "aff" },
    { num: 156, satz: "Sie singen einen Hund.",                          sinn: "nein", pol: "aff" },
    { num: 157, satz: "Sie geschehen einen Rat.",                        sinn: "nein", pol: "aff" },
    { num: 158, satz: "Sie klingen eine Ente.",                          sinn: "nein", pol: "aff" },
    { num: 159, satz: "Sie können eine Unterkunft.",                     sinn: "nein", pol: "aff" },
    { num: 160, satz: "Sie laden eine Wimper.",                          sinn: "nein", pol: "aff" },
    { num: 161, satz: "Sie lügen ein Bein.",                             sinn: "nein", pol: "aff" },
    { num: 162, satz: "Sie quellen heute das Format.",                   sinn: "nein", pol: "aff" },
    { num: 163, satz: "Sie ringen eine Post.",                           sinn: "nein", pol: "aff" },
    { num: 164, satz: "Sie schleifen jetzt das Programm.",               sinn: "nein", pol: "aff" },
    { num: 165, satz: "Sie schlingen heute den Ausflug.",                sinn: "nein", pol: "aff" },
    { num: 166, satz: "Sie schwellen nun das Gestein. ",                 sinn: "nein", pol: "aff" },
    { num: 167, satz: "Sie stechen ein Ruder.",                          sinn: "nein", pol: "aff" },
    { num: 168, satz: "Sie stinken einen Friseur.",                      sinn: "nein", pol: "aff" },
    { num: 169, satz: "Sie trügen einen Deckel.",                        sinn: "nein", pol: "aff" },
    { num: 170, satz: "Sie weben heute den Kanon.",                      sinn: "nein", pol: "aff" },
    { num: 171, satz: "Sie winden ein Klavier.",                         sinn: "nein", pol: "aff" },
    { num: 172, satz: "Sie zwingen heute den Ring.",                     sinn: "nein", pol: "aff" },
    { num: 173, satz: "Sie lesen einen Elefanten.",                      sinn: "nein", pol: "aff" },
    { num: 174, satz: "Sie bauen ein Wasser.",                           sinn: "nein", pol: "aff" },
    { num: 175, satz: "Sie rühren heute die Lampe.",                     sinn: "nein", pol: "aff" },
    { num: 176, satz: "Sie verbringen heute das Kamel.",                 sinn: "nein", pol: "aff" },
    { num: 177, satz: "Sie weisen immer die Jacke.",                     sinn: "nein", pol: "aff" },
    { num: 178, satz: "Sie kauen einen Sinn.",                           sinn: "nein", pol: "aff" },
    { num: 179, satz: "Sie tippen ein Hochhaus.",                        sinn: "nein", pol: "aff" },
    { num: 180, satz: "Sie jonglieren heute mit Steckdosen.",            sinn: "nein", pol: "aff" },
    { num: 181, satz: "Sie ernten jetzt das Telefon.",                   sinn: "nein", pol: "aff" },
    { num: 182, satz: "Sie heiraten ein Öl.",                            sinn: "nein", pol: "aff" },
    { num: 183, satz: "Sie lächeln einen Rollstuhl.",                    sinn: "nein", pol: "aff" },
    { num: 184, satz: "Sie reden jetzt einen Stift.",                    sinn: "nein", pol: "aff" },
    { num: 185, satz: "Sie tauchen heute im Papagei.",                   sinn: "nein", pol: "aff" },
    { num: 186, satz: "Sie erfahren jetzt eine Maus.",                   sinn: "nein", pol: "aff" },
    { num: 187, satz: "Sie rasieren heute die Mauer.",                   sinn: "nein", pol: "aff" },
    { num: 188, satz: "Sie kitzeln einen Prozess.",                      sinn: "nein", pol: "aff" },
    { num: 189, satz: "Sie verschlucken heute den Fleiß.",               sinn: "nein", pol: "aff" },
    { num: 190, satz: "Sie rollen heute die Ehre.",                      sinn: "nein", pol: "aff" },
    { num: 191, satz: "Sie benehmen eine Fantasie.",                     sinn: "nein", pol: "aff" },
    { num: 192, satz: "Sie riechen ein Gedächtnis.",                     sinn: "nein", pol: "aff" },
    { num: 193, satz: "Sie verblüffen heute den Verlust.",               sinn: "nein", pol: "aff" },
    { num: 194, satz: "Sie bremsen einen Teich.",                        sinn: "nein", pol: "aff" },
    { num: 195, satz: "Sie bluten einen Planeten.",                      sinn: "nein", pol: "aff" },
    { num: 196, satz: "Sie heilen eine Leistung.",                       sinn: "nein", pol: "aff" },
    { num: 197, satz: "Sie hoffen einen Teig.",                          sinn: "nein", pol: "aff" },
    { num: 198, satz: "Sie erschießen eine Schere.",                     sinn: "nein", pol: "aff" },
    { num: 199, satz: "Sie entführen immer den Durst.",                  sinn: "nein", pol: "aff" },
    { num: 200, satz: "Sie nähen einen Feiertag.",                       sinn: "nein", pol: "aff" },
    { num: 201, satz: "Sie parken heute den Mond.",                      sinn: "nein", pol: "aff" },
    { num: 202, satz: "Sie reinigen heute die Melodie.",                 sinn: "nein", pol: "aff" },
    { num: 203, satz: "Sie knacken einen Tropfen.",                      sinn: "nein", pol: "aff" },
    { num: 204, satz: "Sie nehmen einen Himmel.",                        sinn: "nein", pol: "aff" },
    { num: 205, satz: "Sie sprechen heute die Hose.",                    sinn: "nein", pol: "aff" },
    { num: 206, satz: "Sie tun eine Wolke.",                             sinn: "nein", pol: "aff" },
    { num: 213, satz: "Sie joggen auf eine Tulpe.",                      sinn: "nein", pol: "aff" },
    { num: 214, satz: "Sie wandern einen Topf.",                         sinn: "nein", pol: "aff" },
    { num: 215, satz: "Sie aktivieren immer den Rasen.",                 sinn: "nein", pol: "aff" },
    { num: 216, satz: "Sie atmen einen Käfig.",                          sinn: "nein", pol: "aff" },
    { num: 217, satz: "Sie raten einen Brenner.",                        sinn: "nein", pol: "aff" },
    { num: 218, satz: "Sie renovieren jetzt die Hymne.",                 sinn: "nein", pol: "aff" },
    { num: 219, satz: "Sie decken eine Linse.",                          sinn: "nein", pol: "aff" },
    { num: 220, satz: "Sie hobeln einen Truthahn.",                      sinn: "nein", pol: "aff" },
    { num: 221, satz: "Sie sägen eine Hängematte.",                      sinn: "nein", pol: "aff" },
    { num: 222, satz: "Sie steigen jetzt in die Nadel.",                 sinn: "nein", pol: "aff" },
    { num: 223, satz: "Sie gären heute das Netz.",                       sinn: "nein", pol: "aff" },
    { num: 224, satz: "Sie wickeln einen Korken.",                       sinn: "nein", pol: "aff" },
    { num: 226, satz: "Sie mähen immer den Atem.",                       sinn: "nein", pol: "aff" },
    { num: 227, satz: "Sie leuchten heute den Schuh.",                   sinn: "nein", pol: "aff" },
    { num: 228, satz: "Sie blamieren eine Taste.",                       sinn: "nein", pol: "aff" },
    { num: 229, satz: "Sie säubern einen Sturm.",                        sinn: "nein", pol: "aff" },
    { num: 230, satz: "Sie beenden eine Ziege.",                         sinn: "nein", pol: "aff" },
    { num: 231, satz: "Sie kaschieren eine Torte.",                      sinn: "nein", pol: "aff" },
    { num: 232, satz: "Sie vegetieren einen Lauf.",                      sinn: "nein", pol: "aff" },
    { num: 233, satz: "Sie schrauben ein Kissen.",                       sinn: "nein", pol: "aff" },
    { num: 234, satz: "Sie flöten eine Pfanne.",                         sinn: "nein", pol: "aff" },
    { num: 235, satz: "Sie fauchen heute den Ast.",                      sinn: "nein", pol: "aff" },
    { num: 236, satz: "Sie massieren ein Wohnmobil.",                    sinn: "nein", pol: "aff" },
    { num: 237, satz: "Sie kneten nun ein Geräusch.",                    sinn: "nein", pol: "aff" },
    { num: 238, satz: "Sie kratzen heute den Ekel.",                     sinn: "nein", pol: "aff" },
    { num: 239, satz: "Sie wühlen eine Ananas.",                         sinn: "nein", pol: "aff" },
    { num: 240, satz: "Sie klammern eine Bohne.",                        sinn: "nein", pol: "aff" }
]

const materials_ja_neg = {
    { num:   1, satz: "Sie trinken kein Glas Saft.",                     sinn: "ja",   pol: "neg" },
    { num:   2, satz: "Sie werfen keinen Ball.",                         sinn: "ja",   pol: "neg" },
    { num:   3, satz: "Sie essen keine Banane.",                         sinn: "ja",   pol: "neg" },
    { num:   4, satz: "Sie laufen nicht zum See.",                       sinn: "ja",   pol: "neg" },
    { num:   5, satz: "Sie fahren nicht zur Oma.",                       sinn: "ja",   pol: "neg" },
    { num:   6, satz: "Sie gehen nicht ins Kino.",                       sinn: "ja",   pol: "neg" },
    { num:   7, satz: "Sie braten kein Fleisch.",                        sinn: "ja",   pol: "neg" },
    { num:   8, satz: "Sie kochen keine Suppe.",                         sinn: "ja",   pol: "neg" },
    { num:   9, satz: "Sie läuten keine Glocke.",                        sinn: "ja",   pol: "neg" },
    { num:  10, satz: "Sie schlafen nicht im Bett.",                     sinn: "ja",   pol: "neg" },
    { num:  11, satz: "Sie malen kein Bild.",                            sinn: "ja",   pol: "neg" },
    { num:  12, satz: "Sie spielen nicht Gitarre.",                      sinn: "ja",   pol: "neg" },
    { num:  13, satz: "Sie springen nicht in die Luft.",                 sinn: "ja",   pol: "neg" },
    { num:  14, satz: "Sie singen kein Lied.",                           sinn: "ja",   pol: "neg" },
    { num:  15, satz: "Sie basteln keinen Flieger.",                     sinn: "ja",   pol: "neg" },
    { num:  16, satz: "Sie machen keine Pause.",                         sinn: "ja",   pol: "neg" },
    { num:  17, satz: "Sie bearbeiten keine Aufgabe.",                   sinn: "ja",   pol: "neg" },
    { num:  18, satz: "Sie finden kein Rätsel.",                         sinn: "ja",   pol: "neg" },
    { num:  19, satz: "Sie skizzieren kein Tier.",                       sinn: "ja",   pol: "neg" },
    { num:  20, satz: "Sie zeichnen kein Bild.",                         sinn: "ja",   pol: "neg" },
    { num:  21, satz: "Sie hüpfen nicht über den Stein.",                sinn: "ja",   pol: "neg" },
    { num:  22, satz: "Sie feiern heute kein Jubiläum.",                 sinn: "ja",   pol: "neg" },
    { num:  23, satz: "Sie bauen kein Haus.",                            sinn: "ja",   pol: "neg" },
    { num:  24, satz: "Sie putzen nicht das Bad.",                       sinn: "ja",   pol: "neg" },
    { num:  25, satz: "Sie schreiben keinen Aufsatz.",                   sinn: "ja",   pol: "neg" },
    { num:  26, satz: "Sie gehen nicht in die Kirche.",                  sinn: "ja",   pol: "neg" },
    { num:  27, satz: "Sie essen keine Pizza.",                          sinn: "ja",   pol: "neg" },
    { num:  28, satz: "Sie pflücken keine Erdbeeren.",                   sinn: "ja",   pol: "neg" },
    { num:  29, satz: "Sie biegen keinen Draht.",                        sinn: "ja",   pol: "neg" },
    { num:  30, satz: "Sie fahren nicht nach Paris.",                    sinn: "ja",   pol: "neg" },
    { num:  31, satz: "Sie bitten nicht um Hilfe.",                      sinn: "ja",   pol: "neg" },
    { num:  32, satz: "Sie verbrennen kein Papier.",                     sinn: "ja",   pol: "neg" },
    { num:  33, satz: "Sie empfiehlen kein Restaurant.",                 sinn: "ja",   pol: "neg" },
    { num:  34, satz: "Sie empfangen keinen Gast.",                      sinn: "ja",   pol: "neg" },
    { num:  35, satz: "Sie finden keinen Ring.",                         sinn: "ja",   pol: "neg" },
    { num:  36, satz: "Sie fliehen nicht vor dem Gewitter.",             sinn: "ja",   pol: "neg" },
    { num:  37, satz: "Sie machen nicht den Abwasch.",                   sinn: "ja",   pol: "neg" },
    { num:  38, satz: "Sie geraten nicht in Stress.",                    sinn: "ja",   pol: "neg" },
    { num:  39, satz: "Sie gewinnen kein Spiel.",                        sinn: "ja",   pol: "neg" },
    { num:  40, satz: "Sie gießen nicht die Blumen.",                    sinn: "ja",   pol: "neg" },
    { num:  41, satz: "Sie sitzen nicht auf dem Balkon.",                sinn: "ja",   pol: "neg" },
    { num:  42, satz: "Sie streicheln keine Katze.",                     sinn: "ja",   pol: "neg" },
    { num:  43, satz: "Sie schauen nicht aus dem Fenster.",              sinn: "ja",   pol: "neg" },
    { num:  44, satz: "Sie falten keine Serviette.",                     sinn: "ja",   pol: "neg" },
    { num:  45, satz: "Sie unternehmen keine Wanderung.",                sinn: "ja",   pol: "neg" },
    { num:  46, satz: "Sie schneiden keine Zwiebel.",                    sinn: "ja",   pol: "neg" },
    { num:  47, satz: "Sie reiten nicht über den Strand.",               sinn: "ja",   pol: "neg" },
    { num:  48, satz: "Sie pflücken keinen Apfel.",                      sinn: "ja",   pol: "neg" },
    { num:  49, satz: "Sie brauchen keine Dusche.",                      sinn: "ja",   pol: "neg" },
    { num:  50, satz: "Sie vergessen keinen Termin.",                    sinn: "ja",   pol: "neg" },
    { num:  51, satz: "Sie träumen nicht vom Sommer.",                   sinn: "ja",   pol: "neg" },
    { num:  52, satz: "Sie wischen nicht den Boden.",                    sinn: "ja",   pol: "neg" },
    { num:  53, satz: "Sie arbeiten nicht beim Bäcker.",                 sinn: "ja",   pol: "neg" },
    { num:  54, satz: "Sie überfallen keine Bank.",                      sinn: "ja",   pol: "neg" },
    { num:  55, satz: "Sie gründen keinen Verein.",                      sinn: "ja",   pol: "neg" },
    { num:  56, satz: "Sie planen keinen Urlaub.",                       sinn: "ja",   pol: "neg" },
    { num:  57, satz: "Sie treffen nicht ihre Tante.",                   sinn: "ja",   pol: "neg" },
    { num:  58, satz: "Sie leiden an keiner Krankheit.",                 sinn: "ja",   pol: "neg" },
    { num:  59, satz: "Sie klauen nicht das Geld.",                      sinn: "ja",   pol: "neg" },
    { num:  60, satz: "Sie vermieten keine Wohnung.",                    sinn: "ja",   pol: "neg" },
    { num:  61, satz: "Sie treffen nicht ihre Familie.",                 sinn: "ja",   pol: "neg" },
    { num:  62, satz: "Sie gehen nicht zur Oma.",                        sinn: "ja",   pol: "neg" },
    { num:  63, satz: "Sie benutzen keine Fernbedienung.",               sinn: "ja",   pol: "neg" },
    { num:  64, satz: "Sie entwerfen keine Strategie.",                  sinn: "ja",   pol: "neg" },
    { num:  65, satz: "Sie bestimmen nicht die Richtung.",               sinn: "ja",   pol: "neg" },
    { num:  66, satz: "Sie flechten keinen Zopf.",                       sinn: "ja",   pol: "neg" },
    { num:  67, satz: "Sie finden keinen Stein.",                        sinn: "ja",   pol: "neg" },
    { num:  68, satz: "Sie schieben nicht den Wagen.",                   sinn: "ja",   pol: "neg" },
    { num:  69, satz: "Sie mögen keinen Kuchen.",                        sinn: "ja",   pol: "neg" },
    { num:  70, satz: "Sie liegen nicht auf der Wiese.",                 sinn: "ja",   pol: "neg" },
    { num:  71, satz: "Sie beladen nicht das Auto.",                     sinn: "ja",   pol: "neg" },
    { num:  72, satz: "Sie meiden nicht den Kontakt.",                   sinn: "ja",   pol: "neg" },
    { num:  73, satz: "Sie trinken keinen Kaffee.",                      sinn: "ja",   pol: "neg" },
    { num:  74, satz: "Sie essen nicht die Lasagne.",                    sinn: "ja",   pol: "neg" },
    { num:  75, satz: "Sie fliegen kein Flugzeug.",                      sinn: "ja",   pol: "neg" },
    { num:  76, satz: "Sie riechen nicht an der Blume.",                 sinn: "ja",   pol: "neg" },
    { num:  77, satz: "Sie halten keine Rede.",                          sinn: "ja",   pol: "neg" },
    { num:  78, satz: "Sie stehen nicht in der Schlange.",               sinn: "ja",   pol: "neg" },
    { num:  79, satz: "Sie knuddeln nicht den Hund.",                    sinn: "ja",   pol: "neg" },
    { num:  80, satz: "Sie besuchen keine Frau.",                        sinn: "ja",   pol: "neg" },
    { num:  81, satz: "Sie rudern nicht zum Ufer.",                      sinn: "ja",   pol: "neg" },
    { num:  82, satz: "Sie fällen keinen Baum.",                         sinn: "ja",   pol: "neg" },
    { num:  83, satz: "Sie trinken keinen Wein.",                        sinn: "ja",   pol: "neg" },
    { num:  84, satz: "Sie beginnen nicht mit dem Text." ,               sinn: "ja",   pol: "neg" },
    { num:  85, satz: "Sie denken nicht an ihre Mutter.",                sinn: "ja",   pol: "neg" },
    { num:  86, satz: "Sie mögen kein spezielles Bier.",                 sinn: "ja",   pol: "neg" },
    { num:  87, satz: "Sie sehen keine Eule.",                           sinn: "ja",   pol: "neg" },
    { num:  88, satz: "Sie küssen keine Schauspielerin.",                sinn: "ja",   pol: "neg" },
    { num:  89, satz: "Sie wollen keine Lösung.",                        sinn: "ja",   pol: "neg" },
    { num:  90, satz: "Sie überreden nicht den Chef.",                   sinn: "ja",   pol: "neg" },
    { num:  91, satz: "Sie fliegen nicht in die USA.",                   sinn: "ja",   pol: "neg" },
    { num:  92, satz: "Sie bestellt kein Sofa.",                         sinn: "ja",   pol: "neg" },
    { num:  93, satz: "Sie schälen keine Kartoffeln.",                   sinn: "ja",   pol: "neg" },
    { num:  94, satz: "Sie hämmern nicht gegen die Wand.",               sinn: "ja",   pol: "neg" },
    { num:  95, satz: "Sie ziehen keinen Zahn.",                         sinn: "ja",   pol: "neg" },
    { num:  96, satz: "Sie klopfen nicht gegen das Tor.",                sinn: "ja",   pol: "neg" },
    { num:  97, satz: "Sie zählen nicht die Schafe.",                    sinn: "ja",   pol: "neg" },
    { num:  98, satz: "Sie baden nicht in der Badewanne.",               sinn: "ja",   pol: "neg" },
    { num:  99, satz: "Sie pflücken nicht die Blumen.",                  sinn: "ja",   pol: "neg" },
    { num: 100, satz: "Sie zimmern keine Kommode.",                      sinn: "ja",   pol: "neg" },
    { num: 101, satz: "Sie streicheln keine Katze.",                     sinn: "ja",   pol: "neg" },
    { num: 102, satz: "Sie sprinten nicht zur Halle. ",                  sinn: "ja",   pol: "neg" },
    { num: 103, satz: "Sie errichten kein Gebäude.",                     sinn: "ja",   pol: "neg" },
    { num: 104, satz: "Sie kaufen keine Trompete.",                      sinn: "ja",   pol: "neg" },
    { num: 105, satz: "Sie pflanzen nicht die Tomaten.",                 sinn: "ja",   pol: "neg" },
    { num: 106, satz: "Sie sähen nicht die Samen.",                      sinn: "ja",   pol: "neg" },
    { num: 107, satz: "Sie schmelzen nicht die Butter.",                 sinn: "ja",   pol: "neg" },
    { num: 108, satz: "Sie fahren nicht Schlitten.",                     sinn: "ja",   pol: "neg" },
    { num: 109, satz: "Sie reisen nicht um die Welt.",                   sinn: "ja",   pol: "neg" },
    { num: 110, satz: "Sie speisen nicht im Restaurant."                 sinn: "ja",   pol: "neg" },
    { num: 111, satz: "Sie suchen nach keinem Schlüssel.",               sinn: "ja",   pol: "neg" },
    { num: 112, satz: "Sie ändern nicht ihr Aussehen.",                  sinn: "ja",   pol: "neg" },
    { num: 113, satz: "Sie treffen nicht viele Leute.",                  sinn: "ja",   pol: "neg" },
    { num: 114, satz: "Sie lesen keine Bücher.",                         sinn: "ja",   pol: "neg" },
    { num: 115, satz: "Sie knabbern an keiner Karotte.",                 sinn: "ja",   pol: "neg" },
    { num: 116, satz: "Sie übernachten nicht bei ihrem Vater.",          sinn: "ja",   pol: "neg" },
    { num: 117, satz: "Sie treffen nicht ihre Schwester.",               sinn: "ja",   pol: "neg" },
    { num: 118, satz: "Sie recherchieren nicht nach Sängern.",           sinn: "ja",   pol: "neg" },
    { num: 119, satz: "Sie wollen kein Auto.",                           sinn: "ja",   pol: "neg" },
    { num: 120, satz: "Sie füttern kein Kaninchen.",                     sinn: "ja",   pol: "neg" },
]

const materials_nein_neg = {
    { num: 121, satz: "Sie reiten kein Buch.",                           sinn: "nein", pol: "neg" },
    { num: 122, satz: "Sie heißen keine Rose.",                          sinn: "nein", pol: "neg" },
    { num: 123, satz: "Sie leihen keinen Wurf.",                         sinn: "nein", pol: "neg" },
    { num: 124, satz: "Sie liegen keinen Weg.",                          sinn: "nein", pol: "neg" },
    { num: 125, satz: "Sie pfeifen kein Rohr." ,                         sinn: "nein", pol: "neg" },
    { num: 126, satz: "Sie fangen keine Abscheu.",                       sinn: "nein", pol: "neg" },
    { num: 127, satz: "Sie reiben keine Schaukel.",                      sinn: "nein", pol: "neg" },
    { num: 128, satz: "Sie reißen nicht den Computer.",                  sinn: "nein", pol: "neg" },
    { num: 129, satz: "Sie rufen kein Blech.",                           sinn: "nein", pol: "neg" },
    { num: 130, satz: "Sie saufen nicht den Fleck.",                     sinn: "nein", pol: "neg" },
    { num: 131, satz: "Sie schaff en nicht das Gummi.",                  sinn: "nein", pol: "neg" },
    { num: 132, satz: "Sie scheren nicht den Sitz.",                     sinn: "nein", pol: "neg" },
    { num: 133, satz: "Sie schieben keinen Raum.",                       sinn: "nein", pol: "neg" },
    { num: 134, satz: "Sie fahren nicht das Müsli.",                     sinn: "nein", pol: "neg" },
    { num: 135, satz: "Sie schießen nicht das Meer.",                    sinn: "nein", pol: "neg" },
    { num: 136, satz: "Sie schleichen nicht den Kuchen.",                sinn: "nein", pol: "neg" },
    { num: 137, satz: "Sie schmeißen keine Strecke.",                    sinn: "nein", pol: "neg" },
    { num: 138, satz: "Sie schreiten nicht das Gestell.",                sinn: "nein", pol: "neg" },
    { num: 139, satz: "Sie schweigen keine Kanone.",                     sinn: "nein", pol: "neg" },
    { num: 140, satz: "Sie schwimmen keinen Docht.",                     sinn: "nein", pol: "neg" },
    { num: 141, satz: "Sie schwingen kein Loch.",                        sinn: "nein", pol: "neg" },
    { num: 142, satz: "Sie schwören kein Gericht.",                      sinn: "nein", pol: "neg" },
    { num: 143, satz: "Sie spinnen keinen Hocker.",                      sinn: "nein", pol: "neg" },
    { num: 144, satz: "Sie sterben nicht den Henkel.",                   sinn: "nein", pol: "neg" },
    { num: 145, satz: "Sie stehlen kein Erdbeben.",                      sinn: "nein", pol: "neg" },
    { num: 146, satz: "Sie treiben keinen Besen.",                       sinn: "nein", pol: "neg" },
    { num: 147, satz: "Sie wachsen kein Kabel.",                         sinn: "nein", pol: "neg" },
    { num: 148, satz: "Sie waschen keinen Gesang.",                      sinn: "nein", pol: "neg" },
    { num: 149, satz: "Sie wissen keine Birne.",                         sinn: "nein", pol: "neg" },
    { num: 150, satz: "Sie bleiben nicht das Gefühl.",                   sinn: "nein", pol: "neg" },
    { num: 151, satz: "Sie gedeiht keine Braut.",                        sinn: "nein", pol: "neg" },
    { num: 152, satz: "Sie fließen nicht das Gedicht.",                  sinn: "nein", pol: "neg" },
    { num: 153, satz: "Sie frieren keine Leiter.",                       sinn: "nein", pol: "neg" },
    { num: 154, satz: "Sie gelten keinen Hahn.",                         sinn: "nein", pol: "neg" },
    { num: 155, satz: "Sie genesen nicht den Wurm.",                     sinn: "nein", pol: "neg" },
    { num: 156, satz: "Sie singen keinen Hund.",                         sinn: "nein", pol: "neg" },
    { num: 157, satz: "Sie geschehen keinen Rat.",                       sinn: "nein", pol: "neg" },
    { num: 158, satz: "Sie klingen keine Ente.",                         sinn: "nein", pol: "neg" },
    { num: 159, satz: "Sie können keine Unterkunft.",                    sinn: "nein", pol: "neg" },
    { num: 160, satz: "Sie laden keine Wimper.",                         sinn: "nein", pol: "neg" },
    { num: 161, satz: "Sie lügen kein Bein.",                            sinn: "nein", pol: "neg" },
    { num: 162, satz: "Sie quellen nicht das Format.",                   sinn: "nein", pol: "neg" },
    { num: 163, satz: "Sie ringen keine Post.",                          sinn: "nein", pol: "neg" },
    { num: 164, satz: "Sie schleifen nicht das Programm.",               sinn: "nein", pol: "neg" },
    { num: 165, satz: "Sie schlingen nicht den Ausflug.",                sinn: "nein", pol: "neg" },
    { num: 166, satz: "Sie schwellen nicht das Gestein.",                sinn: "nein", pol: "neg" },
    { num: 167, satz: "Sie stechen kein Ruder.",                         sinn: "nein", pol: "neg" },
    { num: 168, satz: "Sie stinken keinen Friseur.",                     sinn: "nein", pol: "neg" },
    { num: 169, satz: "Sie trügen keinen Deckel.",                       sinn: "nein", pol: "neg" },
    { num: 170, satz: "Sie weben nicht den Kanon.",                      sinn: "nein", pol: "neg" },
    { num: 171, satz: "Sie winden kein Klavier.",                        sinn: "nein", pol: "neg" },
    { num: 172, satz: "Sie zwingen nicht den Ring.",                     sinn: "nein", pol: "neg" },
    { num: 173, satz: "Sie lesen keinen Elefanten.",                     sinn: "nein", pol: "neg" },
    { num: 174, satz: "Sie bauen kein Wasser.",                          sinn: "nein", pol: "neg" },
    { num: 175, satz: "Sie rühren nicht die Lampe.",                     sinn: "nein", pol: "neg" },
    { num: 176, satz: "Sie verbringen nicht das Kamel.",                 sinn: "nein", pol: "neg" },
    { num: 177, satz: "Sie weisen nicht die Jacke.",                     sinn: "nein", pol: "neg" },
    { num: 178, satz: "Sie kauen keinen Sinn.",                          sinn: "nein", pol: "neg" },
    { num: 179, satz: "Sie tippen kein Hochhaus.",                       sinn: "nein", pol: "neg" },
    { num: 180, satz: "Sie jonglieren nicht mit Steckdosen.",            sinn: "nein", pol: "neg" },
    { num: 181, satz: "Sie ernten nicht das Telefon.",                   sinn: "nein", pol: "neg" },
    { num: 182, satz: "Sie heiraten kein Öl.",                           sinn: "nein", pol: "neg" },
    { num: 183, satz: "Sie lächeln keinen Rollstuhl.",                   sinn: "nein", pol: "neg" },
    { num: 184, satz: "Sie reden nicht einen Stift.",                    sinn: "nein", pol: "neg" },
    { num: 185, satz: "Sie tauchen nicht im Papagei.",                   sinn: "nein", pol: "neg" },
    { num: 186, satz: "Sie erfahren nicht eine Maus.",                   sinn: "nein", pol: "neg" },
    { num: 187, satz: "Sie rasieren nicht die Mauer.",                   sinn: "nein", pol: "neg" },
    { num: 188, satz: "Sie kitzeln keinen Prozess",                      sinn: "nein", pol: "neg" },
    { num: 189, satz: "Sie verschlucken nicht den Fleiß.",               sinn: "nein", pol: "neg" },
    { num: 190, satz: "Sie rollen nicht die Ehre.",                      sinn: "nein", pol: "neg" },
    { num: 191, satz: "Sie benehmen keine Fantasie.",                    sinn: "nein", pol: "neg" },
    { num: 192, satz: "Sie riechen kein Gedächtnis.",                    sinn: "nein", pol: "neg" },
    { num: 193, satz: "Sie verblüffen nicht den Verlust.",               sinn: "nein", pol: "neg" },
    { num: 194, satz: "Sie bremsen keinen Teppich.",                     sinn: "nein", pol: "neg" },
    { num: 195, satz: "Sie bluten keinen Planeten.",                     sinn: "nein", pol: "neg" },
    { num: 196, satz: "Sie heilen keine Leistung.",                      sinn: "nein", pol: "neg" },
    { num: 197, satz: "Sie hoffen keinen Teig.",                         sinn: "nein", pol: "neg" },
    { num: 198, satz: "Sie erschießen keine Schere.",                    sinn: "nein", pol: "neg" },
    { num: 199, satz: "Sie entführen nicht den Durst.",                  sinn: "nein", pol: "neg" },
    { num: 200, satz: "Sie nähen keinen Feiertag.",                      sinn: "nein", pol: "neg" },
    { num: 202, satz: "Sie reinigen nicht die Melodie.",                 sinn: "nein", pol: "neg" },
    { num: 203, satz: "Sie knacken keinen Tropfen.",                     sinn: "nein", pol: "neg" },
    { num: 204, satz: "Sie nehmen keinen Himmel.",                       sinn: "nein", pol: "neg" },
    { num: 205, satz: "Sie sprechen nicht die Hose.",                    sinn: "nein", pol: "neg" },
    { num: 206, satz: "Sie tun keine Wolke.",                            sinn: "nein", pol: "neg" },
    { num: 207, satz: "Sie galoppoeren keinen Eimer.",                   sinn: "nein", pol: "neg" },
    { num: 208, satz: "Sie graben keine Dose.",                          sinn: "nein", pol: "neg" },
    { num: 209, satz: "Sie greifen keinen Zoo.",                         sinn: "nein", pol: "neg" },
    { num: 210, satz: "Sie schwitzen keinen Kocher.",                    sinn: "nein", pol: "neg" },
    { num: 211, satz: "Sie strecken nicht den Fluss.",                   sinn: "nein", pol: "neg" },
    { num: 212, satz: "Sie begeben keine Lippe.",                        sinn: "nein", pol: "neg" },
    { num: 213, satz: "Sie joggen auf keiner Tulpe.",                    sinn: "nein", pol: "neg" },
    { num: 214, satz: "Sie wandern keinen Topf.",                        sinn: "nein", pol: "neg" },
    { num: 215, satz: "Sie aktivieren nicht den Rasen.",                 sinn: "nein", pol: "neg" },
    { num: 216, satz: "Sie atmen keinen Käfig.",                         sinn: "nein", pol: "neg" },
    { num: 217, satz: "Sie raten keinen Brenner.",                       sinn: "nein", pol: "neg" },
    { num: 218, satz: "Sie renovieren nicht die Hymne.",                 sinn: "nein", pol: "neg" },
    { num: 219, satz: "Sie decken keine Linse.",                         sinn: "nein", pol: "neg" },
    { num: 220, satz: "Sie hobeln keinen Truthahn.",                     sinn: "nein", pol: "neg" },
    { num: 221, satz: "Sie sägen keine Hängematte.",                     sinn: "nein", pol: "neg" },
    { num: 222, satz: "Sie steigen nicht in die Nadel.",                 sinn: "nein", pol: "neg" },
    { num: 223, satz: "Sie gären nicht das Netz.",                       sinn: "nein", pol: "neg" },
    { num: 224, satz: "Sie wickeln keinen Korken.",                      sinn: "nein", pol: "neg" },
    { num: 225, satz: "Sie dürfen keine Binde.",                         sinn: "nein", pol: "neg" },
    { num: 226, satz: "Sie mähen nicht den Atem.",                       sinn: "nein", pol: "neg" },
    { num: 227, satz: "Sie leuchten nicht den Schuh.",                   sinn: "nein", pol: "neg" },
    { num: 228, satz: "Sie blamieren keine Taste.",                      sinn: "nein", pol: "neg" },
    { num: 229, satz: "Sie säubern keinen Sturm.",                       sinn: "nein", pol: "neg" },
    { num: 230, satz: "Sie beenden keine Ziege.",                        sinn: "nein", pol: "neg" },
    { num: 231, satz: "Sie kaschieren keine Torte.",                     sinn: "nein", pol: "neg" },
    { num: 232, satz: "Sie vegetieren keinen Lauf.",                     sinn: "nein", pol: "neg" },
    { num: 233, satz: "Sie schrauben keinen Lauf.",                      sinn: "nein", pol: "neg" },
    { num: 234, satz: "Sie flöten keine Pfanne.",                        sinn: "nein", pol: "neg" },
    { num: 235, satz: "Sie fauchen nicht den Ast.",                      sinn: "nein", pol: "neg" },
    { num: 236, satz: "Sie massieren kein Wohnmobil.",                   sinn: "nein", pol: "neg" },
    { num: 237, satz: "Sie kneten nicht ein Geräusch.",                  sinn: "nein", pol: "neg" },
    { num: 238, satz: "Sie kratzen nicht den Ekel.",                     sinn: "nein", pol: "neg" },
    { num: 239, satz: "Sie wühlen keine Ananas.",                        sinn: "nein", pol: "neg" },
    { num: 240, satz: "Sie klammern keine Bohne.",                       sinn: "nein", pol: "neg" }
]







function drawFixation() {                                     
    "use strict"                                               
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;                             
    ctx.moveTo(-prms.fixSize, 0);                              
    ctx.lineTo( prms.fixSize, 0);                              
    ctx.stroke();                                              
    ctx.moveTo(0, -prms.fixSize);                              
    ctx.lineTo(0,  prms.fixSize);                              
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
    func: drawFixation
};

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
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
        trial.stimulus = blockFeedbackTxt_de({stim: "picneg"});
    },
};

const pic_stim = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    stimulus_onset: [0, prms.flankDur],
    response_ends_trial: true,
    choices: prms.respKeys,
    clear_screen: [0, 1],
    stimulus_duration: 400,
    on_finish: function() { codeTrial(); }
};


const sent_stim = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    translate_origin: true,
    stimulus_onset: [0, prms.flankDur],
    response_ends_trial: true,
    choices: prms.respKeys,
    clear_screen: [0, 1],
    stimulus_duration: 400
};


const trial_timeline = {
    timeline: [
        fixation_cross,
        pic_stim,
        sent_stim,
        trial_feedback,
        iti
    ],
    timeline_variables:[

    ],
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    response_ends_trial: true,
    choices: [32],
    stimulus: "<h3 style='text-align:left;'>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h3>" +
              "<h3 style='text-align:left;'>benötigen, kopieren Sie den folgenden zufällig generierten Code</h3>" +
              "<h3 style='text-align:left;'>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h3><br>" +
              "<h2>XXX@XXX</h2>" +
              "<h1>Code: " + randomString + "</h1><br>" +
              "<h2 style='text-align:left;'>Drücken Sie die Leertaste, um fortzufahren!</h2>",  
};


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    
    //exp.push(fullscreen_on);
    //exp.push(welcome_de);
    //exp.push(resize_de) 
    //exp.push(vpInfoForm_de);
    exp.push(screenInfo);
    exp.push(task_instructions1);
    exp.push(task_instructions2);

    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.sample = {type: "fixed-repetitions", size: (blk === 0) ? (prms.nTrlsP/8) : (prms.nTrlsE/8)}
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(alphaNum);
    exp.push(fullscreen_off);

    return exp;

}
const EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + genVpNum();
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
        saveData("/Common/write_data.php", data_filename, {stim: "flanker"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});

