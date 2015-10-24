var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var path = require('path');
var browserify = require('browserify');
var vinylSource = require('vinyl-source-stream');
var glob = require('glob');
var vinylBuffer = require('vinyl-buffer');
var babelify = require('babelify');
var rimraf = require('rimraf');
var _ = require('lodash');
var sass = require('gulp-sass');

var globalNamespace = 'wagstrom';
var paths = {
  es6: ['src/**/*.js', 'src/modules/*.js'],
  es5: 'dist',
  sass: ['sass/**/*.scss'],
  sassDist: 'dist/css',
  sourceRoot: path.join(__dirname, 'src')
};

var onError = function (msg, err) {
  gutil.log(gutil.colors.bgWhite(gutil.colors.bold(gutil.colors.red(msg))),
    gutil.colors.reset(' '));
  gutil.log(err.stack);
  process.exit(1);
};

gulp.task('clean', function (cb) {
  rimraf(paths.es5, cb);
});

gulp.task('babel', function () {
  var filenames = _.unique(_.flatten(paths.es6.map(function (d) {
    return glob.sync(d);
  })));

  return browserify(filenames, {
    debug: process.env.NODE_ENV === 'development'
  })
  .transform(babelify)
  .on('error', function (err) {
    onError('Browserify error', err);
    this.emit('end');
  })
  .bundle()
  .on('error', function(err) {
    onError('Bundle error', err);
    this.emit('end');
  })
  .pipe(vinylSource('all.js'))
  .pipe(vinylBuffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('.',
     {sourceRoot: paths.sourceRoot}))
  .pipe(gulp.dest(paths.es5));
});

gulp.task('sass', function() {
  gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
    .pipe(gulp.dest(paths.sassDist));
});

gulp.task('watch', function () {
  gulp.watch(paths.es6, ['babel']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['babel', 'sass', 'watch'])
