// Test-only: make CSS/asset imports no-ops.
// Next's bundler handles `import './x.css'` side-effect imports, but the Node
// test runner (via tsx) tries to execute them as JS and throws. Register empty
// handlers so importing a component that pulls in CSS works under `npm run test`.
const noop = module => {
  module.exports = {}
}
for (const ext of ['.css', '.scss', '.sass', '.less']) {
  require.extensions[ext] = noop
}
