<template>
  <div id="yBarChart">
    <div id="yBarChart" class="normal" ref="yBarChart"></div>
  </div>
</template>
<script>
export default {
  name: "yBarChart",
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
      if (!this.$refs["yBarChart"]) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["yBarChart"]);
      this.chart = myChart;

      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff",
              fontSize: "26",
            },
          },
        },
        legend: {
          top: "5%",
          right: "10%",
          itemWidth: 10,
          itemHeight: 10,
          data: ["数据量", "异常统计"],
          textStyle: {
            fontSize: 12,
            color: "#fff",
          },
          icon: "rect",
        },
        grid: {
          top: 40,
          left: 30,
          bottom: 30,
          right: 20,
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#fff",
              fontSize: 14,
            },
            data: this.data.date,
          },
        ],
        yAxis: [
          {
            name: "",
            nameTextStyle: {
              color: "#fff",
              fontSize: 12,
              padding: [0, 0, 2, -5],
            },
            max: function (value) {
              if (value.max < 5) {
                return 5;
              } else {
                return value.max;
              }
            },
            type: "value",
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#fff",
              fontSize: 12,
              margin: 5,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(242,242,242,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "数据量",
            type: "bar",
            label: {
              show: true,
              position: "top",
              fontSize: 14,
              color: "#1977FA",
            },
            barMaxWidth: 60,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#1977FA", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#5BDEFF", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.data.evidenceCnt,
          },
          {
            name: "异常统计",
            type: "bar",
            label: {
              show: true,
              position: "top",
              fontSize: 14,
              color: "#0FFCFF",
            },
            barMaxWidth: 60,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#8AFFCF", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#0FFCFF", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.data.exceptionCnt,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>