#' ==============================================================================
#' Comprehensive R Validation Script for Ironic Negation Experiment Versions
#' 
#' Exhaustively verifies trial counts, cell balances, block structures,
#' intra-block dynamics, S-R mappings, and data schema across all 10 versions:
#'   - Simon (Versions 1, 2, 3, 4)
#'   - Flanker (Versions 1, 2)
#'   - Stroop (Versions 1, 2, 3, 4)
#' ==============================================================================

suppressPackageStartupMessages({
  library(dplyr)
  library(tidyr)
})

cat("================================================================================\n")
cat("          IRONIC NEGATION EXPERIMENTAL SPECIFICATION VALIDATION               \n")
cat("================================================================================\n\n")

# Define expected files and metadata
files_to_check <- list(
  list(task = "Simon", version = 1, file = "Simon/data/simulated_Simon_version1.csv", order = "Aff_First", map = "Q_Red_P_Blue"),
  list(task = "Simon", version = 2, file = "Simon/data/simulated_Simon_version2.csv", order = "Aff_First", map = "Q_Blue_P_Red"),
  list(task = "Simon", version = 3, file = "Simon/data/simulated_Simon_version3.csv", order = "Neg_First", map = "Q_Red_P_Blue"),
  list(task = "Simon", version = 4, file = "Simon/data/simulated_Simon_version4.csv", order = "Neg_First", map = "Q_Blue_P_Red"),
  list(task = "Flanker", version = 1, file = "Flanker/data/simulated_Flanker_version1.csv", order = "Aff_First", map = "Q_Left_P_Right"),
  list(task = "Flanker", version = 2, file = "Flanker/data/simulated_Flanker_version2.csv", order = "Neg_First", map = "Q_Left_P_Right"),
  list(task = "Stroop", version = 1, file = "Stroop/data/simulated_Stroop_version1.csv", order = "Aff_First", map = "Q_Red_P_Blue"),
  list(task = "Stroop", version = 2, file = "Stroop/data/simulated_Stroop_version2.csv", order = "Aff_First", map = "Q_Blue_P_Red"),
  list(task = "Stroop", version = 3, file = "Stroop/data/simulated_Stroop_version3.csv", order = "Neg_First", map = "Q_Red_P_Blue"),
  list(task = "Stroop", version = 4, file = "Stroop/data/simulated_Stroop_version4.csv", order = "Neg_First", map = "Q_Blue_P_Red")
)

required_cols <- c(
  "Participant", "Experiment", "Order", "OrderType", "Phase", "KeyMapping",
  "BlockType", "Block", "ExperimentalBlock", "TrialInBlock", "GlobalTrial",
  "Instruction", "Congruency", "TrialBin", "Stimulus", "TargetFeature",
  "Distractor", "RequiredKey", "ResponseKey", "Correct", "RT", "PostError"
)

total_tests <- 0
passed_tests <- 0

assert_test <- function(desc, condition) {
  total_tests <<- total_tests + 1
  if (condition) {
    passed_tests <<- passed_tests + 1
    cat(sprintf("  [PASS] %s\n", desc))
  } else {
    cat(sprintf("  [FAIL] %s\n", desc))
    stop(sprintf("Assertion failed: %s", desc))
  }
}

summary_records <- list()

