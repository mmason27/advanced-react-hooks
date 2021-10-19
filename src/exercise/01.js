// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(count, step) {
  return count + step
  //previousCount is the current value of count aka the "state"
  //newCount is the value passed to changeCount aka the "new state"
}

function Counter({initialCount = 0, step = 1}) {
  const [count, changeCount] = React.useReducer(countReducer, initialCount)
  // the two arguments passed into useReducer are:
  // 1. the reducer function that accepts two arguments: the current state and the dispatch action state; and
  // 2. the initial state (here the initialCount)
  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
