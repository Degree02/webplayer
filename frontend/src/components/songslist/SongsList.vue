<template>
  <div class="wrapper">
    <h2 class="title">{{ activeAlbum }}</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Size</th>
      </tr>
      <SongItem :songName="song.name" v-for="song in songs" :key="song.name">
      </SongItem>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SongItem from "./SongItem";

export default {
  name: "SongsList",
  components: {
    SongItem,
  },
  computed: {
    ...mapState(["songs", "activeAlbum"]),
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 80px auto;
  margin-bottom: 200px;
  width: 60%;
  background: $dark;
  padding: 3em;
  border-radius: 20px;
  box-shadow: $shadow;

  .title {
    position: relative;
    top: -1em;
  }

  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    margin: auto;
  }
}
</style>
