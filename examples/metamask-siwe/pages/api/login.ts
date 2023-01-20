import { NextApiHandler } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { SiweMessage } from 'siwe'
import { sessionConfig } from '@/lib/session'
import { utils } from 'ethers'

//
const loginHandler: NextApiHandler =
  // we wrap the handler with the withIronSessionApiRoute, which will augment the request object with a session object
  withIronSessionApiRoute(async (req, res) => {
    // get the message and signature from the request body
    const { message, signature } = JSON.parse(req.body)

    // we recreate the message received from the user
    const sentMessage = new SiweMessage(message)
    try {
      // we validate the message and signature
      const validatedMessage = await sentMessage.validate(signature)

      // extract the address after
      const signerAddress = await utils.verifyMessage(message, signature)
      
      if (signerAddress !== validatedMessage.address) {
        throw new Error('Invalid signature')
      }

      // store the address and signature in the session
      req.session.user = {
        address: validatedMessage.address,
        signature,
      }
      // encrypt to HTTP only cookie
      await req.session.save()

      return res.status(200).send(true)
    } catch (error) {
      console.log(error)
      return res.send(false)
    }
  }, sessionConfig)

export default loginHandler
