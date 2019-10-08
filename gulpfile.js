
const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const sass = require('gulp-sass')

const browserSync = require('browser-sync').create()

// Compile pug files into HTML
function html() {
  return src('src/pug/*.pug')
    .pipe(pug())
    .pipe(dest('sharing'))
}

// Compile sass files into CSS
function styles() {
  return src('src/sass/styles.scss')
    .pipe(sass({
      includePaths: ['src/sass'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(dest('sharing/css'))
    .pipe(browserSync.stream())
}

// Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('sharing/'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'sharing',
  })

  watch('src/sass/**/*.scss', styles)
  watch('src/pug/*.pug', html)
  watch('src/assets/**/*', assets)
  watch('sharing/*.html').on('change', browserSync.reload)
}

exports.html = html
exports.styles = styles
exports.watch = watchAndServe
exports.default = series(html, styles, assets, watchAndServe)