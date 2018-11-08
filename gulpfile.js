var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var log = require('fancy-log');

function swallowError (error) {

  // If you want details of the error in the console
  log.error(error.toString())

  this.emit('end')
}

var fsass = function() {
	return gulp.src('./lib/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.on('error', swallowError)
	.pipe(gulp.dest(`./lib`));
}


gulp.task('sass', fsass);

gulp.task('watch', function() {
	return watch('./lib/**/*.scss', fsass);
});

gulp.task('build-js', function() {
	return gulp.src('./build/static/js/*.js')
	.pipe(rename('./public/build/static/js/main.js'))
	.on('error', swallowError)
	.pipe(gulp.dest(`.`));
});

gulp.task('build-map', function() {
	return gulp.src('./build/static/js/*.js.map')
	.pipe(rename('./public/build/static/js/main.js.map'))
	.on('error', swallowError)
	.pipe(gulp.dest(`.`));
});

gulp.task('build-js-uglify', function() {
	return gulp.src('./public/build/static/js/main.js')
	.pipe(rename('./public/build/static/js/main.min.js'))
	.on('error', swallowError)
	.pipe(uglify())
	.pipe(gulp.dest(`.`));
});

gulp.task('build-css', function() {
	return gulp.src('./build/static/css/*.css')
	.pipe(rename('./public/build/static/css/main.css'))
	.on('error', swallowError)
	.pipe(gulp.dest(`.`));
});

gulp.task('build-css-map', function() {
	return gulp.src('./build/static/css/*.css.map')
	.pipe(rename('./public/build/static/css/main.css.map'))
	.on('error', swallowError)
	.pipe(gulp.dest(`.`));
});

gulp.task('start-development', function() {
    return gulp.src(['environment.php'])
    .pipe(replace('production', 'development'))
    .pipe(gulp.dest('.'));
});

gulp.task('stop-development', function() {
    return gulp.src(['environment.php'])
    .pipe(replace('development', 'production'))
    .pipe(gulp.dest('.'));
});

gulp.task('build', gulp.series('build-js', gulp.series('build-map', gulp.series('build-css', 'build-css-map'))));