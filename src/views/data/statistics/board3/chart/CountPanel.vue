<template>
  <div class="count-panel-container">
    <div
      class="c"
      v-for="(item, index) in data"
      :key="index"
      :style="{ left: `${(index - idx) * 31.624}%` }"
    >
      <div class="space"></div>
      <div class="count-panel">
        <div class="icon-container">
          <img :src="icons[index%5]" alt="" />
        </div>
        <div :style="{ height: '7.475%' }"></div>
        <div class="energy-type">{{ item.name }}</div>
        <div :style="{ height: '6.780%' }"></div>
        <div
          class="energy-statis"
          :style="{ color: `${textColor[index % 2]}` }"
        >
          {{ item.count }}{{ item.des }}
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
      idx: 0,
      textColor: ["#00faa8", "#FFD74A"],
      icons: [
        require("@/assets/board5/energy1.png"),
        require("@/assets/board5/energy2.png"),
        require("@/assets/board5/energy3.png"),
        require("@/assets/board5/energy4.png"),
        require("@/assets/board5/energy5.png"),
      ],
    };
  },
  mounted() {
    const timer = setInterval(() => {
      this.idx++;
      if (this.idx > this.data.length - 3) {
        this.idx = 0;
      }
    }, 3000);
    this.$on("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
};
</script>

<style lang="scss" scoped>
.count-panel-container {
  height: 100% !important;
  width: 100% !important;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
}

.c {
  display: flex;
  flex-direction: row;
  //display: block;
  height: 100%;
  width: 31.624%;
  position: absolute;
  transition: 0.5s !important;
}

.count-panel {
  height: 100%;
  width: 82.883%;
  background-color: #070982;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon-container {
    width: 54.348%;
    height: 42.373%;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .energy-type {
    color: #00cdff;
    font-size: 0.8em;
    height: 0.8em;
  }

  .energy-statis {
    color: #00faa8;
    font-size: 0.8em;
    height: 0.8em;
    font-weight: bold;
  }
}

.space {
  height: 100%;
  width: 17.117%;
}
</style>