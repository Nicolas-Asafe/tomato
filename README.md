<h1>Tomato X🍅</h1>

<p>Esse framework é uma abstração sobre o Express que facilita criar rotas agrupadas com suporte a <strong>GET, POST, PUT e DELETE</strong> com logs automáticos e suporte a middlewares.</p>

<h2>📦 Instalação</h2>

<pre><code>npm install tomato-x</code></pre>

<h2>🧠 Estrutura</h2>

<ul>
  <li><code>Server</code>: inicializa o servidor e gerencia os grupos de rotas</li>
  <li><code>Group</code>: representa um grupo de rotas como <code>/api</code> ou <code>/users</code></li>
  <li><code>newRoute</code>: adiciona rotas com suporte a GET, POST, PUT e DELETE</li>
</ul>

<h2>📂 Exemplo de uso</h2>

<pre><code>
// index.js
import { Server, Group } from './server.js'

const users = new Group('users')

users.newRoute({
  method: 'GET',
  path: '/',
  responseJSON: { users: ['Nico', 'Luna', 'Zion'] },
  process: async (params, req, res) => {
    console.log("🔎 Pegando todos os usuários...")
  }
})

users.newRoute({
  method: 'POST',
  path: '/create',
  status: 201,
  responseTXT: 'Usuário criado!',
  process: async (params, req, res) => {
    const data = req.body
    console.log("📦 Novo usuário:", data)
  }
})

new Server({
  PORT: 3000,
  groups: [users]
})
</code></pre>

<h2>🛠 Como rodar</h2>

<pre><code>node index.js</code></pre>

<h2>📬 Resultado</h2>
<ul>
  <li><code>GET /users</code> → retorna JSON com os nomes</li>
  <li><code>POST /users/create</code> → imprime no console e responde com texto</li>
</ul>

<h2>🔥 Logs automáticos</h2>
<ul>
  <li>Contador de ações</li>
  <li>Tempo de resposta de cada rota</li>
  <li>Logs de erro formatados com <code>chalk</code></li>
</ul>

<h2>💡 Dica</h2>
<p>Use <code>Insomnia</code> ou <code>Postman</code> pra testar os endpoints POST, PUT, DELETE!</p>
