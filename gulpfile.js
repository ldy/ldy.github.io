var gulp = require('gulp'),
    uglify = require('gulp-uglify'), // 压缩js文件
    // sass = require('gulp-sass'), // 编译sass
    sass = require('gulp-sass')(require('sass')),
    cleanCSS = require('gulp-clean-css'), // 压缩css文件
    rename = require('gulp-rename'); // 文件重命名

gulp.task('scripts', function(done){
    gulp.src('dev/js/index.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/js'));
    done();
});

gulp.task('sass', function(done){
    gulp.src('dev/sass/app.scss')
        .pipe(sass())
        .pipe(gulp.dest('dev/sass'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/css'));
    done();
});

gulp.task('watch', function(){
    gulp.watch('dev/sass/*.scss', gulp.series(['sass']));
    gulp.watch('dev/js/*.js', gulp.series(['scripts']));
});

// gulp.task('default', ['scripts', 'sass', 'watch']);
gulp.task('default', gulp.series('scripts', 'sass', 'watch', function() {}));