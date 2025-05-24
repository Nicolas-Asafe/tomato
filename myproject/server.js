import tomato from '../src/index.js'
const api = new tomato.Group("users")
//modules routers
api.autoLoadRoutesFrom("./routers")

new tomato.Server({
    PORT:5000,
    groups:[api]
})