# Trains of the West Client

## Dependencies

Change to this directory and use Bower to install all dependencies:

    $ bower install

## To-do

### General

*   Write documentation (work in progress);
*   Add [support for HiPPI-devices][HiPPI-device support] (the only place that I can think of that will require tweaking is generateOpacityMap() in core/image.js).

### Architecture

*   Decouple type and sprite sheet cell;
*   Improve client-side prediction by adding support for replaying user actions.

### Memory

*   Reduce the number of one-shot-functions (inline callbacks for merge, sort, each,...).

### OpenShift

*   Only connect to the server using the HTTPS-protocol.

## Bugs

### Unconfirmed

### Confirmed

*   Memory leak when switching scenes (Vyacheslav Egorov's [plog post on closures in V8][closures in V8] might contain the key).

### Won't fix

*   Visual errors in Internet Explorer when the system's DPI is not set to a 100%.

[HiPPI-device support]: http://phoboslab.org/log/2012/09/drawing-pixels-is-hard "PhobosLab - Drawing Pixels is Hard"
[closures in V8]: http://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html "Mraleph - Grokking V8 Closures for Fun (and Profit?)"
