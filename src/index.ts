import { Client } from './driver/mysql'

type Environment = {
  TUNNEL_HOST: string
  CF_CLIENT_ID: string
  CF_CLIENT_SECRET: string
}

export default {
  async fetch(request: Request, env: Environment, ctx: ExecutionContext) {
    try {
      // Configure the database client and create a connection.
      const mysql = new Client()
      const mysqlClient = await mysql.connect({
        username: 'user',
        db: 'appdb',
        // hostname is the full URL to your pre-created Cloudflare Tunnel, see documentation here:
        // https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/create-tunnel
        hostname: env.TUNNEL_HOST || 'https://dev.example.com',
        password: 'password', // use a secret to store passwords
        cfClientId: env.CF_CLIENT_ID || undefined,
        cfClientSecret: env.CF_CLIENT_SECRET || undefined,
      })

      // Query the database.
      const param = 42
      const result = await mysqlClient.query('SELECT ?;', [param])

      // Return result from database.
      return new Response(JSON.stringify({ result }))
    } catch (e) {
      return new Response((e as Error).message)
    }
  },
}
