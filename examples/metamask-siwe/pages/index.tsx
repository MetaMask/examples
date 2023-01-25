import Head from 'next/head'
import Image from 'next/image'
import { withIronSessionSsr } from 'iron-session/next'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { sessionConfig } from '@/lib/session'
import { ExplainerLayout } from '@/components/explainerLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { push, pathname } = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    })
    push('/')
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
        This allows us to created authenticated route like the one you are
        currently on. You can try it out by clicking the button below.
        Disconnecting will remove the cookie and redirect you to the login page.
      </p>
      <p>
        {' '}
        current route: {pathname}, try accessing the{' '}
        <Link href="/" style={{color: 'blue'}}>Login Page</Link>, you will be redirected until you logout
      </p>

      <button onClick={handleLogout}>Logout</button>
    </ExplainerLayout>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user

    // If the user is not logged in, redirect to the login page
    if (!user?.address) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      }
    }

    return {
      props: {
        user: req.session.user,
      },
    }
  },
  sessionConfig
)
