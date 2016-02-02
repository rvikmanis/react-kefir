react-kefir
===========

Connect Kefir observables to React components

```
npm install --save react-kefir
```
```js
import { createConnector } from 'react-kefir'
```

##### `createConnector(component: ReactComponent): ReactComponent`

Wraps component with a handler for observable props. Connector keeps track of observables' state, passing current values to the wrapped component.

###### Example

```js
function Counter({count, label}) {
  return <div>{label}: {count}</div>
}
Counter = createConnector(Counter)

let observableCount = Kefir.sequentially(1000, [1,2,3,4,5]).toProperty(() => 0)
ReactDOM.render(<Counter label="Count" count={observableCount} />, mountPoint)
```
  >  [View on JSFiddle](https://jsfiddle.net/rvikmanis/jzhcrxmz/)
