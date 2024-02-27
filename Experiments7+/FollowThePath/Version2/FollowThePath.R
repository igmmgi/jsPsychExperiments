# FollowThePath.R
library(readr)
library(tidyr)
library(dplyr)

# Data
datDir   <- "/home/ian/Downloads/"
datFiles <- list.files(path = datDir, pattern = ("*.json"), full.names = TRUE)
dat      <- do.call(rbind, lapply(datFiles[1], jsonlite::fromJSON, flatten = TRUE))

dat <- dat %>%
  rowwise() %>%
  unnest(., c(path_x, path_y, ball_x, ball_y))

block <- 3
plot(dat$path_x[dat$block==block], dat$path_y[dat$block==block], type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2)
lines(dat$ball_x[dat$block==block], dat$ball_y[dat$block==block], type = "l", xlim = c(0, 1280), ylim = rev(c(0, 720)), lwd = 2, col = "Green")

dat <- dat %>%
  group_by(block) %>%
  mutate(position_label    = ifelse(ball_x < path_x, "left", "right"),
         position_distance = ball_x - path_x)

