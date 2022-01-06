<template>
  <div class="container">
    <div :id="`proportionFrequencyChart${tag}`" class="container"></div>
  </div>
</template>

<script>
import { colors } from "../manager.js";
export default {
  props: {
    tag: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.drawChart();
    });
  },

  methods: {
    drawChart() {
      const { proportion } = this.data;
      const { name } = this.data;
      
      const that = this;
      const thisColor = colors[that.tag % colors.length]
      let myChart = this.$echarts.init(
        document.getElementById(`proportionFrequencyChart${this.tag}`)
      );

      let option = {
        title: [
          {
            text: `${parseInt(proportion) || 0}%`,
            x: "center",
            bottom: '45%',
            textStyle: {
              fontSize: 18,
              color: "#19fcff",
              //   fontFamily: "DINAlternate-Bold, DINAlternate",
              fontWeight: "800",
            },
          },
          {
            text: `${name}`,
            x: "center",
            top: '50%',
            textStyle: {
              fontSize: 14,
              color: "#FFFFFF",
              //   fontFamily: "DINAlternate-Bold, DINAlternate",
              fontWeight: "600",
            },
          },
        ],
        polar: {
          radius: ["42%", "52%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          // 内圆
          {
            name: "",
            type: "pie",
            startAngle: 80,
            hoverAnimation: false,
            radius: ["56%"],
            center: ["50%", "50%"],

            itemStyle: {
              color: "rgba(66, 66, 66, .0)",
              borderWidth: 1,
              borderColor: thisColor,
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [100],
          },

          {
            name: "",
            type: "pie",
            startAngle: 270,
            hoverAnimation: false,

            radius: ["62%", "74%"],
            center: ["50%", "50%"],
            itemStyle: {
              color: function (params) {
                return [thisColor, "rgba(0, 0, 0, 0.0)"][
                  params.dataIndex
                ];
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [parseFloat(proportion), 100 - parseFloat(proportion)],
          },

          // 外圆
          {
            type: "pie",
            z: 1,
            silent: true,
            radius: ["80%", "82%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },

            data: _outPie(),
          },
        ],
      };

      function _outPie() {
        let dataArr = [];
        for (var i = 0; i < 100; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 25,
              itemStyle: {
                normal: {
                  color: thisColor,
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0)",
                },
              },
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 20,
              itemStyle: {
                normal: {
                  color: "rgba(0,0,0,0)",
                  borderWidth: 0,
                  borderColor: "rgba(0,0,0,0)",
                },
              },
            });
          }
        }
        return dataArr;
      }

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