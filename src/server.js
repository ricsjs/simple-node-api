import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// Middleware para CORS
const cors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // Permite qualquer origem, você pode restringir isso para origens específicas.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // Cabeçalhos permitidos

    // Se for uma requisição OPTIONS, responde imediatamente sem fazer mais nada
    if (req.method === 'OPTIONS') {
        return res.writeHead(204).end() // 204 No Content
    }
}

const server = http.createServer(async (req, res) => {

    const { method, url } = req

    // Adiciona o CORS como middleware
    cors(req, res)

    await json(req, res)

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)

        console.log(extractQueryParams(routeParams.groups.query))

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)
