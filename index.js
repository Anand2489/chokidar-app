'use strict'
const debounce = require('debounce')
const {exec} = require('child_process')
const chokidar = require('chokidar')
const argv = require('yargs').argv
const chalk = require('chalk')
const ora = require('ora')
const cliSpinners = require('cli-spinners')

exports.start = function () {
  const spinner = ora({
    spinner: cliSpinners.shark,
    color: 'yellow'
  })

  const log = console.log
  const error = chalk.bold.red
  const green = chalk.green
  const red = chalk.red
  const orange = chalk.keyword('orange')
  const c1 = argv.c1 || 'make build'
  const postBuildCmd = argv.pb || ''

  function postWatch () {
    log(orange('Build: Started'))
    spinner.start()

    exec(c1, (err, stdout, stderr) => {
      spinner.stop()
      log(`stdout: ${stdout}`)
      log(`stderr: ${stderr}`)

      if (err) {
        log(error(`${c1} error:`, err))
        return
      }
      log(green('Build: Complete'))
      if (postBuildCmd) {
        log(orange(`Starting Cmd: ${postBuildCmd}`))
        spinner.start()

        exec(postBuildCmd, (err) => {
          spinner.stop()
          if (err) {
            log(error(`Cmd: ${postBuildCmd} failed due to - ${err}`))
            return
          }
          log(green(`Cmd successful: ${postBuildCmd}`))
        })
      }
    })
  }

  const debouncedPostWatch = debounce(postWatch, 2000)
  const watcher = chokidar.watch('./src')
  let isScanComplete = false

  watcher
    .on('ready', () => {
      log(green('Initial scan complete. Ready for changes'))
      isScanComplete = true
    })
    .on('add', path => {
      log(`File ${path} has been added`)
      if (isScanComplete) {
        debouncedPostWatch()
      }
    })
    .on('addDir', path => {
      log(`Directory ${path} has been added`)
      if (isScanComplete) {
        debouncedPostWatch()
      }
    })
    .on('change', path => {
      log(`File ${path} has been changed`)
      debouncedPostWatch()
    })
    .on('unlink', path => {
      log(red(`File ${path} has been removed`))
      debouncedPostWatch()
    })
    .on('unlinkDir', path => {
      log(red(`Directory ${path} has been removed`))
      debouncedPostWatch()
    })
    .on('error', err => {
      log(error(`Watcher error: ${err}`))
      debouncedPostWatch()
    })
}