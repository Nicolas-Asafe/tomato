import tomato from '../src/index.js'
const api = new tomato.Group()

api.autoLoadRoutesFrom("./routers")

new tomato.Server({
    PORT:5000,
    groups:[api]
})  