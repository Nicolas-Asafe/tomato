import express, { Router } from 'express'
import chalk from 'chalk'
import fs from 'fs'
import { pathToFileURL } from 'url'
import path from 'path'

let actions = 0
const timestamp = () => `[${new Date().toLocaleTimeString()}]`

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
        actions++
        console.log(`${timestamp()} ${actions} - ${chalk.bgGreen(req.method)} ${chalk.bgYellow(req.url)} (${chalk.bgBlue(duration + "ms")})`)
      })
      next()
    })

    // Grupos de rotas
    groups.forEach(group => {
      this.#app.use(`/${group.name}`, group.router)
      actions++
      console.log(chalk.green(`${actions} - Grupo ${chalk.bgGreenBright("/" + group.name)} conectado com sucesso`))
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
      actions++
      console.log(chalk.red(`${actions} - Rota não encontrada: ${chalk.bgRed(req.method)} ${chalk.red(req.originalUrl)}`))
      res.status(404).send('Rota não existe.')
    })

    // Start Server
    this.#serverInstance = this.#app.listen(PORT, () => {
      actions++
      console.log(chalk.yellow(`${actions} - Servidor rodando na porta ${PORT}`))
    })
  }

  shutdown() {
    this.#serverInstance.close(() => {
      console.log(chalk.red(`Servidor desligado.`))
    })
  }
}

export class Group {
  #name
  #router

  constructor(name = 'api/v1') {
    this.#name = name
    this.#router = Router()
  }

  get name() {
    return this.#name
  }

  get router() {
    return this.#router
  }

  use(middleware) {
    this.#router.use(middleware)
  }

  newRoute({
    method = 'GET',
    path = '/',
    status = 200,
    responseJSON = null,
    responseTXT = null,
    middlewares = [],
    process = async (params, req, res) => {}
  }) {
    const methodLower = method.toLowerCase()
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(methodLower)) {
      throw new Error(`Método ${method} não suportado`)
    }

    this.#router[methodLower](path, ...middlewares, async (req, res) => {
      try {
        await process(req.params, req, res)
        if (!res.headersSent) {
          if (responseJSON !== null) {
            res.status(status).json(responseJSON)
          } else {
            res.status(status).send(responseTXT ?? 'OK')
          }
        }
      } catch (err) {
        console.error(chalk.red(`${timestamp()} - Erro na rota ${method.toUpperCase()} ${path}:`), err)
        if (!res.headersSent) res.status(500).send('- Erro interno -')
      }
    })

    actions++
    console.log(chalk.cyan(`${actions} - Rota ${chalk.bgGreen(method.toUpperCase())} ${chalk.bgBlue(path)} do grupo ${chalk.bgMagenta(this.#name)} criada com sucesso`))
  }

  async autoLoadRoutesFrom(folderPath) {
    const fullPath = path.resolve(folderPath)
    if (!fs.existsSync(fullPath)) {
      console.warn(chalk.red(`Pasta de rotas ${folderPath} não encontrada`))
      return
    }

    const files = fs.readdirSync(fullPath)
    for (const file of files) {
      const route = await import(pathToFileURL(path.join(fullPath, file)).href)
      if (route && typeof route.register === 'function') {
        route.register(this)
        actions++
        console.log(chalk.magenta(`${actions} - Rota autoload de ${file} registrada`))
      }
    }
  }
}
