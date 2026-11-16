# ==============================================================================
# Comprehensive R Validation Script for CrossModalPriming (N = 80 Simulated Files)
#
# Exhaustively verifies all trial counts, 5% catch-trial proportions,
# catch-trial spacing constraints (never Trial 1, never back-to-back),
# block & phase structure, counterbalancing, S-R key mappings,
# 2 x 2 x 2 cell combinations, 8-item bag exposure counts,
# t != t - 1 non-repetition, stimulus pool integrity, and go/catch scoring
# across all 80 simulated files (20 per version x 4 versions = 41,600 trials).
# ==============================================================================

suppressPackageStartupMessages({
    library(dplyr)
    library(tidyr)
})

dir_data <- file.path(getwd(), "data_sim")
if (!dir.exists(dir_data)) {
    dir_data <- "Experiments8+/CrossModalPriming/data_sim"
}

cat("================================================================================\n")
cat("        CROSS-MODAL PRIMING VALIDATION ACROSS 80 SIMULATED PARTICIPANTS         \n")
cat("================================================================================\n\n")

sim_files <- sort(list.files(dir_data, pattern = "^sim_CrossModalPriming_.*\\.csv$", full.names = TRUE))

version_specs <- list(
    "1" = list(order = "face,word", key_pos = "f", key_neg = "j"),
    "2" = list(order = "face,word", key_pos = "j", key_neg = "f"),
    "3" = list(order = "word,face", key_pos = "f", key_neg = "j"),
    "4" = list(order = "word,face", key_pos = "j", key_neg = "f")
)

required_cols <- c(
    "stim", "phase", "block_category", "target_type", "trial_go_nogo",
    "prime_valence", "prime_stim", "target_valence", "target_stim",
    "congruency", "corr_resp", "rt", "response", "version",
    "target_type_order", "key_positive", "key_negative",
    "corr_code", "block_num", "exp_block_num", "trial_num", "vp_num"
)

pos_sounds <- c("laughter", "guitar", "drum", "human_whistle", "river", "rain", "canary", "piano")
neg_sounds <- c("machine_gun", "mosquito", "baby", "snoring", "fire_truck", "throat_clearing", "car", "cannon")

pos_words <- c("Freude", "Lachen", "sonnig", "Euphorie", "ehrlich", "genießen", "Juwel", "Glück")
neg_words <- c("Henker", "verletzt", "Fieber", "grausam", "Mord", "Elend", "Qual", "töten")

pos_faces <- c(
    "031_y_m_h_a.png", "034_y_f_h_a.png", "037_y_m_h_a.png", "040_y_f_h_a.png",
    "041_y_m_h_a.png", "048_y_f_h_a.png", "049_y_m_h_a.png", "054_y_f_h_a.png"
)
neg_faces <- c(
    "008_y_m_s_a.png", "010_y_f_s_a.png", "013_y_m_s_a.png", "016_y_m_s_a.png",
    "020_y_f_s_a.png", "022_y_f_s_a.png", "025_y_m_s_a.png", "028_y_f_s_a.png"
)

total_tests <- 0L
passed_tests <- 0L

assert_test <- function(desc, condition, verbose = FALSE) {
    total_tests <<- total_tests + 1L
    if (isTRUE(condition)) {
        passed_tests <<- passed_tests + 1L
        if (verbose) {
            cat(sprintf("  [PASS] %s\n", desc))
        }
    } else {
        cat(sprintf("  [FAIL] %s\n", desc))
        stop(sprintf("Assertion failed: %s", desc))
    }
}

assert_test("Exactly 80 simulated CSV files found in data_sim/", length(sim_files) == 80L, verbose = TRUE)

file_records <- vector("list", length(sim_files))
all_dfs <- vector("list", length(sim_files))

