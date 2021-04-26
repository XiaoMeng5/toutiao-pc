<template>
    <el-menu
      class="nav-menu"
      default-active="2"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse='isCollapse'
    >
    <div class="logo" v-if="!isCollapse"></div>
      <el-menu-item class="suba" index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-menu-item class="suba" index="/article">
        <i class="el-icon-menu"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>

      <el-menu-item class="suba" index="/image">
        <i class="iconfont iconimage"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>

      <el-menu-item class="suba" index="/publish">
        <i class="iconfont iconpublish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>

      <el-menu-item index="/comment">
        <i class="iconfont el-icon-s-comment"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>

      <el-menu-item class="suba" index="/fans">
        <i class="el-icon-present"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>

      <el-menu-item class="suba" index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
</template>

<script>

export default {
  name: 'AppAside',
  components: {},
  props: ['is-collapse'],
  data () {
    return {
      // isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.nav-menu{
  max-width: 200px;
  .iconfont{
    margin-right: 10px;
    padding-left: 5px;
  }
  .suba {
    padding-right: 150px;
  }
}
.nav-menu .logo{
  width: 100%;
  height: 60px;
  background: url('./logo_admin.png') no-repeat 50%;
  margin-top: 25px;
  }
</style>
