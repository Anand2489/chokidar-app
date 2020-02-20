# Chokidar App
A utility package to listen for file changes & then run desired set of 2 commands one after the other.

## Installation
Preferabaly, install this package globally
- NPM - [Reference](https://docs.npmjs.com/downloading-and-installing-packages-globally)
```bash
npm install -g chokidar-app
```
- YARN - [Reference](https://classic.yarnpkg.com/en/docs/cli/global/)
```bash
yarn global add chokidar-app --prefix /usr/local
```
## API
Post installation, you can start this file watcher using
```bash
start-ca [c1] pb
```
It accepts 2 params
- `c1` - Optional

  1st command to run post file changes.

  Default: `make build`

- `pb`

  2nd command to run after 1st command is successful.

## Usage
- `start-ca --pb='cp -R lib ../np/node_modules/frost/'`
- `start-ca --c1='make test' --pb='cp -R lib ../np/node_modules/frost/'`

