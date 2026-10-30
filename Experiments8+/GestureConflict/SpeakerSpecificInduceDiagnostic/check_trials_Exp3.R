# check_trials_Exp3.R
# Verification of trial numbers, cell combinations, and proportions for SpeakerSpecificInduceDiagnostic (Exp 3.1 & Exp 3.2)

library(readr)
library(dplyr)
library(tidyr)

dir_data <- file.path(getwd(), "data_sim")
if (!dir.exists(dir_data)) {
  # If executed from repo root
  dir_data <- "Experiments8+/GestureConflict/SpeakerSpecificInduceDiagnostic/data_sim"
}

files <- list.files(path = dir_data, pattern = "^sim_.*\\.csv$", full.names = TRUE)
if (length(files) == 0) {
  stop("No simulated data files found in ", dir_data)
}

cat("========================================================================\n")
cat("      SPEAKER-SPECIFIC INDUCE-DIAGNOSTIC (EXP 3.1 & EXP 3.2) CHECK       \n")
cat("========================================================================\n\n")

for (f in files) {
  cat("------------------------------------------------------------------------\n")
  cat("Analyzing:", basename(f), "\n")
  cat("------------------------------------------------------------------------\n")
  dat <- read_csv(f, show_col_types = FALSE)

  cat("Experiment:", unique(dat$experiment), "| Version:", unique(dat$version), "\n")
  cat("Total Trials:", nrow(dat), 
      "(Practice:", sum(dat$is_prac == 1), 
      ", Experimental:", sum(dat$is_prac == 0), ")\n\n")

  # Trials per block
  block_summary <- dat %>%
    group_by(block_num, is_prac) %>%
    summarise(
      n_total = n(),
      n_inducer = sum(item_type == "inducer"),
      n_diagnostic = sum(item_type == "diagnostic"),
      .groups = "drop"
    )
  cat("Trials per Block:\n")
  print(as.data.frame(block_summary))
  cat("\n")

  # Cell counts and proportion check for Experimental blocks
  exp_dat <- dat %>% filter(is_prac == 0)

  cat("Cell counts & Congruency Proportions in Experimental Blocks:\n")
  prop_check <- exp_dat %>%
    group_by(speaker_validity, item_type) %>%
    summarise(
      n_comp = sum(comp == "comp"),
      n_incomp = sum(comp == "incomp"),
      n_total = n(),
      pct_comp = round(100 * n_comp / n_total, 1),
      pct_incomp = round(100 * n_incomp / n_total, 1),
      .groups = "drop"
    )
  print(as.data.frame(prop_check))
  cat("\n")

  # Breakdown by Speaker Gender
  cat("Breakdown by Speaker Gender & Item Type:\n")
  gender_check <- exp_dat %>%
    group_by(gender, speaker_validity, item_type, comp) %>%
    summarise(n = n(), .groups = "drop") %>%
    pivot_wider(names_from = comp, values_from = n, values_fill = 0) %>%
    mutate(pct_comp = round(100 * comp / (comp + incomp), 1))
  print(as.data.frame(gender_check))
  cat("\n")

  # Token balance check
  cat("Video Token Balance (distinct video counts):\n")
  video_counts <- exp_dat %>%
    group_by(item_type, gender, comp, video) %>%
    summarise(reps = n(), .groups = "drop")
  print(as.data.frame(video_counts))
  cat("\n\n")
}
