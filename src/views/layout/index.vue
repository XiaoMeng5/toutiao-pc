<template>
  <el-container class="layout-container">
  <el-aside
  class="aside"
  width='auto'
  >
  <app-aside
    class="aside-menu"
    :is-collapse='isCollapse'
  />
  </el-aside>
  <el-container>
    <el-header class="header">
      <div>
        <!--
          class 样式处理
          {
            css 类名：布尔值
          }
          true 作用类名
          false 不作用类名

         -->
        <i
        :class="{
          'el-icon-s-fold': isCollapse,
          'el-icon-s-unfold': !isCollapse
        }"
        @click="isCollapse = !isCollapse"
        ></i>
      <span>江苏传智播客科技教育有限公司</span>
      </div>
        <el-dropdown >
          <div class="avatar-wrap">
            <img :src="user.photo" alt="" class="avatar">
          <span>{{user.name}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">
      下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" @click.native="setting">设置</el-dropdown-item>
            <el-dropdown-item command="b" @click.native="onLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main class="main">
      <!-- 子路由出口 -->
      <router-view/>
    </el-main>
  </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏展开状态
    }
  },
  created () {
    // 组件初始化 请求获取用户资料
    this.loadUserProfile()

    // 注册自定义事件
    globalBus.$on('update-user', (data) => {
      console.log('update-user', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清楚
        window.localStorage.removeItem('user')
        // 跳转至登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    setting () {
      this.$router.push('/settings')
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.aside{
  background-color: bisque;
  .aside-menu{
    height: 100%;
  }
}
.header{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.avatar-wrap{
    display: flex;
    align-items: center;
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .main{
  background: url(./images/welcome.jpg) no-repeat;
  background-position: center;
}
</style>
