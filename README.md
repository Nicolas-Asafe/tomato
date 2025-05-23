
<body style="font-family: Arial, sans-serif; background: #111; color: #eee; padding: 2rem; line-height: 1.6;">
  <h1 style="color:rgb(226, 171, 164);">Notas da Atualização - tomato - x </h1>
  <p><strong>Versão:</strong> 1.1.0</p>
  <p><strong>Data:</strong> 23 de Maio de 2025</p>

  <h2 style="color: #ffd700;">Novidades</h2>
  <ul>
    <li> <strong>Middlewares por grupo:</strong> cada grupo pode ter seus próprios filtros e tratamentos!</li>
    <li> <strong>Prefixos dinâmicos de versão:</strong> crie APIs organizadas e modulares com facilidade.</li>
    <li> <strong>Health check:</strong> endpoint <code>/health</code> mostra se o servidor está vivo e por quanto tempo.</li>
    <li> <strong>Logger com timestamp:</strong> hora precisa nos logs do terminal pra rastrear com estilo.</li>
    <li> <strong>Debug de rotas ativas:</strong> acesse <code>/__debug/routes</code> e veja todas as rotas vivas.</li>
    <li><strong>Função de shutdown:</strong> derrube o servidor de forma elegante com <code>server.shutdown()</code>.</li>
    <li><strong>Autoload de rotas:</strong> carregamento automático de arquivos de rota com <code>group.autoLoadRoutesFrom()</code>.</li>
    <li><strong>Modo Debug pronto pra produção:</strong> mais controle e logs detalhados pro dev raiz.</li>
  </ul>

  <h2 style="color: #87cefa;">Melhorias</h2>
  <ul>
    <li> Roteamento inteligente com fallback 404 customizado.</li>
    <li> Mensagens mais claras e coloridas no console usando <code>chalk</code>.</li>
    <li> Suporte a todos os métodos REST principais: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>, <code>PATCH</code>.</li>
  </ul>

  <h2 style="color:rgb(253, 203, 195);"> Próximos passos (to-do)</h2>
  <ul>
    <li> Middleware de autenticação JWT por rota</li>
    <li> Sistema de cache simples</li>
    <li>Integração com MongoDB ou PostgreSQL</li>
    <li>Monitoramento em tempo real com WebSocket</li>
  </ul>

  <p style="margin-top: 3rem;">Feito com  por <strong>Nicolas Penha</strong></p>
</body>
</html>
