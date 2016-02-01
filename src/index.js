import { Component, createElement } from 'react'
import { Observable } from 'kefir'

function isObservable(object) {
  return object instanceof Observable
}

function filterObject(object, predicate) {
  let clone = {}
  for (let k in object) if (object.hasOwnProperty(k) && predicate(object[k], k, object)) {
    clone[k] = object[k]
  }
  return clone
}

function addUpdater(self, key) {
  self.observables[key].onValue(self.updaters[key] = value => {
    self.setState({[key]: value})
  })
}

function removeUpdater(self, key) {
  self.observables[key].offValue(self.updaters[key])
  delete self.updaters[key]
}

function removeObservable(self, key) {
  removeUpdater(self, key)
  delete self.observables[key]
}

export function createConnector(component) {

  function Connector_(props, context) {
    Component.call(this, props, context);

    this.observables = {}
    this.updaters = {}
    this.state = {}
  }

  Connector_.prototype = Object.create(Component.prototype)
  Connector_.prototype.constructor = Connector_

  Connector_.prototype.componentWillMount = function componentWillMount() {
    let state = {}

    for (let k in this.props) {
      let prop = this.props[k]

      if (!isObservable(prop)) {
        state[k] = prop
      }
      else {
        this.observables[k] = prop
      }
    }

    this.setState(state)

    for (let k in this.observables) {
      addUpdater(this, k)
    }
  }

  Connector_.prototype.componentWillUnmount = function componentWillUnmount() {
    for (let k in this.updaters) {
      removeObservable(this, k)
    }
  }

  Connector_.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    let state = {}

    let newProps = filterObject(nextProps, (_, k) =>
      !this.props.hasOwnProperty(k)
    )

    let keys = Object.keys(this.props)
    keys = keys.concat(Object.keys(newProps))

    for (let i = 0, ii = keys.length; i < ii; i++) {
      let k = keys[i]
      let prop = this.props[k]
      let nextProp = nextProps[k]
      let isObs = isObservable(prop)
      let isObsNext = isObservable(nextProp)
      let isNew = prop === void 0
      let isRemoved = nextProp === void 0
      let isChanged = !isNew && !isRemoved && nextProp !== prop

      if (!isObs && !isObsNext) {
        state[k] = nextProp
      }

      if (isObs && isObsNext) {
        if (isChanged) {
          removeUpdater(this, k)
          this.observables[k] = nextProp
        }
      }

      if (isObs && !isObsNext) {
        removeObservable(this, k)
        state[k] = nextProp
      }

      if (!isObs && isObsNext) {
        this.observables[k] = nextProp
      }
    }

    this.setState(state)

    let pendingObservables = filterObject(this.observables, (_, k) =>
      !this.updaters.hasOwnProperty(k)
    )

    for (let k in pendingObservables) {
      addUpdater(this, k)
    }
  }

  Connector_.prototype.render = function render() {
    return createElement(
      component,
      this.state
    )
  }

  return Connector_

}
