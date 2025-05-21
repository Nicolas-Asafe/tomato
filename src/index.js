import express, { Router } from 'express'
import chalk from 'chalk'

let actions = 0

export class Server {
  #app

  constructor({ PORT = 3000, groups = [] }) {
    this.#app = express()
    this.#app.use(express.json())

    // Middleware de log e tempo de resposta
    this.#app.use((req, res, next) => {
      const start = Date.now()
      res.on('finish', () => {
        const duration = Date.now() - start
        actions++
        console.log(`
  ${actions} - ${chalk.bgGreen(req.method)} ${chalk.bgYellow(req.url)} (resposta demorou ${chalk.bgBlue(duration + "ms")}) -
        `)
      })
      next()
    })

    groups.forEach(group => {
      this.#app.use(`/${group.name}`, group.router)
      actions++
      console.log(chalk.green(`${actions} - O grupo ${chalk.bgGreenBright("/" + group.name)} foi conectado com sucesso -`))
    })

    // Middleware final: rota não encontrada
    this.#app.use((req, res) => {
      actions++
      console.log(chalk.red(`${actions} - Rota não encontrada: ${chalk.bgRed(req.method)} ${chalk.red(req.originalUrl)} -`))
      res.status(404).send('Rota não existe.')
    })

    this.#app.listen(PORT, () => {
      actions++
      console.log(chalk.yellow(`${actions} - Servidor rodando na porta ${PORT} -\n\n           ==RESPOSTAS==\n`))
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

  newRoute({
    method = 'GET',
    path = '/',
    status = 200,
    responseJSON = null,
    responseTXT = null,
    process = async (params, req, res) => { }
  }) {
    const methodLower = method.toLowerCase()
    if (!['get', 'post', 'put', 'delete'].includes(methodLower)) {
      throw new Error(`Método ${method} não suportado`)
    }

    this.#router[methodLower](path, async (req, res) => {
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
        console.error(chalk.red(`- Erro na rota ${method.toUpperCase()} ${path}:`), err)
        if (!res.headersSent) res.status(500).send('- Erro interno -')
      }
    })

    actions++
    console.log(chalk.cyan(`${actions} - Rota ${chalk.bgGreen(method.toUpperCase())} ${chalk.bgBlue(path)} do grupo ${chalk.bgMagenta(this.#name)} criada com sucesso -\n`))
  }
}
