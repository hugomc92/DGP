// Gruntfile.js
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// JS TASKS ================================================================
		// check all js files for errors
		jshint: {
			//options: { 'loopfunc': true },
			options: {'multistr': true},
			all: ['public/static/js/src/*.js', 'utils/*.js', 'controllers/*.js', 'models/*.js', 'service/*.js', '!public/static/js/src/common_f.js']
		},

		// take all the js files and minify them into app.min.js
		uglify: {
			build: {
				files: {
					'public/static/js/min/app.min.js': ['public/static/js/src/*.js', '!public/static/js/src/common_f.js']
				}
			}
		},

		// CSS TASKS ===============================================================
		// process the less file to style.css
		less: {
			build: {
				files: [{
					// backend
					expand: true,
					cwd: 'public/static/less/backend/',
					src: ['*.less'],
					dest: 'public/static/css/src/',
					ext: '.css'
				},
				{
					// frontend
					expand: true,
					cwd: 'public/static/less/frontend/',
					src: ['*.less'],
					dest: 'public/static/css/src/',
					ext: '.css'
				},
				{
					// common
					expand: true,
					cwd: 'public/static/less/',
					src: ['core_common.less'],
					dest: 'public/static/css/src/',
					ext: '.css'
				}]
			}
		},

		// take the processed style.css file and minify
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'public/static/css/src/',
					src: ['*.css'],
					dest: 'public/static/css/min/',
					ext: '.min.css'
				}]
			}
		},

		// COOL TASKS ==============================================================
		// watch css and js files and process the above tasks
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: ['public/static/less/**/*.less'],
				tasks: ['less', 'cssmin']
			},
			js: {
				files: ['public/static/js/src/*.js', '!public/static/js/src/common_f.js', '!public/static/js/backup/common_f.js'],
				tasks: ['jshint', 'uglify']
			},
			ejs: {
				files: ['public/templates/**/*.ejs']
			},
			logic: {
				files: ['models/*.js', 'controllers/*.js', 'service/*.js'],
				tasks: ['jshint']
			}
		},

		// watch our node server for changes
		// https://github.com/ChrisWren/grunt-nodemon
		nodemon: {
			dev: {
				script: 'main.js',
				options: {
					ignore: ['public/static/js/src/common_f.js', 'public/static/js/backup/common_f.js']
				}
			}
		},

		// run watch and nodemon at the same time
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['nodemon', 'watch']
		}
	});

	// load tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-crontab');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	// register all task when we run grunt
	grunt.registerTask('default', ['less', 'cssmin', 'jshint', 'uglify', 'concurrent']);
};