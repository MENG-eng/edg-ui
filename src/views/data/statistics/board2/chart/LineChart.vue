<template>
  <div id="LineChart">
    <div id="mainLine" class="normal" ref="mainLine"></div>
  </div>
</template>
<script>
export default {
  name: "LineChart",
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
      colorList: [
        "rgba(65, 125, 233",
        "rgba(63, 255, 234",
        "rgba(168, 114, 57",
        "rgba(122, 162, 132",
        "rgba(255, 137, 85",
        "rgba(254, 84, 84",
        "rgba(255, 210, 1",
        "rgba(29, 202, 255",
        "rgba(148, 78, 255",
        "rgba(72, 211, 108",
        "rgba(1, 109, 255",
      ],
    };
  },
  methods: {
    drawChart() {
      if (this.chart) {
        this.chart.setOption();
      }
      // 基于准备好的dom，初始化echarts实例
      if (!this.$refs["mainLine"]) {
        return;
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["mainLine"]);
      this.chart = myChart;

      // 指定图表的配置项和数据
      var charts = {
        unit: "",
        names: this.data.typeList,
        lineX: this.data.dateList,
        value: this.data.cntList,
      };
      var color = this.colorList;
      var lineY = [];

      for (var i = 0; i < charts.names.length; i++) {
        var x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        var data = {
          name: charts.names[i],
          type: "line",
          color: color[x] + ")",
          smooth: true,
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: color[x] + ", 0.8)",
                  },
                  {
                    offset: 0.8,
                    color: color[x] + ", 0.5)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10,
            },
          },
          symbol: "circle",
          symbolSize: 5,
          data: charts.value[i],
        };
        lineY.push(data);
      }

      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: charts.names,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 12,
            color: "#00CDFF",
          },
          top: "-1%",
        },
        grid: {
          top: "14%",
          left: "4%",
          right: "8%",
          bottom: "4%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: charts.lineX,
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
            formatter: function (params) {
              return params.split(" ")[0];
            },
          },
        },
        yAxis: {
          name: charts.unit,
          type: "value",
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(242,242,242,0.2)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(242,242,242,0.2)",
            },
          },
        },
        series: lineY,
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>