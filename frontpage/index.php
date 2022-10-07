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

// Mouse Negation
$nFiles_mn2 = numFilesInDir('Experiments/MouseNegation/Exp2/data');
$nFiles_mn3 = numFilesInDir('Experiments/MouseNegation/Exp3/data');

// Task Switching (Task-Difficulty) 
$nFiles_ts1 = 0; //numFilesInDir('Experiments7+/TaskSwitching/VTS_TaskDifficulty/Exp1/data/version1');
$nFiles_ts2 = 0; //numFilesInDir('Experiments7+/TaskSwitching/VTS_TaskDifficulty/Exp1/data/version2');
$nFiles_ts3 = numFilesInDir('Experiments7+/TaskSwitching/VTS_TaskDifficulty/Exp1/data/version3');
$nFiles_ts4 = numFilesInDir('Experiments7+/TaskSwitching/VTS_TaskDifficulty/Exp1/data/version4');

// flanker grouping
$nFiles_fg = numFilesInDir('Experiments7+/flankerGrouping/Exp2/data');

// Beats Exp1 
$nFiles_beats_v1 = numFilesInDir('Experiments7+/ModalCongruency/Exp2/data/version1');
$nFiles_beats_v2 = numFilesInDir('Experiments7+/ModalCongruency/Exp2/data/version2');
$nFiles_beats_v3 = numFilesInDir('Experiments7+/ModalCongruency/Exp2/data/version3');
$nFiles_beats_v4 = numFilesInDir('Experiments7+/ModalCongruency/Exp2/data/version4');

// Treasure Hunt 
$nFiles_th_v1 = numFilesInDir('Experiments/ProactiveReward/Exp2.3/data/version1');
$nFiles_th_v2 = numFilesInDir('Experiments/ProactiveReward/Exp2.3/data/version2');

// VTS_Effector Experiments 2 + 3
$nFiles_vts_ef_exp2_v1 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version1');
$nFiles_vts_ef_exp2_v2 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version2');
$nFiles_vts_ef_exp2_v3 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version3');
$nFiles_vts_ef_exp2_v4 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version4');
$nFiles_vts_ef_exp2_v5 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version5');
$nFiles_vts_ef_exp2_v6 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version6');
$nFiles_vts_ef_exp2_v7 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version7');
$nFiles_vts_ef_exp2_v8 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp2/data/version8');

