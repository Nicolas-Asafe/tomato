import fs from 'fs'
import readline from 'readline'

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Do you want to create the initial structure of Tomato-X? (y/n): ', answer => {
  if (answer.toLowerCase() === 'y') {

    // Ensure a directory exists, create if not
    function ensureDir(dirPath) {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(`Created folder: ${dirPath}`)
      }
    }

    // Write file if it doesn't exist
    function writeFile(filePath, content) {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content.trim(), 'utf-8')
        console.log(`Created file: ${filePath}`)
      } else {
        console.log(`File already exists: ${filePath} (skipped)`)
      }
    }

    // Create folder structure
    ensureDir('./app/v1/routers')
    ensureDir('./app/v1/handlers')

    // Content for app/index.js
    const indexContent = `
import tomato from 'tomato-x'

const api = new tomato.Group()

api.autoLoadRoutesFrom('./v1/routers')

new tomato.Server({
  PORT: 5000,
  groups: [api]
})
    `

    // Content for handler
    const handlerContent = `
function hello() {
  return 'Hello, world!'
}

export default hello
    `

    // Content for route
    const routeContent = `
import tomato from 'tomato-x'
import hello from '../handlers/hello.js'

export const register = tomato.NewRegister({
  path: '/hello',
  process: (_, res) => {
    tomato.buildResponse(res, {
      message: hello(),
      status: 200
    })
  }
})
    `

    // Create files
    writeFile('./app/index.js', indexContent)
    writeFile('./app/v1/handlers/hello.js', handlerContent)
    writeFile('./app/v1/routers/helloRoute.js', routeContent)

    console.log('Tomato-X structure created successfully.')

  } else {
    console.log('Structure creation cancelled.')
  }

  rl.close()
})
