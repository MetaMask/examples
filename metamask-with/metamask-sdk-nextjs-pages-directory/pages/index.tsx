import { useListen } from '../hooks/useListen'
import { useMetaMask } from '../hooks/useMetaMask'
import styles from '../styles/Home.module.css'

export default function Home() {
  const {
    dispatch,
    state: { status, isMetaMaskInstalled, wallet, balance },
  } = useMetaMask()
  const listen = useListen()

  // we can use this to conditionally render the UI
  const showInstallMetaMask = status !== 'pageNotLoaded' && !isMetaMaskInstalled
  // we can use this to conditionally render the UI
  const showConnectButton =
    status !== 'pageNotLoaded' && isMetaMaskInstalled && !wallet

  // we can use this to conditionally render the UI
  const isConnected = status !== 'pageNotLoaded' && typeof wallet === 'string'

  // can be passed to an onclick handler
  const handleConnect = async () => {
    dispatch({ type: 'loading' })
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })
      dispatch({ type: 'connect', wallet: accounts[0], balance })

      // we can register an event listener for changes to the users wallet
      listen()
    }
  }

  // can be passed to an onclick handler
  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' })
  }
  return <div className={styles.container}></div>
}
