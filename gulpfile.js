/**
 * User: Quentin
 * Date: 30/09/2014
 */

var gulp = require('gulp');
var	sass = require('gulp-sass');
var	livereload = require('gulp-livereload');
var	concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');
var spritesmith = require('gulp.spritesmith');
var jade = require('gulp-jade');

var paths = {
	styles: {
		src: './src/scss/style.scss',
		toWatch: ['./src/scss/*.scss'],
		dest: './dist/css/',
		minFileName: 'style.min.css',
		maxFileName: 'style.max.css',
		output: './dist/css/*.css'
	},
	sprite: {
		src: './src/scss/assets/sprite/*.png',
		dest: './src/scss/imports/'
	},
	html: {
		src: ['./html/*.html'],
		toWatch: ['./dist/*.html']
	},
	scripts: {
		src: [
            './src/js/file-01.js'
//            ,'./js/file-02.js'
        ],
		dest: './dist/js/',
		minFileName: 'script.min.js',
		maxFileName: 'script.max.js'
	},
	scriptLoader: {
		src: './src/js/loader.js',
		dest: './dist/js/',
		minFileName: 'loader.min.js',
		maxFileName: 'loader.max.js'
	},
	jade: {
		src: './src/jade/pages/*.jade',
		dist: './dist/',
		srcWatch: './src/jade/**/*.jade',
		distWatch: './dist/*.html'
	}
};

gulp.task('sass', function () {

	var autoPrefixBrowsers=['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 8', 'ie 7'];

	// Min
	gulp.src(paths.styles.src)
		.pipe(sass({errLogToConsole: true}))
		.pipe(concat(paths.styles.minFileName))
		.pipe(postcss([
			autoprefixer({browsers:autoPrefixBrowsers})
			,csswring
		], {map: false}))
		.pipe(gulp.dest(paths.styles.dest));

	// Max
	gulp.src(paths.styles.src)
		.pipe(sass({errLogToConsole: true}))
		.pipe(concat(paths.styles.maxFileName))
		.pipe(postcss([
			autoprefixer({browsers:autoPrefixBrowsers})
		], {map: false}))
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.sprite.src).pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: 'image/sprite.png',
		cssName: '_sprite.scss',
		cssFormat: 'css',
		algorithm: 'binary-tree'
	}));
	spriteData.img.pipe(gulp.dest(paths.styles.dest+'image/'));
	spriteData.css.pipe(gulp.dest(paths.sprite.dest));
});

gulp.task('scripts', function() {

	// Min
	gulp.src(paths.scripts.src)
		.pipe(closureCompiler({
			compilerPath: './bower_components/closure-compiler/compiler.jar',
			fileName: paths.scripts.minFileName
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	// Max
	gulp.src(paths.scripts.src)
		.pipe(concat(paths.scripts.maxFileName))
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('script-loader', function() {

	// Min
	gulp.src(paths.scriptLoader.src)
		.pipe(closureCompiler({
			compilerPath: 'bower_components/closure-compiler/compiler.jar',
			fileName: paths.scriptLoader.minFileName
		}))
		.pipe(gulp.dest(paths.scriptLoader.dest));

	// Max
	gulp.src(paths.scriptLoader.src)
		.pipe(concat(paths.scriptLoader.maxFileName))
		.pipe(gulp.dest(paths.scriptLoader.dest));
});

gulp.task('jade', function () {
	gulp.src(paths.jade.src)
		.pipe(jade(/*{pretty:true}*/))
		.pipe(gulp.dest(paths.jade.dist));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    livereload.listen();

	gulp.watch(paths.styles.toWatch, ['sass']);
	gulp.watch(paths.sprite.src, ['sprite']);
	gulp.watch(paths.scripts.src, ['scripts']);
	gulp.watch(paths.jade.srcWatch, ['jade']);

	gulp.watch(paths.jade.distWatch).on('change', livereload.changed);
	gulp.watch(paths.styles.output).on('change', livereload.changed);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['sass', 'scripts', 'watch']);
gulp.task('styles', ['sprite', 'sass']);
