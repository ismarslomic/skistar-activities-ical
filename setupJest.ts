import nock from 'nock'

global.waitForAsync = () => new Promise((resolve) => setImmediate(resolve))

// nock v15 patches Node's shared http internals on import, so undo it after each test file
afterAll(() => {
  nock.restore()
})