for (item in files_to_check) {
  cat(sprintf("\n>>> Validating %s - Version %d (%s, %s)\n", item$task, item$version, item$order, item$map))
  cat(sprintf("    File: %s\n", item$file))
  
  assert_test("File exists on disk", file.exists(item$file))
  
  df <- read.csv(item$file, stringsAsFactors = FALSE)
  
  # 1. Column Schema
  assert_test("All 22 pre-registered columns present", all(required_cols %in% names(df)))
  
  # 2. Total trial volume
  assert_test("Total trials == 496", nrow(df) == 496)
  assert_test("Practice trials == 16 (2 blocks x 8 trials)", sum(df$BlockType == "Practice") == 16)
  assert_test("Experimental trials == 480 (12 blocks x 40 trials)", sum(df$BlockType == "Experimental") == 480)
  
  # 3. Block Structure
  assert_test("Total blocks == 14 (1..14)", length(unique(df$Block)) == 14 && all(sort(unique(df$Block)) == 1:14))
  
  # Practice blocks are block 1 and block 8
  assert_test("Practice blocks are Block 1 and Block 8",
              all(df$Block[df$BlockType == "Practice"] %in% c(1, 8)) &&
              sum(df$Block == 1) == 8 && sum(df$Block == 8) == 8)
  
  # Experimental blocks
  exp_df <- df %>% filter(BlockType == "Experimental")
  assert_test("ExperimentalBlock numbers range 1..12",
              all(sort(unique(as.integer(exp_df$ExperimentalBlock))) == 1:12))
  
  # 4. Phase & Instruction Framing
  p1_exp <- exp_df %>% filter(Phase == 1)
  p2_exp <- exp_df %>% filter(Phase == 2)
  assert_test("Phase 1 has 240 experimental trials", nrow(p1_exp) == 240)
  assert_test("Phase 2 has 240 experimental trials", nrow(p2_exp) == 240)
  
  if (item$order == "Aff_First") {
    assert_test("Phase 1 instruction is Affirmative", all(p1_exp$Instruction == "Affirmative"))
    assert_test("Phase 2 instruction is Negation", all(p2_exp$Instruction == "Negation"))
  } else {
    assert_test("Phase 1 instruction is Negation", all(p1_exp$Instruction == "Negation"))
    assert_test("Phase 2 instruction is Affirmative", all(p2_exp$Instruction == "Affirmative"))
  }
  
  # 5. Cell Combinations (2 x 2 fully balanced)
  cell_counts <- exp_df %>%
    group_by(Instruction, Congruency) %>%
    summarise(n = n(), .groups = "drop")
  
  assert_test("Exact 120 trials in Affirmative - Congruent cell",
              filter(cell_counts, Instruction == "Affirmative" & Congruency == "Congruent")$n == 120)
  assert_test("Exact 120 trials in Affirmative - Incongruent cell",
              filter(cell_counts, Instruction == "Affirmative" & Congruency == "Incongruent")$n == 120)
  assert_test("Exact 120 trials in Negation - Congruent cell",
              filter(cell_counts, Instruction == "Negation" & Congruency == "Congruent")$n == 120)
  assert_test("Exact 120 trials in Negation - Incongruent cell",
              filter(cell_counts, Instruction == "Negation" & Congruency == "Incongruent")$n == 120)
  
  # 6. Intra-Block Congruency Balance
  block_cong_balance <- exp_df %>%
    group_by(Block) %>%
    summarise(
      n_total = n(),
      n_cong = sum(Congruency == "Congruent"),
      n_incong = sum(Congruency == "Incongruent"),
      .groups = "drop"
    )
  assert_test("Every 40-trial block has exactly 20 Congruent and 20 Incongruent trials",
              all(block_cong_balance$n_total == 40) &&
              all(block_cong_balance$n_cong == 20) &&
              all(block_cong_balance$n_incong == 20))
  
  # Practice block congruency balance
  prac_cong_balance <- df %>%
    filter(BlockType == "Practice") %>%
    group_by(Block) %>%
    summarise(
      n_total = n(),
      n_cong = sum(Congruency == "Congruent"),
      n_incong = sum(Congruency == "Incongruent"),
      .groups = "drop"
    )
  assert_test("Every 8-trial practice block has exactly 4 Congruent and 4 Incongruent trials",
              all(prac_cong_balance$n_total == 8) &&
              all(prac_cong_balance$n_cong == 4) &&
              all(prac_cong_balance$n_incong == 4))
  
  # 7. Intra-Block Dynamics: TrialBin
  assert_test("TrialBin has exactly 16 'Practice', 120 'Early' (1-10), and 360 'Late' (11-40) trials",
              sum(df$TrialBin == "Practice") == 16 &&
              sum(df$TrialBin == "Early") == 120 &&
              sum(df$TrialBin == "Late") == 360)
  
  # 8. S-R Mapping & Congruency Accuracy
  assert_test("KeyMapping is 100% constant across Phase 1 and Phase 2",
              length(unique(df$KeyMapping)) == 1 && unique(df$KeyMapping) == item$map)
  
  if (item$task == "Simon") {
    if (item$map == "Q_Red_P_Blue") {
      assert_test("Red target mapped to 'q'", all(df$RequiredKey[df$TargetFeature == "Red"] == "q"))
      assert_test("Blue target mapped to 'p'", all(df$RequiredKey[df$TargetFeature == "Blue"] == "p"))
    } else {
      assert_test("Blue target mapped to 'q'", all(df$RequiredKey[df$TargetFeature == "Blue"] == "q"))
      assert_test("Red target mapped to 'p'", all(df$RequiredKey[df$TargetFeature == "Red"] == "p"))
    }
    # Simon congruency check
    congruent_expected <- ifelse((df$RequiredKey == "q" & df$Distractor == "Left") |
                                 (df$RequiredKey == "p" & df$Distractor == "Right"),
                                 "Congruent", "Incongruent")
    assert_test("Simon congruency strictly aligns with response hand and visual location",
                all(df$Congruency == congruent_expected))
    
  } else if (item$task == "Flanker") {
    assert_test("Left target arrow mapped to 'q'", all(df$RequiredKey[df$TargetFeature == "Left"] == "q"))
    assert_test("Right target arrow mapped to 'p'", all(df$RequiredKey[df$TargetFeature == "Right"] == "p"))
    flanker_cong_expected <- ifelse(df$TargetFeature == df$Distractor, "Congruent", "Incongruent")
    assert_test("Flanker congruency strictly aligns with center and flanking arrow direction",
                all(df$Congruency == flanker_cong_expected))
    
  } else if (item$task == "Stroop") {
    if (item$map == "Q_Red_P_Blue") {
      assert_test("Red font ink mapped to 'q'", all(df$RequiredKey[df$TargetFeature == "Red"] == "q"))
      assert_test("Blue font ink mapped to 'p'", all(df$RequiredKey[df$TargetFeature == "Blue"] == "p"))
    } else {
      assert_test("Blue font ink mapped to 'q'", all(df$RequiredKey[df$TargetFeature == "Blue"] == "q"))
      assert_test("Red font ink mapped to 'p'", all(df$RequiredKey[df$TargetFeature == "Red"] == "p"))
    }
    stroop_cong_expected <- ifelse(tolower(df$TargetFeature) == tolower(df$Distractor), "Congruent", "Incongruent")
    assert_test("Stroop congruency strictly aligns with ink colour and word meaning",
                all(df$Congruency == stroop_cong_expected))
  }
  
  # 9. PostError Tracking Logic (block-boundary aware)
  post_error_expected <- integer(nrow(df))
  for (i in 2:nrow(df)) {
    if (df$TrialInBlock[i] == 1) {
      post_error_expected[i] <- 0
    } else {
      post_error_expected[i] <- as.integer(df$Correct[i - 1] == 0)
    }
  }
  assert_test("PostError indicator strictly flags trials immediately following an error",
              all(df$PostError == post_error_expected))
  
  summary_records[[length(summary_records) + 1]] <- data.frame(
    Task = item$task,
    Version = item$version,
    Order = item$order,
    KeyMapping = item$map,
    TotalTrials = nrow(df),
    PracticeTrials = sum(df$BlockType == "Practice"),
    ExpTrials = sum(df$BlockType == "Experimental"),
    Aff_Cong = filter(cell_counts, Instruction == "Affirmative" & Congruency == "Congruent")$n,
    Aff_Incong = filter(cell_counts, Instruction == "Affirmative" & Congruency == "Incongruent")$n,
    Neg_Cong = filter(cell_counts, Instruction == "Negation" & Congruency == "Congruent")$n,
    Neg_Incong = filter(cell_counts, Instruction == "Negation" & Congruency == "Incongruent")$n
  )
}

summary_table <- bind_rows(summary_records)

cat("\n================================================================================\n")
cat("                       VALIDATION SUMMARY TABLE                                 \n")
cat("================================================================================\n")
print(summary_table, row.names = FALSE)

cat(sprintf("\nTOTAL TESTS RUN: %d | PASSED: %d | FAILED: %d\n",
            total_tests, passed_tests, total_tests - passed_tests))

if (passed_tests == total_tests) {
  cat("\n>>> ALL SPECIFICATIONS 100% VERIFIED AND CONFIRMED BY R!\n\n")
} else {
  stop("Some tests failed!")
}
