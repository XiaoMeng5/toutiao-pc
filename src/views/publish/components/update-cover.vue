<template>
  <div class="update-cover" @click="showCoverSelect">
    <div class="cover-warp">
      <img
        class="cover-image"
        ref="cover-image"
      >
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
    >
    <el-tabs
     v-model="activeName"
     @tab-click="handleClick">
      <el-tab-pane label="素材库" name="first">
        <input type="file" @change="onFileChange">
        <img
        width="100"
        ref-preview-image
      >
      </el-tab-pane>
      <el-tab-pane label="上传图片" name="second">
      </el-tab-pane>
    </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCoverConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
export default {
  data () {
    return {
      dialogVisible: false,
      activeName: 'second'
    }
  },
  methods: {
    // 展示选择封面弹框
    showCoverSelect () {
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      // const file = this.$ref.file.file[0]
      // 图片预览
      // const blob = window.URL.createObjectURL(file)
      // this.$refs.file.value = ''
    },
    // 确定上传图片
    onCoverConfirm () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传图片
          this.$refs['cover-image'].src = res.data.data.url
          // 将图片地址发送给父组件
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-warp{
  width: 150px;
  height: 120px;
  background-color: black;
  border: 1px solid #000;
  .cover-image{
    height: 120px;
    width: 100%;
  }
}
</style>
