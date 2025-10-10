const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

//加载db.json数据
const dbPath = path.join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// 跨域配置
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

// 模拟用户数据
const users = [
  { id: 1, username: 'wyy', password: '123456' },
  { id: 2, username: 'wyy1', password: '123456' }
];

app.post('/login', (request, response) => {
  //设置响应头 设置允许跨域
  response.setHeader('Access-Control-Allow-Origin', '*');
  //设置响应头，允许自定义键值
  response.setHeader('Access-Control-Allow-Headers', '*');
  //允许用任意方法跨域 get、post、delay等等
  response.setHeader("Access-Control-Allow-Method", "*");
  const { username, password } = request.body;

  // 查找用户
  const user = users.find(u =>
    u.username === username && u.password === password
  );

  if (user) {
    response.status(200).json({
      user: {
        token: 'mock-token-' + Date.now()
      }
    });
  } else {
    response.status(401).json({
      message: '用户名或密码错误'
    })
  }
})

app.get('/projects', (request, response) => {
  const { name, personId } = request.query;
  let result = dbData.projects;

  if (name) {
    result = result.filter(item => item.name.includes(name))
  }

  if (personId) {
    result = result.filter(item => String(item.personId) === String(personId))
  }

  response.status(200).json(result);

})

app.get('/users', (request, response) => {
  response.status(200).json(dbData.users);
  console.log(JSON.stringify(dbData.users));
})


app.listen(port, () => {
  console.log(`服务已经启动，${port}端口监听中......`);
})