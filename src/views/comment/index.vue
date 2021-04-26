<template>
  <div class="comment-container">
    <el-card class="box-card">
  <div slot="header" class="clearfix">
      <!-- 面包屑路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
    <el-table
      class="table-list"
      :data="articles"
      style="width: 100%"
      stripe
    >
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="评论状态">
        <template slot-scope="scope">
          {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope" >
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled='scope.row.statusDisabled'
            @change="onStatusChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="totalCount"
      background
    />
  </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  props: {},
  data () {
    return {
      articles: [],
      totalCount: 1,
      pageSize: 10,
      page: 1 // 当前激活的页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页面发生改变时 加载指定页面数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 让分页激活的页码和请求数据的页码一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.starusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.starusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)
        // 启用开关
        article.starusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-list{
  margin-bottom: 30px;
}
</style>
