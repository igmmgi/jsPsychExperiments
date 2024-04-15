# FollowThePath.R
library(readr)
library(tidyr)
library(dplyr)

# Data
datDir   <- "/home/ian/Downloads/"
datFiles <- list.files(path = datDir, pattern = ("*.json"), full.names = TRUE)
dat      <- do.call(rbind, lapply(datFiles, jsonlite::fromJSON, flatten = TRUE))

dat <- dat %>%
  rowwise() %>%
  unnest(., c(path_x, path_y, ball_x, ball_y, error))

dat$vpNum <- as.numeric(as.factor(dat$vpNum))

dat <- dat %>%
  mutate(
    position_label    = ifelse(ball_x < path_x, "left", "right"),
    position_distance = ball_x - path_x
  )

plot_trial_path <- function(dat, subject_number, block_number, trial_number) {
  tmp_dat <- dat %>%
    filter(vpNum == subject_number, block == block_number, trial == trial_number)
  if (nrow(tmp_dat) == 0) {
    message("Subject/block/trial combination not in dataframe!")
    return
  }
  plot(tmp_dat$path_x,  tmp_dat$path_y, type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2, ylab = "Y Pos", xlab = "X Pos")
  lines(tmp_dat$ball_x, tmp_dat$ball_y, type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2, col = "Green")
}
plot_trial_path(dat, 1, 1, 1)


plot_trial_error <- function(dat, subject_number, block_number, trial_number) {
  tmp_dat <- dat %>%
    filter(vpNum == subject_number, block == block_number, trial == trial_number)
  if (nrow(tmp_dat) == 0) {
    message("Subject/block/trial combination not in dataframe!")
    return
  }
  plot(tmp_dat$position_distance,  tmp_dat$path_y, type = "l", xlim = c(-250, 250), ylim = rev(c(0, 720)), lwd = 2, ylab = "Y Pos", xlab = "X Error")
}
plot_trial_error(dat, 1, 3, 1)

# How do we measure line/path complexity?
# Idea 1: Ratio of path distance to straight line distance (https://en.wikipedia.org/wiki/Sinuosity)
path_distance <- function(x, y) {
  return(sum(sqrt(diff(x)^2 + diff(y)^2)))
}

dat <- dat %>%
  group_by(vpNum, block, trial) %>%
  mutate(path_distance = path_distance(path_x, path_y),
         path_ratio    = path_distance / 620)

# should be larger for hard path
dat %>%
  filter(path_y == 620) %>%
  group_by(block_type) %>%
  summarize(
    n_trials        = n(),
    mean_path_ratio = mean(path_ratio))



















