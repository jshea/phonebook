var gulp           = require("gulp");
var del            = require("del");
var ngAnnotate     = require("gulp-ng-annotate");
var concat         = require("gulp-concat");
var uglify         = require("gulp-uglify");
var karma          = require("gulp-karma");
//var mainBowerFiles = require("main-bower-files");
var gulpFilter     = require("gulp-filter");
var concatCss      = require("gulp-concat-css");
var cssmin         = require("gulp-cssmin");
//var print          = require("gulp-print");


// All of our custom .js files
var htmlFiles = [
   "app/controllers/phonebook.js",  // This puts phonebook.js first in the concatenated and minified files?
   "app/controllers/*",
   "app/services/*",
   "app/directives/*",
   "app/lib/*"
];

// All of our custom .js files
var jsFiles = [
   "app/controllers/phonebook.js",  // This puts phonebook.js first in the concatenated and minified files?
   "app/controllers/*",
   "app/services/*",
   "app/directives/*",
   "app/lib/*"
];

// All of our custom .css files (includes Bootstrap extensions).
var cssFiles = ["app/css/*"];

// Clean out dest folder by deleting it
gulp.task("clean", function (cb) {
   del("app/dist/*", cb);
});

// Run our Karma unit tests.
gulp.task("test", function () {
   return gulp.src("./foo")   // Dummy folder. This is an open issue: https://github.com/lazd/gulp-karma/issues/9
      .pipe(karma({
         configFile: "app/tests/karma.conf.js", // Our Karma configuration.
         action: "run"                          // Run the test.
      }))
      .on("error", function (err) {
         throw err;
      });
});

// Annotate, concatenate, and minify all of our JavaScript files.
gulp.task("js", function () {
   return gulp.src(jsFiles)                     // Add our custom .js files to our Bower files.
      .pipe(gulpFilter("**/*.js"))              // Make sure we have just .js files.
      .pipe(ngAnnotate())                       // Annotate AngularJS files. Stops Dependency Injection from breaking due to minification.
      .pipe(concat("phonebook.min.js"))         // Concatenate all .js files.
      .pipe(uglify())                           // Minify all .js files.
      .pipe(gulp.dest("app/dist/js"));          // Put it next to "index.html".
});

// Concatenate and minify all of our CSS files.
gulp.task("css", function () {
   return gulp.src(cssFiles)                    // Add our custom .css files to our Bower files.
      .pipe(gulpFilter("**/*.css"))             // Make sure we have just .css files.
      .pipe(concatCss("phonebook.min.css"))     // Concatenate all .css files.
      .pipe(cssmin())                           // Minify all .css files.
      .pipe(gulp.dest("app/dist/css"));         // Put it with our other Bootstrap .css files.
});

// Copy fonts to our dist folder.
gulp.task("copy-fonts", function () {
   return gulp.src("app/fonts/*")               // Start with our Bootstrap fonts
      .pipe(gulp.dest("app/dist/fonts"));       // Copy the font files to our dist/fonts folder
});

// The default task (called when you run `gulp` from cli).
gulp.task("default", ["test", "clean", "js", "css", "copy-fonts"]);

// Build project without testing.
gulp.task("no-test", ["clean", "js", "css", "copy-fonts"]); //