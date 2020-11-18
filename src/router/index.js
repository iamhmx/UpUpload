import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/Layout.vue'
import Home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/upload',
    component: Layout,
    children: [
      {
        path: '/upload/v1',
        name: 'upload1',
        component: () => import('../views/upload/_1.0'),
        meta: {
          title: '进度条'
        }
      },
      {
        path: '/upload/v2',
        name: 'upload2',
        component: () => import('../views/upload/_2.0'),
        meta: {
          title: '拖拽上传'
        }
      },
      {
        path: '/upload/v3',
        name: 'upload3',
        component: () => import('../views/upload/_3.0'),
        meta: {
          title: '图片格式校验'
        }
      },
      {
        path: '/upload/v4',
        name: 'upload4',
        component: () => import('../views/upload/_4.0'),
        meta: {
          title: '大文件切片上传'
        }
      },
      {
        path: '/upload/v5',
        name: 'upload5',
        component: () => import('../views/upload/_5.0'),
        meta: {
          title: '秒传&断点续传'
        }
      },
      {
        path: '/upload/v6',
        name: 'upload6',
        component: () => import('../views/upload/_6.0'),
        meta: {
          title: '并发控制'
        }
      },
      {
        path: '/upload/v7',
        name: 'upload7',
        component: () => import('../views/upload/_7.0'),
        meta: {
          title: '失败重试&错误控制'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
