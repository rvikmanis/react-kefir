global.expect = require('expect')
global.window = require('mock-browser').mocks.MockBrowser.createWindow()
global.document = window.document
global.navigator = window.navigator
