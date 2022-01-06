<template>
  <div class="panel-container">
    <div
      class="panel"
      v-for="(item, idx) in data"
      :key="item.id"
      :style="{ background: colors[idx] }"
    >
      <div class="left">
        <div class="text-container">
          <div class="left-top">{{ item.value }}</div>
          <div class="left-bottom">{{ item.name }}</div>
        </div>
      </div>
      <div class="right">
        <div
          class="bg-shadow"
        >
          <svg-icon :icon-class="item.icon || 'add'" class-name="icon" />
        </div>
      </div>
    </div>
  </div>
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
      bgH: 0,
      bgW: 0,
      colors: ["#1977FA", "#56CC73", "#FFA720", "#37C0EA", "#5B81FE"],
    };
  },
};
</script>

<style lang="scss" scoped>
.panel-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.panel {
  flex: 1;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text-container {
      margin: auto auto auto 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      .left-top {
        color: #ffffff;
        font-size: 22px;
        font-weight: bold;
        width: 100%;
        white-space: nowrap;
      }
      .left-bottom {
        color: #ffffff;
        font-size: 16px;
        width: 100%;
        white-space: nowrap;
      }
    }
  }
  .right {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .bg-shadow {
      width: 4vw;
      height: 8vh;
      border-radius: 50%;
      background-color: rgba($color: #000000, $alpha: 0.08);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 40px;
        color: #ffffff;
        padding: 2px;
      }
    }
  }
}
</style>