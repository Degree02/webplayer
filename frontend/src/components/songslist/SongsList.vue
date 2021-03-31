<template>
  <div class="wrapper">
    <h2 class="title">{{ playlistOpen ? "Your Playlist" : activeAlbum }}</h2>
    <button @click="switchPlaylist" class="playlistBtn">
      <font-awesome-icon icon="list"></font-awesome-icon>
    </button>
    <table>
      <tr>
        <th>Name</th>
        <th v-if="playlistOpen">Album</th>
        <th>Size</th>
      </tr>
      <SongItem :songName="song.name" v-for="song in list" :key="song.name">
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
    list() {
      return this.playlistOpen ? this.playlist : this.songs;
    },
    ...mapState(["songs", "activeAlbum", "playlist", "playlistOpen"]),
  },
  methods: {
    switchPlaylist() {
      this.$store.commit("TOGGLE_PLAYLIST");
    },
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
  position: relative;

  .title {
    position: relative;
    top: -1em;
    margin-bottom: 1.5em;
  }

  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    margin: auto;
  }

  .playlistBtn {
    position: absolute;
    top: 20px;
    right: 50px;
    font-size: 2em;
    color: white;
    background: transparent;
    padding: 10px;
    cursor: pointer;
    border: none;
    outline: none;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: $scaling;
    }
  }
}
</style>
