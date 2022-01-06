<template>
  <el-scrollbar class="el-scrollbar__wrap">
    <img class="bg" src="@/assets/board5/bg.jpg" alt="" />
    <div class="full-page">
      <div class="content-container">
        <div class="content-left">
          <div class="content-left-top">
            <div class="left-chart-container">
              <div>
                <board-container>
                  <div class="topic-tag">
                    <img src="@/assets/board5/tag1.png" alt="" />
                  </div>
                  <div class="panel-wrapper">
                    <count-panel :data="deptPanelData"></count-panel>
                  </div>
                </board-container>
              </div>
              <div>
                <board-container>
                  <div class="topic-tag">
                    <img src="@/assets/board5/tag2.png" alt="" />
                  </div>
                  <div class="panel-wrapper">
                    <count-panel :data="energyPanelData"></count-panel>
                  </div>
                </board-container>
              </div>
              <div>
                <board-container>
                  <div class="topic-tag">
                    <img src="@/assets/board5/tag3.png" alt="" />
                  </div>
                  <div class="panel-wrapper">
                    <count-panel :data="evidencePanelData"></count-panel>
                  </div>
                </board-container>
              </div>
            </div>
            <div class="mid-img-space"></div>
            <div class="mid-img">
              <img src="@/assets/board5/main.png" class="main-img" alt="" />
            </div>
          </div>
          <div class="content-left-bottom">
            <div>
              <board-container :style="{ paddingTop: '0.5vh' }">
                <div class="topic-tag">
                  <img src="@/assets/board5/tag4.png" alt="" />
                </div>
                <div class="proportion-wrapper">
                  <proportion-share-panel
                    :data="sharePanelData"
                  ></proportion-share-panel>
                </div>
              </board-container>
            </div>
            <div>
              <board-container :style="{ paddingTop: '0.5vh' }">
                <div class="topic-tag">
                  <img src="@/assets/board5/tag5.png" alt="" />
                </div>
                <div class="proportion-wrapper">
                  <proportion-frequency-panel
                    :data="frequencyPanelData"
                  ></proportion-frequency-panel>
                </div>
              </board-container>
            </div>
          </div>
        </div>
        <div class="content-right">
          <board-container>
            <div class="top">
              <div class="topic-tag">
                <img src="@/assets/board5/tag6.png" alt="" />
              </div>
              <div class="article-statics">
                <article-panel :data="deptArticlePanelData"></article-panel>
              </div>
            </div>
            <div class="space-line">
              <img src="@/assets/img/line-board.png" class="sep-line" alt="" />
            </div>

            <div class="mid">
              <div class="topic-tag">
                <img src="@/assets/board5/tag7.png" alt="" />
              </div>
              <div class="pie-wrapper">
                <pie-chart :data="articleData"></pie-chart>
              </div>
            </div>
            <div class="space-line">
              <img src="@/assets/img/line-board.png" class="sep-line" alt="" />
            </div>
            <div class="bottom">
              <div class="topic-tag">
                <img src="@/assets/board5/tag8.png" alt="" />
              </div>
              <div class="strip-wrapper">
                <strip-chart :data="articleData"></strip-chart>
              </div>
            </div>
          </board-container>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import BoardContainer from "./chart/BoardContainer.vue";
