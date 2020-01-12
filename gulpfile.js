var gulp = require("gulp");
var sass = require("gulp-sass");
let autoprefixer = require('gulp-autoprefixer');
let cssbeautify = require('gulp-cssbeautify');

gulp.task("compile", () => {
  return gulp.src("./scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest('./css/'));
});

gulp.task('autoprefix', function () {
  return gulp.src('./css/*.css')
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 version'],
          cascade: true
      }))
      .pipe(gulp.dest((file) => {
        return file.base;
      }));
});

gulp.task('beautify', function() {
  return gulp.src('./css/*.css')
      .pipe(cssbeautify())
      .pipe(gulp.dest('./css/'));
});

gulp.task("watch", () => {
  return gulp.watch("./scss/*.scss", gulp.series('compile', 'beautify'));
});

gulp.task("default", gulp.series('compile', 'beautify'));