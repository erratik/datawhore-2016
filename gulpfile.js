/* jshint node:true */
/* global -$ */
'use strict';
// generated on 2015-05-29 using generator-gulp-angular-semantic-ui 0.5.0
var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var watchLess = require('gulp-watch-less'); 
var less = require('gulp-less');
var $ = require('gulp-load-plugins')();

gulp.task('styles', ['less'], function () {
  return gulp.src('app/styles/main.css')
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('less',function () {
    return gulp.src('app/styles/less/main.less')
        .pipe(watchLess('app/styles/main.less'))
        .pipe(less())
        .pipe(gulp.dest('app/styles/css'));
});

gulp.task('semantic', function () {
  return gulp.src('bower_components/semantic/dist/themes/**/**/**')
  .pipe(gulp.dest('dist/styles/themes'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles', 'semantic'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('webdriver', $.protractor.webdriver_standalone);

gulp.task('e2e', function () {
    gulp.src(['./tests/e2e/*.js'])
      .pipe($.protractor.protractor({
        configFile: 'tests/protractor.conf.js',
        args: ['--baseUrl', 'http://localhost:8080'],
        debug: false
      })) 
      .on('error', function(e) { throw e })
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['less', 'styles', 'fonts'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(8080)
    .on('listening', function () {   
      console.log('Started connect web server on http://localhost:9000    ');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});


// gulp.task('develop', function () {
//   nodemon({ script: 'server.js'
//           , ext: 'html js'
//           // , ignore: ['ignored.js']
//           // , tasks: ['watch'] 
//         })
//     .on('restart', function () {
//       console.log('restarted!')
//     })

//   //require('opn')('http://localhost:8080');
// })

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 7000;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'server.js',

    // watch core server file(s) that require server restart on change
    watch: ['server.js', '*.js', '*/*.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
      
      console.log('--------------------------------------------------------------------------------------------------');
      console.log('');
      console.log('                             listening on server.js on http://localhost/:         ');
      console.log('');
      console.log('');
      console.log('　　　　　　　　　　　　　　　　　　　　 ､');
      console.log('　　　　　　　　　　　　　　　　　 ｀ ‐､　ヽ　＿__ ＿__ ／　 　, -‐');
      console.log('　　　　　　　　　　　　　　　　ー- ､　,-\'"ヽ ､０ ,,　／ ｀‐､\'´＿＿');
      console.log('　　　　　　　　　　　　　　　　　　　,ｲ　,- \' ﾄ,　 ,-‐r ､ \'´　＼');
      console.log('　　　　　　　　　　　　　　　　　　/ /　ﾄ -\' ﾉ__ ト､_ﾉ　）　\',　 ヽ');
      console.log('　　　　　　　　　　　　　　, -‐ｰ/‐ i-　｀ "´､l_, ｀‐-‐\'´＿ i　　 ヽ');
      console.log('　　　　　　　　　　　　　　 , - /\'\'"/ \',二　　 \'\' 　　　 ｰ-､ ﾉ.l ｀ ‐､｀､');
      console.log('　　　　　　　　　　　　　 \'´　/, -/ ´ ゝ､　　　　　　　_, -\'､｀l‐､　　　\',');
      console.log('　　　　　　　＿＿＿　　 \'´/　 /,\' i /　 ｀　‐-　　　　　 ﾚリl l､ ヽ　　\',');
      console.log('　 _,､-‐\'"´　　　　　　 ｀ ノ　　/ｲﾉ l　　　　　　　　　　　　 ﾚ l＼ 　 　i');
      console.log('　三　　　　　　　　　　　　　 /＿ノ l　　　 l　　　 /　　　　　 l l　　　　 l＼＿＿');
      console.log('　　 ｀ ‐ ､＿　　　 　　　　 ／　, -\'´ l　　　 l　　 /　　　　,-‐\'　ヽ\'.,　　　　　　　　￣￣｀` ‐-､');
      console.log('　　　　　　　 ｀` ー--‐\'"´, -\'´　　　l\'"´　 \',-ノ｀‐- ､／i　　　　 \',ヽ　　　　　　　　　　　　 ミ');
      console.log('　　　　　　　　　　　　 ／　　｀ヽ ／　ヽ_）ﾉ )( （ （__ノ　　l　　　　ヽ＼　　　　　 ＿＿,-\'"´');
      console.log('　　　　　　　　　　　　｀「_r＿ ／　　　　　　　　　　　　　　l \'"´　　 \', ｀ ‐--ｰ\'"´');
      console.log('　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 l　　　　 l');
      console.log('　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　 ヽ､人.ノﾉ');
      console.log('');
      console.log('');
      console.log('');
      console.log('--------------------------------------------------------------------------------------------------');
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {

        browserSync.reload({
          stream: false   //
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // watch the following files; changes will be injected (css & images) or cause browser to refresh
    files: ['app/**/*.*'],

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:4000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 3000,

    // open the proxied app in chrome
    browser: ['google-chrome']
  });
});


gulp.task('watch', ['connect'], function () {
  $.livereload.listen();
  gulp.watch([
    'app/**/*.html',
    '.tmp/styles/**/*.css',
    'app/styles/**/*.less',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.less', ['less']);
  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean', 'browser-sync'], function () {
  gulp.start('build');
});
gulp.task('datawhore', ['browser-sync'], function () {
  gulp.start('build');
});
