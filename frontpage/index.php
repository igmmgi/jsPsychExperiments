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

// CSE Simon Flanker
$nFiles_csesf_v1 = numFilesInDir('Experiments/CSE_SimonFlanker/Exp2/data/version1');
$nFiles_csesf_v2 = numFilesInDir('Experiments/CSE_SimonFlanker/Exp2/data/version2');

// CSE Mouse
$nFiles_csem_text = numFilesInDir('Experiments/CSE_mouse_tracking/text_only/data');
$nFiles_csem_image = numFilesInDir('Experiments/CSE_mouse_tracking/image_only/data');

// Mouse Negation
$nFiles_mn2 = numFilesInDir('Experiments/MouseNegation/Exp2/data');
$nFiles_mn3 = numFilesInDir('Experiments/MouseNegation/Exp3/data');

// Risky Probability
$nFiles_rp1 = numFilesInDir('Experiments/RiskyProbability/Exp1/data/version1');
$nFiles_rp2 = numFilesInDir('Experiments/RiskyProbability/Exp1/data/version2');
$nFiles_rp3 = numFilesInDir('Experiments/RiskyProbability/Exp1/data/version3');
$nFiles_rp4 = numFilesInDir('Experiments/RiskyProbability/Exp1/data/version4');

// Modal Congruency
$nFiles_mc1 = numFilesInDir('Experiments7+/ModalCongruency/Exp1/data/version1');
$nFiles_mc2 = numFilesInDir('Experiments7+/ModalCongruency/Exp1/data/version2');

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
            <p> Fruity Choice Exp1: hiwipibio@gmail.com </p>
            <p> Modal Congruency Exp1: hiwipibio@gmail.com </p>
            <p> CSE SF Exp2: hiwipibio@gmail.com </p>
            <p> Ambig: m.zeller@student.uni-tuebigen.de </p>
            <p> Mouse Negation: m.zeller@student.uni-tuebingen.de </p>

        </div>
        <div class="sidenav">

            <h1>Experiments</h1>
            <h2>1,0 VP-Stunden</h2>

            <?php
            $rp = [];
            if ($nFiles_rp1 < 10) {
                array_push($rp, 1);
            }
            if ($nFiles_rp2 < 10) {
                array_push($rp, 2);
            }
            if ($nFiles_rp3 < 10) {
                array_push($rp, 3);
            }
            if ($nFiles_rp4 < 10) {
                array_push($rp, 4);
            }

            $randIndex = array_rand($rp);
            $rp_version = $rp[$randIndex];
            /* debug_to_console($rp_version) */
            ?>

            <?php if (!empty($rp_version)) : ?>
                <h3><a href="Experiments/RiskyProbability/Exp1/index.html?version=<?php echo $rp_version; ?>">Fruity Choice Exp1 (n = <?= $nFiles_rp1 + $nFiles_rp2 + $nFiles_rp3 + $nFiles_rp4 ?>)</a></h3>
            <?php endif;  ?>


            <?php
            $mc = [];
            if ($nFiles_mc1 < 25) {
                array_push($mc, 1);
            }
            if ($nFiles_mc2 < 25) {
                array_push($mc, 2);
            }

            $randIndex = array_rand($mc);
            $mc_version = $mc[$randIndex];
            /* debug_to_console($rp_version) */
            ?>

            <?php if (!empty($mc_version)) : ?>
                <h3><a href="Experiments7+/ModalCongruency/Exp1/index.html?version=<?php echo $mc_version; ?>">Modal Congruency Exp1 (n = <?= $nFiles_mc1 + $nFiles_mc2 ?>)</a></h3>
            <?php endif;  ?>

            <?php
            $csesf = [];
            if ($nFiles_csesf_v1 < 25) {
                array_push($csesf, 1);
            }
            if ($nFiles_csesf_v2 < 25) {
                array_push($csesf, 2);
            }

            $randIndex = array_rand($csesf);
            $csesf_version = $csesf[$randIndex];
            ?>

            <?php if (!empty($csesf_version)) : ?>
                <h3><a href="Experiments/CSE_SimonFlanker/Exp2/index.html?version=<?php echo $csesf_version; ?>">CSE SF Exp2 (n = <?= $nFiles_csesf_v1 + $nFiles_csesf_v2 ?>)</a></h3>
            <?php endif;  ?>





            <h2>0,5 VP-Stunden</h2>

            <?php
            $csem = [];
            if ($nFiles_csem_text < 50) {
                array_push($csem, 1);
            }
            if ($nFiles_csem_image < 50) {
                array_push($csem, 2);
            }

            $randIndex = array_rand($csem);
            $csem_version = $csem[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($csem_version)) : ?>
                <?php if ($csem_version == 1) : ?>
                    <h3><a href="Experiments/CSE_mouse_tracking/text_only/index.html">Ambig Exp1 (n = <?= $nFiles_csem_text + $nFiles_csem_image ?>)</a></h3>
                <?php endif;  ?>
                <?php if ($csem_version == 2) : ?>
                    <h3><a href="Experiments/CSE_mouse_tracking/image_only/index.html">Ambig Exp1 (n = <?= $nFiles_csem_text + $nFiles_csem_image ?>)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>


            <?php
            $mn = [];
            if ($nFiles_mn2 < 100) {
                array_push($mn, 1);
            }
            if ($nFiles_mn3 < 100) {
                array_push($mn, 2);
            }

            $randIndex = array_rand($mn);
            $mn_version = $mn[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($mn_version)) : ?>
                <?php if ($mn_version == 1) : ?>
                    <h3><a href="Experiments/MouseNegation/Exp2/index.html">Mouse Negation Exp2 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>)</a></h3>
                <?php endif;  ?>
                <?php if ($mn_version == 2) : ?>
                    <h3><a href="Experiments/MouseNegation/Exp3/index.html">Mouse Negation Exp2 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>

        </div>
    </div>
</head>

</html>
