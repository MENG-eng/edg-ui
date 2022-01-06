<template>
  <div class="container">
    <div id="pieChart" class="container"></div>
  </div>
</template>

<script>
import { colors } from "../../board3/manager";
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      timer: null,
    };
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
      let that = this;
      clearInterval(that.timer);

      let myChart = that.$echarts.init(document.getElementById("pieChart"));
      const data = that.data;

      var seriesData = data;
      var colorList = colors;
      var legendData = [];
      data.map((item) => {
        legendData.push(item.name);
      });
      var option = {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          trigger: "item",
          borderColor: "rgba(255,255,255,.3)",
          backgroundColor: "rgba(13,5,30,.6)",
          borderWidth: 1,
          padding: 5,
          formatter: function (parms) {
            var str =
              parms.marker +
              "" +
              parms.data.name +
              "</br>" +
              "数量：" +
              parms.data.value +
              "</br>" +
              "占比：" +
              parms.percent +
              "%";
            return str;
          },
        },
        series: [
          {
            type: "pie",
            z: 2,
            center: ["50%", "50%"],
            radius: ["40%", "60%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                borderColor: "#0A1934",
                borderWidth: 0,
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{a|{b}：{c}}\n{hr|}",
              rich: {
                a: {
                  padding: [-30, 5, -5, 5],
                },
              },
            },
            labelLine: {
              normal: {
                length: 18,
                length2: 0,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: seriesData,
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
                  color: "#1a73c7",
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

      let dat = legendData[0];
      let _t = 0;

      that.timer = setInterval(() => {
        // 取消之前高亮的图形
        myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: _t,
        });

        _t++;
        if (_t > legendData.length - 1) _t = 0;

        // 高亮当前图形
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: _t,
        });
      }, 3000);
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