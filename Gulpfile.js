var gulp          = require('gulp');
var del           = require('del');
var autoprefixer  = require('gulp-autoprefixer');
var sass          = require('gulp-sass');
var concat        = require('gulp-concat');
var cssmin        = require('gulp-cssmin');
var sourcemaps    = require('gulp-sourcemaps');
var uglify        = require('gulp-uglify');
var react         = require('gulp-react');
var watch         = require('gulp-watch');
var notify        = require('gulp-notify');
var plumber       = require('gulp-plumber');

var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: 'Gulp',
    message: "Error: <%= error.message %>"
  })
};

gulp.task('sass', function() {
  return gulp.src(['dev/styles/main.scss'])
    .pipe(plumber(plumberErrorHandler))
    // .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10'] }))
    // .pipe(cssmin())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('deploy/'));
});

gulp.task('javascript', function() {
  return gulp.src(['dev/scripts/vendor/*.js','dev/scripts/module-*.js','dev/scripts/init.js'])
    .pipe(plumber(plumberErrorHandler))
    // .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    // .pipe(uglify({ mangle: false }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('deploy/'));
});

gulp.task('react', function () {
  return gulp.src(['dev/scripts/**/*.jsx'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(react())
    .pipe(gulp.dest('dev/scripts/'));
});

gulp.task('kill', function() {
      del('deploy/**/*');
});

gulp.task('default', ['sass', 'react', 'javascript'], function() {
    gulp.watch(['dev/styles/**/*.scss'], ['sass']);
    gulp.watch(['dev/scripts/**/*.js'], ['javascript']);
    gulp.watch(['dev/scripts/**/*.jsx'], ['react']);
});
