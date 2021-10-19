// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// this is our generic asyncReducer
// what are the parameters a reducer takes? state AND dispatch action
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// this is typescript?? why are we using this here??
function PokemonInfo({pokemonName}: {pokemonName: string}) {
  // here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!
  // function useAsync(asyncCallback, dependencies) {/* code in here */}

  function useAsync(asyncCallback, dependencies) {
    const [state, dispatch] = React.useReducer(asyncReducer, {
      status: pokemonName ? 'pending' : 'idle',
      data: null,
      error: null,
    })

    React.useEffect(() => {
      // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
      const promise = asyncCallback()
      if (!promise) {
        return
      }
      // then you can dispatch and handle the promise etc...
      if (!pokemonName) {
        return
      }
      dispatch({type: 'pending'})
      fetchPokemon(pokemonName).then(
        pokemon => {
          dispatch({type: 'resolved', pokemon})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
      // 🐨 you'll accept dependencies as an array and pass that here.
      // 🐨 because of limitations with ESLint, you'll need to ignore
      // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
    }, [asyncCallback])
    // what dependencies do we want to include in useCallback?
  }

  // here's how to use the new useAsync hook:
  const state = useAsync(() => {
    if (!pokemonName) {
      return
    }
    return fetchPokemon(pokemonName)
  }, [pokemonName])
  const {data, status, error} = state

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
