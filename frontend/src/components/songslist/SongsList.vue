<template>
  <div class="wrapper">
    <h2 class="title">{{ activeAlbum }}</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Size</th>
      </tr>
      <tr v-for="song in songs" :key="song.name">
        <td class="name">{{ song.name }}</td>
        <td>{{ song.size }}</td>
        <td>
          <audio
            volume="0"
            :ref="song.name"
            :src="
              'http://localhost:3000/' +
              'albums/' +
              activeAlbum +
              '/mp3/' +
              song.name
            "
          ></audio>
          <font-awesome-icon
            @click="play(song.name)"
            class="button"
            icon="play"
          />
          <font-awesome-icon
            @click="pause(song.name)"
            class="button"
            icon="pause"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SongsList",
  computed: {
    ...mapState(["songs", "activeAlbum"]),
  },
  methods: {
    play(song) {
      this.$refs[song][0].volume = 0.1;
      this.$refs[song][0].play();
    },
    pause(song) {
      this.$refs[song][0].pause();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 200px auto;
  width: 60%;
  background: $dark;
  padding: 3em;
  border-radius: 20px;
  box-shadow: $shadow;

  .title {
    position: relative;
    top: -1em;
  }

  .button {
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.2);
    }
  }

  table {
    width: 100%;
    text-align: left;

    td,
    th {
      padding: 15px;
      width: 50%;
    }

    td {
      font-size: 1.3em;
      animation: intro 1s forwards;
      opacity: 0;

      &.name {
        font-weight: bold;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @for $i from 1 to 4 {
      td:nth-child(#{$i}) {
        animation-delay: $i * 0.15s;
      }
    }
  }

  @keyframes intro {
    0% {
      opacity: 0;
      transform: translate(-15%);
    }

    100% {
      opacity: 1;
      transform: translate(0);
    }
  }
}
</style>
