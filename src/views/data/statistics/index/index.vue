<template>
  <div class="cover-page">
    <div class="content-container">
      <div
        class="board-entrance-container"
        :style="{ width: `${btnWidth}px` }"
        @mouseover="mouseOver(1)"
        @mouseout="mouseOut(1)"
      >
        <el-button
          class="list-btn"
          type="primary"
          @click="boardListBtnClicked"
        >
          <div class="topMessage">类统</div>
          <div class="bottomMessage">型计</div>
        </el-button>
        <el-button class="board-btn" type="text" @click="boardBtnClicked">
          <div class="topMessage">数分</div>
          <div class="bottomMessage">据析</div>
        </el-button>
      </div>
      <div class="top">
        <panel-group :data="panelGroupData"></panel-group>
      </div>
      <div class="mid">
        <div class="mid-left">
          <div class="topic-tltle">热度共享数据TOP10</div>
          <div class="strip-wrapper">
            <strip-chart :data="stripData"></strip-chart>
          </div>
        </div>
        <div class="mid-center">
          <div class="topic-tltle">各语料数据占比</div>
          <div class="pie-wrapper">
            <pie-chart :data="pieData"></pie-chart>
          </div>
        </div>
        <div class="mid-right">
          <div class="topic-tltle">能源数据数据量、异常统计</div>
          <div class="histogram-wrapper">
            <histogram-chart :data="histogramData"></histogram-chart>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="topic-tltle">各能源数据本月数据折线图</div>
        <div class="line-wrapper">
          <line-chart
            :style="{ height: '100%', width: '100%' }"
            :data="lineData"
          ></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from "./chart/PanelGroup.vue";
import StripChart from "./chart/StripChart.vue";
import PieChart from "./chart/PieChart.vue";
import HistogramChart from "./chart/HistogramChart.vue";
import LineChart from "./chart/LineChart.vue";
import {
  getPanelGroupData,
  getStripData,
  getPieData,
  getHistogramData,
} from "./manager.js";
import { getLineData } from "../board2/manager.js";
export default {
  inject: ["reload"],
  components: {
    PanelGroup,
    StripChart,
    PieChart,
    HistogramChart,
    LineChart,
  },
  data() {
    return {
      btnWidth: 40,
      panelGroupData: [],
      stripData: [],
      pieData: [],
      histogramData: {},
      lineData: {},
    };
  },
  mounted() {
    this.getData();

    window.onresize = () => {
      this.pageResize(this.reload, 300);
    };

    setTimeout(() => {
      this.btnWidth = 20;
    }, 5000);
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

    // 移入
    mouseOver(idx) {
      this.btnWidth = 40;
    },

    // 移出
    mouseOut(idx) {
      this.btnWidth = 20;
    },

    async getData() {
      const panelGroupData = getPanelGroupData();
      const stripData = getStripData();
      const pieData = getPieData();
      const histogramData = getHistogramData();
      const lineData = getLineData();

      this.panelGroupData = await panelGroupData;
      this.stripData = await stripData;
      this.pieData = await pieData;
      this.histogramData = await histogramData;
      this.lineData = await lineData;
    },

    boardListBtnClicked() {
      const page = this.$router.resolve({
        path: "/board-list",
      });
      window.open(page.href, "_blank");
    },

    boardBtnClicked() {
      const page = this.$router.resolve({
        path: "/board",
      });
      window.open(page.href, "_blank");
    },
  },
};
</script>

<style lang="scss">
.el-button--text {
  color: #333333;
}
</style>
<style lang="scss" scoped>
.cover-page {
  position: absolute;
  background-size: cover;
  width: 100%;
  height: 100%;
  min-width: 880px;
  min-height: 470px;
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.content-container {
  position: absolute;
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  left: 25px;
  top: 25px;
  min-width: 980px;
  min-height: 470px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top {
  height: calc(14.951% - 16px);
  width: 100%;
  background-color: #07224a;
}

.topic-tltle {
  background-color: #032f70;
  height: 40px;
  line-height: 40px;
  width: 100%;
  color: #ffffff;
  font-size: 1em;
  font-weight: 600;
  box-sizing: border-box;
  padding-left: 16px;
}

.mid {
  height: calc(44.652% - 16px);
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .mid-left {
    height: 100%;
    width: calc(38.564% - 16px);
    background-color: #07224a;

    .strip-wrapper {
      height: calc(100% - 40px);
      width: 100%;
    }
  }

  .mid-center {
    height: 100%;
    width: calc(29.061% - 16px);
    background-color: #07224a;

    .pie-wrapper {
      height: calc(100% - 40px);
      width: 100%;
    }
  }

  .mid-right {
    height: 100%;
    width: 32.707%;
    background-color: #07224a;

    .histogram-wrapper {
      height: calc(100% - 40px);
      width: 100%;
    }
  }
}

.bottom {
  height: calc(40.773%);
  width: 100%;
  background-color: #07224a;

  .line-wrapper {
    height: calc(100% - 40px);
    width: 100%;
  }
}

.board-entrance-container {
  position: absolute;
  height: 140px;
  width: 10px;
  background-color: #fff;
  border-radius: 4px;
  right: -25px;
  top: 260px;
  z-index: 999;
  overflow: hidden;
  transition: 0.3s;

  .list-btn {
    padding: 0;
    position: absolute;
    height: 70px;
    width: 40px;
    border-radius: 0;
    margin: 0;

    &:hover {
      background-color: #616afc;
      color: #ffffff;
    }
  }

  .topMessage {
    margin-bottom: 2px;
    letter-spacing:2px;
    margin-left: 1px;
  }

  .bottomMessage {
    letter-spacing:2px;
    margin-left: 1px;
  }

  .board-btn {
    padding: 0;
    position: absolute;
    height: 70px;
    width: 40px;
    border-radius: 0;
    top: 70px;
    margin: 0;

    &:hover {
      background-color: #37C0EA;
      color: #ffffff;
    }
  }
}
</style>
