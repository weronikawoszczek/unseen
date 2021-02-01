'use strict';

// Include gulp
var  gulp = require('gulp');

// Include plugins
var  concat = require('gulp-concat');
var  uglify = require('gulp-uglify');
var  rename = require('gulp-rename');
var  sass = require('gulp-sass');
var  connect = require('gulp-connect');
var  autoprefixer = require('gulp-autoprefixer');
var  csso = require('gulp-csso');
var  htmlPartial = require('gulp-html-partial');
var  babel = require('gulp-babel');


// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('./assets/js/**/*.js')
    // Minify the file
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(connect.reload())
});


// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./assets/scss/main.scss')
  // Compile SASS files
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(rename({suffix: '.min'}))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(connect.reload())
});

gulp.task('images', function () {
  return gulp.src('./assets/img/**/*')
    .pipe(gulp.dest('./dist/assets/img'));
});
gulp.task('fonts', function () {
  return gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('watch', function () {
  // Watch .js files
  gulp.watch('./assets/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('./assets/scss/**/*.scss', ['styles']);
  // Watch image files
  gulp.watch('./assets/img/**/*', ['images']);
  //Watch .html
  gulp.watch('./src/**/*', ['html']);
  connect.reload()
});

gulp.task('html', function () {
  gulp.src(['src/*.html'])
      .pipe(htmlPartial({
          basePath: 'src/partials/'
      }))
      .pipe(gulp.dest('./'))
      .pipe(connect.reload());
});

gulp.task('webserver', function () {
  connect.server({
    port: 7000,
    livereload: {
      port: 35728
    }
  });
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'scripts'
  );
});

// Default Task
gulp.task('default', ['webserver', 'scripts', 'styles', 'fonts','images', 'html', 'watch']);