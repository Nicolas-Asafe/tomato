// index.js
import { Server, Group } from './index.js'

const api = new Group('api')

api.newRoute({
  method: 'GET',
  path: '/hello',
  responseTXT: 'Fala aí, GET!'
})

api.newRoute({
  method: 'POST',
  status:202,
  path: '/criar',
  responseJSON: { status: 'criado' },
  process: async (_, req) => {
    console.log('Body recebido:', req.body)
  }
})

api.newRoute({
  method: 'PUT',
  path: '/atualizar',
  responseTXT: 'Atualizado com sucesso!'
})

api.newRoute({
  method: 'DELETE',
  path: '/deletar',
  responseTXT: 'Deletado sem dó!'
})

new Server({
  PORT: 3000,
  groups: [api]
})
