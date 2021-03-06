"use strict";

function* sendMessage(options) {
  function background(options) {
    browser.runtime.sendMessage("invalid-extension-id", {}, {}, result => {
      browser.test.assertEq(undefined, result, "Argument value");
      if (options.checkLastError) {
        let lastError = browser[options.checkLastError].lastError;
        browser.test.assertEq("Invalid extension ID",
                              lastError && lastError.message,
                              "lastError value");
      }
      browser.test.sendMessage("done");
    });
  }

  let extension = ExtensionTestUtils.loadExtension({
    background: `(${background})(${JSON.stringify(options)})`,
  });

  yield extension.startup();

  yield extension.awaitMessage("done");

  yield extension.unload();
}

add_task(function* testLastError() {
  // Not necessary in browser-chrome tests, but monitorConsole gripes
  // if we don't call it.
  SimpleTest.waitForExplicitFinish();

  // Check that we have no unexpected console messages when lastError is
  // checked.
  for (let api of ["extension", "runtime"]) {
    let waitForConsole = new Promise(resolve => {
      SimpleTest.monitorConsole(resolve, [{message: /Invalid extension ID/, forbid: true}]);
    });

    yield sendMessage({ checkLastError: api });

    SimpleTest.endMonitorConsole();
    yield waitForConsole;
  }

  // Check that we do have a console message when lastError is not checked.
  let waitForConsole = new Promise(resolve => {
    SimpleTest.monitorConsole(resolve, [{message: /Unchecked lastError value: Error: Invalid extension ID/}]);
  });

  yield sendMessage({});

  SimpleTest.endMonitorConsole();
  yield waitForConsole;
});
