<template>
  <div class="board-container">
    <div class="content">
      <slot></slot>
    </div>

    <div class="corner l-t"></div>
    <div class="corner r-t"></div>
    <div class="corner l-b"></div>
    <div class="corner r-b"></div>

    <img src="@/assets/img/line-board.png" class="top-line" alt="">
    <img src="@/assets/img/line-board.png" class="bottom-line" alt="">
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.board-container {
  height: 100% !important;
  width: 100% !important;
  position: relative;
  background-color: rgba(1, 7, 93, 0.6) !important;

  .content {
    height: 100%;
    width: 100%;
  }

  .corner {
    position: absolute;
    width: 15px;
    height: 15px;
  }

  .l-t {
    left: 0;
    top: 0;
    border-left: solid 3px #00b8ff;
    border-top: solid 3px #00b8ff;
  }

  .r-t {
    right: 0;
    top: 0;
    border-right: solid 3px #00b8ff;
    border-top: solid 3px #00b8ff;
  }

  .l-b {
    left: 0;
    bottom: 0;
    border-left: solid 3px #00b8ff;
    border-bottom: solid 3px #00b8ff;
  }

  .r-b {
    right: 0;
    bottom: 0;
    border-right: solid 3px #00b8ff;
    border-bottom: solid 3px #00b8ff;
  }

  .top-line {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      width: 100%;
  }

  .bottom-line {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
  }
}
</style>