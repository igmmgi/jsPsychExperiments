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

// Gains
$nFiles_pr_v2 = numFilesInDir('Experiments/ProactiveReward/Exp1.2/data/version2');
$nFiles_pr_v4 = numFilesInDir('Experiments/ProactiveReward/Exp1.2/data/version4');

// PP_FreeChoice
$nFiles_ppfc_v1 = numFilesInDir('Experiments/PP_FreeChoice/Exp1.3/data/version1');
$nFiles_ppfc_v2 = numFilesInDir('Experiments/PP_FreeChoice/Exp1.3/data/version2');

// ConflictReward
$nFiles_cr2_v1 = numFilesInDir('Experiments/ConflictReward/Exp2/data/version1');
$nFiles_cr2_v2 = numFilesInDir('Experiments/ConflictReward/Exp2/data/version2');
$nFiles_cr2_v3 = numFilesInDir('Experiments/ConflictReward/Exp2/data/version3');
$nFiles_cr2_v4 = numFilesInDir('Experiments/ConflictReward/Exp2/data/version4');

// NarrowWide (Zonk)
$nFiles_nw_v1 = numFilesInDir('Experiments/NarrowWide/V2/data/version1');
$nFiles_nw_v2 = numFilesInDir('Experiments/NarrowWide/V2/data/version2');
$nFiles_nw_v3 = numFilesInDir('Experiments/NarrowWide/V2/data/version3');
$nFiles_nw_v4 = numFilesInDir('Experiments/NarrowWide/V2/data/version4');

// PRP Exp4
$nFiles_prp4_v1 = numFilesInDir('Experiments/PRP/Exp4/version1/data/order1');
$nFiles_prp4_v2 = numFilesInDir('Experiments/PRP/Exp4/version1/data/order2');
$nFiles_prp4_v3 = numFilesInDir('Experiments/PRP/Exp4/version2/data/order1');
$nFiles_prp4_v4 = numFilesInDir('Experiments/PRP/Exp4/version2/data/order2');

// CSE Mouse
$nFiles_csem_text = numFilesInDir('Experiments/CSE_mouse_tracking/text_only/data');
$nFiles_csem_image = numFilesInDir('Experiments/CSE_mouse_tracking/image_only/data');

// Mouse Negation
$nFiles_mn2 = numFilesInDir('Experiments/MouseNegation/Exp2/data');
$nFiles_mn3 = numFilesInDir('Experiments/MouseNegation/Exp3/data');

// flanker emotion
$nFiles_fe1 = numFilesInDir('Experiments7+/flankerEmotion/Exp1.2/data');
$nFiles_fe2 = numFilesInDir('Experiments7+/flankerEmotion/Exp2.2/data');

// flanker grouping
$nFiles_fg = numFilesInDir('Experiments7+/flankerGrouping/Exp1/data');

