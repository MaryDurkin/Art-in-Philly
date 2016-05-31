module.exports = function(grunt) {
//load plugins

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({

		cssmin:{
			target: {
				files: [{
					expand: true,
					cwd: 'src/',
					src:['**/*.css'],
					dest: 'dist',
					ext: '.css'
				}]
			}
		},
		htmlmin: {
			dist: {                                      // Target
	      		options: {                                 // Target options
		        	removeComments: true,
		        	collapseWhitespace: true
	      		},
		    	files: {                                   // Dictionary of files
			        'dist/index.html': 'src/index.html'     // 'destination': 'source'

		        }
    		}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target:{
				files: {
				'dist/js/app.js': ['src/js/app.js']
				}
			}
		}


	});

	grunt.registerTask('default', ['htmlmin']);
	grunt.registerTask('default', ['cssmin']);
	grunt.registerTask('default', ['uglify']);
}