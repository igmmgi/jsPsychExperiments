const fillers = [
  {
    itemNum: 1,
    context: 'Jan muss in die Uni zu einer Vorlesung. Es ist ein grauer Tag und dunkle Wolken stehen am Himmel.',
    target: 'Er entscheidet sich dafür einen Regenschirm mitzunehmen.',
  },
  {
    itemNum: 2,
    context:
      'Anna benutzt am liebsten ein Duschgel mit Orangenduft. Sie geht in den Drogeriemarkt, um ein neues zu kaufen.',
    target: 'Der Drogeriemarkt führt das Duschgel nur mit Zitronenduft.',
  },
  {
    itemNum: 3,
    context:
      'Frau Koch verbringt ihre Freizeit meistens in ihrem Garten. Sie hat ein Blumenbeet mit verschiedenen Sorten.',
    target: 'In der Gärtnerei kauft sie eine Blume mit gelben Blüten.',
  },
  {
    itemNum: 4,
    context: 'Herr Berger schaut gerne Filme aller Art. Er hat sich extra bei einer Videothek angemeldet.',
    target: 'Er geht in ein Elektrogeschäft, um sich einen neuen DVD-Player zu kaufen.',
  },
  {
    itemNum: 5,
    context:
      'Frau Huber hat einen Wellensittich. Sie hätte gerne einen zweiten, weil Wellensittiche lieber in Gesellschaft leben.',
    target: 'Sie geht in ein Zoogeschäft und kauft einen zweiten Vogel.',
  },
  {
    itemNum: 6,
    context:
      'Der Sohn von Frau Mayer kommt dieses Jahr in die erste Klasse. Er spielt am liebsten mit seiner Ritterburg.',
    target: 'Sie bastelt ihrem Sohn eine Schultüte aus festem Karton.',
  },
  {
    itemNum: 7,
    context: 'Herr Krüger hat kein aktuelles Telefonbuch. Er braucht die Nummer seines Hausarztes.',
    target: 'Er ruft bei der Auskunft an, um an die Nummer zu gelangen.',
  },
  {
    itemNum: 8,
    context: 'Frau Weber hat einen Balkon auf der Südseite, auf dem sie Geranien angepflanzt hat.',
    target: 'Für die Blumen verwendet sie Blumenkästen.',
  },
  {
    itemNum: 9,
    context: 'Herr Wagner geht dreimal in der Woche Joggen. Meistens fährt er dafür in den Wald.',
    target: 'Er hat eine Lieblingsstrecke, für die er meistens 30 Minuten braucht.',
  },
  {
    itemNum: 10,
    context: 'Lukas hört viel Musik. Er ist der Meinung, dass der Klang der Musik am besten mit Kopfhörern ist.',
    target: 'Er hat schwarze Kopfhörer einer gängigen Marke.',
  },
  {
    itemNum: 11,
    context:
      'Lisa hat in der Schule gelernt mit Tintenfüller zu schreiben. Ab dem Gymnasium war es den Schülern freigestellt.',
    target: 'Lisa schreibt inzwischen meistens mit Kugelschreiber.',
  },
  {
    itemNum: 12,
    context:
      'Herr Richter will am nächsten Tag seinen Rasen mähen. Er schaut am Abend den Wetterbericht für den nächsten Tag.',
    target: 'Es soll ein sonniger und milder Tag werden.',
  },
  {
    itemNum: 13,
    context: 'Sarah muss zum Augenarzt. Sie fährt mit dem Bus in die Stadt, weil ihr Fahrrad in der Werkstatt ist.',
    target: 'Beim Arzt trifft Sarah ihre alte Grundschullehrerin.',
  },
  {
    itemNum: 14,
    context: 'Max liest gerne Krimibücher. Wenn ein Buch spannend ist, kann er es kaum aus der Hand legen.',
    target: 'Er liegt auf dem Sofa und ist in sein Buch vertieft.',
  },
  {
    itemNum: 15,
    context:
      'Es ist ein verregneter Herbst und Johanna hat keine Regenjacke. Sie geht mit dem Hund spazieren, als der Regen erneut einsetzt.',
    target: 'Sie stellt sich zum Schutz in einen Hauseingang.',
  },
  {
    itemNum: 16,
    context: 'Frau Neumann ist allergisch gegen Nüsse. Wenn sie einen Kuchen backt, sucht sie Rezepte ohne Nüsse.',
    target: 'Am liebsten hat sie Apfelkuchen mit Sahne.',
  },
  {
    itemNum: 17,
    context: 'Wenn Julian aus der Schule kommt, hat er meistens großen Hunger und freut sich auf das Mittagessen.',
    target: 'Seine Mutter macht ihm morgens immer ein Pausenbrot.',
  },
  {
    itemNum: 18,
    context: 'Herr Bauer geht einkaufen und soll auf dem Weg für seine Frau etwas aus der Apotheke besorgen.',
    target: 'Sie hat gestern gefroren und nun Halsschmerzen.',
  },
  {
    itemNum: 19,
    context:
      'An einem schönen Spätsommerabend treffen sich Lena und Ben mit ihren Freunden. Sie wollen gemeinsam grillen.',
    target: 'Sie haben letzte Woche schon gemeinsam gekocht.',
  },
  {
    itemNum: 20,
    context:
      'Familie Wolf möchte die Fassade ihres Hauses neu anstreichen. Sie engagieren dafür einen Malermeister, der diese Arbeit erledigen soll.',
    target: 'Sie entscheiden sich wieder für einen weißen Anstrich.',
  },
  {
    itemNum: 21,
    context: 'Michael sitzt an seinem Schreibtisch und surft im Internet. Es ist Sommer und das Fenster steht offen.',
    target: 'Er beobachtet einen Schmetterling im Nachbargarten.',
  },
  {
    itemNum: 22,
    context: 'Frau Lange ist von einer Freundin zum Geburtstag eingeladen worden. Es gibt Kaffee und Kuchen.',
    target: 'Sie bringt ihrer Freundin einen Strauß Blumen mit.',
  },
  {
    itemNum: 23,
    context:
      'Florian ist in der ersten Klasse und kann jetzt alle Buchstaben. Er möchte seiner Oma einen Brief schreiben.',
    target: 'Seine Mutter gibt ihm Briefpapier und einen Umschlag.',
  },
  {
    itemNum: 24,
    context: 'Herr Schulze kann nachts nicht schlafen, weil ihm eine Mücke ständig um die Ohren fliegt.',
    target: 'Er steht auf, um sie zu suchen.',
  },
  {
    itemNum: 25,
    context:
      'Frau Bauer geht jede Woche mit einer Freundin zum Yoga-Kurs. Sie haben vor fünf Jahren gemeinsam damit begonnen.',
    target: 'Nach dem Kurs gehen die beiden meistens noch in die Sauna.',
  },
  {
    itemNum: 26,
    context: 'Es ist Winter und draußen ist es kalt und windig. Hannah sitzt mit ihrem Freund vor dem Fernseher.',
    target: 'Sie schauen eine Komödie.',
  },
  {
    itemNum: 27,
    context: 'Familie Peters frühstückt am Wochenende meistens ausgiebig. Jeder hat ein anderes Lieblingsgetränk.',
    target: 'Herr Peters trinkt immer Schwarztee mit Milch.',
  },
  {
    itemNum: 28,
    context: 'Herr Köhler schaut sich gerne Fußballspiele im Fernseher an. Er hat extra ein zweites Gerät gekauft.',
    target: 'Er hat in seiner Jugend auch Fußball gespielt.',
  },
  {
    itemNum: 29,
    context:
      'Frühling ist die Zeit der Tulpen und Krokusse. Frau Möller hat einen kleinen Vorgarten in einer Neubausiedlung.',
    target: 'Sie vergräbt im Herbst bereits die Zwiebeln für die Tulpen.',
  },
  {
    itemNum: 30,
    context: 'Herr Franke baut gerne Modellflugzeuge. Seine Frau hat ihm zu Weihnachten einen Bausatz geschenkt.',
    target: 'Er hat das Modell bereits fertig gestellt.',
  },
  {
    itemNum: 31,
    context:
      'Simon macht mit einem Freund im Sommer eine vierwöchige Reise nach Asien. Dafür muss er noch einen Reisepass beantragen.',
    target: 'Er macht Passbilder beim Fotografen in seiner Straße.',
  },
  {
    itemNum: 32,
    context:
      'Herr Bergmann und seine Frau gehen mit einem befreundeten Paar in die Oper. Die Bergmanns haben ein Abo für die Oper und gehen regelmäßig.',
    target: 'Nach der Vorstellung gehen sie noch in eine Bar.',
  },
  {
    itemNum: 33,
    context:
      'Sophie war in der Schule immer gut in Mathematik. Ihr Bruder hat keine Freude an dem Fach und Schwierigkeiten mit der Prozentrechnung.',
    target: 'Ihre Mutter hatte auch immer viel Freude an dem Fach.',
  },
  {
    itemNum: 34,
    context:
      'Christian fährt gerne Auto, hat aber selbst keines. Wenn er ein Auto braucht, benutzt er den Wagen seiner Eltern.',
    target: 'Er spart seit zwei Jahren auf ein eigenes Auto.',
  },
  {
    itemNum: 35,
    context:
      'Es ist ein harter Winter und Marie hat keine geeignete Winterjacke. Sie friert sehr schnell, wenn sie draußen unterwegs ist.',
    target: 'Sie bestellt bei einem Outdoor-Geschäft eine gute Jacke.',
  },
  {
    itemNum: 36,
    context:
      'Herr Schulze ist berufstätig und hat unter der Woche kaum Zeit für andere Dinge. Sie putzt am Wochenende das ganze Haus.',
    target: 'Ihr Mann arbeitet in derselben Firma.',
  },
  {
    itemNum: 37,
    context:
      'Es ist Herbst und der Baum vor dem Haus verliert sein ganzes Laub. Herr Schmitt kehrt die Blätter zusammen.',
    target: 'Er entsorgt die Blätter in seinem Kompost.',
  },
  {
    itemNum: 38,
    context:
      'Miriam hat sich für die Hochzeit ihrer besten Freundin ein neues Kleid gekauft. Dieses Kleid ist in einem zarten Altrosé.',
    target: 'Sie braucht noch die passenden Schuhe.',
  },
  {
    itemNum: 39,
    context:
      'Als Fabian beim Trainig ist, merkt er, wie sich an seinem linken Schuh die Sohle ablöst. Er hat diese Schuhe seit vier Jahren.',
    target: 'Er hat damit gerechnet, dass sie bald kaputt gehen.',
  },
  {
    itemNum: 40,
    context:
      'Es ist ein schöner Sommertag und Julia schlendert mit einer Freundin durch die Stadt. Sie bekommen Appetit auf ein Eis.',
    target: 'Sie gehen zur nächsten Eisdiele und kaufen ein Eis.',
  },
];
