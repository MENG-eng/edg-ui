<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'HzdlDoc',
  data() {
    return {
      // url: 'http://doc.ruoyi.vip/ruoyi-vue'
    }
  },
  methods: {
    goto() {
      // window.open(this.url)s
      // let page = this.$router.resolve("http://101.200.143.64:8080/doc.html");
      let page = this.$router.resolve("/dev-api/doc.html");
      window.open(page.href, "_blank");
    }
  }
}
</script>
