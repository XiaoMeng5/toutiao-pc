<template>
  <div class="article-container">
  <el-card class="filter-card">
  <div slot="header" class="clearfix">
    <!-- 面包屑路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <!-- 数据筛选表单 -->
    <el-form ref="form" :model="form" label-width="40px" size="mini">
    <el-form-item label="状态">
    <el-radio-group v-model="status">
      <el-radio :label="null">全部</el-radio>
      <el-radio :label="0">草稿</el-radio>
      <el-radio :label="1">待审核</el-radio>
      <el-radio :label="2">审核通过</el-radio>
      <el-radio :label="3">审核失败</el-radio>
      <el-radio :label="4">已删除</el-radio>
    </el-radio-group>
    </el-form-item>
    <el-form-item label="频道">
    <el-select v-model="channelId" placeholder="请选择频道">
      <el-option
        label="全部"
        :value='null'
      ></el-option>
      <el-option
        :label="channel.name"
        :value='channel.id'
        v-for="(channel,index) in channels"
        :key='index'
      ></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="日期">
    <el-date-picker
      v-model="rangeDate"
      type="datetimerange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['12:00:00']"
      format='yyyy-MM-dd'
      value-format='yyyy-MM-dd'
    >
    </el-date-picker>
  </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="loadArticles(1)"
        :disabled='loading'
      >筛选</el-button>
    </el-form-item>
  </el-form>
  </el-card>

  <el-card class="box-card">
    <div slot="header" class="clearfix">
      根 据 筛 选 条 件 共 查 询 到 {{totalCount}} 条 结 果
    </div>
  <!-- 数据列表 -->
  <!-- 把需要展示的列表数据 绑定给 table 组件的data属性 -->
    <el-table
      :data="articles"
      stripe
      style="width: 100%"
      class="list-table"
      size='mini'
      v-loading="loading"
    >
      <el-table-column
        prop="date"
        label="封面">
        <template slot-scope='scope'>
          <img
            v-if="scope.row.cover.images[0]"
            class="article-cover"
            :src='scope.row.cover.images[0]' alt=""
          >
          <img v-else class="article-cover" src="./no-cover.png" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope='scope'>
          <el-tag type="articleStatus[scope.row.status ].type" >{{articleStatus[scope.row.status].text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit" circle
            type='primary'
            @click="$router.push('/publish?id='+scope.row.id.toString())"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete" circle
            @click="onDeleteArticle(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表分页 -->
    <el-pagination
      layout="prev, pager, next"
      background
      :total="totalCount"
      :current-page.sync='page'
      @current-change='onCurrentChange'
      :page-size='pageSize'
      :disabled='loading'
    />
  </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        ate1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章的数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0,
      pageSize: 10,
      status: null, // 默认null 查询文章的状态
      channels: [], // 频道列表
      channelId: null,
      rangeDate: null,
      loading: true, // 加载中
      page: 1
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles(1)
  },
  methods: {
    loadArticles (page = 1) {
      // 加载中loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        // console.log(res)
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中
        this.loading = false
      })
    },
    onSubmit () {
      this.loadArticles(1)
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },

    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card{
  margin-bottom: 30px;
}
.list-table{
  margin-bottom: 20px;
}
.article-cover{
  width: 50px;
  background-size: cover;
}
</style>
