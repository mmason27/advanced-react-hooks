// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// here we're creating the context
const CountContext = React.createContext()
//note: you can pass in a default value for the context, but Kent Dodds does not recommend doing that

//now we're going to create a wrapper for our context, called CountProvider
function CountProvider(props) {
  // we'll go ahead and initialize the state of the count to 0
  const [count, setCount] = React.useState(0)
  // now we're going to go ahead and save the state of the count in a variable called value that we can pass into our provider, along with any other props
  const value = React.useState(0)
  return <CountContext.Provider value={value} {...props} />
}

function CountDisplay() {
  // here we're pulling the count from the context
  const [count] = React.useContext(CountContext)
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  //similarly, here we're pulling our setCount updater function from ourContext so we can update our state when the count is being incremented
  const [, setCount] = React.useContext(CountContext)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

// lastly, we've wrapped our counter components in the countProvider so that each component has access to our context, which we set up in our CountProvider functional component
function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
