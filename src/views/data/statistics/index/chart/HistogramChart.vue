<template>
  <div class="container">
    <div id="histogramChart" class="container"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  mounted() {},

  watch: {
    data(newValue, oldValue) {
      this.$nextTick(() => {
        this.drawChart();
      });
    },
  },

  methods: {
    drawChart() {
      let myChart = this.$echarts.init(
        document.getElementById("histogramChart")
      );

      var type = this.data.type;
      var value1 = this.data.value1;
      var value2 = this.data.value2;
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
        grid: {
          top: "20%",
          left: "7%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          data: ["数据量", "异常统计"],
          right: "3%",
          top: "4%",
          textStyle: {
            color: "#A1D5FF",
            fontSize: 12,
          },
          itemWidth: 12, // 设置宽度
          itemHeight: 12, // 设置高度
          itemGap: 12, // 设置间距
        },
        xAxis: [
          {
            data: type,
            axisLabel: {
              margin: 10,
              color: "#A1D5FF",
              textStyle: {
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {
                color: "#102E74",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#A1D5FF",
              textStyle: {
                fontSize: 12,
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#102E74",
              },
            },
          },
        ],
        series: [
          {
            name: "数据量",
            type: "bar",
            data: value1,
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
          },
          {
            name: "异常统计",
            type: "bar",
            data: value2,
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
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100% !important;
  width: 100% !important;
  overflow: hidden;
}
</style>