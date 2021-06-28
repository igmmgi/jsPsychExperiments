<!doctype html>
<?php
function numFilesInDir($directory)
{
    return count(glob($directory . '/*'));
}

// https://stackoverflow.com/questions/4323411/how-can-i-write-to-the-console-in-php
function debug_to_console($data)
{
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

// Simon AA
$nFiles_simon_aa_exp1 = numFilesInDir('Experiments/SimonAA/Exp1/data/');
$nFiles_simon_aa_exp2 = numFilesInDir('Experiments/SimonAA/Exp2/data/');

// ConflictReward
$nFiles_cr1_v1 = numFilesInDir('Experiments/ConflictReward/Exp1/data/version1');
$nFiles_cr1_v2 = numFilesInDir('Experiments/ConflictReward/Exp1/data/version2');
$nFiles_cr1_v3 = numFilesInDir('Experiments/ConflictReward/Exp1/data/version3');
$nFiles_cr1_v4 = numFilesInDir('Experiments/ConflictReward/Exp1/data/version4');

// Emotional Morality
$nFiles_em1_v1 = numFilesInDir('Experiments/EmotionalMorality/Exp1/data/version1');
$nFiles_em1_v2 = numFilesInDir('Experiments/EmotionalMorality/Exp1/data/version2');
$nFiles_em1_v3 = numFilesInDir('Experiments/EmotionalMorality/Exp1/data/version3');
$nFiles_em1_v4 = numFilesInDir('Experiments/EmotionalMorality/Exp1/data/version4');

// Description Experience V3 
$nFiles_de3_v1 = numFilesInDir('Experiments/DescriptionExperience/V3/data/version1');
$nFiles_de3_v2 = numFilesInDir('Experiments/DescriptionExperience/V3/data/version2');
$nFiles_de3_v3 = numFilesInDir('Experiments/DescriptionExperience/V3/data/version3');
$nFiles_de3_v4 = numFilesInDir('Experiments/DescriptionExperience/V3/data/version4');

?>

<html lang="en">

<head>
    <meta charset="utf-8" />
    <div style="margin-left: 10px; margin-top: 10px;">

        <style>
            .sidenav {
                height: 100%;
                width: 300px;
                position: fixed;
                z-index: 1;
                top: 0;
                left: 10px;
                padding-left: 10px;
                background-color: #f2f2f2;
                color: #A51E37;
                overflow-x: hidden;
            }

            .content {
                margin-left: 300px;
                margin-right: 300px;
                padding-left: 20px;
                padding-bottom: 100px;
                font-weight: bold;
                font-size: 20px;
                text-align: left;
                color: #32414B;
            }
        </style>

        <div class="content">

            <h1> Herzlich Willkommen zu unserem Experiment!</h1>
            <p>In der linken Spalte können Sie zwischen verschiedenen Experimenten wählen. Eine Teilnahme is ab 18 Jahren möglich. Bitte bearbeiten Sie das ausgewählte Experiment an einem ruhigen Ort und an einem Computer/Laptop (nicht am Handy/Tablet). Bitte bearbeiten Sie ein ausgewähltes Experiment nur einmal!</b>
            <p>Versuchspersonenstunden: Bei einigen Experimenten ist es möglich VP-Stunden zu erhalten. Sie erhalten Ihren VP-Code und weitere Anweisungen am Ende eines Experimentes. </p>
            <p>Die Teilnahme ist freiwillig. Die Daten werden anonym gespeichert und können nicht mit Ihnen in Verbindung gebracht werden. Basierend auf den Richtlinien guter ethischer Forschung sowie der Datenschutzgrundverordnung sollen sich Teilnehmende explizit und nachvollziehbar mit der Teilnahme an einem Experiment und der Verarbeitung ihrer Daten einverstanden erklären. Aus diesem Grund möchten wir Sie bitten, die "Allgemeinen Informationen für TeilnehmerInnen" aufmerksam zu lesen before Sie an einem Experiment teilnehmen.</p>

            <p><span style="color:red;"> Achtung:</span> Bitte nehmen Sie nur an "Flowers & Spiders Exp1" teil wenn Sie kein Problem mit der Betrachtung von realen Spinnenbildern haben</p>

            <h2> Vielen Dank für Ihre Teilnahme!</h2><br>

            <h1> Allgemeine Informationen für TeilnehmerInnen </h1>
            <p> 1. Problemstellung und Ziel des wissenschaftlichen Vorhabens: In unseren Studien untersuchen wir Prozesse der menschlichen Kognition und Handlungsplanung. </p>
            <p> 2. Studienablauf: Genaue Instruktionen über den Ablauf erhalten Sie zu Beginn von jedem Experiment. </p>
            <p> 3. Vorteile: <br> a) Für Probanden: Sie bekommen einen Einblick in unsere Forschung. Bei Interesse klären wir Sie im Nachhinein gerne über die genauen Absichten des Versuchs auf. <br> b) Für andere Personen und die Wissenschaft: Wir erhalten Erkenntnisse über Kognition und Handlungsplanung des Menschen. </p>
            <p> 4. Risiken und Nebenwirkungen für Probanden: Für gesunde Probanden bestehen keine bekannten Risiken oder Nebenwirkungen. </p>
            <p> 5. Verpflichtungen der Probanden: Der Erfolg dieser Studie hängt maßgeblich von Ihrer Mitarbeit ab. Wir bitten Sie während der ganzen Zeit konzentriert und entsprechend der Instruktion mitzuarbeiten. </p>
            <p> 6. Versicherungsschutz / Erfordernisse für Probanden: Nicht erforderlich.</p>
            <p> 7. Vertraulichkeit und Handhabung der Daten: Die aufgezeichneten Daten werden anonymisiert gespeichert und vertraulich behandelt. Für die Öffentlichkeit besteht zu keiner Zeit die Möglichkeit Ihre Daten zurück zu verfolgen. Persönliche Daten (Alter, Geschlecht, etc.) werden nur so weit wie nötig aufgezeichnet. Die aufgezeichneten Daten werden streng vertraulich und unabhängig von Ihren Namen gespeichert, ausgewertet und veröffentlicht (z.B. in wissenschaftlichen Zeitschriften).</b>
            <p> 8. Aufwandsentschädigung: Bei einigen Experimenten besteht die Möglichkeit Versuchspersonenstunden zu erhalten (je nach Dauer des Experimentes).</p>
            <p> 9. Freiwilligkeit der Teilnahme Ihre Teilnahme an der Studie ist freiwillig. Durch die Nichtteilnahme an der Studie entstehen Ihnen keine Nachteile.</p>
            <p>10. Möglichkeit des Studienabbruchs: Sie können Ihre freiwillige Teilnahme an der Studie jederzeit und ohne Angabe von Gründen abbrechen, ohne dass Ihnen daraus Nachteile entstehen (ggf. wird eine Kompensation dann jedoch nur anteilig gewährt).</p><br>

            <h1> Verantwortliche Ansprechpartner während der Studie </h1>
            <h2> Bei Fragen oder Problemen sprechen Sie bitte den verantwortlichen Ansprechpartner des Experimentes an.</h2>
            <p> Flowers & Spiders Exp1: Sophie Renner (sophie.renner@student.uni-tuebingen.de)</p>
            <p> Reward Exp1: Katharina Hofbauer und Julia Koenig (j.koenig@student.uni-tuebingen.de) </p><br>
            <p> Moral Decisions Exp1: Johanna Maerker (emotion-und-moral@web.de) </p><br>

        </div>
        <div class="sidenav">

            <h1>Experiments</h1>
            <h2>1,0 VP-Stunden</h2>

            <?php
            $cr1 = [];
            if ($nFiles_cr1_v1 < 15) {
                array_push($cr1, 1);
            }
            if ($nFiles_cr1_v2 < 15) {
                array_push($cr1, 2);
            }
            if ($nFiles_cr1_v3 < 15) {
                array_push($cr1, 3);
            }
            if ($nFiles_cr1_v4 < 15) {
                array_push($cr1, 4);
            }

            $randIndex = array_rand($cr1);
            $cr1_version = $cr1[$randIndex];
            /* debug_to_console($cr1_version) */
            ?>

            <?php if (!empty($cr1_version)) : ?>
                <h3><a href="Experiments/ConflictReward/Exp1/index.html?orderVersion=<?php echo $cr1_version; ?>">Reward Exp1 (n =<?= $nFiles_cr1_v1 + $nFiles_cr1_v2 + $nFiles_cr1_v3 + $nFiles_cr1_v4 ?>/60)</a></h3>
            <?php endif;  ?>

            <?php
                /* Emotional Morality */
                $em1 = [];
                if ($nFiles_em1_v1 < 20) {
                    array_push($em1, 1);
                }
                if ($nFiles_em1_v2 < 20) {
                    array_push($em1, 2);
                }
                if ($nFiles_em1_v3 < 20) {
                    array_push($em1, 3);
                }
                if ($nFiles_em1_v3 < 20) {
                    array_push($em1, 4);
                }
                $randIndex = array_rand($em1);
                $em1_version = $em1[$randIndex];
                ?>
                <?php if (!empty($em1_version)) : ?>
                    <h3><a href="Experiments/EmotionalMorality/Exp1/index.html?version=<?php echo $em1_version; ?>">Moral Decisions Exp1 (n =<?= $nFiles_em1_v1 + $nFiles_em1_v2 + $nFiles_em1_v3 + $nFiles_em1_v4 ?>/80)</a></h3>
                <?php endif;  ?>

    <?php
                /* Description Experience */
                $de3 = [];
                if ($nFiles_de3_v1 < 15) {
                    array_push($de3, 1);
                }
                if ($nFiles_de3_v2 < 15) {
                    array_push($de3, 2);
                }
                if ($nFiles_de3_v3 < 15) {
                    array_push($de3, 3);
                }
                if ($nFiles_de3_v4 < 15) {
                    array_push($de3, 4);
                }
                $randIndex = array_rand($em1);
                $de3_version = $de3[$randIndex];
                ?>
                <?php if (!empty($de3_version)) : ?>
                    <h3><a href="Experiments/DescriptionExperience/V3/index.html?version=<?php echo $de3_version; ?>">Choice is Yours Exp1 (n =<?= $nFiles_de3_v1 + $nFiles_de3_v2 + $nFiles_de3_v3 + $nFiles_de3_v4 ?>/60)</a></h3>
                <?php endif;  ?>







            <h2>0,5 VP-Stunden</h2>

            <?php
            /* Simon Approach Avoidance */
            if ($nFiles_simon_aa_exp1 < 40) : ?>
                <h3><a href="Experiments/SimonAA/Exp1/index.html">Flowers & Spiders Exp1 (n =<?= $nFiles_simon_aa_exp1 ?>/40)</a></h3>
            <?php endif;  ?>


        </div>
    </div>
</head>

</html>
