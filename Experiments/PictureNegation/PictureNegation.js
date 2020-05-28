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
    stimulus: "<h2 style='text-align:center;'>Willkommen bei unserem Experiment:</h2><br>" +
    on_finish: function() {
        $('body').css('cursor', 'none'); 
    },
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: canvas_colour,
    canvas_size: canvas_size,
    canvas_border: canvas_border,
    stimulus: 
    "<h2 style='text-align:center;'>Aufgabe:</h2><br>" +
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////

    const sentences = [
        {Satz: "Sie trinkt ein Glas Saft.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wirft einen Stein.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie isst eine Banane.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie läuft jetzt zum See.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rennt heute zum Bus.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kommt gerne zur Vorlesung.",	      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie brät oft Fleisch.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kocht eine Suppe.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie läutet eine Glocke.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schläft immer im Bett.",	          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie malt einen Tiger.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie häkelt ein Tuch.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie strickt einen Socken.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie singt ein Lied.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bastelt ein Geschenk.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie macht eine Pause.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rechnet eine Aufgabe.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie löst ein Rätsel.",	                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie skizziert ein Tier.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie zeichnet ein Bild.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie brüllt einen Namen.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie würfelt eine Zahl.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie spielt jetzt Gitarre.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie putzt heute das Bad.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er schreibt einen Aufsatz.",	          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er geht gerne zur Party.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er beißt in ein Brot.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er betrügt eine Frau.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er biegt einen Draht.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bindet einen Knoten.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bittet immer um Hilfe.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er verbrennt ein Papier.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfiehlt eine Bar.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfängt einen Gast.",	              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfindet heute Schmerzen.",           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fliehen jetzt vor dem Gewitter.",	  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er genießt heute den Abend.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gerät schnell in Stress.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gewinnt ein Spiel.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gießt gerne die Blumen.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie springt jetzt in die Luft.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie streichelt eine Katze.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er schaut immer aus dem Fenster.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er faltet eine Serviette.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er unternimmt eine Wanderung.",           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schneidet eine Zwiebel.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er föhnt heute seine Haare.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie pflückt einen Apfel.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er braucht eine Dusche.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er vergisst einen Termin.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er träumt heute vom Sommer.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wischt heute den Boden.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie arbeitet jetzt beim Bäcker.",         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie überfallen eine Bank.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gründen einen Verein.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie planen einen Urlaub.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er trifft heute seinen Freund.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leiden an einer Krankheit.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie klauen jetzt das Geld.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie vermieten eine Wohnung.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie feiern eine Hochzeit.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hilft immer beim Umzug.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie benutzen eine Fernbedienung.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie entwerfen eine Strategie.",           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bestimmen heute die Richtung.",       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie flechten einen Zopf.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie finden einen Schatz.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hauen gleich den Mann.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hebt einen Tisch.",                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie liegen heute auf der Wiese.",         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie beladen jetzt das Auto.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie meiden heute den Kontakt.",           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie messen nun die Temperatur.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie mögen heute das Essen.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fliegen ein Flugzeug.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie riechen gerne an der Wurst.",         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hält eine Rede.",                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sitzen heute auf dem Balkon.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stehen heute in der Schlange.",       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er trägt ein Hemd.",                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie besucht eine Freundin.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wiegt ein Gewicht.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie beginnt heute mit dem Text.",         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie denkt gerade an ihre Mutter.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er erkennt heute das Haus.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sehen eine Eule.",                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ist eine Schauspielerin.",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie will eine Antwort.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er fällt einen Baum.",                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gefällt heute dem Chef.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rudert heute zum Ufer.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bestellen ein Sofa.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schält eine Kartoffel.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hämmert heute gegen die Wand.",       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zieht einen Zahn.",                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er klopft heute gegen das Tor.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie zählen heute die Schafe.",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie baden gerne in der Wanne.",           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er freut sich heute über den Sieg.",      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zimmert eine Kommode.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er berührt eine Herdplatte.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er sprintet jetzt zur Halle.",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie errichtet ein Gebäude. ",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kauft eine Trompete.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er pflanzt heute Tomaten.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie säht heute Samen.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schmelzen heute Butter. ",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fahren heute Schlitten. ",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reist jetzt um die Welt.",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie speisen heute im Restaurant.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sucht nach einem Schlüssel. ",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ändert heute ihr Aussehen.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bricht immer die Regeln.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie drehen heute im Kreis.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie knabbert an einer Karotte.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie übernachtete heute bei ihrem Vater.", Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie überrascht heute ihre Schwester.",    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie recherchiert jetzt nach Sängern.",    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er ersetzt einen Anzug.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er füttert ein Kaninchen.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie trinkt kein Glas Saft.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wirft keinen Stein.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie isst keine Banane. ",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie läuft nicht zum See.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rennt nicht zum Bus.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kommt nicht zur Vorlesung.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie brät kein Fleisch.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kocht keine Suppe.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie läutet keine Glocke.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie malt keinen Tiger.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schläft nicht im Bett. ",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie spielt nicht Gitarre.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie springt nicht in die Luft.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie singt kein Lied.",                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bastelt kein Geschenk.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie macht keine Pause.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: " Sie rudert nicht zum Ufer. ",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie streichelt keine Katze.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rechnet keine Aufgabe.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie löst kein Rätsel.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie häkelt kein Tuch.",                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie strickt keinen Socken.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie brüllt keinen Namen.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er unternimmt keine Wanderung.",          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie skizziert kein Tier.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie zeichnet kein Bild.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie würfelt keine Zahl.",                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er schreibt keinen Aufsatz.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fliehen nicht vor dem Gewitter.",     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie putzt nicht das Bad.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er genießt nicht den Abend.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er schaut nicht aus dem Fenster.",        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schneidet keine Zwiebel.",            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er föhnt nicht seine Haare.",             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie pflückt keinen Apfel.",               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er braucht keine Dusche.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er vergisst keinen Termin.",              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er geht nicht zur Party.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er beißt in kein Brot.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er betrügt keine Frau.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er biegt keinen Draht.",                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bindet keinen Knoten.",                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bittet nicht um Hilfe."              ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er träumt nicht vom Sommer."            ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er verbrennt kein Papier."              ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfiehlt keine Bar."                ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfängt keinen Gast."               ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er empfindet keine Schmerzen."          ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie arbeitet nicht beim Bäcker."        ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie überfallen keine Bank."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gründen keinen Verein."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie klauen nicht das Geld."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gerät nicht in Stress."              ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gewinnt kein Spiel."                 ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gießt nicht die Blumen."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie vermieten keine Wohnung."           ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie feiern keine Hochzeit."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hält keine Rede."                    ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hebt keinen Tisch."                  ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er hilft nicht beim Umzug."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie benutzen keine Fernbedienung."      ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie finden keinen Schatz."              ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie flechten keinen Zopf."              ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fliegen kein Flugzeug."             ,     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er faltet keine Serviette."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie planen keinen Urlaub."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bestellen kein Sofa. "                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hauen nicht den Mann."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie beladen nicht das Auto."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leiden an keiner Krankheit."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie liegen nicht auf der Wiese."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie meiden nicht den Kontakt."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie messen nicht die Temperatur."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie mögen nicht das Essen."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie bestimmen nicht die Richtung."            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie riechen nicht an der Wurst."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sitzen nicht auf dem Balkon."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stehen nicht in der Schlange."            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er trägt kein Hemd."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie besucht keine Freundin."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wischt nicht den Boden."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie entwerfen keine Strategie."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wiegt kein Gewicht."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie beginnt nicht mit dem Text."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie denkt nicht an ihre Mutter."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er erkennt nicht das Haus."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sehen keine Eule."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ist keine Schauspielerin."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie will keine Antwort."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er fällt keinen Baum."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gefällt nicht dem Chef. "                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er trifft nicht seinen Freund."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schält keine Kartoffel."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hämmert nicht gegen die Wand."            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zieht keinen Zahn."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er klopft nicht gegen das Tor."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie zählen nicht die Schafe."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie baden nicht in der Wanne."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er freut sich nicht über den Sieg."           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zimmert keine Kommode."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er berührt keine Herdplatte."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er sprinntet nicht zur Halle."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie errichtet kein Gebäude. "                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kauft keine Trompete."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er pflanzt nicht Tomaten. "                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie säht nicht Samen. "                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schmelzen nicht Butter. "                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fahren nicht Schlitten. "                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reist nicht um die Welt."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie speisen nicht im Restaurant."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sucht nach keinem Schlüssel."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ändert nicht ihr Aussehen."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bricht nicht die Regeln."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie drehen sich nicht im Kreis."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie knabbert an keiner Karotte."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie übernachtet nicht bei ihrem Vater."       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie überrascht nicht ihre Schwester."         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie recherchiert nicht nach Sängern."         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er ersetzt keinen Anzug."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er füttert kein Kaninchen."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reitet ein Buch."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie heißt eine Rose."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leiht einen Wurf.                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie liegt einen Weg."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie pfeift ein Rohr."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fangen eine Abscheu."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reibt eine Schaukel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reißt immer den Computer."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ruft ein Blech."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie säuft heute den Fleck."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schafft gerne das Gummi."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schert immer den Sitz."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schiebt einen Raum."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er fährt heute das Müsli."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schießt gerne das Meer."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schleicht nun den Kuchen."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schmeißt eine Strecke."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schreitet gerne das Gestell."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schweigt eine Kanone."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwimmt einen Docht."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwingt ein Loch."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwört ein Gericht."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er spinnt einen Hocker."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er stirbt jetzt den Henkel."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er stiehlt ein Erdbeben."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er treibt einen Besen."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wächst ein Kabel. "                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wäscht einen Gesang."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er weiß eine Birne."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bleibt heute das Gefühl."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gedeihen eine Braut."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fließen gerne das Gedicht."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie frieren eine Leiter."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gelten einen Hahn."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie genesen heute den Wurm."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie singen einen Hund."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie geschehen einen Rat."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie klingen eine Ente."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie können eine Unterkunft."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie laden eine Wimper."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie lügen ein Bein."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie quellen heute das Format."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ringen eine Post."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schleifen jetzt das Programm."            Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schlingen heute den Ausflug."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwellen nun das Gestein."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stechen ein Ruder."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stinken einen Friseur."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie trügen einen Deckel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie weben heute den Kanon."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er windet ein Klavier."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zwingt heute den Ring."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er liest einen Elefanten."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er baut ein Wasser."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er rührt heute die Lampe."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie verbringt heute das Kamel."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie weist immer die Jacke."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kaut einen Sinn."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er tippt ein Hochhaus."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie jongliert heute mit Steckdosen."          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erntet jetzt das Telefon."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er heiratet ein Öl."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er lächelt einen Rollstuhl."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er redet jetzt einen Stift."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er taucht heute im Papagei."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erfährt jetzt eine Maus."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rasiert heute die Mauer."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kitzelt einen Prozess."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er verschluckt heute den Fleiß."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rollt heute die Ehre."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er benimmt eine Fantasie."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er riecht ein Gedächtnis."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie verblüfft heute den Verlust."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bremst einen Teich."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie blutet einen Planeten."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie heilen eine Leistung."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hoffen einen Teig."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erschießen eine Schere."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie entführen immer den Durst."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie nähen einen Feiertag."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie parken heute den Mond."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reinigen heute die Melodie."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie knacken einen Tropfen."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie nehmen einen Himmel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sprechen heute die Hose."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie tut eine Wolke."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er galoppiert einen Eimer."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie graben eine Dose.                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie greift einen Zoo."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwitzt einen Kocher."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er steckt heute den Fluss."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er begibt eine Lippe."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er joggt eine Tulpe."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wandern einen Topf."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie aktivieren immer den Rasen."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie atmet einen Käfig."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rät einen Brenner."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er renoviert jetzt die Hymne."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er deckt eine Linse."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hobeln einen Truthahn."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sägt eine Hängematte."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er steigt jetzt in die Nadel."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gärt heute das Netz."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wickeln einen Korken."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er darf eine Binde."                           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie mäht immer den Atem."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leuchtet heute den Schuh."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie blamieren eine Taste."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er säubert einen Sturm."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er beendet eine Ziege."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kaschiert eine Torte."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er vegetiert einen Lauf."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schrauben ein Kissen."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er flötet eine Pfanne."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fauchen heute den Ast."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er massiert ein Wohnmobil."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kneten nun ein Geräusch."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kratzt heute den Ekel."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wühlt eine Ananas."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er klammert eine Bohne."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fangen keine Abscheu."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er baut kein Wasser."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie weist nicht die Jacke."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie heißt keine Rose."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er kaut keinen Sinn."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leiht keinen Wurf."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er tippt kein Hochhaus."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie liegt keinen Weg."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er rührt nicht die Lampe."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erntet nicht das Telefon."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie pfeift kein Rohr."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reitet kein Buch."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reibt keine Schaukel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reißt nicht den Computer."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ruft kein Blech."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie säuft nicht den Fleck."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schafft nicht das Gummi."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schert nicht den Sitz."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schiebt keinen Raum."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schießt nicht das Meer."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er liest keinen Elefanten."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie verbringt nicht das Kamel."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schleicht nicht den Kuchen."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er heiratet kein Öl."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er lächelt keinen Rollstuhl."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schmeißt keine Strecke."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er redet nicht einen Stift."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er taucht nicht im Papagei."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schreitet nicht das Gestell."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schweigt keine Kanone."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwimmt keinen Docht."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwingt kein Loch."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwört kein Gericht."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erfährt nicht eine Maus."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rasiert nicht die Mauer."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kitzelt keinen Prozess."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er spinnt keinen Hocker.                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er verschluckt nicht den Fleiß."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rollt nicht die Ehre."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er benimmt keine Fantasie."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er steigt nicht in die Nadel."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er stirbt nicht den Henkel."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er stiehlt kein Erdbeben."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er riecht kein Gedächtnis."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er treibt keinen Besen."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie verblüfft nicht den Verlust."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bremst keinen Teich."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wächst kein Kabel."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie blutet keinen Planeten."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie heilen keine Leistung."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie erschießen keine Schere."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie entführen nicht den Durst."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er weiß keine Birne."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie nähen keinen Feiertag."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie parken nicht den Mond."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie reinigen nicht die Melodie."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er bleibt heute kein Gefühl."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie knacken keinen Tropfen."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gedeihen keine Braut."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fließen nicht das Gedicht."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie frieren keine Leiter."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie gelten keinen Hahn."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie genesen nicht den Wurm."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie geschehen keinen Rat."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie klingen keine Ente."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie können keine Unterkunft."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie laden keine Wimper."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie lügen kein Bein."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie quellen nicht das Format."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie ringen keine Post."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schleifen nicht das Programm."             Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schlingen nicht den Ausflug."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwellen nicht das Gestein."              Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie singen keinen Hund."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stechen kein Ruder."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie stinken keinen Friseur."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie trügen keinen Deckel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wäscht keinen Gesang."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie weben nicht den Kanon."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er windet kein Klavier."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er zwingt nicht den Ring."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie nehmen keinen Himmel."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sprechen nicht die Hose."                  Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie tut keine Wolke."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er galoppiert keinen Eimer."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er fährt nicht das Müsli."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie graben keine Dose."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie greift keinen Zoo."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hoffen keinen Teig."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schwitzt keinen Kocher."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er steckt nicht den Fluss."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er joggt keine Tulpe."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wandern keinen Topf."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie aktivieren nicht den Rasen."               Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie jongliert nicht mit Steckdosen."           Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie mäht nicht den Atem."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie atmet keinen Käfig."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er begibt keine Lippe."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie rät keinen Brenner."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er renoviert nicht die Hymne."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er deckt keine Linse."                         Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie hobeln keinen Truthahn."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie sägt keine Hängematte."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er gärt nicht das Netz."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie wickeln keinen Korken."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er darf keine Binde."                          Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie leuchtet nicht den Schuh."                 Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie blamieren keine Taste."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er säubert keinen Sturm."                      Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er beendet keine Ziege."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kaschiert keine Torte."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er vegetiert keinen Lauf."                     Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie schrauben kein Kissen."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er flötet keine Pfanne."                       Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie fauchen nicht den Ast."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er massiert kein Wohnmobil."                   Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kreten nicht ein Geräusch."                Sinn: "ja",  Polarity: "aff"},
        {Satz: "Sie kratzt nicht den Ekel."                    Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er wühlt keine Ananas."                        Sinn: "ja",  Polarity: "aff"},
        {Satz: "Er klammert keine Bohne.",                      Sinn: "ja",  Polarity: "aff"}
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
    func: [drawFlanker, drawFlanker],
    func_args:[
        {"text": jsPsych.timelineVariable("flanker1")},
        {"text": jsPsych.timelineVariable("flanker2")}
    ],
    data: {
        stim: "flanker",
        flanker: jsPsych.timelineVariable('stimulus'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_start: function(trial) {
        if (trial.data.order === "RI") {
            trial.trial_duration = prms.tooSlow;
        } else {
            trial.trial_duration = prms.tooSlow + prms.flankDur;
        }
    },
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
    stimulus_duration: 400,
    func: [drawFlanker, drawFlanker],
    func_args:[
        {"text": jsPsych.timelineVariable("flanker1")},
        {"text": jsPsych.timelineVariable("flanker2")}
    ],
    data: {
        stim: "flanker",
        flanker: jsPsych.timelineVariable('stimulus'), 
        comp: jsPsych.timelineVariable('comp'), 
        order: jsPsych.timelineVariable('order'), 
        corrResp: jsPsych.timelineVariable('corrResp')
    },
    on_start: function(trial) {
        if (trial.data.order === "RI") {
            trial.trial_duration = prms.tooSlow;
        } else {
            trial.trial_duration = prms.tooSlow + prms.flankDur;
        }
    },
    on_finish: function() { codeTrial(); }
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

const fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true,
}

const fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
    on_start: function() {
        $('body').css('cursor', 'default')
    }
}

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];
    exp.push(fullscreen_on);
    exp.push(welcome_de);
    exp.push(resize_de) 
    exp.push(vpInfoForm_de);
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

