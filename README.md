![logo]

Trains of the West is a multiplayer tycoon game in which you have to build a railway company in the wild west. The game client runs, without the need for plugins, inside the browser. Note that this game is far from finished. It may not be playable or it may even crash and burn.

[![title screen]][title screen full][![terrain with tracks]][terrain with tracks full]

# Software requirements

Install [Node.js][Node.js homepage] and make sure both Node.js and npm are on your path. Navigate your shell to this directory and run:

```
$ npm install -g bower grunt-cli
$ npm install
```

See the client and server readme for additional software requirements.

# Target browsers

*   Latest Firefox & Chromium;
*   Internet Explorer 9+;
*   Opera 12+;
*   Safari Mobile on iOS 5 (1st gen iPad, partial ES5 support);
*   Firefox OS (maybe, if it comes to tablets).

# Grunt tasks

*   **build**

    Generate an optimised build for deployment on OpenShift. After running this task, the optimised build can be found in ./build.

*   **rebuild** (default task)

    Equivalent to `clean:build build`.

*   **less**

    *   *:build*

        Build all LESS style sheets.

*   **rebuildStyles**

    Equivalent to `clean:less less:build`.

*   **handlebars**

    *   *:build*

        Build all handlebars templates.

*   **rebuildTemplates**

    Equivalent to `clean:handlebars handlebars:build`.

*   **yuidoc**

    *   *:build*

        Build the documentation. After running this task, the documentation can be found in ./documentation.

*   **clean**

    *   *:build*

        Clean the build directory.

    *   *:less*

        Clean all build LESS style sheets.

    *   *:handlebars*

        Clean all build handlebars templates.

    *   *:yuidoc*

        Clean the documentation directory.

[logo]: https://raw.githubusercontent.com/Koekelas/trains-of-the-west/develop/screenshots/logo.png
[title screen]: https://raw.githubusercontent.com/Koekelas/trains-of-the-west/develop/screenshots/screenshot01-thumb.png
[terrain with tracks]: https://raw.githubusercontent.com/Koekelas/trains-of-the-west/develop/screenshots/screenshot02-thumb.png
[title screen full]: https://raw.githubusercontent.com/Koekelas/trains-of-the-west/develop/screenshots/screenshot01.png "Click for Full Resolution"
[terrain with tracks full]: https://raw.githubusercontent.com/Koekelas/trains-of-the-west/develop/screenshots/screenshot02.png "Click for Full Resolution"
[Node.js homepage]: http://nodejs.org/ "Node.js Homepage"
