import express from 'express'
import chalk from 'chalk'

const timestamp = () => `[${new Date().toLocaleTimeString()}]`
export { timestamp }

export class Server {
  #app
  #serverInstance

  constructor({ PORT = 3000, groups = [], enableHealthCheck = true }) {
    this.#app = express()
    this.#app.use(express.json())

    // Global Middleware
    this.#app.use((req, res, next) => {
      const start = Date.now()
      res.on('finish', () => {
        const duration = Date.now() - start
        console.log(`${timestamp()} - ${chalk.bgGreen(req.method)} ${chalk.bgYellow(req.url)} (${chalk.bgBlue(duration + "ms")})`)
      })
      next()
    })

    // Route Groups
    groups.forEach(group => {
      this.#app.use(`/${group.name}`, group.routes)
      console.log(chalk.green(`- Route group ${chalk.bgGreenBright("/" + group.name)} successfully connected`))
    })

    // Health Check
    if (enableHealthCheck) {
      this.#app.get('/health', (_, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime().toFixed(2) + 's' })
      })
    }

    // Debug Routes
    this.#app.get('/__debug/routes', (_, res) => {
  const routes = []

  if (!this.#app._router) return res.json(routes)

  this.#app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).map(m => m.toUpperCase())
      })
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods).map(m => m.toUpperCase())
          })
        }
      })
    }
  })

  res.json(routes)
})


    // 404 Handler
    this.#app.use((req, res) => {
      console.log(chalk.red(`- Route not found: ${chalk.bgRed(req.method)} ${chalk.red(req.originalUrl)}`))
      res.status(404).send('Route does not exist.')
    })

    // Start Server
    this.#serverInstance = this.#app.listen(PORT, () => {
      console.log(chalk.yellow(`- Server running on port ${PORT}`))
    })
  }

  shutdown() {
    this.#serverInstance.close(() => {
      console.log(chalk.red(`Server has been shut down.`))
    })
  }
}
