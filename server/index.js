/*
 * @Author: mingxing.huang
 * @Date: 2020-11-11 18:13:53
 */
const Koa = require('koa')
const koaBody = require('koa-body')
const routes = require('./router')

const app = new Koa()

app.use(
  koaBody({
    multipart: true
  })
)

app.use(require('koa-static')(__dirname + '/public'))

app.use(routes)

app.listen(3009, () => {
  console.log('server listen at 3009')
})
