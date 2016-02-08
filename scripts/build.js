var rollup = require('rollup').rollup
var babel = require('rollup-plugin-babel')
var uglify = require('rollup-plugin-uglify')

function roll(plugins, bundlerOptions) {
  rollup({
    entry: 'src/index.js',
    plugins: plugins,
    external: ['react', 'kefir']
  })
  .then(function (bundle) {
    bundle.write(bundlerOptions)
  })
}

function umd(dest, sourceMap) {
  return {
    format: 'umd',
    moduleName: 'ReactKefir',
    dest: dest,
    globals: {
      react: 'React',
      kefir: 'Kefir'
    },
    sourceMap: !!sourceMap
  }
}

roll([ babel() ],
  umd('dist/react-kefir.js')
)

roll([ babel(), uglify() ],
  umd('dist/react-kefir.min.js', true)
)
