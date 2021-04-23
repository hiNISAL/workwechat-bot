# workwechat-bot

企业微信群机器人法系推送辅助工具。服务端客户端通用。

## 安装

```shell
npm i workwechat-bot
```

## 使用

```js
// in node:
// const Bot = require('workwechat-bot').default;
import Bot from 'workwechat-bot';

const bot1 = new Bot([
  'bot-hook-1',
  'bot-hook-2',
]);

const bot2 = new Bot('bot-hook-2');

bot1
  .text('123')
  .text('456')
  .at('user1')
  .at(['user2', 'user3'])
  .send();

bot2.markdown('# markdown').text('55').send();
```

## API

### send

不论是调用 `text` 还是 `markdown` 还是 `at`，都不会直接发送消息，他们用户设置消息队列。

当调用 send 的时候，会发送所有设置好的消息，并将消息队列清空。

```js
const bot = new Bot('bot-hook');

bot.text('abc').send();

bot.markdown('# markdown').send({
  // 不会清空消息队列
  clearMsgQueue: false,
});
```

### text

发送文本消息。

```js
const bot = new Bot('bot-hook');

// 发送文本为 text 的消息
bot.text('text');
// 发送文本为 text，并且会 at id为user1的用户
bot.text('text', 'user1');
// 发送文本为 text，并且会 at id为user1 和 user2的用户
bot.text('text', ['user1', 'user2']);
// 发送文本为 text，并且会 at id为user1的用户与 手机为 13212312121 的用户
bot.text('text', {
  mentioned: ['user1'],
  mentionedMobile: ['13212312121'],
});

bot.send();
```

### at

发送 @成员 消息。

```js
const bot = new Bot('bot-hook');

// 会 @ id为 user1 的用户
bot.at('user1');
// 会 @ id为 user1 和 user2 的用户
bot.at(['user1', 'user2']);
// 会 @ id为user1的用户与 手机为 13212312121 的用户
bot.at({
  mentioned: ['user1'],
  mentionedMobile: ['13212312121'],
});
```

### image

发送图片。

```js
const bot = new Bot('bot-hook');

bot.image('base64', 'md5');

bot.send();
```

### news

发送图文消息。

```js
const bot = new Bot('bot-hook');

bot.news({
  title: '标题',
  desc: '描述',
  url: 'https://tar.get',
  cover: '封面',
});

bot.news([
  {
    title: '标题',
    desc: '描述',
    url: 'https://tar.get',
    cover: '封面',
  },
  {
    title: '标题',
    desc: '描述',
    url: 'https://tar.get',
    cover: '封面',
  },
]);

bot.send();
```

### markdown

发送 markdown 消息。

```js
const bot = new Bot('bot-hook');

bot.markdown('# markdown').send();
```

### __clearMsgQueue

清空队列。

```js
const bot = new Bot('bot-hook');

bot.text('123');

bot.__clearMsgQueue();

bot.send();
```
