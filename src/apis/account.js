import express from 'express'
const account = express.Router()

import { getenv } from '../cfenv.js'
const env = getenv()

import { needauth } from './auth.js'

account.get('/list', needauth, async (req, res) => {
    const cursor = req.query.cursor
    const data = await env.data.list({ cursor })

    return res.status(200).json({
        accounts: data.keys.map(item => item.name),
        havemore: !data.list_complete,
        morecursor: data.cursor || ''
    })
})

account.get('/info', needauth, async (req, res) => {
    const name = req.query.name
    if (typeof name !== 'string' || name === '') {
        return res.status(400).send('请求错误')
    }

    const info = await env.data.get(name)
    if (info === null) {
        return res.status(404).send('信息未找到')
    }

    const obj = JSON.parse(info)
    return res.status(200).json(obj)
})

account.post('/set', needauth, async (req, res) => {
    const name = req.query.name
    if (typeof name !== 'string' || name === '') {
        return res.status(400).send('请求错误')
    }

    const { username, password, totp, note } = req.body
    const isok = typeof username === 'string' && username !== '' && typeof password === 'string' && password !== '' && typeof totp === 'string' && typeof note === 'string'
    if (!isok) {
        return res.status(400).send('数据错误')
    }

    const raw = JSON.stringify({
        username,
        password,
        totp,
        note
    })

    await env.data.put(name, raw)
    return res.status(200).send('设置成功')
})

account.get('/del', needauth, async (req, res) => {
    const name = req.query.name
    if (typeof name !== 'string' || name === '') {
        return res.status(400).send('请求错误')
    }

    await env.data.delete(name)
    return res.status(200).send('删除成功')
})

export default account
