import fs from 'fs'
import { pathToFileURL } from 'url'
import path from 'path'
import { Router } from 'express'
import chalk from 'chalk'
import { timestamp } from '../server/server.js'

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

  get routes() {
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
      throw new Error(`Method ${method} is not supported`)
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
        console.error(chalk.red(`${timestamp()} - Error in route ${method.toUpperCase()} ${path}:`), err)
        if (!res.headersSent) res.status(500).send('Internal Server Error')
      }
    })

    console.log(chalk.cyan(`- Route ${chalk.bgGreen(method.toUpperCase())} ${chalk.bgBlue(path)} in group ${chalk.bgMagenta(this.#name)} created successfully`))
  }

  async autoLoadRoutesFrom(folderPath) {
    const fullPath = path.resolve(folderPath)
    if (!fs.existsSync(fullPath)) {
      console.warn(chalk.red(`Routes folder ${folderPath} not found`))
      return
    }

    const files = fs.readdirSync(fullPath)
    for (const file of files) {
      const route = await import(pathToFileURL(path.join(fullPath, file)).href)
      if (route && typeof route.register === 'function') {
        route.register(this)
        console.log(chalk.magenta(`- Auto-loaded route from ${file} successfully registered`))
      }
    }
  }
}
