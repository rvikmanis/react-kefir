import Kefir from 'kefir'
import ReactDOM from 'react-dom'
import React from 'react'

import { createConnector } from '../../src/index'


describe("Connector", function () {

  let mountPoint

  function TextLabel(props) {
    return React.createElement("div", {
      id: "text-label",
      children: `${props.number}: ${props.text}`
    })
  }
  TextLabel.defaultProps = {text: "Foo", number: 1}

  function getRenderedText() {
    return document.querySelector("#text-label").textContent
  }

  function mountWithProps(props = null) {
    ReactDOM.render(React.createElement(TextLabel, props), mountPoint)
  }

  function unmount() {
    ReactDOM.unmountComponentAtNode(mountPoint)
  }

  before(() => {
    TextLabel = createConnector(TextLabel)
  })

  beforeEach(() => {
    mountPoint = document.createElement("div")
    document.body.appendChild(mountPoint)
  })

  afterEach(() => {
    document.body.removeChild(mountPoint)
  })

  it("should handle value updates and prop changes", function (done) {
    this.slow(1000)
    
    let never = Kefir.never()
    mountWithProps({text: never, number: 99})
    expect(getRenderedText()).toBe("99: Foo")

    mountWithProps({text: never})
    expect(getRenderedText()).toBe("1: Foo")

    mountWithProps({text: 1024})
    expect(getRenderedText()).toBe("1: 1024")

    mountWithProps({text: Kefir.sequentially(20, ["Foobar", "Bar", "Baz", 1, 2, 3, 4, 5, 6, 7])})
    expect(getRenderedText()).toBe("1: 1024")

    setTimeout(() => {
      expect(getRenderedText()).toBe("1: Foobar")

      setTimeout(() => {
        expect(getRenderedText()).toBe("1: Bar")

        setTimeout(() => {
          expect(getRenderedText()).toBe("1: Baz")

          setTimeout(() => {
            expect(getRenderedText()).toBe("1: 1")

            setTimeout(() => {
              expect(getRenderedText()).toBe("1: 2")

              mountWithProps({text: "Hello World"})
              expect(getRenderedText()).toBe("1: Hello World")

              mountWithProps({number: Kefir.constant(6), text: Kefir.later(50, 42)})
              expect(getRenderedText()).toBe("6: Hello World")

              setTimeout(() => {
                expect(getRenderedText()).toBe("6: 42")

                mountWithProps({number: 90, text: Kefir.constant(900)})
                expect(getRenderedText()).toBe("90: 900")

                mountWithProps({number: Kefir.constant(4)})
                expect(getRenderedText()).toBe("4: Foo")

                unmount()
                done()
              }, 50)

            }, 20)
          }, 20)
        }, 20)
      }, 20)
    }, 20)
  })

})
