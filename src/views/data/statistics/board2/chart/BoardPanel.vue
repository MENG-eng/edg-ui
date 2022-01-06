<template>
  <div class="normal">
    <div class="bg">
      <img src="../../../../../assets/img/left-top.png" alt=""  class="frame1" />
      <img src="../../../../../assets/img/right-top.png" alt="" class="frame2" />
      <img src="../../../../../assets/img/left-bottom.png" alt="" class="frame3" />
      <img src="../../../../../assets/img/right-bottom.png" alt="" class="frame4" />
      <img src="../../../../../assets/img/line-board.png" alt=""  class="frame5" />
      <img src="../../../../../assets/img/line-board.png" alt=""  class="frame6" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BoardPanel",
  data() {
    return {};
  },
};
</script>

<style scoped>
.bg {
  height: 100%;
  background: rgba(1, 7, 93, 0.5);
  border: 1px #01075d solid;
  position: relative;
}

.frame1 {
    position: absolute;
    top: 0;
    left: 0;
}

.frame2 {
    position: absolute;
    top: 0;
    right: 0;
}

.frame3 {
    position: absolute;
    bottom: 0;
    left: 0;
}

.frame4 {
    position: absolute;
    bottom: 0;
    right: 0;
}

.frame5 {
    position: absolute;
    top: 0;
    width: 100%;
}

.frame6 {
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>