import express, { Router } from 'express'
import chalk from 'chalk'


const timestamp = () => `[${new Date().toLocaleTimeString()}]`
export {timestamp}

export class Server {
  #app
  #serverInstance

  constructor({ PORT = 3000, groups = [], enableHealthCheck = true }) {
    this.#app = express()
    this.#app.use(express.json())

    // Middleware global
    this.#app.use((req, res, next) => {
      const start = Date.now()
      res.on('finish', () => {
        const duration = Date.now() - start
        console.log(`${timestamp()}- ${chalk.bgGreen(req.method)} ${chalk.bgYellow(req.url)} (${chalk.bgBlue(duration + "ms")})`)
      })
      next()
    })

    // Grupos de rotas
    groups.forEach(group => {
      this.#app.use(`/${group.name}`, group.router)
      console.log(chalk.green(`- Grupo ${chalk.bgGreenBright("/" + group.name)} conectado com sucesso`))
    })

    // Health check
    if (enableHealthCheck) {
      this.#app.get('/health', (_, res) => {
        res.status(200).json({ status: 'ok', uptime: process.uptime().toFixed(2) + 's' })
      })
    }

    // Rotas debug
    this.#app.get('/__debug/routes', (_, res) => {
      const routes = []
      this.#app._router.stack.forEach(middleware => {
        if (middleware.route) {
          routes.push({
            path: middleware.route.path,
            methods: middleware.route.methods
          })
        }
      })
      res.json(routes)
    })

    // 404 Handler
    this.#app.use((req, res) => {
      console.log(chalk.red(`- Rota não encontrada: ${chalk.bgRed(req.method)} ${chalk.red(req.originalUrl)}`))
      res.status(404).send('Rota não existe.')
    })

    // Start Server
    this.#serverInstance = this.#app.listen(PORT, () => {
      console.log(chalk.yellow(`- Servidor rodando na porta ${PORT}`))
    })
  }

  shutdown() {
    this.#serverInstance.close(() => {
      console.log(chalk.red(`Servidor desligado.`))
    })
  }
}