$nFiles_vts_ef_exp3_v1 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version1');
$nFiles_vts_ef_exp3_v2 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version2');
$nFiles_vts_ef_exp3_v3 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version3');
$nFiles_vts_ef_exp3_v4 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version4');
$nFiles_vts_ef_exp3_v5 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version5');
$nFiles_vts_ef_exp3_v6 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version6');
$nFiles_vts_ef_exp3_v7 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version7');
$nFiles_vts_ef_exp3_v8 = numFilesInDir('Experiments7+/TaskSwitching/VTS_Effector/Exp3/data/version8');



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

            <p style="color:red;">*** ACHTUNG: Für das Experiment "Beats Exp1" benötigen Sie Lautsprecher oder Kopfhörer. ***</p>
            <p style="color:blue;">*** Für die Teilnahme am Experiment „Pick!“ können Sie entscheiden, ob Sie 1 VP-Stunde oder 10€ (per Überweisung) erhalten möchten. ***</p>
            
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
            <p> Pick!: hiwipibio@gmail.com </p>
            <p> This or That Exp2: Experiment.TaskSwitching@gmail.com </p>
            <p> Beats Exp1: hiwipibio@gmail.com </p>
            <p> Treasure Hunt: hiwipibio@gmail.com </p>
            <p> Dots and Dashes: hiwipibio@gmail.com </p>
            <p> Mouse Negation: sprachstudien@psycho.uni-tuebingen.de </p>

        </div>
        <div class="sidenav">

            <h1>Experiments</h1>
            <h2>1,0 VP-Stunden</h2>


            <?php
            $pick = [];

            if ($nFiles_vts_ef_exp2_v1 < 1) {
                array_push($pick, 1);
            }
            if ($nFiles_vts_ef_exp2_v2 < 1) {
                array_push($pick, 2);
            }
            if ($nFiles_vts_ef_exp2_v3 < 1) {
                array_push($pick, 3);
            }
            if ($nFiles_vts_ef_exp2_v4 < 1) {
                array_push($pick, 4);
            }
            if ($nFiles_vts_ef_exp2_v5 < 1) {
                array_push($pick, 5);
            }
            if ($nFiles_vts_ef_exp2_v6 < 1) {
                array_push($pick, 6);
            }
            if ($nFiles_vts_ef_exp2_v7 < 1) {
                array_push($pick, 7);
            }
            if ($nFiles_vts_ef_exp2_v8 < 1) {
                array_push($pick, 8);
            }
            if ($nFiles_vts_ef_exp3_v1 < 1) {
                array_push($pick, 9);
            }
            if ($nFiles_vts_ef_exp3_v2 < 1) {
                array_push($pick, 10);
            }
            if ($nFiles_vts_ef_exp3_v3 < 1) {
                array_push($pick, 11);
            }
            if ($nFiles_vts_ef_exp3_v4 < 1) {
                array_push($pick, 12);
            }
            if ($nFiles_vts_ef_exp3_v5 < 1) {
                array_push($pick, 13);
            }
            if ($nFiles_vts_ef_exp3_v6 < 1) {
                array_push($pick, 14);
            }
            if ($nFiles_vts_ef_exp3_v7 < 1) {
                array_push($pick, 15);
            }
            if ($nFiles_vts_ef_exp3_v8 < 1) {
                array_push($pick, 16);
            }

            $randIndex = array_rand($pick);
            $pick_version = $pick[$randIndex];

            ?>


            <?php if (!empty($pick_version) && ($pick_version <= 8)) : ?>
                <h3><a href="Experiments7+/TaskSwitching/VTS_Effector/Exp2/index.html?version=<?php echo $pick_version; ?>">Pick! (n = <?= $nFiles_vts_ef_exp2_v1 + $nFiles_vts_ef_exp2_v2 + $nFiles_vts_ef_exp2_v3 + $nFiles_vts_ef_exp2_v4 + $nFiles_vts_ef_exp2_v5 + $nFiles_vts_ef_exp2_v6 + $nFiles_vts_ef_exp2_v7 + $nFiles_vts_ef_exp2_v8 + $nFiles_vts_ef_exp3_v1 + $nFiles_vts_ef_exp3_v2 + $nFiles_vts_ef_exp3_v3 + $nFiles_vts_ef_exp3_v4 + $nFiles_vts_ef_exp3_v5 + $nFiles_vts_ef_exp3_v6 + $nFiles_vts_ef_exp3_v7 + $nFiles_vts_ef_exp3_v8?>/16)</a></h3>
            <?php endif;  ?>

            <?php if (!empty($pick_version) && ($pick_version > 8)) : ?>
                <h3><a href="Experiments7+/TaskSwitching/VTS_Effector/Exp3/index.html?version=<?php echo $pick_version-8; ?>">Pick! (n = <?= $nFiles_vts_ef_exp2_v1 + $nFiles_vts_ef_exp2_v2 + $nFiles_vts_ef_exp2_v3 + $nFiles_vts_ef_exp2_v4 + $nFiles_vts_ef_exp2_v5 + $nFiles_vts_ef_exp2_v6 + $nFiles_vts_ef_exp2_v7 + $nFiles_vts_ef_exp2_v8 + $nFiles_vts_ef_exp3_v1 + $nFiles_vts_ef_exp3_v2 + $nFiles_vts_ef_exp3_v3 + $nFiles_vts_ef_exp3_v4 + $nFiles_vts_ef_exp3_v5 + $nFiles_vts_ef_exp3_v6 + $nFiles_vts_ef_exp3_v7 + $nFiles_vts_ef_exp3_v8?>/16)</a></h3>
            <?php endif;  ?>


            <?php
            $ts = [];
            if ($nFiles_ts1 < 0) {
                array_push($ts, 1);
            }
            if ($nFiles_ts2 < 0) {
                array_push($ts, 2);
            }
            if ($nFiles_ts3 < 25) {
                array_push($ts, 3);
            }
            if ($nFiles_ts4 < 25) {
                array_push($ts, 4);
            }

            $randIndex = array_rand($ts);
            $ts_version = $ts[$randIndex];
            ?>

            <?php if (!empty($ts_version)) : ?>
                <h3><a href="Experiments7+/TaskSwitching/VTS_TaskDifficulty/Exp1/index.html?version=<?php echo $ts_version; ?>">This or That Exp2 (n = <?= $nFiles_ts1 + $nFiles_ts2 + $nFiles_ts3 + $nFiles_ts4 ?>/50)</a></h3>
            <?php endif;  ?>


            <?php
            $beats = [];
            if ($nFiles_beats_v1 < 10) {
                array_push($beats, 1);
            }
            if ($nFiles_beats_v2 < 10) {
                array_push($beats, 2);
            }
            if ($nFiles_beats_v3 < 10) {
                array_push($beats, 3);
            }
            if ($nFiles_beats_v4 < 10) {
                array_push($beats, 4);
            }

            $randIndex = array_rand($beats);
            $beats_version = $beats[$randIndex];
            ?>

            <?php if (!empty($beats_version)) : ?>
                <h3><a href="Experiments7+/ModalCongruency/Exp2/index.html?version=<?php echo $beats_version; ?>">Beats Exp1 (n = <?= $nFiles_beats_v1 + $nFiles_beats_v2 + $nFiles_beats_v3 + $nFiles_beats_v4 ?>/40)</a></h3>
            <?php endif;  ?>

            <?php
            $th = [];
            if ($nFiles_th_v1 < 20) {
                array_push($th, 1);
            }
            if ($nFiles_th_v2 < 20) {
                array_push($th, 2);
            }

            $randIndex = array_rand($th);
            $th_version = $th[$randIndex];
            ?>

            <?php if (!empty($th_version)) : ?>
                <h3><a href="Experiments/ProactiveReward/Exp2.3/index.html?orderVersion=<?php echo $th_version; ?>">Treasure Hunt (n = <?= $nFiles_th_v1 + $nFiles_th_v2 ?>/40)</a></h3>
            <?php endif;  ?>



            <h2>0,5 VP-Stunden</h2>

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
                    <h3><a href="Experiments/MouseNegation/Exp2/index.html">Mouse Negation Exp2 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>/200)</a></h3>
                <?php endif;  ?>
                <?php if ($mn_version == 2) : ?>
                    <h3><a href="Experiments/MouseNegation/Exp3/index.html">Mouse Negation Exp2 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>/200)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>


   <?php if ($nFiles_fg < 40) : ?>
                <h3><a href="Experiments7+/flankerGrouping/Exp2/index.html">Dots and Dashes Exp2 (n = <?= $nFiles_fg ?>/40)</a></h3>
            <?php endif;  ?>


        </div>
    </div>
</head>

</html>
