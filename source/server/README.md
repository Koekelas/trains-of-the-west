# Trains of the West Server

# Software requirements

Navigate your shell to this directory and run:

```
$ npm install
```

# Usage

Navigate your shell to this directory and run:

```
$ npm start
```

# To-do

## General

*   Write documentation;
*   Improve error handling and logging.

## Architecture

*   Decouple type and sprite sheet cell;
*   Rethink responses, particularly MODIFY_TERRAIN;
*   Intelligently combine messages and send them as one message.

## Memory

*   Reduce the number of one shot functions (inline callbacks for merge, sort, each,...);
*   Convert game/spriteSheetDataStore.js to the prototypal module pattern.

## OpenShift

*   Only allow clients to connect via the HTTPS protocol.
