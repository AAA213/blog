// 分类增删改查接口
const express = require('express')
const { db, genid } = require('../db/DbUtils')
const router = express.Router()

// 添加
router.post('/_token/add', async (req, res) => {
  // 接收前端传来的name
  const { name } = req.body
  const insert_sql = 'INSERT INTO `category` (`id`,`name`) VALUES (?,?)'
  console.log(genid.NextId(), name)
  const { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name])

  if (err == null) {
    // 说明添加成功，
    res.send({
      code: 200,
      msg: '添加成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '添加失败'
    })
  }
})
// 修改
router.put('/_token/update', async (req, res) => {
  // 接收前端传来的name
  const { id, name } = req.body
  const update_sql = 'UPDATE `category` SET `name` = ? WHERE `id` =?'
  const { err, rows } = await db.async.run(update_sql, [name, id])

  if (err == null) {
    // 说明修改成功，
    res.send({
      code: 200,
      msg: '修改成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '修改失败'
    })
  }
})

// 删除
router.delete('/_token/delete', async (req, res) => {
  // 接收前端传来的id ，/category/delete?id=xxx
  const id = req.query.id
  const delete_sql = 'DELETE FROM `category` WHERE `id` = ?'
  const { err, rows } = await db.async.run(delete_sql, [id])

  if (err == null) {
    res.send({
      code: 200,
      msg: '删除成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '删除失败'
    })
  }
})

// 查询列表
router.get('/list', async (req, res) => {
  const search_sql = 'SELECT * FROM `category`'
  const { err, rows } = await db.async.all(search_sql, [])

  if (err == null) {
    res.send({
      code: 200,
      msg: '查询成功',
      data: rows
    })
  } else {
    res.send({
      code: 500,
      msg: '查询失败'
    })
  }
})

module.exports = router
