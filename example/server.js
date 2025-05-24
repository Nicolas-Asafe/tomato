import tomato from '../src/index.js'
const api = new tomato.Group("users")

const nome = (nome = "nome") => tomato.syvars.access(nome)

tomato.syvars.setVar("nome",'nicolas')
console.log(nome())

tomato.syvars.setVar("nome","nicole")
console.log(nome())

//modules routers
api.autoLoadRoutesFrom("./routers")

new tomato.Server({
    PORT:5000,
    groups:[api]
})