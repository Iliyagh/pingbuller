// core
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const del = require("del");
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
// style
const postcss = require('gulp-postcss');
const postcssReporter = require('postcss-reporter');
// const postcssBrowserReporter = require('postcss-browser-reporter');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
// const postcssImport = require("postcss-import")
// const postcssZIndex = require('postcss-zindex');
// const stripInlineComments = require('postcss-strip-inline-comments');
const syntax = require('postcss-scss'); // for "// comments"
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
// server
const browserSync = require('browser-sync').create();
// js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
// html
const fileInclude = require('gulp-file-include');
// img
const imagemin = require('gulp-imagemin');
// stats
const size = require('gulp-size');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";


gulp.task('clean', function() {
    return del('build');
});

// local server + livereload start

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'build',
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });

    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

// local server + livereload finish


// minify images start

gulp.task('imgmin', () => {
    return gulp.src('src/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('src/img'))
});

// minify images finish

// fonts start

gulp.task('fonts', function() {
    return gulp.src('src/style/fonts/**/*.*')
        .pipe(gulp.dest('build/style/fonts'))
        .pipe(size({
            title: 'fonts size ='
        }))
});

// fonts finish

// images start

gulp.task('assets', function() {
    return gulp.src('src/img/**', {
            since: gulp.lastRun('assets')
        })
        .pipe(gulp.dest('build/img'))
        .pipe(size({
            title: 'images size ='
        }))
});

// images finish

// html start

gulp.task('htmlbuild', function() {
    return gulp.src('src/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('build'))
        .pipe(size({
            title: 'html size ='
        }))
});

// html finish

// JavaScript start

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('build/js'))
        .pipe(size({
            title: 'js size ='
        }))
})

// JavaScript finish

// linter css start

gulp.task('lintcss', function() {
    var linter = [
        stylelint(),
        postcssReporter()
    ];
    return gulp.src('src/style/**/*.scss')
        .pipe(postcss(linter, {
            syntax: syntax // for "// comments"
        }))
});

// linter css finish

// style css start

gulp.task('css', function(done) {
    var post = [
        autoprefixer(),
        postcssFlexbugsFixes()
    ];
    return gulp.src('src/style/main.scss')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(post))
        .pipe(rename('main.min.css'))
        .pipe(cssnano({zindex: false}))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('build/style'))
        .pipe(size({
            title: 'styles size =',
        }))
});

// style css finish


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('css', 'assets', 'fonts', 'htmlbuild', 'js'),
    'lintcss'
));

// watch
gulp.task('watch', function() {
    gulp.watch('src/style/**/*.scss', gulp.series('css', 'lintcss'));

    gulp.watch('src/js/**/*.js', gulp.series('js'));

    gulp.watch('src/style/fonts/**/*.*', gulp.series('fonts'));

    gulp.watch('src/img/**/*.*', gulp.series('assets'));

    gulp.watch('src/**/*.html', gulp.series('htmlbuild'));

});

// development
gulp.task('default',
    gulp.series('build', gulp.parallel('watch', 'server'))
);
