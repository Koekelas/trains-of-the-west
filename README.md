# Trains of the West

## Software requirements

Trains of the West uses the Node.js runtime environment, the Bower- and npm-package manager and the Grunt task runner.

[Download][download Node.js] and install Node.js (npm comes with Node.js).

Once Node.js is installed, change to this directory and use npm to install Bower, Grunt, it's CLI and it's plugins:

    $ npm install -g bower grunt-cli
    $ npm install

## Grunt

### Usage

Change to this directory, or any child directory, and run:

    $ grunt [task[:target] [task[:target] ...]]

### Tasks

When no task is specified, the default task (rebuild) is run.

**build**

Generate an optimised build for deployment on OpenShift. After running this task, the optimised build can be found in ./build.

**rebuild**

Equivalent to clean:build build.

**less**

*build*

Build all LESS style sheets.

**rebuildStyles**

Equivalent to clean:less less:build.

**handlebars**

*build*

Build all handlebars templates.

**rebuildTemplates**

Equivalent to clean:handlebars handlebars:build.

**yuidoc**

*build*

Build the documentation. After running this task, the documentation can be found in ./documentation.

**clean**

*build*

Clean the build directory.

*less*

Clean all build LESS style sheets.

*handlebars*

Clean all build handlebars templates.

*yuidoc*

Clean the documentation directory.

### Examples

    # Default task
    $ grunt

    # Clean task, all targets
    $ grunt clean

    # Clean task, handlebars target
    $ grunt clean:handlebars

    # Clean task, handlebars target followed by handlebars task, build target
    $ grunt clean:handlebars handlebars:build
    # or
    $ grunt rebuildTemplates

[download Node.js]: http://nodejs.org/ "Node.js Homepage"
