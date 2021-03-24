<template>
  <tr :class="{ active: isActive }" class="row" @click="clickSong">
    <td class="name">
      <p class="column">{{ song.name }}</p>
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
      return this.$store.getters.song(this.songName);
    },
    ...mapState(["isPlaying", "activeSong"]),
    isActive() {
      return this.songName == this.activeSong ? this.isPlaying : false;
    },
  },
  methods: {
    clickSong() {
      EventBus.$emit("changeSong", this.songName);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 1.2em;
  transition: transform 0.2s ease-in-out;
  margin-left: 1em;

  .row:hover & {
    transform: $scaling;
  }
}

.row {
  cursor: pointer;

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
}

td {
  padding: 15px;
  margin: 0;
}

td {
  font-size: 1.3em;
  animation: intro 1s forwards;
  opacity: 0;

  &.name {
    font-weight: bold;
  }
}

@for $i from 1 to 4 {
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
