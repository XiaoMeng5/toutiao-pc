<template>
  <div>
    <!-- 1. 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div ref="main" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script src="echarts.min.js"></script>
<script type="text/javascript">
// 2. 引入
import echarts from 'echarts'
export default {
  props: {},
  data () {
    return {}
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)
    // var myChart = echarts.init(chartDom);
    // 指定图表的配置项和数据
    var option;
    option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
    }
    // option && myChart.setOption(option);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}

</script>

<style lang="less" scoped>

</style>
