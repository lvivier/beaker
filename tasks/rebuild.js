var gulp = require('gulp')
var path = require('path')
var run = require('./util-run')

//(cd app && npm rebuild --runtime=electron --target=4.0.0 --disturl=https://atom.io/download/atom-shell --build-from-source); gulp build

gulp.task('rebuild', gulp.series(function () {
  var { version } = require('../node_modules/electron/package.json')
  var cwd = path.join(process.cwd(), 'app')
  console.log(cwd)
  return new Promise(resolve => {
    run(`npm rebuild --runtime=electron --target=${version} --disturl=https://atom.io/download/atom-shell --build-from-source`, {cwd, shell: true}, function () {
      run(`npm run build`, {shell: true}, function () {
        resolve()
      })
    })
  })
}))