import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Layout from '@/views/layout/index.vue'
import Article from '@/views/article'
import Publish from '@/views/publish/index.vue'
import Image from '@/views/image'
import Comment from '@/views/comment/'
import Settings from '@/views/settings/'
import Fans from '@/views/fans/'
Vue.use(VueRouter)
// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由 这名字有意义
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path 为空 会作为默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫 所有页面的导航都会经过这里
// 守卫页面的导航的
// to 要去的路由页面信息
// from 来自哪里的路由信息
// next 放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面 不是 /login 校验登录状态
  // 如果没有登录 则跳转到登录页面
  // 如果登陆了 则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  if (to.path !== '/login') {
    if (user) {
      // 已登录允许通过
      next()
    } else {
      // 没有到登录 跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面 正常允许通过
    next()
  }
})

export default router
