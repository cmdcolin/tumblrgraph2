var gulp = require('gulp');
var gulp_uglify = require('gulp-uglify');
var gulp_rename = require('gulp-rename');
var gulp_concat = require('gulp-concat');
var gulp_browserify = require('gulp-browserify');

gulp.task('build', function() {
  gulp.src([
    'js/*.js'
  ]).pipe(gulp.dest('dist/js'))


  gulp.src([
    '*.html'
  ]).pipe(gulp.dest('dist'))


  gulp.src([
    'index.js'
  ]).pipe(gulp_browserify())
    .pipe(gulp_uglify())
    .pipe(gulp.dest('dist'));


  return 1
});



gulp.task('debug', function() {
  gulp.src([
    'js/*.js'
  ]).pipe(gulp.dest('dist/js'))


  gulp.src([
    '*.html'
  ]).pipe(gulp.dest('dist'))


  gulp.src([
    'index.js'
  ]).pipe(gulp_browserify())
    .pipe(gulp.dest('dist'));


  return 1
});

gulp.task('default', ['build']);
gulp.task('devmode', ['debug']);


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
