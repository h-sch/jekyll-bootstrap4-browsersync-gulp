var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    notify      = require('gulp-notify'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    cp          = require('child_process'),
    jekyll      = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';


// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify('Building Jekyll');
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});


// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});


// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
        // port: 5000
    });
});


// Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
gulp.task('sass', function () {
    return gulp.src('_scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix(['last 2 versions']))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'))
        .pipe(notify({ message: 'Sass task complete' }));
});

// JS task
gulp.task('js', function() {
    return gulp.src('js/**/*.js')
    .pipe(gulp.dest('_site/js'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'JS task complete' }));
});

// Watch scss files for changes & recompile
// Watch html/md files, run jekyll & reload BrowserSync
gulp.task('watch', function () {
    gulp.watch('_scss/**/*.scss', ['sass']);
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*', '_includes/*.html'], ['jekyll-rebuild']);
});


// Default task, running just `gulp` will compile the sass,
// compile the jekyll site, launch BrowserSync & watch files.
gulp.task('default', ['browser-sync', 'watch']);
