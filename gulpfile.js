const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const include_file = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename'); // Додано відсутній модуль

// Шляхи до файлів
const paths = {
  src: {
    html: 'src/**/*.html', // Додано шлях для HTML
    scss: 'src/scss/styles.scss',
    js: 'src/js/**/*.js' // Додано шлях для JS
  },
  build: {
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/'
  }
};

// Обробка HTML
function html() {
  return gulp.src(paths.src.html)
    .pipe(include_file({
      prefix: "@@",
      basepath: "@file"
    }))
    .pipe(gulp.dest(paths.build.html))
    .pipe(browserSync.stream());
}

// Обробка JavaScript
function js() {
  return gulp.src(paths.src.js)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js))
    .pipe(browserSync.stream());
}

// Обробка SCSS/CSS
function css() {
  return gulp.src(paths.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('styles.min.css')) // Мініфікована версія
    .pipe(gulp.dest(paths.build.css))
    .pipe(browserSync.stream()); // Додано оновлення браузера
}

// Завдання для побудови без запуску сервера
function build() {
  return gulp.series(html, css, js);
}

// Спостереження за змінами
function watch() {
  browserSync.init({
    server: {
      baseDir: "./build",
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    port: 3000,
    open: false,
    notify: false
  });

  gulp.watch(paths.src.scss, css);
  gulp.watch(paths.src.html, html);
  gulp.watch(paths.src.js, js);
}

// Експорт завдань
exports.html = html;
exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = gulp.series(html, css, js, watch);