import CountPanel from "./chart/CountPanel.vue";
import ProportionSharePanel from "./chart/ProportionSharePanel.vue";
import ProportionFrequencyPanel from "./chart/ProportionFrequencyPanel.vue";
import ArticlePanel from "./chart/ArticlePanel.vue";
import PieChart from "./chart/PieChart.vue";
import StripChart from "./chart/StripChart.vue";
import {
  getDeptPanelData,
  getEnergyTypePanelData,
  getEvidencePanelData,
  getSharePanelData,
  getFrequencyPanelData,
  getDeptArticlePanelData,
  getArticleData,
} from "./manager.js";
export default {
  inject: ["reload"],
  components: {
    BoardContainer,
    CountPanel,
    ProportionSharePanel,
    ProportionFrequencyPanel,
    ArticlePanel,
    PieChart,
    StripChart,
  },
  data() {
    return {
      deptPanelData: [],
      energyPanelData: [],
      evidencePanelData: [],
      sharePanelData: [],
      frequencyPanelData: [],
      deptArticlePanelData: [],
      articleData: [],
    };
  },
  mounted() {
    window.onresize = () => {
      this.pageResize(this.reload, 300);
    };
    this.getData();

    // 定时刷新
    const timer = setInterval(() => {
      this.getData();
    }, 10 * 60 * 1000);
    this.$on("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
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
      const deptPanelData = getDeptPanelData();
      const energyPanelData = getEnergyTypePanelData();
      const evidencePanelData = getEvidencePanelData();
      const sharePanelData = getSharePanelData();
      const frequencyPanelData = getFrequencyPanelData();
      const deptArticlePanelData = getDeptArticlePanelData();
      const articleData = getArticleData();

      this.deptPanelData = await deptPanelData;
      this.energyPanelData = await energyPanelData;
      this.evidencePanelData = await evidencePanelData;
      this.sharePanelData = await sharePanelData;
      this.frequencyPanelData = await frequencyPanelData;
      this.deptArticlePanelData = await deptArticlePanelData;
      this.articleData = await articleData;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  object-fit: fill;
  width: calc(100vw);
  height: calc(100vh);
  z-index: -999;
}

.full-page {
  position: absolute;
  background-size: cover;
  width: calc(100vw);
  height: calc(100vh);
  margin: 0;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  min-height: 570px;
  min-width: 800px;
}

.content-container {
  position: absolute;
  width: 93.281%;
  height: 83.296%;
  left: 3.4896%;
  top: 13.056%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .content-left {
    height: 100%;
    width: 72.864%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content-left-top {
      width: 100%;
      height: 69.213%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .left-chart-container {
        height: 100%;
        width: 26.471%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        div {
          height: 31.126%;
          width: 100%;
          //background-color: burlywood;
          overflow: hidden;

          .panel-wrapper {
            width: 100%;
            height: 62.766%;
            margin: 1.534% 0 0 0;
          }
        }
      }
    }

    .content-left-bottom {
      width: 100%;
      height: 28.05%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      div {
        width: 49.191%;
        height: 100%;
        //background-color: burlywood;
        .proportion-wrapper {
          margin: 3.289% 0 0 0;
          height: 60.977%;
          width: 100%;
        }
      }
    }
  }

  .content-right {
    height: 100%;
    width: 25.963%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    //padding: 0.8939% 0.5587%;

    .space-line {
      width: 100%;
      height: 0.683%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .sep-line {
        width: 100%;
        height: 2px;
      }
    }

    .top {
      width: 100%;
      height: 19.704%;
      //background-color: burlywood;

      .article-statics {
        width: 95.698%;
        height: 62.381%;
        margin: 2.366% 2.151% 0 2.151%;
        //background-color: blueviolet;
      }
    }

    .mid {
      width: 100%;
      height: 34.055%;
      //background-color: burlywood;
      overflow: hidden;

      .pie-wrapper {
        width: 95.698%;
        height: 85.381%;
        margin: 2.366% 2.151% 0 2.151%;
        //background-color: blueviolet;
      }
    }

    .bottom {
      width: 100%;
      height: 42.875%;
      //background-color: burlywood;

      .strip-wrapper {
        width: 95.698%;
        height: 86.381%;
        margin: 2.366% 2.151% 0 2.151%;
        //background-color: blueviolet;
      }
    }
  }
}

.mid-img-space {
  height: 100%;
  width: 4.676%;
}

.mid-img {
  height: 100%;
  width: 64.706%;

  .main-img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}

.topic-tag {
  width: 100%;
  height: 26.5px !important;
  box-sizing: border-box;
  padding-left: 10px;
  margin-top: 1vh;

  img {
    display: block;
    height: 100%;
    width: auto;
  }
}
</style>