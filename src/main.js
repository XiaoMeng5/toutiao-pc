/**
 * 项目的启动入口
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载 element 组件库
import ElementUI from 'element-ui'

// 加载 element 组件库样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// import JSONbig from 'json-bigint'
// const str = '{ "id": 1253585734669959168 }'
// // console.log(JSON.parse(str))
// const data = JSONbig.parse(str)
// console.log(JSONbig.stringify(data))
// JSON.stringify()
// 全局注册element 组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

//  创建 Vue 根实例
// 把 router 配置到根实例中
// 通过 router 方法 把 App 根组件渲染到 #app 入口节点

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
