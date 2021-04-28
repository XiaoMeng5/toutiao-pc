<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header"      class="clearfix">
          <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    <el-row>
      <el-col :span="15">
        <el-form ref="form" :model="user" label-width="80px" :rules='formRules'>
          <el-form-item label="编号">
            {{ user.id }}
          </el-form-item>
          <el-form-item label="手机">
            {{ user.mobile }}
          </el-form-item>
          <el-form-item label="媒体名称" prop='title'>
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍" prop='title'>
            <el-input type='textarea' v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop='title'>
              <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onUpdateUser"
              :loading='updateProfileLoading'
            >保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset='2' :span="4">
        <!-- <p @click="$refs.file.click()">修改头像</p> -->
        <label for="file">        <el-avatar
        shape="square"
        :size="150"
        fit="cover"
        :src="user.photo"
        ></el-avatar>
        <p>修改头像</p></label>
        <input
          id="file"
          type="file"
          hidden
          ref="file"
          @change="onFileChange"
        >
      </el-col>
    </el-row>
   </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened='onDialogOpend'
      @closed='onDialogClosed'
    >
      <div class="preview-image-warp">
        <img
          class="preview-image"
          width="150"
          :src="previewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      // 用户资料
      dialogVisible: false,
      previewImage: '', // 预览头像
      cropper: null,
      updatePhotorofileLoading: false,
      updateProfileLoading: false,
      formRules: {
        title: [
          // { required: true, message: '请输入正文字', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        content: [{
          // { required: true, message: '', trigger: 'change' }
          validator (rule, value, callback) {
            if (value === '<p></p>') {
              callback(new Error('请输入文字'))
            } else {
              // 验证通过
              callback()
            }
          }
        }]
      }
    }
  },
  created () {
    this.loadUser()
  },
  mounted () {
    console.log(this.$route)
  },
  methods: {
    onUpdateUser () {
      // 开启loading 状态
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭 loading 状态
        this.updateProfileLoading = false

        // 发布通知 用户信息已修改
        globalBus.$emit('update-user')
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      const file = this.$refs.file
      const bloDate = window.URL.createObjectURL(file.files[0])
      this.previewImage = bloDate
      this.dialogVisible = true
      this.$refs.file.value = ''
    },
    onDialogOpend () {
      const image = this.$refs['preview-image']
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
        dragMode: 'none',
        cropBoxResizable: false
      })
    },

    // 销毁裁切器 重新初始化
    onDialogClosed () {
    //   this.cropper.destroy()
    },
    onUpdatePhoto () {
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        updateUserPhoto(fd).then(res => {
          this.dialogVisible = false
          this.user.photo = window.URL.createObjectURL(file)
          this.updateProfileLoading = false
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          globalBus.$emit('update-user', this.user)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-image-warp{
  .preview-image{
    display: block;
    height: 200px;
    max-width: 100%;
  }
}
</style>
