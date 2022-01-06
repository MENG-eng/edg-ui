<template>
  <div id="xBarChart">
    <div id="xBarChart" class="normal" ref="xBarChart"></div>
  </div>
</template>
<script>

export default {
  name: "xBarChart",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  watch: {
    data: function (newVal, oldVal) {
      this.$nextTick(() => {
        this.drawChart();
      });
    },
  },
  mounted() {
    this.data = this.data;
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    drawChart() {
      if (this.chart) {
        this.chart.setOption();
      }
      // 基于准备好的dom，初始化echarts实例
      if (!this.$refs["xBarChart"]) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["xBarChart"]);
      this.chart = myChart;

      // 指定图表的配置项和数据
      var cntMax = []; //背景按最大值
      for (let i = 0; i < this.data.cnt.length; i++) {
        cntMax.push(this.data.cnt[0]);
      }
      let option = {
        // backgroundColor: "#003366",
        grid: {
          left: "2%",
          right: "4%",
          bottom: "2%",
          top: "8%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return params[0].name + " : " + params[0].value;
          },
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.data.name,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              textStyle: {
                color: "#ffffff",
                fontSize: "12",
              },
            },
            data: this.data.cnt,
          },
        ],
        series: [
          {
            name: "值",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#5BDFFF",
                  },
                  {
                    offset: 1,
                    color: "#1977FA",
                  },
                ]),
              },
            },
            barWidth: 12,
            data: this.data.cnt,
          },
        //   {
        //     name: "背景",
        //     type: "bar",
        //     barWidth: 15,
        //     barGap: "-100%",
        //     data: cntMax,
        //     itemStyle: {
        //       normal: {
        //         color: "rgba(24,31,68,1)",
        //         barBorderRadius: 20,
        //       },
        //     },
        //   },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>