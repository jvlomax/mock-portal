var gulp = require('gulp');
var args   = require('yargs').argv;
var gulpif = require('gulp-if');
var sass = require('gulp-ruby-sass');
var nodesass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var fs = require('fs');
var lr = require('tiny-lr');
var server = lr();

var fastSass = args.fast === true;

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    gulp.src('./sass/*.scss')
        .pipe(gulpif(!fastSass, sass({
            sourcemap: true,
            precision: 10
        }).on('error', handleError)))
        .pipe(gulpif(fastSass, nodesass({ errLogToConsole: true })))
        .pipe(prefix("last 1 version", "> 1%", "ie >= 10"))
        .pipe(minifycss())
        .pipe(gulp.dest('./css'))
        .pipe(livereload(server));
});

gulp.task('watch', ['styles'], function() {
    server.listen(35729, function (err) {
        if (err) {
            throw err;
        }
    });

    gulp.watch('./sass/**/*.scss', function(file){
        gulp.run('styles');
    });

    gulp.watch('./js/**/*.js', function(file){
        gulp.src(file.path)
            .pipe(livereload(server));
    });

    gulp.watch('./img/**/*', function(file){
        gulp.src(file.path)
            .pipe(livereload(server));
    });

    gulp.watch('./**/*.html', function(file){
        gulp.src(file.path)
            .pipe(livereload(server));
    });
});
