<template>
  <div class="container">
    <div
      class="c"
      v-for="(item, index) in data"
      :key="index"
      :style="{ left: `${(index - idx) * 30.971}%` }"
    >
      <div class="space"></div>
      <div class="proportion-panel">
        <div class="proportion-container">
          <proportion-frequency-chart :tag="index" :data="data[index]"></proportion-frequency-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProportionFrequencyChart from "./ProportionFrequencyChart.vue";
export default {
  components: {
    ProportionFrequencyChart,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      idx: 0,
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
.container {
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
  height: 100%;
  width: 30.971%;
  position: absolute;
  transition: 0.5s;
}

.space {
  width: 22.885%;
}

.proportion-panel {
  height: 100%;
  width: 77.115%;
  //background-color: #070982;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .proportion-container {
    width: 100%;
    height: 100%;
    //background-color: blueviolet;
  }
}
</style>