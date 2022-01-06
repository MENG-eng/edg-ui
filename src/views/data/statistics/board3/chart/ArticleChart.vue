<template>
  <div class="container">
    <div class="text-name">{{ data.name }}</div>
    <div class="row">
      <div class="num">{{ data.countType }}</div>
      <div class="text">类能源类型</div>
    </div>
    <div class="row">
      <div class="num">{{ data.countArticle }}</div>
      <div class="text">篇文章发布</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between;
  align-items: center;
  background-color: #043399;
  box-sizing: border-box;
  padding: 0 10px;
}

.text-name {
  color: #fff;
  font-size: 0.7em;
  font-weight: 500;
  width: 100px;
  white-space: nowrap;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.num {
  color: #00eaff;
  font-size: 0.7em;
  font-weight: 500;
}

.text {
  color: #fff;
  font-size: 0.7em;
  font-weight: 500;
  white-space: nowrap;
}
</style>