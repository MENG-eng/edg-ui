<template>
  <div class="container">
    <div :id="`proportionShareChart${tag}`" class="container"></div>
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

  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.drawChart();
    });
  },

  methods: {
    drawChart() {
      const { proportion } = this.data;
      
      let that = this;
      let myChart = this.$echarts.init(
        document.getElementById(`proportionShareChart${this.tag}`)
      );
      let option = {
        //backgroundColor: "#180f2a",
        title: [
          {
            text: `${parseInt(proportion) || 0}%`,
            x: "center",
            y: "center",
            textStyle: {
              fontSize: 20,
              color: "#19fcff",
              fontWeight: "800",
            },
          },
        ],
        polar: {
          radius: ["56%", "52%"],
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
          //   {
          //     name: '',
          //     type: 'bar',
          //     roundCap: true,
          //     barWidth: 60,
          //     showBackground: true,
          //     backgroundStyle: {
          //         color: '#2e2856',
          //     },
          //     data: [80],
          //     coordinateSystem: 'polar',
          //     itemStyle: {
          //         normal: {
          //             color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          //                 offset: 0,
          //                 color: '#585fe1'
          //             }, {
          //                 offset: 1,
          //                 color: '#0ff'
          //             }]),
          //         }
          //     }
          // },

          // 内圆
          {
            type: "pie",
            z: 1,
            silent: true,
            radius: ["62%", "74%"],
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

      myChart.setOption(option);

      function _outPie() {
        let dataArr = [];
        for (var i = 0; i < 100; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 8,
              itemStyle: {
                normal: {
                  color:
                    i < parseFloat(proportion)
                      ? colors[(that.tag - 3) % colors.length]
                      : "#252046",
                  borderWidth: 0,
                  borderColor: "#020a4d",
                },
              },
            });
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 2,
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