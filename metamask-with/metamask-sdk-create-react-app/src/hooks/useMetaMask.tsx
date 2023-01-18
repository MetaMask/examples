import React, { type PropsWithChildren } from 'react'

type ConnectAction = { type: 'connect'; wallet: string; balance: string }
type DisconnectAction = { type: 'disconnect' }
type PageLoadedAction = {
  type: 'pageLoaded'
  isMetaMaskInstalled: boolean
  wallet: string | null
  balance: string | null
}
type LoadingAction = { type: 'loading' }
type IdleAction = { type: 'idle' }

type Action =
  | ConnectAction
  | DisconnectAction
  | PageLoadedAction
  | LoadingAction
  | IdleAction

type Dispatch = (action: Action) => void

type Status = 'loading' | 'idle' | 'pageNotLoaded'

type State = {
  wallet: string | null
  isMetaMaskInstalled: boolean
  status: Status
  balance: string | null
}

const initialState: State = {
  wallet: null,
  isMetaMaskInstalled: false,
  status: 'loading',
  balance: null,
} as const

/**
 * It takes in a state and an action, and returns a new state
 * @param {State} state - State - the current state of the reducer
 * @param {Action} action - This is the action that is being dispatched.
 * @returns The state of the metamask reducer.
 */
function metamaskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect': {
      const { wallet, balance } = action
      const newState = { ...state, wallet, balance, status: 'idle' } as State
      const info = JSON.stringify(newState)
      window.localStorage.setItem('metamaskState', info)

      return newState
    }
    case 'disconnect': {
      window.localStorage.removeItem('metamaskState')
      if (typeof window.ethereum !== undefined) {
        window.ethereum.removeAllListeners('accountsChanged')
      }
      return { ...state, wallet: null, balance: null }
    }
    case 'pageLoaded': {
      const { isMetaMaskInstalled, balance, wallet } = action
      return { ...state, isMetaMaskInstalled, status: 'idle', wallet, balance }
    }
    case 'loading': {
      return { ...state, status: 'loading' }
    }
    case 'idle': {
      return { ...state, status: 'idle' }
    }

    default: {
      throw new Error('Unhandled action type')
    }
  }
}

/**
 * It creates a context object, and then returns a provider component that wraps the children and
 * provides the context value
 * @param {PropsWithChildren}  - PropsWithChildren<{}>
 */
const MetaMaskContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function MetaMaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(metamaskReducer, initialState)
  const value = { state, dispatch }

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  )
}

/**
 * It returns the value of the MetaMaskContext
 * @returns The context object.
 */
function useMetaMask() {
  const context = React.useContext(MetaMaskContext)
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider')
  }
  return context
}

export { MetaMaskProvider, useMetaMask }
