<template>
  <div class="publish-container">
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <!-- 面包屑路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-form
    ref="form"
    :model="article"
    label-width="60px"
    :rules='formRules'
  >
    <el-form-item label="标题" prop='title'>
      <el-input v-model="article.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop='content'>
      <el-input type="textarea" v-model="article.content"></el-input>
        <el-tiptap
          lang="zh"
          v-model="article.content"
          :extensions='extensions'
          height='350px'
        />
    </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="article.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <template v-if="article.cover.type > 0">
        <upload-cover
          :key="cover"
          v-for="cover in article.cover.type"
          @update-cover="onUpdateCover"
        />
        </template>
      </el-form-item>
    <el-form-item label="频道" prop='channel_id'>
      <el-select v-model="article.channel_id" placeholder="请选择频道">
        <el-option
          v-for="(channel, index) in channels"
          :label="channel.name"
          :value="channel.id"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onPublish(false)">发表</el-button>
      <el-button @click="onPublish(true)">存入草稿</el-button>
    </el-form-item>
  </el-form>
</el-card>
  </div>
</template>

<script>
import UploadCover from './components/update-cover'
// 获取文章频道 新建文章
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  LineHeight,
  FontSize,
  Fullscreen,
  TextColor,
  Image
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
export default {
  // name: 'publishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  data () {
    return {
      channels: [], // 频道
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型 1:自动，0-无图，1-1张，3-3张
          images: [] // 图片地址
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new HorizontalRule(),
        new Fullscreen(),
        new LineHeight(),
        new ListItem(),
        new FontSize(),
        new TextColor(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        })
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [{
          // { required: true, message: '', trigger: 'change' }
          validator (rule, value, callback) {
            if (value === '<p></p>') {
              callback(new Error('请输入文章内容'))
            } else {
              // 验证通过
              callback()
            }
          }
        }
        ]
      }
    }
  },
  created () {
    this.loadChannels() // 获取频道
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
        console.log(res)
      })
    },
    onPublish (draft = false) {
      const articleId = this.$route.query.id
      if (articleId) {
        updateArticle(articleId, this.article, draft).then(res => {
          this.$message({
            message: `${draft ? '存入草稿' : '操作'} 成功`,
            type: 'success'
          })
          // 成功跳转至内容管理页
          this.$router.push('/article')
        })
      } else {
        addArticle(this.article, draft).then(res => {
          console.log(res)
          this.$message({
            message: `${draft ? '存入草稿' : '发布'} 成功`,
            type: 'success'
          })
          // 成功跳转至内容管理页
          this.$router.push('/article')
        })
      }
    },
    // 修改文章 加载内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (url) {
      this.article.cover.images[0] = url
    }
  }
}
</script>

<style lang="less" scoped>

</style>
