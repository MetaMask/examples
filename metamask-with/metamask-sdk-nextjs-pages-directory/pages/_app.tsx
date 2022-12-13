import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MetaMaskProvider } from '../hooks/useMetaMask'
import { SdkLayout } from '../components/SdkProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    // MM provider first since we want MetaMask instance to be available before we instantiate the SDK
    <MetaMaskProvider>
      <SdkLayout>
        <Component {...pageProps} />
      </SdkLayout>
    </MetaMaskProvider>
  )
}
