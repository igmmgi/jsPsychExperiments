const materials = [
  {
    itemNum: 1,
    context:
      'Herr Zinn ist Psychotherapeut und hat aktuell einen sehr schwierigen Fall. Er ist auf die Erfahrung und Hilfe seiner Kollegen angewiesen, um den Patienten angemessen zu therapieren.',
    target: 'Herr Zinn beschließt seinen Kollegen von dem Problem zu berichten.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 1,
    context:
      'Herr Zinn ist Pfarrer in einer kleinen Gemeinde und unterliegt der Schweigepflicht. Deshalb sucht Herr Müller ihn auf, um in einer privaten und prekären Sache um Rat zu fragen.',
    target: 'Herr Zinn beschließt seinen Kollegen von dem Problem zu berichten.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 2,
    context:
      'Herr Zimmermann arbeitet in einem Chemiekonzern. Seit einigen Wochen gibt es Sicherheitsprobleme aufgrund fahrlässigen Verhaltens von Kollegen, so dass Menschenleben gefährdet sind.',
    target: 'Im monatlichen Gespräch berichtet er seinem Chef deren Fehler.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 2,
    context:
      'Herr Zimmermann arbeitet in einem Chemiekonzern als Sachbearbeiter in der Personalabteilung. Er ist ehrgeizig und will rascher aufsteigen als seine Kollegen.',
    target: 'Im monatlichen Gespräch berichtet er seinem Chef deren Fehler.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 3,
    context:
      'Paul arbeitet auf einer Großbaustelle und hat heute lange gearbeitet. Am Abend lässt er sich überreden und geht mit ein paar Freunden in die Kneipe.',
    target: 'Paul trinkt vier Bier und fährt mit dem Taxi nach Hause.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 3,
    context:
      'Paul ist Taxifahrer. Er feiert am Abend mit Freunden den Sieg der Nationalmannschaft und geht in eine Kneipe.',
    target: 'Paul trinkt vier Bier und fährt mit dem Taxi nach Hause.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 4,
    context:
      'Als Daniel gerade in seiner Werkstatt arbeitet, bittet ihn ein aufgebrachter Vater, sein Auto benutzen zu dürfen, weil sein Sohn sich vermutlich das Bein gebrochen hat und er ihn ins Krankenhaus fahren muss.',
    target: 'Er hat ihm sein Auto geliehen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 4,
    context:
      'Als Daniel gerade in seiner Werkstatt arbeitet, bittet ihn sein minderjähriger Neffe eines seiner Autos fahren zu dürfen, weil er vor seinen Freunden etwas angeben möchte.',
    target: 'Er hat ihm sein Auto geliehen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 5,
    context:
      'Florian ist Gitarrist einer Rockband, mit der er am Abend einen Auftritt in einem Club hat. Sein Verstärker ist kaputt, deshalb muss er den des Clubs nutzen.',
    target: 'Nach dem Konzert hat er den Verstärker dort gelassen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 5,
    context:
      'Florian ist Gitarrist einer Rockband, mit der er am Abend einen Auftritt hat. Sein Verstärker ist kaputt, deshalb hat er sich den eines Freundes geliehen.',
    target: 'Nach dem Konzert hat er den Verstärker dort gelassen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 6,
    context:
      'Karl ist arbeitslos und verbringt viel Zeit auf seinem Balkon. Er bemerkt, wie ein Mülleimer auf dem Gehweg unter ihm Feuer gefangen hat.',
    target: 'Er holt einen Eimer Wasser zum Ausschütten.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 6,
    context:
      'Karl ist arbeitslos und verbringt viel Zeit auf seinem Balkon. Als Kinder auf dem Gehweg spielen, fordert er sie auf zu verschwinden, was sie nicht tun.',
    target: 'Er holt einen Eimer Wasser zum Ausschütten.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 7,
    context:
      'Frau Schulze ist Hausfrau. Ihr Sohn ruft von einer Telefonzelle aus an, ob sie ihm die SMS mit der Adresse seines Freundes vorlesen kann, da er sein Handy vergessen hat.',
    target: 'Sie nimmt das Handy, um die SMS zu lesen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 7,
    context: 'Frau Schulze ist Hausfrau und saugt das Zimmer ihres Sohnes. Dieser hat sein Handy vergessen.',
    target: 'Sie nimmt das Handy, um die SMS zu lesen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 8,
    context:
      'Marie arbeitet als Verkäuferin in einem Modegeschäft. Ihre beste Freundin hat ein Vorstellungsgespräch und fragt sie um Rat bezüglich ihres Outfits. Das gewählte Outfit sitzt fürchterlich.',
    target: 'Sie sagt ihr, dass das Outfit schlecht aussieht.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 8,
    context:
      'Marie arbeitet als Verkäuferin in einem Modegeschäft. Ihre Rivalin betritt den Laden und probiert ein paar Kleidungsstücke an. Marie ärgert sich darüber, wie gut ihr das Outfit steht.',
    target: 'Sie sagt ihr, dass das Outfit schlecht aussieht.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 9,
    context:
      'Herr Peters ist ein Staranwalt. Eine verzweifelte und alleinerziehende Mutter fragt an, ob er ihren Sohn vertreten würde. Ihm ist klar, dass sie ihn niemals voll bezahlen kann.',
    target: 'Er hat den Fall übernommen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 9,
    context:
      'Herr Peters ist ein sehr erfolgreicher Anwalt und soll nun den Chef eines Chemiekonzerns vertreten, der veranlasste, dass über Jahre hochschädliche Abfälle im Meer entsorgt wurden, was zu einer weitreichenden Zerstörung der Natur und Tiersterben führte.',
    target: 'Er hat den Fall übernommen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 10,
    context:
      'Herr Kaiser arbeitet in einer Versicherung. Er wird von seinen Kollegen ab und zu schlecht behandelt. Die wöchentliche Abteilungssitzung wurde von Mittwoch auf Dienstag verlegt. Der Abteilungsleiter bittet jeden davon in Kenntnis zu setzen.',
    target: 'Sie haben ihm das Treffen mitgeteilt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 10,
    context:
      'Herr Kaisers Kollegen planen zu seinem Geburtstag eine Überraschungsparty. Die beiden Klatschmäuler der Abteilung haben von dem Vorhaben erfahren. Die Kollegen bitten die beiden dies für sich zu behalten.',
    target: 'Sie haben ihm das Treffen mitgeteilt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 11,
    context:
      'Herr Schubert arbeitet im Gesundheitsamt und kontrolliert Imbissbuden. Ausgerechnet im Imbiss eines guten Freundes stößt er auf einen Erreger, der ein hohes Gesundheitsrisiko darstellt.',
    target: 'Er hat genau diese Information im Protokoll erwähnt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 11,
    context:
      'Herr Schubert arbeitet im Gesundheitsamt und kontrolliert Imbissbuden. Ein Inhaber hat Geld angeboten, falls Herr Schubert anführt, dass ein Konkurrent Gerichte mit verdorbenem Fleisch verkauft.',
    target: 'Er hat genau diese Information im Protokoll erwähnt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 12,
    context:
      'Frau Beck arbeitet in der Verwaltung einer Klinik. Sie wird gebeten, die bereits erteilte Zusage für einen zukünftigen Arzt noch vertraulich zu behandeln.',
    target: 'Sie hat die Information verschwiegen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 12,
    context:
      'Frau Beck ist schwanger, als sie ein Vorstellungsgespräch für eine Stelle in der Radiologie einer Klinik hat. Sie wird gefragt, ob sie schwanger sei, da sie sonst der Strahlung wegen nicht arbeiten könne. Sie will die Stelle unbedingt haben.',
    target: 'Deshalb hat sie die Information verschwiegen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 13,
    context:
      'Eine Freundin von Matthias hat am Abend ihren ersten Bühnenauftritt und ist nervös. Er merkt, dass es sie beruhigen würde, wenn er mitkommt.',
    target: 'Er ist ohne ein Wort zu sagen hingegangen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 13,
    context:
      'Matthias geht regelmäßig ins Spielcasino und hat deshalb häufig Streit mit seiner Frau. Sie bittet ihn nicht dorthin zu gehen, da er erst letzte Woche ihr ganzes Haushaltsgeld verspielt hat.',
    target: 'Er ist ohne ein Wort zu sagen hingegangen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 14,
    context:
      'Tinas Opa leidet an Krebs und wird bald sterben. Zu seinem 85. Geburtstag hat er ein großes Fest geplant und wünscht sich vor allem, dass alle seine Kinder und Enkel kommen.',
    target: 'Sie hat die Einladung angenommen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 14,
    context:
      'Tinas Chef macht schon seit einer Weile eindeutige Anspielungen. Nun hat er sie zu einem Essen in ein teures Restaurant eingeladen. Sie weiß, dass er seit 20 Jahren verheiratet ist und drei Kinder hat.',
    target: 'Sie hat die Einladung angenommen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 15,
    context:
      'Herr Kraus muss eine Stelle in seinem Team besetzen. Es gibt einen Bewerber, der offensichtlich anhand des Bewerbungsbildes und seines Namens ein Mitbürger mit Migrationshintergrund ist.',
    target: 'Er bekommt sofort eine Zusage für die Stelle.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 15,
    context:
      'Herr Kraus muss eine Stelle in seinem Team besetzen. Es gibt Bewerber, die besser ins Team passen würden und höher qualifiziert sind, aber der Sohn des Konzernchefs hat sich ebenfalls auf die Stelle beworben.',
    target: 'Er bekommt sofort eine Zusage für die Stelle.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 16,
    context:
      'Ben ist wegen sexueller Belästigung angezeigt worden. Er war an dem fraglichen Nachmittag bei einem Freund. Dieser Freund wird von der Polizei befragt.',
    target: 'Er verschafft ihm das Alibi.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 16,
    context:
      'Ben ist wegen sexueller Belästigung angezeigt worden. Er behauptet an diesem Nachmittag bei seinem Freund gewesen zu sein, was jedoch gelogen ist. Sein Freund wird nun befragt.',
    target: 'Er verschafft ihm das Alibi.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 17,
    context:
      'Frau Förster ist im Büro auf dem frisch gewischten Boden ausgerutscht und hat sich das Handgelenk gebrochen. Wenn sie dies als Privatunfall bei der Versicherung angibt, ist es zu ihrem eigenen Vorteil.',
    target: 'Sie hat es bei der Versicherung als Arbeitsunfall angegeben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 17,
    context:
      'Frau Förster mag ihren Chef nicht. Als sie zu Hause putzt, rutscht sie aus und bricht sich das Handgelenk. Wenn sie einen Arbeitsunfall melden würde, hätte ihr Chef Probleme mit der Versicherung.',
    target: 'Sie hat es bei der Versicherung als Arbeitsunfall angegeben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 18,
    context:
      'Als Experte für Nuklearanlagen überprüft Herr Schneider die Notsicherheitssysteme in einem Atomkraftwerk. Ein Mitarbeiter weist ihn auf schwere Sicherheitsmängel hin und bittet ihn, seinen Namen im Bericht unerwähnt zu lassen, da er sonst seinen Job verliert.',
    target: 'Herr Schneider ist auf diese Bitte eingegangen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 18,
    context:
      'Als Experte für Nuklearanlagen überprüft Herr Schneider die Notsicherheitssysteme in einem Atomkraftwerk. Der Betreiber des Kraftwerks gibt ihm zu verstehen, dass man sich erkenntlich zeigen werde, sollte sein Gutachten den sehr schweren Sicherheitsmangel unerwähnt lassen.',
    target: 'Herr Schneider ist auf diese Bitte eingegangen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 19,
    context:
      'Herr Schäfer ist ein erfolgreicher Anwalt. Er baut eine enge Beziehung zu seinen Klienten auf, um sich besser für sie einsetzen zu können.',
    target: 'Das hat positive Auswirkungen auf das Urteil.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 19,
    context:
      'Herr Schäfer ist Richter. In der Pause einer Verhandlung gibt ihm der Anwalt des Angeklagten einen Kaffee aus.',
    target: 'Das hat positive Auswirkungen auf das Urteil.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 20,
    context:
      'Herr Klein arbeitet als Kommissar im Kriminalamt. In einem aktuellen Fall zu sexuellem Kindesmissbrauch gehört es zu seiner Aufgabe das beschlagnahmte Filmmaterial auszuwerten.',
    target: 'Er schaut sich die Kinderpornos an.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 20,
    context:
      'Herr Klein ist Erzieher im Kinderheim und bringt die Kinder dazu in seinen selbstgedrehten Filmen mitzumachen. Dabei lässt er sich gerne von Filmen verschiedenster Genres inspirieren.',
    target: 'Er schaut sich die Kinderpornos an.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 21,
    context:
      'Max ist ein sauberer Profisportler und weiß, dass ein gedopter Konkurrent seine Urinprobe mit Max` Namen beschriftet und an das Labor geschickt hat.',
    target: 'Max hat deswegen die Urinprobe im Labor vertauscht.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 21,
    context:
      'Max ist Schwimmsportler und sein Traum, an den olympischen Spielen teilzunehmen, ist in Erfüllung gegangen. Er weiß, dass die Dopingkontrolle bei ihm positiv ausfallen wird.',
    target: 'Max hat deswegen die Urinprobe im Labor vertauscht.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 22,
    context:
      'Johanna ist im Kinderballett und die Mädchen vertreiben sich oft die Wartezeit bis zum Beginn des Trainings mit gegenseitigem Schabernack.',
    target: 'Sie sieht die Ballettschuhe einer Anderen und versteckt diese.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 22,
    context:
      'Johanna ist Balletttänzerin und wartet mit vielen anderen Konkurrentinnen bei einem Vortanzen für die Hauptrolle in einem Stück, dass sie endlich aufgerufen wird.',
    target: 'Sie sieht die Ballettschuhe einer Anderen und versteckt diese.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 23,
    context:
      'Herr Schröder ist Unternehmer und beschäftigt viele Kurz- und Schwarzarbeiter, die er unangemessen oder gar nicht bezahlt. Nun steht er vor Gericht.',
    target: 'Er hat den Fall gewonnen, weil er die Geschädigten schließlich angemessen bezahlt hat.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 23,
    context:
      'Herr Schröder ist ein erfolgreicher Anwalt in einer großen Kanzlei. Letzte Woche hatte er einen sehr schwierigen Fall, der bedeutend für seine Karriere war.',
    target: 'Er hat den Fall gewonnen, weil er die Geschädigten schließlich angemessen bezahlt hat.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 24,
    context:
      'Frau Neumann ist Klavierlehrerin und hat zwei gute Schüler bei einem Wettbewerb für Nachwuchsmusiker angemeldet. Die beiden erbringen eine sehr gute Leistung im Vergleich zu den anderen.',
    target: 'Sie bewertet ihre Schüler im Vergleich zu den Anderen besser.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 24,
    context:
      'Frau Neumann ist Gymnasiallehrerin und wird die Hausaufgaben einsammeln und bewerten. Ein kranker Kollege hat sie gebeten, dies auch bei seiner Klasse zu tun.',
    target: 'Sie bewertet ihre Schüler im Vergleich zu den Anderen besser.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 25,
    context:
      'Anne wurde von ihrer Tante gefragt, ob sie Lust hätte ihr bei der Organisation ihrer Geburtstagsparty zu helfen.',
    target: 'Sie veranstaltet die Party im Haus der Tante.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 25,
    context:
      'Seit langem plant Anne eine größere Geburtstagsparty. Nun soll sie während des Urlaubes das Haus und die Blumen der Tante hüten.',
    target: 'Sie veranstaltet die Party im Haus der Tante.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 26,
    context:
      'Herr Berger ist Anwalt und hat eine Kanzlei. Er hat die Daten seines Archivs digitalisiert. Das Problem bei der Entsorgung des Papiermülls ist, dass es sich um sehr sensible Daten handelt.',
    target: 'Er hat die Abfälle einfach verbrannt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 26,
    context:
      'Herr Berger ist Gärtner und beschneidet seine Obstbäume. Es hat seit Wochen nicht geregnet, so dass hohe Waldbrandgefahr herrscht. In den Medien werden offene Feuer verboten.',
    target: 'Er hat die Abfälle einfach verbrannt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 27,
    context:
      'Herr Wagner leidet unter einer Angststörung. Als er wieder eine starke Panikattacke mit massiven körperlichen Symptomen bekommt, bittet er den Arzt um Hilfe.',
    target: 'Der Arzt spritzt ihm ein Beruhigungsmittel.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 27,
    context:
      'Herr Wagner hatte einen Unfall und liegt im Krankenhaus. Der behandelnde Arzt ist von ihm genervt, weil er ein fröhlicher Mensch ist und viel redet.',
    target: 'Der Arzt spritzt ihm ein Beruhigungsmittel.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 28,
    context:
      'Sarah ist Promoterin und steht meistens in Fußgängerzonen und verteilt kostenlose Werbegeschenke an Passanten. Da spricht sie die nächste Passantin an.',
    target: 'Sarah hat ihr das Produkt geschenkt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 28,
    context:
      'Sarah ist Verkäuferin für eine große Bekleidungskette. Als sie gerade arbeitet, kommt eine gute Freundin an die Kasse und möchte bezahlen.',
    target: 'Sarah hat ihr das Produkt geschenkt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 29,
    context:
      'Frau Bauer möchte zum Abteilungsessen gehen und sucht einen Babysitter. Sie erhält die Anfrage einer Frau, von der man weiß, dass sie gegenüber Kindern bereits handgreiflich wurde.',
    target: 'Sie hat der Babysitterin abgesagt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 29,
    context:
      'Frau Bauer möchte zum Abteilungsessen gehen und sucht einen Babysitter. Sie erhält die Anfrage einer jungen Studentin, die am Telefon sehr sympathisch wirkt, aber mit ausländischem Akzent spricht.',
    target: 'Sie hat der Babysitterin abgesagt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 30,
    context:
      'Julia ist Praktikantin im Marketingbereich eines großen Unternehmens. Sie darf dort nur Kopieren und Briefe abtippen.',
    target: 'Sie bekommt dafür ein hohes Gehalt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 30,
    context:
      'Julia ist Praktikantin im Marketingbereich eines großen Unternehmens. Sie darf dort nur kopieren und Briefe abtippen.',
    target: 'Sie bekommt dafür ein hohes Gehalt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 31,
    context:
      'Alex nimmt an einem Karatetunier teil und sein nächster Gegner ist ihm weitaus überlegen. Er überlegt sich eine Strategie, wie er seinen Gegner besiegen kann.',
    target: 'Alex packt ihn am Kragen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 31,
    context:
      'Alex ist dafür bekannt, lockere Fäuste zu haben. Auf dem Weg in die Stadt gerät er im Bus mit einem anderen Fahrgast aneinander.',
    target: 'Alex packt ihn am Kragen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 32,
    context:
      'Jan ist Feuerwehrmann und auf dem Weg eine Katze aus einem Baum zu retten, als er einen zweiten Notruf erhält. Ein Mehrfamilienhaus brennt, in dem sich noch einige Personen aufhalten. Es zählt jede Minute.',
    target: 'Er geht zuerst dem zweiten Notruf nach.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 32,
    context:
      'Jan ist Feuerwehrmann und erhält den Notruf, dass ein Mehrfamilienhaus brennt. Da erhält er einen zweiten Notruf ganz aus der Nähe. Er soll eine Katze von einem hohen Baum herunterholen.',
    target: 'Er geht zuerst dem zweiten Notruf nach.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 33,
    context:
      'Sabine ist zur Hochzeit einer Cousine eingeladen, wofür sie sich von einer Freundin ein Kleid geliehen hat. Der Reinigung unterläuft ein schwerwiegender Fehler.',
    target: 'Sie berichtet ihrer Freundin, dass das Kleid in der Reinigung ruiniert wurde.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 33,
    context:
      'Sabine ist zur Hochzeit einer Cousine eingeladen, wofür sie sich von einer Freundin ein Kleid geliehen hat. Das Kleid gefällt ihr so sehr, dass sie es am liebsten behalten würde.',
    target: 'Sie berichtet ihrer Freundin, dass das Kleid in der Reinigung ruiniert wurde.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 34,
    context:
      'Frau Lehmann hat einen Austauschschüler, der kaum redet, weil er fürchtet, die anderen könnten ihn auslachen. Als er sich endlich traut zu sprechen, macht der er kleinere Fehler.',
    target: 'Sie hat ihn auf die Fehler nicht hingewiesen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 34,
    context:
      'Frau Lehmann ist Deutschlehrerin und wird von einem Freund darum gebeten, seine Abschlussarbeit gegenzulesen. Von dieser Leistung ist es abhängig, ob ihr Freund das Studium mit der Wunschnote beendet. Beim Lesen entdeckt Frau Lehmann kleinere Fehler.',
    target: 'Sie hat ihn auf die Fehler nicht hingewiesen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 35,
    context:
      'Frau Lehmann hat einen Austauschschüler, der kaum redet, weil er fürchtet, die anderen könnten ihn auslachen. Als er sich endlich traut zu sprechen, macht er kleinere Fehler.',
    target: 'Sie gibt ihm keinen Hinweis auf die Fehler.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 35,
    context:
      'Frau Huber ist mit ihrer Tochter im nahe gelegenen Supermarkt. Als sie zum Parkplatz laufen, holt das Kind einen Schokoriegel aus der Tasche, den sie nicht bezahlt hat.',
    target: 'Auf dem Heimweg lobt sie ihre Tochter.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 36,
    context:
      'Herr Mayer arbeitet in einem großen Unternehmen. Er muss viele Überstunden machen, verdient aber nicht mehr. Für seine Familie hat er kaum noch Zeit und seine Gesundheit leidet darunter. Nun hat er ein attraktives Jobangebot erhalten.',
    target: 'Er hat das Angebot angenommen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 36,
    context:
      'Herr Mayer ist Gründer eines kleinen Traditionsunternehmens. Er ist dafür verantwortlich, dass es kurz vor dem Konkurs steht. Nun hat er ein attraktives Jobangebot erhalten und überlegt, ob er das sinkende Schiff verlässt.',
    target: 'Er hat das Angebot angenommen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 37,
    context:
      'Jana passt manchmal auf die Nachbarskinder auf. Sie verspricht den Kindern eine Überraschung, wenn sie ihr Zimmer aufräumen. Als sie das nächste Mal in die Zimmer schaut, sind sie aufgeräumt.',
    target: 'Sie gibt ihnen eine Tüte Gummibärchen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 37,
    context:
      'Jana passt auf die Nachbarskinder auf. Sie hat den Eltern versprochen für eine ordentliche Mahlzeit zu sorgen. Ihr wurde gesagt, dass die Kinder eine ernsthafte Gelatine-Intoleranz haben.',
    target: 'Sie gibt ihnen eine Tüte Gummibärchen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 38,
    context:
      'Anna war bei einem Vorstellungsgespräch. Eine Freundin hat nun das gleiche Vorstellungsgespräch und leidet unter starker Prüfungsangst. Wenn diese wüsste, dass das Gespräch direkt mit dem Chef erfolgt, würde sie es gar nicht erst versuchen.',
    target: 'Anna beschließt, ihrer Freundin diese Information zu verschweigen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 38,
    context:
      'Anna hat nach einem Vorstellungsgespräch eine Absage erhalten. Als eine Freundin das gleiche Vorstellungsgespräch hat, überlegt Anna, ob sie ihr sagen soll, worauf der Firmenchef besonderen Wert legt.',
    target: 'Anna beschließt, ihrer Freundin diese Information zu verschweigen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 39,
    context:
      'Jörg ist Taxifahrer und hat an einem Samstagabend Dienst, als ihn vor einer Disko ein Mann und eine Frau asiatischer Herkunft anhalten. Er hat schlechte Erfahrungen mit Asiaten gemacht.',
    target: 'Er lässt die beiden Personen einsteigen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 39,
    context:
      'Jörg ist Taxifahrer und hat an einem Samstagabend Dienst, als er beobachtet, wie zwei Rowdys einen Mann zusammenschlagen. Dann laufen sie in seine Richtung davon und halten ihn an.',
    target: 'Er lässt die beiden Personen einsteigen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 40,
    context:
      'Herr Schwarz ist Chirurg und ein angesehener Wissenschaftler. Er hat die Erlaubnis seiner Patienten, die Operationen für seine Kollegen zur Verfügung zu stellen.',
    target: 'Er macht Videos und stellt sie später auf eine Plattform.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 40,
    context:
      'Herr Schwarz ist Gynäkologe in einer kleineren Gemeinde und nutzt das Vertrauen seiner Patientinnen für private Zwecke.',
    target: 'Er macht Videos und stellt sie später auf eine Plattform.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 41,
    context:
      'Lena ist Studentin und lebt in einer Wohngemeinschaft. Viele Dinge teilen sich die Bewohner untereinander. Sie geht in den Supermarkt, um die Zutaten für ein gemeinsames Essen zu kaufen.',
    target: 'Lena sieht abgelaufenes Fleisch und legt es zurück.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 41,
    context:
      'Lena ist Studentin und lebt in einer Wohngemeinschaft. Viele Dinge teilen sich die Bewohner untereinander. Eine Mitbewohnerin ist allerdings blind und somit müssen die anderen besonders achtsam sein.',
    target: 'Lena sieht abgelaufenes Fleisch und legt es zurück.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 42,
    context:
      'Frau Köhler ist Lehrerin und sammelt stichprobenartig die Hausaufgaben ihrer Schüler ein. Lisa ist eine unzuverlässige und faule Schülerin. Sie schreibt schlechte Noten und erledigt in der Regel nicht ihre Hausaufgaben. Auch dieses Mal hat sie wieder keine Hausaufgaben gemacht.',
    target: 'Frau Köhler gibt ihr eine Sechs.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 42,
    context:
      'Frau Köhler ist Lehrerin und sammelt stichprobenartig die Hausaufgaben ihrer Schüler ein. Lisa ist eine der besten Schülerinnen und hat normalerweise immer ihre Hausaufgaben sorgfältig erledigt. Am Wochenende ist ihre Oma gestorben und so hat sie die Hausaufgaben ausnahmsweise nicht.',
    target: 'Frau Köhler gibt ihr eine Sechs.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 43,
    context:
      'Christian ist Journalist und hat eine Bekannte, die gerade einen historischen Roman geschrieben hat. Diese gibt ihm ein Exemplar mit der Absicht, es ihm zu schenken, falls er das Thema interessant findet.',
    target: 'Er hat ihr das Buch nie zurückgegeben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 43,
    context:
      'Christian ist Journalist und soll zu einem bestimmten Thema einen Bericht schreiben. Für die Einarbeitung benötigt er die entsprechende Fachliteratur. Eine Bekannte, die in diesem Bereich arbeitet, leiht ihm ein Buch zu diesem Thema.',
    target: 'Er hat ihr das Buch nie zurückgegeben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 44,
    context:
      'Herr Möller ist Schweizer und wird in eine Bank nach Deutschland versetzt. Für den Umzug muss er noch die Schweizer Umzugsfirma bezahlen.',
    target: 'Deswegen transferiert er Geld in die Schweiz.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 44,
    context:
      'Herr Möller ist Vorstand in einer großen Bank in Deutschland, die auch in der Schweiz operiert. Er müsste hohe Steuern zahlen und will das vermeiden.',
    target: 'Deswegen transferiert er Geld in die Schweiz.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 45,
    context:
      'Jana ist Kellnerin und hilft einer Kollegin aus der Patsche. Als Dank will sie Jana das Trinkgeld von diesem einen Tag überlassen.',
    target: 'Jana hat das Geld behalten.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 45,
    context:
      'Jana ist selbst Verkäuferin und geht einkaufen. An der Kasse erhält sie zu viel Wechselgeld. Sie weiß, dass die Kassiererin den fehlenden Betrag aus eigener Tasche bezahlen muss.',
    target: 'Jana hat das Geld behalten.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 46,
    context:
      'Michael arbeitet als Sanitäter und fährt nach einem Einsatz mit seinem Kollegen in die Kantine. An der Kasse fällt dem Kollegen auf, dass er kein Bargeld bei sich hat und er fragt Michael, ob er ihm etwas leihen könnte.',
    target: 'Er hat ihm das Geld gegeben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 46,
    context:
      'Michael arbeitet als Sanitäter und fährt zu einem Einsatz. Vor Ort bittet ihn der Drogenabhängige, der eben noch bewusstlos war, um Geld. Er weiß, dass er sich damit nur weitere Drogen kaufen wird.',
    target: 'Er hat ihm das Geld gegeben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 47,
    context:
      'Frau Fischer hat sich vor kurzem von Ihrem Mann getrennt, als ihr die Frauenärztin nach einer Untersuchung mitteilt, dass sie schwanger ist und ihr Kind starke Missbildungen aufweist, wodurch es sehr wahrscheinlich nur kurze Zeit leben wird.',
    target: 'Frau Fischer wird das Kind abtreiben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 47,
    context:
      'Frau Fischer erfährt nach einer Routineuntersuchung beim Frauenarzt, dass sie schwanger ist und sich ihr Kind sehr gesund entwickelt. Nun hat sie Angst dick zu werden.',
    target: 'Frau Fischer wird das Kind abtreiben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 48,
    context:
      'Rechtsanwalt Weber erhält von der Kripo Informationen über den aktuellen Ermittlungsstand bei einem schweren Raubüberfall. Der Fall betrifft einen seiner Klienten als geschädigte Person.',
    target: 'Herr Weber wird ihn über die bevorstehende Verhaftung informieren.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 48,
    context:
      'Staatsanwalt Weber erfährt zufällig über einen Kollegen vom aktuellen Ermittlungsstand in einem schweren Missbrauchsfall. Ein enger Freund gilt als Tatverdächtiger.',
    target: 'Herr Weber wird ihn über die bevorstehende Verhaftung informieren.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 49,
    context:
      'Herr Müller ist Finanzberater und erfährt, dass die Bank jetzt nur noch Erfolgshonorare ausschüttet, wenn Kunden Verträge über riskante Aktienfonds abschließen. In das seit langem im Wert steigende Gold anzulegen, ist jedoch der sichere Weg.',
    target: 'Herr Müller rät einem Kunden sein Geld in Gold anzulegen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 49,
    context:
      'Herr Müller ist Finanzberater und erfährt, dass die Bank jetzt nur noch Erfolgshonorare ausschüttet, wenn Kunden ihr Geld in Goldfonds im Vergleich zu variablen Aktienfonds anlegen. Er hat Insiderinformationen, dass der Absturz des Goldwertes sich fortsetzen wird.',
    target: 'Herr Müller rät einem Kunden sein Geld in Gold anzulegen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 50,
    context:
      'Lena gewährt ihrer iranischen Freundin Unterschlupf, die ihren Mann verlassen und bei den Behörden angezeigt hat, da sie sich von ihm bedroht fühlt.',
    target: 'Als die Polizei erscheint, gibt Lena an, dass sie ihre Freundin versteckt.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 50,
    context:
      'Lena gewährt ihrer iranischen Freundin Unterschlupf, da ihre Abschiebung von Seiten der Behörden ansteht und ihr somit Folter und Tod im Iran drohen. Sie verspricht sie nicht zu verraten.',
    target: 'Als die Polizei erscheint, gibt Lena an, dass sie ihre Freundin versteckt.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 51,
    context:
      'Als Buchkritiker verfasst Herr Meier eine Rezension über das neue Buch seines Intimfeindes, welches er allerdings für ein sehr starkes Werk hält.',
    target: 'Herr Meier verfasst eine äußerst positive Buchkritik.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 51,
    context:
      'Als Buchkritiker soll Herr Meier eine Rezension über das neue Buch eines Autors schreiben, welcher ihm für eine positive Kritik eine hohe Summe bietet.',
    target: 'Herr Meier verfasst eine äußerst positive Buchkritik.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 52,
    context:
      'Die junge Freundin des Sozialhelfers lässt keine Gelegenheit aus, um auch mit anderen Männern Sex zu haben. Schließlich informieren ihn Freunde über das Gebaren seiner Freundin.',
    target: 'Nach kurzer Zeit entscheidet er sich für die Trennung.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 52,
    context:
      'Die junge Freundin des Sozialhelfers erleidet bei einem unverschuldeten Unfall schwerste Verletzungen, weshalb sie vorübergehend auf fremde Hilfe angewiesen ist.',
    target: 'Nach kurzer Zeit entscheidet er sich für die Trennung.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 53,
    context:
      'Melanie ist selbstständige Kosmetikerin mit einem gut laufenden Laden und ist daher nicht auf jede Kundin angewiesen. Als sie gerade Pause machen will, betritt ein junges Mädchen ihren Salon, welches lediglich Haare schneiden möchte.',
    target: 'Ohne zu zögern beginnt sie die Behandlung des Mädchens.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 53,
    context:
      'Melanie ist Tätowiererin und hält sich nicht immer an die rechtlichen Vorschriften und Gesundheitsrichtlinien. Als sie gerade den Boden wischt, betritt ein minderjähriges Mädchen ohne einen Elternteil ihren Salon.',
    target: 'Ohne zu zögern beginnt sie die Behandlung des Mädchens.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 54,
    context:
      'Herr Schmitt ist Bäcker. Gesetzlich ist es erlaubt altes Brot in bestimmten Anteilen in frischen Broten einzubacken.',
    target: 'Er verarbeitet das alte Brot.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 54,
    context:
      'Herr Schmitt ist Bäcker und möchte altes Brot weiter verwerten. Er sieht, dass es schon zu schimmeln beginnt.',
    target: 'Er verarbeitet das alte Brot.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 55,
    context:
      'Herr Hofmanns minderjähriger Sohn ist stark pubertierend und verstößt gerne gegen die Regeln der Eltern. Nun ist er unerlaubt auf eine Messe gegangen, von der ihn sein Vater abholen muss.',
    target: 'Herr Hofmann geht auf die Erotikmesse.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 55,
    context:
      'Herr Hofmann hat seiner Frau erzählt, dass er auf die Automobilmesse gehen möchte. Er hat allerdings eine andere Absicht.',
    target: 'Herr Hofmann geht auf die Erotikmesse.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 56,
    context:
      'Frau Koch schreibt Kolumnen für eine große Wochenzeitung. Die Leser lieben ihre Beiträge, weil die Artikel sehr persönlich und witzig geschrieben sind.',
    target: 'Ihre Empfehlungen beruhen zumeist auf subjektiven Einschätzungen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 56,
    context:
      'Frau Koch schreibt Gutachten für jugendliche Straftäter, die meistens ausschlaggebend für das Maß der Strafe sind. Sie muss sich dabei an objektive Analysemethoden orientieren.',
    target: 'Ihre Empfehlungen beruhen zumeist auf subjektiven Einschätzungen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 57,
    context:
      'Lukas hat einen Kollegen gefragt, ob er sich mit ihm ein Fußballspiel anschauen möchte. Dieser interessiert sich jedoch nicht für Fußball.',
    target: 'Er lässt seinen Kollegen zurück und schaut das Spiel.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 57,
    context:
      'Lukas ist Polizist und ist an diesem Wochenende bei einem Fußballspiel seiner Lieblingsmannschaft eingesetzt.',
    target: 'Er lässt seinen Kollegen zurück und schaut das Spiel.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 58,
    context:
      'Herr Wolf ist Buchautor und schreibt an einem Roman, inspiriert von autobiographischen Informationen eines Freundes. Dieser will anonym bleiben und dass man ihn nicht anhand der Informationen identifizieren kann.',
    target: 'In seiner Story berichtet er deshalb auch Unwahrheiten.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 58,
    context:
      'Herr Wolf ist Reporter einer großen Zeitung und wird ins Büro des Chefs gerufen. Er gerät unter Druck, weil er die Aussicht auf eine bessere Position erhält, wenn der nächste Bericht ein Erfolg werden würde.',
    target: 'In seiner Story berichtet er deshalb auch Unwahrheiten.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 59,
    context:
      'Philipp ist Fahrschullehrer und Sicherheit ist sein oberstes Gebot. Oft können seine Schüler schnell einigermaßen fahren, aber nach den wenigen Stunden haben sie gar keine Routine.',
    target: 'Er macht meist zusätzliche Fahrstunden.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 59,
    context:
      'Philipp ist Besitzer einer Fahrschule und verdient ganz gut. Dennoch will er den Profit weiterhin erhöhen.',
    target: 'Er macht meist zusätzliche Fahrstunden.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 60,
    context:
      'Herr Krüger ist Schönheitschirurg. Bei einer Brustvergrößerung erklärt er einem Studenten alle relevanten Schritte und welche Faktoren eine Schwierigkeit darstellen könnten.',
    target: 'Sie reden über ihre Fettleibigkeit.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 60,
    context:
      'Herr Krüger ist Unfallchirurg. Mit seinem Kollegen macht er während einer Operation häufig üble Scherze. Sie operieren eine Frau, die unter Vollnarkose steht.',
    target: 'Sie reden über ihre Fettleibigkeit.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 61,
    context:
      'Herr Hartmann ist Hausmeister einer Grundschule. Er ist gerade auf dem Heimweg, als er auf dem Sportplatz den MP3-Player seines Sohnes findet.',
    target: 'Er hat den MP3-Player nach Hause mitgenommen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 61,
    context:
      'Herr Hartmann ist Hausmeister einer Grundschule. Auf dem Sportplatz findet er einen MP3-Player. Sein Sohn hat bald Geburtstag und er weiß, dass er sich einen wünscht.',
    target: 'Er hat den MP3-Player nach Hause mitgenommen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 62,
    context:
      'Meike lebt in einer Wohngemeinschaft. Sie will für ihre Mitbewohner Milchreis kochen, doch einer leidet unter Laktoseunvertäglichkeit.',
    target: 'Sie nimmt eine laktosefreie Milch.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 62,
    context:
      'Meike hat keine Milch mehr und geht an den Kühlschrank ihrer Mitbewohner. Als erstes sieht sie die teure Milch von dem Mitbewohner, welcher keine Laktose verträgt und zusätzlich knapp bei Kasse ist.',
    target: 'Sie nimmt eine laktosefreie Milch.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 63,
    context:
      'Lisa ist Doktorandin am Universitätsklinikum. Sie hat heute Nachmittag eine lose Verabredung mit einer Bekannten. Auf dem Gang trifft sie einen Kollegen, der verzweifelt Hilfe bei seiner Datenauswertung benötigt und sie fragt, ob sie heute Nachmittag Zeit hätte.',
    target: 'Sie sagt der Bekannten kurzfristig ab.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 63,
    context:
      'Lisa ist Doktorandin am Universitätsklinikum. Sie hat am Nachmittag eine Verabredung mit einer Bekannten, die ihre Hilfe benötigt. Auf dem Gang trifft sie einen Kollegen, der sie ebenfalls am Nachmittag spontan zum Kaffee einlädt.',
    target: 'Sie sagt der Bekannten kurzfristig ab.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 64,
    context:
      'Herr Lange ist Berater bei einer Investmentbank mit regelmäßigem Kundenkontakt. Innerhalb seiner Arbeit kommt er täglich mit hochsensiblen Daten in Berührung, seine Kunden vertrauen ihm aber.',
    target: 'Die zugrunde liegenden Daten hat er intern geheim gehalten.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 64,
    context:
      'Herr Lange ist junger Wissenschaftler in einem angesehenen molekulargenetischen Institut und hat kürzlich eine eigene Theorie vorgestellt. Seine neuesten Befunde sprechen gegen seine Annahmen, würde der Wissenschaft aber großen Nutzen bringen.',
    target: 'Die zugrunde liegenden Daten hat er intern geheim gehalten.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 65,
    context:
      'Frau Schmitt feiert ihren Geburtstag und hat eine Menge Leute eingeladen. Eine Freundin bringt ihren Partner mit, den Frau Schmitt nicht ausstehen kann.',
    target: 'Sie reicht ihm dennoch ein Glas des Champagners.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 65,
    context:
      'Frau Schmitt feiert ihren Geburtstag und hat eine Menge Leute eingeladen. Ein Freund ist trockener Alkoholiker.',
    target: 'Sie reicht ihm dennoch ein Glas des Champagners.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 66,
    context:
      'Frau Werner ist Apothekerin. Ihr langjähriger Nachbar hat eine schwere Grippe und kann nicht aus dem Haus gehen. Er hat Frau Werner um Hilfe gebeten, denn er benötigt dringend Medikamente.',
    target: 'Sie nutzt ihre Arbeitsstelle, um an die entsprechenden Medikamente zu gelangen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 66,
    context:
      'Frau Werner ist Apothekerin und seit Jahren von Medikamenten abhängig, was sie bisher noch geheim halten konnte. Die Apotheke Ihres Chefs ist in eine finanzielle Schieflage geraten und ist auf jeden Cent angewiesen.',
    target: 'Sie nutzt ihre Arbeitsstelle, um an die entsprechenden Medikamente zu gelangen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 67,
    context:
      'Fabian geht am Wochenende mit seinem Sohn in den Zoo. Sie haben sich ein Eis gekauft und sitzen auf einer Bank, als sich sein Sohn plötzlich verschluckt und keine Luft mehr bekommt.',
    target: 'Fabian hat seinem Sohn heftig auf den Rücken geschlagen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 67,
    context:
      'Fabian geht am Wochenende mit seinem Sohn in den Zoo. Sein Sohn wird frech und streckt seinem Vater die Zunge raus.',
    target: 'Fabian hat seinem Sohn heftig auf den Rücken geschlagen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 68,
    context:
      'Hannah ist Reiseleiterin. Sie ist in Thailand unterwegs, als ihr ein Händler auf einem Markt Kleidungsstücke anbietet, die ausschließlich von Kindern produziert sind.',
    target: 'Sie wird das Kleidungsstück ablehnen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 68,
    context:
      'Hannah ist Reiseleiterin und erlebt in Thailand sehr viel Elend. Als sie über einen Markt läuft, bietet ihr ein abgemagertes Straßenkind ein Kleid für umgerechnet 10 Cent zum Kauf an.',
    target: 'Sie wird das Kleidungsstück ablehnen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 69,
    context:
      'Patrick ist Gärtner für exotische Zierpflanzen. Beim Gießen sieht er, dass die Pflanzen stark von Blattläusen befallen sind. Für diesen Fall hat er ein umweltfreundliches Gegenmittel.',
    target: 'Er greift zum Gift.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 69,
    context:
      'Patrick ist zertifizierter Biobauer. Als er zu seinen Feldern fährt, sieht er, dass seine Ernte leicht von Blattläusen befallen ist.',
    target: 'Er greift zum Gift.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 70,
    context:
      'Jonas arbeitet an einer Konzertkasse. Es ist erwünscht, dass die Mitarbeiter sich nach Beginn eines Konzerts in den Saal begeben und letzte Plätze besetzen. Das heutige Konzert entspricht gar nicht seinem Geschmack.',
    target: 'Dennoch geht er rein.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 70,
    context:
      'Jonas arbeitet an einer Kinokasse. Den Mitarbeitern ist es untersagt den Kassenplatz zu verlassen und sich die Filme anzuschauen.',
    target: 'Dennoch geht er rein.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 71,
    context:
      'Sophie arbeitet als Sekretärin. Der Leiter der Nachbarabteilung hat seinen Kugelschreiber im Konferenzraum vergessen. Sein Büro liegt nicht auf ihrem direkten Rückweg.',
    target: 'Sie hat den Kugelschreiber einfach mitgenommen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 71,
    context:
      'Sophie arbeitet als Sekretärin. Alle Büroartikel sind für die Mitarbeiter frei zugänglich, allerdings nicht für den privaten Gebrauch. Sophie will einen der Kugelschreiber ihrer Freundin schenken.',
    target: 'Sie hat den Kugelschreiber einfach mitgenommen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 72,
    context:
      'Erik studiert Mathematik. Für die Übungsaufgaben hat er sich die Lösungen einer besonders kniffeligen Aufgabe beim Professor besorgt. Dieser hat ihn darum gebeten, aus Fairness die Lösungen an die anderen Studierenden weiterzureichen.',
    target: 'Er hat den anderen die Lösungen gegeben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 72,
    context:
      'Erik studiert Mathematik. Für die bevorstehende Klausur hat er sich bei einem Freund des höheren Semesters die Lösungen besorgt. Dieser hat ihn allerdings darum gebeten die Lösungen nicht herumzureichen, weil er sonst exmatrikuliert werden könnte.',
    target: 'Er hat den anderen die Lösungen gegeben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 73,
    context:
      'Herr Winkler ist Herzchirurg, der gerade einen akuten Notfallpatienten operiert, als er zu einer Besprechung mit Pharmavertretern gerufen wird. Es geht um das Aufstellen einer Werbetafel im Krankenhaus.',
    target: 'Ohne langes Zögern entscheidet sich Herr Winkler zum Weiterführen der Operation.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 73,
    context:
      'Herr Winkler ist Hautarzt, der bei einem Patienten gerade erst mit dem Entfernen von Muttermalen begonnen hat, als er zu einem lebensbedrohlichen Notfall gerufen wird.',
    target: 'Ohne langes Zögern entscheidet sich Herr Winkler zum Weiterführen der Operation.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 74,
    context:
      'Lara geht zum Klettern an eine frei zugängliche Kletterwand. Die Bezahlung erfolgt auf Vertrauensbasis. Sie ist Schülerin und muss deshalb nichts bezahlen.',
    target: 'Lara geht ohne zu bezahlen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 74,
    context:
      'Lara geht zum Klettern an eine frei zugängliche Kletterwand. Wenn das Kassenhäuschen nicht besetzt ist, läuft die Bezahlung auf Vertrauensbasis. Als Lara gehen will, ist das Häuschen unbesetzt.',
    target: 'Lara geht ohne zu bezahlen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 75,
    context:
      'Frank arbeitet beim Sicherheitsdienst im Zoo. Aus Sicherheitsgründen dürfen nur Fahrzeuge mit Sondergenehmigung auf das Gelände. Dann möchte ein Krankenwagen im Einsatz passieren.',
    target: 'Er blickt sich um und lässt sie durch.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 75,
    context:
      'Frank arbeitet als Türsteher einer Diskothek. Der Laden steht kurz vor der Schließung, weil gegen das Jugendschutzgesetzt verstoßen wurde. Da kommt eine Bekannte seines Bruders, von welcher er weiß, dass sie erst 15 Jahre alt ist.',
    target: 'Er blickt sich um und lässt sie durch.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 76,
    context:
      'Stefanie wollte am Abend ins Kino und freut sich schon seit Tagen auf diesen Film. Sie müsste jetzt eigentlich aufbrechen, ist aber bei einer Freundin, der es nicht gut geht.',
    target: 'Sie entscheidet sich zu bleiben.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 76,
    context:
      'Stefanie ist im Kino und hat bereits einen Film angeschaut. Im Nachbarsaal beginnt ein anderer Film. Sie könnte, ohne zu bezahlen, einen weiteren Film anschauen.',
    target: 'Sie entscheidet sich zu bleiben.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 77,
    context:
      'Simon schreibt gerade eine Klausur. Seine Nachbarin versucht bei ihm abzuschreiben. Der Professor bemerkt den Versuch und gibt ihm die Schuld.',
    target: 'Simon sagt ihm, dass sie abschrieb.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 77,
    context:
      'Simon schreibt gerade eine Klausur. Er hat zu wenig gelernt und will bei seiner Nachbarin abschreiben. Der Professor erwischt die beiden.',
    target: 'Simon sagt ihm, dass sie abschrieb.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 78,
    context:
      'Herr Albrecht ist Koch in einem Nobelrestaurant. Auf der Dessertkarte gibt es ein Himbeer-Joghurt-Dessert, was er gerade zubereiten will. Auf der Oberfläche ist Schimmel, den er mit dem Löffel entfernt.',
    target: 'Er hat den Joghurt trotzdem weggeworfen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 78,
    context:
      'Herr Albrecht ist Koch und kontrolliert die Lagerbestände der Großküche. Er sieht an einer Palette Joghurt, dass das Haltbarkeitsdatum an diesem Tag abläuft. Er probiert aus zwei Bechern und merkt, dass er noch genießbar ist.',
    target: 'Er hat den Joghurt trotzdem weggeworfen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 79,
    context:
      'Frau Kahn bringt ihren dreijährigen Sohn nach einem gemeinsamen Spieleabend ins Bett. Da er in ein neues Zimmer umgezogen ist, hat er noch Angst im Dunkeln. Er will daher, dass das Licht auch nachts leuchtet.',
    target: 'Sie geht raus und lässt das Licht brennen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 79,
    context:
      'Frau Kahn ist über Weihnachten bei ihren Schwiegereltern zu Besuch, die sie nicht mag. Die anderen sind auf dem Weg in die Kirche und Frau Kahn ist die letzte Person im Haus. Sie sieht, dass die Wachskerzen am Weihnachtsbaum noch nicht gelöscht sind.',
    target: 'Sie geht raus und lässt das Licht brennen.',
    answer: 'INAKZEPTABEL',
  },
  {
    itemNum: 80,
    context: 'Tim ruft von der Straße seinem Vater im ersten Stock zu, er solle ihm seinen Volleyball geben.',
    target: 'Er hat den Ball aus dem Fenster geworfen.',
    answer: 'AKZEPTABEL',
  },
  {
    itemNum: 80,
    context:
      'Tim spielt mit einem Freund, der von seinen Eltern einen neuen Fußball geschenkt bekommen hat. Tim ist neidisch und gönnt ihn seinem Freund nicht.',
    target: 'Er hat den Ball aus dem Fenster geworfen.',
    answer: 'INAKZEPTABEL',
  },
];
