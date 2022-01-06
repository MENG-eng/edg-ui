<template>
  <div id="PieChart">
    <div ref="mainPie" id="mainPie" class="normal"></div>
  </div>
</template>
<script>

export default {
  name: "PieChart",
  props: {
    data: {
      type: Array,
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
      colorList: [
        "#0FFCFF",
        "#48D36C",
        "#016DFF",
        "#FFD201",
        "#FF8955",
        "#FE5454",
        "#3FFFEA",
        "#417DE9",
        "#A87239",
        "#7AA284",
        "#1DCAFF",
        "#944EFF",
      ],
      chart: null,
    };
  },
  methods: {
    drawChart() {
      if (this.chart) {
        this.chart.setOption();
      }
      // 基于准备好的dom，初始化echarts实例
      if (!this.$refs["mainPie"]) {
        return;
      }
      let myChart = this.$echarts.init(this.$refs["mainPie"]);
      this.chart = myChart;

      // 指定图表的配置项和数据
      let index = 0;
      var colorList = this.colorList;
      
      let option = {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            fontSize: 20,
          },
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["35%", "60%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex % colorList.length];
                },
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12],
                },
                a: {
                  padding: [-30, 5, -20, 5],// [圆点边距(2)，内容title边距(2)]
                },
              },
            },
            labelLine: {
              normal: {
                length: 15,
                length2: 20,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: this.data,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>