// This would be the desired format
const materials = [
  {
    itemNum: 1,
    context:
      'Herr Zinn ist Psychotherapeut und hat aktuell einen sehr schwierigen Fall. Er ist auf die Erfahrung und Hilfe seiner Kollegen angewiesen, um den Patienten angemessen zu therapieren.',
    target: 'Herr Zinn beschließt seinen Kollegen von dem Problem zu berichten.',
    condition: 1,
  },
  {
    itemNum: 1,
    context:
      'Herr Zinn ist Pfarrer in einer kleinen Gemeinde und unterliegt der Schweigepflicht. Deshalb sucht Herr Müller ihn auf, um in einer privaten und prekären Sache um Rat zu fragen.',
    target: 'Herr Zinn beschließt seinen Kollegen von dem Problem zu berichten.',
    condition: 2,
  },
  { itemNum: 2, context: '', target: '', condition: 1 },
  { itemNum: 2, context: '', target: '', condition: 2 },
  { itemNum: 3, context: '', target: '', condition: 1 },
  { itemNum: 3, context: '', target: '', condition: 2 },
];

// // This would be item 2, cond 1
// 3 M2 9 1
// Herr Zimmermann arbeitet in einem Chemiekonzern. Seit einigen Wochen gibt es Sicherheitsprobleme aufgrund fahrlässigen Verhaltens von Kollegen, so dass Menschenleben gefährdet sind.
// Im monatlichen Gespräch berichtet er seinem Chef deren Fehler.
//
// // This would be item 2, cond 2
// 4 UM2 9 2
// Herr Zimmermann arbeitet in einem Chemiekonzern als Sachbearbeiter in der Personalabteilung. Er ist ehrgeizig und will rascher aufsteigen als seine Kollegen.
// Im monatlichen Gespräch berichtet er seinem Chef deren Fehler.
//
//
// // This would be item 3, cond 1
// 5 M3 9 1
// Paul arbeitet auf einer Großbaustelle und hat heute lange gearbeitet. Am Abend lässt er sich überreden und geht mit ein paar Freunden in die Kneipe.
// Paul trinkt vier Bier und fährt mit dem Taxi nach Hause.
//
// // This would be item 3, cond 2
// 6 UM3 9 2
// Paul ist Taxifahrer. Er feiert am Abend mit Freunden den Sieg der Nationalmannschaft und geht in eine Kneipe.
// Paul trinkt vier Bier und fährt mit dem Taxi nach Hause.
//
// // And so on ...
// 7 M4 6 1
// Als Daniel gerade in seiner Werkstatt arbeitet, bittet ihn ein aufgebrachter Vater, sein Auto benutzen zu dürfen, weil sein Sohn sich vermutlich das Bein gebrochen hat und er ihn ins Krankenhaus fahren muss.
// Er hat ihm sein Auto geliehen.
// 8 UM4 6 2
// Als Daniel gerade in seiner Werkstatt arbeitet, bittet ihn sein minderjähriger Neffe eines seiner Autos fahren zu dürfen, weil er vor seinen Freunden etwas angeben möchte.
// Er hat ihm sein Auto geliehen.
// 9 M5 9 1
// Florian ist Gitarrist einer Rockband, mit der er am Abend einen Auftritt in einem Club hat. Sein Verstärker ist kaputt, deshalb muss er den des Clubs nutzen.
// Nach dem Konzert hat er den Verstärker dort gelassen.
// 10 UM5 9 2
// Florian ist Gitarrist einer Rockband, mit der er am Abend einen Auftritt hat. Sein Verstärker ist kaputt, deshalb hat er sich den eines Freundes geliehen.
// Nach dem Konzert hat er den Verstärker dort gelassen.
// 11 M6 7 1
// Karl ist arbeitslos und verbringt viel Zeit auf seinem Balkon. Er bemerkt, wie ein Mülleimer auf dem Gehweg unter ihm Feuer gefangen hat.
// Er holt einen Eimer Wasser zum Ausschütten.
// 12 UM6 7 2
// Karl ist arbeitslos und verbringt viel Zeit auf seinem Balkon. Als Kinder auf dem Gehweg spielen, fordert er sie auf zu verschwinden, was sie nicht tun.
// Er holt einen Eimer Wasser zum Ausschütten.
// 13 M7 9 1
// Frau Schulze ist Hausfrau. Ihr Sohn ruft von einer Telefonzelle aus an, ob sie ihm die SMS mit der Adresse seines Freundes vorlesen kann, da er sein Handy vergessen hat.
// Sie nimmt das Handy, um die SMS zu lesen.
// 14 UM7 9 2
// Frau Schulze ist Hausfrau und saugt das Zimmer ihres Sohnes. Dieser hat sein Handy vergessen.
// Sie nimmt das Handy, um die SMS zu lesen.
// 15 M8 7 1
// Marie arbeitet als Verkäuferin in einem Modegeschäft. Ihre beste Freundin hat ein Vorstellungsgespräch und fragt sie um Rat bezüglich ihres Outfits. Das gewählte Outfit sitzt fürchterlich.
// Sie sagt ihr, dass das Outfit schlecht aussieht.
// 16 UM8 7 2
// Marie arbeitet als Verkäuferin in einem Modegeschäft. Ihre Rivalin betritt den Laden und probiert ein paar Kleidungsstücke an. Marie ärgert sich darüber, wie gut ihr das Outfit steht.
// Sie sagt ihr, dass das Outfit schlecht aussieht.
// 17 M9 5 1
// Herr Peters ist ein Staranwalt. Eine verzweifelte und alleinerziehende Mutter fragt an, ob er ihren Sohn vertreten würde. Ihm ist klar, dass sie ihn niemals voll bezahlen kann.
// Er hat den Fall übernommen.
// 18 UM9 5 2
// Herr Peters ist ein sehr erfolgreicher Anwalt und soll nun den Chef eines Chemiekonzerns vertreten, der veranlasste, dass über Jahre hochschädliche Abfälle im Meer entsorgt wurden, was zu einer weitreichenden Zerstörung der Natur und Tiersterben führte.
// Er hat den Fall übernommen.
// 19 M10 6 1
// Herr Kaiser arbeitet in einer Versicherung. Er wird von seinen Kollegen ab und zu schlecht behandelt. Die wöchentliche Abteilungssitzung wurde von Mittwoch auf Dienstag verlegt. Der Abteilungsleiter bittet jeden davon in Kenntnis zu setzen.
// Sie haben ihm das Treffen mitgeteilt.
// 20 UM10 6 2
// Herr Kaisers Kollegen planen zu seinem Geburtstag eine Überraschungsparty. Die beiden Klatschmäuler der Abteilung haben von dem Vorhaben erfahren. Die Kollegen bitten die beiden dies für sich zu behalten.
// Sie haben ihm das Treffen mitgeteilt.
// 21 M11 8 1
// Herr Schubert arbeitet im Gesundheitsamt und kontrolliert Imbissbuden. Ausgerechnet im Imbiss eines guten Freundes stößt er auf einen Erreger, der ein hohes Gesundheitsrisiko darstellt.
// Er hat genau diese Information im Protokoll erwähnt.
// 22 UM11 8 2
// Herr Schubert arbeitet im Gesundheitsamt und kontrolliert Imbissbuden. Ein Inhaber hat Geld angeboten, falls Herr Schubert anführt, dass ein Konkurrent Gerichte mit verdorbenem Fleisch verkauft.
// Er hat genau diese Information im Protokoll erwähnt.
// 23 M12 5 1
// Frau Beck arbeitet in der Verwaltung einer Klinik. Sie wird gebeten, die bereits erteilte Zusage für einen zukünftigen Arzt noch vertraulich zu behandeln.
// Sie hat die Information verschwiegen.
// 24 UM12 5 2
// Frau Beck ist schwanger, als sie ein Vorstellungsgespräch für eine Stelle in der Radiologie einer Klinik hat. Sie wird gefragt, ob sie schwanger sei, da sie sonst der Strahlung wegen nicht arbeiten könne. Sie will die Stelle unbedingt haben.
// Deshalb hat sie die Information verschwiegen.
// 25 M13 8 1
// Eine Freundin von Matthias hat am Abend ihren ersten Bühnenauftritt und ist nervös. Er merkt, dass es sie beruhigen würde, wenn er mitkommt.
// Er ist ohne ein Wort zu sagen hingegangen.
// 26 UM13 8 2
// Matthias geht regelmäßig ins Spielcasino und hat deshalb häufig Streit mit seiner Frau. Sie bittet ihn nicht dorthin zu gehen, da er erst letzte Woche ihr ganzes Haushaltsgeld verspielt hat.
// Er ist ohne ein Wort zu sagen hingegangen.
// 27 M14 5 1
// Tinas Opa leidet an Krebs und wird bald sterben. Zu seinem 85. Geburtstag hat er ein großes Fest geplant und wünscht sich vor allem, dass alle seine Kinder und Enkel kommen.
// Sie hat die Einladung angenommen.
// 28 UM14 5 2
// Tinas Chef macht schon seit einer Weile eindeutige Anspielungen. Nun hat er sie zu einem Essen in ein teures Restaurant eingeladen. Sie weiß, dass er seit 20 Jahren verheiratet ist und drei Kinder hat.
// Sie hat die Einladung angenommen.
// 29 M15 5 1
// Herr Kraus muss eine Stelle in seinem Team besetzen. Es gibt einen Bewerber, der offensichtlich anhand des Bewerbungsbildes und seines Namens ein Mitbürger mit Migrationshintergrund ist.
// Er bekommt sofort eine Zusage für die Stelle.
// 30 UM15 5 2
// Herr Kraus muss eine Stelle in seinem Team besetzen. Es gibt Bewerber, die besser ins Team passen würden und höher qualifiziert sind, aber der Sohn des Konzernchefs hat sich ebenfalls auf die Stelle beworben.
// Er bekommt sofort eine Zusage für die Stelle.
// 31 M16 5 1
// Ben ist wegen sexueller Belästigung angezeigt worden. Er waran dem fraglichen Nachmittag bei einem Freund. Dieser Freund wird von der Polizei befragt.
// Er verschafft ihm das Alibi.
// 32 UM16 5 2
// Ben ist wegen sexueller Belästigung angezeigt worden. Er behauptet an diesem Nachmittag bei seinem Freund gewesen zu sein, was jedoch gelogen ist. Sein Freund wird nun befragt.
// Er verschafft ihm das Alibi.
// 33 M17 8 1
// Frau Förster ist im Büro auf dem frisch gewischten Boden ausgerutscht und hat sich das Handgelenk gebrochen. Wenn sie dies als Privatunfall bei der Versicherung angibt, ist es zu ihrem eigenen Vorteil.
// Sie hat es bei der Versicherung als Arbeitsunfall angegeben.
// 34 UM17 8 2
// Frau Förster mag ihren Chef nicht. Als sie zu Hause putzt, rutscht sie aus und bricht sich das Handgelenk. Wenn sie einen Arbeitsunfall melden würde, hätte ihr Chef Probleme mit der Versicherung.
// Sie hat es bei der Versicherung als Arbeitsunfall angegeben.
// 35 M18 7 1
// Als Experte für Nuklearanlagen überprüft Herr Schneider die Notsicherheitssysteme in einem Atomkraftwerk. Ein Mitarbeiter weist ihn auf schwere Sicherheitsmängel hin und bittet ihn, seinen Namen im Bericht unerwähnt zu lassen, da er sonst seinen Job verliert.
// Herr Schneider ist auf diese Bitte eingegangen.
// 36 UM18 7 2
// Als Experte für Nuklearanlagen überprüft Herr Schneider die Notsicherheitssysteme in einem Atomkraftwerk. Der Betreiber des Kraftwerks gibt ihm zu verstehen, dass man sich erkenntlich zeigen werde, sollte sein Gutachten den sehr schweren Sicherheitsmangel unerwähnt lassen.
// Herr Schneider ist auf diese Bitte eingegangen.
// 37 M19 7 1
// Herr Schäfer ist ein erfolgreicher Anwalt. Er baut eine enge Beziehung zu seinen Klienten auf, um sich besser für sie einsetzen zu können.
// Das hat positive Auswirkungen auf das Urteil.
// 38 UM19 7 2
// Herr Schäfer ist Richter. In der Pause einer Verhandlung gibt ihm der Anwalt des Angeklagten einen Kaffee aus.
// Das hat positive Auswirkungen auf das Urteil.
// 39 M20 5 1
// Herr Klein arbeitet als Kommissar im Kriminalamt. In einem aktuellen Fall zu sexuellem Kindesmissbrauch gehört es zu seiner Aufgabe das beschlagnahmte Filmmaterial auszuwerten.
// Er schaut sich die Kinderpornos an.
// 40 UM20 5 2
// Herr Klein ist Erzieher im Kinderheim und bringt die Kinder dazu in seinen selbstgedrehten Filmen mitzumachen. Dabei lässt er sich gerne von Filmen verschiedenster Genres inspirieren.
// Er schaut sich die Kinderpornos an.
// 41 M21 8 1
// Max ist ein sauberer Profisportler und weiß, dass ein gedopter Konkurrent seine Urinprobe mit Max` Namen beschriftet und an das Labor geschickt hat.
// Max hat deswegen die Urinprobe im Labor vertauscht.
// 42 UM21 8 2
// Max ist Schwimmsportler und sein Traum, an den olympischen Spielen teilzunehmen, ist in Erfüllung gegangen. Er weiß, dass die Dopingkontrolle bei ihm positiv ausfallen wird.
// Max hat deswegen die Urinprobe im Labor vertauscht.
// 43 M22 8 1
// Johanna ist im Kinderballett und die Mädchen vertreiben sich oft die Wartezeit bis zum Beginn des Trainings mit gegenseitigem Schabernack.
// Sie sieht die Ballettschuhe einer Anderen und versteckt diese.
// 44 UM22 8 2
// Johanna ist Balletttänzerin und wartet mit vielen anderen Konkurrentinnen bei einem Vortanzen für die Hauptrolle in einem Stück, dass sie endlich aufgerufen wird.
// Sie sieht die Ballettschuhe einer Anderen und versteckt diese.
// 45 M23 12 1
// Herr Schröder ist Unternehmer und beschäftigt viele Kurz- und Schwarzarbeiter, die er unangemessen oder gar nicht bezahlt. Nun steht er vor Gericht.
// Er hat den Fall gewonnen, weil er die Geschädigten schließlich angemessen bezahlt hat.
// 46 UM23 12 2
// Herr Schröder ist ein erfolgreicher Anwalt in einer großen Kanzlei. Letzte Woche hatte er einen sehr schwierigen Fall, der bedeutend für seine Karriere war.
// Er hat den Fall gewonnen, weil er die Geschädigten schließlich angemessen bezahlt hat.
// 47 M24 10 1
// Frau Neumann ist Klavierlehrerin und hat zwei gute Schüler bei einem Wettbewerb für Nachwuchsmusiker angemeldet. Die beiden erbringen eine sehr gute Leistung im Vergleich zu den anderen.
// Sie bewertet ihre Schüler im Vergleich zu den Anderen besser.
// 48 UM24 10 2
// Frau Neumann ist Gymnasiallehrerin und wird die Hausaufgaben einsammeln und bewerten. Ein kranker Kollege hat sie gebeten, dies auch bei seiner Klasse zu tun.
// Sie bewertet ihre Schüler im Vergleich zu den Anderen besser.
// 49 M25 8 1
// Anne wurde von ihrer Tante gefragt, ob sie Lust hätte ihr bei der Organisation ihrer Geburtstagsparty zu helfen.
// Sie veranstaltet die Party im Haus der Tante.
// 50 UM25 8 2
// Seit langem plant Anne eine größere Geburtstagsparty. Nun soll sie während des Urlaubes das Haus und die Blumen der Tante hüten.
// Sie veranstaltet die Party im Haus der Tante.
// 51 M26 6 1
// Herr Berger ist Anwalt und hat eine Kanzlei. Er hat die Daten seines Archivs digitalisiert. Das Problem bei der Entsorgung des Papiermülls ist, dass es sich um sehr sensible Daten handelt.
// Er hat die Abfälle einfach verbrannt.
// 52 UM26 6 2
// Herr Berger ist Gärtner und beschneidet seine Obstbäume. Es hat seit Wochen nicht geregnet, so dass hohe Waldbrandgefahr herrscht. In den Medien werden offene Feuer verboten.
// Er hat die Abfälle einfach verbrannt.
// 53 M27 6 1
// Herr Wagner leidet unter einer Angststörung. Als er wieder eine starke Panikattacke mit massiven körperlichen Symptomen bekommt, bittet er den Arzt um Hilfe.
// Der Arzt spritzt ihm ein Beruhigungsmittel.
// 54 UM27 6 2
// Herr Wagner hatte einen Unfall und liegt im Krankenhaus. Der behandelnde Arzt ist von ihm genervt, weil er ein fröhlicher Mensch ist und viel redet.
// Der Arzt spritzt ihm ein Beruhigungsmittel.
// 55 M28 6 1
// Sarah ist Promoterin und steht meistens in Fußgängerzonen und verteilt kostenlose Werbegeschenke an Passanten. Da spricht sie die nächste Passantin an.
// Sarah hat ihr das Produkt geschenkt.
// 56 UM28 6 2
// Sarah ist Verkäuferin für eine große Bekleidungskette. Als sie gerade arbeitet, kommt eine gute Freundin an die Kasse und möchte bezahlen.
// Sarah hat ihr das Produkt geschenkt.
// 57 M29 5 1
// Frau Bauer möchte zum Abteilungsessen gehen und sucht einen Babysitter. Sie erhält die Anfrage einer Frau, von der man weiß, dass sie gegenüber Kindern bereits handgreiflich wurde.
// Sie hat der Babysitterin abgesagt.
// 58 UM29 5 2
// Frau Bauer möchte zum Abteilungsessen gehen und sucht einen Babysitter. Sie erhält die Anfrage einer jungen Studentin, die am Telefon sehr sympathisch wirkt, aber mit ausländischem Akzent spricht.
// Sie hat der Babysitterin abgesagt.
// 59 M30 6 1
// Julia ist Praktikantin im Marketingbereich eines großen Unternehmens. Sie darf dort nur Kopieren und Briefe abtippen.
// Sie bekommt dafür ein hohes Gehalt.
// 60 UM30 6 2
// Julia ist Praktikantin im Marketingbereich eines großen Unternehmens. Sie darf dort nur kopieren und Briefe abtippen.
// Sie bekommt dafür ein hohes Gehalt.
// 61 M31 5 1
// Alex nimmt an einem Karatetunier teil und sein nächster Gegner ist ihm weitaus überlegen. Er überlegt sich eine Strategie, wie er seinen Gegner besiegen kann.
// Alex packt ihn am Kragen.
// 62 UM31 5 2
// Alex ist dafür bekannt, lockere Fäuste zu haben. Auf dem Weg in die Stadt gerät er im Bus mit einem anderen Fahrgast aneinander.
// Alex packt ihn am Kragen.
// 63 M32 5 1
// Jan ist Feuerwehrmann und auf dem Weg eine Katze aus einem Baum zu retten, als er einen zweiten Notruf erhält. Ein Mehrfamilienhaus brennt, in dem sich noch einige Personen aufhalten. Es zählt jede Minute.
// Er geht zuerst dem zweiten Notruf nach.
// 64 UM32 5 2
// Jan ist Feuerwehrmann und erhält den Notruf, dass ein Mehrfamilienhaus brennt. Da erhält er einen zweiten Notruf ganz aus der Nähe. Er soll eine Katze von einem hohen Baum herunterholen.
// Er geht zuerst dem zweiten Notruf nach.
// 65 M33 11 1
// Sabine ist zur Hochzeit einer Cousine eingeladen, wofür sie sich von einer Freundin ein Kleid geliehen hat. Der Reinigung unterläuft ein schwerwiegender Fehler.
// Sie berichtet ihrer Freundin, dass das Kleid in der Reinigung ruiniert wurde.
// 66 UM33 11 2
// Sabine ist zur Hochzeit einer Cousine eingeladen, wofür sie sich von einer Freundin ein Kleid geliehen hat. Das Kleid gefällt ihr so sehr, dass sie es am liebsten behalten würde.
// Sie berichtet ihrer Freundin, dass das Kleid in der Reinigung ruiniert wurde.
// 67 M34 8 1
// Frau Lehmann hat einen Austauschschüler, der kaum redet, weil er fürchtet, die anderen könnten ihn auslachen. Als er sich endlich traut zu sprechen, macht der er kleinere Fehler.
// Sie hat ihn auf die Fehler nicht hingewiesen.
// 68 UM34 8 2
// Frau Lehmann ist Deutschlehrerin und wird von einem Freund darum gebeten, seine Abschlussarbeit gegenzulesen. Von dieser Leistung ist es abhängig, ob ihr Freund das Studium mit der Wunschnote beendet. Beim Lesen entdeckt Frau Lehmann kleinere Fehler.
// Sie hat ihn auf die Fehler nicht hingewiesen.
// 69 M35 4 1
// Frau Lehmann hat einen Austauschschüler, der kaum redet, weil er fürchtet, die anderen könnten ihn auslachen. Als er sich endlich traut zu sprechen, macht er kleinere Fehler.
// Sie gibt ihm keinen Hinweis auf die Fehler.
// 70 UM35 4 2
// Frau Huber ist mit ihrer Tochter im nahe gelegenen Supermarkt. Als sie zum Parkplatz laufen, holt das Kind einen Schokoriegel aus der Tasche, den sie nicht bezahlt hat.
// Auf dem Heimweg lobt sie ihre Tochter.
// 71 M36 5 1
// Herr Mayer arbeitet in einem großen Unternehmen. Er muss viele Überstunden machen, verdient aber nicht mehr. Für seine Familie hat er kaum noch Zeit und seine Gesundheit leidet darunter. Nun hat er ein attraktives Jobangebot erhalten.
// Er hat das Angebot angenommen.
// 72 UM36 5 2
// Herr Mayer ist Gründer eines kleinen Traditionsunternehmens. Er ist dafür verantwortlich, dass es kurz vor dem Konkurs steht. Nun hat er ein attraktives Jobangebot erhalten und überlegt, ob er das sinkende Schiff verlässt.
// Er hat das Angebot angenommen.
// 73 M37 6 1
// Jana passt manchmal auf die Nachbarskinder auf. Sie verspricht den Kindern eine Überraschung, wenn sie ihr Zimmer aufräumen. Als sie das nächste Mal in die Zimmer schaut, sind sie aufgeräumt.
// Sie gibt ihnen eine Tüte Gummibärchen.
// 74 UM37 6 2
// Jana passt auf die Nachbarskinder auf. Sie hat den Eltern versprochen für eine ordentliche Mahlzeit zu sorgen. Ihr wurde gesagt, dass die Kinder eine ernsthafte Gelatine-Intoleranz haben.
// Sie gibt ihnen eine Tüte Gummibärchen.
// 75 M38 8 1
// Anna war bei einem Vorstellungsgespräch. Eine Freundin hat nun das gleiche Vorstellungsgespräch und leidet unter starker Prüfungsangst. Wenn diese wüsste, dass das Gespräch direkt mit dem Chef erfolgt, würde sie es gar nicht erst versuchen.
// Anna beschließt, ihrer Freundin diese Information zu verschweigen.
// 76 UM38 8 2
// Anna hat nach einem Vorstellungsgespräch eine Absage erhalten. Als eine Freundin das gleiche Vorstellungsgespräch hat, überlegt Anna, ob sie ihr sagen soll, worauf der Firmenchef besonderen Wert legt.
// Anna beschließt, ihrer Freundin diese Information zu verschweigen.
// 77 M39 6 1
// Jörg ist Taxifahrer und hat an einem Samstagabend Dienst, als ihn vor einer Disko ein Mann und eine Frau asiatischer Herkunft anhalten. Er hat schlechte Erfahrungen mit Asiaten gemacht.
// Er lässt die beiden Personen einsteigen.
// 78 UM39 6 2
// Jörg ist Taxifahrer und hat an einem Samstagabend Dienst, als er beobachtet, wie zwei Rowdys einen Mann zusammenschlagen. Dann laufen sie in seine Richtung davon und halten ihn an.
// Er lässt die beiden Personen einsteigen.
// 79 M40 10 1
// Herr Schwarz ist Chirurg und ein angesehener Wissenschaftler. Er hat die Erlaubnis seiner Patienten, die Operationen für seine Kollegen zur Verfügung zu stellen.
// Er macht Videos und stellt sie später auf eine Plattform.
// 80 UM40 10 2
// Herr Schwarz ist Gynäkologe in einer kleineren Gemeinde und nutzt das Vertrauen seiner Patientinnen für private Zwecke.
// Er macht Videos und stellt sie später auf eine Plattform.
// 81 M41 8 1
// Lena ist Studentin und lebt in einer Wohngemeinschaft. Viele Dinge teilen sich die Bewohner untereinander. Sie geht in den Supermarkt, um die Zutaten für ein gemeinsames Essen zu kaufen.
// Lena sieht abgelaufenes Fleisch und legt es zurück.
// 82 UM41 8 2
// Lena ist Studentin und lebt in einer Wohngemeinschaft. Viele Dinge teilen sich die Bewohner untereinander. Eine Mitbewohnerin ist allerdings blind und somit müssen die anderen besonders achtsam sein.
// Lena sieht abgelaufenes Fleisch und legt es zurück.
// 83 M42 6 1
// Frau Köhler ist Lehrerin und sammelt stichprobenartig die Hausaufgaben ihrer Schüler ein. Lisa ist eine unzuverlässige und faule Schülerin. Sie schreibt schlechte Noten und erledigt in der Regel nicht ihre Hausaufgaben. Auch dieses Mal hat sie wieder keine Hausaufgaben gemacht.
// Frau Köhler gibt ihr eine Sechs.
// 84 UM42 6 2
// Frau Köhler ist Lehrerin und sammelt stichprobenartig die Hausaufgaben ihrer Schüler ein. Lisa ist eine der besten Schülerinnen und hat normalerweise immer ihre Hausaufgaben sorgfältig erledigt. Am Wochenende ist ihre Oma gestorben und so hat sie die Hausaufgaben ausnahmsweise nicht.
// Frau Köhler gibt ihr eine Sechs.
// 85 M43 7 1
// Christian ist Journalist und hat eine Bekannte, die gerade einen historischen Roman geschrieben hat. Diese gibt ihm ein Exemplar mit der Absicht, es ihm zu schenken, falls er das Thema interessant findet.
// Er hat ihr das Buch nie zurückgegeben.
// 86 UM43 7 2
// Christian ist Journalist und soll zu einem bestimmten Thema einen Bericht schreiben. Für die Einarbeitung benötigt er die entsprechende Fachliteratur. Eine Bekannte, die in diesem Bereich arbeitet, leiht ihm ein Buch zu diesem Thema.
// Er hat ihr das Buch nie zurückgegeben.
// 87 M44 7 1
// Herr Möller ist Schweizer und wird in eine Bank nach Deutschland versetzt. Für den Umzug muss er noch die Schweizer Umzugsfirma bezahlen.
// Deswegen transferiert er Geld in die Schweiz.
// 88 UM44 7 2
// Herr Möller ist Vorstand in einer großen Bank in Deutschland, die auch in der Schweiz operiert. Er müsste hohe Steuern zahlen und will das vermeiden.
// Deswegen transferiert er Geld in die Schweiz.
// 89 M45 5 1
// Jana ist Kellnerin und hilft einer Kollegin aus der Patsche. Als Dank will sie Jana das Trinkgeld von diesem einen Tag überlassen.
// Jana hat das Geld behalten.
// 90 UM45 5 2
// Jana ist selbst Verkäuferin und geht einkaufen. An der Kasse erhält sie zu viel Wechselgeld. Sie weiß, dass die Kassiererin den fehlenden Betrag aus eigener Tasche bezahlen muss.
// Jana hat das Geld behalten.
// 91 M46 6 1
// Michael arbeitet als Sanitäter und fährt nach einem Einsatz mit seinem Kollegen in die Kantine. An der Kasse fällt dem Kollegen auf, dass er kein Bargeld bei sich hat und er fragt Michael, ob er ihm etwas leihen könnte.
// Er hat ihm das Geld gegeben.
// 92 UM46 6 2
// Michael arbeitet als Sanitäter und fährt zu einem Einsatz. Vor Ort bittet ihn der Drogenabhängige, der eben noch bewusstlos war, um Geld. Er weiß, dass er sich damit nur weitere Drogen kaufen wird.
// Er hat ihm das Geld gegeben.
// 93 M47 6 1
// Frau Fischer hat sich vor kurzem von Ihrem Mann getrennt, als ihr die Frauenärztin nach einer Untersuchung mitteilt, dass sie schwanger ist und ihr Kind starke Missbildungen aufweist, wodurch es sehr wahrscheinlich nur kurze Zeit leben wird.
// Frau Fischer wird das Kind abtreiben.
// 94 UM47 6 2
// Frau Fischer erfährt nach einer Routineuntersuchung beim Frauenarzt, dass sie schwanger ist und sich ihr Kind sehr gesund entwickelt. Nun hat sie Angst dick zu werden.
// Frau Fischer wird das Kind abtreiben.
// 95 M48 9 1
// Rechtsanwalt Weber erhält von der Kripo Informationen über den aktuellen Ermittlungsstand bei einem schweren Raubüberfall. Der Fall betrifft einen seiner Klienten als geschädigte Person.
// Herr Weber wird ihn über die bevorstehende Verhaftung informieren.
// 96 UM48 9 2
// Staatsanwalt Weber erfährt zufällig über einen Kollegen vom aktuellen Ermittlungsstand in einem schweren Missbrauchsfall. Ein enger Freund gilt als Tatverdächtiger.
// Herr Weber wird ihn über die bevorstehende Verhaftung informieren.
// 97 M49 9 1
// Herr Müller ist Finanzberater und erfährt, dass die Bank jetzt nur noch Erfolgshonorare ausschüttet, wenn Kunden Verträge über riskante Aktienfonds abschließen. In das seit langem im Wert steigende Gold anzulegen, ist jedoch der sichere Weg.
// Herr Müller rät einem Kunden sein Geld in Gold anzulegen.
// 98 UM49 9 2
// Herr Müller ist Finanzberater und erfährt, dass die Bank jetzt nur noch Erfolgshonorare ausschüttet, wenn Kunden ihr Geld in Goldfonds im Vergleich zu variablen Aktienfonds anlegen. Er hat Insiderinformationen, dass der Absturz des Goldwertes sich fortsetzen wird.
// Herr Müller rät einem Kunden sein Geld in Gold anzulegen.
// 99 M50 12 1
// Lena gewährt ihrer iranischen Freundin Unterschlupf, die ihren Mann verlassen und bei den Behörden angezeigt hat, da sie sich von ihm bedroht fühlt.
// Als die Polizei erscheint, gibt Lena an, dass sie ihre Freundin versteckt.
// 100 UM50 12 2
// Lena gewährt ihrer iranischen Freundin Unterschlupf, da ihre Abschiebung von Seiten der Behörden ansteht und ihr somit Folter und Tod im Iran drohen. Sie verspricht sie nicht zu verraten.
// Als die Polizei erscheint, gibt Lena an, dass sie ihre Freundin versteckt.
// 101 M51 6 1
// Als Buchkritiker verfasst Herr Meier eine Rezension über das neue Buch seines Intimfeindes, welches er allerdings für ein sehr starkes Werk hält.
// Herr Meier verfasst eine äußerst positive Buchkritik.
// 102 UM51 6 2
// Als Buchkritiker soll Herr Meier eine Rezension über das neue Buch eines Autors schreiben, welcher ihm für eine positive Kritik eine hohe Summe bietet.
// Herr Meier verfasst eine äußerst positive Buchkritik.
// 103 M52 9 1
// Die junge Freundin des Sozialhelfers lässt keine Gelegenheit aus, um auch mit anderen Männern Sex zu haben. Schließlich informieren ihn Freunde über das Gebaren seiner Freundin.
// Nach kurzer Zeit entscheidet er sich für die Trennung.
// 104 UM52 9 2
// Die junge Freundin des Sozialhelfers erleidet bei einem unverschuldeten Unfall schwerste Verletzungen, weshalb sie vorübergehend auf fremde Hilfe angewiesen ist.
// Nach kurzer Zeit entscheidet er sich für die Trennung.
// 105 M53 7 1
// Melanie ist selbstständige Kosmetikerin mit einem gut laufenden Laden und ist daher nicht auf jede Kundin angewiesen. Als sie gerade Pause machen will, betritt ein junges Mädchen ihren Salon, welches lediglich Haare schneiden möchte.
// Ohne zu zögern beginnt sie die Behandlung des Mädchens.
// 106 UM53 7 2
// Melanie ist Tätowiererin und hält sich nicht immer an die rechtlichen Vorschriften und Gesundheitsrichtlinien. Als sie gerade den Boden wischt, betritt ein minderjähriges Mädchen ohne einen Elternteil ihren Salon.
// Ohne zu zögern beginnt sie die Behandlung des Mädchens.
// 107 M54 4 1
// Herr Schmitt ist Bäcker. Gesetzlich ist es erlaubt altes Brot in bestimmten Anteilen in frischen Broten einzubacken.
// Er verarbeitet das alte Brot.
// 108 UM54 4 2
// Herr Schmitt ist Bäcker und möchte altes Brot weiter verwerten. Er sieht, dass es schon zu schimmeln beginnt.
// Er verarbeitet das alte Brot.
// 109 M55 6 1
// Herr Hofmanns minderjähriger Sohn ist stark pubertierend und verstößt gerne gegen die Regeln der Eltern. Nun ist er unerlaubt auf eine Messe gegangen, von der ihn sein Vater abholen muss.
// Herr Hofmann geht auf die Erotikmesse.
// 110 UM55 6 2
// Herr Hofmann hat seiner Frau erzählt, dass er auf die Automobilmesse gehen möchte. Er hat allerdings eine andere Absicht.
// Herr Hofmann geht auf die Erotikmesse.
// 111 M56 7 1
// Frau Koch schreibt Kolumnen für eine große Wochenzeitung. Die Leser lieben ihre Beiträge, weil die Artikel sehr persönlich und witzig geschrieben sind.
// Ihre Empfehlungen beruhen zumeist auf subjektiven Einschätzungen.
// 112 UM56 7 2
// Frau Koch schreibt Gutachten für jugendliche Straftäter, die meistens ausschlaggebend für das Maß der Strafe sind. Sie muss sich dabei an objektive Analysemethoden orientieren.
// Ihre Empfehlungen beruhen zumeist auf subjektiven Einschätzungen.
// 113 M57 9 1
// Lukas hat einen Kollegen gefragt, ob er sich mit ihm ein Fußballspiel anschauen möchte. Dieser interessiert sich jedoch nicht für Fußball.
// Er lässt seinen Kollegen zurück und schaut das Spiel.
// 114 UM57 9 2
// Lukas ist Polizist und ist an diesem Wochenende bei einem Fußballspiel seiner Lieblingsmannschaft eingesetzt.
// Er lässt seinen Kollegen zurück und schaut das Spiel.
// 115 M58 8 1
// Herr Wolf ist Buchautor und schreibt an einem Roman, inspiriert von autobiographischen Informationen eines Freundes. Dieser will anonym bleiben und dass man ihn nicht anhand der Informationen identifizieren kann.
// In seiner Story berichtet er deshalb auch Unwahrheiten.
// 116 UM58 8 2
// Herr Wolf ist Reporter einer großen Zeitung und wird ins Büro des Chefs gerufen. Er gerät unter Druck, weil er die Aussicht auf eine bessere Position erhält, wenn der nächste Bericht ein Erfolg werden würde.
// In seiner Story berichtet er deshalb auch Unwahrheiten.
// 117 M59 5 1
// Philipp ist Fahrschullehrer und Sicherheit ist sein oberstes Gebot. Oft können seine Schüler schnell einigermaßen fahren, aber nach den wenigen Stunden haben sie gar keine Routine.
// Er macht meist zusätzliche Fahrstunden.
// 118 UM59 5 2
// Philipp ist Besitzer einer Fahrschule und verdient ganz gut. Dennoch will er den Profit weiterhin erhöhen.
// Er macht meist zusätzliche Fahrstunden.
// 119 M60 5 1
// Herr Krüger ist Schönheitschirurg. Bei einer Brustvergrößerung erklärt er einem Studenten alle relevanten Schritte und welche Faktoren eine Schwierigkeit darstellen könnten.
// Sie reden über ihre Fettleibigkeit.
// 120 UM60 5 2
// Herr Krüger ist Unfallchirurg. Mit seinem Kollegen macht er während einer Operation häufig üble Scherze. Sie operieren eine Frau, die unter Vollnarkose steht.
// Sie reden über ihre Fettleibigkeit.
// 121 M61 7 1
// Herr Hartmann ist Hausmeister einer Grundschule. Er ist gerade auf dem Heimweg, als er auf dem Sportplatz den MP3-Player seines Sohnes findet.
// Er hat den MP3-Player nach Hause mitgenommen.
// 122 UM61 7 2
// Her Hartmann ist Hausmeister einer Grundschule. Auf dem Sportplatz findet er einen MP3-Player. Sein Sohn hat bald Geburtstag und er weiß, dass er sich einen wünscht.
// Er hat den MP3-Player nach Hause mitgenommen.
// 123 M62 4 1
// Meike lebt in einer Wohngemeinschaft. Sie will für ihre Mitbewohner Milchreis kochen, doch einer leidet unter Laktoseunvertäglichkeit.
// Sie nimmt eine laktosefreie Milch.
// 124 UM62 4 2
// Meike hat keine Milch mehr und geht an den Kühlschrank ihrer Mitbewohner. Als erstes sieht sie die teure Milch von dem Mitbewohner, welcher keine Laktose verträgt und zusätzlich knapp bei Kasse ist.
// Sie nimmt eine laktosefreie Milch.
// 125 M63 6 1
// Lisa ist Doktorandin am Universitätsklinikum. Sie hat heute Nachmittag eine lose Verabredung mit einer Bekannten. Auf dem Gang trifft sie einen Kollegen, der verzweifelt Hilfe bei seiner Datenauswertung benötigt und sie fragt, ob sie heute Nachmittag Zeit hätte.
// Sie sagt der Bekannten kurzfristig ab.
// 126 UM63 6 2
// Lisa ist Doktorandin am Universitätsklinikum. Sie hat am Nachmittag eine Verabredung mit einer Bekannten, die ihre Hilfe benötigt. Auf dem Gang trifft sie einen Kollegen, der sie ebenfalls am Nachmittag spontan zum Kaffee einlädt.
// Sie sagt der Bekannten kurzfristig ab.
// 127 M64 8 1
// Herr Lange ist Berater bei einer Investmentbank mit regelmäßigem Kundenkontakt. Innerhalb seiner Arbeit kommt er täglich mit hochsensiblen Daten in Berührung, seine Kunden vertrauen ihm aber.
// Die zugrunde liegenden Daten hat er intern geheim gehalten.
// 128 UM64 8 2
// Herr Lange ist junger Wissenschaftler in einem angesehenen molekulargenetischen Institut und hat kürzlich eine eigene Theorie vorgestellt. Seine neuesten Befunde sprechen gegen seine Annahmen, würde der Wissenschaft aber großen Nutzen bringen.
// Die zugrunde liegenden Daten hat er intern geheim gehalten.
// 129 M65 8 1
// Frau Schmitt feiert ihren Geburtstag und hat eine Menge Leute eingeladen. Eine Freundin bringt ihren Partner mit, den Frau Schmitt nicht ausstehen kann.
// Sie reicht ihm dennoch ein Glas des Champagners.
// 130 UM65 8 2
// Frau Schmitt feiert ihren Geburtstag und hat eine Menge Leute eingeladen. Ein Freund ist trockener Alkoholiker.
// Sie reicht ihm dennoch ein Glas des Champagners.
// 131 M66 11 1
// Frau Werner ist Apothekerin. Ihr langjähriger Nachbar hat eine schwere Grippe und kann nicht aus dem Haus gehen. Er hat Frau Werner um Hilfe gebeten, denn er benötigt dringend Medikamente.
// Sie nutzt ihre Arbeitsstelle, um an die entsprechenden Medikamente zu gelangen.
// 132 UM66 11 2
// Frau Werner ist Apothekerin und seit Jahren von Medikamenten abhängig, was sie bisher noch geheim halten konnte. Die Apotheke Ihres Chefs ist in eine finanzielle Schieflage geraten und ist auf jeden Cent angewiesen.
// Sie nutzt ihre Arbeitsstelle, um an die entsprechenden Medikamente zu gelangen.
// 133 M67 9 1
// Fabian geht am Wochenende mit seinem Sohn in den Zoo. Sie haben sich ein Eis gekauft und sitzen auf einer Bank, als sich sein Sohn plötzlich verschluckt und keine Luft mehr bekommt.
// Fabian hat seinem Sohn heftig auf den Rücken geschlagen.
// 134 UM67 9 2
// Fabian geht am Wochenende mit seinem Sohn in den Zoo. Sein Sohn wird frech und streckt seinem Vater die Zunge raus.
// Fabian hat seinem Sohn heftig auf den Rücken geschlagen.
// 135 M68 5 1
// Hannah ist Reiseleiterin. Sie ist in Thailand unterwegs, als ihr ein Händler auf einem Markt Kleidungsstücke anbietet, die ausschließlich von Kindern produziert sind.
// Sie wird das Kleidungsstück ablehnen.
// 136 UM68 5 2
// Hannah ist Reiseleiterin und erlebt in Thailand sehr viel Elend. Als sie über einen Markt läuft, bietet ihr ein abgemagertes Straßenkind ein Kleid für umgerechnet 10 Cent zum Kauf an.
// Sie wird das Kleidungsstück ablehnen.
// 137 M69 4 1
// Patrick ist Gärtner für exotische Zierpflanzen. Beim Gießen sieht er, dass die Pflanzen stark von Blattläusen befallen sind. Für diesen Fall hat er ein umweltfreundliches Gegenmittel.
// Er greift zum Gift.
// 138 UM69 4 2
// Patrick ist zertifizierter Biobauer. Als er zu seinen Feldern fährt, sieht er, dass seine Ernte leicht von Blattläusen befallen ist.
// Er greift zum Gift.
// 139 M70 4 1
// Jonas arbeitet an einer Konzertkasse. Es ist erwünscht, dass die Mitarbeiter sich nach Beginn eines Konzerts in den Saal begeben und letzte Plätze besetzen. Das heutige Konzert entspricht gar nicht seinem Geschmack.
// Dennoch geht er rein.
// 140 UM70 4 2
// Jonas arbeitet an einer Kinokasse. Den Mitarbeitern ist es untersagt den Kassenplatz zu verlassen und sich die Filme anzuschauen.
// Dennoch geht er rein.
// 141 M71 6 1
// Sophie arbeitet als Sekretärin. Der Leiter der Nachbarabteilung hat seinen Kugelschreiber im Konferenzraum vergessen. Sein Büro liegt nicht auf ihrem direkten Rückweg.
// Sie hat den Kugelschreiber einfach mitgenommen.
// 142 UM71 6 2
// Sophie arbeitet als Sekretärin. Alle Büroartikel sind für die Mitarbeiter frei zugänglich, allerdings nicht für den privaten Gebrauch. Sophie will einen der Kugelschreiber ihrer Freundin schenken.
// Sie hat den Kugelschreiber einfach mitgenommen.
// 143 M72 7 1
// Erik studiert Mathematik. Für die Übungsaufgaben hat er sich die Lösungen einer besonders kniffeligen Aufgabe beim Professor besorgt. Dieser hat ihn darum gebeten, aus Fairness die Lösungen an die anderen Studierenden weiterzureichen.
// Er hat den anderen die Lösungen gegeben.
// 144 UM72 7 2
// Erik studiert Mathematik. Für die bevorstehende Klausur hat er sich bei einem Freund des höheren Semesters die Lösungen besorgt. Dieser hat ihn allerdings darum gebeten die Lösungen nicht herumzureichen, weil er sonst exmatrikuliert werden könnte.
// Er hat den anderen die Lösungen gegeben.
// 145 M73 9 1
// Herr Winkler ist Herzchirurg, der gerade einen akuten Notfallpatienten operiert, als er zu einer Besprechung mit Pharmavertretern gerufen wird. Es geht um das Aufstellen einer Werbetafel im Krankenhaus.
// Ohne langes Zögern entscheidet sich Herr Winkler zum Weiterführen der Operation.
// 146 UM73 9 2
// Herr Winkler ist Hautarzt, der bei einem Patienten gerade erst mit dem Entfernen von Muttermalen begonnen hat, als er zu einem lebensbedrohlichen Notfall gerufen wird.
// Ohne langes Zögern entscheidet sich Herr Winkler zum Weiterführen der Operation.
// 147 M74 5 1
// Lara geht zum Klettern an eine frei zugängliche Kletterwand. Die Bezahlung erfolgt auf Vertrauensbasis. Sie ist Schülerin und muss deshalb nichts bezahlen.
// Lara geht ohne zu bezahlen.
// 148 UM74 5 2
// Lara geht zum Klettern an eine frei zugängliche Kletterwand. Wenn das Kassenhäuschen nicht besetzt ist, läuft die Bezahlung auf Vertrauensbasis. Als Lara gehen will, ist das Häuschen unbesetzt.
// Lara geht ohne zu bezahlen.
// 149 M75 8 1
// Frank arbeitet beim Sicherheitsdienst im Zoo. Aus Sicherheitsgründen dürfen nur Fahrzeuge mit Sondergenehmigung auf das Gelände. Dann möchte ein Krankenwagen im Einsatz passieren.
// Er blickt sich um und lässt sie durch.
// 150 UM75 8 2
// Frank arbeitet als Türsteher einer Diskothek. Der Laden steht kurz vor der Schließung, weil gegen das Jugendschutzgesetzt verstoßen wurde. Da kommt eine Bekannte seines Bruders, von welcher er weiß, dass sie erst 15 Jahre alt ist.
// Er blickt sich um und lässt sie durch.
// 151 M76 5 1
// Stefanie wollte am Abend ins Kino und freut sich schon seit Tagen auf diesen Film. Sie müsste jetzt eigentlich aufbrechen, ist aber bei einer Freundin, der es nicht gut geht.
// Sie entscheidet sich zu bleiben.
// 152 UM76 5 2
// Stefanie ist im Kino und hat bereits einen Film angeschaut. Im Nachbarsaal beginnt ein anderer Film. Sie könnte, ohne zu bezahlen, einen weiteren Film anschauen.
// Sie entscheidet sich zu bleiben.
// 153 M77 6 1
// Simon schreibt gerade eine Klausur. Seine Nachbarin versucht bei ihm abzuschreiben. Der Professor bemerkt den Versuch und gibt ihm die Schuld.
// Simon sagt ihm, dass sie abschrieb.
// 154 UM77 6 2
// Simon schreibt gerade eine Klausur. Er hat zu wenig gelernt und will bei seiner Nachbarin abschreiben. Der Professor erwischt die beiden.
// Simon sagt ihm, dass sie abschrieb.
// 155 M78 6 1
// Herr Albrecht ist Koch in einem Nobelrestaurant. Auf der Dessertkarte gibt es ein Himbeer-Joghurt-Dessert, was er gerade zubereiten will. Auf der Oberfläche ist Schimmel, den er mit dem Löffel entfernt.
// Er hat den Joghurt trotzdem weggeworfen.
// 156 UM78 6 2
// Herr Albrecht ist Koch und kontrolliert die Lagerbestände der Großküche. Er sieht an einer Palette Joghurt, dass das Haltbarkeitsdatum an diesem Tag abläuft. Er probiert aus zwei Bechern und merkt, dass er noch genießbar ist.
// Er hat den Joghurt trotzdem weggeworfen.
// 157 M79 8 1
// Frau Kahn bringt ihren dreijährigen Sohn nach einem gemeinsamen Spieleabend ins Bett. Da er in ein neues Zimmer umgezogen ist, hat er noch Angst im Dunkeln. Er will daher, dass das Licht auch nachts leuchtet.
// Sie geht raus und lässt das Licht brennen.
// 158 UM79 8 2
// Frau Kahn ist über Weihnachten bei ihren Schwiegereltern zu Besuch, die sie nicht mag. Die anderen sind auf dem Weg in die Kirche und Frau Kahn ist die letzte Person im Haus. Sie sieht, dass die Wachskerzen am Weihnachtsbaum noch nicht gelöscht sind.
// Sie geht raus und lässt das Licht brennen.
// 159 M80 8 1
// Tim ruft von der Straße seinem Vater im ersten Stock zu, er solle ihm seinen Volleyball geben.
// Er hat den Ball aus dem Fenster geworfen.
// 160 UM80 8 2
// Tim spielt mit einem Freund, der von seinen Eltern einen neuen Fußball geschenkt bekommen hat. Tim ist neidisch und gönnt ihn seinem Freund nicht.
// Er hat den Ball aus dem Fenster geworfen.
