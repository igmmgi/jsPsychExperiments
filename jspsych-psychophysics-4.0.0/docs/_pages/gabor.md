---
permalink: /gabor/
title: "Presenting gabor patches in online/web experiments"
---

You can present gabor patches using the jspsych-psychophysics plugin.

![gabor](/images/gabor.png)

The calculation method for drawing is almost the same as the one used by [the Psychtoolbox](http://psychtoolbox.org/), although my plugin doesn't use the procedural texture mapping and WebGL. I also have referenced [the gaborgen-js code](https://github.com/jtth/gaborgen-js).

[The ml-matrix](https://www.npmjs.com/package/ml-matrix) is used for the calculation library. The `numeric` has been discontinued since the psychophysics plugin V4.X.

There are still the issues of display calibration and luminance resolution. Unfortunately, my plugin does not provide a solution to this problem.

See the Gabor section of [Parameters of stimuli](https://jspsychophysics.hes.kyushu-u.ac.jp/objectProperties.html) to learn how to draw the gabor patches.

# The drifting gabor patch

You are capable of making a gabor patch drift. However, its speed is not probably accurate.

By checking the averaged time of a frame, you can see how accurately the stimulus has been presented. The psychophysics plugin records the time (avg_frame_time). When using a display with a refresh rate of 60 Hz, theoretically this would be 16.7 ms.

The avg_frame_time is the value of an elapsed time divided by the number of times the requestAnimationFrame was called. The elapsed time is the time when the requestAnimationFrame was last called minus the time when the requestAnimationFrame was first called. 

Using the avg_frame_time, it is possible to roughly calculate the speed of the drifting patch. For example, if the avg_frame_time was 30 ms and the drift property was specified as 10, the gabor patch drifted by the angular velocity of 10 degrees during 30 ms.

# Demonstrations

## [draw-gabor-patches.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw-gabor-patches.html)

This file demonstrates how to present gabor patches. 

## [drifting-gabor.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/drifting-gabor.html)

This file demonstrates how to present a drifting gabor patch. 

## [gabor_tilt.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/gabor_tilt.html)

This file demonstrates how to change the tilt of the gabor by pressing keys.