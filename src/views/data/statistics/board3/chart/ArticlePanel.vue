<template>
  <div class="container">
    <div
      class="c"
      v-for="(item, index) in data"
      :key="index"
      :style="{ top: `${(index - idx) * 33.333}%` }"
    >
      <div class="space"></div>
      <div class="article-panel">
        <article-chart :data="data[index]"></article-chart>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleChart from "./ArticleChart.vue";
export default {
  components: {
    ArticleChart,
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
  flex-direction: column;
  position: relative;
}
.c {
  width: 100%;
  height: 33.333%;
  position: absolute;
  transition: 0.5s;
}

.space {
  height: 22.222%;
}

.article-panel {
  height: 77.778%;
  width: 100%;
  //background-color: blueviolet;
}
</style>