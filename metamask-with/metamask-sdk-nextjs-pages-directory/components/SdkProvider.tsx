import { PropsWithChildren, useEffect } from 'react'
import { useListen } from '../hooks/useListen'
import { useMetaMask } from '../hooks/useMetaMask'
import { instantiateSdk } from '../lib/metamaskSDK'

export const SdkLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { dispatch } = useMetaMask()
  const listen = useListen()

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== 'undefined'
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask)

      const local = window.localStorage.getItem('metamaskState')

      // user was previously connected, start listening to MM
      if (local) {
        listen()
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null }

      instantiateSdk()
      dispatch({ type: 'pageLoaded', isMetaMaskInstalled, wallet, balance })
    }
  }, [])

  return <div>{children}</div>
}
