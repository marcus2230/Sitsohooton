var gulp = require('gulp');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require ('run-sequence')

gulp.task('sass', function(){
   gulp.src('./sass/**/*.scss')
    .pipe(sass({ includePaths : ['./sass/**/*.scss/'] }))
    .pipe(gulp.dest('./css'))
     .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('js/script.js', ['scripts']);
   gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('assets/*.html', browserSync.reload); 
  gulp.watch('assets/js/**/*.js', browserSync.reload); 
  
 });


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'assets'
    },
  })
})

gulp.task('useref', function(){
  return gulp.src('assets/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist/js/main.min.js'))
});


gulp.task('images', function(){
  return gulp.src('assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('assets/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

gulp.task('default', ['build', 'browserSync', 'sass', 'images', 'watch' , 'clean:dist' , 'fonts']);