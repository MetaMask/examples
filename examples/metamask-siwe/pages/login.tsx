import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { utils } from 'ethers'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { generateNonce, SiweMessage } from 'siwe'
import { useRouter } from 'next/router'
import { sessionConfig } from '@/lib/session'
import { withIronSessionSsr } from 'iron-session/next'
import { ExplainerLayout } from '@/components/explainerLayout'
import Link from 'next/link'

type Props = { nonce: string }

export default function Login({ nonce }: Props) {
  const { push, pathname } = useRouter()
  // this will take care of fetching all the information we need to create a message and sign it
  const handleLogin = async () => {
    // check that MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask at https://metamask.io/download/')
      return
    }

    // request the user's account address
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    // narrow the type of accounts to an array of strings since we receive Maybe<unknown>
    const isAccountsReceived =
      Array.isArray(accounts) && typeof accounts[0] === 'string'

    // if the accounts are received, we extract the first account
    const address = isAccountsReceived ? utils.getAddress(accounts[0]) : ''

    console.log(address)

    if (!isAccountsReceived) {
      alert('Please connect to MetaMask')
      return
    }

    // request the user's chainId
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })

    // narrow the type of chainId to a string
    const isChainIdReceived = typeof chainId === 'string'

    // if chainId is not received, we can't proceed
    if (!isChainIdReceived) {
      alert('Please connect to the correct network')
      return
    }

    // create a new instance of the SiweMessage class
    const siweInstance = new SiweMessage({
      // this will let the user validate the domain they are logging in to
      domain: window.location.host,
      // this will let the user validate the origin they are logging in to
      uri: window.location.origin,
      address: address,
      statement: 'I am logging in to the SIWE demo',
      version: '1',
      chainId: Number(chainId),
      nonce,
    })

    // parse the message to a JSON string
    const message = siweInstance.prepareMessage()

    // submit the message to the user to sign
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    })

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ message, signature, address }),
    })
    const data = await res.json()

    if (data) {
      push('/')
    }
  }

  return (
    <ExplainerLayout
      title="MetaMask with SIWE"
      caption={
        <>
          The Sign In With Ethereum (SIWE) protocol allows users to sign in to a
          website using their Ethereum wallet. This example shows how to use the{' '}
          <a href="https://www.npmjs.com/package/siwe">SIWE</a> package to
          implement SIWE in a Next.js application.
        </>
      }
    >
      <style jsx>{`
        a {
          text-decoration-line: underline;
        }
      `}</style>
      <p>
        SIWE in this example is implemented with the help of{' '}
        <a href="https://github.com/vvo/iron-session">Iron Session</a> which
        allows us to store the user's address in a secure encrypted cookie. We
        only store the address in the cookie after prompting them for approval
        and verifying the authenticity of the signature.
      </p>

      <p>
        This allows us to created authenticated route. You can try it out by
        clicking the button below. Disconnecting will remove the cookie and
        redirect you to the login page.
      </p>

      <p>
        current route: {pathname}, try accessing the{' '}
        <Link href="/" style={{ color: 'blue' }}>
          Index Page
        </Link>, you will be prevented until you login.
      </p>
      <button onClick={handleLogin}>Login</button>
    </ExplainerLayout>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user

    // redirect to home if user is already logged in
    if (user?.address) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      }
    }

    const nonce = generateNonce()

    return {
      props: {
        nonce,
      },
    }
  },
  sessionConfig
)
