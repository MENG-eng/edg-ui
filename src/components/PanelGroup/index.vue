<template>
  <el-row :gutter="40" class="panel-group">
    <el-col
      :xs="12"
      :sm="12"
      :lg="4.8"
      class="card-panel-col"
      :style="{ width: `${100.0 / panelData.length}%` }"
      v-for="item in panelData"
      :key="item.type"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('newVisitis')"
        :style="{ backgroundColor: `${item.color}` }"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">{{ item.type || "未知" }}</div>
          <div class="card-panel-text">{{ item.increase || "未知" }}</div>
        </div>
        <div :class="`card-panel-icon-wrapper icon-${item.icon || 'peoples'}`">
          <svg-icon
            :icon-class="item.icon || 'peoples'"
            class-name="card-panel-icon"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      panelData: this.data,
    };
  },
  mounted() {},
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 108px;
    //cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #ffffff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 5px;


    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    // &:hover {
    //   .card-panel-icon-wrapper {
    //     color: #fff;
    //   }

    //   .icon-peoples {
    //     background: #40c9c6;
    //   }

    //   .icon-message {
    //     background: #36a3f7;
    //   }

    //   .icon-money {
    //     background: #f4516c;
    //   }

    //   .icon-shopping {
    //     background: #34bfa3;
    //   }
    // }

    .icon-todayCount,
    .icon-totalCount,
    .icon-share,
    .icon-energyData,
    .icon-consumer,
    .icon-create,
    .icon-add,
    .icon-copy,
    .icon-modify {
      color: #ffffff;
    }

    .card-panel-icon-wrapper {
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.08);
      margin-right: 5%;
    }

    .card-panel-icon {
      float: left;
      font-size: 32px;
    }

    .card-panel-description {
      font-weight: bold;
      width: max-content;
      margin-left: 5%;
      margin-top: 10px;

      .card-panel-text {
        line-height: 18px;
        color: #ffffff;
        font-size: 16px;
        margin-bottom: 10px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  //   .card-panel-description {
  //     display: none;
  //   }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

// 个人中心
#userPanel {
  .card-panel-text {
    color: #ffffff;
  }
}
</style>
