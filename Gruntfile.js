module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['src/ball_raw.js'],
        options: {
                globals: {
                  phonon: true,
                  google: true,
                  fetch: true,
                  io: true,
                  Request: true
                },
                browser: true
              }
    },
    jasmine: {
      test: {
        src: 'public/build/ball.js',
        options: {
            specs: 'spec/ballspec.js'
        }
      }
    },
    "babel": {
        options: {
          sourceMap: true
        },
        dist: {
          files: {
            "public/build/ball.js": "src/ball_raw.js"
          }
        }
      },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/build/ball.js',
        dest: 'public/build/ball.min.js'
      }
    },
    sass: {
        options: {
          sourceMap: true
        },
        dist: {
          files: {
            'public/build/main.css': 'src/main.scss'
          }
        }
      },
      cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: 'public/build',
            src: ['*.css', '!*.min.css'],
            dest: 'public/build',
            ext: '.min.css'
          }]
        }
      },
      watch: {
        scripts: {
          files: ['src/main.scss','src/ball_raw.js'],
          tasks: ['sass','cssmin','babel'],
          options: {
            spawn: false,
          },
        },
      }
  });

  require('load-grunt-tasks')(grunt);

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['babel','sass','cssmin']);
};