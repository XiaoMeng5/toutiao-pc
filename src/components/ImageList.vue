<template>
  <div>
    <div class="dataBox">
      <div class="btnBox">
        <!-- 全部/收藏 切换按钮 -->
        <el-radio-group
          v-model="collect"
          size="small"
          @change="onloadChange"
        >
          <!-- 这里要做全部和收藏的查询选项 -->
          <!-- 开始时候分别给全部和收藏两个点击事件使用一个方法 -->
          <!-- 但是 element 组件这样使用的话请求会发送两次 这样是不友好的 -->
          <!-- 所以使用了 element 内容部的 change 方法来进行监听绑定的 label 值来进行切换 -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>

          <!-- 下面是之前正常思路的方法 -->
          <!-- <el-radio-button
            label="全部"
            @click.native="loadImage(false)"
          />
          <el-radio-button
            label="收藏"
            @click.native="loadImage(true)"
          /> -->
        </el-radio-group>

        <!-- 添加素材按钮 -->
        <el-button
          class="addTo"
          type="success"
          size="small"
          @click="dialogImageVisible = true"
          v-if="isShowAdd"
        >
        <!--
          v-if="isshowAdd" 控制组件的添加按钮显示或隐藏
          点击添加素材让弹框显示
          -->
        添加素材
        </el-button>
      </div>

      <!-- 图片素材 -->
      <div
        v-loading="loading"
        class="Images"
        v-for="(img, index) in Images"
        :key="index"
        @click="selected = index"
      >
      <!--
        selected 通过索引值来进行判断选中的是哪个
        v-if="isShowAction" 绑定索引值 初始是 null 是全部都不被选中
        当点击了某个之后 索引值改变 就会让点击的选中
      -->
        <div
          class="imageBackground"
          v-if="isShowSelected && selected === index"
        />
        <!-- isShowSelected 来判定这个组件中素材点击没有对勾显示 -->
        <div class="del" v-if="isShowAction">
          <!--  v-if="isshowAdd" 控制组件的收藏按钮显示或隐藏 -->
          <!-- 绑定 id 如果是收藏 图标就高亮显示 -->
          <!-- 点击的时候要把整个图片的状态传递过去 -->
          <!-- <i
            class="el-icon-star-off"
            @click="onCollection(img)"
            :id="img.is_collected ? 'Collection' : null"
            :disabled="disabled"
          /> -->
          <!-- <i class="el-icon-delete"></i> -->
          <!-- 收藏 -->
          <el-button
            type="warning"
            icon="el-icon-star-off"
            size="mini"
            :plain="!img.is_collected"
            :disabled="img.disabledBtn"
            @click="onCollection(img)"
            circle
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            :disabled="img.disabledBtn"
            @click="deleteCollection(img)"
          ></el-button>
        </div>
        <img :src="img.url">
      </div>

      <!-- 分页器 -->
      <!-- totalCount 获取到总页码数量 -->
      <!-- pageSize 每页显示的条数 -->
      <!-- disabled 分页是否禁用 -->
      <!-- current-change 获取到点击页的页码 -->
      <!--
        小 bug 解决：
        当分页数控改变之后 页码不会发生变化 数据和页码不对应
        当在全部看第二页的时候 点击去收藏页面 那么加载收藏页面虽然是收藏页面的第一页数据
        但是页码高亮显示是第二页
        应该是切换 全部/收藏 时页码高亮也变成1

        加上 :current-page.sync="page" 绑定页码为1之后
        加上 .sync 可以实现数据实时的更新
        可以开始默认分页1为高亮 通过点击其他页码也可改变高亮显示
        -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="disabled"
        @current-change="onCurrentChange"
        :current-page.sync="page"
      />
        <!-- 添加素材的弹出框 -->
    <!-- 由于页面有定位元素 弹框不能再最上层 -->
    <!-- 绑定 append-to-body 属性即可到最上层 类似 z-index 效果 -->
      <el-dialog title="上传素材"
        :append-to-body="true"
        :visible.sync="dialogImageVisible"
      >
        <!-- 拖拽上传 -->
        <!-- upload 组件本身就支持请求提交上传操作 -->
        <!-- 不需要自己去发请求 它自己就会发 -->
        <!-- 但是需要把请求相关的操作配置给它即可 -->
        <!-- 它的请求方法默认就是 POST 不能订制 -->
        <!-- 设置请求路径：action 这里需要写完整路径 -->
        <!-- 设置请求头：headers -->
        <!-- on-success 文件上传成功时的钩子 我们可以进行设置 上传文件成功时关闭弹出框 并且重新加载页面 -->
        <el-upload
          class="upload-demo"
          drag
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="uploadHeaders"
          name="image"
          multiple
          :on-success="onUploadSuccess"
          :show-file-list="false"
        >
          <!-- <i class="el-icon-upload"></i> -->
          <i class="el-icon-plus"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 获取图片素材 - 收藏素材 - 删除素材
