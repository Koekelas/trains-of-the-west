# Trains of the West Client

## Dependencies

Change to this directory and use Bower to install all dependencies:

    $ bower install

## To-do

### General

*   Write documentation (work in progress);
*   [Add support for HiPPI-devices][HiPPI-device support] (the only place that I can think of that will require tweaking is generateOpacityMap() in core/image.js).

### Architecture

*   Decouple type and sprite sheet cell;
*   Improve client-side prediction by adding support for replaying user actions.

### Memory

*   Reduce the number of one-shot-functions (inline callbacks for merge, sort, each,...);
*   Convert core/image.js and core/spriteSheet.js to a prototypal module.

### OpenShift

*   Only connect to the server using the HTTPS-protocol.

## Bugs

### Unconfirmed

*   Memory leak when switching scenes;
*   SockJS throws an exception when the connection closes if the game is being run locally and the client is served by the Trains of the West Server (fixed?).

### Confirmed

### Won't fix

*   Visual errors in Internet Explorer when the system's DPI is not set to a 100%.

[HiPPI-device support]: http://phoboslab.org/log/2012/09/drawing-pixels-is-hard "PhobosLab - Drawing Pixels is Hard"