// vts2
$nFiles_vts2_v1 = numFilesInDir('Experiments/TaskSwitching/VTS/Exp2.2/data/version1');
$nFiles_vts2_v2 = numFilesInDir('Experiments/TaskSwitching/VTS/Exp2.2/data/version2');
$nFiles_vts2_v3 = numFilesInDir('Experiments/TaskSwitching/VTS/Exp2.2/data/version3');
$nFiles_vts2_v4 = numFilesInDir('Experiments/TaskSwitching/VTS/Exp2.2/data/version4');

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
            <p> DualTask Exp4: hiwipibio@gmail.com </p>
            <p> Fun with characters: hiwipibio@gmail.com</p>
            <p> Ambig: m.zeller@student.uni-tuebigen.de </p>
            <p> Mouse Negation: m.zeller@student.uni-tuebigen.de </p>

        </div>
        <div class="sidenav">

            <h1>Experiments</h1>
            <h2>1,0 VP-Stunden</h2>

            <?php
            $pr1 = [];
            if ($nFiles_pr_v2 < 20) {
                array_push($pr1, 2);
            }
            if ($nFiles_pr_v4 < 20) {
                array_push($pr1, 4);
            }

            $randIndex = array_rand($pr1);
            $pr1_version = $pr1[$randIndex];
            ?>

            <?php if (!empty($pr1_version)) : ?>
                <h3><a href="Experiments/ProactiveReward/Exp1.2/index.html?orderVersion=<?php echo $pr1_version; ?>">Gains Exp1 (n = <?= $nFiles_pr_v2 + $nFiles_pr_v4 ?>)</a></h3>
            <?php endif;  ?>

            <?php
            $pp_fc1 = [];
            if ($nFiles_ppfc_v1 < 20) {
                array_push($pp_fc1, 1);
            }
            if ($nFiles_ppfc_v2 < 20) {
                array_push($pp_fc1, 2);
            }

            $randIndex = array_rand($pp_fc1);
            $pp_fc1_version = $pp_fc1[$randIndex];
            ?>

            <?php if (!empty($pp_fc1_version)) : ?>
                <h3><a href="Experiments/PP_FreeChoice/Exp1.3/index.html?version=<?php echo $pp_fc1_version; ?>">Free Choice Race Exp 1 (n = <?= $nFiles_ppfc_v1 + $nFiles_ppfc_v2 ?>)</a></h3>
            <?php endif;  ?>


            <?php
            $cr2 = [];
            if ($nFiles_cr2_v1 < 15) {
                array_push($cr2, 1);
            }
            if ($nFiles_cr2_v2 < 15) {
                array_push($cr2, 2);
            }
            if ($nFiles_cr2_v3 < 15) {
                array_push($cr2, 3);
            }
            if ($nFiles_cr2_v4 < 15) {
                array_push($cr2, 4);
            }

            $randIndex = array_rand($cr2);
            $cr2_version = $cr2[$randIndex];
            /* debug_to_console($cr2_version) */
            ?>

            <?php if (!empty($cr2_version)) : ?>
                <h3><a href="Experiments/ConflictReward/Exp2/index.html?orderVersion=<?php echo $cr2_version; ?>">Reward Exp2 (n = <?= $nFiles_cr2_v1 + $nFiles_cr2_v2 + $nFiles_cr2_v3 + $nFiles_cr2_v4 ?>)</a></h3>
            <?php endif;  ?>


            <?php
            $nw1 = [];
            if ($nFiles_nw_v1 < 8) {
                array_push($nw1, 1);
            }
            if ($nFiles_nw_v2 < 8) {
                array_push($nw1, 2);
            }
            if ($nFiles_nw_v3 < 8) {
                array_push($nw1, 3);
            }
            if ($nFiles_nw_v4 < 8) {
                array_push($nw1, 4);
            }

            $randIndex = array_rand($nw1);
            $nw1_version = $nw1[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($nw1_version)) : ?>
                <h3><a href="Experiments/NarrowWide/V2/index.html?version=<?php echo $nw1_version; ?>">Zonk Exp1 (n = <?= $nFiles_nw_v1 + $nFiles_nw_v2 + $nFiles_nw_v3 + $nFiles_nw_v4 ?>)</a></h3>
            <?php endif;  ?>

            <?php
            $prp4 = [];
            if ($nFiles_prp4_v1 < 10) {
                array_push($prp4, 1);
            }
            if ($nFiles_prp4_v2 < 10) {
                array_push($prp4, 2);
            }
            if ($nFiles_prp4_v3 < 10) {
                array_push($prp4, 3);
            }
            if ($nFiles_prp4_v4 < 10) {
                array_push($prp4, 4);
            }

            $randIndex = array_rand($prp4);
            $prp4_version = $prp4[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($prp4_version)) : ?>
                <?php if ($prp4_version == 1 || $prp4_version == 2) : ?>
                    <h3><a href="Experiments/PRP/Exp4/version1/index.html?taskOrder=<?php echo $prp4_version; ?>">DualTask Exp4 (n = <?= $nFiles_prp4_v1 + $nFiles_prp4_v2 + $nFiles_prp4_v3 + $nFiles_prp4_v4 ?>)</a></h3>
                <?php endif;  ?>
                <?php if ($prp4_version == 3 || $prp4_version == 4) : ?>
                    <h3><a href="Experiments/PRP/Exp4/version2/index.html?taskOrder=<?php echo $prp4_version - 2; ?>">DualTask Exp4 (n = <?= $nFiles_prp4_v1 + $nFiles_prp4_v2 + $nFiles_prp4_v3 + $nFiles_prp4_v4 ?>)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>

            <?php
            $vts2 = [];
            if ($nFiles_vts2_v1 < 10) {
                array_push($vts2, 1);
            }
            if ($nFiles_vts2_v2 < 10) {
                array_push($vts2, 2);
            }
            if ($nFiles_vts2_v3 < 10) {
                array_push($vts2, 3);
            }
            if ($nFiles_vts2_v4 < 10) {
                array_push($vts2, 4);
            }

            $randIndex = array_rand($vts2);
            $vts2_version = $vts2[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($vts2_version)) : ?>
                <h3><a href="Experiments/TaskSwitching/VTS/Exp2.2/index.html?version=<?php echo $vts2_version; ?>">Fun with characters Exp1 (n = <?= $nFiles_vts2_v1 + $nFiles_vts2_v2 + $nFiles_vts2_v3 + $nFiles_vts2_v4 ?>)</a></h3>
            <?php endif;  ?>


            <?php if ($nFiles_fg < 40) : ?>
                <h3><a href="Experiments7+/flankerGrouping/Exp1/index.html">Dots and Dashes (n = <?= $nFiles_fg ?>)</a></h3>
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
            if ($nFiles_mn2 < 0) {
                array_push($mn, 1);
            }
            if ($nFiles_mn3 < 0) {
                array_push($mn, 2);
            }

            $randIndex = array_rand($mn);
            $mn_version = $mn[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($mn_version)) : ?>
                <?php if ($mn_version == 1) : ?>
                    <h3><a href="Experiments/MouseNegation/Exp2/index.html">Mouse Negation Exp2/3 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>)</a></h3>
                <?php endif;  ?>
                <?php if ($mn_version == 2) : ?>
                    <h3><a href="Experiments/MouseNegation/Exp3/index.html">Mouse Negation Exp2/3 (n = <?= $nFiles_mn2 + $nFiles_mn3 ?>)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>


            <?php
            $fe = [];
            if ($nFiles_fe1 < 30) {
                array_push($fe, 1);
            }
            if ($nFiles_fe2 < 30) {
                array_push($fe, 2);
            }

            $randIndex = array_rand($fe);
            $fe_version = $fe[$randIndex];
            /* debug_to_console($nw1_version) */
            ?>

            <?php if (!empty($fe_version)) : ?>
                <?php if ($fe_version == 1) : ?>
                    <h3><a href="Experiments7+/flankerEmotion/Exp1.2/index.html">Emotion Exp (n = <?= $nFiles_fe1 + $nFiles_fe2 ?>)</a></h3>
                <?php endif;  ?>
                <?php if ($fe_version == 2) : ?>
                    <h3><a href="Experiments7+/flankerEmotion/Exp2.2/index.html">Emotion Exp (n = <?= $nFiles_fe1 + $nFiles_fe2 ?>)</a></h3>
                <?php endif;  ?>
            <?php endif;  ?>







        </div>
    </div>
</head>

</html>
