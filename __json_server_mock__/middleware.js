module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') {
    if (req.body.username === 'wyy' && req.body.password === 'omg') {
      return res.status(200).json({
        user: {
          token: '123'
        }
      })
    } else {
      return res.status(400).json({
        message: '用户名或密码错误我'
      })
    }
  }

  next();
}