module.exports = function(grunt) {
	grunt.initConfig({
		express : {
			server: {
				options: {
					livereload : false,
					port : 8888,
					script : 'app.js'
				}
			}
		},

		watch: {
			fest: {
				files: 'templates/*.xml',
				tasks: 'fest',
				options: {
					atBegin: true,
				}
			},

			sass: {
				files: ['public/css/dev/**/*.scss'],
				tasks: 'sass',
				options: {
					atBegin: true,
				}
			},

			css: { 
				files: ['public/css/dev/**/*.css'],
				tasks: ['concat:css_main', 'concat:css_joystick'],
				options: {
					livereload: true
				}
			},

			express: {
				files: [
					'routes/**/*.js',
					'app.js'
				],
				tasks: 'express',
				options: {
					spawn: false
				}
			},

			server: {
                files: [
                    'public/js/tmpl/*.js',
                    'public/css/*.css'
                ],
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
		},

		fest: {
			templates: { 
				files: [{ 
					expand: true, //enable other options
					cwd: 'templates',
					src: '*.xml',
					dest: 'public/js/tmpl'
				}],
				options: {
					template: function(data) {
						return grunt.template.process(
							'define(function() { return <%= contents %> ;});',
							{data : data}
						);
					}
				}
			}
		},

		requirejs: {
			build_main: {
				options: {
					almond: true,
					baseUrl: 'public/js',
					mainConfigFile: 'public/js/main.js',
					name: 'main',
					optimize: 'none',
					out: 'public/js/build/main.js'
				}
			},

			build_joystick: {
				options: {
					almond: true,
					baseUrl: 'public/js',
					mainConfigFile: 'public/js/main_joystick.js',
					name: 'main_joystick',
					optimize: 'none',
					out: 'public/js/build/joystick.js'
				}
			}			
		},

		uglify: {
			build_main: {
				files: {
					'public/js/main.min.js':['public/js/build_main.js'],
				}
			},

			build_joystick: {
				files: {
					'public/js/joystick.min.js':['public/js/build_joystick.js'],
				}
			}

		},

		sass: {
			main: {
				files: [{
					expand: true,
					cwd: 'public/css/dev/main',
					src: ['*.scss'],
					dest: 'public/css/dev/main',
					ext: '.css'
				}]
			},

			joystick: {
				files: [{
					expand: true,
					cwd: 'public/css/dev/joystick',
					src: ['*.scss'],
					dest: 'public/css/dev/joystick',
					ext: '.css'
				}]
			},

			main_compressed: {
				options: {
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: 'public/css/dev/main',
					src: ['*.scss'],
					dest: 'public/css/dev/main',
					ext: '.css'
				}]
			},

			joystick_compressed: {
				options: {
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: 'public/css/dev/joystick',
					src: ['*.scss'],
					dest: 'public/css/dev/joystick',
					ext: '.css'
				}]
			},
		},

		concat: { //js for game
			css_main: {
				src: ['public/css/dev/main/*.css'],
				dest: 'public/css/main.css'
			},

			css_joystick: {
				src: ['public/css/dev/joystick/*.css'],
				dest: 'public/css/joystick.css'
			},

			build_main: {
				separator: ';\n',
				src: ['public/js/lib/almond.js', 'public/js/build/main.js'],
				dest: 'public/js/build_main.js'
			},

			build_joystick: {
				separator: ';\n',
				src: ['public/js/lib/almond.js', 'public/js/build/joystick.js'],
				dest: 'public/js/build_joystick.js'
			}

		}
	});
	
	taskSassList = (process.env.NODE_ENV == 'production') ?
		['sass:main_compressed', 'sass:joystick_compressed']
			:
		['sass:main', 'sass:joystick']
	;
	
	taskBuildList = ['fest', 'requirejs', 'concat', 'uglify'];
	
	grunt.task.registerTask('build', taskSassList.concat(taskBuildList));
	grunt.task.registerTask('start', ['express', 'watch']);
	
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-fest');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
}