var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');

gulp.task('build', function() {
  gulp.src([
    'js/*.js',
    'node_modules/cytoscape-arbor/arbor.js'
  ]).pipe(gulp.dest('dist/js'))


  gulp.src([
    '*.html'
  ]).pipe(gulp.dest('dist'))


  gulp.src([
    'index.js'
  ]).pipe(babel({
        presets: ['es2015'],
    }))
    .pipe(browserify())
    .pipe(uglify())
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
  ]).pipe(babel({
        presets: ['es2015'],
    }))
    .pipe(browserify())
    .pipe(gulp.dest('dist'));


  return 1
});

gulp.task('default', ['build']);
gulp.task('devmode', ['debug']);
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['default']);
  gulp.watch('index.js', ['default']);
});
gulp.task('watchdev', function() {
  gulp.watch('js/*.js', ['devmode']);
  gulp.watch('index.js', ['devmode']);
  gulp.watch('index.html', ['devmode']);
});


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
