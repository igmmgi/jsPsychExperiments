# FollowThePath.R



# Data
datDir   <- "."
datFiles <- list.files(path = datDir, pattern = ("*.json"), full.names = TRUE)
dat      <- do.call(rbind, lapply(datFiles[2], jsonlite::fromJSON, flatten = TRUE))

