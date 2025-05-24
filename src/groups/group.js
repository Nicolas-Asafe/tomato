import fs from 'fs'
import { pathToFileURL } from 'url'
import path from 'path'
import { Router } from 'express'
import chalk from 'chalk'
import { timestamp } from '../server/server.js'


export class Grupo {
  #name
  #router

  constructor(name = 'api/v1') {
    this.#name = name
    this.#router = Router()
  }

  get name() {
    return this.#name
  }

  get rotas() {
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

    console.log(chalk.cyan(`- Rota ${chalk.bgGreen(method.toUpperCase())} ${chalk.bgBlue(path)} do grupo ${chalk.bgMagenta(this.#name)} criada com sucesso`))
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
        console.log(chalk.magenta(`- Rota autoload de ${file} registrada`))
      }
    }
  }
}