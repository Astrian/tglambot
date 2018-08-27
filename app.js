const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const express = require('express')
const request = require('request')
const config = require('./config')
const expressApp = express()
const debug = require('debug')('helperbot:app.js')

const mainBotHandler = new Telegraf(config.telegram.bot_token)
const mainBotSender = new Telegram(config.telegram.bot_token, {
  agent: null,
  webhookReply: true
})
expressApp.use(mainBotHandler.webhookCallback(config.url.path))
mainBotHandler.telegram.setWebhook(config.url.domain+config.url.path)

mainBotHandler.start((ctx) => {
  debug(ctx.update)
  let msg = ctx.update.message
  if (msg.from.id === config.telegram.user_id) return // 排除我自己
  let reply = config.telegram.start_msg
  mainBotSender.sendMessage(msg.from.id, reply, {reply_to_message_id: msg.message_id})
})

let urlRex = new RegExp('(https?)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
mainBotHandler.hears(urlRex, (ctx) => {
  let msg = ctx.update.message
  if (ctx.chat.id !== config.telegram.user_id) {
    mainBotSender.forwardMessage(config.telegram.user_id, msg.from.id, msg.message_id)
  } else {
    debug('hi')
    request.post(`https://${config.instapaper.username}:${config.instapaper.password}@www.instapaper.com/api/add`, {
      form: {
        url: urlRex.exec(ctx.update.message.text)[0]
      }
    })
    mainBotSender.sendMessage(msg.from.id, '已存入 Instapaper。', {reply_to_message_id: msg.message_id})
  }
})

mainBotHandler.hears(new RegExp('.*'), (ctx) => {
  let msg = ctx.update.message
  if (msg.from.id === config.telegram.user_id) return // 排除我自己
  mainBotSender.forwardMessage(config.telegram.user_id, msg.from.id, msg.message_id)
})

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(3001, () => {
  debug('Example app listening on port 3001!')
})
