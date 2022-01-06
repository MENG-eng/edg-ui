<template>
  <div class="container">
    <div id="stripChart" class="container"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
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
      let myChart = this.$echarts.init(document.getElementById("stripChart"));

      const data = this.data;
      let type_list = [];
      let val_list = [];
      data.map((item) => {
        type_list.push(item.name);
        val_list.push(item.value);
      });

      let option = {
        grid: {
          left: "3%",
          right: "3%",
          bottom: "2%",
          top: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          formatter: function (params) {
            return (
              params[0].name +
              "<br/>" +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
              params[0].seriesName +
              " : " +
              Number(params[0].value).toLocaleString() +
              "<br/>"
            );
          },
        },
        //backgroundColor: "rgb(20,28,52)",
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
            data: type_list,
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
              formatter: function (value) {
                return value.toLocaleString();
              },
            },
            data: val_list,
          },
        ],
        series: [
          {
            name: "热度",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              normal: {
                //barBorderRadius: 6,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: "#0054FF",
                  },
                  {
                    offset: 1,
                    color: "#25E3FF",
                  },
                ]),
              },
            },
            barWidth: 12,
            data: val_list,
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 12,
            barGap: "-100%",
            data: val_list,
            itemStyle: {
              normal: {
                color: "rgba(24,31,68,1)",
                //barBorderRadius: 6,
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