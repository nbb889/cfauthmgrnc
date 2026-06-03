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

export default account
