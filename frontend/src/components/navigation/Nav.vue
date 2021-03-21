<template>
  <div class="wrapper">
    <div class="inner">
      <NavItem
        @click="chooseAlbum"
        v-for="album in albums"
        :key="album"
        :album="album"
      ></NavItem>
      <h2 class="tag">
        <font-awesome-icon icon="chevron-down" />
      </h2>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavItem from "./NavItem";

export default {
  name: "Nav",
  components: {
    NavItem,
  },
  computed: {
    ...mapState(["albums"]),
  },
  methods: {
    chooseAlbum(album) {
      this.$store.dispatch("fetchData", { action: "NEXT", name: album });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 200px;
  top: 0;
  position: fixed;
  z-index: 100;

  .inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: absolute;
    transform: translateY(-90%);
    transition: transform 0.5s ease-in-out;
    background: $dark;
    border-radius: 0 0 10px 10px;
    box-shadow: $light-shadow;
  }

  &:hover .inner {
    transform: translateY(0);
  }

  .tag {
    text-align: center;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    background: $primary;
    color: $secondary;
    padding: 0.2em 1em;
    border-radius: 0 0 10px 10px;
    box-shadow: $light-shadow;
  }
}
</style>
