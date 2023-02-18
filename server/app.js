const express = require('express')
const path = require('path')
const { db } = require('./db/DbUtils')
// 上传文件
const multer = require('multer')
const app = express()
// 定义端口
const port = 8080

// 开发跨域请求
app.use((req, res, next) => {
  // 设置允许跨域的域名，*表示允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的herder类型
  res.header('Access-Control-Allow-Headers', '*')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.methods == 'OPTIONS') res.sendStatus(200) // 让 options 尝试快速结束
  else next()
})

// 引入中间件，处理json
app.use(express.json())
const update = multer({
  // 指定上传默认路径
  dest: './public/upload/temp'
})
// 使所有接口都有上传功能
app.use(update.any())
// 设置静态文件路径
app.use(express.static(path.join(__dirname, 'public')))

// 定义中间件
const ADMIN_TOKEN_PATH = '/_token'
app.all('*', async (req, res, next) => {
  // 判断请求路径是否包含 /_token
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    const { token } = req.headers
    const admin_token_sql = 'SELECT * FROM `admin` WHERE `token` = ?'
    const adminResult = await db.async.all(admin_token_sql, [token])
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: '请先登录'
      })
      return
    } else {
      next()
    }
  } else {
    next()
  }
})

// 注册路由
app.use('/admin', require('./routers/AdminRouter'))
app.use('/category', require('./routers/CategoryRouter'))
app.use('/blog', require('./routers/BlogRouter'))
app.use('/upload', require('./routers/UploadRouter'))

// 定义接口
app.get('/', (req, res) => {
  res.send('hello word')
})
app.listen(port, () => {
  console.log(`启动成功:http://localhost:${port}/`)
})
