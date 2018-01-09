var gulp = require('gulp');
var bro = require('gulp-bro');
var smoosher = require('gulp-smoosher');
var babelify = require('babelify');


gulp.task('build', () => {
  gulp.src(['index.html'])
	.pipe(smoosher())
    .pipe(gulp.dest('dist'));
  gulp.src('index.js')
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ['es2015'] }),
        [ 'uglifyify', { global: true } ]
      ]
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['build']);

