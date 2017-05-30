module.exports = function (grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            basePath: './',
            jsTestPath: 'test/',
            jsSourcePath: 'src/js/',
            jsDistributionPath: 'dist/js/',
            imageSourcePath: 'src/images/',
            imageDistributionPath: 'dist/images/',
            fontSourcePath: 'src/fonts/',
            fontDistributionPath: 'dist/fonts/',
            cssSourceSassPath: 'src/scss/',
            cssSourcePath: 'src/css/',
            cssDistributionPath: 'dist/css/'
        },
        banner: '/*!\n' +
            ' * xPatterns Applications Visual Style Guide applied to Bootstrap 3 with SASS\n' +
            ' * Version <%= pkg.version %> built <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Based on enhancements to bootstrap-sass-twbs version 3.2.0+2\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> Atigeo LLC\n' +
            '*/\n',
        clean: {
            dist: {
                src: [
                    'src/css/*',
                    'src/scss/bootstrap/*',
                    'src/scss/bootstrap.scss',
                    'dist/css/*',
                    'dist/fonts/*',
                    'dist/images/*',
                    'dist/js/*'
                ]
            },
            build: {
                src: [
                    'bower_components/*',
                    'node_modules/*', '!node_modules/grunt/**', '!node_modules/grunt-contrib-clean/**',
                    'build/*'
                ]
            }
        },
        bump: {
            options: {
                files: [ 'package.json' ],
                updateConfigs: [],
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                createTag: false,
                commit: false,
                push: false
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: 'src/scss',
                    cssDir: 'src/css'
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>',
                report: true
            },
            dist: {
                files: {
                    '<%= meta.cssDistributionPath %>xui-bootstrap.min.css': [
                        '<%= meta.cssSourcePath %>bootstrap.css',
                        '<%= meta.cssSourcePath %>xUI.Bootstrap.sass.css'
                    ]
                }
            },
            bootstrap: {
                files: {
                    '<%= meta.cssDistributionPath %>bootstrap.min.css': [
                        '<%= meta.cssSourcePath %>bootstrap.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    '<%= meta.jsDistributionPath %>xui-bootstrap.min.js': [
                        '<%= meta.jsSourcePath %>xUI.Constants.Color.js'
                    ]
                }
            },
            bootstrap: {
                files: {
                    '<%= meta.jsDistributionPath %>bootstrap.min.js': [
                        '<%= meta.jsSourcePath %>bootstrap.js'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                banner: '<%= banner %>'
            },
            dist_css: {
                files: {
                    '<%= meta.cssDistributionPath %>xui-bootstrap.css': [
                        '<%= meta.cssSourcePath %>bootstrap.css',
                        '<%= meta.cssSourcePath %>xUI.Bootstrap.sass.css'
                    ]
                }
            },
            dist_js: {
                files: {
                    '<%= meta.jsDistributionPath %>bootstrap.js': [
                        '<%= meta.jsSourcePath %>bootstrap.js'
                    ],
                    '<%= meta.jsDistributionPath %>xui-bootstrap.js': [
                        '<%= meta.jsSourcePath %>xUI.Constants.Color.js'
                    ]
                }
            }
        },
        jshint: {
            files: [
                'Gruntfile.js', 'src/**/*.js', 'test/**/*.js'
            ],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        bowercopy: {
            options: {
                clean: false
            },
            setup_css: {
                /* To be copied before compass is run. */
                options: {
                    destPrefix: 'src'
                },
                src: 'bower_components/bootstrap-sass-twbs/assets/stylesheets/bootstrap/*',
                dest: 'scss/bootstrap'
            },
            setup_js: {
                /* To be copied before compass is run. */
                options: {
                    destPrefix: 'src'
                },
                src: 'bower_components/bootstrap-sass-twbs/assets/javascripts/bootstrap.js',
                dest: 'js'
            },
            setup2: {
                /* To be copied before compass is run. */
                options: {
                    destPrefix: 'src'
                },
                src: 'bower_components/bootstrap-sass-twbs/assets/stylesheets/_bootstrap.scss',
                dest: 'scss/bootstrap.scss'
            },
            deploy: {
                /* To be copied after compass is run. */
                options: {
                    destPrefix: 'dist',
                    srcPrefix: ''
                },
                files: {
                    'css': ['src/css/bootstrap.css'],
                    'fonts': ['bower_components/bootstrap-sass-twbs/assets/fonts/bootstrap/*', 'src/fonts/*'],
                    'images': 'src/images/*'
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    //grunt.registerTask('default', [ 'bump', 'compass', 'jshint', 'concat', 'uglify', 'bowercopy:deploy' ]);
    grunt.registerTask('setup', [ 'clean:dist', 'bowercopy:setup_css', 'bowercopy:setup_js', 'compass', 'cssmin', 'uglify', 'concat' ]);
    grunt.registerTask('watch', [ 'compass', 'cssmin', 'uglify', 'concat' ]);
    grunt.registerTask('check', [ 'jshint' ]);
    grunt.registerTask('deploy', [ 'compass', 'cssmin', 'uglify', 'concat', 'bowercopy:deploy' ]);
    grunt.registerTask('install', [
        'clean:dist',
        'bowercopy:setup_css',
        'bowercopy:setup_js',
        'bowercopy:setup2',
        'compass',
        'cssmin',
        'uglify',
        'concat',
        'bowercopy:deploy'
    ]);

};
