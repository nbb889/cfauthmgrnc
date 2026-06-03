import express from 'express'
const app = express()

app.enable('trust proxy')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    let realhost = req.headers['x-forwarded-host']
    if (typeof realhost !== 'string') realhost = req.host
    else realhost = realhost.split(',')[0].trim()
    req.headers.host = realhost
    return next()
})

import cookieParser from 'cookie-parser'
app.use(cookieParser())

const api = express.Router()
app.use('/api', api)

import { getenv } from './cfenv.js'
const env = getenv()

api.use((req, res, next) => {
    if (typeof env.password !== 'string') return res.status(500).send('密码未设置')
    if (typeof env.jwt_secret !== 'string') return res.status(500).send('jwt 密钥未设置')
    if (typeof env.data === 'undefined') return res.status(500).send('存储未绑定')
    return next()
})

api.get('/ping', (req, res) => {
    return res.status(200).send('pong')
})

import auth from './apis/auth.js'
api.use('/auth', auth)

import account from './apis/account.js'
api.use('/account', account)

import { createServer, get } from 'node:http'
import { httpServerHandler } from 'cloudflare:node'
const server = createServer(app)
export default httpServerHandler(server)
