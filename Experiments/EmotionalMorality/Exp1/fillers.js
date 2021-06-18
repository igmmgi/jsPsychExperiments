const fillers = [
  {
    itemNum: 1,
    context: 'Jan muss in die Uni zu einer Vorlesung. Es ist ein grauer Tag und dunkle Wolken stehen am Himmel.',
    target: 'Er entscheidet sich dafür einen Regenschirm mitzunehmen.',
    question: 'Muss Jan zu einer Vorlesung?',
    answer: true,
  },
  {
    itemNum: 2,
    context:
      'Anna benutzt am liebsten ein Duschgel mit Orangenduft. Sie geht in den Drogeriemarkt, um ein neues zu kaufen.',
    target: 'Der Drogeriemarkt führt das Duschgel nur mit Zitronenduft.',
    question: 'Benutzt Anna ein Duschgel mit Orangenduft?',
    answer: true,
  },
  {
    itemNum: 3,
    context:
      'Frau Koch verbringt ihre Freizeit meistens in ihrem Garten. Sie hat ein Blumenbeet mit verschiedenen Sorten.',
    target: 'In der Gärtnerei kauft sie eine Blume mit gelben Blüten.',
    question: 'Verbringt Frau Koch ihre Freizeit im Garten?',
    answer: true,
  },
  {
    itemNum: 4,
    context: 'Herr Berger schaut gerne Filme aller Art. Er hat sich extra bei einer Videothek angemeldet.',
    target: 'Er geht in ein Elektrogeschäft, um sich einen neuen DVD-Player zu kaufen.',
    question: 'Schaut Herr Berger gerne Filme?',
    answer: true,
  },
  {
    itemNum: 5,
    context:
      'Frau Huber hat einen Wellensittich. Sie hätte gerne einen zweiten, weil Wellensittiche lieber in Gesellschaft leben.',
    target: 'Sie geht in ein Zoogeschäft und kauft einen zweiten Vogel.',
    question: 'Hat Frau Huber einen Wellensittich?',
    answer: true,
  },
  {
    itemNum: 6,
    context:
      'Der Sohn von Frau Mayer kommt dieses Jahr in die erste Klasse. Er spielt am liebsten mit seiner Ritterburg.',
    target: 'Sie bastelt ihrem Sohn eine Schultüte aus festem Karton.',
    question: 'Kommt der Sohn von Frau Mayer in die erste Klasse?',
    answer: true,
  },
  {
    itemNum: 7,
    context: 'Herr Krüger hat kein aktuelles Telefonbuch. Er braucht die Nummer seines Hausarztes.',
    target: 'Er ruft bei der Auskunft an, um an die Nummer zu gelangen.',
    question: 'Braucht Herr Krüger die Nummer eins Arztes?',
    answer: true,
  },
  {
    itemNum: 8,
    context: 'Frau Weber hat einen Balkon auf der Südseite, auf dem sie Geranien angepflanzt hat.',
    target: 'Für die Blumen verwendet sie Blumenkästen.',
    question: 'Hat Frau Weber einen Balkon?',
    answer: true,
  },
  {
    itemNum: 9,
    context: 'Herr Wagner geht dreimal in der Woche Joggen. Meistens fährt er dafür in den Wald.',
    target: 'Er hat eine Lieblingsstrecke, für die er meistens 30 Minuten braucht.',
    question: 'Geht Herr Wagner Joggen?',
    answer: true,
  },
  {
    itemNum: 10,
    context: 'Lukas hört viel Musik. Er ist der Meinung, dass der Klang der Musik am besten mit Kopfhörern ist.',
    target: 'Er hat schwarze Kopfhörer einer gängigen Marke.',
    question: 'Hört Lukas viel Musik?',
    answer: true,
  },
  {
    itemNum: 11,
    context:
      'Lisa hat in der Schule gelernt mit Tintenfüller zu schreiben. Ab dem Gymnasium war es den Schülern freigestellt.',
    target: 'Lisa schreibt inzwischen meistens mit Kugelschreiber.',
    question: 'Kann Lisa mit Tintenfüller schreiben?',
    answer: true,
  },
  {
    itemNum: 12,
    context:
      'Herr Richter will am nächsten Tag seinen Rasen mähen. Er schaut am Abend den Wetterbericht für den nächsten Tag.',
    target: 'Es soll ein sonniger und milder Tag werden.',
    question: 'Will Herr Richter seinen Rasen mähen?',
    answer: true,
  },
  {
    itemNum: 13,
    context: 'Sarah muss zum Augenarzt. Sie fährt mit dem Bus in die Stadt, weil ihr Fahrrad in der Werkstatt ist.',
    target: 'Beim Arzt trifft Sarah ihre alte Grundschullehrerin.',
    question: 'Muss Sarah zum Augenarzt?',
    answer: true,
  },
  {
    itemNum: 14,
    context: 'Max liest gerne Krimibücher. Wenn ein Buch spannend ist, kann er es kaum aus der Hand legen.',
    target: 'Er liegt auf dem Sofa und ist in sein Buch vertieft.',
    question: 'Liest Max gerne Krimibücher?',
    answer: true,
  },
  {
    itemNum: 15,
    context:
      'Es ist ein verregneter Herbst und Johanna hat keine Regenjacke. Sie geht mit dem Hund spazieren, als der Regen erneut einsetzt.',
    target: 'Sie stellt sich zum Schutz in einen Hauseingang.',
    question: 'Geht Johanna mit dem Hund spazieren?',
    answer: true,
  },
  {
    itemNum: 16,
    context: 'Frau Neumann ist allergisch gegen Nüsse. Wenn sie einen Kuchen backt, sucht sie Rezepte ohne Nüsse.',
    target: 'Am liebsten hat sie Apfelkuchen mit Sahne.',
    question: 'Ist Frau Neumann allergisch gegen Nüsse?',
    answer: true,
  },
  {
    itemNum: 17,
    context: 'Wenn Julian aus der Schule kommt, hat er meistens großen Hunger und freut sich auf das Mittagessen.',
    target: 'Seine Mutter macht ihm morgens immer ein Pausenbrot.',
    question: 'Freut sich Julian auf das Mittagessen?',
    answer: true,
  },
  {
    itemNum: 18,
    context: 'Herr Bauer geht einkaufen und soll auf dem Weg für seine Frau etwas aus der Apotheke besorgen.',
    target: 'Sie hat gestern gefroren und nun Halsschmerzen.',
    question: 'Geht Herr Bauer einkaufen?',
    answer: true,
  },
  {
    itemNum: 19,
    context:
      'An einem schönen Spätsommerabend treffen sich Lena und Ben mit ihren Freunden. Sie wollen gemeinsam grillen.',
    target: 'Sie haben letzte Woche schon gemeinsam gekocht.',
    question: 'Treffen sich Lena und Ben mit Freunden?',
    answer: true,
  },
  {
    itemNum: 20,
    context:
      'Familie Wolf möchte die Fassade ihres Hauses neu anstreichen. Sie engagieren dafür einen Malermeister, der diese Arbeit erledigen soll.',
    target: 'Sie entscheiden sich wieder für einen weißen Anstrich.',
    question: 'Möchte Familie Wolf ihr Haus neu anstreichen?',
    answer: true,
  },
  {
    itemNum: 21,
    context: 'Michael sitzt an seinem Schreibtisch und surft im Internet. Es ist Sommer und das Fenster steht offen.',
    target: 'Er beobachtet einen Schmetterling im Nachbargarten.',
    question: 'Sitzt Michael auf dem Sofa?',
    answer: false,
  },
  {
    itemNum: 22,
    context: 'Frau Lange ist von einer Freundin zum Geburtstag eingeladen worden. Es gibt Kaffee und Kuchen.',
    target: 'Sie bringt ihrer Freundin einen Strauß Blumen mit.',
    question: 'Ist Frau Lange auf einer Hochzeit eingeladen worden?',
    answer: false,
  },
  {
    itemNum: 23,
    context:
      'Florian ist in der ersten Klasse und kann jetzt alle Buchstaben. Er möchte seiner Oma einen Brief schreiben.',
    target: 'Seine Mutter gibt ihm Briefpapier und einen Umschlag.',
    question: 'Ist Florian in der vierten Klasse?',
    answer: false,
  },
  {
    itemNum: 24,
    context: 'Herr Schulze kann nachts nicht schlafen, weil ihm eine Mücke ständig um die Ohren fliegt.',
    target: 'Er steht auf, um sie zu suchen.',
    question: 'Kann Herr Schulze nachts gut schlafen?',
    answer: false,
  },
  {
    itemNum: 25,
    context:
      'Frau Bauer geht jede Woche mit einer Freundin zum Yoga-Kurs. Sie haben vor fünf Jahren gemeinsam damit begonnen.',
    target: 'Nach dem Kurs gehen die beiden meistens noch in die Sauna.',
    question: 'Geht Frau Bauer jede Woche ins Restaurant?',
    answer: false,
  },
  {
    itemNum: 26,
    context: 'Es ist Winter und draußen ist es kalt und windig. Hannah sitzt mit ihrem Freund vor dem Fernseher.',
    target: 'Sie schauen eine Komödie.',
    question: 'Liest Hannah ein Buch?',
    answer: false,
  },
  {
    itemNum: 27,
    context: 'Familie Peters frühstückt am Wochenende meistens ausgiebig. Jeder hat ein anderes Lieblingsgetränk.',
    target: 'Herr Peters trinkt immer Schwarztee mit Milch.',
    question: 'Spielt Familie Peters Gesellschaftsspiele?',
    answer: false,
  },
  {
    itemNum: 28,
    context: 'Herr Köhler schaut sich gerne Fußballspiele im Fernseher an. Er hat extra ein zweites Gerät gekauft.',
    target: 'Er hat in seiner Jugend auch Fußball gespielt.',
    question: 'Schaut Herr Köhler sich gerne Komödien an?',
    answer: false,
  },
  {
    itemNum: 29,
    context:
      'Frühling ist die Zeit der Tulpen und Krokusse. Frau Möller hat einen kleinen Vorgarten in einer Neubausiedlung.',
    target: 'Sie vergräbt im Herbst bereits die Zwiebeln für die Tulpen.',
    question: 'Hat Frau Möller eine Garage?',
    answer: false,
  },
  {
    itemNum: 30,
    context: 'Herr Franke baut gerne Modellflugzeuge. Seine Frau hat ihm zu Weihnachten einen Bausatz geschenkt.',
    target: 'Er hat das Modell bereits fertig gestellt.',
    question: 'Baut Herr Franke gerne Möbel?',
    answer: false,
  },
  {
    itemNum: 31,
    context:
      'Simon macht mit einem Freund im Sommer eine vierwöchige Reise nach Asien. Dafür muss er noch einen Reisepass beantragen.',
    target: 'Er macht Passbilder beim Fotografen in seiner Straße.',
    question: 'Will Simon im Sommer arbeiten?',
    answer: false,
  },
  {
    itemNum: 32,
    context:
      'Herr Bergmann und seine Frau gehen mit einem befreundeten Paar in die Oper. Die Bergmanns haben ein Abo für die Oper und gehen regelmäßig.',
    target: 'Nach der Vorstellung gehen sie noch in eine Bar.',
    question: 'Gehen Herr Bergman und seine Frau ins Stadion?',
    answer: false,
  },
  {
    itemNum: 33,
    context:
      'Sophie war in der Schule immer gut in Mathematik. Ihr Bruder hat keine Freude an dem Fach und Schwierigkeiten mit der Prozentrechnung.',
    target: 'Ihre Mutter hatte auch immer viel Freude an dem Fach.',
    question: 'War Sophie schlecht in Mathematik?',
    answer: false,
  },
  {
    itemNum: 34,
    context:
      'Christian fährt gerne Auto, hat aber selbst keines. Wenn er ein Auto braucht, benutzt er den Wagen seiner Eltern.',
    target: 'Er spart seit zwei Jahren auf ein eigenes Auto.',
    question: 'Hat Christian ein Auto?',
    answer: false,
  },
  {
    itemNum: 35,
    context:
      'Es ist ein harter Winter und Marie hat keine geeignete Winterjacke. Sie friert sehr schnell, wenn sie draußen unterwegs ist.',
    target: 'Sie bestellt bei einem Outdoor-Geschäft eine gute Jacke.',
    question: 'Hat Marie eine geeignete Winterjacke?',
    answer: false,
  },
  {
    itemNum: 36,
    context:
      'Herr Schulze ist berufstätig und hat unter der Woche kaum Zeit für andere Dinge. Sie putzt am Wochenende das ganze Haus.',
    target: 'Ihr Mann arbeitet in derselben Firma.',
    question: 'Hat Herr Schule viel Zeit für Freizeitaktivitäten?',
    answer: false,
  },
  {
    itemNum: 37,
    context:
      'Es ist Herbst und der Baum vor dem Haus verliert sein ganzes Laub. Herr Schmitt kehrt die Blätter zusammen.',
    target: 'Er entsorgt die Blätter in seinem Kompost.',
    question: 'Sitzt Herr Schmitt auf einer Bank?',
    answer: false,
  },
  {
    itemNum: 38,
    context:
      'Miriam hat sich für die Hochzeit ihrer besten Freundin ein neues Kleid gekauft. Dieses Kleid ist in einem zarten Altrosé.',
    target: 'Sie braucht noch die passenden Schuhe.',
    question: 'Hat Miriam sich neue Schuhe gekauft?',
    answer: false,
  },
  {
    itemNum: 39,
    context:
      'Als Fabian beim Training ist, merkt er, wie sich an seinem linken Schuh die Sohle ablöst. Er hat diese Schuhe seit vier Jahren.',
    target: 'Er hat damit gerechnet, dass sie bald kaputt gehen.',
    question: 'Ist Fabian in der Kirche?',
    answer: false,
  },
  {
    itemNum: 40,
    context:
      'Es ist ein schöner Sommertag und Julia schlendert mit einer Freundin durch die Stadt. Sie bekommen Appetit auf ein Eis.',
    target: 'Sie gehen zur nächsten Eisdiele und kaufen ein Eis.',
    question: 'Schlendert Julia durch den Wald?',
    answer: false,
  },
];
