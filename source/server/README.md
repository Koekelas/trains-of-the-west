# Trains of the West Server

## Dependencies

Change to this directory and use npm to install all dependencies:

    $ npm install

*Note: rbytes is optional, don't worry if it fails to install.*

## Server

### Usage

Change to this directory and run:

    $ node app.js [logLevel]

### Options

**logLevel**

Determines whether a log request gets logged based on the severity of the log request.

Possible values: debug | information | error

Default value: debug

### Examples

    # Default log level
    $ node app.js
    # or
    $ npm start

    # error log level
    $ node app.js error

## To-do

### General

*   Write documentation;
*   Improve error handling and logging.

### Architecture

*   Decouple type and sprite sheet cell;
*   Rethink responses, particularly MODIFY_TERRAIN;
*   Intelligently combine messages and send them as one message.

### Memory

*   Reduce the number of one-shot-functions (inline callbacks for merge, sort, each,...);
*   Convert game/spriteSheetDataStore.js to a prototypal module pattern.

### OpenShift

*   Only allow clients to connect via the HTTPS-protocol.
