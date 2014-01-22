module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['src/**/*.js'],
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
          'www/js/<%= pkg.name %>.min.js': [ 'src/AppCtx.js', 'src/services/*.js', 'src/viewModel/ViewModel.js', 'src/viewModel/*.js', 'src/scripts/*.js', 'src/app.js'],
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
