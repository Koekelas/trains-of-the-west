/*jslint node: true, plusplus: true*/

"use strict";

var config = function config(grunt) {

    var SOURCE_PATH = "source/",
        SOURCE_CLIENT_PATH = SOURCE_PATH + "client/",
        SOURCE_CLIENT_RESOURCES_PATH = SOURCE_CLIENT_PATH + "resources/",
        SOURCE_CLIENT_STYLES_PATH = SOURCE_CLIENT_RESOURCES_PATH + "styles/",
        SOURCE_CLIENT_TEMPLATES_PATH = SOURCE_CLIENT_RESOURCES_PATH + "templates/",
        SOURCE_SERVER_PATH = SOURCE_PATH + "server/",
        BUILD_PATH = "build/",
        BUILD_CLIENT_PATH = BUILD_PATH + "public/",
        BUILD_CLIENT_RESOURCES_PATH = BUILD_CLIENT_PATH + "resources/",
        BUILD_CLIENT_SPRITE_SHEETS_PATH = BUILD_CLIENT_RESOURCES_PATH + "images/spriteSheets/",
        BUILD_CLIENT_SCRIPTS_PATH = BUILD_CLIENT_RESOURCES_PATH + "scripts/",
        BUILD_CLIENT_CLIENT_PATH = BUILD_CLIENT_SCRIPTS_PATH + "client/",
        BUILD_CLIENT_LIBRARIES_PATH = BUILD_CLIENT_SCRIPTS_PATH + "libraries/",
        BUILD_CLIENT_STYLES_PATH = BUILD_CLIENT_RESOURCES_PATH + "styles/",
        BUILD_CLIENT_TEMPLATES_PATH = BUILD_CLIENT_RESOURCES_PATH + "templates/",
        BUILD_CLIENT_ROOT_PATH = BUILD_CLIENT_TEMPLATES_PATH + "nls/root/",
        BUILD_SERVER_PATH = BUILD_PATH,
        DOCUMENTATION_PATH = "documentation/",

        createCopyConfig = function createCopyConfig() {

            return {

                //private, part of the build task
                server: {

                    expand: true,
                    cwd: "<%= SOURCE_SERVER_PATH %>",
                    dot: true,
                    src: [ "**", "!.idea/**", "!node_modules/**", "!.gitignore" ],
                    dest: "<%= BUILD_SERVER_PATH %>"
                }
            };
        },

        createCleanConfig = function createCleanConfig() {

            return {

                options: {

                    "no-write": false //set to true to only simulate clean
                },

                //private, part of the build task
                temporaryBuildFiles: {

                    files: [

                        { src: "<%= BUILD_CLIENT_PATH %>build.txt" },
                        { src: "<%= BUILD_CLIENT_SPRITE_SHEETS_PATH %>*.js" },
                        { src: "<%= BUILD_CLIENT_CLIENT_PATH %>*", filter: "isDirectory" },
                        { src: "<%= BUILD_CLIENT_LIBRARIES_PATH %>" },
                        { src: [ "<%= BUILD_CLIENT_STYLES_PATH %>*.css", "!<%= BUILD_CLIENT_STYLES_PATH %>shared.css" ] },
                        { src: "<%= BUILD_CLIENT_TEMPLATES_PATH %>*.js" },
                        { src: "<%= BUILD_CLIENT_ROOT_PATH %>" }
                    ]
                },

                build: {

                    src: "<%= BUILD_PATH %>"
                },

                less: {

                    src: [ "<%= SOURCE_CLIENT_STYLES_PATH %>*.css", "!<%= SOURCE_CLIENT_STYLES_PATH %>reset.css" ]
                },

                handlebars: {

                    src: "<%= SOURCE_CLIENT_TEMPLATES_PATH %>*.js"
                },

                yuidoc: {

                    src: "<%= DOCUMENTATION_PATH %>"
                }
            };
        },

        createRequirejsConfig = function createRequirejsConfig() {

            return {

                //private, part of the build task
                build: {

                    options: {

                        appDir: "<%= SOURCE_CLIENT_PATH %>",
                        dir: "<%= BUILD_CLIENT_PATH %>",
                        fileExclusionRegExp: /^\.gitignore$|^\.idea$|^\.bowerrc$|^bower\.json$|^README\.md$|\.less$|\.hbs$/, //is matched against a file- or folder-name, not against a path
                        baseUrl: "resources/scripts/client/",

                        paths: {

                            sockjs: "empty:",
                            jquery: "empty:",
                            hammer: "empty:",
                            hammerJquery: "../libraries/jquery.hammer",
                            handlebars: "empty:",
                            i18n: "../libraries/bower/requirejs-i18n/i18n",
                            templates: "../../templates",
                            spriteSheets: "../../images/spriteSheets"
                        },

                        modules: [

                            {

                                name: "app"
                            }
                        ],

                        useStrict: true,

                        pragmas: {

                            clientRelease: true
                        },

                        optimize: "uglify", //uglify2 and iOS 5 don't like each other
                        optimizeCss: "standard.keepComments",

                        uglify: {

                            max_line_length: 32000
                        }
                    }
                }
            };
        },

        createLessConfig = function createLessConfig() {

            return {

                build: {

                    expand: true,
                    src: "<%= SOURCE_CLIENT_STYLES_PATH %>*.less",
                    dest: "",
                    ext: ".css"
                }
            };
        },

        createHandlebarsConfig = function createHandlebarsConfig() {

            return {

                build: {

                    expand: true,
                    src: "<%= SOURCE_CLIENT_TEMPLATES_PATH %>*.hbs",
                    dest: "",
                    ext: ".js",

                    options: {

                        amd: true,
                        namespace: false
                    }
                }
            };
        },

        createYuidocConfig = function createYuidocConfig() {

            return {

                build: {

                    name: "<%= PACKAGE.name %>",
                    version: "<%= PACKAGE.version %>",
                    description: "<%= PACKAGE.description %>",

                    options: {

                        paths: "<%= SOURCE_PATH %>",
                        outdir: "<%= DOCUMENTATION_PATH %>",
                        exclude: ".idea,libraries,node_modules", //is matched against a file- or folder-name, not against a path
                        linkNatives: true
                    }
                }
            };
        },

        createConfig = function createConfig() {

            return {

                PACKAGE: grunt.file.readJSON("package.json"),
                SOURCE_PATH: SOURCE_PATH,
                SOURCE_CLIENT_PATH: SOURCE_CLIENT_PATH,
                SOURCE_CLIENT_STYLES_PATH: SOURCE_CLIENT_STYLES_PATH,
                SOURCE_CLIENT_TEMPLATES_PATH: SOURCE_CLIENT_TEMPLATES_PATH,
                SOURCE_SERVER_PATH: SOURCE_SERVER_PATH,
                BUILD_PATH: BUILD_PATH,
                BUILD_CLIENT_PATH: BUILD_CLIENT_PATH,
                BUILD_CLIENT_SPRITE_SHEETS_PATH: BUILD_CLIENT_SPRITE_SHEETS_PATH,
                BUILD_CLIENT_CLIENT_PATH: BUILD_CLIENT_CLIENT_PATH,
                BUILD_CLIENT_LIBRARIES_PATH: BUILD_CLIENT_LIBRARIES_PATH,
                BUILD_CLIENT_STYLES_PATH: BUILD_CLIENT_STYLES_PATH,
                BUILD_CLIENT_TEMPLATES_PATH: BUILD_CLIENT_TEMPLATES_PATH,
                BUILD_CLIENT_ROOT_PATH: BUILD_CLIENT_ROOT_PATH,
                BUILD_SERVER_PATH: BUILD_SERVER_PATH,
                DOCUMENTATION_PATH: DOCUMENTATION_PATH,
                copy: createCopyConfig(),
                clean: createCleanConfig(),
                requirejs: createRequirejsConfig(),
                less: createLessConfig(),
                handlebars: createHandlebarsConfig(),
                yuidoc: createYuidocConfig()
            };
        },

        initialise = function initialise() {

            grunt.initConfig(createConfig());
            grunt.loadNpmTasks("grunt-contrib-copy");
            grunt.loadNpmTasks("grunt-contrib-clean");
            grunt.loadNpmTasks("grunt-contrib-requirejs");
            grunt.loadNpmTasks("grunt-contrib-less");
            grunt.loadNpmTasks("grunt-contrib-handlebars");
            grunt.loadNpmTasks("grunt-contrib-yuidoc");
            grunt.registerTask("rebuildStyles", [ "clean:less", "less:build" ]);
            grunt.registerTask("rebuildTemplates", [ "clean:handlebars", "handlebars:build" ]);
            grunt.registerTask("build", [

                "copy:server",
                "rebuildStyles",
                "rebuildTemplates",
                "requirejs:build",
                "clean:temporaryBuildFiles"
            ]);
            grunt.registerTask("rebuild", [ "clean:build", "build" ]);
            grunt.registerTask("default", [ "rebuild" ]);
        };

    initialise();
};

module.exports = config;
