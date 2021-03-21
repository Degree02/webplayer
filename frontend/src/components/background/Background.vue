<template>
  <img :src="href" alt="" />
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Background",
  computed: {
    ...mapState(["activeAlbum"]),
    href() {
      if (!this.activeAlbum) return "";
      return `${process.env.VUE_APP_API_URL}albums/${this.activeAlbum}/img.jpg`;
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.03;
}
</style>
