// 登录接口
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const { db, genid } = require('../db/DbUtils')
const router = express.Router()

router.post('/login', async (req, res) => {
  // 接收前端传来的账号和密码
  let { account, password } = req.body
  let { err, rows } = await db.async.all(
    'select * from `admin` where `account` = ? AND `password` = ?',
    [account, password]
  )
  if (err == null && rows.length > 0) {
    // 说明登录成功，生成token
    let login_token = uuidv4()

    let update_token_sql = 'UPDATE `admin` SET `token` = ? where `id` = ?'

    // 写入token
    await db.async.run(update_token_sql, [login_token, rows[0].id])

    // 拿到用户信息
    let admin_info = rows[0]
    // 添加 token
    admin_info.token = login_token
    // 移除 password
    admin_info.password = undefined
    res.send({
      code: 200,
      msg: '登录成功',
      data: admin_info
    })
  } else {
    res.send({
      code: 500,
      msg: '登录失败'
    })
  }
})

module.exports = router
