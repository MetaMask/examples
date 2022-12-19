import { ExplainerLayout } from '../components/Layout'
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
  return (
    <ExplainerLayout
      title="MetaMask SDK with Next.js"
      caption={
        <>
          The <a href="https://metamask.io/sdk/">MetaMask SDK provides</a> a
          sensible set of extra features on top of the regular{' '}
          <a href="https://metamask.github.io/api-playground/api-documentation/">
            MetaMask API
          </a>
        </>
      }
    >
      <style jsx>{`
        a {
          text-decoration-line: underline;
        }
      `}</style>
      <p>
        MetaMask provides an API that allows developers to build applications
        that can integrate with the MetaMask extension and interact with the
        Ethereum blockchain. While the browser is quite popular, it is a bit
        more difficult to use with the MetaMask mobile app. The MetaMask SDK
        provides a sensible set of extra features on top of the regular MetaMask
        API.
      </p>

      <h2>Installation</h2>
      <p>
        The MetaMask SDK is available as an npm package. You can install it with
        npm
      </p>
      <pre>
        <code>
          npm i @metamask/sdk
          <br />
          // or with yarn
          <br />
          yarn add @metamask/sdk
        </code>
      </pre>
      <p>
        Once installed, you can build your application like you normally would
        while using the <code>window.ethereum</code> provider. You will simply
        need to import and instanciate the SDK like shown at{' '}
        <code>lib/metamaskSDK.ts</code>:
        <pre>
          <code>
            {`
import MetaMaskSDK from "@metamask/sdk";

export const instantiateSdk = () => {
  if (typeof window === undefined) {
    return null;
  }

  new MetaMaskSDK();
};`}
          </code>
        </pre>
        This will augment the <code>window.ethereum</code> provider with the SDK
        and allow you to use the SDK API to interact with the MetaMask mobile
        app. If users are using the MetaMask extension, the SDK will simply use
        the regular API. Otherwise users will see a prompt to connect with a QR
        code to the MetaMask mobile app.
      </p>
    </ExplainerLayout>
  )
}
