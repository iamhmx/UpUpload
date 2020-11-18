/*
 * @Author: mingxing.huang
 * @Date: 2020-11-18 14:05:35
 */
import Vue from 'vue'

// 自动注册全剧组件
function registerGlobalComp() {
  const reqComp = require.context(
    // 组件目录
    '@/components',
    // 是否查询其子目录
    false,
    // 后缀
    /\.vue$/
  )

  reqComp.keys().forEach(file => {
    const compConfig = reqComp(file)
    // 默认使用组件的name作为组件名，请设置name
    Vue.component(compConfig.default.name, compConfig.default || compConfig)
  })
}

registerGlobalComp()
