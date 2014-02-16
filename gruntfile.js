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
    test: ['test/**/*.js', '!test/coverage/**/*'],
    locales: ['public/angular/locales/**/*.json']
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
          .concat(files.css)
          .concat(files.locales),
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
          nodeArgs: ['--debug=5859'],
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
          fonts: 'public/fonts/fontello/font',
          styles: 'public/fonts/fontello/css',
          zip: 'public/fonts/fontello/',
          scss: true, //TODO replace option : will probably replace by saas option in next grunt-fontello release
          force: true
        }
      }
    },

    less: {
      dev_bootstrap: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'public/stylesheets/css/bootstrap.css.map',
          //rootpath:
          sourceMapRootpath: 'http://localhost:3000'
        },
        files: {
          'public/stylesheets/css/bootstrap.css': 'public/stylesheets/less/bootstrap-ext/bootstrap.less'
        }
      },
      dev_main: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'public/stylesheets/css/main.css.map',
          sourceMapRootpath: 'http://localhost:3000'
        },
        files: {
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
          module: 'templates.app',
          url: function (url) { //Strip base template path to have a smaller path which will still be unique
            return url.replace('public/angular/app/', '');
          }
        },
        src: 'public/angular/app/**/*.html',
        dest: 'public/angular/dist/temp/app-templates.js'
      },
      directives: {
        options: {
          module: 'templates.directives',
          url: function (url) { //Strip base template path to have a smaller path which will still be unique
            return url.replace('public/angular/common/', '');
          }
        },
        src: 'public/angular/common/**/*.html',
        dest: 'public/angular/dist/temp/directives-templates.js'
      }
    },

    concat: {
      files: {
        src: ['public/angular/dist/temp/**/*-templates.js', 'public/angular/app/**/*.js',
          'public/angular/common/**/*.js'],
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
        files: {
          'public/angular/dist/app.min.js': ['public/angular/dist/temp/app.annotated.js']
        }
      }
    },

    shell: {
      load_mongodb_sample: {
        options: {
          stdout: true
        },
        command: 'mongo localhost/brkfst-dev test/mongodb/sample-data.js'
      }
    },

    file_append: {
      use_strict: {
        files: {
          'public/angular/dist/app.js': {
            prepend: '\'use strict\';\n \n',
            input: 'public/angular/dist/app.js'
          }
        }
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-file-append');

  //Default task(s).
  grunt.registerTask('default', ['angular-dist', 'jshint', 'less', 'nodemon:dev' ]);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochacov:test', 'mochacov:coverage']);

  //Test with debug enabled
  grunt.registerTask('test-debug', ['env:test', 'mochacov:test_debug', 'mochacov:coverage']);

  /* Generate javascript to put AngularJS templates into the $templateCache concatenate all js AngularJS files into one
   file, prepend the concatenated file with the 'use strict'; statment, generate an uglify version of the concatenated
   file (AngularJS DI annotation are automatically transformed in order to be minifiable), and finally generate a
   sourcemap file. */
  grunt.registerTask('angular-dist', ['ngtemplates', 'concat', 'file_append:use_strict', 'ngmin', 'uglify', 'clean']);

  //Load sample data into Mongodb dev db
  grunt.registerTask('mongo-sample', ['shell:load_mongodb_sample:']);

  //Watch tasks.
  grunt.registerTask('watch-test', ['watch:test']);
  grunt.registerTask('watch-all', ['watch:all']);
};