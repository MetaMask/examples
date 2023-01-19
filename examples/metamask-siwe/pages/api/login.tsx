import { NextApiHandler } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { SiweMessage } from 'siwe'
import { sessionConfig } from '@/lib/session'

//
const loginHandler: NextApiHandler =
  // we wrap the handler with the withIronSessionApiRoute, which will augment the request object with a session object
  withIronSessionApiRoute(async (req, res) => {
    // get the message and signature from the request body
    const { message, signature, address } = JSON.parse(req.body)

    // we recreate the message received from the user
    const sentMessage = new SiweMessage(message)
    try {
      // we validate the message and signature
      const validatedMessage = await sentMessage.validate(signature)

    //   // store the address and signature in the session
    //   req.session.address = validatedMessage.address
    //   req.session.signature = signature

    //   //encrypt to HTTP only cookie
      req.session.save()

      res.send(true)
    } catch (error) {
      console.log(error)
      res.send(false)
    }
  }, sessionConfig)

export default loginHandler
