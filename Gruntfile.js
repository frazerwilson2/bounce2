module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "babel": {
        options: {
          sourceMap: true
        },
        dist: {
          files: {
            "src/ball.js": "src/ball_raw.js"
          }
        }
      },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/ball.js',
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
      }
  });

  require('load-grunt-tasks')(grunt);

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['babel','uglify','sass','cssmin']);
};