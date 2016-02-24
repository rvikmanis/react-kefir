react-kefir
===========

Connect Kefir observables to React components

[![Test Coverage](https://codeclimate.com/github/rvikmanis/react-kefir/badges/coverage.svg)](https://codeclimate.com/github/rvikmanis/react-kefir/coverage)
[![Build Status](https://travis-ci.org/rvikmanis/react-kefir.svg?branch=master)](https://travis-ci.org/rvikmanis/react-kefir)

```
npm install --save react-kefir
```

---

### *Connector(component: [ReactComponent](https://facebook.github.io/react/docs/top-level-api.html)): [ReactComponent](https://facebook.github.io/react/docs/top-level-api.html)*

This higher-order component automatically subscribes to observable props and keeps the wrapped component updated. That allows us to treat continuous values as effectively discrete.

```js
import { Connector } from 'react-kefir'
```

#### Usage

Given a component (`A`),

```js
let A = (props) => (<span>{props.v}</span>)
```

and an infinite stream of values (`S`),

```js
let _i = 0
let S = fromPoll(1000, () => ++_i).toProperty(() => 0)
```

> ```text
•---•--->---•---•--->
0   1  ...  n   n+1
```  


**apply connector, and render:**
```js
A = Connector(A)
render(<A v={S} />, document.body)
```

Now, sit back and observe the passage of time!

#### Example

 * [View on JSFiddle](https://jsfiddle.net/rvikmanis/jzhcrxmz/)
