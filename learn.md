# React Rules

## 本项目中所使用到的工具

## React 组件重新渲染的时机主要有以下几种

- 组件的 props 发生变化
  父组件传递给子组件的 props 更新时，子组件会重新渲染。

- 组件的 state 发生变化
  通过 useState、setState 等方式更新 state 时，组件会重新渲染。

- context 发生变化
  组件订阅的 context 值发生变化时，组件会重新渲染。

- 强制更新
  调用 forceUpdate（类组件）或某些特殊场景下，React 会强制重新渲染组件

## 自定义hook——custom hook

React的hook要求必须以use开头
所有hook只能在函数组件或其他hook中调用

## ts的类型兼容与java的不同之处在于

ts是鸭子类型（duck typing）： 面向接口编程，而不是面向对象编程

const a = { id: 1, name: "jenny" };
const a: Person = { id: 1, name: "jenny" };

这两句都是可以编译通过的，即a虽然非Person类型，但只要拥有Person接口的相应的键 也被认为与Person类型一致

## 跨域问题

### 同源策略

最早由Netscape公司提出，是浏览器的一种安全策略。
同源：即网页与其请求的网络资源在协议、域名、端口号必须完全相同
违背同源策略就是跨域

### 如何解决跨域

- 方法1: cors（跨域资源共享）- 最常用

服务端设置响应头允许特定源访问

```javascript
// Node.js + Express 示例
const express = require("express");
const app = express();

// 简单CORS配置 - 允许所有源
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "\*"); // 允许所有域名
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// 更安全的CORS配置 - 允许特定源
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/api/data", (req, res) => {
  res.json({ message: "CORS enabled!" });
});
```

- 方法2: 使用开发服务器的代理功能 - 开发可用

下面是一个webpack-dev-server的代理配置示例：

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: ('^/api': ''), //去掉路径中的/api
        changeOrigin: true, //修改请求头中的Host为target的域名，防止某些服务器校验Host
      },
    },
  },
};
```

在这个例子中，当前端请求api/data时，代理服务器会将请求转发到http://localhost:8080

- 方法3: Nginx反向代理 - 生产环境常用

假设我们有一个前端应用打包后的静态文件，以及一个后端的API服务，我们可以这样配置Nginx:

```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;

    # 前端静态文件
    location / {
        root /var/www/html;
        index index.html
        try_files $uri $uri/ /index.html;
    }

    # 反向代理API请求
    location /api/ {
        proxy_pass http://localhost:8080/; # 注意这里末尾的/，表示将/api/替换为/
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

这样，当用户访问example.com时，Nginx会提供前端静态文件，而当请求example.com/api/...时，Nginx会将请求转发到http://localhost:8080/...

- 方法4: JSONP - 传统方案

```javascript
// 前端
function handleData(data) {
  console.log("Received:", data);
}

// 动态创建script标签
const script = document.createElement("script");
script.src = "http://other-domain.com/api/data?callback=handleData";
document.head.appendChild(script);

// 后端返回
// handleData({message: "Hello JSONP"});
```

- 方法5: WebSocket - 实时应用

```javascript
// WebSocket 不受同源策略限制
const socket = new WebSocket("ws://other-domain.com/ws");

socket.onmessage = function (event) {
  console.log("Data:", event.data);
};
```

### 同域部署

将前端静态网页与后端 API部署在同一个域名、协议、端口下，自然就没有跨域问题啦

同域部署的具体形式

1. 传统单体应用模式

https://myapp.com ← 前端页面
https://myapp.com/api/* ← 后端API

同一域名，不同路径，无跨域

2. 反向代理模式

具体看“如何解决跨域”--方法3

PS： 同域部署 !== 同一台服务器

- 可以同一台服务器，不同端口 + 反向代理
- 可以不同服务器，通过负载均衡器统一域名
- 关键：浏览器看到的最终域名要一致

### 代理服务器（Proxy-Server）

- 正向代理（Forward-Proxy）
  代理服务器，为客户端服务，客户端知道目标服务器，但直接访问受限，因此通过正向代理去访问
  典型应用： 翻墙、企业内部上网代理

- 反向代理 (Reverse-Proxy)
  代理服务器，为服务器服务，客户端不知道真实的服务端，反向代理对外表现为一个服务器，接受客户端的请求，然后将请求转发给内部的一个或多个服务器，并将结果返回给客户端
  典型应用：负载均衡、缓存、SSL加速、隐藏真实服务器

总结：
正向代理：代表客户端，隐藏客户端
反向代理：代表服务器，隐藏服务器

## 长连接VS短连接

1. 短连接：通常指的是每次通信都新建一个连接，通信完毕就关闭连接。比如HTTP/1.0默认使用短连接，即每次请求都要经过TCP三次握手建立连接，请求响应结束后立即断开连接。

2. 长连接（Keep-Alive）：在HTTP/1.1中，默认使用长连接（Keep-Alive），但这里的“长连接”指的是在同一个TCP连接上可以连续进行多个HTTP请求/响应， 而不是持久不关闭的连接，然而从整体来看，即使是HTTP/1.1的长连接，也是按需建立，并在一定空闲时间后关闭的，所以它并不是长久连接

3. 持久连接（如WebSocket）： 通常指平时人们口中的所说的————长连接，如WebSocket，连接一旦建立会保持很长时间，直到一方主动关闭

### 短连接特点：

- 每次请求建立新连接
- 请求完成后立即关闭
- 无状态、无记忆

短连接示例：

```javascript
// 典型的短连接示例 - HTTP请求
async function 短连接示例() {
  // 1. 建立连接
  const response = await fetch("/api/users");

  // 2. 获取数据
  const users = await response.json();

  // 3. 连接自动关闭
  console.log(users);

  // 下一个请求需要重新建立连接
  const response2 = await fetch("/api/products");
  // 再次经历：建立连接 → 传输数据 → 关闭连接
}
```

短连接场景：

```javascript
// 1. 传统的REST API调用
fetch("/api/users/123")
  .then((response) => response.json())
  .then((data) => console.log(data));

// 2. 表单提交
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("/api/submit", {
    method: "POST",
    body: new FormData(e.target),
  });
  // 连接立即关闭
});

// 3. 图片加载
const img = new Image();
img.src = "/api/avatar/123"; // 每个图片都是独立连接
```

### 长连接特点：

- 一次连接，长期保持
- 双向实时通信
- 有状态、有记忆

```javascript
// WebSocket 长连接示例
function 长连接示例() {
  // 1. 建立持久连接
  const socket = new WebSocket("ws://localhost:8080");

  // 2. 连接保持打开状态
  socket.onopen = function (event) {
    console.log("连接已建立，将保持打开状态");

    // 可以随时发送消息，无需重新连接
    socket.send(JSON.stringify({ type: "join", room: "chat" }));
  };

  // 3. 实时接收服务器推送
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log("实时消息:", message);
    // 连接始终保持，可以持续接收消息
  };

  // 4. 连接可能保持数小时甚至数天
  setTimeout(() => {
    socket.send("10分钟后仍然使用同一个连接");
  }, 600000);
}
```
