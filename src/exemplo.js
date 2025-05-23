import { Server, Group } from './index.js'

const api = new Group('api')
await api.autoLoadRoutesFrom('./routers')

new Server({
  PORT: 3000,
  groups: [api]
})
