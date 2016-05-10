var browserify = require('browserify');
var es         = require('event-stream');
var gulp       = require('gulp');
var buffer     = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var tap        = require('gulp-tap');
var uglify     = require('gulp-uglify');
var gutil      = require('gulp-util');
var source     = require('vinyl-source-stream');
var del        = require('del');

function getStream(list, bundles, dist) {
    dist = dist || './src/main/resources/dist';
    list = list || [];
    bundles = bundles || [];

    del([dist + '/**/*']);

    var streams = [];

    for (var i = 0; i < list.length; i++) {
        var src = list[i];
        var bundle = bundles[i];
        if (!bundle) bundle = src.replace('.js', '') + '.bundle.js';
        streams.push(browserify(src).bundle().pipe(source(bundle)).pipe(gulp.dest(dist)));
    }

    var minStream = gulp.src(list, {read: false})
        .pipe(tap(function (file) {
            gutil.log('bundling ' + file.path);
            file.contents = browserify(file.path, {debug: false}).bundle();
        }))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist));

    streams.push(minStream);

    return es.concat.apply(es, streams);
}

module.exports = getStream;