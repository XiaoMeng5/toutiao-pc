<template>
  <div class="image-container">
    <el-card class="box-card">
     <div slot="header" class="clearfix">
      <!-- 面包屑路径导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
      <div class="action-head">
        <el-radio-group
          v-model="collect"
          size='mini'
          @change="loadImages(1)"
          >
          <el-radio-button
            :label="false"
          >全部</el-radio-button>
          <el-radio-button
            :label="true"
          >收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size='mini'
          type='success'
          @click="dialogUploadVisible = true"
        >上传素材
        </el-button>
      </div>
      <!-- 图片列表 -->
      <el-row :gutter='10'>
        <el-col
          :lg='4'
          :xs='12'
          :sm='6'
          :md='6'
          v-for="(img, index) in images"
          :key='index'
          class="image-item"
        >
        <el-image
          style="height: 100px"
          :src="img.url"
          fit="cover">
        </el-image>
        <div class="image-action">
          <el-button
          type="warning"
          :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
          circle
          size='small'
          @click="onCollect(img)"
          :loading='img.loading'
          ></el-button>
          <i
            :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected}"
              @click="onCollect(img)"
          ></i>
          <i
            :class="{
            'el-icon-delete-solid': img.is_collected,'el-icon-delete': !img.is_collected}"
            @click="onDelete(img)"
          ></i>
        </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size='pageSize'
        :current-page.sync='page'
        @current-change='onPageChange'
      >
    </el-pagination>
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body='true'
    >
    <el-upload
      class="upload-demo"
      drag
      action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
      :headers='uploadHeaders'
      name='image'
      multiple
      :show-file-list='false'
      :on-success='onUploadSuccess'
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认全部图片
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      pageSize: 5,
      page: 1,
      collectLoading: false
    }
  },
  created () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  methods: {
    loadImages (page = 1) {
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    onDelete (img) {
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-head{
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item{
  position: relative;
}
.image-action{
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
  height: 40px;
  background-color:rgba(0,0,0,.3);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
</style>