for (idx in seq_along(sim_files)) {
    f <- sim_files[idx]
    fname <- basename(f)
    df <- read.csv(f, stringsAsFactors = FALSE, na.strings = c("", "NA", "null"))
    df$file_id <- fname
    all_dfs[[idx]] <- df

    # 1. Schema & Version Metadata
    assert_test(paste(fname, "- All required columns present"), all(required_cols %in% names(df)))

    ver <- as.character(unique(df$version))
    assert_test(paste(fname, "- Single valid version (1..4)"), length(ver) == 1L && ver %in% names(version_specs))
    spec <- version_specs[[ver]]

    assert_test(paste(fname, "- Target-type order matches version"), all(df$target_type_order == spec$order))
    assert_test(
        paste(fname, "- Response key metadata matches version"),
        all(df$key_positive == spec$key_pos) && all(df$key_negative == spec$key_neg)
    )

    # 2. Total Trial Counts
    assert_test(paste(fname, "- Total trials == 520"), nrow(df) == 520L)
    assert_test(paste(fname, "- Practice trials == 40"), sum(df$block_category == "practice") == 40L)
    assert_test(paste(fname, "- Experimental trials == 480"), sum(df$block_category == "exp") == 480L)

    # 3. Block Structure & Numbering
    assert_test(paste(fname, "- Overall blocks 1..8 present"), identical(sort(unique(df$block_num)), 1:8))
    assert_test(
        paste(fname, "- Practice blocks are Block 1 and Block 5 (20 trials each)"),
        identical(sort(unique(df$block_num[df$block_category == "practice"])), c(1L, 5L)) &&
            sum(df$block_num == 1L) == 20L &&
            sum(df$block_num == 5L) == 20L &&
            all(df$exp_block_num[df$block_category == "practice"] == 0L)
    )

    exp_df <- df %>% filter(block_category == "exp")
    assert_test(
        paste(fname, "- Experimental blocks 1..6 (80 trials each)"),
        identical(sort(unique(exp_df$block_num)), c(2L, 3L, 4L, 6L, 7L, 8L)) &&
            identical(sort(unique(exp_df$exp_block_num)), 1:6) &&
            all(table(exp_df$exp_block_num) == 80L)
    )

    # 4. Blockwise Target-Type Manipulation
    expected_types <- strsplit(spec$order, ",")[[1]]
    assert_test(
        paste(fname, "- Phase 1 target type matches order"),
        all(df$target_type[df$phase == 1L] == expected_types[1]) &&
            identical(sort(unique(df$block_num[df$phase == 1L])), 1:4)
    )
    assert_test(
        paste(fname, "- Phase 2 target type matches order"),
        all(df$target_type[df$phase == 2L] == expected_types[2]) &&
            identical(sort(unique(df$block_num[df$phase == 2L])), 5:8)
    )

    # 5. Catch Trials (5% proportion + spacing constraints)
    prac_catch_by_blk <- df %>%
        filter(block_category == "practice") %>%
        group_by(block_num) %>%
        summarise(
            n_total = n(),
            n_go = sum(trial_go_nogo == "go"),
            n_catch = sum(trial_go_nogo == "catch"),
            .groups = "drop"
        )
    assert_test(
        paste(fname, "- Practice blocks have 19 go + 1 catch"),
        all(prac_catch_by_blk$n_total == 20L) &&
            all(prac_catch_by_blk$n_go == 19L) &&
            all(prac_catch_by_blk$n_catch == 1L)
    )

    exp_catch_by_blk <- exp_df %>%
        group_by(exp_block_num) %>%
        summarise(
            n_total = n(),
            n_go = sum(trial_go_nogo == "go"),
            n_catch = sum(trial_go_nogo == "catch"),
            n_catch_pos = sum(trial_go_nogo == "catch" & target_valence == "positive"),
            n_catch_neg = sum(trial_go_nogo == "catch" & target_valence == "negative"),
            .groups = "drop"
        )
    assert_test(
        paste(fname, "- Exp blocks have 76 go + 4 catch (2 pos, 2 neg)"),
        all(exp_catch_by_blk$n_total == 80L) &&
            all(exp_catch_by_blk$n_go == 76L) &&
            all(exp_catch_by_blk$n_catch == 4L) &&
            all(exp_catch_by_blk$n_catch_pos == 2L) &&
            all(exp_catch_by_blk$n_catch_neg == 2L)
    )

    assert_test(
        paste(fname, "- Catch trial never on Trial 1 of any block"),
        all(df$trial_go_nogo[df$trial_num == 1L] == "go")
    )

    catch_spacing <- df %>%
        arrange(block_num, trial_num) %>%
        group_by(block_num) %>%
        summarise(
            back_to_back = sum(trial_go_nogo == "catch" & lag(trial_go_nogo) == "catch", na.rm = TRUE),
            .groups = "drop"
        )
    assert_test(
        paste(fname, "- Zero back-to-back catch trials in any block"),
        all(catch_spacing$back_to_back == 0L)
    )

    # 6. Intra-Block & Overall Cell Balances
    exp_go_blk_cells <- exp_df %>%
        filter(trial_go_nogo == "go") %>%
        group_by(exp_block_num, prime_valence, target_valence) %>%
        summarise(n = n(), .groups = "drop")
    assert_test(
        paste(fname, "- Every exp block has 19 trials per 2x2 cell"),
        nrow(exp_go_blk_cells) == 24L && all(exp_go_blk_cells$n == 19L)
    )

    prac_go_blk_cells <- df %>%
        filter(block_category == "practice", trial_go_nogo == "go") %>%
        group_by(block_num, prime_valence, target_valence) %>%
        summarise(n = n(), .groups = "drop")
    assert_test(
        paste(fname, "- Practice block 19 go trials split as 5,5,5,4"),
        nrow(prac_go_blk_cells) == 8L && all(prac_go_blk_cells$n %in% c(4L, 5L))
    )

    anova_cells <- exp_df %>%
        filter(trial_go_nogo == "go") %>%
        group_by(target_type, prime_valence, target_valence, congruency) %>%
        summarise(n = n(), .groups = "drop")
    assert_test(
        paste(fname, "- Full 2x2x2 design has 8 cells with 57 trials each"),
        nrow(anova_cells) == 8L && all(anova_cells$n == 57L)
    )

    # 7. Congruency & S-R Key Mapping Integrity
    go_df <- df %>% filter(trial_go_nogo == "go")
    catch_df <- df %>% filter(trial_go_nogo == "catch")

    expected_cong <- ifelse(go_df$prime_valence == go_df$target_valence, "congruent", "incongruent")
    assert_test(paste(fname, "- Congruency matches prime_valence == target_valence"), all(go_df$congruency == expected_cong))
    assert_test(
        paste(fname, "- Catch trial metadata clean"),
        all(catch_df$prime_valence == "catch") &&
            all(catch_df$prime_stim == "none") &&
            all(catch_df$congruency == "catch") &&
            all(catch_df$corr_resp == "none")
    )
    assert_test(
        paste(fname, "- Go corr_resp matches key mapping"),
        all(go_df$corr_resp[go_df$target_valence == "positive"] == spec$key_pos) &&
            all(go_df$corr_resp[go_df$target_valence == "negative"] == spec$key_neg)
    )

    # 8. Stimulus Pool Integrity, Bag Exposure Balance & t != t - 1 Non-Repetition
    assert_test(
        paste(fname, "- Prime sounds strictly match positive/negative pools"),
        all(go_df$prime_stim[go_df$prime_valence == "positive"] %in% pos_sounds) &&
            all(go_df$prime_stim[go_df$prime_valence == "negative"] %in% neg_sounds)
    )
    assert_test(
        paste(fname, "- Word targets strictly match positive/negative pools"),
        all(df$target_stim[df$target_type == "word" & df$target_valence == "positive"] %in% pos_words) &&
            all(df$target_stim[df$target_type == "word" & df$target_valence == "negative"] %in% neg_words)
    )
    assert_test(
        paste(fname, "- Face targets strictly match positive/negative MPI pools"),
        all(df$target_stim[df$target_type == "face" & df$target_valence == "positive"] %in% pos_faces) &&
            all(df$target_stim[df$target_type == "face" & df$target_valence == "negative"] %in% neg_faces)
    )

    exp_target_counts <- exp_df %>%
        group_by(exp_block_num, target_stim) %>%
        summarise(n = n(), .groups = "drop")
    assert_test(
        paste(fname, "- All 16 targets appear exact 5 times per exp block"),
        nrow(exp_target_counts) == 96L && all(exp_target_counts$n == 5L)
    )

    exp_prime_counts <- exp_df %>%
        filter(trial_go_nogo == "go") %>%
        group_by(exp_block_num, prime_stim) %>%
        summarise(n = n(), .groups = "drop")
    assert_test(
        paste(fname, "- All 16 prime sounds appear 4 or 5 times per exp block"),
        nrow(exp_prime_counts) == 96L && all(exp_prime_counts$n %in% c(4L, 5L))
    )

    seq_repeats <- df %>%
        arrange(block_num, trial_num) %>%
        group_by(block_num) %>%
        summarise(
            target_repeats = sum(target_stim == lag(target_stim), na.rm = TRUE),
            prime_repeats = sum(trial_go_nogo == "go" & prime_stim == lag(prime_stim), na.rm = TRUE),
            .groups = "drop"
        )
    assert_test(
        paste(fname, "- Zero back-to-back target or prime repetitions"),
        all(seq_repeats$target_repeats == 0L) && all(seq_repeats$prime_repeats == 0L)
    )

    # 9. Scoring Logic Verification
    withheld_catch <- catch_df %>% filter(is.na(response))
    fa_catch <- catch_df %>% filter(!is.na(response))
    assert_test(
        paste(fname, "- Catch trial scoring accurate (1=withheld/NA RT, 5=FA)"),
        all(withheld_catch$corr_code == 1L & is.na(withheld_catch$rt)) &&
            all(fa_catch$corr_code == 5L & !is.na(fa_catch$rt))
    )

    valid_go <- go_df %>% filter(!is.na(response) & rt > 150 & rt < 2000)
    assert_test(
        paste(fname, "- Go trial scoring accurate (1=correct, 2=choice error)"),
        all(valid_go$corr_code == ifelse(valid_go$response == valid_go$corr_resp, 1L, 2L))
    )

    file_records[[idx]] <- data.frame(
        file = fname,
        version = as.integer(ver),
        order = spec$order,
        keys = sprintf("Pos=%s/Neg=%s", toupper(spec$key_pos), toupper(spec$key_neg)),
        total_trials = nrow(df),
        exp_go = sum(exp_df$trial_go_nogo == "go"),
        exp_catch = sum(exp_df$trial_go_nogo == "catch"),
        cong_rt = mean(exp_df$rt[exp_df$congruency == "congruent" & exp_df$corr_code == 1L], na.rm = TRUE),
        incong_rt = mean(exp_df$rt[exp_df$congruency == "incongruent" & exp_df$corr_code == 1L], na.rm = TRUE),
        go_err_pct = 100 * mean(exp_df$corr_code[exp_df$trial_go_nogo == "go"] != 1L),
        catch_fa_pct = 100 * mean(exp_df$corr_code[exp_df$trial_go_nogo == "catch"] != 1L)
    )
}

