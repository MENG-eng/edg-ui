<template>
  <el-dropdown trigger="click">
    <div>
      <img src="../../assets/img/introduce.png" alt="" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <div style="width: 320px;margin:8px 16px">
        <div>
          <span class="introduce-title">说明：</span>
          <img style="width: 256px" src="../../assets/img/line.png" alt="" />
        </div>
        <div class="introduce-info">
          {{ introduce }}
        </div>
        <div>
          <span class="introduce-title">步骤流程：</span>
          <img style="width: 222px" src="../../assets/img/line.png" alt="" />
        </div>
        <div class="introduce-info">
          {{ step }}
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Introduce",
  computed: {
    introduce() {
      return this.$store.state.nav.analysis.introduce;
    },
    step() {
      return this.$store.state.nav.analysis.step;
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.introduce-title {
  color: #606266;
  font-size: 16px;
}

.introduce-info {
  width: 95%;
  font-size: 14px;
  font-weight: 400;
  color: #606266;
  padding: 10px 8px;
  text-align: justify;
  text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
}
</style>