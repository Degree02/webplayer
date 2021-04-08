<template>
  <tr :class="{ active: isActive }" class="row" @click="clickSong">
    <td class="name">
      <p class="column">{{ song.name }}</p>
    </td>
    <td v-if="playlistOpen">
      <p class="column">{{ song.album }}</p>
    </td>
    <td>
      <p class="column nowrap">
        {{ song.size }}
      </p>
    </td>
    <td>
      <font-awesome-icon
        v-if="isActive"
        class="icon"
        icon="pause"
      ></font-awesome-icon>
      <font-awesome-icon v-else class="icon" icon="play"></font-awesome-icon>
    </td>
    <td>
      <font-awesome-icon
        v-if="!isInPlaylist && !playlistOpen"
        @click="add"
        class="add-remove-icon"
        icon="plus"
      ></font-awesome-icon>
      <font-awesome-icon
        v-if="playlistOpen"
        @click="remove"
        class="add-remove-icon"
        icon="minus"
      ></font-awesome-icon>
    </td>
  </tr>
</template>

<script>
import { mapState } from "vuex";
import { EventBus } from "../../eventbus";

export default {
  name: "SongItem",
  props: {
    songName: {
      type: String,
      required: true,
    },
  },
  computed: {
    song() {
      return this.playlistOpen
        ? this.$store.getters.songFromPlaylist(this.songName)
        : this.$store.getters.song(this.songName);
    },
    ...mapState([
      "isPlaying",
      "activeSong",
      "playlist",
      "playlistOpen",
      "activeAlbum",
    ]),
    isActive() {
      return this.songName == this.activeSong ? this.isPlaying : false;
    },
    isInPlaylist() {
      return (
        this.playlist.findIndex((song) => song.name == this.song.name) > -1
      );
    },
  },
  methods: {
    clickSong() {
      if (!this.song.album) {
        this.song.album = this.activeAlbum;
      }
      EventBus.$emit("changeSong", this.song);
    },

    add(e) {
      e.stopPropagation();
      this.$store.dispatch("addToPlaylist", {
        album: this.activeAlbum,
        ...this.song,
      });
      EventBus.$emit("toast", `${this.song.name} added to playlist!`);
    },

    remove(e) {
      e.stopPropagation();
      this.$store.dispatch("removeFromPlaylist", {
        album: this.activeAlbum,
        ...this.song,
      });
      EventBus.$emit("toast", `${this.song.name} removed from playlist!`);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 1.2em;
  transition: transform 0.2s ease-in-out;
  margin-left: 1em;

  &:hover {
    transform: $scaling;
  }
}

.add-remove-icon {
  font-size: 1.2em;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: $scaling;
  }

  &:active {
    transition: none;
    transform: none;
  }
}

.row {
  &.active {
    color: $green;
  }

  .column {
    transition: transform 0.3s ease-in-out;

    &.nowrap {
      white-space: nowrap;
    }
  }

  &:hover {
    text-shadow: 2px 2px 2px $primary;

    &.active {
      text-shadow: 2px 2px 2px $green;
    }

    .column {
      transform: translate(15px);
    }
  }

  td {
    cursor: pointer;
    padding: 15px;
    margin: 0;
    position: relative;
    font-size: 1.3em;
    animation: intro 1s forwards;
    opacity: 0;

    &.name {
      font-weight: bold;
    }
  }
}

@for $i from 1 to 5 {
  td:nth-child(#{$i}) {
    animation-delay: $i * 0.15s;
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
</style>
