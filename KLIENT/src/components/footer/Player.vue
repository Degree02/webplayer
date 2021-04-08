<template>
  <div class="player">
    <div class="title">
      <h3>
        {{ activeSong }} <br />
        {{ playingAlbum }}
      </h3>
      <h4 class="time nowrap">
        {{ currentTime }} <span v-if="currentTime && duration">/</span>
        {{ duration }}
      </h4>
    </div>
    <div class="controls">
      <font-awesome-icon
        @click="next(-1)"
        class="icon"
        icon="backward"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="pause"
        v-if="isPlaying"
        class="icon-big"
        icon="pause"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="play"
        v-else
        class="icon-big"
        icon="play"
      ></font-awesome-icon>
      <font-awesome-icon
        @click="next()"
        class="icon"
        icon="forward"
      ></font-awesome-icon>
    </div>
    <div class="volume">
      <font-awesome-icon icon="volume-up"></font-awesome-icon>
      <input
        class="volumebar"
        type="range"
        min="0"
        max="100"
        v-model="volume"
      />
    </div>
    <audio
      @timeupdate="timeUpdate"
      @ended="next(1)"
      ref="audioPlayer"
      :src="songPath"
    ></audio>
    <input
      @mousedown="canUpdate = false"
      @mouseup="canUpdate = true"
      @input="updateTime"
      v-model="timestamp"
      class="timestamp"
      type="range"
      min="0"
      max="100"
      step="0.01"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "../../eventbus";

export default {
  name: "Player",
  data() {
    return {
      volume: 30,
      timestamp: 0,
      currentTime: "",
      duration: "",
      songPath: "",
      canUpdate: true,
      playingAlbum: "",
    };
  },
  mounted() {
    this.$refs.audioPlayer.volume = this.volume / 100;
    EventBus.$on("changeSong", ({ name, album }) => {
      const song = name;
      if (this.activeSong != song) {
        this.playingAlbum = album;
        this.songPath = this.toPath(song);
        this.play();
      } else {
        if (this.$refs.audioPlayer.paused) {
          this.songPath = this.toPath(song);
          this.play();
        } else {
          this.$refs.audioPlayer.pause();
          this.$store.commit("SET_ISPLAYING", false);
        }
      }
      this.$store.commit("SET_SONG", song);
    });
  },
  methods: {
    toPath(song) {
      return `${process.env.VUE_APP_API_URL}albums/${this.playingAlbum}/mp3/${song}`;
    },

    play() {
      if (!this.activeSong) {
        let songs = this.songs;
        if (this.playlistOpen && this.playlist.length > 0) {
          songs = this.playlist;
        }
        this.$store.commit("SET_SONG", songs[0].name);
        this.playingAlbum = this.activeAlbum;
        if (songs[0].album) {
          this.playingAlbum = songs[0].album;
        }
        this.$refs.audioPlayer.src = this.toPath(songs[0].name);
      }

      setTimeout(() => {
        this.$refs.audioPlayer.play();
      });
      this.$store.commit("SET_ISPLAYING", true);
      this.$store.commit("SET_PLAYING_ALBUM", this.playingAlbum);
    },

    pause() {
      this.$refs.audioPlayer.pause();
      this.$store.commit("SET_ISPLAYING", false);
    },

    next(direction = 1) {
      if (!this.activeSong) {
        this.playingAlbum = this.activeAlbum;
        this.play();
        return;
      }

      let songs = this.songs;
      if (this.playlistOpen && this.playlist.length > 0) {
        songs = this.playlist;
      }

      let currentIndex = songs.findIndex(
        (song) => song.name == this.activeSong
      );

      if (currentIndex + direction == songs.length) currentIndex = -1;
      if (currentIndex + direction <= -1) currentIndex = songs.length;
      const nextSong = songs[currentIndex + direction];
      this.playingAlbum = this.activeAlbum;
      if (nextSong.album) {
        this.playingAlbum = nextSong.album;
      }
      this.$refs.audioPlayer.src = this.toPath(nextSong.name);
      setTimeout(() => {
        this.$refs.audioPlayer.play();
      });
      this.$store.commit("SET_SONG", nextSong.name);
      this.$store.commit("SET_PLAYING_ALBUM", this.playingAlbum);
      this.$store.commit("SET_ISPLAYING", true);
    },

    timeUpdate() {
      if (this.$refs.audioPlayer.duration) {
        if (this.canUpdate) {
          this.timestamp =
            (this.$refs.audioPlayer.currentTime /
              this.$refs.audioPlayer.duration) *
            100;
        }
        this.currentTime = new Date(
          Math.round(this.$refs.audioPlayer.currentTime) * 1000
        )
          .toISOString()
          .substr(14, 5);
        this.duration = new Date(
          Math.round(this.$refs.audioPlayer.duration) * 1000
        )
          .toISOString()
          .substr(14, 5);
      }
    },

    updateTime() {
      if (!this.$refs.audioPlayer.duration) {
        this.timestamp = 0;
        return;
      }
      this.$refs.audioPlayer.currentTime =
        0.01 * this.timestamp * this.$refs.audioPlayer.duration;
    },
  },
  computed: {
    ...mapState([
      "isPlaying",
      "activeAlbum",
      "activeSong",
      "songs",
      "playlistOpen",
      "playlist",
    ]),
  },
  watch: {
    volume(value) {
      this.$refs.audioPlayer.volume = value / 100;
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 80px;
  background: $dark;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3em;
  position: relative;
  margin-bottom: 8px;

  .nowrap {
    white-space: nowrap;
  }

  .title,
  .controls,
  .volume {
    width: 35%;
  }

  .title {
    display: flex;

    @media (max-width: 1024px) {
      & {
        font-size: 0.6em;
      }

      .time {
        font-size: 1.5em;
      }
    }

    .time {
      margin-top: 1.5em;
      margin-left: 2em;
    }

    @media (max-width: 768px) {
      & {
        flex-direction: column;

        .time {
          margin-top: 0.5em;
          margin-left: 0.2em;
        }
      }
    }
  }

  .controls {
    width: 15%;
    min-width: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      font-size: 1.5em;
      cursor: pointer;
    }

    .icon-big {
      font-size: 2em;
      cursor: pointer;
    }

    .icon,
    .icon-big {
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: $scaling;
      }
    }
  }

  .volume {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .volumebar,
  .timestamp {
    width: 50%;
    margin-left: 0.5em;
    height: 8px;
    -webkit-appearance: none;
    background: #111;
    outline: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: 12px;
      border-radius: 50%;
      background: $green;
      box-shadow: -2007px 0 0 2000px $green;
    }

    &::-moz-range-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: 12px;
      border-radius: 50%;
      background: $green;
      box-shadow: -2007px 0 0 2000px $green;
    }
  }

  .timestamp {
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 100%;
    margin: 0;
  }
}
</style>
