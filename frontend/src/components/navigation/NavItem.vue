<template>
  <div @click="handleClick">
    <img :class="{ active }" class="icon" :src="imgHref" />
  </div>
</template>

<script>
export default {
  name: "NavItem",
  props: {
    album: {
      type: String,
      require: true,
    },
  },
  computed: {
    imgHref() {
      return `${process.env.VUE_APP_API_URL}albums/${this.album}/img.jpg`;
    },

    active() {
      return this.$store.state.activeAlbum == this.album;
    },
  },
  methods: {
    handleClick() {
      this.$emit("click", this.album);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s ease-in;
  box-shadow: $shadow;
  border-radius: 5px;

  &.active,
  &:hover {
    transform: $big-scaling;
  }

  &:hover.active {
    cursor: default;
  }
}
</style>
