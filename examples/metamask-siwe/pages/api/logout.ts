import { NextApiHandler } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionConfig } from '@/lib/session'

//
const logoutHandler: NextApiHandler = withIronSessionApiRoute(
  async (req, res) => {
    req.session.destroy()
    res.send({ ok: true })
  },
  sessionConfig
)

export default logoutHandler
