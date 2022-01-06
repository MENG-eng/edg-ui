<template>
  <div id="cover-page">
    <img src="../../../../assets/img/board2-bg-img.jpg" alt="" id="chart-img" />
    <div id="board-container">
      <div id="info-container">
        <div id="left-container">
          <div id="panel-container">
            <board-panel>
              <div class="top-info">
                <div id="panel-dom">
                  <info-panel class="normal">
                    <img
                      src="../../../../assets/img/evidence.png"
                      alt=""
                      :style="{ marginLeft: `${imgCenter}px` }"
                    />
                    <div class="frame" :style="{ width: `${frameW}px` }">
                      <div class="card-panel-text">{{ todayCount || 0 }}</div>
                      <div class="card-panel-tips">今日存证笔数</div>
                    </div>
                  </info-panel>
                </div>
                <div id="panel-dom">
                  <info-panel class="normal">
                    <img
                      src="../../../../assets/img/share.png"
                      alt=""
                      :style="{ marginLeft: `${imgCenter}px` }"
                    />
                    <div class="frame" :style="{ width: `${frameW}px` }">
                      <div class="card-panel-text">{{ share || 0 }}</div>
                      <div class="card-panel-tips">今日共享次数</div>
                    </div>
                  </info-panel>
                </div>
                <div id="panel-dom">
                  <info-panel class="normal">
                    <img
                      src="../../../../assets/img/user.png"
                      alt=""
                      :style="{ marginLeft: `${imgCenter + 4}px` }"
                    />
                    <div class="frame" :style="{ width: `${frameW}px` }">
                      <div class="card-panel-text">{{ userActivity || 0 }}</div>
                      <div class="card-panel-tips">用户活跃度</div>
                    </div>
                  </info-panel>
                </div>
              </div>
              <div class="center-info">
                <div id="img-dom">
                  <div class="frame1">
                    <img
                      src="../../../../assets/img/img1.png"
                      alt=""
                      :style="{ height: `${imgH}px`, width: `${imgW}px` }"
                    />
                    <img
                      src="../../../../assets/img/kuang1.png"
                      alt=""
                      style="margin-left: 20px; margin-top: 5%"
                      :style="{ height: `${kuangH}px`, width: `${kuangW}px` }"
                    />
                    <div
                      class="kuang"
                      :style="{
                        height: `${kuangH}px`,
                        width: `${kuangW}px`,
                        marginLeft: `${-kuangW}px`,
                      }"
                    >
                      <div class="card-panel-text1">{{ totalCount || 0 }}</div>
                      <div class="card-panel-tips">总存证量(笔)</div>
                    </div>
                  </div>
                </div>
                <div id="img-dom">
                  <div class="frame1">
                    <img
                      src="../../../../assets/img/img2.png"
                      alt=""
                      :style="{ height: `${imgH}px`, width: `${imgW1}px` }"
                    />
                    <img
                      src="../../../../assets/img/kuang1.png"
                      alt=""
                      style="margin-left: 20px; margin-top: 5%"
                      :style="{ height: `${kuangH}px`, width: `${kuangW}px` }"
                    />
                    <div
                      class="kuang"
                      :style="{
                        height: `${kuangH}px`,
                        width: `${kuangW}px`,
                        marginLeft: `${-kuangW}px`,
                      }"
                    >
                      <div class="card-panel-text1">
                        {{ fileSizeStatistics || 0 }}
                      </div>
                      <div class="card-panel-tips">能源大数据存量(GB)</div>
                    </div>
                  </div>
                </div>
              </div>
            </board-panel>
          </div>
          <div id="data-chart-container">
            <div id="heat-share">
              <board-panel>
                <img src="../../../../assets/img/heatShare.png" alt="" />
                <x-bar-chart class="common" :data="xBarData" />
              </board-panel>
            </div>
            <div id="evidence-proportion">
              <board-panel>
                <img src="../../../../assets/img/eviProportion.png" alt="" />
                <pie-chart class="common" :data="pieData" />
              </board-panel>
            </div>
          </div>
        </div>
        <div id="right-container">
          <div id="energy-data-container">
            <div id="evidence-error-statistics">
              <board-panel>
                <img src="../../../../assets/img/eviError.png" alt="" />
                <y-bar-chart class="common" :data="yBarData" />
              </board-panel>
            </div>
            <div id="evidence-month">
              <board-panel>
                <img src="../../../../assets/img/eviMonth.png" alt="" />
                <line-chart class="common" :data="LineData" />
              </board-panel>
            </div>
            <div id="opt-statistics">
              <board-panel>
                <img src="../../../../assets/img/optRecord.png" alt="" />
                <table-panel class="common"></table-panel>
              </board-panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "./chart/LineChart";
