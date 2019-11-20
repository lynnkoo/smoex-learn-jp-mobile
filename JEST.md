`@ctrip/crn HeaderView`
```js
TypeError: instance.render is not a function

      at finishClassComponent (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:7693:31)
      at updateClassComponent (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:7648:24)
      at beginWork$1 (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:9159:16)
      at performUnitOfWork (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:12981:12)
      at workLoopSync (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:12955:22)
      at renderRoot (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:12648:11)
      at runRootCallback (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:12420:20)
      at node_modules/react-test-renderer/cjs/react-test-renderer.development.js:1935:24
      at unstable_runWithPriority (node_modules/scheduler/cjs/scheduler.development.js:643:12)
      at runWithPriority (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:1887:10)

  console.error node_modules/react-test-renderer/cjs/react-test-renderer.development.js:104
    Warning: Component(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.
```