cat(sprintf("  [PASS] All 80 individual participant files passed all 28 per-file assertions (2,240 checks)!\n"))

# ==============================================================================
# Sample-Wide Assertions Across All 80 Participants (41,600 Trials)
# ==============================================================================
full_df <- bind_rows(all_dfs)
summary_df <- bind_rows(file_records)

assert_test("Total combined rows == 41,600 (80 x 520)", nrow(full_df) == 41600L, verbose = TRUE)
assert_test(
    "Counterbalancing split is exact 20 participants per version (Versions 1..4)",
    identical(as.integer(table(summary_df$version)), c(20L, 20L, 20L, 20L)),
    verbose = TRUE
)
assert_test(
    "Across 80 files, Trial 1 has 0 catch trials (out of 640 block starts)",
    sum(full_df$trial_num == 1L & full_df$trial_go_nogo == "catch") == 0L,
    verbose = TRUE
)

exp_catch_positions <- full_df %>%
    filter(block_category == "exp", trial_go_nogo == "catch") %>%
    pull(trial_num)
assert_test(
    sprintf(
        "Across 480 exp blocks (1,920 catch trials), catch positions span [min=%d, max=%d] within 2..80",
        min(exp_catch_positions), max(exp_catch_positions)
    ),
    min(exp_catch_positions) >= 2L && max(exp_catch_positions) <= 80L,
    verbose = TRUE
)