import { getImages, CollectionImages, deleteImages } from '@/api/images'
export default {
  name: 'ImageList',
  // props 使用数组声明：不建议 不够严谨 也不够强大 仅适合 demo 演示
  // props 使用对象声明：建议方法 更严谨 功能能加丰富 强烈建议
  props: {
    // 控制组件的添加按钮显示或隐藏
    isShowAdd: {
      type: Boolean, // 布尔值
      // required: true, 必填项 使用这个组件必须要传这个值 否则就报错
      default: true // 默认展示
    },
    // 控制组件的收藏或删除按钮的显示或隐藏
    isShowAction: {
      type: Boolean, // 布尔值
      default: true // 默认展示
    },
    // 控制在素材管理中不能被选择
    // 因为发布文章和素材库用的是一个组件 那么再素材库中点击图片不能有被选的效果
    isShowSelected: {
      type: Boolean, // 布尔值
      default: false // 默认不展示
    }
  },
  data () {
    // 从本地数据获取到用户信息
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      // 配置上传图片的请求头
      uploadHeaders: {
        // 设置 token
        Authorization: `Bearer ${user.token}`
      },
      Images: [], // 所有图片素材
      collect: false, // 按钮组默认选择项
      dialogImageVisible: false, // 控制添加素材的弹出框显示隐藏
      page: 1, // 当前页码
      pageSize: 10, // 每页显示的条数
      totalCount: 0, // 获取到总页码数
      loading: false, // 加载 loding
      disabled: false, // 分页是否禁用
      // disabledBtn: false, // 绑定按钮是否禁用状态
      plainBtn: true, // 是否为朴素按钮
      // imageId: null // 获取当前图片的 id
      selected: null // 收藏中选中图片的索引值
    }
  },
  created () {
    this.loadImage() // 获取图片素材
  },
  methods: {
    // 查询 全部/收藏 的图片 通过上面按钮点击事件传递 true 或者 false 传参
    // 但是默认值为 false 是查询全部
    loadImage (page = 1) {
      // 这里通过上面传递参数 page = 1 来接收 也可以直接写死为：
      // this.page = 1  这样也就加载完成之后 页码高亮显示也是第一个了
      this.page = page // 重置高亮页码 防止数据和页码不对应
      this.loading = true // 加载完成之前 loding 开始
      this.disabled = true // 加载完成之前分页禁用
      getImages({
        collect: this.collect, // 是否是收藏的图片
        page, // 页数
        per_page: this.pageSize // 每页数量
      }).then(res => {
        // console.log(res)
        const result = res.data.data.results
        result.forEach(img => {
          // img 对象本来没有 disabledBtn 数据
          // 我们这里往里面添加的数据是用来控制每个按钮的禁用状态的
          img.disabledBtn = false
        })
        this.Images = result // 获取到的图片素材
        this.totalCount = res.data.data.total_count // 获取到总页码数量
        // this.imageId = res.data.data.results.id
        this.loading = false // 加载完成 loding 停止
        this.disabled = false // 加载完成之后分页可以使用
      })
    },

    // 查询 全部/收藏 的方法 这是 element 内部的方法 可以传递过来 true/false 正好可以传递参数进行查询
    onloadChange () {
      // console.log(value)
      // console.log(this.collect)
      this.loadImage()
    },

    // 页码发生变化时候 可以获取到页码数 实现分页
    onCurrentChange (page) {
      // console.log(page)
      this.loadImage(page)
    },

    // 收藏素材
    onCollection (img) {
      // 如果已经收藏 那么点击要取消收藏
      // 如果没有收藏 那么点击要添加收藏
      // 如果为真 那么是已经收藏
      // console.log(img)
      // this.disabledBtn = true // 请求未成功时 收藏按钮禁用
      img.disabledBtn = true // 请求未成功时 收藏按钮禁用
      // if (img.is_collected) {
      //   CollectionImages(img.id, false)
      //   img.is_collected = !img.is_collected
      // } else {
      //   CollectionImages(img.id, true)
      //   img.is_collected = !img.is_collected
      // }
      // 上面是正常的写法
      // 之后发现 传递的第二次参数正好是 img.is_collected 相反的值
      // 所以简写为：
      CollectionImages(img.id, !img.is_collected).then(res => {
        // console.log(res)
        // 成功之后修改图片的视图
        img.is_collected = !img.is_collected
        // this.disabledBtn = false // 请求成功后 收藏按钮解除禁用 都绑定一个数据
        img.disabledBtn = false // 请求成功后 收藏按钮解除禁用 分开设置
      })
    },

    // 当文件上传成功时候
    // 暂时图片不能上传 服务器维护中...2021.1.20 状态码 401
    onUploadSuccess () {
      // 先让上传弹出框关闭
      this.dialogImageVisible = false
      // 上传图片完成之后 更新当前所在页的图片
      // 但是不一定在哪页上传图片 上传后的图片就在哪页
      // 所以这个用处也不是很大
      this.loadImage(this.page)
      // 所以下面做了一个上传成功的提示
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    // 删除素材
    deleteCollection (img) {
      img.disabledBtn = true // 请求未成功时 收藏按钮禁用
      deleteImages(img.id).then(res => {
        console.log(res)
        this.loadImage() // 删除之后重新加载图片列表
        img.disabledBtn = false // 请求成功后 删除按钮解除禁用 分开设置
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .dataBox {
    padding: 20px;
    .btnBox {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .imageBackground {
      width: 180px;
      height: 180px;
      background-image: url("./images/对号.png");
      position: absolute;
    }
  }
  .Images {
    width: 180px;
    height: 180px;
    margin-left: 20px;
    display: inline-block;
    position: relative;
    .del {
      height: 40px;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    img {
      width: 180px;
      height: 180px;
    }
  }
</style>
