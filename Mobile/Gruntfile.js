module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['www/**/*.js'],
      tasks: ['uglify']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: true,
        sourceMap: true,
        report: 'min',
      },
      build: {
        files: {
          'www/<%= pkg.name %>.min.js': [ 'www/AppCtx.js', 'www/services/*.js', 'www/viewModel/ViewModel.js', 'www/viewModel/*.js', 'www/scripts/*.js', 'www/app.js'],
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8001,
          base: 'www'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
//  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['uglify','watch']);

};
