module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
//    concat: {
//      options: {
//        stripBanners: true,
//      },
//      dist: {
//        src: [ 'www/AppCtx.js', 'www/services/*.js', 'www/viewModel/ViewModel.js', 'www/viewModel/*.js', 'www/scripts/*.js', 'www/app.js'],
//        dest: 'www/<%= pkg.name %>.js'
//      }
//    },
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

//    build: {
//      src: 'stage/<%= pkg.name %>.js',
//      dest: 'build/<%= pkg.name %>.min.js'
//    }
    }
  });

  // Load the plugin that provides the "uglify" task.
//  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
