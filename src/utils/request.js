/**
*基于axios封装的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'
// 创建一个axios 实例
// 我们通过这个实例去发送请求 把需要的配置配置给这个实例
// import JSONbig from 'json-bigint' 这个模块你下载了吗
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
  // 请求基础路径 打开接口文档
})

// 请求拦截器request 是请求的基础路径 结果你连路径都没用
// 这里不是axios 是request
request.interceptors.request.use(
  // 任何所有请求会经过这里
  // config 是当前请求相关的配置信息对象
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(user)
    // 如果有登录用户 则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 可以再允许请求出去之前定制统一业务功能处理
    // 例如统一设置token
    // 当这里 return config 之后请求在真正的发出去
    return config
    // 请求失败 会经过这里
  }, function (error) {
    return Promise.reject(error)
  })
// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
