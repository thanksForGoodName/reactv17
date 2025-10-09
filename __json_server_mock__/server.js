const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('__json_server_mock__/db.json')
const middlewares = jsonServer.defaults()

// 添加自定义中间件
server.use(middlewares)
// 添加你的中间件
server.use(require('./__json_server_mock__/middleware.js'))
server.use(router)

server.listen(3001, () => {
  console.log('JSON Server is running')
})