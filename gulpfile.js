var gulp = require('gulp');
var gulpTask = require('./gulptask');

gulp.task('default', function () {
    return gulpTask(['./core.js', './utils.js']);
});