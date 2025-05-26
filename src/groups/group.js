import fs from 'fs'
import { pathToFileURL } from 'url'
import path from 'path'
import { Router } from 'express'
import chalk from 'chalk'
import { timestamp } from '../server/server.js'

export class Group {
  #name
  #router

  constructor(name = '') {
    // Corrige o nome para sempre começar com uma barra
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

  addGroup(group) {
    const fullPath = group.name
    this.#router.use(fullPath, group.routes)
    console.log(
      chalk.yellow(`- Group ${chalk.bgMagenta(group.name)} added to group ${chalk.bgMagenta(this.#name)}`)
    )
  }

  newRoute({
    method = 'GET',
    path = '/',
    status = 200,
    responseJSON = null,
    responseTXT = null,
    middlewares = [],
    caseError,
    process = async (params, req, res) => {}
  }) {
    const methodLower = method.toLowerCase()
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(methodLower)) {
      throw new Error(`Method ${method} is not supported`)
    }

    this.#router[methodLower](path, ...middlewares, async (req, res) => {
      try {
        const reqCustom = {
          body: req.body,
          params: req.params,
          query: req.query,
          headers: req.headers,
          method: req.method,
          url: req.url,
          request: req
        }

        await process(reqCustom, res)

        if (!res.headersSent) {
          if (responseJSON !== null && responseJSON !== undefined) {
            res.status(status).json(responseJSON)
          } else {
            res.status(status).send(responseTXT ?? 'OK')
          }
        }
      } catch (err) {
        if (!caseError) {
          console.error(chalk.red(`${timestamp()} - Error in route ${method.toUpperCase()} ${path}:`), err)
          if (!res.headersSent) res.status(500).send('Internal Server Error')
        } else {
          caseError(err, req, res)
        }
      }
    })

    console.log(
      chalk.cyan(
        `- Route ${chalk.bgGreen(method.toUpperCase())} ${chalk.bgBlue(path)} in group ${chalk.bgMagenta(
          this.#name
        )} created successfully`
      )
    )
  }

  async autoLoadRoutesFrom(folderPath) {
  const fullPath = path.resolve(folderPath)
  if (!fs.existsSync(fullPath)) {
    console.warn(chalk.red(`Routes folder ${folderPath} not found`))
    return
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(fullPath, entry.name)

    if (entry.isDirectory()) {
      if (entry.name.startsWith('_')) continue
      const subgroupName = '/' + entry.name
      const subgroup = new Group(subgroupName)

      await subgroup.autoLoadRoutesFrom(entryPath)
      this.addGroup(subgroup)
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.js')) {
        const routeModule = await import(pathToFileURL(entryPath).href)
        if (routeModule && typeof routeModule.register === 'function') {
          routeModule.register(this)
          console.log(
            chalk.magenta(`- Auto-loaded route from ${entry.name} successfully registered in group ${this.#name}`)
          )
        }
      }
    }
  }
}


}
