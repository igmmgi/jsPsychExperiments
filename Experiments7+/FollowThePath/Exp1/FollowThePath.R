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
    position_label = ifelse(ball_x < path_x, "left", "right"),
    position_distance = ball_x - path_x
  )

plot_trial <- function(dat, subject_number, block_number, trial_number) {
  tmp_dat <- dat %>%
    filter(vpNum == subject_number, block == block_number, trial == trial_number)
  plot(tmp_dat$path_x, tmp_dat$path_y, type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2, ylab = "Y Pos", xlab = "X Pos")
  lines(tmp_dat$ball_x, tmp_dat$ball_y, type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2, col = "Green")
}
plot_trial(dat, 1, 1, 1)





