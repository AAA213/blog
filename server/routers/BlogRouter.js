// 博客的增删改查
const express = require('express')
const { db, genid } = require('../db/DbUtils')
const router = express.Router()

// 增加
// 修改
// 删除
// 查询

// 新增
router.post('/_token/add', async (req, res) => {
  const { category_id, title, content } = req.body

  const id = genid.NextId()
  const create_time = new Date().getTime()
  const insert_sql =
    'INSERT INTO `blog` (`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)'
  const params = [id, title, category_id, content, create_time]
  const { err, rows } = await db.async.run(insert_sql, params)
  if (err == null) {
    res.send({
      code: 200,
      msg: '新增成功'
    })
  } else {
    res.send({
      code: 500,
      msg: '新增失败'
    })
  }
})

// 修改
router.put('/_token/update', async (req, res) => {
  const { id, category_id, title, content } = req.body

  const update_sql =
    'UPDATE `blog` SET `title` = ?,`content` = ?, category_id = ? WHERE `id` = ? '
  const params = [title, content, category_id, id]
  const { err, rows } = await db.async.run(update_sql, params)
  if (err == null) {
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
  // 接收前端传来的id ，/blog/delete?id=xxx
  const id = req.query.id
  const delete_sql = 'DELETE FROM `blog` WHERE `id` = ?'
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

// 查询
router.get('/search', async (req, res) => {
  /**
   * keyWord 关键字
   * categoryId 分类编号
   *
   * 分页
   * page 页码
   * pageSize 分页大小
   */
  let { keyWord, categoryId, page, pageSize } = req.query
  page = page == null ? 1 : page
  pageSize = pageSize == null ? 10 : pageSize
  categoryId = categoryId == null ? 0 : categoryId
  keyWord = keyWord == null ? '' : keyWord
  let params = []
  let whereSqls = []
  if (categoryId != 0) {
    whereSqls.push(' `category_id` = ? ')
    params.push(categoryId)
  }
  if (keyWord != '') {
    whereSqls.push(' (`title` LIKE ? OR `content` LIKE ?) ')
    params.push('%' + keyWord + '%')
    params.push('%' + keyWord + '%')
  }
  // 组合查询条件
  let whereSqlStr = ''
  if (whereSqls.length > 0) {
    whereSqlStr = ' WHERE ' + whereSqls.join(' AND ')
    // [' `category_id` = ? ',' `title` LIKE ? OR ? `content` LIKE ? ']
    //   WHERE `category_id` = ? AND  `title` LIKE ? OR ? `content` LIKE ?
  }
  // 查分页数据
  const searchSql =
    'SELECT * FROM `blog` ' +
    whereSqlStr +
    "ORDER BY 'create_time' DESC LIMIT ?,?"

  // 组合参数 添加上分页参数
  const searchParams = params.concat([(page - 1) * pageSize, pageSize])
  // 1 10
  // 0，10  （LIMIT 0，10  从第0条开始，往后查10条）

  // 总数 201 ，201/10 = 21
  // 查询数据总数
  const searchCountSql = 'SELECT count(*) FROM `blog` ' + whereSqlStr
  const searchCountParams = params

  // 查分页数据
  const searchResult = await db.async.all(searchSql, searchParams)
  const countResult = await db.async.all(searchCountSql, searchCountParams)
  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        keyWord,
        categoryId,
        page,
        pageSize,
        list: searchResult.rows,
        count: countResult.rows[0]['count(*)']
      }
    })
  } else {
    res.send({
      code: 500,
      msg: '查询失败'
    })
  }
})

module.exports = router
