import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
// import notify from 'rollup-plugin-notify'
import replace from 'rollup-plugin-replace'
const fs = require('fs')
const path = require('path')

const srcPath = (path.resolve('./app')).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
const srcPathRegex = new RegExp(srcPath)
const ISDEV = process.env.NODE_ENV !== 'production'

// Load babelrc
const babelRC = JSON.parse(fs.readFileSync('./.babelrc', { encoding: 'UTF-8' }))
babelRC.babelrc = false // eslint-disable-line fp/no-mutation
babelRC.extensions = [".js", ".lsc"] // eslint-disable-line fp/no-mutation

// Locate LSC preset
const lscPreset = babelRC.presets.find(x => x[0] === "@lightscript")
if (!lscPreset) {
  throw new Error("Couldn't locate lightscript preset aborting build") // eslint-disable-line fp/no-throw
}
// Attempt to determine if a module is external and should not be rolled into
// the bundle. Check for presence in source path, presence of "." in module path,
// or special module paths.
function isExternal(modulePath) {
  // "babelHelpers" must be treated as internal or babel-plugin-external-helpers will break
  if(/babelHelpers/.test(modulePath)) return false

  // "." in module path = internal
  if(/\.\//.test(modulePath)) return false

  // Otherwise, attempt to figure out whether the module is inside the source tree.
  modulePath = path.resolve(modulePath) // eslint-disable-line
  return !(srcPathRegex.test(modulePath))
}

const getPlugins = () => [
  replace({
    ISDEV
  }),
  resolve({ extensions: babelRC.extensions }),
  babel(babelRC),
  // notify()
]

export default {
  input: 'app/server.lsc',
  plugins: getPlugins(),
  external: isExternal,
  output: {
    file: `app/server-compiled.js`,
    format: 'cjs',
    sourcemap: ISDEV ? 'inline': false
  }
}
