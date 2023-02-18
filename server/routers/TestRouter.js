const express = require('express')
const { db, genid } = require('../db/DbUtils')
const router = express.Router()

router.get('/test', async (req, res) => {
  const out = await db.async.all("select * from 'admin'", [])

  res.send({
    id: genid.NextId(),
    out
  })
})

module.exports = router
