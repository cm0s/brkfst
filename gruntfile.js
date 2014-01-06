'use strict';

module.exports = function (grunt) {
  var files = {
    js: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js',
      '!test/coverage/**/*'],
    angular_js: ['public/angular/app/**/*.js', 'public/angular/common/**/*.js'],
    angular_tpl: ['public/angular/app/**/*.html', 'public/angular/common/**/*.html'],
    less: ['public/stylesheets/less/**/*.less'],
    jade: ['app/views/**'],
    css: ['public/css/**'],
    test: ['test/**/*.js', '!test/coverage/**/*']
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      all: {
        files: files.js
          .concat(files.angular_js)
          .concat(files.angular_tpl)
          .concat(files.less)
          .concat(files.jade)
          .concat(files.css),
        tasks: ['jshint', 'angular-dist', 'less'],
        options: {
          livereload: true
        }
      },
      test: {
        files: files.test.concat(files.js),
        tasks: 'test'
      }

    },

    jshint: {
      all: {
        src: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js',
          '!test/coverage/**/*'],
        options: {
          jshintrc: true
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          args: [],
          ignoredFiles: ['public/**', 'test/coverage/**/*'],
          watchedExtensions: ['js'],
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      default: {
        tasks: ['nodemon:dev', 'watch-all'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    mochacov: {
      coverage: {
        options: {
          coverage: true,
          reporter: 'html-cov',
          recursive: true,
          output: 'test/coverage/mocha/report.html'
        }
      },
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci',
            repoToken: 'fQciom8cbXfCtX4bu6C6jKvAGaPDvgahz'
          }
        }
      },
      test: {
        options: {
          reporter: 'spec',
          require: ['should', 'server.js']
        }
      },
      test_debug: {
        options: {
          reporter: 'spec',
          require: ['should', 'server.js'],
          'debug-brk': true
        }
      },
      options: {
        files: './test/mocha/**/*.js'
      }
    },

    fontello: {
      dist: {
        options: {
          config: 'public/fonts/fontello/config.json',
          fonts: 'public/fonts/fontello/fonts',
          styles: 'public/fonts/fontello/css',
          zip: 'public/fonts/fontello/',
          scss: true, //TODO replace option : will probably replace by saas option in next grunt-fontello release
          force: true
        }
      }
    },

    less: {
      dev: {
        files: {
          'public/stylesheets/css/bootstrap.css': 'public/stylesheets/less/bootstrap-ext/bootstrap.less',
          'public/stylesheets/css/main.css': 'public/stylesheets/less/main.less'
        }
      },
      prod: {
        options: {
          compress: true,
          cleancss: true
        },
        files: {
          'public/stylesheets/css/bootstrap.min.css': 'public/stylesheets/less/bootstrap-ext/bootstrap.less',
          'public/stylesheets/css/main.min.css': 'public/stylesheets/less/main.less'
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma/karma.conf.js'
      }
    },

    ngtemplates: {
      options: {
        standalone: true
      },
      app: {
        options: {
          module: 'templates',
          url: function (url) { //Strip base template path to have a smaller path which will still be unique
            return url.replace('public/angular/app/', '');
          }
        },
        src: 'public/angular/app/**/*.html',
        dest: 'public/angular/dist/temp/app-templates.js'
      },
      directives: {
        options: {
          module: 'templates',
          url: function (url) { //Strip base template path to have a smaller path which will still be unique
            return url.replace('public/angular/app/', '');
          }
        },
        src: 'public/angular/common/**/*.html',
        dest: 'public/angular/dist/temp/directives-templates.js'
      }
    },

    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      files: {
        src: ['public/angular/dist/temp/**/*-templates.js', 'public/angular/app/**/*.js'],
        dest: 'public/angular/dist/app.js'
      }
    },

    ngmin: {
      app: {
        src: ['public/angular/dist/app.js'],
        dest: 'public/angular/dist/temp/app.annotated.js'
      }
    },

    clean: {
      temp: ['public/angular/dist/temp/']
    },

    uglify: {
      angular: {
        options: {
          sourceMap: 'public/angular/dist/app.min.js.map',
          sourceMapPrefix: 2,
          sourceMappingURL: 'app.min.js.map'
        },
        files: {  //The app.min.js file must be copied to the app root path in order to
          'public/angular/dist/app.min.js': ['public/angular/dist/temp/app.annotated.js']
        }
      }
    },

    replace: {
      // As the uglify target doesn't set the file option value correctly in the sourcemap file it has to be
      // corrected. It uses the uglify.angular.files dest property which is a full path and we need only the
      // file name as a path.
      app_min_js_map_file_option: {
        options: {
          prefix: '',
          patterns: [
            {
              match: '"file":"public/angular/dist/app.min.js"',
              replacement: '"file":"app.min.js"'
            }
          ]
        },
        files: [
          {
            src: 'public/angular/dist/app.min.js.map',
            dest: 'public/angular/dist/app.min.js.map'
          }
        ]
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-fontello');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-replace');

  //Default task(s).
  grunt.registerTask('default', ['angular-dist', 'jshint', 'less', 'concurrent:default' ]);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochacov:test', 'mochacov:coverage']);

  //Test with debug enabled
  grunt.registerTask('test-debug', ['env:test', 'mochacov:test_debug', 'mochacov:coverage']);

  /* Generate javascript to put AngularJS templates into the $templateCache concatenate all js AngularJS files into one
   file, generate an uglify version of the concatenated file (AngularJS DI annotation are automatically transformed in
   order to be minifiable), and finally generate a sourcemap file. */
  grunt.registerTask('angular-dist', ['ngtemplates', 'concat_sourcemap', 'ngmin', 'uglify',
    'replace:app_min_js_map_file_option', 'clean']);

  //Watch tasks.
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('watch-all', ['watch:all']);
};