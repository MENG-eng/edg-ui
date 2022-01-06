<template>
  <div>
    <dv-scroll-board
      :config="configmomentData"
      style="
        width: 98%;
        height: 94%;
        margin: 1% 1% 0% 1%;
        padding: 0px;
      "
    />
  </div>
</template>

<script>
import { momentOpt } from "../../../../../api/data/statistics";
export default {
  name: "TablePanel",
  data() {
    return {
      /** 实时数据 */
      headerdMoment: [], //表头数据
      dataMoment: [],
      configmomentData: {},
    };
  },
  mounted() {
    momentOpt().then((response) => {
      if (response.code === 200) {
        this.headerdMoment = ["操作人", "类型", "操作时间", "操作描述"];
        for (let i = 0; i < response.data.length; i++) {
          this.dataMoment[i] = [
            response.data[i].operator,
            this.handleOptType(response.data[i].optType),
            response.data[i].evidenceNodeCreateTime,
            response.data[i].description,
          ];
        }

        this.configmomentData = {
          data: this.dataMoment,
          header: this.headerdMoment, // 表头数据
          headerBGC: "rgba(0, 0, 64, .4)", //"none !important", // 表头背景色
          columnWidth: [80, 50, 160], // 列宽
          // oddRowBGC: "rgba(130, 177, 217, .4)", // 奇数行背景色
          // evenRowBGC: "rgba(66, 93, 153, .4)", // 偶数行背景色
          oddRowBGC: "none !important", // 奇数行背景色
          evenRowBGC: "none !important", // 偶数行背景色
          waitTime: 2000, // 轮播时间间隔(ms)
          rowNum: 5,
          align: ["center", "center", "center", "left"],
        };
      }
    });
  },
};
</script>

<style lang="scss">
.dv-scroll-board {
  border: 1px solid rgba(255, 255, 255, .2);

  .header {
    font-size: 1em;
    .header-item {
      padding: 0;
      color: #fff;
    }
  }

  .rows {
    .row-item {
      text-align: left;
      border-radius: 0px;
      padding: 0;
      border-top: 1px solid rgba(242, 242, 242, .2);
      .ceil {
        padding: 0;
        color: #43DAFF;
        font-size: 0.85em;
      }
    }
  }
}
</style>
