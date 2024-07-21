const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function () {
  return gulp
    .src('src/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/style.css'));
});

gulp.task('watch', function () {
  gulp.watch('src/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series('sass', 'watch'));
