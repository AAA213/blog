const express = require('express')
const { db, genid } = require('../db/DbUtils')
const router = express.Router()
const fs = require('fs')

router.post('/rich_editor_upload', async (req, res) => {
  if (!req.files) {
    res.send({
      errno: 1, // 只要不等于 0 就行
      message: '上传失败'
    })
    return
  }

  const files = req.files
  const ret_files = []
  for (let file of files) {
    // 获取文件名字后缀 （（最后一个 . 裁剪）
    const file_ext = file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1
    )
    // 随机文件名
    const file_name = genid.NextId() + '.' + file_ext
    // 修改文件名称+移动文件  process.cwd():表示该程序运行的目录的路径
    // 将文件从临时目录移到最终目录并改名
    fs.renameSync(
      process.cwd() + '/public/upload/temp/' + file.filename,
      process.cwd() + '/public/upload/' + file_name
    )
    ret_files.push('/upload/' + file_name)
  }

  res.send({
    errno: 0, // 注意：值是数字，不能是字符串
    data: {
      url: ret_files[0] // 图片 src ，必须
    }
  })
})

module.exports = router