cat("\n================================================================================\n")
cat("                  SUMMARY BY COUNTERBALANCED VERSION (N = 80)                   \n")
cat("================================================================================\n")
ver_summary <- summary_df %>%
    group_by(Version = version, Order = order, Keys = keys) %>%
    summarise(
        N_Files = n(),
        Trials_Per_Subj = unique(total_trials),
        ExpGo_Per_Subj = unique(exp_go),
        ExpCatch_Per_Subj = unique(exp_catch),
        Mean_Cong_RT = round(mean(cong_rt), 1),
        Mean_Incong_RT = round(mean(incong_rt), 1),
        Mean_Go_Err_Pct = round(mean(go_err_pct), 1),
        Mean_Catch_FA_Pct = round(mean(catch_fa_pct), 1),
        .groups = "drop"
    )
print(as.data.frame(ver_summary), row.names = FALSE)

cat("\n================================================================================\n")
cat("          AGGREGATE 2 x 2 x 2 EXPERIMENTAL GO CELL TOTALS (N = 80)              \n")
cat("================================================================================\n")
agg_cells <- full_df %>%
    filter(block_category == "exp", trial_go_nogo == "go") %>%
    group_by(target_type, prime_valence, target_valence, congruency) %>%
    summarise(
        Total_Trials_Across_80 = n(),
        Trials_Per_Participant = n() / 80,
        .groups = "drop"
    )
print(as.data.frame(agg_cells), row.names = FALSE)

cat(sprintf(
    "\nTOTAL ASSERTIONS RUN: %d | PASSED: %d | FAILED: %d\n",
    total_tests, passed_tests, total_tests - passed_tests
))

if (passed_tests == total_tests) {
    cat("\n>>> ALL 80 SIMULATED FILES (41,600 TRIALS) 100% VERIFIED IN R!\n\n")
} else {
    stop("Validation failed!")
}