import PieChart from "./chart/PieChart";
import XBarChart from "./chart/xBarChart";
import YBarChart from "./chart/yBarChart";
import TablePanel from "./chart/optTable";
import BoardPanel from "./chart/BoardPanel";
import InfoPanel from "./chart/InfoPanel";
import {
  gettotalInfoData,
  getuserActivityData,
  getfileSizeStatisticsData,
  getpieData,
  getxBarData,
  getyBarData,
  getLineData,
} from "./manager";
import OptTable from "./chart/optTable.vue";

export default {
  inject: ["reload"],
  components: {
    BoardPanel,
    InfoPanel,
    LineChart,
    PieChart,
    XBarChart,
    YBarChart,
    TablePanel,
  },
  data() {
    return {
      // img-centerIcon
      imgCenter: 0,

      // div-centerInfo
      frameW: 0,

      // img
      imgH: 0,
      imgW: 0,
      imgW1: 0,

      // kuang
      kuangH: 0,
      kuangW: 0,

      totalInfoData: {},
      // 今日存证量
      todayCount: "",
      // 今日共享量
      share: "",
      // 用户活跃度
      userActivity: "",
      // 总存证量
      totalCount: "",
      // 能源大数据存量
      fileSizeStatistics: "",
      // 各能源数据占比
      pieData: [],
      // 热度共享数据排名
      xBarData: {},
      // 能源存证量以及异常统计
      yBarData: {},
      // 能源数据本月存证量
      LineData: {},
    };
  },
  mounted() {
    this.getData();
    window.onresize = () => {
      this.pageResize(this.reload, 300);
    };

    // dom 边距计算
    const containerW = document.getElementById("panel-dom").scrollWidth;
    this.imgCenter = containerW / 4 - 20;
    this.frameW = containerW / 2 + 1;

    // img 大小计算
    const imgInfo = document.getElementById("img-dom").scrollHeight;
    this.imgH = imgInfo;
    this.imgW = imgInfo * 0.65;
    this.imgW1 = imgInfo * 0.8;
    this.kuangH = imgInfo * 0.4;
    this.kuangW = this.kuangH * 2.2;
  },
  methods: {
    /** 页面重绘 */
    pageResize(func, delay) {
      return (function (args) {
        let that = this;
        let _args = args;
        clearTimeout(func.timer);
        func.timer = setTimeout(function () {
          func.call(that, _args);
        }, delay);
      })();
    },

    async getData() {
      // 各能源存证占比数据
      const pieData = getpieData();
      // 热度共享数据排名
      const xBarData = getxBarData();
      // 各能源数据存证量、异常统计
      const yBarData = getyBarData();
      // 各能源数据本月存证量
      const LineData = getLineData();
      // panelInfo -- data
      const totalInfoData = gettotalInfoData();
      // 用户活跃度
      const userActivity = getuserActivityData();
      // 能源大数据存量
      const fileSizeStatistics = getfileSizeStatisticsData();

      this.totalInfoData = await totalInfoData;
      // 今日存证量
      this.todayCount = this.totalInfoData.todayCount;
      // 今日共享次数
      this.share = this.totalInfoData.share;
      // 总存证量
      this.totalCount = this.totalInfoData.totalCount;

      this.userActivity = await userActivity;
      this.fileSizeStatistics = await fileSizeStatistics;
      this.pieData = await pieData;
      this.xBarData = await xBarData;
      this.yBarData = await yBarData;
      this.LineData = await LineData;
    },
  },
};
</script>

<style lang="scss" scoped>
.common {
  height: calc(100% - 40px);
}

img {
  height: 40px;
}

#cover-page {
  position: absolute;
  background-size: cover;
  width: 100%;
  height: 100%;
  min-width: 880px;
  min-height: 570px;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
}

#chart-img {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
}

#board-container {
  margin: 5.5% 16px 0 16px;
  height: calc(87%);
  width: calc(100% - 32px);
}

#info-container {
  width: 100%;
  height: 100%;
}

#left-container {
  width: 60%;
  height: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#right-container {
  width: 40%;
  height: 100%;
  display: inline-block;
}

#panel-container {
  width: 100%;
  height: 50%;
  padding: 15px;
}

.top-info {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

#panel-dom {
  width: 30%;
}

.frame {
  height: 64%;
  position: absolute;
  right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-panel-text {
  color: #00e4ff;
  font-size: 1.4em;
  font-weight: 600;
}

.card-panel-text1 {
  color: #6ceff1;
  font-size: 1.8em;
  font-weight: 600;
}

.card-panel-tips {
  color: #fff;
  font-size: 1em;
}

.center-info {
  width: 100%;
  height: 60%;
  margin-top: -5%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

#img-dom {
  width: 50%;
  position: relative;
}

.frame1 {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.kuang {
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#data-chart-container {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 15px 15px 15px;
}

#heat-share {
  width: 48%;
}

#evidence-proportion {
  width: 48%;
}

#energy-data-container {
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#evidence-error-statistics {
  width: 100%;
  height: 31%;
}

#evidence-month {
  width: 100%;
  height: 31%;
}

#opt-statistics {
  width: 100%;
  height: 35%;
}
</style>