const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const GenId = require('../utils/SnowFlake')

// 创建用于操作数据库的类
const db = new sqlite3.Database(path.join(__dirname, 'blog.sqlite3'))

// 创建雪花id的类
// WorkerId :机器码
const genid = new GenId({ WorkerId: 1 })

db.async = {}
// 封装Promise
db.async.all = (sql, params) => {
  return new Promise((resolve, reject) => {
    // 作用是将下面的操作由异步转为同步
    db.all(sql, params, (err, rows) => {
      resolve({ err, rows })
    })
  })
}

db.async.run = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err, rows) => {
      resolve({ err, rows })
    })
  })
}

module.exports = { db, genid }
