const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

//加载db.json数据
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// 跨域配置
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

app.post('/login', (request, response) => {
  //设置响应头 设置允许跨域
  response.setHeader('Access-Control-Allow-Origin', '*');
  //设置响应头，允许自定义键值
  response.setHeader('Access-Control-Allow-Headers', '*');
  //允许用任意方法跨域 get、post、delay等等
  response.setHeader("Access-Control-Allow-Method", "*");
  const { username, password } = request.body;

  const { users } = readDB();
  // 查找用户
  const user = users.find(u =>
    u.username === username && u.password === password
  );

  const token = 'mock-token-' + Date.now();
  if (user) {
    response.status(200).json({
      user: {
        token,
      }
    });

    user.token = token;
    modifyUserDB('edit', user)
  } else {
    response.status(401).json({
      message: '用户名或密码错误'
    })
  }
})

app.get('/projects', (request, response) => {
  const { projects } = readDB()
  const { name, personId } = request.query;
  let result = projects;

  if (name) {
    result = result.filter(item => item.name.includes(name))
  }

  if (personId) {
    result = result.filter(item => String(item.personId) === String(personId))
  }

  response.status(200).json(result);

})

app.get('/members', (request, response) => {
  const { members } = readDB();
  response.status(200).json(members);
  console.log(JSON.stringify(members));
})

// 读取db.json文件
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// 写回db.json
function writeDB(dbData) {
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
}

// 修改db.json数据
function modifyUserDB(type, data) {
  const dbData = readDB();
  if (type === 'add') {
    dbData.users.push(data);
  } else if (type === 'edit') {
    const index = dbData.users.findIndex(item => item.id === data.id);
    if (index !== -1) {
      dbData.users[index] = data;
    }
  } else if (type === 'delete') {
    const index = dbData.users.findIndex(item => item.id === data.id);
    if (index !== -1) {
      dbData.users.splice(index, 1);
    }
  }

  writeDB(dbData);
}


app.listen(port, () => {
  console.log(`服务已经启动，${port}端口监听中......`);
})