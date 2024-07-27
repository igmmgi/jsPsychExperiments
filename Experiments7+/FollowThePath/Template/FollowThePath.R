# FollowThePath.R
library(readr)
library(tidyr)
library(dplyr)
library(ggplot2)

# Data
datDir   <- "/home/ian/Downloads"
datFiles <- list.files(path = datDir, pattern = ("*.json"), full.names = TRUE)
dat      <- do.call(rbind, lapply(datFiles, jsonlite::fromJSON, flatten = TRUE))

SCREEN_HEIGHT <- 720
SCREEN_WIDTH <- 1280
PATH_HEIGHT <- 620

dat <- dat %>%
  rowwise() %>%
  unnest(., c(path_x, path_y, ball_x, ball_y, on_path))

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
    stop("Subject/block/trial combination not in dataframe!")
  }
  plot(tmp_dat$path_x,  tmp_dat$path_y, type = "l", xlim = c(0, SCREEN_WIDTH), ylim = rev(c(0, SCREEN_HEIGHT)),
       lwd = 2, ylab = "Y Pos", xlab = "X Pos")
  lines(tmp_dat$ball_x, tmp_dat$ball_y, type = "l", xlim = c(0, SCREEN_WIDTH), ylim = rev(c(0, SCREEN_HEIGHT)),
        lwd = 2, col = "Green")
}
plot_trial_path(dat, 1, 3, 1)


plot_trial_error <- function(dat, subject_number, block_number, trial_number) {
  tmp_dat <- dat %>%
    filter(vpNum == subject_number, block == block_number, trial == trial_number)
  if (nrow(tmp_dat) == 0) {
    stop("Subject/block/trial combination not in dataframe!")
  }
  plot(tmp_dat$position_distance,  tmp_dat$path_y, type = "l", xlim = c(-250, 250), ylim = rev(c(0, SCREEN_HEIGHT)), lwd = 2, ylab = "Y Pos", xlab = "X Error")
}
plot_trial_error(dat, 1, 3, 1)

# How do we measure line/path complexity? (Speed manipulation is straightforward)
# Idea 1: Ratio of path distance to straight line distance (https://en.wikipedia.org/wiki/Sinuosity)
path_distance <- function(x, y) {
  return(sum(sqrt(diff(x)^2 + diff(y)^2)))
}

dat <- dat %>%
  group_by(vpNum, block, trial) %>%
  mutate(path_distance = path_distance(path_x, path_y),
         path_ratio    = path_distance / PATH_HEIGHT)

# should be larger for hard path
# TODO: is there some type of interaction with the speed manipulation?
dat %>%
  filter(path_y == PATH_HEIGHT) %>%
  group_by(block_type) %>%
  summarize(
    n_trials        = n(),
    mean_path_ratio = mean(path_ratio))

# do the manipulations work?
dat %>%
  group_by(block_type) %>%
  summarize(
    mean_position_distance = mean(position_distance),
    sd_position_distance   = sd(position_distance))

dat <- dat %>%
  mutate(speed_difficulty = ifelse(speed_difficulty == "easy", "Speed: Easy", "Speed: Hard"),
         path_difficulty = ifelse(path_difficulty == "easy", "Path: Easy", "Path: Hard"))

plt <- ggplot(dat, aes(x = position_distance, y = path_y, colour = trial)) +
    geom_path(aes(group = trial), linewidth = 0.5) +
  facet_grid(path_difficulty ~ speed_difficulty) +
  scale_x_continuous(name = "X Error", limits = c(-100, 100)) +
  scale_y_continuous(name = "Y Pos", limits = c(0, PATH_HEIGHT)) +
  theme_bw() +
  theme(legend.position = "none")
plt


dat_avg <- dat %>%
  group_by(vpNum, path_difficulty, speed_difficulty, path_y) %>%
  summarize(position_distance_mean = mean(position_distance),
            position_distance_sd = sd(position_distance))

plt <- ggplot(dat_avg, aes(x = position_distance_mean, y = path_y)) +
    geom_path(aes(group = 1), linewidth = 0.5) +
  geom_ribbon(aes(xmin=position_distance_mean-position_distance_sd, xmax=position_distance_mean+position_distance_sd), alpha=0.2)  +
  facet_grid(path_difficulty ~ speed_difficulty) +
  scale_x_continuous(name = "X Error", limits = c(-100, 100)) +
  scale_y_continuous(name = "Y Pos", limits = c(0, PATH_HEIGHT)) +
  theme_bw() +
  theme(legend.position = "none")
plt
