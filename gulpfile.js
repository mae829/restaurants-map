var browserSync     = require('browser-sync').create(),
    gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    cleanCSS        = require('gulp-clean-css'),
    concat          = require('gulp-concat'),
    jshint          = require('gulp-jshint'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    util            = require('gulp-util');

var onError = function (err) {
    console.log('An error occurred:', err.message);
    this.emit('end');
};

gulp.task( 'css', function () {

    return gulp.src('css/sass/main.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());

});

gulp.task( 'js', function() {

    return gulp.src([
            'js/vendor/tabletop.min.js',
            'js/vendor/markerclusterer.js',
            'js/main.js'
        ])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('init.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({ stream: true }));

} );

gulp.task( 'browser-sync', function() {

    browserSync.init( {
        proxy: 'restaurants-map.loc/', // Your local environment site from XAMPP, VVV, or the like
        watchOptions: {
            debounceDelay: 2000 // Delay for events called in succession for the same file/event
        },
        tunnel: 'restmap', // For use if not on same wifi
        // online: false, // For when testing locally only
        open: false,
        // browser: ['firefox']
    } );

    gulp.watch( ['css/**/*.scss'], ['css'] );
    gulp.watch( ['js/*.js', '!js/*.min.js'], ['js'] );
    gulp.watch( '**/*.php' ).on('change', browserSync.reload );

 } );

gulp.task( 'default', ['browser-sync'] );
