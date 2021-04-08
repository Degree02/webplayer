<template>
  <img :src="href" alt="" />
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Background",
  computed: {
    ...mapState(["playingAlbum", "activeAlbum", "playlistOpen"]),
    href() {
      const album = this.playlistOpen ? this.playingAlbum : this.activeAlbum;

      if (!album) return "";
      return `${process.env.VUE_APP_API_URL}albums/${album}/img.jpg`;
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
