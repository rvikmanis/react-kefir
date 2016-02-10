react-kefir
===========

Connect Kefir observables to React components

[![Test Coverage](https://codeclimate.com/github/rvikmanis/react-kefir/badges/coverage.svg)](https://codeclimate.com/github/rvikmanis/react-kefir/coverage)
[![Build Status](https://travis-ci.org/rvikmanis/react-kefir.svg?branch=master)](https://travis-ci.org/rvikmanis/react-kefir)

```
npm install --save react-kefir
```

### `createConnector(component: ReactComponent): ReactComponent`

Wraps component with a handler for observable props. Connector keeps track of observables' state, passing current values to the wrapped component.

#### Usage

```js
import { sequentially } from 'kefir'
import { createConnector } from 'react-kefir'
import { render } from 'react-dom'

function Counter({count, label}) {
  return <div>{label}: {count}</div>
}

Counter = createConnector(Counter)
let observableCount = sequentially(1000, [1,2,3,4,5]).toProperty(() => 0)

render(<Counter label="Count" count={observableCount} />, mountPoint)
```

###### Example

 * [View on JSFiddle](https://jsfiddle.net/rvikmanis/jzhcrxmz/)
