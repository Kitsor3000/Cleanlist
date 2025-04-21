const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const include_file = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Шляхи до файлів
const paths = {
  src: {
    scss: 'src/scss/styles.scss' // Тільки головний файл
  },
  build: {
    css: 'build/css/'
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
    .pipe(concat('app.js')) // Тільки один JS файл
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js))
    .pipe(browserSync.stream());
}

// Обробка SCSS/CSS
function css() {
  return gulp.src(paths.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('styles.css')) // Чітко вказуємо ім'я файлу
    .pipe(gulp.dest(paths.build.css))
    
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

  gulp.watch('src/scss/**/*.scss', css);
  gulp.watch(paths.src.html, html);
  gulp.watch(paths.src.js, js);
}

// Основні задачі

exports.default = gulp.series(html, css, js, watch);