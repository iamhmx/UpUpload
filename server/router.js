/*
 * @Author: mingxing.huang
 * @Date: 2020-11-13 15:16:10
 */
const router = require('koa-router')()
const fse = require('fs-extra')
const path = require('path')

const { mergeFile, getUploadedList } = require('./tools')

router.post('/upload', async ctx => {
  let { files } = ctx.request
  const file = files.file
  const filePath = path.resolve(__dirname, `public/${file.name}`)
  if (fse.existsSync(filePath)) {
    ctx.body = `${file.name}`
    return
  }
  // 清空文件目录
  fse.emptyDirSync(path.resolve(__dirname, 'public'))
  await fse.move(file.path, filePath)
  ctx.body = `${file.name}`
})

router.post('/upload_chunk', async ctx => {
  let {
    files,
    body: { hash, name }
  } = ctx.request
  const file = files.file
  const filePath = path.resolve(__dirname, `public/${hash}`)
  if (!fse.existsSync(filePath)) {
    await fse.mkdir(filePath)
  }
  await fse.move(file.path, `${filePath}/${name}`)
  ctx.body = `切片${name}上传成功`
})

router.post('/upload_chunk_mock_failed', async ctx => {
  if (Math.random() > 0.7) {
    ctx.status = 500
    return
  }
  let {
    files,
    body: { hash, name }
  } = ctx.request
  const file = files.file
  const filePath = path.resolve(__dirname, `public/${hash}`)
  if (!fse.existsSync(filePath)) {
    await fse.mkdir(filePath)
  }
  await fse.move(file.path, `${filePath}/${name}`)
  ctx.body = `切片${name}上传成功`
})

router.post('/merge', async ctx => {
  let { ext, size, hash } = ctx.request.body
  // 最终生成的文件路径+名称
  const filePath = path.resolve('server', 'public', `${hash}.${ext}`)
  await mergeFile(filePath, hash, size)
  ctx.body = `/public/${hash}.${ext}`
})

router.post('/check', async ctx => {
  let { ext, hash } = ctx.request.body
  console.log('后缀名：', ext)
  console.log('hash：', hash)
  const filePath = path.resolve('server', 'public', `${hash}.${ext}`)
  let uploaded = false
  let uploadedList = []
  if (fse.existsSync(filePath)) {
    // 文件已存在
    uploaded = true
  } else {
    uploadedList = await getUploadedList(path.resolve('server', 'public', hash))
  }
  ctx.body = {
    uploaded,
    uploadedList
  }
})

router.post('/delete', async ctx => {
  const { name } = ctx.request.body
  const filePath = path.resolve('server', 'public', name)
  await fse.unlink(filePath)
  ctx.body = '删除成功'
})

module.exports = router.routes()
