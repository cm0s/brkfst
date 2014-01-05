'use strict';

module.exports = function (grunt) {
  var files = {
    js: ['gruntfile.js', 'server.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js',
      '!test/coverage/**/*'],
    jade: ['app/views/**'],
    html: ['public/views/**'],
    css: ['public/css/**'],
    test: ['test/**/*.js', '!test/coverage/**/*']
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      jade: {
        files: files.jade,
        options: {
          livereload: true
        }
      },
      js: {
        files: files.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: files.html,
        options: {
          livereload: true
        }
      },
      css: {
        files: files.css,
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
        tasks: ['nodemon:dev', 'watch-dev'],
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
          config  : 'public/fonts/fontello/config.json',
          fonts   : 'public/fonts/fontello/fonts',
          styles  : 'public/fonts/fontello/css',
          zip: 'public/fonts/fontello/',
          scss    : true, //TODO replace option : will probably replace by saas option in next grunt-fontello release
          force   : true
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

  //Making grunt default to force in order not to break the project.

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent:default']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochacov:test', 'mochacov:coverage']);

  //Test with debug enabled
  grunt.registerTask('test-debug', ['env:test', 'mochacov:test_debug', 'mochacov:coverage']);

  //Watch tasks.
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('watch-dev', ['watch:jade', 'watch:js', 'watch:html', 'watch:css']);
};