*English version. For Chinese instruction, just scroll down the page.*

# Telegram Helper bot
In 2018, Telegram make “private chat to strangers” function disabled for Chinese user (with +86 phone number). So if you want your Chinese friend to contact you directly, you can config this bot, and your friend can leave a message to you with it.

## Manual building
> You can build the bot with docker. See “Build with Docker” part.

First, chat to [Bot Father](https://t.me/botfather), and request to make a new bot (by send `/newbot` to him). Then, Bot Father will give you a bot token seems like `123456789:ABCDEFGhijklmnOPQRSTuvwxyz012345678`.

Next, you will need a VPS and a domain to build this bot (DigitalOcean VPS with Ubuntu OS is recommended).

Follow these steps to config:

1. Set a `A` or `AAA` DNS record to your domain with your VPS IP address. In this tutorial, I will use `helper.example.com` domain for example.
2. Connect to your VPS with SSH.
3. Install Git, Node.js, Nginx and [Certbot](https://certbot.eff.org/). Note Certbot (with Let's Encrypt) is a good way to config SSL and HTTPS, but you still can config HTTPS by your self.
4. `git clone https://github.com/Astrian/telegram-helperbot.git`
5. Duplicate `config.sample.js` and rename the new file to `config.js`. Edit the new `config.js` with your Telegram, domain, and Instapaper (optional) information. (See config sample below)
6. Config nginx by `vi /etc/nginx/sites-available/default`. See config sample below to know how to config.
7. Config HTTPS with `sudo certbot --nginx`. Follow the instructions to config it (and it's super easy, really).
8. `npm install -g supervisor`
9. `npm install` and `npm start`, and `/start` the bot. Then tell your friend to chat with bot, the message will be forwarded to you.

## Config sample
`config.js`:

```
module.exports = {
  telegram: {
    bot_token: '123456789:ABCDEFGhijklmnOPQRSTuvwxyz012345678',
    user_id: 12345678, // Get it with https://t.me/get_id_bot,
    start_msg: 'hello world' // When your friends /start the bot, this text message will be sent to them.
  },
  instapaper: { // That information is optional. If you don't need it, just make them as empty strings.
    username: 'someone@example.com',
    password: 'mYiNst4P4perPassw0rd'
  },
  url: {
    domain: 'https://helper.example.com', // MUST USE HTTPS, don't left slash at the end of it.
    path: '/helloworld' // Start with slash，Telegram recommends use a long random strings to keep your bot save.
  }
};
```

Nginx config:

```
server {
  server_name helper.example.com;
  location / {
    proxy_pass http://localhost:3001;
  }
  listen 80;
}
```

## Build with Docker (Beta)
> It's a new way to build the bot, and this way is not be verified in production environments. Feel free to submit an issue if you find any problem when build with Docker.

First, you still need a domain name, an VPS and a Telegram bot token (see last part).

Then...

```
docker pull astrian/tglambot
docker image build -t astrian/tglambot .
docker container run -p 8000:3001 -it astrian/tglambot
```

When you run the last one command, you will see `node` will throw errors. 

Don't worry. Let's create a `config.js` file, copy the [config code](https://github.com/Astrian/tglambot/blob/master/config.sample.js), and `docker cp config.js docker cp <container name>:/`

Start the container again. Great! It's running. Now you just need to config the Nginx with 8000 port and config the SSL and HTTPS.

## ... by the way
I make a little Instapaper function in this bot.

You can config your Instapaper username and password, then send or forward message with URLs to it, it will send the link to your Instapaper inbox.

But if you don't need it, just feel free to leave the strings blank.

## License
MIT

-----

*中文*

# Telegram 私聊助理机器人
2018 年，Telegram 封禁中国用户（+86 手机）的私聊陌生人功能。如果你有让中国手机号用户私聊你的需求，可以尝试这款 bot。

## 手动构建机器人
> 你可以使用 Docker 进行自动化构建，详见「使用 Docker 构建」一节。

请先私聊 [Bot Father](https://t.me/botfather)，向他申请一个新的 bot（发送 `/newbot` 指令给他）。你会获得形如 `123456789:ABCDEFGhijklmnOPQRSTuvwxyz012345678` 的 token。

接着，你需要申请一个 VPS 和域名。推荐使用 DigitalOcean VPS 服务以及 Ubuntu 操作系统。VPS 需要能够访问 Telegram 服务器。

根据以下步骤进行配置。

1. 向你的域名登记一个指向你的 VPS 服务器的 `A` 或 `AAA` DNS 记录。在本篇教程中，将会用 `helper.example.com` 作为域名例子。
2. 使用 SSH 进入你的 VPS。
3. 安装 Git、Node.js、Nginx 以及 [Certbot](https://certbot.eff.org/)。注意，Certbot（和 Let's Encrypt 证书服务）是推荐使用的 HTTPS 及 SSL 签证服务，但你也可以使用自己的证书服务进行配置。
4. `git clone https://github.com/Astrian/telegram-helperbot.git`
5. 复制 `config.sample.js` 并将新文件命名为 `config.js`。编辑新的 `config.js` 文件，将你的 Telegram、域名和 Instapaper（可选）配置写入，参见下面的配置示例。
6. 使用 `vi /etc/nginx/sites-available/default` 配置 Nginx。参见下面的配置示例。
7. 使用 `sudo certbot --nginx` 指令进行签证。这一步只需要跟着命令行提示就行（超超超简单）。
8. `npm install -g supervisor`
9. `npm install` 之后再 `npm start`，然后向你的 bot 发送 `/start`。接着，你的好友就可以通过这款 bot 向你留言。

## 配置示例
`config.js`：

```
module.exports = {
  telegram: {
    bot_token: '123456789:ABCDEFGhijklmnOPQRSTuvwxyz012345678',
    user_id: 12345678, // 可以从 https://t.me/get_id_bot 获取。
    start_msg: 'hello world' // 当别人 /start 你的 bot 的时候，这条文字消息将回复给他们。
  },
  instapaper: { // 可选项。如果不需要 Instapaper 相关功能，将它们留空。
    username: 'someone@example.com',
    password: 'mYiNst4P4perPassw0rd'
  },
  url: {
    domain: 'https://helper.example.com', // 必须使用 HTTPS，不要以斜杠结尾。
    path: '/helloworld' // 请以斜杠开头，Telegram 推荐使用随机字符串以保证你的 bot 安全（不被他人伪造请求滥用）。
  }
};
```

Nginx 配置：

```
server {
  server_name helper.example.com;
  location / {
    proxy_pass http://localhost:3001;
  }
  listen 80;
}
```

## 使用 Docker 构建（测试版）
> 这是配置机器人的新方式，但这个方式还没在生产环境中进行使用。发现任何问题，请向我提出 issue。

首先，你还是需要一个域名、VPS，以及一个 Telegram 机器人 token（参见上一节）。

然后……

```
docker pull astrian/tglambot
docker image build -t astrian/tglambot .
docker container run -p 8000:3001 -it astrian/tglambot
```

运行最后一个指令时，你会发现 `node` 会抛出一些错误。

不用担心，我们只需新建一个 `config.js` 文件，然后复制[配置代码](https://github.com/Astrian/tglambot/blob/master/config.sample.js)，保存后将它复制到 Docker 容器中：`docker cp config.js docker cp <container name>:/`

完成后，重新启动容器，你会发现它已经正常工作了。现在，你可以在 Nginx 配置 8000 的反向代理，并配置 SSL 和 HTTPS，就可以正常使用机器人了。

## 还有件事
代码里有一个 Instapaper 集成功能。

配置好你的 Instapaper 用户名密码之后，可以向 bot 直接发送或转发 URL 链接，链接就会自动存在你的 Instapaper。

如果不需要，只需要在配置中将 Instapaper 相关字段留空。

## 协议
MIT
